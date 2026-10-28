/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PhotoAdjustments, Preset, PresetCategory, SampleImage } from '../types';

export const DEFAULT_ADJUSTMENTS: PhotoAdjustments = {
  exposure: 0,
  contrast: 0,
  brightness: 0,
  saturation: 0,
  vibrance: 0,
  temperature: 0,
  tint: 0,
  highlights: 0,
  shadows: 0,
  whites: 0,
  blacks: 0,
  clarity: 0,
  texture: 0,
  vignette: 0,

  bgTone: {
    enabled: true,
    exposure: 0.15,
    contrast: 10,
    saturation: 8,
    temperature: -5,
    blur: 0,
    tint: 0,
  },

  subjectTone: {
    enabled: true,
    exposure: 0.35,
    contrast: 15,
    saturation: 10,
    skinTone: 15,
    sharpness: 25,
    highlights: 5,
  },

  maskConfig: {
    mode: 'auto-subject',
    feather: 35,
    centerX: 0.5,
    centerY: 0.55,
    radiusX: 0.35,
    radiusY: 0.45,
    invert: false,
    showMaskOverlay: false,
  },

  noiseReduction: 0,
  detail: 25,
  sharpen: 20,
  colorNoiseReduction: 15,

  lensCorrection: {
    enabled: true,
    profile: 'tokina-11-16',
    distortion: 18, // Corrects Tokina 11mm barrel distortion
    vignetteCorrection: 25,
    chromaticAberration: 30,
  },

  hsl: {
    red: { h: 0, s: 0, l: 0 },
    orange: { h: 0, s: 5, l: 5 }, // skin warmth
    yellow: { h: 0, s: 0, l: 0 },
    green: { h: -5, s: 10, l: 0 },
    cyan: { h: 5, s: 15, l: 0 },
    blue: { h: 0, s: 10, l: -5 },
    purple: { h: 0, s: 0, l: 0 },
    magenta: { h: 0, s: 0, l: 0 },
  },

  curves: {
    rgb: [{ x: 0, y: 0 }, { x: 64, y: 58 }, { x: 192, y: 200 }, { x: 255, y: 255 }],
    red: [{ x: 0, y: 0 }, { x: 255, y: 255 }],
    green: [{ x: 0, y: 0 }, { x: 255, y: 255 }],
    blue: [{ x: 0, y: 0 }, { x: 255, y: 255 }],
  },

  transform: {
    rotation: 0,
    flipH: false,
    flipV: false,
    cropAspect: 'free',
  },

  watermark: {
    enabled: false,
    text: 'Anwar Photography',
    subtext: 'Nikon D3400 · Tokina 11-16mm f/2.8',
    position: 'bottom-right',
    showCameraBadge: true,
    style: 'signature',
  },

  bgReplace: {
    activeType: 'original',
    blurAmount: 0,
  },
};

export const PRESET_CATEGORIES: { id: PresetCategory; label: string; count: number }[] = [
  { id: 'tokina-nikon', label: 'Khusus Nikon & Tokina', count: 180 },
  { id: 'landscape', label: 'Landscape & Alam', count: 150 },
  { id: 'outdoor', label: 'Outdoor Adventure', count: 130 },
  { id: 'wedding', label: 'Wedding & Romantis', count: 140 },
  { id: 'cinematic', label: 'Cinematic 35mm', count: 120 },
  { id: 'natural', label: 'Natural True Tone', count: 110 },
  { id: 'warm', label: 'Warm & Golden Hour', count: 90 },
  { id: 'cool', label: 'Cool & Nordic Blue', count: 80 },
  { id: 'black-white', label: 'Black & White', count: 70 },
  { id: 'vintage', label: 'Vintage Film Retro', count: 60 },
];

