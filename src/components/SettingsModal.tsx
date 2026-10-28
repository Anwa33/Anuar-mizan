/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Camera, X, Award, Info, Sliders, ShieldCheck } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-sky-400" />
            <h3 className="text-sm font-bold text-white">Pengaturan & Profil Kamera Anwar Editor</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Brand Info */}
          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-base font-black tracking-wider text-sky-400">Anwar EDITOR</span>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-sky-500/20 text-sky-300">
                Studio Pro
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              "Edit Foto Profesional - Mudah, Cepat, Hasil Maksimal. Karena Setiap Foto Punya Cerita · Your Photo, Our Passion."
            </p>
          </div>

          {/* Nikon D3400 Spec profile */}
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Award className="w-4 h-4 text-sky-400" />
              <span>Profil Sensor: Nikon D3400</span>
            </div>
            <ul className="text-[11px] text-slate-400 space-y-1 list-disc list-inside">
              <li>Sensor 24.2 MP DX-format CMOS tanpa optical low-pass filter (OLPF)</li>
              <li>Prosesor EXPEED 4 dengan dynamic range tinggi</li>
              <li>Kalibrasi warna Picture Control: Landscape, Neutral, Portrait & Monochrome</li>
            </ul>
          </div>

          {/* Tokina 11-16mm Spec profile */}
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Sliders className="w-4 h-4 text-sky-400" />
              <span>Profil Optik: Tokina AT-X 11-16mm f/2.8 PRO DX</span>
            </div>
            <ul className="text-[11px] text-slate-400 space-y-1 list-disc list-inside">
              <li>Sudut pandang ultra-lebar 104° pada 11mm (faktor crop 1.5x)</li>
              <li>Aperture konstan f/2.8 di seluruh rentang zoom</li>
              <li>Algoritma koreksi distorsi barel dan fringe aberasi kromatik terintegrasi</li>
            </ul>
          </div>

          {/* Engine features summary */}
          <div className="p-3 bg-sky-950/30 border border-sky-800/40 rounded-xl flex items-start gap-2.5 text-xs text-slate-300">
            <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white">Pemrosesan Kanvas Berkecepatan Tinggi:</span> Seluruh pengolahan foto dilakukan langsung secara real-time di perangkat Anda tanpa kompresi server, menjamin privasi dan resolusi penuh hingga 8K.
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs rounded-xl transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
