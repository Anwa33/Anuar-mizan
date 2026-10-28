/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { PhotoAdjustments, ActiveToolTab } from '../types';
import { processImage, calculateAutoEnhance } from '../utils/imageProcessor';
import { ToolPresets } from './ToolPresets';
import { ToolSplitTone } from './ToolSplitTone';
import { ToolManualPro } from './ToolManualPro';
import { ToolNoiseReduction } from './ToolNoiseReduction';
import { ToolBackground } from './ToolBackground';
import { ToolLensCorrection } from './ToolLensCorrection';
import { ToolHSL } from './ToolHSL';
import { ToneCurveEditor } from './ToneCurveEditor';
import { ToolCropWatermark } from './ToolCropWatermark';
import {
  Sparkles,
  Layers,
  Sliders,
  ShieldCheck,
  Image as ImageIcon,
  Camera,
  Palette,
  Activity,
  Crop,
  Stamp,
  RotateCcw,
  Undo2,
  Redo2,
  Wand2,
  Eye,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Download,
  ArrowLeft,
  SplitSquareVertical,
} from 'lucide-react';

interface WorkspaceEditorProps {
  sourceImage: HTMLImageElement | null;
  adjustments: PhotoAdjustments;
  onChangeAdjustments: (adj: PhotoAdjustments) => void;
  onBackToHome: () => void;
  onOpenExport: () => void;
  initialTab?: ActiveToolTab;
  isPhoneMode: boolean;
}