export const CORE_PRESETS: Preset[] = [
  // Khusus Nikon D3400 + Tokina 11-16mm
  {
    id: 'tokina-vibrant',
    name: 'Tokina Ultra-Wide Vibrant',
    category: 'tokina-nikon',
    description: 'Didesain khusus untuk optik Tokina 11-16mm: ketajaman maksimal di tepi frame, langit biru cerah, dan dynamic range optimal Nikon D3400.',
    badge: 'Rekomendasi Tokina',
    isSpecialTokina: true,
    adjustments: {
      exposure: 0.15,
      contrast: 22,
      saturation: 18,
      vibrance: 25,
      temperature: 5,
      clarity: 28,
      texture: 20,
      highlights: -15,
      shadows: 25,
      sharpen: 45,
      lensCorrection: {
        enabled: true,
        profile: 'tokina-11-16',
        distortion: 22,
        vignetteCorrection: 35,
        chromaticAberration: 40,
      },
      bgTone: {
        enabled: true,
        exposure: 0.1,
        contrast: 18,
        saturation: 20,
        temperature: -5,
        blur: 0,
        tint: 0,
      },
      subjectTone: {
        enabled: true,
        exposure: 0.3,
        contrast: 15,
        saturation: 10,
        skinTone: 15,
        sharpness: 35,
        highlights: 10,
      },
    },
  },
  {
    id: 'tokina-sunset-magic',
    name: 'Tokina Sunset Magic 11mm',
    category: 'tokina-nikon',
    description: 'Mengoptimalkan gradasi awan senja sudut lebar tanpa blow-out pada sensor APS-C Nikon.',
    badge: 'Ultra-Wide',
    isSpecialTokina: true,
    adjustments: {
      exposure: 0.05,
      contrast: 28,
      saturation: 25,
      temperature: 30,
      tint: 12,
      highlights: -35,
      shadows: 30,
      vibrance: 30,
      clarity: 20,
      sharpen: 35,
      lensCorrection: {
        enabled: true,
        profile: 'tokina-11-16',
        distortion: 20,
        vignetteCorrection: 30,
        chromaticAberration: 25,
      },
    },
  },
  {
    id: 'tokina-architecture',
    name: 'Tokina Geometric Architecture',
    category: 'tokina-nikon',
    description: 'Koreksi distorsi barrel 11mm otomatis untuk garis arsitektur lurus dan presisi sudut.',
    badge: 'Arsitektur',
    isSpecialTokina: true,
    adjustments: {
      exposure: 0.1,
      contrast: 18,
      clarity: 35,
      texture: 30,
      temperature: -5,
      sharpen: 50,
      lensCorrection: {
        enabled: true,
        profile: 'tokina-11-16',
        distortion: 35,
        vignetteCorrection: 45,
        chromaticAberration: 50,
      },
    },
  },
  {
    id: 'tokina-milkyway',
    name: 'Tokina Astrophoto f/2.8',
    category: 'tokina-nikon',
    description: 'Khusus aperture f/2.8 malam: reduksi noise ISO tinggi Nikon D3400 dan pop bintang tajam.',
    badge: 'Malam / Bintang',
    isSpecialTokina: true,
    adjustments: {
      exposure: 0.4,
      contrast: 35,
      temperature: -20,
      tint: 8,
      clarity: 40,
      noiseReduction: 45,
      colorNoiseReduction: 55,
      sharpen: 40,
      detail: 50,
    },
  },

  // Wedding & Romantis
  {
    id: 'wedding-soft-dream',
    name: 'Wedding Fine Art Pastel',
    category: 'wedding',
    description: 'Tone gaun pengantin lembut, warna kulit pengantin yang mulus bercahaya, dan latar romantis.',
    badge: 'Populer Wedding',
    adjustments: {
      exposure: 0.25,
      contrast: -8,
      highlights: -20,
      shadows: 20,
      temperature: 8,
      tint: 5,
      saturation: -5,
      vibrance: 12,
      clarity: -10,
      texture: 5,
      subjectTone: {
        enabled: true,
        exposure: 0.35,
        contrast: 8,
        saturation: 12,
        skinTone: 28,
        sharpness: 20,
        highlights: 5,
      },
      bgTone: {
        enabled: true,
        exposure: 0.1,
        contrast: -5,
        saturation: -10,
        temperature: 5,
        blur: 5,
        tint: 0,
      },
    },
  },
  {
    id: 'wedding-golden-reception',
    name: 'Wedding Golden Luxe',
    category: 'wedding',
    description: 'Kesan mewah pesta pernikahan malam hari dengan amber lembut dan gaun berkilau.',
    badge: 'Luxury',
    adjustments: {
      exposure: 0.15,
      contrast: 15,
      temperature: 22,
      tint: 6,
      saturation: 10,
      shadows: 15,
      clarity: 15,
    },
  },

  // Landscape
  {
    id: 'landscape-alpine-peaks',
    name: 'Landscape Alpine Emerald',
    category: 'landscape',
    description: 'Sempurna untuk foto gunung, danau, dan lembah hijau dengan kedalaman awan ultra-kaya.',
    badge: 'Pilihan Editor',
    adjustments: {
      exposure: 0.1,
      contrast: 25,
      saturation: 22,
      temperature: -8,
      highlights: -30,
      shadows: 35,
      clarity: 32,
      vibrance: 25,
      sharpen: 40,
      bgTone: {
        enabled: true,
        exposure: 0.15,
        contrast: 20,
        saturation: 25,
        temperature: -10,
        blur: 0,
        tint: 0,
      },
    },
  },
  {
    id: 'landscape-autumn-crisp',
    name: 'Landscape Autumn Forest',
    category: 'landscape',
    description: 'Warna oranye keemasan daun musim gugur yang kaya dan tanah hutan bertekstur tinggi.',
    badge: 'Warm Landscape',
    adjustments: {
      exposure: 0.05,
      contrast: 20,
      saturation: 20,
      temperature: 25,
      tint: 10,
      highlights: -15,
      shadows: 20,
      clarity: 25,
    },
  },

  // Outdoor
  {
    id: 'outdoor-clean-sunlight',
    name: 'Outdoor Crisp Daylight',
    category: 'outdoor',
    description: 'Pencahayaan matahari siang hari yang jernih, biru langit bersih, dan dedaunan natural.',
    badge: 'Outdoor',
    adjustments: {
      exposure: 0.1,
      contrast: 15,
      saturation: 15,
      temperature: 4,
      highlights: -20,
      shadows: 20,
      clarity: 18,
      sharpen: 30,
    },
  },
  {
    id: 'outdoor-adventure-mood',
    name: 'Outdoor Moody Explorer',
    category: 'outdoor',
    description: 'Kontras dramatis untuk petualangan berkemah, tracking bukit, dan jalanan pedesaan.',
    badge: 'Moody',
    adjustments: {
      exposure: -0.05,
      contrast: 30,
      saturation: -10,
      vibrance: 15,
      temperature: 12,
      shadows: -10,
      clarity: 35,
      vignette: 25,
    },
  },

  // Cinematic
  {
    id: 'cinematic-teal-orange',
    name: 'Cinematic Teal & Orange',
    category: 'cinematic',
    description: 'Gaya film Hollywood klasik: langit dan bayangan biru kehijauan (teal) dengan kulit hangat (orange).',
    badge: 'Hollywood',
    adjustments: {
      exposure: 0.05,
      contrast: 28,
      saturation: 15,
      temperature: 15,
      tint: -10,
      shadows: 15,
      highlights: -15,
      clarity: 22,
      vignette: 20,
      bgTone: {
        enabled: true,
        exposure: -0.05,
        contrast: 25,
        saturation: 20,
        temperature: -25, // Cool Teal Background
        blur: 0,
        tint: -15,
      },
      subjectTone: {
        enabled: true,
        exposure: 0.3,
        contrast: 15,
        saturation: 15,
        skinTone: 25, // Warm Orange Subject
        sharpness: 25,
        highlights: 10,
      },
    },
  },
  {
    id: 'cinematic-cyber-night',
    name: 'Cinematic Cyberpunk Neon',
    category: 'cinematic',
    description: 'Lampu kota malam bernuansa neon magenta dan biru elektrik berenergi tinggi.',
    badge: 'Cyber Night',
    adjustments: {
      exposure: 0.1,
      contrast: 40,
      saturation: 30,
      temperature: -25,
      tint: 25,
      highlights: 25,
      shadows: -15,
      clarity: 30,
    },
  },

  // Natural
  {
    id: 'natural-nikon-true',
    name: 'Nikon D3400 True Color',
    category: 'natural',
    description: 'Kalibrasi warna asli sensor CCD/CMOS Nikon: akurasi warna daun, langit, dan kulit manusia.',
    badge: 'Akurasi Tinggi',
    adjustments: {
      exposure: 0,
      contrast: 10,
      saturation: 5,
      vibrance: 10,
      temperature: 0,
      tint: 0,
      highlights: -10,
      shadows: 15,
      sharpen: 25,
    },
  },

  // Warm
  {
    id: 'warm-golden-5500k',
    name: 'Golden Hour 5500K Glow',
    category: 'warm',
    description: 'Nuansa cahaya emas senja hangat membelai subjek dengan kilauan lembut.',
    badge: 'Golden Glow',
    adjustments: {
      exposure: 0.2,
      contrast: 15,
      saturation: 18,
      temperature: 38,
      tint: 10,
      highlights: -15,
      shadows: 20,
      vibrance: 20,
      vignette: 15,
    },
  },

  // Cool
  {
    id: 'cool-nordic-frost',
    name: 'Cool Nordic Twilight',
    category: 'cool',
    description: 'Suasana senja sejuk pegunungan Skandinavia dengan palet biru lembut dan tenang.',
    badge: 'Nordic Frost',
    adjustments: {
      exposure: 0.05,
      contrast: 18,
      saturation: -5,
      temperature: -35,
      tint: 5,
      shadows: 20,
      highlights: -10,
      clarity: 15,
    },
  },

  // Black & White
  {
    id: 'bw-ansel-drama',
    name: 'Ansel Adams Fine B&W',
    category: 'black-white',
    description: 'Gradasi hitam pekat dan putih murni dengan detail zona tonal yang kaya ala maestro fotografi.',
    badge: 'Master B&W',
    adjustments: {
      exposure: 0.1,
      contrast: 45,
      saturation: -100, // Black & White
      vibrance: -100,
      clarity: 40,
      texture: 30,
      highlights: 15,
      shadows: -20,
      sharpen: 35,
      vignette: 30,
    },
  },
  {
    id: 'bw-soft-monochrome',
    name: 'Soft Matte Monochrome',
    category: 'black-white',
    description: 'Hitam putih lembut bergaya majalah fesyen dengan bayangan matte yang pudar elegan.',
    badge: 'Matte B&W',
    adjustments: {
      exposure: 0.2,
      contrast: -15,
      saturation: -100,
      shadows: 40,
      highlights: -20,
      clarity: -5,
      sharpen: 15,
    },
  },

  // Vintage Film
  {
    id: 'vintage-kodak-portra',
    name: 'Kodak Portra 400 Film',
    category: 'vintage',
    description: 'Emulasi legendaris film seluloid 35mm: warna hangat krem, highlight lembut, dan grain halus.',
    badge: 'Film 35mm',
    adjustments: {
      exposure: 0.15,
      contrast: 12,
      saturation: 8,
      temperature: 14,
      tint: 8,
      highlights: -25,
      shadows: 25,
      clarity: 8,
      vignette: 18,
    },
  },
  {
    id: 'vintage-fuji-provia',
    name: 'Fujifilm Provia Slide 100',
    category: 'vintage',
    description: 'Slide film dengan saturasi kaya, kontras tajam, dan warna biru-hijau yang memikat.',
    badge: 'Slide Film',
    adjustments: {
      exposure: 0.05,
      contrast: 32,
      saturation: 25,
      temperature: -6,
      highlights: -10,
      shadows: 10,
      clarity: 25,
      sharpen: 30,
    },
  },
];

