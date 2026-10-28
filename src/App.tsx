/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { PhotoAdjustments, ActiveToolTab, SampleImage, SavedEdit } from './types';
import { DEFAULT_ADJUSTMENTS, SAMPLE_IMAGES } from './data/presets';
import { PhoneSimulatorWrapper } from './components/PhoneSimulatorWrapper';
import { HomeDashboard } from './components/HomeDashboard';
import { WorkspaceEditor } from './components/WorkspaceEditor';
import { CameraCaptureModal } from './components/CameraCaptureModal';
import { ExportModal } from './components/ExportModal';
import { SettingsModal } from './components/SettingsModal';
import { AlbumModal } from './components/AlbumModal';
import {
  Camera,
  Smartphone,
  Monitor,
  Upload,
  Home,
  Sparkles,
  Images,
  Settings,
  Flame,
  Award,
} from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'editor'>('home');
  const [activeTab, setActiveTab] = useState<ActiveToolTab>('presets');
  const [isPhoneMode, setIsPhoneMode] = useState<boolean>(true); // Default to authentic smartphone simulator as in poster
  const [adjustments, setAdjustments] = useState<PhotoAdjustments>(DEFAULT_ADJUSTMENTS);

  // Loaded Source Image
  const [sourceImage, setSourceImage] = useState<HTMLImageElement | null>(null);
  const [selectedSampleId, setSelectedSampleId] = useState<string>(SAMPLE_IMAGES[0].id);

  // Modals
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAlbumOpen, setIsAlbumOpen] = useState(false);

  // Local saved edits
  const [savedEdits, setSavedEdits] = useState<SavedEdit[]>([]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load initial sample image on mount
  useEffect(() => {
    loadImageFromUrl(SAMPLE_IMAGES[0].url);
  }, []);

  const loadImageFromUrl = (url: string) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setSourceImage(img);
    };
    img.src = url;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          loadImageFromUrl(event.target.result as string);
          setSelectedSampleId('custom');
          setCurrentView('editor');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectSample = (sample: SampleImage) => {
    setSelectedSampleId(sample.id);
    loadImageFromUrl(sample.url);
  };

  const handleCameraCapture = (imageSrc: string) => {
    loadImageFromUrl(imageSrc);
    setSelectedSampleId('camera-capture');
    setCurrentView('editor');
  };

  const openToolDirectly = (tab: ActiveToolTab) => {
    setActiveTab(tab);
    setCurrentView('editor');
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col selection:bg-sky-500 selection:text-slate-950 font-sans">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Global Top Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-4 py-2.5 flex items-center justify-between shrink-0 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          {/* Logo with Camera Aperture */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-400 p-1 flex items-center justify-center text-slate-950 shadow-md shadow-sky-500/20">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-black text-base text-white tracking-tight">Anwar</span>
                <span className="font-extrabold text-base text-sky-400 tracking-wider">EDITOR</span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium block">
                Nikon D3400 + Tokina 11-16mm Studio
              </span>
            </div>
          </div>
        </div>

        {/* Center Mode Switcher: Phone Simulator vs Full Desktop Studio */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs">
          <button
            onClick={() => setIsPhoneMode(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              isPhoneMode
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Tampilan Ponsel Seperti Poster Promosi"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tampilan Ponsel</span>
          </button>
          <button
            onClick={() => setIsPhoneMode(false)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              !isPhoneMode
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Studio Layar Lebar Lengkap"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Studio Lebar</span>
          </button>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden md:inline">Unggah Foto</span>
          </button>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors cursor-pointer"
            title="Pengaturan & Profil Kamera"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main View Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {isPhoneMode ? (
          /* Phone Simulator View (Authentic Smartphone Mockup as in the User's Poster!) */
          <div className="flex-1 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
            <PhoneSimulatorWrapper>
              {/* App Content inside Phone */}
              {currentView === 'home' ? (
                <div className="flex-1 flex flex-col bg-[#090d16] text-white p-4">
                  {/* Phone Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400">
                        <Camera className="w-4 h-4" />
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="font-black text-sm text-white">Anwar</span>
                        <span className="font-extrabold text-xs text-sky-400">EDITOR</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsSettingsOpen(true)}
                      className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Home Content */}
                  <HomeDashboard
                    onStartEditing={() => setCurrentView('editor')}
                    onOpenGalleryUpload={() => fileInputRef.current?.click()}
                    onOpenCamera={() => setIsCameraOpen(true)}
                    onOpenPresets={() => openToolDirectly('presets')}
                    onOpenManual={() => openToolDirectly('manual')}
                    onOpenSplitTone={() => openToolDirectly('split-tone')}
                    onOpenOtherTools={() => openToolDirectly('noise')}
                    onSelectSample={handleSelectSample}
                    onOpenSettings={() => setIsSettingsOpen(true)}
                    selectedSampleId={selectedSampleId}
                  />

                  {/* Bottom Navigation Bar (as shown in phone mockup) */}
                  <div className="mt-auto pt-3 border-t border-slate-900 grid grid-cols-4 gap-1 text-center select-none shrink-0">
                    <button
                      onClick={() => setCurrentView('home')}
                      className="flex flex-col items-center gap-1 text-sky-400 py-1"
                    >
                      <Home className="w-4 h-4" />
                      <span className="text-[10px] font-bold">Beranda</span>
                    </button>
                    <button
                      onClick={() => openToolDirectly('presets')}
                      className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-200 py-1"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span className="text-[10px]">Preset</span>
                    </button>
                    <button
                      onClick={() => setIsAlbumOpen(true)}
                      className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-200 py-1"
                    >
                      <Images className="w-4 h-4" />
                      <span className="text-[10px]">Album</span>
                    </button>
                    <button
                      onClick={() => setIsSettingsOpen(true)}
                      className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-200 py-1"
                    >
                      <Settings className="w-4 h-4" />
                      <span className="text-[10px]">Pengaturan</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Workspace inside phone */
                <WorkspaceEditor
                  sourceImage={sourceImage}
                  adjustments={adjustments}
                  onChangeAdjustments={setAdjustments}
                  onBackToHome={() => setCurrentView('home')}
                  onOpenExport={() => setIsExportOpen(true)}
                  initialTab={activeTab}
                  isPhoneMode={true}
                />
              )}
            </PhoneSimulatorWrapper>
          </div>
        ) : (
          /* Full Screen Studio Workspace View (Desktop / Tablet) */
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            {currentView === 'home' ? (
              <div className="max-w-4xl mx-auto w-full p-6 overflow-y-auto">
                <HomeDashboard
                  onStartEditing={() => setCurrentView('editor')}
                  onOpenGalleryUpload={() => fileInputRef.current?.click()}
                  onOpenCamera={() => setIsCameraOpen(true)}
                  onOpenPresets={() => openToolDirectly('presets')}
                  onOpenManual={() => openToolDirectly('manual')}
                  onOpenSplitTone={() => openToolDirectly('split-tone')}
                  onOpenOtherTools={() => openToolDirectly('noise')}
                  onSelectSample={handleSelectSample}
                  onOpenSettings={() => setIsSettingsOpen(true)}
                  selectedSampleId={selectedSampleId}
                />
              </div>
            ) : (
              <WorkspaceEditor
                sourceImage={sourceImage}
                adjustments={adjustments}
                onChangeAdjustments={setAdjustments}
                onBackToHome={() => setCurrentView('home')}
                onOpenExport={() => setIsExportOpen(true)}
                initialTab={activeTab}
                isPhoneMode={false}
              />
            )}
          </div>
        )}
      </main>

      {/* Camera Capture Modal */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        sourceImage={sourceImage}
        adjustments={adjustments}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Album Modal */}
      <AlbumModal
        isOpen={isAlbumOpen}
        onClose={() => setIsAlbumOpen(false)}
        savedEdits={savedEdits}
        onLoadEdit={(item) => {
          loadImageFromUrl(item.thumbnail);
          setAdjustments(item.adjustments);
          setCurrentView('editor');
        }}
        onDeleteEdit={(id) => setSavedEdits((prev) => prev.filter((e) => e.id !== id))}
        onSelectSample={handleSelectSample}
      />
    </div>
  );
}
