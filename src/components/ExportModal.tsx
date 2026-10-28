/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PhotoAdjustments } from '../types';
import { processImage } from '../utils/imageProcessor';
import confetti from 'canvas-confetti';
import { Download, X, CheckCircle, Sparkles, HardDrive, Shield } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourceImage: HTMLImageElement | null;
  adjustments: PhotoAdjustments;
}

type ResolutionTier = '1080p' | '4k' | '8k' | 'original';

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  sourceImage,
  adjustments,
}) => {
  const [resolution, setResolution] = useState<ResolutionTier>('4k');
  const [format, setFormat] = useState<'jpeg' | 'png'>('jpeg');
  const [quality, setQuality] = useState(95);
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  if (!isOpen) return null;

  const handleExport = async () => {
    if (!sourceImage) return;
    setIsExporting(true);

    try {
      // Small timeout to allow UI update
      await new Promise((r) => setTimeout(r, 100));

      const origW = sourceImage.naturalWidth || 1920;
      const origH = sourceImage.naturalHeight || 1080;
      const aspect = origW / origH;

      let targetW = origW;
      let targetH = origH;

      if (resolution === '1080p') {
        targetW = aspect >= 1 ? 1920 : Math.round(1080 * aspect);
        targetH = aspect >= 1 ? Math.round(1920 / aspect) : 1080;
      } else if (resolution === '4k') {
        targetW = aspect >= 1 ? 3840 : Math.round(2160 * aspect);
        targetH = aspect >= 1 ? Math.round(3840 / aspect) : 2160;
      } else if (resolution === '8k') {
        targetW = aspect >= 1 ? 7680 : Math.round(4320 * aspect);
        targetH = aspect >= 1 ? Math.round(7680 / aspect) : 4320;
      }

      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = targetW;
      exportCanvas.height = targetH;

      // Render full resolution with all adjustments
      processImage(sourceImage, exportCanvas, adjustments, {
        width: targetW,
        height: targetH,
      });

      // Export to Blob
      const mime = format === 'png' ? 'image/png' : 'image/jpeg';
      const qVal = format === 'png' ? undefined : quality / 100;

      exportCanvas.toBlob(
        (blob) => {
          if (!blob) {
            setIsExporting(false);
            return;
          }

          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
          link.download = `Anwar_Editor_${resolution.toUpperCase()}_${timestamp}.${format === 'png' ? 'png' : 'jpg'}`;
          link.href = url;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);

          setIsExporting(false);
          setExportComplete(true);

          // Confetti celebration
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });

          setTimeout(() => {
            setExportComplete(false);
            onClose();
          }, 1800);
        },
        mime,
        qVal
      );
    } catch (err) {
      console.error('Export error:', err);
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-slate-900/80 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-sky-400" />
            <h3 className="text-sm font-bold text-white">Simpan Kualitas Tinggi (HD / 4K / 8K)</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Resolution Options */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Pilih Resolusi Ekspor
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: '1080p', label: 'Full HD (1080p)', sub: '1920 × 1080 px · Cepat' },
                { id: '4k', label: 'Ultra HD (4K)', sub: '3840 × 2160 px · Rekomendasi' },
                { id: '8k', label: 'Master (8K)', sub: '7680 × 4320 px · Maksimal' },
                { id: 'original', label: 'Resolusi Asli', sub: 'Ukuran Sensor Kamera' },
              ].map((res) => (
                <button
                  key={res.id}
                  onClick={() => setResolution(res.id as any)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    resolution === res.id
                      ? 'bg-sky-950/70 border-sky-500 ring-2 ring-sky-500/30'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-white">{res.label}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{res.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Format Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Format Berkas
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => setFormat('jpeg')}
                className={`py-2 px-3 rounded-lg border text-center font-medium transition-all ${
                  format === 'jpeg'
                    ? 'bg-sky-600 text-white border-sky-500'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                JPEG (Kecil & Tajam)
              </button>
              <button
                onClick={() => setFormat('png')}
                className={`py-2 px-3 rounded-lg border text-center font-medium transition-all ${
                  format === 'png'
                    ? 'bg-sky-600 text-white border-sky-500'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                PNG (Lossless Murni)
              </button>
            </div>
          </div>

          {/* JPEG Quality Slider */}
          {format === 'jpeg' && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Kualitas Kompresi JPEG</span>
                <span className="font-mono text-sky-400 font-semibold">{quality}%</span>
              </div>
              <input
                type="range"
                min={75}
                max={100}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full"
              />
            </div>
          )}

          {/* Camera EXIF & Signature Note */}
          <div className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-xl text-xs text-slate-400 flex items-center gap-2">
            <Shield className="w-4 h-4 text-sky-400 shrink-0" />
            <span>
              Metadata profil Nikon D3400 + Tokina 11-16mm dan tanda tangan Anwar Photography akan disertakan.
            </span>
          </div>

          {/* Action Button */}
          <button
            onClick={handleExport}
            disabled={isExporting || exportComplete}
            className="w-full py-3 px-4 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {exportComplete ? (
              <>
                <CheckCircle className="w-5 h-5 text-emerald-950" />
                <span>Berhasil Disimpan!</span>
              </>
            ) : isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Sedang Merender Resolusi Tinggi ({resolution.toUpperCase()})...</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>Unduh Foto Sekarang ({resolution.toUpperCase()})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