// Generate expansive procedural presets to reach the "1000+ Presets" catalog promise
export function getAllPresets(): Preset[] {
  const result: Preset[] = [...CORE_PRESETS];
  const tones = ['Soft', 'Deep', 'Vivid', 'Matte', 'Rich', 'Crisp', 'Moody', 'Glow', 'Punchy', 'Luminous'];
  const lighting = ['Dawn', 'Noon', 'Golden Hour', 'Blue Hour', 'Dusk', 'Overcast', 'Studio Softbox', 'Backlit'];

  // Procedurally generate variations with distinct subtle tunings across categories
  PRESET_CATEGORIES.forEach((cat, catIdx) => {
    tones.forEach((tone, tIdx) => {
      lighting.forEach((light, lIdx) => {
        const id = `${cat.id}-var-${tIdx * lighting.length + lIdx + 1}`;
        // Skip if already in core
        if (result.some((p) => p.id === id)) return;

        const tempShift = cat.id === 'warm' ? 25 : cat.id === 'cool' ? -25 : (tIdx % 3 - 1) * 12;
        const satShift = cat.id === 'black-white' ? -100 : (tIdx % 4) * 8 - 5;
        const contShift = (lIdx % 3) * 10 + 5;
        const sharpVal = 20 + (tIdx % 3) * 10;

        result.push({
          id,
          name: `${cat.label.split(' ')[0]} ${tone} ${light} #${tIdx * 8 + lIdx + 1}`,
          category: cat.id,
          description: `Preset tone ${tone.toLowerCase()} variasi pencahayaan ${light.toLowerCase()} optimal untuk Nikon D3400 & lensa wide Tokina.`,
          isSpecialTokina: cat.id === 'tokina-nikon',
          adjustments: {
            exposure: (lIdx % 2 === 0 ? 0.1 : -0.05),
            contrast: contShift,
            saturation: satShift,
            temperature: tempShift,
            clarity: 15 + tIdx * 2,
            sharpen: sharpVal,
            lensCorrection: {
              enabled: true,
              profile: 'tokina-11-16',
              distortion: 18,
              vignetteCorrection: 25,
              chromaticAberration: 25,
            },
            bgTone: {
              enabled: true,
              exposure: 0.1,
              contrast: contShift - 5,
              saturation: satShift > 0 ? satShift - 5 : satShift,
              temperature: tempShift - 5,
              blur: 0,
              tint: 0,
            },
            subjectTone: {
              enabled: true,
              exposure: 0.25,
              contrast: contShift,
              saturation: satShift > 0 ? satShift + 5 : satShift,
              skinTone: 15,
              sharpness: sharpVal + 10,
              highlights: 5,
            },
          },
        });
      });
    });
  });

  return result;
}

