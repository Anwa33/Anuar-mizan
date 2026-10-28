/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PhotoAdjustments } from '../types';
import { Sun, Palette, Wand2, RefreshCw } from 'lucide-react';

interface ToolManualProProps {
  adjustments: PhotoAdjustments;
  onChange: (adjustments: PhotoAdjustments) => void;
}

export const ToolManualPro: React.FC<ToolManualProProps> = ({
  adjustments,
  onChange,
}) => {
  const [activeSection, setActiveSection] = useState<'light' | 'color' | 'effects'>('light');

  const update = (field: keyof PhotoAdjustments, value: any) => {
    onChange({
      ...adjustments,
      [field]: value,
    });
  };

  const resetSection = () => {
    if (activeSection === 'light') {
      onChange({
        ...adjustments,
        exposure: 0,
        contrast: 0,
        brightness: 0,
        highlights: 0,
        shadows: 0,
        whites: 0,
        blacks: 0,
      });
    } else if (activeSection === 'color') {
      onChange({
        ...adjustments,
        temperature: 0,
        tint: 0,
        saturation: 0,
        vibrance: 0,
      });
    } else {
      onChange({
        ...adjustments,
        clarity: 0,
        texture: 0,
        vignette: 0,
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Sub Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
          <button
            onClick={() => setActiveSection('light')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeSection === 'light'
                ? 'bg-sky-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sun className="w-3.5 h-3.5" /> Cahaya
          </button>
          <button
            onClick={() => setActiveSection('color')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeSection === 'color'
                ? 'bg-sky-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Palette className="w-3.5 h-3.5" /> Warna
          </button>
          <button
            onClick={() => setActiveSection('effects')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeSection === 'effects'
                ? 'bg-sky-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" /> Efek
          </button>
        </div>

        <button
          onClick={resetSection}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-sky-400 transition-colors"
        >
          <RefreshCw className="w-3 h-3" /> Reset Bagian
        </button>
      </div>

      {/* Light Section */}
      {activeSection === 'light' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3.5">
          {/* Exposure */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Exposure (Pencahayaan)</span>
              <span className="font-mono text-sky-400 font-semibold">
                {adjustments.exposure > 0 ? `+${adjustments.exposure.toFixed(2)}` : adjustments.exposure.toFixed(2)} EV
              </span>
            </div>
            <input
              type="range"
              min={-2}
              max={2}
              step={0.05}
              value={adjustments.exposure}
              onChange={(e) => update('exposure', Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Contrast */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Contrast (Kontras)</span>
              <span className="font-mono text-sky-400 font-semibold">
                {adjustments.contrast > 0 ? `+${adjustments.contrast}` : adjustments.contrast}
              </span>
            </div>
            <input
              type="range"
              min={-100}
              max={100}
              value={adjustments.contrast}
              onChange={(e) => update('contrast', Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Highlights */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Highlights (Area Terang)</span>
              <span className="font-mono text-sky-400 font-semibold">
                {adjustments.highlights > 0 ? `+${adjustments.highlights}` : adjustments.highlights}
              </span>
            </div>
            <input
              type="range"
              min={-100}
              max={100}
              value={adjustments.highlights}
              onChange={(e) => update('highlights', Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Shadows */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Shadows (Area Bayangan)</span>
              <span className="font-mono text-sky-400 font-semibold">
                {adjustments.shadows > 0 ? `+${adjustments.shadows}` : adjustments.shadows}
              </span>
            </div>
            <input
              type="range"
              min={-100}
              max={100}
              value={adjustments.shadows}
              onChange={(e) => update('shadows', Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Brightness */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Brightness</span>
              <span className="font-mono text-sky-400 font-semibold">
                {adjustments.brightness > 0 ? `+${adjustments.brightness}` : adjustments.brightness}
              </span>
            </div>
            <input
              type="range"
              min={-100}
              max={100}
              value={adjustments.brightness}
              onChange={(e) => update('brightness', Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      )}

      {/* Color Section */}
      {activeSection === 'color' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3.5">
          {/* Temperature */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Temperature (Suhu Warna)</span>
              <span className="font-mono text-sky-400 font-semibold">
                {adjustments.temperature > 0 ? `+${adjustments.temperature} (Hangat)` : adjustments.temperature < 0 ? `${adjustments.temperature} (Sejuk)` : '0 (Netral)'}
              </span>
            </div>
            <input
              type="range"
              min={-100}
              max={100}
              value={adjustments.temperature}
              onChange={(e) => update('temperature', Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-[11px] text-slate-500">
              <span className="text-sky-400">Biru Sejuk</span>
              <span className="text-amber-400">Amber Hangat</span>
            </div>
          </div>

          {/* Tint */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Tint (Corak Hijau / Magenta)</span>
              <span className="font-mono text-sky-400 font-semibold">
                {adjustments.tint > 0 ? `+${adjustments.tint}` : adjustments.tint}
              </span>
            </div>
            <input
              type="range"
              min={-100}
              max={100}
              value={adjustments.tint}
              onChange={(e) => update('tint', Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-[11px] text-slate-500">
              <span className="text-emerald-400">Hijau</span>
              <span className="text-pink-400">Magenta</span>
            </div>
          </div>

          {/* Vibrance */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Vibrance (Warna Pintar)</span>
              <span className="font-mono text-sky-400 font-semibold">
                {adjustments.vibrance > 0 ? `+${adjustments.vibrance}` : adjustments.vibrance}
              </span>
            </div>
            <input
              type="range"
              min={-100}
              max={100}
              value={adjustments.vibrance}
              onChange={(e) => update('vibrance', Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Saturation */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Saturation (Saturasi Keseluruhan)</span>
              <span className="font-mono text-sky-400 font-semibold">
                {adjustments.saturation > 0 ? `+${adjustments.saturation}` : adjustments.saturation}
              </span>
            </div>
            <input
              type="range"
              min={-100}
              max={100}
              value={adjustments.saturation}
              onChange={(e) => update('saturation', Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      )}

      {/* Effects Section */}
      {activeSection === 'effects' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3.5">
          {/* Clarity */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Clarity (Kejelasan Midtone)</span>
              <span className="font-mono text-sky-400 font-semibold">
                {adjustments.clarity > 0 ? `+${adjustments.clarity}` : adjustments.clarity}
              </span>
            </div>
            <input
              type="range"
              min={-100}
              max={100}
              value={adjustments.clarity}
              onChange={(e) => update('clarity', Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Texture */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Texture (Tekstur Halus)</span>
              <span className="font-mono text-sky-400 font-semibold">
                {adjustments.texture > 0 ? `+${adjustments.texture}` : adjustments.texture}
              </span>
            </div>
            <input
              type="range"
              min={-100}
              max={100}
              value={adjustments.texture}
              onChange={(e) => update('texture', Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Vignette */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Vignette (Sudut Gelap Artistik)</span>
              <span className="font-mono text-sky-400 font-semibold">
                {adjustments.vignette > 0 ? `+${adjustments.vignette}` : adjustments.vignette}
              </span>
            </div>
            <input
              type="range"
              min={-100}
              max={100}
              value={adjustments.vignette}
              onChange={(e) => update('vignette', Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
};
