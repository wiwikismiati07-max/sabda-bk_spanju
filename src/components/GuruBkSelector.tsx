import React, { useState } from 'react';
import { User, Check, ChevronDown } from 'lucide-react';
import { DAFTAR_GURU_BK, setActiveGuruBK } from '../lib/guruBk';
import { GuruBKProfile } from '../types';

interface GuruBkSelectorProps {
  activeGuru: GuruBKProfile;
  onGuruChange: (guru: GuruBKProfile) => void;
}

export const GuruBkSelector: React.FC<GuruBkSelectorProps> = ({ activeGuru, onGuruChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (guru: GuruBKProfile) => {
    setActiveGuruBK(guru);
    onGuruChange(guru);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700/80 text-white rounded-xl border border-slate-700 text-xs transition-all shadow-sm"
      >
        <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-white shadow-inner">
          <User className="w-3.5 h-3.5" />
        </div>
        <div className="text-left hidden md:block">
          <div className="font-bold text-white text-xs truncate max-w-[140px]">{activeGuru.nama}</div>
          <div className="text-[10px] text-slate-300">Guru BK / Konselor</div>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="px-3 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
              Pilih Profil Guru BK / Konselor
            </div>
            <div className="mt-1 space-y-1">
              {DAFTAR_GURU_BK.map(guru => {
                const isSelected = guru.nip === activeGuru.nip;
                return (
                  <button
                    key={guru.nip}
                    type="button"
                    onClick={() => handleSelect(guru)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all ${
                      isSelected
                        ? 'bg-blue-50 text-blue-900 font-bold border border-blue-200'
                        : 'hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold">{guru.nama}</div>
                      <div className="text-[11px] text-slate-500 font-normal">NIP. {guru.nip}</div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
