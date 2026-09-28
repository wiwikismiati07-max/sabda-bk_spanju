import React from 'react';
import { Database, Download, Menu, Sparkles } from 'lucide-react';
import { GuruBkSelector } from './GuruBkSelector';
import { GuruBKProfile } from '../types';

interface DashboardHeaderProps {
  activeGuru: GuruBKProfile;
  onGuruChange: (guru: GuruBKProfile) => void;
  onOpenSupabaseModal: () => void;
  onOpenInstallModal: () => void;
  onToggleMobileMenu: () => void;
  isSupabaseConnected: boolean;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  activeGuru,
  onGuruChange,
  onOpenSupabaseModal,
  onOpenInstallModal,
  onToggleMobileMenu,
  isSupabaseConnected
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md">
      {/* Colorful Accent Top Border */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-rose-500 w-full" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        {/* Left: Mobile Menu Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl lg:hidden focus:outline-none"
            aria-label="Buka Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <img
              src="https://iili.io/KDFk4fI.png"
              alt="Logo SMPN 7 Pasuruan"
              className="w-10 h-10 object-contain drop-shadow"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-sm sm:text-base tracking-tight text-white leading-tight">
                  SABDA BK SPANJU
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold bg-blue-600/40 text-blue-300 border border-blue-500/30 rounded-full">
                  SMPN 7 PASURAN
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight hidden xs:block">
                (Sistem Administrasi BK Digital dan Akuntabel) • <span className="text-blue-400 italic">"Data Tertata, Layanan Berkualitas."</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Supabase Status Button */}
          <button
            type="button"
            onClick={onOpenSupabaseModal}
            title="Status Database Supabase Cloud"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              isSupabaseConnected
                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700/50 hover:bg-emerald-900/60'
                : 'bg-amber-950/60 text-amber-300 border-amber-700/50 hover:bg-amber-900/60'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {isSupabaseConnected ? 'Cloud Supabase' : 'Lokal / Offline'}
            </span>
            <span className={`w-2 h-2 rounded-full ${isSupabaseConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          </button>

          {/* Guru BK Profile Selector */}
          <GuruBkSelector activeGuru={activeGuru} onGuruChange={onGuruChange} />

          {/* Install PWA Button */}
          <button
            type="button"
            onClick={onOpenInstallModal}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-xs rounded-xl shadow transition-all transform hover:scale-[1.02]"
            title="Instal Aplikasi di HP / Laptop"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Instal App</span>
          </button>
        </div>
      </div>
    </header>
  );
};
