/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface HSLChannel {
  h: number; // -180 to +180
  s: number; // -100 to +100
  l: number; // -100 to +100
}

export interface CurvePoint {
  x: number; // 0 to 255
  y: number; // 0 to 255
}

export interface ToneCurves {
  rgb: CurvePoint[];
  red: CurvePoint[];
  green: CurvePoint[];
  blue: CurvePoint[];
}

export interface PhotoAdjustments {
  // Global Tone Controls
  exposure: number;       // -2.0 to +2.0 (EV)
  contrast: number;       // -100 to +100
  brightness: number;     // -100 to +100
  saturation: number;     // -100 to +100
  vibrance: number;       // -100 to +100
  temperature: number;    // -100 to +100 (Cool blue to Warm amber)
  tint: number;           // -100 to +100 (Green to Magenta)
  highlights: number;     // -100 to +100
  shadows: number;        // -100 to +100
  whites: number;         // -100 to +100
  blacks: number;         // -100 to +100
  clarity: number;        // -100 to +100
  texture: number;        // -100 to +100
  vignette: number;       // -100 to +100

  // Edit Tone Terpisah: Latar Belakang (Background)
  bgTone: {
    enabled: boolean;
    exposure: number;     // -1.5 to +1.5
    contrast: number;     // -50 to +50
    saturation: number;   // -50 to +50
    temperature: number;  // -50 to +50
    blur: number;         // 0 to 30 px (DSLR Bokeh f/1.8 - f/2.8)
    tint: number;         // -50 to +50
  };

  // Edit Tone Terpisah: Subjek (Subject)
  subjectTone: {
    enabled: boolean;
    exposure: number;     // -1.5 to +1.5
    contrast: number;     // -50 to +50
    saturation: number;   // -50 to +50
    skinTone: number;     // -50 to +50 (Skin smoothing & warming)
    sharpness: number;    // 0 to 50
    highlights: number;   // -50 to +50
  };

  // Mask Settings for Subject vs Background
  maskConfig: {
    mode: 'auto-subject' | 'radial' | 'linear';
    feather: number;      // 10 to 80
    centerX: number;      // 0.0 to 1.0 (relative)
    centerY: number;      // 0.0 to 1.0 (relative)
    radiusX: number;      // 0.1 to 0.8
    radiusY: number;      // 0.1 to 0.8
    invert: boolean;
    showMaskOverlay: boolean;
  };

  // Tool Penghilang Noise & Detail
  noiseReduction: number;        // 0 to 100
  detail: number;                // 0 to 100
  sharpen: number;               // 0 to 100
  colorNoiseReduction: number;   // 0 to 100

  // Koreksi Lensa (Khusus Tokina 11-16mm & Nikon D3400)
  lensCorrection: {
    enabled: boolean;
    profile: 'tokina-11-16' | 'nikon-18-55' | 'custom' | 'none';
    distortion: number;          // -50 to +50 (Barrel to Pincushion)
    vignetteCorrection: number;  // 0 to 100
    chromaticAberration: number; // 0 to 100
  };

  // HSL Color Grading (8 Channels)
  hsl: {
    red: HSLChannel;
    orange: HSLChannel;
    yellow: HSLChannel;
    green: HSLChannel;
    cyan: HSLChannel;
    blue: HSLChannel;
    purple: HSLChannel;
    magenta: HSLChannel;
  };

  // Tone Curves
  curves: ToneCurves;

  // Transform / Crop / Orientation
  transform: {
    rotation: number; // 0, 90, 180, 270
    flipH: boolean;
    flipV: boolean;
    cropAspect: 'free' | '1:1' | '4:5' | '9:16' | '16:9' | '3:2';
  };

  // Watermark / Signature
  watermark: {
    enabled: boolean;
    text: string;
    subtext: string;
    position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center';
    showCameraBadge: boolean;
    style: 'signature' | 'badge' | 'minimal' | 'frame';
  };

  // Background Replacement & Retouch
  bgReplace: {
    activeType: 'original' | 'preset-beach' | 'preset-mountain' | 'preset-studio' | 'solid-dark' | 'custom';
    customUrl?: string;
    blurAmount: number; // 0 to 20
  };
}

export interface Preset {
  id: string;
  name: string;
  category: PresetCategory;
  description: string;
  badge?: string;
  isSpecialTokina?: boolean;
  adjustments: Partial<PhotoAdjustments>;
}

export type PresetCategory =
  | 'tokina-nikon'
  | 'wedding'
  | 'landscape'
  | 'outdoor'
  | 'cinematic'
  | 'natural'
  | 'warm'
  | 'cool'
  | 'black-white'
  | 'vintage';

export interface SampleImage {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  cameraInfo: string;
  lensInfo: string;
}

export interface SavedEdit {
  id: string;
  title: string;
  date: string;
  thumbnail: string;
  adjustments: PhotoAdjustments;
  dimensions: { width: number; height: number };
}

export type ActiveToolTab =
  | 'home'
  | 'presets'
  | 'split-tone'
  | 'manual'
  | 'noise'
  | 'background'
  | 'lens'
  | 'hsl'
  | 'curves'
  | 'crop'
  | 'watermark';
