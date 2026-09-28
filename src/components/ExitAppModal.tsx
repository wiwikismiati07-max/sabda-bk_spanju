import React from 'react';
import { LogOut, ShieldCheck, ArrowRight, X } from 'lucide-react';
import { GuruBKProfile } from '../types';

interface ExitAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmExit: () => void;
  activeGuru: GuruBKProfile;
}

export const ExitAppModal: React.FC<ExitAppModalProps> = ({
  isOpen,
  onClose,
  onConfirmExit,
  activeGuru
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 text-center animate-in fade-in zoom-in-95 duration-150">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 shadow-sm border border-rose-100">
          <LogOut className="w-7 h-7" />
        </div>

        <h3 className="font-bold text-slate-900 text-lg mb-1">
          Keluar dari Aplikasi BK?
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Profil Guru BK: <span className="font-bold text-slate-800">{activeGuru.nama}</span>
        </p>

        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-xs text-emerald-800 text-left flex items-start gap-2.5 mb-5">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>Seluruh data administrasi bimbingan dan konseling Anda tersimpan aman di database Cloud Supabase SMPN 7 Pasuruan.</span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Batal / Tetap di Sini
          </button>
          <button
            type="button"
            onClick={onConfirmExit}
            className="flex-1 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <span>Ya, Keluar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const ExitScreen: React.FC<{ onReEnter: () => void }> = ({ onReEnter }) => {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-slate-800/80 border border-slate-700 p-8 rounded-3xl max-w-md w-full shadow-2xl space-y-5">
        <img
          src="https://iili.io/KDFk4fI.png"
          alt="Logo SMPN 7"
          className="w-20 h-20 mx-auto object-contain drop-shadow"
        />
        <div>
          <h2 className="text-xl font-extrabold text-white">SABDA BK SPANJU</h2>
          <p className="text-xs text-slate-400 mt-1">UPT SMP NEGERI 7 PASURUAN</p>
          <p className="text-xs text-blue-400 italic mt-0.5">"Data Tertata, Layanan Berkualitas."</p>
        </div>
        <div className="text-xs text-slate-300 py-3 px-4 bg-slate-900/60 rounded-2xl border border-slate-700/60">
          Sesi Anda telah ditutup dengan aman. Terima kasih telah mencatat layanan BK secara akuntabel.
        </div>
        <button
          type="button"
          onClick={onReEnter}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm rounded-2xl shadow-lg transition-all"
        >
          Buka / Masuk Aplikasi Kembali
        </button>
      </div>
    </div>
  );
};
