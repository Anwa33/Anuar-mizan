/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PhotoAdjustments } from '../types';
import { Sparkles, Eye, Sliders, User, Mountain, Layers } from 'lucide-react';

interface ToolSplitToneProps {
  adjustments: PhotoAdjustments;
  onChange: (adjustments: PhotoAdjustments) => void;
}

export const ToolSplitTone: React.FC<ToolSplitToneProps> = ({ adjustments, onChange }) => {
  const { bgTone, subjectTone, maskConfig } = adjustments;

  const updateBg = (field: keyof typeof bgTone, value: any) => {
    onChange({
      ...adjustments,
      bgTone: {
        ...bgTone,
        [field]: value,
      },
    });
  };

  const updateSubj = (field: keyof typeof subjectTone, value: any) => {
    onChange({
      ...adjustments,
      subjectTone: {
        ...subjectTone,
        [field]: value,
      },
    });
  };

  const updateMask = (field: keyof typeof maskConfig, value: any) => {
    onChange({
      ...adjustments,
      maskConfig: {
        ...maskConfig,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-5">
      {/* Header Info */}
      <div className="bg-sky-950/40 border border-sky-800/60 rounded-xl p-3.5 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-sky-300">Edit Tone Terpisah (Latar Belakang & Subjek)</h4>
          <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
            Warna subjek dan latar belakang diatur secara independen. Cocok untuk membuat model lebih hangat bercahaya sementara pemandangan tetap sejuk dan dramatis.
          </p>
        </div>
      </div>

      {/* Mask Controls & Visualizer */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-sky-400" />
            <span className="text-xs font-semibold text-slate-200">Segmentasi Mask Subjek</span>
          </div>
          <button
            onClick={() => updateMask('showMaskOverlay', !maskConfig.showMaskOverlay)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              maskConfig.showMaskOverlay
                ? 'bg-pink-600 text-white shadow-sm shadow-pink-500/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            {maskConfig.showMaskOverlay ? 'Sembunyikan Mask' : 'Lihat Mask Subjek'}
          </button>
        </div>

        {/* Mode selector */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950 rounded-lg text-xs">
          <button
            onClick={() => updateMask('mode', 'auto-subject')}
            className={`py-1.5 px-2 rounded-md font-medium transition-all ${
              maskConfig.mode === 'auto-subject'
                ? 'bg-sky-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Auto AI Subjek
          </button>
          <button
            onClick={() => updateMask('mode', 'radial')}
            className={`py-1.5 px-2 rounded-md font-medium transition-all ${
              maskConfig.mode === 'radial'
                ? 'bg-sky-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Radial Ellipse
          </button>
          <button
            onClick={() => updateMask('mode', 'linear')}
            className={`py-1.5 px-2 rounded-md font-medium transition-all ${
              maskConfig.mode === 'linear'
                ? 'bg-sky-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Linear Gradasi
          </button>
        </div>

        {/* Feather slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-slate-400">
            <span>Kelembutan Tepi (Feather)</span>
            <span className="font-mono text-slate-200">{maskConfig.feather}%</span>
          </div>
          <input
            type="range"
            min={10}
            max={80}
            value={maskConfig.feather}
            onChange={(e) => updateMask('feather', Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* Panel 1: Tone Latar Belakang (Blue Card) */}
      <div className="bg-slate-900/90 border border-sky-900/60 rounded-xl p-4 space-y-4 shadow-lg shadow-sky-950/20">
        <div className="flex items-center justify-between border-b border-sky-950/80 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 ring-4 ring-sky-400/20"></span>
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sky-400">
              <Mountain className="w-4 h-4" /> Tone Latar Belakang
            </span>
          </div>
          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400">
            <span>Aktif</span>
            <input
              type="checkbox"
              checked={bgTone.enabled}
              onChange={(e) => updateBg('enabled', e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-sky-500 focus:ring-0 w-4 h-4 cursor-pointer"
            />
          </label>
        </div>

        <div className="space-y-3.5">
          {/* Exposure */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Exposure</span>
              <span className="font-mono text-sky-400 font-semibold">
                {bgTone.exposure > 0 ? `+${bgTone.exposure.toFixed(2)}` : bgTone.exposure.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min={-1.5}
              max={1.5}
              step={0.05}
              value={bgTone.exposure}
              onChange={(e) => updateBg('exposure', Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Contrast */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Contrast</span>
              <span className="font-mono text-sky-400 font-semibold">
                {bgTone.contrast > 0 ? `+${bgTone.contrast}` : bgTone.contrast}
              </span>
            </div>
            <input
              type="range"
              min={-50}
              max={50}
              value={bgTone.contrast}
              onChange={(e) => updateBg('contrast', Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Saturation */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Saturation</span>
              <span className="font-mono text-sky-400 font-semibold">
                {bgTone.saturation > 0 ? `+${bgTone.saturation}` : bgTone.saturation}
              </span>
            </div>
            <input
              type="range"
              min={-50}
              max={50}
              value={bgTone.saturation}
              onChange={(e) => updateBg('saturation', Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Temperature */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Temperature</span>
              <span className="font-mono text-sky-400 font-semibold">
                {bgTone.temperature > 0 ? `+${bgTone.temperature}` : bgTone.temperature}
              </span>
            </div>
            <input
              type="range"
              min={-50}
              max={50}
              value={bgTone.temperature}
              onChange={(e) => updateBg('temperature', Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Blur / Bokeh simulation */}
          <div className="space-y-1 pt-1 border-t border-slate-800/80">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Blur / Bokeh Latar (f/2.8)</span>
              <span className="font-mono text-sky-400 font-semibold">{bgTone.blur}px</span>
            </div>
            <input
              type="range"
              min={0}
              max={25}
              value={bgTone.blur}
              onChange={(e) => updateBg('blur', Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Panel 2: Tone Subjek (Pink/Magenta Card like poster) */}
      <div className="bg-slate-900/90 border border-pink-900/60 rounded-xl p-4 space-y-4 shadow-lg shadow-pink-950/20">
        <div className="flex items-center justify-between border-b border-pink-950/80 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-500 ring-4 ring-pink-500/20"></span>
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-pink-400">
              <User className="w-4 h-4" /> Tone Subjek
            </span>
          </div>
          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400">
            <span>Aktif</span>
            <input
              type="checkbox"
              checked={subjectTone.enabled}
              onChange={(e) => updateSubj('enabled', e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-pink-500 focus:ring-0 w-4 h-4 cursor-pointer"
            />
          </label>
        </div>

        <div className="space-y-3.5">
          {/* Exposure */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Exposure</span>
              <span className="font-mono text-pink-400 font-semibold">
                {subjectTone.exposure > 0 ? `+${subjectTone.exposure.toFixed(2)}` : subjectTone.exposure.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min={-1.5}
              max={1.5}
              step={0.05}
              value={subjectTone.exposure}
              onChange={(e) => updateSubj('exposure', Number(e.target.value))}
              className="w-full slider-subject"
            />
          </div>

          {/* Contrast */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Contrast</span>
              <span className="font-mono text-pink-400 font-semibold">
                {subjectTone.contrast > 0 ? `+${subjectTone.contrast}` : subjectTone.contrast}
              </span>
            </div>
            <input
              type="range"
              min={-50}
              max={50}
              value={subjectTone.contrast}
              onChange={(e) => updateSubj('contrast', Number(e.target.value))}
              className="w-full slider-subject"
            />
          </div>

          {/* Saturation */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Saturation</span>
              <span className="font-mono text-pink-400 font-semibold">
                {subjectTone.saturation > 0 ? `+${subjectTone.saturation}` : subjectTone.saturation}
              </span>
            </div>
            <input
              type="range"
              min={-50}
              max={50}
              value={subjectTone.saturation}
              onChange={(e) => updateSubj('saturation', Number(e.target.value))}
              className="w-full slider-subject"
            />
          </div>

          {/* Skin Tone */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Skin Tone (Kehangatan & Kehalusan Kulit)</span>
              <span className="font-mono text-pink-400 font-semibold">
                {subjectTone.skinTone > 0 ? `+${subjectTone.skinTone}` : subjectTone.skinTone}
              </span>
            </div>
            <input
              type="range"
              min={-50}
              max={50}
              value={subjectTone.skinTone}
              onChange={(e) => updateSubj('skinTone', Number(e.target.value))}
              className="w-full slider-subject"
            />
          </div>

          {/* Sharpness */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Ketajaman Subjek (Sharpness)</span>
              <span className="font-mono text-pink-400 font-semibold">+{subjectTone.sharpness}</span>
            </div>
            <input
              type="range"
              min={0}
              max={50}
              value={subjectTone.sharpness}
              onChange={(e) => updateSubj('sharpness', Number(e.target.value))}
              className="w-full slider-subject"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