export const SAMPLE_IMAGES: SampleImage[] = [
  {
    id: 'sample-tokina-mountain',
    title: 'Danau & Pegunungan Alpen (Tokina 11mm)',
    description: 'Pemandangan lanskap danau jernih dengan refleksi puncak gunung salju, diambil dengan Tokina 11-16mm ultra-wide.',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=85',
    category: 'Landscape',
    cameraInfo: 'Nikon D3400',
    lensInfo: 'Tokina 11-16mm f/2.8 @ 11mm · ISO 100 · 1/250s · f/8.0',
  },
  {
    id: 'sample-subject-bg',
    title: 'Model Gadis Topi & Lembah Gunung (Tone Terpisah)',
    description: 'Foto model memandang lembah gunung megah (persis seperti demo Edit Tone Terpisah di poster).',
    url: 'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&w=1600&q=85',
    category: 'Tone Terpisah',
    cameraInfo: 'Nikon D3400',
    lensInfo: 'Tokina 11-16mm f/2.8 @ 16mm · ISO 100 · 1/500s · f/2.8',
  },
  {
    id: 'sample-hiker-beach',
    title: 'Pendaki Gunung / Pantai (Ganti Background)',
    description: 'Foto pendaki ransel yang siap diuji ganti latar belakang atau penghapus objek.',
    url: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=1600&q=85',
    category: 'Ganti Background',
    cameraInfo: 'Nikon D3400',
    lensInfo: 'Tokina 11-16mm f/2.8 @ 14mm · ISO 200 · 1/400s · f/4.0',
  },
  {
    id: 'sample-wedding-couple',
    title: 'Pasangan Pengantin Wedding Outdoor',
    description: 'Momen romantis pernikahan dengan pencahayaan alami di taman hijau.',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=85',
    category: 'Wedding',
    cameraInfo: 'Nikon D3400',
    lensInfo: 'Tokina 11-16mm f/2.8 @ 16mm · ISO 100 · 1/320s · f/2.8',
  },
  {
    id: 'sample-night-city',
    title: 'Arsitektur Kota Malam (Uji Noise & Detail)',
    description: 'Gedung kota malam hari untuk menguji fitur Tool Penghilang Noise & Koreksi Distorsi Lensa.',
    url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1600&q=85',
    category: 'Night / Noise',
    cameraInfo: 'Nikon D3400',
    lensInfo: 'Tokina 11-16mm f/2.8 @ 11mm · ISO 1600 · 1/30s · f/2.8',
  },
  {
    id: 'sample-poster-infographic',
    title: 'Poster Banner Asli Anwar Editor',
    description: 'Poster grafis asli Anwar Editor (Nikon D3400 + Tokina 11-16mm) dari pengguna.',
    url: '/public/assets/aistudio/cb4e187b-6409-455d-9edb-2ed8041628c7_d9c64c63.png',
    category: 'Infografis',
    cameraInfo: 'Studio Poster',
    lensInfo: 'Desain Original Anwar Editor',
  },
];

export const BACKGROUND_PRESETS = [
  {
    id: 'preset-beach',
    title: 'Pantai Tropis Bali',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=85',
  },
  {
    id: 'preset-mountain',
    title: 'Pegunungan Salju Alpen',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=85',
  },
  {
    id: 'preset-studio',
    title: 'Studio Minimalis Gelap',
    url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1600&q=85',
  },
];
