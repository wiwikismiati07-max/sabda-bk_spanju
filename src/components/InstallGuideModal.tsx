import React, { useState, useEffect } from 'react';
import { Download, Smartphone, Monitor, Apple, Check, Sparkles, X } from 'lucide-react';

interface InstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt: any;
}

export const InstallGuideModal: React.FC<InstallGuideModalProps> = ({
  isOpen,
  onClose,
  deferredPrompt
}) => {
  const [activeTab, setActiveTab] = useState<'android' | 'ios' | 'desktop'>('android');
  const [installedSuccess, setInstalledSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (isIOS) setActiveTab('ios');
      else if (isMobile) setActiveTab('android');
      else setActiveTab('desktop');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePromptInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setInstalledSuccess(true);
        setTimeout(() => onClose(), 1500);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[88vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
          <div className="flex items-center gap-3">
            <img
              src="https://iili.io/KDFk4fI.png"
              alt="Logo SMPN 7"
              className="w-9 h-9 object-contain bg-white/10 p-1 rounded-xl"
            />
            <div>
              <h3 className="font-bold text-sm">Instal Aplikasi SABDA BK SPANJU</h3>
              <p className="text-[11px] text-blue-200">SMPN 7 Pasuruan • Siap HP & Laptop</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-blue-200 hover:text-white rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50">
          {deferredPrompt && (
            <button
              type="button"
              onClick={handlePromptInstall}
              className="w-full flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-sm rounded-2xl shadow-lg transition-all transform hover:scale-[1.01]"
            >
              <Sparkles className="w-4 h-4" />
              <span>{installedSuccess ? 'Berhasil Dipasang!' : 'PASANG SEKARANG (1-KLIK)'}</span>
            </button>
          )}

          {/* Device Tabs */}
          <div className="flex p-1 bg-slate-200 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('android')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'android' ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Android</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('ios')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'ios' ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Apple className="w-3.5 h-3.5" />
              <span>iPhone / iPad</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('desktop')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'desktop' ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Laptop / PC</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-3">
            {activeTab === 'android' && (
              <>
                <div className="font-bold text-slate-900 text-sm flex items-center gap-2 text-blue-700">
                  <Smartphone className="w-4 h-4" />
                  <span>Cara Pasang di HP Android (Google Chrome):</span>
                </div>
                <ol className="list-decimal pl-4 space-y-2">
                  <li>Buka browser <b>Google Chrome</b> di HP Anda.</li>
                  <li>Ketuk tombol <b>Titik Tiga (⋮)</b> di pojok kanan atas browser.</li>
                  <li>Pilih menu <b>"Tambahkan ke Layar Utama"</b> atau <b>"Instal Aplikasi"</b>.</li>
                  <li>Ketuk <b>"Instal"</b>. Aplikasi SABDA BK akan muncul di layar utama HP dengan ikon resmi logo sekolah.</li>
                </ol>
              </>
            )}

            {activeTab === 'ios' && (
              <>
                <div className="font-bold text-slate-900 text-sm flex items-center gap-2 text-blue-700">
                  <Apple className="w-4 h-4" />
                  <span>Cara Pasang di iPhone / iPad (Safari):</span>
                </div>
                <ol className="list-decimal pl-4 space-y-2">
                  <li>Buka aplikasi di browser <b>Safari</b>.</li>
                  <li>Ketuk tombol <b>Bagikan (Share)</b> di bilah bawah (ikon kotak dengan panah ke atas).</li>
                  <li>Geser ke bawah dan pilih <b>"Tambahkan ke Layar Utama" (Add to Home Screen)</b>.</li>
                  <li>Ketuk <b>"Tambah"</b> di sudut kanan atas.</li>
                </ol>
              </>
            )}

            {activeTab === 'desktop' && (
              <>
                <div className="font-bold text-slate-900 text-sm flex items-center gap-2 text-blue-700">
                  <Monitor className="w-4 h-4" />
                  <span>Cara Pasang di Laptop / Komputer (Chrome / Edge):</span>
                </div>
                <ol className="list-decimal pl-4 space-y-2">
                  <li>Lihat di sebelah kanan kolom URL (Address Bar) di bagian atas browser Anda.</li>
                  <li>Klik ikon <b>Komputer / Panah ke bawah (Instal SABDA BK SPANJU)</b>.</li>
                  <li>Klik tombol <b>"Instal"</b> pada pop-up konfirmasi.</li>
                  <li>Aplikasi akan langsung terbuka dalam jendela mandiri dan pintasan tersedia di Desktop.</li>
                </ol>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 flex justify-end bg-white">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
