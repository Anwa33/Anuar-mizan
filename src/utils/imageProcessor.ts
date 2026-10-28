/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PhotoAdjustments, HSLChannel, CurvePoint } from '../types';

export interface RenderOptions {
  width?: number;
  height?: number;
  beforeAfterSplit?: number; // 0 to 1, or undefined for full edit
  showBeforeAfterLabels?: boolean;
  showMaskOnly?: boolean;
  showSubjectOnly?: boolean;
  showBgOnly?: boolean;
  replacementBgImage?: HTMLImageElement | null;
}

// Cubic spline evaluation for tone curves
function evaluateSpline(points: CurvePoint[]): Uint8Array {
  const lut = new Uint8Array(256);
  if (!points || points.length === 0) {
    for (let i = 0; i < 256; i++) lut[i] = i;
    return lut;
  }

  const sorted = [...points].sort((a, b) => a.x - b.x);

  for (let x = 0; x < 256; x++) {
    if (x <= sorted[0].x) {
      lut[x] = Math.max(0, Math.min(255, Math.round(sorted[0].y)));
      continue;
    }
    if (x >= sorted[sorted.length - 1].x) {
      lut[x] = Math.max(0, Math.min(255, Math.round(sorted[sorted.length - 1].y)));
      continue;
    }

    // Linear/smooth segment interpolation
    let p0 = sorted[0];
    let p1 = sorted[1];
    for (let i = 0; i < sorted.length - 1; i++) {
      if (x >= sorted[i].x && x <= sorted[i + 1].x) {
        p0 = sorted[i];
        p1 = sorted[i + 1];
        break;
      }
    }

    const t = (x - p0.x) / (p1.x - p0.x || 1);
    // Smoothstep interpolation for curve-like feel
    const smoothT = t * t * (3 - 2 * t);
    const y = p0.y + (p1.y - p0.y) * smoothT;
    lut[x] = Math.max(0, Math.min(255, Math.round(y)));
  }

  return lut;
}

// Convert RGB to HSL
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return [h * 360, s, l];
}

// Convert HSL back to RGB
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h = (h % 360 + 360) % 360;
  h /= 360;
  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// Find closest HSL color channel for selective color adjustment
function getHslChannel(h: number, adj: PhotoAdjustments): HSLChannel {
  if (h >= 345 || h < 15) return adj.hsl.red;
  if (h >= 15 && h < 45) return adj.hsl.orange;
  if (h >= 45 && h < 75) return adj.hsl.yellow;
  if (h >= 75 && h < 165) return adj.hsl.green;
  if (h >= 165 && h < 195) return adj.hsl.cyan;
  if (h >= 195 && h < 255) return adj.hsl.blue;
  if (h >= 255 && h < 285) return adj.hsl.purple;
  return adj.hsl.magenta;
}

/**
 * Main High-Performance Image Processor
 */
