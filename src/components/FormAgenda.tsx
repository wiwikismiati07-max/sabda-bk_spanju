import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Sparkles, Check, Image as ImageIcon, RotateCcw } from 'lucide-react';
import { AgendaKerjaItem, SiswaBK } from '../types';
import { compressImageFile } from '../lib/imageCompressor';
import { SiswaSelector, DAFTAR_KELAS_24 } from './SiswaSelector';

interface FormAgendaProps {
  initialData?: AgendaKerjaItem | null;
  onSubmit: (data: AgendaKerjaItem) => Promise<void>;
  onCancelEdit?: () => void;
  isSubmitting?: boolean;
  students?: SiswaBK[];
}

export const PRESET_WAKTU_AGENDA = [
  '07.15-07.55 WIB',
  '07.55-08.35 WIB',
  '08.35-09.15 WIB',
  '09.15-09.55 WIB',
  '10.35-11.15 WIB',
  '11.15-11.55 WIB',
  '11.55-12.35 WIB',
  '12.35-13.15 WIB'
];

export const PRESET_SASARAN_AGENDA = [
  'SELURUH SISWA 7,8,9',
  'Seluruh Siswa Kelas 7',
  'Seluruh Siswa Kelas 8',
  'Seluruh Siswa Kelas 9',
  'Konselor / Guru BK',
  ...DAFTAR_KELAS_24.map(k => `Siswa Kelas ${k}`)
];

