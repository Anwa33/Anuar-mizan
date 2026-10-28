/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';

interface PhoneSimulatorWrapperProps {
  children: React.ReactNode;
  currentTime?: string;
}

export const PhoneSimulatorWrapper: React.FC<PhoneSimulatorWrapperProps> = ({
  children,
  currentTime = '10:24',
}) => {
  return (
    <div className="relative mx-auto my-3 w-full max-w-[420px] rounded-[48px] p-3 bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.1)] border border-slate-700/80">
      {/* Outer Phone Bezel & Reflection */}
      <div className="relative rounded-[40px] bg-[#090d16] overflow-hidden border border-slate-800 flex flex-col h-[820px]">
        {/* Dynamic Island / Top Speaker & Camera Notch */}
        <div className="pt-3 px-7 flex items-center justify-between text-xs text-slate-300 font-semibold z-30 shrink-0 bg-[#090d16]/95 backdrop-blur-sm select-none">
          <span className="font-mono text-white tracking-tight">{currentTime}</span>

          {/* Notch Pill */}
          <div className="w-24 h-5 rounded-full bg-black border border-slate-800/80 flex items-center justify-end px-2">
            <div className="w-2 h-2 rounded-full bg-slate-900 border border-sky-500/40" />
          </div>

          {/* Status Icons */}
          <div className="flex items-center gap-1.5 text-slate-300">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <BatteryMedium className="w-4 h-4 text-emerald-400" />
          </div>
        </div>

        {/* Inner Phone Screen Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col">
          {children}
        </div>

        {/* Bottom Home Indicator Bar */}
        <div className="py-2.5 flex items-center justify-center shrink-0 bg-[#090d16] select-none">
          <div className="w-32 h-1 bg-slate-600/70 rounded-full" />
        </div>
      </div>
    </div>
  );
};
