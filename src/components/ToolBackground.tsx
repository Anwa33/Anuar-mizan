/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { PhotoAdjustments } from '../types';
import { BACKGROUND_PRESETS } from '../data/presets';
import { Image as ImageIcon, Eraser, Droplets, Sparkles, Upload, RefreshCw } from 'lucide-react';

interface ToolBackgroundProps {
  adjustments: PhotoAdjustments;
  onChange: (adjustments: PhotoAdjustments) => void;
  onCustomBgUpload: (file: File) => void;
}

export const ToolBackground: React.FC<ToolBackgroundProps> = ({
  adjustments,
  onChange,
  onCustomBgUpload,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { bgReplace, bgTone } = adjustments;

  const setBgType = (type: typeof bgReplace.activeType, customUrl?: string) => {
    onChange({
      ...adjustments,
      bgReplace: {
        ...bgReplace,
        activeType: type,
        ...(customUrl ? { customUrl } : {}),
      },
    });
  };

  const setBlurAmount = (blur: number) => {
    onChange({
      ...adjustments,
      bgTone: {
        ...bgTone,
        blur,
      },
      bgReplace: {
        ...bgReplace,
        blurAmount: blur,
      },
    });
  };

  return (
    <div className="space-y-5">
      {/* Header Info */}
      <div className="bg-sky-950/40 border border-sky-800/60 rounded-xl p-3.5 flex items-start gap-3">
        <ImageIcon className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-sky-300">Pilih & Edit Latar Belakang</h4>
          <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
            Ganti latar pemandangan, beri efek bokeh depth-of-field lensa f/1.8 Tokina, atau hapus objek mengganggu dengan presisi.
          </p>
        </div>
      </div>

      {/* 4 Action Pills Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <button
          onClick={() => setBgType('preset-beach')}
          className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-all ${
            bgReplace.activeType === 'preset-beach'
              ? 'bg-sky-900/50 border-sky-500 text-sky-200'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
          }`}
        >
          <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400">
            <ImageIcon className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold">Ganti Background</div>
            <div className="text-[11px] text-slate-400">Pantai Tropis</div>
          </div>
        </button>

        <button
          onClick={() => setBgType('preset-mountain')}
          className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-all ${
            bgReplace.activeType === 'preset-mountain'
              ? 'bg-sky-900/50 border-sky-500 text-sky-200'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
          }`}
        >
          <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
            <Droplets className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold">Gunung Alpen</div>
            <div className="text-[11px] text-slate-400">Lanskap Salju</div>
          </div>
        </button>

        <button
          onClick={() => setBlurAmount(bgTone.blur === 0 ? 12 : 0)}
          className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-all ${
            bgTone.blur > 0
              ? 'bg-pink-950/50 border-pink-500 text-pink-200'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
          }`}
        >
          <div className="p-2 rounded-lg bg-pink-500/20 text-pink-400">
            <Droplets className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold">Blur Bokeh</div>
            <div className="text-[11px] text-slate-400">
              {bgTone.blur > 0 ? `${bgTone.blur}px Aktif` : 'Nonaktif'}
            </div>
          </div>
        </button>

        <button
          onClick={() => {
            // Smart auto background lighting match
            onChange({
              ...adjustments,
              bgTone: {
                ...bgTone,
                exposure: 0.1,
                contrast: 15,
                saturation: 10,
                temperature: -8,
              },
            });
          }}
          className="flex items-center gap-2 p-3 rounded-xl border bg-slate-900 border-slate-800 text-slate-300 hover:border-purple-600 transition-all text-left"
        >
          <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold">Latar Belakang AI</div>
            <div className="text-[11px] text-slate-400">Pencahayaan Selaras</div>
          </div>
        </button>
      </div>

      {/* Background Presets Gallery */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Koleksi Latar Pengganti
          </h5>
          <button
            onClick={() => setBgType('original')}
            className="flex items-center gap-1 text-xs text-sky-400 hover:underline"
          >
            <RefreshCw className="w-3 h-3" /> Kembalikan Asli
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          <button
            onClick={() => setBgType('original')}
            className={`group relative rounded-lg overflow-hidden border text-left aspect-video flex flex-col justify-end p-2 transition-all ${
              bgReplace.activeType === 'original'
                ? 'border-sky-500 ring-2 ring-sky-500/30'
                : 'border-slate-800 hover:border-slate-600'
            }`}
          >
            <div className="absolute inset-0 bg-slate-950 flex items-center justify-center text-slate-500 font-mono text-xs">
              Asli
            </div>
            <span className="relative z-10 text-[11px] font-medium text-white drop-shadow">
              Latar Asli
            </span>
          </button>

          {BACKGROUND_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => setBgType(preset.id as any)}
              className={`group relative rounded-lg overflow-hidden border text-left aspect-video flex flex-col justify-end p-2 transition-all ${
                bgReplace.activeType === preset.id
                  ? 'border-sky-500 ring-2 ring-sky-500/30'
                  : 'border-slate-800 hover:border-slate-600'
              }`}
            >
              <img
                src={preset.url}
                alt={preset.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <span className="relative z-10 text-[10px] font-medium text-white truncate">
                {preset.title}
              </span>
            </button>
          ))}
        </div>

        {/* Custom Upload Button */}
        <div className="pt-2">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                onCustomBgUpload(e.target.files[0]);
              }
            }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-slate-950 hover:bg-slate-800 border border-dashed border-slate-700 hover:border-sky-500 rounded-lg text-xs text-slate-300 transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-sky-400" />
            Unggah Latar Belakang Sendiri
          </button>
        </div>
      </div>

      {/* Bokeh / Blur Slider */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-slate-300 font-medium">Tingkat Blur Latar Belakang (Bokeh f/1.8 - f/4.0)</span>
          <span className="font-mono text-sky-400 font-semibold">{bgTone.blur}px</span>
        </div>
        <input
          type="range"
          min={0}
          max={25}
          value={bgTone.blur}
          onChange={(e) => setBlurAmount(Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-[11px] text-slate-400">
          <span>0px (Tajam Alami)</span>
          <span>12px (DSLR f/2.8)</span>
          <span>25px (Creamy f/1.4)</span>
        </div>
      </div>
    </div>
  );
};