const NAMA_HARI_INDONESIA = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const NAMA_BULAN_INDONESIA = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export const FormAgenda: React.FC<FormAgendaProps> = ({
  initialData,
  onSubmit,
  onCancelEdit,
  isSubmitting = false,
  students = []
}) => {
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [waktu, setWaktu] = useState(PRESET_WAKTU_AGENDA[0]);
  const [uraianKegiatan, setUraianKegiatan] = useState('');
  const [sasaran, setSasaran] = useState('Seluruh Siswa Kelas 7');
  const [linkFotoKegiatan, setLinkFotoKegiatan] = useState('');
  const [keterangan, setKeterangan] = useState('Terlaksana');
  const [uploadingImg, setUploadingImg] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTanggal(initialData.tanggal || new Date().toISOString().split('T')[0]);
      setWaktu(initialData.waktu || PRESET_WAKTU_AGENDA[0]);
      setUraianKegiatan(initialData.uraian_kegiatan || '');
      setSasaran(initialData.sasaran || '');
      setLinkFotoKegiatan(initialData.link_foto_kegiatan || '');
      setKeterangan(initialData.keterangan || 'Terlaksana');
    } else {
      setTanggal(new Date().toISOString().split('T')[0]);
      setWaktu(PRESET_WAKTU_AGENDA[0]);
      setUraianKegiatan('');
      setSasaran('Seluruh Siswa Kelas 7');
      setLinkFotoKegiatan('');
      setKeterangan('Terlaksana');
    }
  }, [initialData]);

  // Compute Hari, Bulan, Tahun
  const dateObj = new Date(tanggal);
  const calculatedHari = NAMA_HARI_INDONESIA[dateObj.getDay()] || 'Senin';
  const calculatedBulan = NAMA_BULAN_INDONESIA[dateObj.getMonth()] || 'September';
  const calculatedTahun = String(dateObj.getFullYear() || '2026');

  const handleSetToday = () => {
    setTanggal(new Date().toISOString().split('T')[0]);
  };

  const handleUseRealtimeNow = () => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    setWaktu(`${hh}.${mm} WIB`);
  };

  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImg(true);
    try {
      const compressed = await compressImageFile(file);
      setLinkFotoKegiatan(compressed);
    } catch (err) {
      console.error('Error compressing image', err);
    } finally {
      setUploadingImg(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uraianKegiatan.trim() || !sasaran.trim()) return;

    const payload: AgendaKerjaItem = {
      id: initialData?.id,
      hari: calculatedHari,
      tanggal,
      bulan: calculatedBulan,
      tahun: calculatedTahun,
      waktu,
      uraian_kegiatan: uraianKegiatan.trim(),
      sasaran: sasaran.trim(),
      link_foto_kegiatan: linkFotoKegiatan,
      keterangan: keterangan.trim()
    };

    await onSubmit(payload);
    if (!initialData) {
      setUraianKegiatan('');
      setLinkFotoKegiatan('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span>{initialData ? 'Edit Agenda Kerja BK' : 'Form Input Agenda Kerja BK'}</span>
          </h2>
          <p className="text-xs text-slate-500">Pencatatan kegiatan harian bimbingan konseling</p>
        </div>
        {initialData && onCancelEdit && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Batal Edit
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. Tanggal */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              Tanggal Pelaksanaan
            </label>
            <button
              type="button"
              onClick={handleSetToday}
              className="text-[11px] font-bold text-blue-600 hover:underline"
            >
              Hari Ini
            </button>
          </div>
          <input
            type="date"
            value={tanggal}
            onChange={e => setTanggal(e.target.value)}
            required
            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900 font-semibold"
          />
          <div className="text-xs text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 font-medium">
            Hari: <b>{calculatedHari}</b> • Bulan: <b>{calculatedBulan}</b> • Tahun: <b>{calculatedTahun}</b>
          </div>
        </div>

        {/* 2. Waktu */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              Waktu Kegiatan
            </label>
            <button
              type="button"
              onClick={handleUseRealtimeNow}
              className="text-[11px] font-bold text-indigo-600 hover:underline flex items-center gap-1"
            >
              <Clock className="w-3 h-3" />
              <span>Gunakan Jam Sekarang</span>
            </button>
          </div>
          <div className="flex gap-2">
            <select
              value={PRESET_WAKTU_AGENDA.includes(waktu) ? waktu : 'Kustom'}
              onChange={e => {
                if (e.target.value !== 'Kustom') setWaktu(e.target.value);
              }}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900 font-semibold"
            >
              {PRESET_WAKTU_AGENDA.map(w => (
                <option key={w} value={w}>{w}</option>
              ))}
              <option value="Kustom">Waktu Lainnya / Kustom</option>
            </select>
            <input
              type="text"
              value={waktu}
              onChange={e => setWaktu(e.target.value)}
              placeholder="07.15-07.55 WIB"
              required
              className="flex-1 px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-semibold text-slate-900"
            />
          </div>
        </div>
      </div>

      {/* 3. Sasaran Kegiatan */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
          Sasaran Kegiatan
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <select
            value={PRESET_SASARAN_AGENDA.includes(sasaran) ? sasaran : ''}
            onChange={e => {
              if (e.target.value) setSasaran(e.target.value);
            }}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-semibold text-slate-900"
          >
            <option value="">-- Pilih Preset Sasaran --</option>
            {PRESET_SASARAN_AGENDA.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <div className="flex-1">
            <SiswaSelector
              students={students}
              currentValue={sasaran}
              onSelectStudent={s => setSasaran(`${s.nama_siswa} (${s.kelas})`)}
              onSelectMultiple={sl => setSasaran(sl.map(s => s.nama_siswa).join(', '))}
              placeholder="Ketik sasaran atau cari nama siswa..."
            />
          </div>
        </div>
      </div>

      {/* 4. Uraian Kegiatan (6 Baris) */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
          Uraian Kegiatan
        </label>
        <textarea
          rows={6}
          value={uraianKegiatan}
          onChange={e => setUraianKegiatan(e.target.value)}
          placeholder="Tuliskan uraian detail kegiatan bimbingan dan konseling yang dilaksanakan..."
          required
          className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white font-medium text-slate-900 leading-relaxed"
        />
      </div>

      {/* 5. Link Foto Kegiatan + Upload */}
      <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
          <span>Foto Dokumentasi Kegiatan</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
          <div className="space-y-2">
            <input
              type="text"
              value={linkFotoKegiatan.startsWith('data:') ? '(Foto Terunggah dari Perangkat)' : linkFotoKegiatan}
              onChange={e => setLinkFotoKegiatan(e.target.value)}
              placeholder="Masukkan link foto (Google Drive / URL web) atau upload di bawah..."
              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800"
            />
            <div className="flex items-center gap-2">
              <label className="cursor-pointer px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-sm transition-colors flex items-center gap-1.5">
                <span>{uploadingImg ? 'Mengompres...' : 'Upload Foto'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFile}
                  disabled={uploadingImg}
                  className="hidden"
                />
              </label>
              {linkFotoKegiatan && (
                <button
                  type="button"
                  onClick={() => setLinkFotoKegiatan('')}
                  className="text-xs text-rose-600 hover:underline"
                >
                  Hapus Foto
                </button>
              )}
            </div>
          </div>

          {/* Thumbnail Preview */}
          <div className="h-20 bg-white rounded-lg border border-slate-200 flex items-center justify-center overflow-hidden p-1">
            {linkFotoKegiatan ? (
              <img
                src={linkFotoKegiatan}
                alt="Pratinjau Foto"
                className="max-h-full max-w-full object-contain rounded"
              />
            ) : (
              <span className="text-[11px] text-slate-400 italic">Belum ada foto dokumentasi</span>
            )}
          </div>
        </div>
      </div>

      {/* 6. Keterangan */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
          Keterangan / Hasil
        </label>
        <input
          type="text"
          value={keterangan}
          onChange={e => setKeterangan(e.target.value)}
          placeholder="Contoh: Terlaksana dengan baik dan tertib"
          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-semibold text-slate-900"
        />
      </div>

      {/* Submit Button */}
      <div className="pt-2 flex justify-end gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
        >
          <Check className="w-4 h-4" />
          <span>{isSubmitting ? 'Menyimpan ke Cloud...' : initialData ? 'Update Agenda' : 'Simpan Agenda Kerja'}</span>
        </button>
      </div>
    </form>
  );
};