export function processImage(
  source: CanvasImageSource,
  targetCanvas: HTMLCanvasElement,
  adj: PhotoAdjustments,
  options: RenderOptions = {}
) {
  const ctx = targetCanvas.getContext('2d');
  if (!ctx) return;

  // Determine dimensions
  const srcW = ('naturalWidth' in source ? (source as HTMLImageElement).naturalWidth : (source as HTMLCanvasElement).width) || 1200;
  const srcH = ('naturalHeight' in source ? (source as HTMLImageElement).naturalHeight : (source as HTMLCanvasElement).height) || 800;

  let width = options.width || targetCanvas.width || srcW;
  let height = options.height || targetCanvas.height || srcH;

  // Preserve aspect ratio if not explicitly specified
  if (!options.width && !options.height) {
    width = srcW;
    height = srcH;
  }

  targetCanvas.width = width;
  targetCanvas.height = height;

  // Transform (rotation / flip)
  ctx.save();
  ctx.clearRect(0, 0, width, height);

  // Apply Crop aspect ratio or rotation if needed
  if (adj.transform.rotation !== 0 || adj.transform.flipH || adj.transform.flipV) {
    ctx.translate(width / 2, height / 2);
    if (adj.transform.rotation !== 0) {
      ctx.rotate((adj.transform.rotation * Math.PI) / 180);
    }
    ctx.scale(adj.transform.flipH ? -1 : 1, adj.transform.flipV ? -1 : 1);
    ctx.drawImage(source, -width / 2, -height / 2, width, height);
  } else {
    ctx.drawImage(source, 0, 0, width, height);
  }
  ctx.restore();

  // If before/after split is requested, keep original pixels
  let originalData: ImageData | null = null;
  if (options.beforeAfterSplit !== undefined && options.beforeAfterSplit > 0) {
    originalData = ctx.getImageData(0, 0, width, height);
  }

  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const totalPixels = width * height;

  // Pre-calculate Look-Up Tables (LUTs) for tone curves
  const rgbLut = evaluateSpline(adj.curves.rgb);
  const rLut = evaluateSpline(adj.curves.red);
  const gLut = evaluateSpline(adj.curves.green);
  const bLut = evaluateSpline(adj.curves.blue);

  // Global tone precomputations
  const globalExposureMult = Math.pow(2, adj.exposure);
  const contrastFactor = (259 * (adj.contrast + 255)) / (255 * (259 - adj.contrast));
  const brightnessOffset = adj.brightness * 1.28;
  const satFactor = 1 + adj.saturation / 100;
  const vibranceFactor = adj.vibrance / 100;
  const tempWarm = adj.temperature; // + adds red/amber, - adds blue
  const tintGreen = adj.tint; // + adds magenta, - adds green

  // Background and Subject separate factors
  const bgExpMult = adj.bgTone.enabled ? Math.pow(2, adj.bgTone.exposure) : 1;
  const bgContrastFactor = adj.bgTone.enabled ? (259 * (adj.bgTone.contrast + 255)) / (255 * (259 - adj.bgTone.contrast)) : 1;
  const bgSatFactor = adj.bgTone.enabled ? 1 + adj.bgTone.saturation / 100 : 1;
  const bgTemp = adj.bgTone.enabled ? adj.bgTone.temperature : 0;

  const subjExpMult = adj.subjectTone.enabled ? Math.pow(2, adj.subjectTone.exposure) : 1;
  const subjContrastFactor = adj.subjectTone.enabled ? (259 * (adj.subjectTone.contrast + 255)) / (255 * (259 - adj.subjectTone.contrast)) : 1;
  const subjSatFactor = adj.subjectTone.enabled ? 1 + adj.subjectTone.saturation / 100 : 1;
  const skinWarmth = adj.subjectTone.enabled ? adj.subjectTone.skinTone : 0;

  // Mask configuration
  const maskCfg = adj.maskConfig;
  const maskCenterX = maskCfg.centerX * width;
  const maskCenterY = maskCfg.centerY * height;
  const maskRadX = Math.max(10, maskCfg.radiusX * width);
  const maskRadY = Math.max(10, maskCfg.radiusY * height);
  const feather = Math.max(5, maskCfg.feather * 2);

  // Tokina 11-16mm Lens Distortion params
  const lensK = adj.lensCorrection.enabled ? (adj.lensCorrection.distortion * 0.00015) : 0;
  const vignetteCorr = adj.lensCorrection.enabled ? (adj.lensCorrection.vignetteCorrection / 100) : 0;

  // Vignette precalculation
  const maxDistSq = (width / 2) * (width / 2) + (height / 2) * (height / 2);
  const vignetteAmt = adj.vignette / 100;

  // Process pixel-by-pixel with optimized loop
  for (let i = 0; i < totalPixels; i++) {
    const idx = i * 4;
    let r = data[idx];
    let g = data[idx + 1];
    let b = data[idx + 2];

    const px = i % width;
    const py = Math.floor(i / width);

    // Calculate Subject vs Background Mask Weight W (0 = pure background, 1 = pure subject)
    let subjectWeight = 0;

    if (maskCfg.mode === 'radial') {
      const dx = (px - maskCenterX) / maskRadX;
      const dy = (py - maskCenterY) / maskRadY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 1) {
        subjectWeight = 1 - Math.pow(dist, feather / 20);
      }
    } else if (maskCfg.mode === 'linear') {
      const normY = py / height;
      subjectWeight = Math.max(0, Math.min(1, (normY - maskCfg.centerY + 0.5)));
    } else {
      // 'auto-subject': intelligent skin + central saliency weighting
      const dx = (px - maskCenterX) / maskRadX;
      const dy = (py - maskCenterY) / maskRadY;
      const centralFalloff = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) * 0.85);

      // Simple skin-tone chrominance check (R > G > B & R - G > 15)
      const isSkinLike = r > 70 && g > 40 && b > 20 && r > g && g > b && (r - g) > 15 && (r - g) < 80;
      const skinBoost = isSkinLike ? 0.45 : 0;

      subjectWeight = Math.max(0, Math.min(1, centralFalloff + skinBoost));
    }

    if (maskCfg.invert) {
      subjectWeight = 1 - subjectWeight;
    }

    // Mask visualization mode
    if (maskCfg.showMaskOverlay) {
      // Tint subject area with magenta/pink indicator
      data[idx] = Math.min(255, r + subjectWeight * 90);
      data[idx + 1] = Math.max(0, g * (1 - subjectWeight * 0.5));
      data[idx + 2] = Math.min(255, b + subjectWeight * 90);
      continue;
    }

    if (options.showMaskOnly) {
      const val = Math.round(subjectWeight * 255);
      data[idx] = val;
      data[idx + 1] = val;
      data[idx + 2] = val;
      continue;
    }

    // Apply Separate Background Tone if pixel has background weight
    let rBg = r;
    let gBg = g;
    let bBg = b;
    if (adj.bgTone.enabled) {
      rBg = rBg * bgExpMult;
      gBg = gBg * bgExpMult;
      bBg = bBg * bgExpMult;

      rBg = bgContrastFactor * (rBg - 128) + 128;
      gBg = bgContrastFactor * (gBg - 128) + 128;
      bBg = bgContrastFactor * (bBg - 128) + 128;

      if (bgTemp !== 0) {
        rBg += bgTemp * 0.6;
        bBg -= bgTemp * 0.6;
      }

      // Saturation for BG
      const lumBg = 0.299 * rBg + 0.587 * gBg + 0.114 * bBg;
      rBg = lumBg + (rBg - lumBg) * bgSatFactor;
      gBg = lumBg + (gBg - lumBg) * bgSatFactor;
      bBg = lumBg + (bBg - lumBg) * bgSatFactor;
    }

    // Apply Separate Subject Tone if pixel has subject weight
    let rSubj = r;
    let gSubj = g;
    let bSubj = b;
    if (adj.subjectTone.enabled) {
      rSubj = rSubj * subjExpMult;
      gSubj = gSubj * subjExpMult;
      bSubj = bSubj * subjExpMult;

      rSubj = subjContrastFactor * (rSubj - 128) + 128;
      gSubj = subjContrastFactor * (gSubj - 128) + 128;
      bSubj = subjContrastFactor * (bSubj - 128) + 128;

      if (skinWarmth !== 0) {
        // Boost warm skin tones
        rSubj += skinWarmth * 0.5;
        gSubj += skinWarmth * 0.2;
        bSubj -= skinWarmth * 0.3;
      }

      // Saturation for Subject
      const lumSubj = 0.299 * rSubj + 0.587 * gSubj + 0.114 * bSubj;
      rSubj = lumSubj + (rSubj - lumSubj) * subjSatFactor;
      gSubj = lumSubj + (gSubj - lumSubj) * subjSatFactor;
      bSubj = lumSubj + (bSubj - lumSubj) * subjSatFactor;
    }

    // Blend Background & Subject layers
    if (options.showSubjectOnly) {
      r = rSubj * subjectWeight;
      g = gSubj * subjectWeight;
      b = bSubj * subjectWeight;
    } else if (options.showBgOnly) {
      const bgW = 1 - subjectWeight;
      r = rBg * bgW;
      g = gBg * bgW;
      b = bBg * bgW;
    } else {
      r = rBg * (1 - subjectWeight) + rSubj * subjectWeight;
      g = gBg * (1 - subjectWeight) + gSubj * subjectWeight;
      b = bBg * (1 - subjectWeight) + bSubj * subjectWeight;
    }

    // Apply Global Exposure
    r *= globalExposureMult;
    g *= globalExposureMult;
    b *= globalExposureMult;

    // Apply Global Contrast & Brightness
    r = contrastFactor * (r - 128) + 128 + brightnessOffset;
    g = contrastFactor * (g - 128) + 128 + brightnessOffset;
    b = contrastFactor * (b - 128) + 128 + brightnessOffset;

    // Apply Temperature & Tint
    if (tempWarm !== 0) {
      r += tempWarm * 0.65;
      b -= tempWarm * 0.65;
    }
    if (tintGreen !== 0) {
      g -= tintGreen * 0.5;
      r += tintGreen * 0.25;
      b += tintGreen * 0.25;
    }

    // Highlights & Shadows
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    if (adj.highlights !== 0 && lum > 128) {
      const hFactor = ((lum - 128) / 127) * (adj.highlights / 100);
      r += r * hFactor * 0.5;
      g += g * hFactor * 0.5;
      b += b * hFactor * 0.5;
    }
    if (adj.shadows !== 0 && lum < 128) {
      const sFactor = ((128 - lum) / 128) * (adj.shadows / 100);
      r += (255 - r) * sFactor * 0.5;
      g += (255 - g) * sFactor * 0.5;
      b += (255 - b) * sFactor * 0.5;
    }

    // Saturation & Vibrance
    if (adj.saturation !== 0 || adj.vibrance !== 0) {
      const currentLum = 0.299 * r + 0.587 * g + 0.114 * b;
      let effSat = satFactor;
      if (adj.vibrance !== 0) {
        const maxVal = Math.max(r, g, b);
        const minVal = Math.min(r, g, b);
        const satAmt = (maxVal - minVal) / (maxVal || 1);
        effSat += (1 - satAmt) * vibranceFactor;
      }
      r = currentLum + (r - currentLum) * effSat;
      g = currentLum + (g - currentLum) * effSat;
      b = currentLum + (b - currentLum) * effSat;
    }

    // Vignette Effect & Lens Vignette Correction
    const dX = px - width / 2;
    const dY = py - height / 2;
    const distSq = dX * dX + dY * dY;
    const normDist = distSq / maxDistSq;

    // Lens vignette correction lifts corners; artistic vignette darkens corners
    const netVignette = -vignetteAmt + (vignetteCorr * 0.5);
    if (netVignette !== 0) {
      const vigFactor = 1 - (normDist * netVignette);
      r *= vigFactor;
      g *= vigFactor;
      b *= vigFactor;
    }

    // Tone Curves lookup
    const clampR = Math.max(0, Math.min(255, Math.round(r)));
    const clampG = Math.max(0, Math.min(255, Math.round(g)));
    const clampB = Math.max(0, Math.min(255, Math.round(b)));

    r = rgbLut[rLut[clampR]];
    g = rgbLut[gLut[clampG]];
    b = rgbLut[bLut[clampB]];

    // Clamp final values
    data[idx] = Math.max(0, Math.min(255, Math.round(r)));
    data[idx + 1] = Math.max(0, Math.min(255, Math.round(g)));
    data[idx + 2] = Math.max(0, Math.min(255, Math.round(b)));
  }

  // Apply Sharpen / Clarity / Noise filter pass if values > 0
  if (adj.sharpen > 0 || adj.noiseReduction > 0 || adj.clarity > 0) {
    applyConvolutionFilters(data, width, height, adj);
  }

  // Put filtered image back to canvas
  ctx.putImageData(imageData, 0, 0);

  // If Lens Distortion Correction is active (Tokina 11-16mm barrel fix)
  if (adj.lensCorrection.enabled && adj.lensCorrection.distortion !== 0) {
    applyLensDistortionWarp(ctx, width, height, adj.lensCorrection.distortion);
  }

  // Before / After split screen rendering
  if (options.beforeAfterSplit !== undefined && originalData) {
    renderBeforeAfterSplit(ctx, originalData, width, height, options.beforeAfterSplit, options.showBeforeAfterLabels !== false);
  }

  // Watermark / Signature rendering
  if (adj.watermark.enabled) {
    drawWatermark(ctx, width, height, adj.watermark);
  }
}

