import React, { useState, useEffect } from 'react';
import { Database, CheckCircle2, AlertCircle, Copy, Check, RefreshCw, X, ShieldAlert } from 'lucide-react';
import {
  getSavedSupabaseConfig,
  saveSupabaseConfig,
  generateSupabaseSetupSQL,
  getSupabaseClient,
  DEFAULT_SUPABASE_URL,
  DEFAULT_SUPABASE_ANON_KEY
} from '../lib/supabase';

interface SupabaseSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigUpdated?: () => void;
}

export const SupabaseSettingsModal: React.FC<SupabaseSettingsModalProps> = ({
  isOpen,
  onClose,
  onConfigUpdated
}) => {
  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [tableStatus, setTableStatus] = useState<Record<string, boolean> | null>(null);
  const [copiedSQL, setCopiedSQL] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const config = getSavedSupabaseConfig();
      setUrl(config.url);
      setAnonKey(config.anonKey);
      setTableStatus(null);
      setSaveSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const testTables = async () => {
    setIsTesting(true);
    const client = getSupabaseClient();
    const tables = [
      'siswa_bk', 'agenda_kerja_bk', 'undangan_orang_tua', 'home_visit_bk',
      'rekam_permasalahan_siswa', 'rencana_konseling_individu', 'rencana_konseling_kelompok',
      'surat_pernyataan_siswa', 'konferensi_kasus_siswa', 'siswa_ats_bk', 'signatures_bk'
    ];

    const results: Record<string, boolean> = {};

    if (client) {
      for (const t of tables) {
        try {
          const { error } = await client.from(t).select('id', { count: 'exact', head: true });
          results[t] = !error;
        } catch {
          results[t] = false;
        }
      }
    } else {
      tables.forEach(t => results[t] = false);
    }

    setTableStatus(results);
    setIsTesting(false);
  };

  const handleSave = () => {
    saveSupabaseConfig(url, anonKey);
    setSaveSuccess(true);
    if (onConfigUpdated) onConfigUpdated();
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1000);
  };

  const handleResetToDefault = () => {
    setUrl(DEFAULT_SUPABASE_URL);
    setAnonKey(DEFAULT_SUPABASE_ANON_KEY);
    saveSupabaseConfig(DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_ANON_KEY);
    setSaveSuccess(true);
    if (onConfigUpdated) onConfigUpdated();
  };

  const handleCopySQL = () => {
    const sql = generateSupabaseSetupSQL();
    navigator.clipboard.writeText(sql);
    setCopiedSQL(true);
    setTimeout(() => setCopiedSQL(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base">Konfigurasi Database Supabase Cloud</h3>
              <p className="text-xs text-slate-300">SABDA BK SPANJU - SMPN 7 Pasuruan</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-slate-50">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-900 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold mb-0.5">Database Multiuser Otomatis & Permanen:</div>
              Aplikasi telah terhubung langsung dengan server database Supabase SMPN 7 Pasuruan. Seluruh data disimpan dan disinkronkan secara real-time ke semua perangkat (Laptop & Handphone).
            </div>
          </div>

          <div className="space-y-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                Supabase Project URL
              </label>
              <input
                type="text"
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="https://xyz.supabase.co"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                Supabase Anon Key / Public Key
              </label>
              <input
                type="password"
                value={anonKey}
                onChange={e => setAnonKey(e.target.value)}
                placeholder="sb_publishable_..."
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono text-slate-900"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleResetToDefault}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline"
              >
                Reset ke Default SMPN 7
              </button>

              <button
                type="button"
                onClick={testTables}
                disabled={isTesting}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                <span>Uji Koneksi 11 Tabel</span>
              </button>
            </div>
          </div>

          {/* Table Testing Results */}
          {tableStatus && (
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="text-xs font-bold text-slate-800 mb-2">Status 11 Tabel Database:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {Object.entries(tableStatus).map(([tbl, ok]) => (
                  <div key={tbl} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="font-mono text-[11px] text-slate-700 truncate">{tbl}</span>
                    {ok ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Ada
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                        <AlertCircle className="w-3 h-3" /> Belum
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SQL Generator */}
          <div className="bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-between">
            <div>
              <div className="font-bold text-xs">Skrip SQL Pembuatan Tabel Supabase</div>
              <div className="text-[11px] text-slate-400">Jalankan di Supabase Dashboard ➔ SQL Editor jika tabel baru belum ada.</div>
            </div>
            <button
              type="button"
              onClick={handleCopySQL}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 rounded-xl transition-colors shadow-sm shrink-0"
            >
              {copiedSQL ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSQL ? 'Tersalin!' : 'Salin SQL Script'}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-white">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-all"
          >
            {saveSuccess ? <Check className="w-4 h-4" /> : null}
            <span>{saveSuccess ? 'Tersimpan & Terhubung!' : 'Simpan & Terapkan'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
