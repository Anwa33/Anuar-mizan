/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { PhotoAdjustments, Preset, PresetCategory } from '../types';
import { PRESET_CATEGORIES, getAllPresets } from '../data/presets';
import { Sparkles, Search, SlidersHorizontal, CheckCircle, Camera } from 'lucide-react';

interface ToolPresetsProps {
  adjustments: PhotoAdjustments;
  onChange: (adjustments: PhotoAdjustments) => void;
  selectedPresetId: string | null;
  onSelectPresetId: (id: string) => void;
}

export const ToolPresets: React.FC<ToolPresetsProps> = ({
  adjustments,
  onChange,
  selectedPresetId,
  onSelectPresetId,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<PresetCategory | 'all'>('tokina-nikon');
  const [searchQuery, setSearchQuery] = useState('');
  const [intensity, setIntensity] = useState(100);

  const allPresets = useMemo(() => getAllPresets(), []);

  const filteredPresets = useMemo(() => {
    return allPresets.filter((preset) => {
      const matchCat = selectedCategory === 'all' || preset.category === selectedCategory;
      const matchSearch =
        searchQuery === '' ||
        preset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        preset.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (preset.badge && preset.badge.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [allPresets, selectedCategory, searchQuery]);

  const applyPreset = (preset: Preset) => {
    onSelectPresetId(preset.id);

    // Merge preset adjustments onto current state with intensity scaling
    const factor = intensity / 100;
    const base = preset.adjustments;

    const merged: PhotoAdjustments = {
      ...adjustments,
      exposure: base.exposure !== undefined ? base.exposure * factor : adjustments.exposure,
      contrast: base.contrast !== undefined ? Math.round(base.contrast * factor) : adjustments.contrast,
      saturation: base.saturation !== undefined ? Math.round(base.saturation * factor) : adjustments.saturation,
      vibrance: base.vibrance !== undefined ? Math.round(base.vibrance * factor) : adjustments.vibrance,
      temperature: base.temperature !== undefined ? Math.round(base.temperature * factor) : adjustments.temperature,
      tint: base.tint !== undefined ? Math.round(base.tint * factor) : adjustments.tint,
      highlights: base.highlights !== undefined ? Math.round(base.highlights * factor) : adjustments.highlights,
      shadows: base.shadows !== undefined ? Math.round(base.shadows * factor) : adjustments.shadows,
      clarity: base.clarity !== undefined ? Math.round(base.clarity * factor) : adjustments.clarity,
      texture: base.texture !== undefined ? Math.round(base.texture * factor) : adjustments.texture,
      vignette: base.vignette !== undefined ? Math.round(base.vignette * factor) : adjustments.vignette,
      sharpen: base.sharpen !== undefined ? Math.round(base.sharpen * factor) : adjustments.sharpen,
      noiseReduction: base.noiseReduction !== undefined ? base.noiseReduction : adjustments.noiseReduction,
      colorNoiseReduction: base.colorNoiseReduction !== undefined ? base.colorNoiseReduction : adjustments.colorNoiseReduction,
      lensCorrection: base.lensCorrection ? { ...adjustments.lensCorrection, ...base.lensCorrection } : adjustments.lensCorrection,
      bgTone: base.bgTone ? { ...adjustments.bgTone, ...base.bgTone } : adjustments.bgTone,
      subjectTone: base.subjectTone ? { ...adjustments.subjectTone, ...base.subjectTone } : adjustments.subjectTone,
    };

    onChange(merged);
  };

  return (
    <div className="space-y-4">
      {/* 1000+ Presets Header with Search */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              1000+ Preset Tone Koleksi Lengkap
            </h4>
          </div>
          <span className="text-[11px] font-mono text-sky-400 font-semibold bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800/60">
            {allPresets.length}+ Preset
          </span>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari preset (Tokina, Wedding, Sunset, Teal...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>

        {/* Preset Intensity Slider */}
        <div className="pt-2 border-t border-slate-800/80 space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Intensitas Preset Terpilih</span>
            <span className="font-mono text-sky-400 font-semibold">{intensity}%</span>
          </div>
          <input
            type="range"
            min={10}
            max={150}
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* Category Pills (horizontal scroll) */}
      <div className="flex gap-1.5 overflow-x-auto pb-1.5 no-scrollbar">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            selectedCategory === 'all'
              ? 'bg-sky-600 text-white shadow'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          Semua ({allPresets.length})
        </button>
        {PRESET_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedCategory === cat.id
                ? 'bg-sky-600 text-white shadow'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat.id === 'tokina-nikon' && <Camera className="w-3 h-3 text-sky-300" />}
            <span>{cat.label}</span>
            <span className="text-[10px] opacity-75 font-mono">({cat.count})</span>
          </button>
        ))}
      </div>

      {/* Presets Grid */}
      <div className="grid grid-cols-2 gap-2.5 max-h-[460px] overflow-y-auto pr-1">
        {filteredPresets.map((preset) => {
          const isSelected = selectedPresetId === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset)}
              className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden group flex flex-col justify-between ${
                isSelected
                  ? 'bg-sky-950/60 border-sky-400 ring-2 ring-sky-500/40 shadow-lg shadow-sky-950/50'
                  : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-1 mb-1.5">
                  {preset.badge ? (
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                        preset.isSpecialTokina
                          ? 'bg-sky-500/30 text-sky-300 border border-sky-500/40'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {preset.badge}
                    </span>
                  ) : (
                    <span className="text-[9px] text-slate-500 uppercase tracking-wider">
                      {preset.category}
                    </span>
                  )}
                  {isSelected && <CheckCircle className="w-3.5 h-3.5 text-sky-400 shrink-0" />}
                </div>

                <div className="text-xs font-bold text-white group-hover:text-sky-300 transition-colors line-clamp-1">
                  {preset.name}
                </div>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {preset.description}
                </p>
              </div>

              {/* Color swatch hint */}
              <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                <span>Klik untuk terapkan</span>
                <span className="text-sky-400 font-mono font-medium">1-Klik</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
