/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PhotoAdjustments, HSLChannel } from '../types';

interface ToolHSLProps {
  adjustments: PhotoAdjustments;
  onChange: (adjustments: PhotoAdjustments) => void;
}

type ColorKey = 'red' | 'orange' | 'yellow' | 'green' | 'cyan' | 'blue' | 'purple' | 'magenta';

const COLOR_DEFS: { key: ColorKey; label: string; bg: string }[] = [
  { key: 'red', label: 'Merah', bg: '#ef4444' },
  { key: 'orange', label: 'Oranye', bg: '#f97316' },
  { key: 'yellow', label: 'Kuning', bg: '#eab308' },
  { key: 'green', label: 'Hijau', bg: '#22c55e' },
  { key: 'cyan', label: 'Cyan', bg: '#06b6d4' },
  { key: 'blue', label: 'Biru', bg: '#3b82f6' },
  { key: 'purple', label: 'Ungu', bg: '#a855f7' },
  { key: 'magenta', label: 'Magenta', bg: '#ec4899' },
];

export const ToolHSL: React.FC<ToolHSLProps> = ({ adjustments, onChange }) => {
  const [selectedColor, setSelectedColor] = useState<ColorKey>('orange');
  const [mode, setMode] = useState<'h' | 's' | 'l'>('s');

  const currentHsl = adjustments.hsl[selectedColor] || { h: 0, s: 0, l: 0 };

  const updateHsl = (prop: keyof HSLChannel, val: number) => {
    onChange({
      ...adjustments,
      hsl: {
        ...adjustments.hsl,
        [selectedColor]: {
          ...currentHsl,
          [prop]: val,
        },
      },
    });
  };

  return (
    <div className="space-y-4">
      {/* Mode Selector (Hue, Saturation, Luminance) */}
      <div className="flex p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
        <button
          onClick={() => setMode('h')}
          className={`flex-1 py-1.5 rounded-md font-medium transition-colors ${
            mode === 'h' ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Hue (Corak Warna)
        </button>
        <button
          onClick={() => setMode('s')}
          className={`flex-1 py-1.5 rounded-md font-medium transition-colors ${
            mode === 's' ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Saturation (Kepekatan)
        </button>
        <button
          onClick={() => setMode('l')}
          className={`flex-1 py-1.5 rounded-md font-medium transition-colors ${
            mode === 'l' ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Luminance (Kecerahan)
        </button>
      </div>

      {/* Color Dots Palette */}
      <div className="flex items-center justify-between p-3 bg-slate-900/90 border border-slate-800 rounded-xl">
        {COLOR_DEFS.map((c) => (
          <button
            key={c.key}
            onClick={() => setSelectedColor(c.key)}
            className="flex flex-col items-center gap-1.5 group focus:outline-none"
          >
            <div
              className={`w-6 h-6 rounded-full transition-transform ${
                selectedColor === c.key
                  ? 'ring-4 ring-sky-400/50 scale-110 shadow-lg'
                  : 'group-hover:scale-105 opacity-80 group-hover:opacity-100'
              }`}
              style={{ backgroundColor: c.bg }}
            />
            <span
              className={`text-[10px] ${
                selectedColor === c.key ? 'text-sky-300 font-bold' : 'text-slate-500'
              }`}
            >
              {c.label}
            </span>
          </button>
        ))}
      </div>

      {/* Selected Color Sliders */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLOR_DEFS.find((c) => c.key === selectedColor)?.bg }}
            />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Channel {COLOR_DEFS.find((c) => c.key === selectedColor)?.label}
            </span>
          </div>
          <button
            onClick={() => {
              onChange({
                ...adjustments,
                hsl: {
                  ...adjustments.hsl,
                  [selectedColor]: { h: 0, s: 0, l: 0 },
                },
              });
            }}
            className="text-xs text-slate-400 hover:text-sky-400 transition-colors"
          >
            Reset Channel Ini
          </button>
        </div>

        {/* Hue */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-medium">Hue (Pergeseran Nada)</span>
            <span className="font-mono text-sky-400 font-semibold">{currentHsl.h}°</span>
          </div>
          <input
            type="range"
            min={-180}
            max={180}
            value={currentHsl.h}
            onChange={(e) => updateHsl('h', Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Saturation */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-medium">Saturation (Kepekatan Warna)</span>
            <span className="font-mono text-sky-400 font-semibold">{currentHsl.s > 0 ? `+${currentHsl.s}` : currentHsl.s}</span>
          </div>
          <input
            type="range"
            min={-100}
            max={100}
            value={currentHsl.s}
            onChange={(e) => updateHsl('s', Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Luminance */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-medium">Luminance (Kecerahan Warna)</span>
            <span className="font-mono text-sky-400 font-semibold">{currentHsl.l > 0 ? `+${currentHsl.l}` : currentHsl.l}</span>
          </div>
          <input
            type="range"
            min={-100}
            max={100}
            value={currentHsl.l}
            onChange={(e) => updateHsl('l', Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};
