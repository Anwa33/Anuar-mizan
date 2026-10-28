/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PhotoAdjustments } from '../types';
import { Crop, RotateCw, RotateCcw, FlipHorizontal, FlipVertical, Type, Stamp } from 'lucide-react';

interface ToolCropWatermarkProps {
  adjustments: PhotoAdjustments;
  onChange: (adjustments: PhotoAdjustments) => void;
}

export const ToolCropWatermark: React.FC<ToolCropWatermarkProps> = ({
  adjustments,
  onChange,
}) => {
  const { transform, watermark } = adjustments;

  const setCropAspect = (cropAspect: typeof transform.cropAspect) => {
    onChange({
      ...adjustments,
      transform: {
        ...transform,
        cropAspect,
      },
    });
  };

  const rotateCw = () => {
    const nextRot = (transform.rotation + 90) % 360;
    onChange({
      ...adjustments,
      transform: {
        ...transform,
        rotation: nextRot,
      },
    });
  };

  const rotateCcw = () => {
    const nextRot = (transform.rotation - 90 + 360) % 360;
    onChange({
      ...adjustments,
      transform: {
        ...transform,
        rotation: nextRot,
      },
    });
  };

  const toggleFlipH = () => {
    onChange({
      ...adjustments,
      transform: {
        ...transform,
        flipH: !transform.flipH,
      },
    });
  };

  const toggleFlipV = () => {
    onChange({
      ...adjustments,
      transform: {
        ...transform,
        flipV: !transform.flipV,
      },
    });
  };

  const updateWm = (field: keyof typeof watermark, value: any) => {
    onChange({
      ...adjustments,
      watermark: {
        ...watermark,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-5">
      {/* Crop & Ratio */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Crop className="w-4 h-4 text-sky-400" />
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Rasio Aspek & Potong
          </h5>
        </div>

        <div className="grid grid-cols-3 gap-1.5 text-xs">
          {[
            { id: 'free', label: 'Bebas (Asli)' },
            { id: '1:1', label: '1:1 Persegi' },
            { id: '4:5', label: '4:5 IG Feed' },
            { id: '9:16', label: '9:16 Story' },
            { id: '16:9', label: '16:9 Bioskop' },
            { id: '3:2', label: '3:2 Nikon DSLR' },
          ].map((r) => (
            <button
              key={r.id}
              onClick={() => setCropAspect(r.id as any)}
              className={`py-2 px-2.5 rounded-lg font-medium transition-all text-center ${
                transform.cropAspect === r.id
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rotation & Flip Controls */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
        <h5 className="text-xs font-bold uppercase tracking-wider text-slate-200">
          Putar & Balik Gambar
        </h5>

        <div className="grid grid-cols-4 gap-2 text-xs">
          <button
            onClick={rotateCcw}
            className="flex flex-col items-center gap-1.5 p-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-sky-500 text-slate-300 transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-sky-400" />
            <span className="text-[11px]">-90°</span>
          </button>
          <button
            onClick={rotateCw}
            className="flex flex-col items-center gap-1.5 p-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-sky-500 text-slate-300 transition-colors"
          >
            <RotateCw className="w-4 h-4 text-sky-400" />
            <span className="text-[11px]">+90°</span>
          </button>
          <button
            onClick={toggleFlipH}
            className={`flex flex-col items-center gap-1.5 p-2.5 rounded-lg border transition-colors ${
              transform.flipH
                ? 'bg-sky-950/60 border-sky-500 text-sky-300'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <FlipHorizontal className="w-4 h-4 text-sky-400" />
            <span className="text-[11px]">Balik H</span>
          </button>
          <button
            onClick={toggleFlipV}
            className={`flex flex-col items-center gap-1.5 p-2.5 rounded-lg border transition-colors ${
              transform.flipV
                ? 'bg-sky-950/60 border-sky-500 text-sky-300'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <FlipVertical className="w-4 h-4 text-sky-400" />
            <span className="text-[11px]">Balik V</span>
          </button>
        </div>
      </div>

      {/* Watermark & Photographer Signature */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <Stamp className="w-4 h-4 text-sky-400" />
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Watermark / Tanda Tangan Anwar Photography
            </h5>
          </div>
          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400">
            <span>Tampilkan</span>
            <input
              type="checkbox"
              checked={watermark.enabled}
              onChange={(e) => updateWm('enabled', e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-sky-500 focus:ring-0 w-4 h-4 cursor-pointer"
            />
          </label>
        </div>

        {watermark.enabled && (
          <div className="space-y-3 text-xs">
            {/* Primary Text */}
            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Nama Fotografer / Brand</label>
              <input
                type="text"
                value={watermark.text}
                onChange={(e) => updateWm('text', e.target.value)}
                placeholder="Anwar Photography"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Subtext */}
            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Keterangan Kamera & Lensa (EXIF Badge)</label>
              <input
                type="text"
                value={watermark.subtext}
                onChange={(e) => updateWm('subtext', e.target.value)}
                placeholder="Nikon D3400 · Tokina 11-16mm f/2.8"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Position */}
            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Posisi Watermark</label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'bottom-right', label: 'Kanan Bawah' },
                  { id: 'bottom-left', label: 'Kiri Bawah' },
                  { id: 'top-right', label: 'Kanan Atas' },
                  { id: 'top-left', label: 'Kiri Atas' },
                ].map((pos) => (
                  <button
                    key={pos.id}
                    onClick={() => updateWm('position', pos.id as any)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-colors ${
                      watermark.position === pos.id
                        ? 'bg-sky-600 text-white'
                        : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {pos.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
