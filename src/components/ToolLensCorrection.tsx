/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PhotoAdjustments } from '../types';
import { Camera, CheckCircle2, RotateCw, ZoomIn } from 'lucide-react';

interface ToolLensCorrectionProps {
  adjustments: PhotoAdjustments;
  onChange: (adjustments: PhotoAdjustments) => void;
}

export const ToolLensCorrection: React.FC<ToolLensCorrectionProps> = ({
  adjustments,
  onChange,
}) => {
  const { lensCorrection } = adjustments;

  const updateLens = (field: keyof typeof lensCorrection, value: any) => {
    onChange({
      ...adjustments,
      lensCorrection: {
        ...lensCorrection,
        [field]: value,
      },
    });
  };

  const applyTokinaPreset = () => {
    onChange({
      ...adjustments,
      lensCorrection: {
        enabled: true,
        profile: 'tokina-11-16',
        distortion: 22,
        vignetteCorrection: 35,
        chromaticAberration: 40,
      },
    });
  };

  return (
    <div className="space-y-5">
      {/* Tokina 11-16mm Special Badge Card */}
      <div className="bg-gradient-to-r from-sky-950/80 via-slate-900 to-sky-950/80 border border-sky-600/50 rounded-xl p-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 opacity-10">
          <Camera className="w-24 h-24 text-sky-400" />
        </div>
        <div className="relative z-10 flex items-start gap-3">
          <div className="p-2.5 bg-sky-500/20 border border-sky-400/40 rounded-xl text-sky-300 shrink-0">
            <Camera className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-500/30 text-sky-300">
                Profil Khusus
              </span>
              <span className="text-xs text-slate-400">Nikon DX APS-C</span>
            </div>
            <h4 className="text-base font-bold text-white mt-1">
              Tokina 11-16mm f/2.8 AT-X Pro DX
            </h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Koreksi distorsi geometris barel sudut ultra-lebar 11mm, hilangkan bayangan vignette di sudut foto, dan bersihkan aberasi kromatik.
            </p>
            <button
              onClick={applyTokinaPreset}
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors shadow-sm"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Kalibrasi Otomatis Tokina 11-16mm
            </button>
          </div>
        </div>
      </div>

      {/* Main Parameters */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Koreksi Optik Lensa
          </h5>
          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400">
            <span>Aktifkan Koreksi</span>
            <input
              type="checkbox"
              checked={lensCorrection.enabled}
              onChange={(e) => updateLens('enabled', e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-sky-500 focus:ring-0 w-4 h-4 cursor-pointer"
            />
          </label>
        </div>

        {/* Distortion Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-medium">Distorsi Barel (Straighten Distortion)</span>
            <span className="font-mono text-sky-400 font-semibold">
              {lensCorrection.distortion > 0 ? `+${lensCorrection.distortion}` : lensCorrection.distortion}
            </span>
          </div>
          <input
            type="range"
            min={-50}
            max={50}
            value={lensCorrection.distortion}
            onChange={(e) => updateLens('distortion', Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-[11px] text-slate-500">
            <span>-50 (Pincushion)</span>
            <span>0 (Normal)</span>
            <span>+50 (Luruskan Barel 11mm)</span>
          </div>
        </div>

        {/* Vignette Correction */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-medium">Koreksi Gelap Sudut (Vignette Removal)</span>
            <span className="font-mono text-sky-400 font-semibold">+{lensCorrection.vignetteCorrection}</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={lensCorrection.vignetteCorrection}
            onChange={(e) => updateLens('vignetteCorrection', Number(e.target.value))}
            className="w-full"
          />
          <p className="text-[11px] text-slate-500">
            Mencerahkan sudut gelap yang disebabkan oleh vignetting optik lensa saat memakai bukaan f/2.8.
          </p>
        </div>

        {/* Chromatic Aberration */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-medium">Koreksi Aberasi Kromatik (Fringe Removal)</span>
            <span className="font-mono text-sky-400 font-semibold">+{lensCorrection.chromaticAberration}</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={lensCorrection.chromaticAberration}
            onChange={(e) => updateLens('chromaticAberration', Number(e.target.value))}
            className="w-full"
          />
          <p className="text-[11px] text-slate-500">
            Menghilangkan garis ungu dan hijau (purple/green fringing) pada ranting pohon dan tepi langit dengan kontras tinggi.
          </p>
        </div>
      </div>
    </div>
  );
};
