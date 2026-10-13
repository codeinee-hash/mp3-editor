import React from 'react'
import { Music, ShieldCheck, Zap } from 'lucide-react'

export const Header: React.FC = () => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Music className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-white tracking-tight">MP3 Tag Studio</span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">
                Web ID3 Editor
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Редактор метаданных и обложек MP3 прямо в браузере
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-400">
          <div className="hidden md:flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/50">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Конфиденциально (в браузере)</span>
          </div>
          <div className="hidden lg:flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/50">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Без перекодирования (Lossless)</span>
          </div>
        </div>
      </div>
    </header>
  )
}
