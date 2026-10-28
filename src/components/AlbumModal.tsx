/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SavedEdit, SampleImage } from '../types';
import { SAMPLE_IMAGES } from '../data/presets';
import { Images, X, Trash2, Edit3, ArrowRight, Camera } from 'lucide-react';

interface AlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedEdits: SavedEdit[];
  onLoadEdit: (edit: SavedEdit) => void;
  onDeleteEdit: (id: string) => void;
  onSelectSample: (sample: SampleImage) => void;
}

export const AlbumModal: React.FC<AlbumModalProps> = ({
  isOpen,
  onClose,
  savedEdits,
  onLoadEdit,
  onDeleteEdit,
  onSelectSample,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Images className="w-5 h-5 text-sky-400" />
            <h3 className="text-sm font-bold text-white">Album & Galeri Proyek Anwar Editor</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-6 overflow-y-auto">
          {/* Recent Saved Edits Section */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Riwayat Foto Tersimpan ({savedEdits.length})
            </h4>

            {savedEdits.length === 0 ? (
              <div className="p-6 bg-slate-900/40 border border-dashed border-slate-800 rounded-xl text-center">
                <Images className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-400 font-medium">
                  Belum ada foto tersimpan di album. Klik tombol Simpan di atas untuk menyimpan hasil editan Anda.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {savedEdits.map((item) => (
                  <div
                    key={item.id}
                    className="group relative rounded-xl overflow-hidden border border-slate-800 bg-slate-900 flex flex-col"
                  >
                    <div className="aspect-[4/3] bg-black relative">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => onDeleteEdit(item.id)}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-red-600/80 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="p-2.5 flex items-center justify-between">
                      <div className="truncate">
                        <div className="text-xs font-bold text-white truncate">{item.title}</div>
                        <div className="text-[10px] text-slate-400">{item.date}</div>
                      </div>
                      <button
                        onClick={() => {
                          onLoadEdit(item);
                          onClose();
                        }}
                        className="p-1.5 rounded-lg bg-sky-600/20 text-sky-400 hover:bg-sky-600 hover:text-white transition-colors"
                        title="Lanjutkan Edit"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Master Sample Gallery */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Galeri Sampel DSLR Nikon D3400 + Tokina
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {SAMPLE_IMAGES.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => {
                    onSelectSample(sample);
                    onClose();
                  }}
                  className="group relative rounded-xl overflow-hidden border border-slate-800 hover:border-sky-500 text-left aspect-[4/3] flex flex-col justify-end p-2.5 transition-all"
                >
                  <img
                    src={sample.url}
                    alt={sample.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                  <div className="relative z-10">
                    <span className="text-[9px] font-bold uppercase text-sky-400 block truncate">
                      {sample.category}
                    </span>
                    <span className="text-xs font-bold text-white block truncate">
                      {sample.title}
                    </span>
                    <span className="text-[10px] text-slate-300 block truncate mt-0.5">
                      {sample.lensInfo}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
