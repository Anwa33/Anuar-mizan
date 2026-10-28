/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw, Zap, Clock, Check } from 'lucide-react';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageSrc: string) => void;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onCapture,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [flash, setFlash] = useState(false);
  const [timerSec, setTimerSec] = useState<0 | 3 | 5>(0);
  const [countingDown, setCountingDown] = useState<number | null>(null);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const startCamera = async () => {
    setError(null);
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.error('Camera error:', err);
      setError('Tidak dapat mengakses kamera. Pastikan izin kamera aktif pada browser Anda.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const takeSnapshot = () => {
    if (timerSec > 0) {
      setCountingDown(timerSec);
      let rem = timerSec;
      const interval = setInterval(() => {
        rem -= 1;
        if (rem <= 0) {
          clearInterval(interval);
          setCountingDown(null);
          executeSnap();
        } else {
          setCountingDown(rem);
        }
      }, 1000);
    } else {
      executeSnap();
    }
  };

  const executeSnap = () => {
    const video = videoRef.current;
    if (!video) return;

    // Flash screen animation
    setFlash(true);
    setTimeout(() => setFlash(false), 200);

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);

    stopCamera();
    onCapture(dataUrl);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <div className="relative w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between p-4 bg-slate-900/80 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-sky-400" />
            <h3 className="text-sm font-bold text-white">Buka Kamera Langsung (Nikon Simulator)</h3>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder Area */}
        <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
          {error ? (
            <div className="p-6 text-center max-w-md">
              <Camera className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-sm text-red-400 font-medium mb-4">{error}</p>
              <button
                onClick={startCamera}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold"
              >
                Coba Lagi
              </button>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {/* Viewfinder Rule of Thirds Grid */}
              <div className="absolute inset-0 pointer-events-none viewfinder-grid opacity-75" />

              {/* Central Crosshair */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-12 h-12 border border-sky-400/60 rounded-sm flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-sky-400 rounded-full" />
                </div>
              </div>

              {/* Flash effect overlay */}
              {flash && <div className="absolute inset-0 bg-white pointer-events-none z-30 transition-opacity" />}

              {/* Countdown badge */}
              {countingDown !== null && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-20">
                  <span className="text-7xl font-extrabold text-white animate-ping">
                    {countingDown}
                  </span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Camera Control Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Timer Toggle */}
            <button
              onClick={() => setTimerSec(timerSec === 0 ? 3 : timerSec === 3 ? 5 : 0)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                timerSec > 0
                  ? 'bg-sky-950 border-sky-500 text-sky-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{timerSec === 0 ? 'Timer Mati' : `${timerSec}s`}</span>
            </button>

            {/* Switch Camera */}
            <button
              onClick={() => setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'))}
              className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white transition-colors"
              title="Ganti Kamera Depan/Belakang"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Shutter Button */}
          <button
            onClick={takeSnapshot}
            disabled={!!error}
            className="w-16 h-16 rounded-full border-4 border-white/80 p-1 bg-sky-500 hover:bg-sky-400 active:scale-95 transition-all flex items-center justify-center shadow-lg shadow-sky-500/30 disabled:opacity-50"
          >
            <div className="w-12 h-12 rounded-full bg-white shadow-inner flex items-center justify-center">
              <Camera className="w-6 h-6 text-slate-900" />
            </div>
          </button>

          <div className="w-24 text-right">
            <span className="text-[11px] font-mono text-slate-400">1080p FHD</span>
          </div>
        </div>
      </div>
    </div>
  );
};