/**
 * Sharpen & Denoise filter pass using 3x3 convolution
 */
function applyConvolutionFilters(data: Uint8ClampedArray, w: number, h: number, adj: PhotoAdjustments) {
  const sharpenAmount = (adj.sharpen / 100) * 0.8 + (adj.clarity / 100) * 0.3;
  const denoiseAmount = adj.noiseReduction / 100;

  if (sharpenAmount <= 0.05 && denoiseAmount <= 0.05) return;

  const copy = new Uint8ClampedArray(data);

  // Unsharp mask / edge enhancement or mild smoothing
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const idx = (y * w + x) * 4;

      for (let c = 0; c < 3; c++) {
        const center = copy[idx + c];
        const top = copy[((y - 1) * w + x) * 4 + c];
        const bottom = copy[((y + 1) * w + x) * 4 + c];
        const left = copy[(y * w + (x - 1)) * 4 + c];
        const right = copy[(y * w + (x + 1)) * 4 + c];

        const avgSurround = (top + bottom + left + right) * 0.25;

        // Denoise smooths towards neighbor average
        let val = center;
        if (denoiseAmount > 0) {
          val = val * (1 - denoiseAmount * 0.5) + avgSurround * (denoiseAmount * 0.5);
        }

        // Sharpen enhances difference from neighbor average
        if (sharpenAmount > 0) {
          const diff = center - avgSurround;
          val += diff * sharpenAmount * 1.5;
        }

        data[idx + c] = Math.max(0, Math.min(255, Math.round(val)));
      }
    }
  }
}

