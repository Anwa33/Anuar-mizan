/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { SAMPLE_IMAGES } from '../data/presets';
import { SampleImage } from '../types';
import {
  Image as ImageIcon,
  Camera,
  Sparkles,
  Sliders,
  Layers,
  Wrench,
  ChevronRight,
  Upload,
  Settings,
  Flame,
  Award,
} from 'lucide-react';

interface HomeDashboardProps {
  onStartEditing: () => void;
  onOpenGalleryUpload: () => void;
  onOpenCamera: () => void;
  onOpenPresets: () => void;
  onOpenManual: () => void;
  onOpenSplitTone: () => void;
  onOpenOtherTools: () => void;
  onSelectSample: (sample: SampleImage) => void;
  onOpenSettings: () => void;
  selectedSampleId: string;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  onStartEditing,
  onOpenGalleryUpload,
  onOpenCamera,
  onOpenPresets,
  onOpenManual,
  onOpenSplitTone,
  onOpenOtherTools,
  onSelectSample,
  onOpenSettings,
  selectedSampleId,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="flex flex-col min-h-full pb-8">
      {/* Hero Banner Card (Matches the mockup hero card in the poster!) */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-xl mb-5 group">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85"
          alt="Edit Foto Profesional"
          className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent p-5 flex flex-col justify-end">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-sky-500/20 border border-sky-400/40 text-[10px] font-bold text-sky-300 w-fit mb-1.5">
            <Flame className="w-3 h-3 text-sky-400" /> Versi Pro Nikon D3400 + Tokina 11-16mm
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">
            Edit Foto Profesional
          </h2>
          <p className="text-xs text-slate-300 mt-0.5 mb-3 font-medium">
            Dengan 1000+ Preset Tone & Fitur Terpisah Subjek/Latar
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={onStartEditing}
              className="px-5 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-lg shadow-sky-500/30 flex items-center gap-1.5 cursor-pointer"
            >
              <span>Mulai Edit</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onOpenGalleryUpload}
              className="px-3.5 py-2 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-white font-medium text-xs rounded-xl transition-colors cursor-pointer"
            >
              Ganti Foto
            </button>
          </div>
        </div>
      </div>

      {/* 6 Main Action Cards (Exact layout from the smartphone mockup in the poster) */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {/* Card 1: Masukan Foto Dari Galeri */}
        <button
          onClick={onOpenGalleryUpload}
          className="p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-sky-500/50 transition-all flex flex-col items-center justify-center text-center group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-xl bg-slate-800/80 group-hover:bg-sky-500/20 text-slate-300 group-hover:text-sky-400 flex items-center justify-center mb-2.5 transition-colors">
            <ImageIcon className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-white group-hover:text-sky-300">
            Masukan Foto
          </span>
          <span className="text-[11px] text-slate-400">Dari Galeri</span>
        </button>

        {/* Card 2: Buka Kamera Langsung */}
        <button
          onClick={onOpenCamera}
          className="p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-sky-500/50 transition-all flex flex-col items-center justify-center text-center group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-xl bg-slate-800/80 group-hover:bg-sky-500/20 text-slate-300 group-hover:text-sky-400 flex items-center justify-center mb-2.5 transition-colors">
            <Camera className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-white group-hover:text-sky-300">
            Buka Kamera
          </span>
          <span className="text-[11px] text-slate-400">Langsung</span>
        </button>

        {/* Card 3: 1000 Preset Tone */}
        <button
          onClick={onOpenPresets}
          className="p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-pink-500/50 transition-all flex flex-col items-center justify-center text-center group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-xl bg-pink-500/10 group-hover:bg-pink-500/25 text-pink-400 flex items-center justify-center mb-2.5 transition-colors">
            <Sparkles className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-white group-hover:text-pink-300">
            1000 Preset Tone
          </span>
          <span className="text-[11px] text-slate-400">Nikon D3400 + Tokina</span>
        </button>

        {/* Card 4: Edit Manual Profesional */}
        <button
          onClick={onOpenManual}
          className="p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-sky-500/50 transition-all flex flex-col items-center justify-center text-center group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 group-hover:bg-sky-500/25 text-sky-400 flex items-center justify-center mb-2.5 transition-colors">
            <Sliders className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-white group-hover:text-sky-300">
            Edit Manual
          </span>
          <span className="text-[11px] text-slate-400">Profesional</span>
        </button>

        {/* Card 5: Latar Belakang & Subjek (Terpisah) */}
        <button
          onClick={onOpenSplitTone}
          className="p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/50 transition-all flex flex-col items-center justify-center text-center group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 group-hover:bg-emerald-500/25 text-emerald-400 flex items-center justify-center mb-2.5 transition-colors">
            <Layers className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-white group-hover:text-emerald-300">
            Latar Belakang
          </span>
          <span className="text-[11px] text-slate-400">& Subjek (Terpisah)</span>
        </button>

        {/* Card 6: Tool Lainnya */}
        <button
          onClick={onOpenOtherTools}
          className="p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/50 transition-all flex flex-col items-center justify-center text-center group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 group-hover:bg-amber-500/25 text-amber-400 flex items-center justify-center mb-2.5 transition-colors">
            <Wrench className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-white group-hover:text-amber-300">
            Tool Lainnya
          </span>
          <span className="text-[11px] text-slate-400">Noise, Lensa & HSL</span>
        </button>
      </div>

      {/* Optical Pairing Banner: Nikon D3400 + Tokina 11-16mm */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-medium">Optimal untuk:</div>
            <div className="text-xs font-bold text-white">Nikon D3400 + Tokina 11-16mm</div>
            <div className="text-[11px] text-sky-400 italic">Hasil Maksimal Dengan Pengaturan Terbaik</div>
          </div>
        </div>
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          title="Info Profil Kamera"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Sample Photos Carousel (Quick 1-Click Test) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Pilih Foto Sampel Uji Coba
          </h3>
          <span className="text-[11px] text-slate-500">Klik untuk langsung edit</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {SAMPLE_IMAGES.map((sample) => (
            <button
              key={sample.id}
              onClick={() => onSelectSample(sample)}
              className={`group relative rounded-xl overflow-hidden border text-left aspect-[4/3] flex flex-col justify-end p-2 transition-all cursor-pointer ${
                selectedSampleId === sample.id
                  ? 'border-sky-500 ring-2 ring-sky-500/40 shadow-lg'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <img
                src={sample.url}
                alt={sample.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="relative z-10">
                <span className="text-[10px] font-bold uppercase text-sky-300 block truncate">
                  {sample.category}
                </span>
                <span className="text-[11px] font-semibold text-white block truncate">
                  {sample.title}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