export const WorkspaceEditor: React.FC<WorkspaceEditorProps> = ({
  sourceImage,
  adjustments,
  onChangeAdjustments,
  onBackToHome,
  onOpenExport,
  initialTab = 'presets',
  isPhoneMode,
}) => {
  const [activeTab, setActiveTab] = useState<ActiveToolTab>(initialTab);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>('tokina-vibrant');
  const [splitRatio, setSplitRatio] = useState<number>(1); // 1 = full edit, 0.5 = 50% split
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [history, setHistory] = useState<PhotoAdjustments[]>([adjustments]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const isDraggingSplitRef = useRef<boolean>(false);

  // Update canvas rendering whenever adjustments or split changes
  useEffect(() => {
    if (!sourceImage || !canvasRef.current) return;
    const canvas = canvasRef.current;

    processImage(sourceImage, canvas, adjustments, {
      beforeAfterSplit: splitRatio < 1 ? splitRatio : undefined,
      showBeforeAfterLabels: splitRatio < 1,
    });
  }, [sourceImage, adjustments, splitRatio]);

  // Handle Adjustment change with undo/redo history tracking
  const handleAdjustmentsChange = (nextAdj: PhotoAdjustments) => {
    onChangeAdjustments(nextAdj);

    // Debounced history record
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(nextAdj);
    if (newHistory.length > 30) newHistory.shift();
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      onChangeAdjustments(prev);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      onChangeAdjustments(next);
    }
  };

  const handleAutoEnhance = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    const imgData = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
    const autoAdj = calculateAutoEnhance(imgData);

    handleAdjustmentsChange({
      ...adjustments,
      ...autoAdj,
      bgTone: {
        ...adjustments.bgTone,
        ...(autoAdj.bgTone || {}),
      },
      subjectTone: {
        ...adjustments.subjectTone,
        ...(autoAdj.subjectTone || {}),
      },
      lensCorrection: {
        ...adjustments.lensCorrection,
        ...(autoAdj.lensCorrection || {}),
      },
    });
  };

  // Draggable split bar on canvas
  const handleCanvasPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (splitRatio >= 1) return;
    isDraggingSplitRef.current = true;
    updateSplitFromPointer(e.clientX);
  };

  const handleCanvasPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingSplitRef.current) return;
    updateSplitFromPointer(e.clientX);
  };

  const handleCanvasPointerUp = () => {
    isDraggingSplitRef.current = false;
  };

  const updateSplitFromPointer = (clientX: number) => {
    if (!canvasContainerRef.current) return;
    const rect = canvasContainerRef.current.getBoundingClientRect();
    const ratio = Math.max(0.05, Math.min(0.95, (clientX - rect.left) / rect.width));
    setSplitRatio(ratio);
  };

  // Custom Background Upload
  const handleCustomBgUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        handleAdjustmentsChange({
          ...adjustments,
          bgReplace: {
            ...adjustments.bgReplace,
            activeType: 'custom',
            customUrl: e.target.result as string,
          },
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const toolTabs: { id: ActiveToolTab; label: string; icon: any; color: string }[] = [
    { id: 'presets', label: '1000+ Preset', icon: Sparkles, color: 'text-pink-400' },
    { id: 'split-tone', label: 'Tone Terpisah', icon: Layers, color: 'text-sky-400' },
    { id: 'noise', label: 'Penghilang Noise', icon: ShieldCheck, color: 'text-emerald-400' },
    { id: 'lens', label: 'Koreksi Lensa', icon: Camera, color: 'text-amber-400' },
    { id: 'manual', label: 'Manual Pro', icon: Sliders, color: 'text-blue-400' },
    { id: 'background', label: 'Ganti Latar', icon: ImageIcon, color: 'text-purple-400' },
    { id: 'hsl', label: 'Warna HSL', icon: Palette, color: 'text-orange-400' },
    { id: 'curves', label: 'Kurva Nada', icon: Activity, color: 'text-teal-400' },
    { id: 'crop', label: 'Potong & Watermark', icon: Crop, color: 'text-rose-400' },
  ];

  return (
    <div className={`flex flex-col h-full bg-[#080c14] ${isPhoneMode ? 'text-xs' : 'text-sm'}`}>
      {/* Top Workspace Bar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-950 border-b border-slate-800/80 shrink-0 z-20">
        <div className="flex items-center gap-2">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors text-xs font-semibold cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Beranda</span>
          </button>

          {/* Undo / Redo */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800/80 rounded-lg p-0.5">
            <button
              onClick={undo}
              disabled={historyIndex <= 0}
              className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
              title="Undo (Kembalikan)"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
              title="Redo (Ulangi)"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Center Title or Quick Badge */}
        {!isPhoneMode && (
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-sky-400">Anwar Editor</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-300">Nikon D3400 + Tokina 11-16mm f/2.8</span>
          </div>
        )}

        <div className="flex items-center gap-1.5">
          {/* Auto Enhance */}
          <button
            onClick={handleAutoEnhance}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 transition-colors text-xs font-semibold cursor-pointer"
            title="Penyelarasan Dinamis Otomatis Satu Klik"
          >
            <Wand2 className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Auto Enhance</span>
          </button>

          {/* Export CTA */}
          <button
            onClick={onOpenExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 transition-colors text-xs font-bold shadow-sm shadow-sky-500/30 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Simpan</span>
          </button>
        </div>
      </div>

      {/* Main Content Layout (Flex responsive: Desktop side-by-side or Phone stacked) */}
      <div className={`flex-1 flex overflow-hidden ${isPhoneMode ? 'flex-col' : 'flex-col lg:flex-row'}`}>
        {/* Canvas Display Viewport */}
        <div
          ref={canvasContainerRef}
          onPointerDown={handleCanvasPointerDown}
          onPointerMove={handleCanvasPointerMove}
          onPointerUp={handleCanvasPointerUp}
          className="relative flex-1 bg-[#05070d] flex items-center justify-center p-3 overflow-hidden select-none touch-none min-h-[260px]"
        >
          {/* Center Canvas */}
          <div
            className="relative max-w-full max-h-full flex items-center justify-center transition-transform"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <canvas
              ref={canvasRef}
              className="max-w-full max-h-[60vh] lg:max-h-[75vh] w-auto h-auto object-contain rounded-lg shadow-2xl border border-slate-800/80"
            />
          </div>

          {/* Floating Canvas Controls (Bottom Overlay) */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 p-1 bg-slate-950/90 border border-slate-800/90 rounded-xl backdrop-blur-md shadow-xl text-xs z-10">
            {/* Split Screen Toggle */}
            <button
              onClick={() => setSplitRatio(splitRatio < 1 ? 1 : 0.5)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors ${
                splitRatio < 1
                  ? 'bg-sky-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Perbandingan Sebelum & Sesudah"
            >
              <SplitSquareVertical className="w-3.5 h-3.5" />
              <span>Sebelum/Sesudah</span>
            </button>

            <div className="w-px h-4 bg-slate-800" />

            {/* Zoom Controls */}
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.2))}
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[11px] text-slate-400 px-1">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.2))}
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white text-[10px]"
              title="Reset Zoom"
            >
              Fit
            </button>
          </div>
        </div>

        {/* Editing Tools Drawer / Panel */}
        <div
          className={`bg-slate-950 border-slate-800 flex flex-col ${
            isPhoneMode
              ? 'h-[360px] border-t shrink-0'
              : 'w-full lg:w-[440px] xl:w-[480px] border-t lg:border-t-0 lg:border-l shrink-0'
          }`}
        >
          {/* Tool Selector Tabs (Horizontal scrolling pills) */}
          <div className="flex gap-1.5 p-2.5 overflow-x-auto no-scrollbar border-b border-slate-800/80 bg-slate-950 shrink-0">
            {toolTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                      : 'bg-slate-900 border border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : tab.color}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Tool Sub-Panel Area (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activeTab === 'presets' && (
              <ToolPresets
                adjustments={adjustments}
                onChange={handleAdjustmentsChange}
                selectedPresetId={selectedPresetId}
                onSelectPresetId={setSelectedPresetId}
              />
            )}

            {activeTab === 'split-tone' && (
              <ToolSplitTone
                adjustments={adjustments}
                onChange={handleAdjustmentsChange}
              />
            )}

            {activeTab === 'noise' && (
              <ToolNoiseReduction
                adjustments={adjustments}
                onChange={handleAdjustmentsChange}
                splitRatio={splitRatio}
                onSplitChange={setSplitRatio}
              />
            )}

            {activeTab === 'lens' && (
              <ToolLensCorrection
                adjustments={adjustments}
                onChange={handleAdjustmentsChange}
              />
            )}

            {activeTab === 'manual' && (
              <ToolManualPro
                adjustments={adjustments}
                onChange={handleAdjustmentsChange}
              />
            )}

            {activeTab === 'background' && (
              <ToolBackground
                adjustments={adjustments}
                onChange={handleAdjustmentsChange}
                onCustomBgUpload={handleCustomBgUpload}
              />
            )}

            {activeTab === 'hsl' && (
              <ToolHSL
                adjustments={adjustments}
                onChange={handleAdjustmentsChange}
              />
            )}

            {activeTab === 'curves' && (
              <ToneCurveEditor
                curves={adjustments.curves}
                onChange={(nextCurves) =>
                  handleAdjustmentsChange({
                    ...adjustments,
                    curves: nextCurves,
                  })
                }
              />
            )}

            {activeTab === 'crop' && (
              <ToolCropWatermark
                adjustments={adjustments}
                onChange={handleAdjustmentsChange}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
