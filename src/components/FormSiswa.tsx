import React, { useState } from 'react';
import { GraduationCap, Check } from 'lucide-react';
import { SiswaBK } from '../types';
import { DAFTAR_KELAS_24 } from './SiswaSelector';

interface FormSiswaProps {
  initialData?: SiswaBK | null;
  onSubmit: (data: SiswaBK) => Promise<void>;
  onCancelEdit?: () => void;
  isSubmitting?: boolean;
}

export const FormSiswa: React.FC<FormSiswaProps> = ({
  initialData,
  onSubmit,
  onCancelEdit,
  isSubmitting = false
}) => {
  const [namaSiswa, setNamaSiswa] = useState(initialData?.nama_siswa || '');
  const [kelas, setKelas] = useState(initialData?.kelas || '7-A');
  const [nis, setNis] = useState(initialData?.nis || '');
  const [jenisKelamin, setJenisKelamin] = useState(initialData?.jenis_kelamin || 'Laki-laki');
  const [keterangan, setKeterangan] = useState(initialData?.keterangan || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaSiswa.trim() || !nis.trim()) return;

    const payload: SiswaBK = {
      id: initialData?.id,
      nama_siswa: namaSiswa.trim(),
      kelas,
      nis: nis.trim(),
      jenis_kelamin: jenisKelamin,
      keterangan: keterangan.trim()
    };

    await onSubmit(payload);
    if (!initialData) {
      setNamaSiswa('');
      setNis('');
      setKeterangan('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-600" />
            <span>{initialData ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}</span>
          </h2>
          <p className="text-xs text-slate-500">Pencatatan data master siswa 24 kelas (7A-7H, 8A-8H, 9A-9H)</p>
        </div>
        {initialData && onCancelEdit && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
          >
            Batal
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-xs font-bold text-slate-700">Nama Lengkap Siswa</label>
          <input
            type="text"
            value={namaSiswa}
            onChange={e => setNamaSiswa(e.target.value)}
            placeholder="Ketik nama lengkap..."
            required
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Kelas</label>
          <select
            value={kelas}
            onChange={e => setKelas(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold"
          >
            {DAFTAR_KELAS_24.map(k => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">NIS / NISN</label>
          <input
            type="text"
            value={nis}
            onChange={e => setNis(e.target.value)}
            placeholder="Nomor induk..."
            required
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Jenis Kelamin</label>
          <select
            value={jenisKelamin}
            onChange={e => setJenisKelamin(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold"
          >
            <option value="Laki-laki">Laki-laki</option>
            <option value="Perempuan">Perempuan</option>
          </select>
        </div>

        <div className="space-y-1.5 sm:col-span-3">
          <label className="text-xs font-bold text-slate-700">Keterangan Tambahan</label>
          <input
            type="text"
            value={keterangan}
            onChange={e => setKeterangan(e.target.value)}
            placeholder="Catatan khusus..."
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
          />
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
        >
          <Check className="w-4 h-4" />
          <span>{isSubmitting ? 'Menyimpan...' : initialData ? 'Update Siswa' : 'Simpan Siswa'}</span>
        </button>
      </div>
    </form>
  );
};