/**
 * Tokina 11-16mm Lens Distortion Correction (Straighten barrel distortion)
 */
function applyLensDistortionWarp(ctx: CanvasRenderingContext2D, w: number, h: number, distortionAmt: number) {
  // Positive distortion value corrects barrel distortion (pulls edges inward/straightens)
  const strength = (distortionAmt / 100) * 0.12;
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = w;
  tempCanvas.height = h;
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) return;

  tempCtx.drawImage(ctx.canvas, 0, 0);
  const srcData = tempCtx.getImageData(0, 0, w, h);
  const dstData = ctx.createImageData(w, h);

  const cx = w / 2;
  const cy = h / 2;
  const maxR = Math.sqrt(cx * cx + cy * cy);

  const srcPixels = srcData.data;
  const dstPixels = dstData.data;

  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const dx = (x - cx) / maxR;
      const dy = (y - cy) / maxR;
      const r = Math.sqrt(dx * dx + dy * dy);

      // Radial correction polynomial: r' = r * (1 + k * r^2)
      const factor = 1 + strength * (r * r);
      const srcX = Math.round(cx + dx * factor * maxR);
      const srcY = Math.round(cy + dy * factor * maxR);

      const dstIdx = (y * w + x) * 4;

      if (srcX >= 0 && srcX < w && srcY >= 0 && srcY < h) {
        const srcIdx = (srcY * w + srcX) * 4;
        dstPixels[dstIdx] = srcPixels[srcIdx];
        dstPixels[dstIdx + 1] = srcPixels[srcIdx + 1];
        dstPixels[dstIdx + 2] = srcPixels[srcIdx + 2];
        dstPixels[dstIdx + 3] = srcPixels[srcIdx + 3];
      } else {
        // Edge clamping
        dstPixels[dstIdx] = 10;
        dstPixels[dstIdx + 1] = 15;
        dstPixels[dstIdx + 2] = 25;
        dstPixels[dstIdx + 3] = 255;
      }
    }
  }

  ctx.putImageData(dstData, 0, 0);
}

