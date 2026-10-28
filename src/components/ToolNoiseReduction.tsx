/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PhotoAdjustments } from '../types';
import { ShieldCheck, SplitSquareVertical } from 'lucide-react';

interface ToolNoiseReductionProps {
  adjustments: PhotoAdjustments;
  onChange: (adjustments: PhotoAdjustments) => void;
  splitRatio: number;
  onSplitChange: (ratio: number) => void;
}

export const ToolNoiseReduction: React.FC<ToolNoiseReductionProps> = ({
  adjustments,
  onChange,
  splitRatio,
  onSplitChange,
}) => {
  const updateField = (field: keyof PhotoAdjustments, value: any) => {
    onChange({
      ...adjustments,
      [field]: value,
    });
  };

  return (
    <div className="space-y-5">
      {/* Header Info */}
      <div className="bg-sky-950/40 border border-sky-800/60 rounded-xl p-3.5 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-sky-300">Tool Penghilang Noise</h4>
          <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
            Foto Lebih Bersih & Detail. Menghilangkan bintik grain noise pada foto ISO tinggi (Nikon D3400) tanpa menghilangkan tekstur dan ketajaman alami.
          </p>
        </div>
      </div>

      {/* Before / After Split Slider Toggle */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-slate-200">
            <SplitSquareVertical className="w-4 h-4 text-sky-400" />
            <span>Perbandingan Sebelum / Sesudah</span>
          </div>
          <span className="font-mono text-sky-400 font-semibold">{Math.round(splitRatio * 100)}%</span>
        </div>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={splitRatio}
          onChange={(e) => onSplitChange(Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-[11px] text-slate-400">
          <span>0% (Hanya Sebelum)</span>
          <span>50% (Split Tengah)</span>
          <span>100% (Hasil Akhir)</span>
        </div>
      </div>

      {/* Main Denoise & Sharpness Sliders */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-4">
        <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300 border-b border-slate-800 pb-2">
          Parameter Kebersihan & Ketajaman
        </h5>

        {/* Noise Reduction */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-medium">Noise Reduction (Luminance)</span>
            <span className="font-mono text-sky-400 font-semibold">{adjustments.noiseReduction}</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={adjustments.noiseReduction}
            onChange={(e) => updateField('noiseReduction', Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Detail */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-medium">Detail Retention</span>
            <span className="font-mono text-sky-400 font-semibold">+{adjustments.detail}</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={adjustments.detail}
            onChange={(e) => updateField('detail', Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Sharpen */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-medium">Sharpen (Ketajaman Optik)</span>
            <span className="font-mono text-sky-400 font-semibold">+{adjustments.sharpen}</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={adjustments.sharpen}
            onChange={(e) => updateField('sharpen', Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Color Noise Reduction */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-medium">Color Noise Reduction (Bintik Warna)</span>
            <span className="font-mono text-sky-400 font-semibold">{adjustments.colorNoiseReduction}</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={adjustments.colorNoiseReduction}
            onChange={(e) => updateField('colorNoiseReduction', Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* Quick Dials (like bottom dials in poster) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
        <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300">
          Penyeimbang Cepat (Quick Tuning)
        </h5>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-2.5 bg-slate-950/70 border border-slate-800/80 rounded-lg space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-400">Texture</span>
              <span className="font-mono text-sky-400 font-semibold">{adjustments.texture}</span>
            </div>
            <input
              type="range"
              min={-50}
              max={50}
              value={adjustments.texture}
              onChange={(e) => updateField('texture', Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="p-2.5 bg-slate-950/70 border border-slate-800/80 rounded-lg space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-400">Clarity</span>
              <span className="font-mono text-sky-400 font-semibold">{adjustments.clarity}</span>
            </div>
            <input
              type="range"
              min={-50}
              max={50}
              value={adjustments.clarity}
              onChange={(e) => updateField('clarity', Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
