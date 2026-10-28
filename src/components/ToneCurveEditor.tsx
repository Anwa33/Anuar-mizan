/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { CurvePoint, ToneCurves } from '../types';

interface ToneCurveEditorProps {
  curves: ToneCurves;
  onChange: (curves: ToneCurves) => void;
}

type CurveChannel = 'rgb' | 'red' | 'green' | 'blue';

export const ToneCurveEditor: React.FC<ToneCurveEditorProps> = ({ curves, onChange }) => {
  const [activeChannel, setActiveChannel] = useState<CurveChannel>('rgb');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);

  const points = curves[activeChannel] || [{ x: 0, y: 0 }, { x: 255, y: 255 }];

  const channelColors: Record<CurveChannel, { stroke: string; fill: string; label: string }> = {
    rgb: { stroke: '#e2e8f0', fill: 'rgba(255,255,255,0.15)', label: 'RGB Total' },
    red: { stroke: '#ef4444', fill: 'rgba(239,68,68,0.15)', label: 'Merah (Red)' },
    green: { stroke: '#22c55e', fill: 'rgba(34,197,94,0.15)', label: 'Hijau (Green)' },
    blue: { stroke: '#3b82f6', fill: 'rgba(59,130,246,0.15)', label: 'Biru (Blue)' },
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Draw background grid (4x4)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let i = 1; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo((w / 4) * i, 0);
      ctx.lineTo((w / 4) * i, h);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, (h / 4) * i);
      ctx.lineTo(w, (h / 4) * i);
      ctx.stroke();
    }

    // Draw diagonal baseline
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(w, 0);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw tone curve line
    const colorInfo = channelColors[activeChannel];
    const sorted = [...points].sort((a, b) => a.x - b.x);

    ctx.beginPath();
    ctx.strokeStyle = colorInfo.stroke;
    ctx.lineWidth = 2.5;

    for (let px = 0; px <= w; px++) {
      const normX = (px / w) * 255;
      // Interpolate Y
      let yVal = normX;
      for (let i = 0; i < sorted.length - 1; i++) {
        if (normX >= sorted[i].x && normX <= sorted[i + 1].x) {
          const t = (normX - sorted[i].x) / (sorted[i + 1].x - sorted[i].x || 1);
          const smoothT = t * t * (3 - 2 * t);
          yVal = sorted[i].y + (sorted[i + 1].y - sorted[i].y) * smoothT;
          break;
        }
      }

      const py = h - (yVal / 255) * h;
      if (px === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Draw control point circles
    sorted.forEach((pt, i) => {
      const cx = (pt.x / 255) * w;
      const cy = h - (pt.y / 255) * h;

      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx.fillStyle = i === draggingIdx ? '#38bdf8' : colorInfo.stroke;
      ctx.fill();
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }, [points, activeChannel, draggingIdx]);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.max(0, Math.min(255, ((e.clientX - rect.left) / rect.width) * 255));
    const y = Math.max(0, Math.min(255, (1 - (e.clientY - rect.top) / rect.height) * 255));

    // Check if clicked close to an existing point
    let closestIdx = -1;
    let minDist = 30;
    points.forEach((pt, idx) => {
      const dist = Math.hypot(pt.x - x, pt.y - y);
      if (dist < minDist) {
        minDist = dist;
        closestIdx = idx;
      }
    });

    if (closestIdx !== -1) {
      setDraggingIdx(closestIdx);
    } else if (points.length < 8) {
      // Add new point
      const nextPoints = [...points, { x: Math.round(x), y: Math.round(y) }].sort((a, b) => a.x - b.x);
      onChange({
        ...curves,
        [activeChannel]: nextPoints,
      });
      setDraggingIdx(nextPoints.findIndex((p) => p.x === Math.round(x)));
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (draggingIdx === null) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.max(0, Math.min(255, ((e.clientX - rect.left) / rect.width) * 255));
    const y = Math.max(0, Math.min(255, (1 - (e.clientY - rect.top) / rect.height) * 255));

    const nextPoints = [...points];
    // Keep first point at x=0 and last at x=255 for standard curve stability
    if (draggingIdx === 0) {
      nextPoints[0] = { x: 0, y: Math.round(y) };
    } else if (draggingIdx === points.length - 1) {
      nextPoints[points.length - 1] = { x: 255, y: Math.round(y) };
    } else {
      nextPoints[draggingIdx] = { x: Math.round(x), y: Math.round(y) };
    }

    onChange({
      ...curves,
      [activeChannel]: nextPoints,
    });
  };

  const handlePointerUp = () => {
    setDraggingIdx(null);
  };

  const resetActiveCurve = () => {
    onChange({
      ...curves,
      [activeChannel]: [
        { x: 0, y: 0 },
        { x: 64, y: 55 },
        { x: 192, y: 200 },
        { x: 255, y: 255 },
      ],
    });
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
      {/* Channel Selector */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-1.5 p-1 bg-slate-950/80 rounded-lg">
          {(['rgb', 'red', 'green', 'blue'] as CurveChannel[]).map((ch) => (
            <button
              key={ch}
              onClick={() => setActiveChannel(ch)}
              className={`px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider transition-all ${
                activeChannel === ch
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {ch}
            </button>
          ))}
        </div>
        <button
          onClick={resetActiveCurve}
          className="text-xs text-slate-400 hover:text-sky-400 transition-colors"
        >
          Reset Kurva
        </button>
      </div>

      {/* Interactive Canvas */}
      <div className="relative aspect-square max-w-[280px] mx-auto bg-slate-950 border border-slate-800 rounded-lg overflow-hidden touch-none">
        <canvas
          ref={canvasRef}
          width={280}
          height={280}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="w-full h-full cursor-crosshair"
        />
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
        <span>Gelap (Shadows)</span>
        <span>Midtones</span>
        <span>Terang (Highlights)</span>
      </div>
      <p className="mt-1 text-[11px] text-slate-500 text-center">
        Klik kurva untuk menambah titik nada, geser titik untuk mengatur kontras kurva S.
      </p>
    </div>
  );
};