/**
 * Render interactive Before / After split comparison line & labels
 */
function renderBeforeAfterSplit(
  ctx: CanvasRenderingContext2D,
  originalData: ImageData,
  w: number,
  h: number,
  splitRatio: number,
  showLabels: boolean
) {
  const splitX = Math.round(w * splitRatio);

  // Draw original image on the left side of splitX
  const editedData = ctx.getImageData(0, 0, w, h);
  const currentPixels = editedData.data;
  const origPixels = originalData.data;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < splitX; x++) {
      const idx = (y * w + x) * 4;
      currentPixels[idx] = origPixels[idx];
      currentPixels[idx + 1] = origPixels[idx + 1];
      currentPixels[idx + 2] = origPixels[idx + 2];
      currentPixels[idx + 3] = origPixels[idx + 3];
    }
  }
  ctx.putImageData(editedData, 0, 0);

  // Draw dividing neon line
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(splitX, 0);
  ctx.lineTo(splitX, h);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 3;
  ctx.shadowColor = 'rgba(56, 189, 248, 0.8)';
  ctx.shadowBlur = 8;
  ctx.stroke();

  // Draw center draggable handle circle
  const handleY = h / 2;
  ctx.beginPath();
  ctx.arc(splitX, handleY, 16, 0, Math.PI * 2);
  ctx.fillStyle = '#0ea5e9';
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Draw arrows inside handle
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 12px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowBlur = 0;
  ctx.fillText('◄ ►', splitX, handleY);

  // Draw "Sebelum" (Before) & "Sesudah" (After) badges like in the poster
  if (showLabels) {
    const badgeW = 85;
    const badgeH = 26;
    const badgeY = h - 45;

    // Sebelum badge on left
    const leftX = Math.max(15, splitX - badgeW - 15);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(leftX, badgeY, badgeW, badgeH, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = '600 12px Plus Jakarta Sans, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Sebelum', leftX + badgeW / 2, badgeY + badgeH / 2);

    // Sesudah badge on right
    const rightX = Math.min(w - badgeW - 15, splitX + 15);
    ctx.fillStyle = 'rgba(14, 165, 233, 0.9)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.beginPath();
    ctx.roundRect(rightX, badgeY, badgeW, badgeH, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.fillText('Sesudah', rightX + badgeW / 2, badgeY + badgeH / 2);
  }

  ctx.restore();
}

/**
 * Watermark / Signature Drawing
 */
function drawWatermark(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  wm: PhotoAdjustments['watermark']
) {
  ctx.save();

  const margin = Math.max(20, Math.round(w * 0.03));
  let posX = w - margin;
  let posY = h - margin;
  let align: CanvasTextAlign = 'right';

  if (wm.position === 'bottom-left') {
    posX = margin;
    posY = h - margin;
    align = 'left';
  } else if (wm.position === 'top-right') {
    posX = w - margin;
    posY = margin + 30;
    align = 'right';
  } else if (wm.position === 'top-left') {
    posX = margin;
    posY = margin + 30;
    align = 'left';
  } else if (wm.position === 'center') {
    posX = w / 2;
    posY = h / 2;
    align = 'center';
  }

  ctx.textAlign = align;

  // Draw stylish camera photographer signature
  ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
  ctx.shadowBlur = 6;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;

  // Primary photographer name
  const fontSize = Math.max(16, Math.round(w * 0.024));
  ctx.font = `italic 700 ${fontSize}px "Cabinet Grotesk", "Plus Jakarta Sans", cursive, sans-serif`;
  ctx.fillStyle = '#ffffff';
  ctx.fillText(wm.text || 'Anwar Photography', posX, posY - (fontSize * 0.8));

  // Subtitle / Camera Lens info
  if (wm.showCameraBadge && wm.subtext) {
    const subFontSize = Math.max(10, Math.round(fontSize * 0.55));
    ctx.font = `500 ${subFontSize}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(wm.subtext, posX, posY);
  }

  ctx.restore();
}

/**
 * Intelligent Auto Enhance Algorithm
 */
export function calculateAutoEnhance(imageData: ImageData): Partial<PhotoAdjustments> {
  const data = imageData.data;
  let totalLum = 0;
  let minLum = 255;
  let maxLum = 0;
  const count = data.length / 4;

  // Sample every 10th pixel for performance
  for (let i = 0; i < data.length; i += 40) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    totalLum += lum;
    if (lum < minLum) minLum = lum;
    if (lum > maxLum) maxLum = lum;
  }

  const sampleCount = count / 10;
  const avgLum = totalLum / sampleCount;

  // Auto exposure and contrast compensation
  let exposureAdj = 0;
  if (avgLum < 100) {
    exposureAdj = 0.25; // Dark photo boost
  } else if (avgLum > 160) {
    exposureAdj = -0.15; // Bright photo tame
  } else {
    exposureAdj = 0.1;
  }

  const dynamicRange = maxLum - minLum;
  const contrastAdj = dynamicRange < 180 ? 20 : 12;

  return {
    exposure: exposureAdj,
    contrast: contrastAdj,
    vibrance: 18,
    saturation: 10,
    highlights: -18,
    shadows: 22,
    clarity: 15,
    texture: 10,
    sharpen: 30,
    detail: 25,
    lensCorrection: {
      enabled: true,
      profile: 'tokina-11-16',
      distortion: 18,
      vignetteCorrection: 25,
      chromaticAberration: 30,
    },
    bgTone: {
      enabled: true,
      exposure: 0.1,
      contrast: 15,
      saturation: 12,
      temperature: -5,
      blur: 0,
      tint: 0,
    },
    subjectTone: {
      enabled: true,
      exposure: 0.3,
      contrast: 12,
      saturation: 10,
      skinTone: 15,
      sharpness: 25,
      highlights: 5,
    },
  };
}
