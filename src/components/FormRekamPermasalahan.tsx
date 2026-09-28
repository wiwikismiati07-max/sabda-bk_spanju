import React, { useState, useEffect } from 'react';
import { FileWarning, Check, Edit, Trash2, Search, Printer } from 'lucide-react';
import { RekamPermasalahanItem, SiswaBK } from '../types';
import { SiswaSelector, DAFTAR_KELAS_24 } from './SiswaSelector';
import { getActiveGuruBK, KEPALA_SEKOLAH_DEFAULT } from '../lib/guruBk';

interface FormRekamPermasalahanProps {
  initialData?: RekamPermasalahanItem | null;
  onSubmit: (data: RekamPermasalahanItem) => Promise<void>;
  onCancelEdit?: () => void;
  isSubmitting?: boolean;
  students?: SiswaBK[];
}

export const FormRekamPermasalahan: React.FC<FormRekamPermasalahanProps> = ({
  initialData,
  onSubmit,
  onCancelEdit,
  isSubmitting = false,
  students = []
}) => {
  const activeGuru = getActiveGuruBK();

  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [waktu, setWaktu] = useState('08.00 WIB');
  const [kelas, setKelas] = useState('7-A');
  const [namaSiswa, setNamaSiswa] = useState('');
  const [namaOrangTua, setNamaOrangTua] = useState('');
  const [pekerjaanOrangTua, setPekerjaanOrangTua] = useState('');
  const [alamat, setAlamat] = useState('');
  const [ringkasanMasalah, setRingkasanMasalah] = useState('');
  const [upayaPenanganan, setUpayaPenanganan] = useState('');
  const [hasilKesimpulan, setHasilKesimpulan] = useState('');
  const [keterangan, setKeterangan] = useState('Dalam pemantauan berkala');

  useEffect(() => {
    if (initialData) {
      setTanggal(initialData.tanggal || new Date().toISOString().split('T')[0]);
      setWaktu(initialData.waktu || '08.00 WIB');
      setKelas(initialData.kelas || '7-A');
      setNamaSiswa(initialData.nama_siswa || '');
      setNamaOrangTua(initialData.nama_orang_tua || '');
      setPekerjaanOrangTua(initialData.pekerjaan_orang_tua || '');
      setAlamat(initialData.alamat || '');
      setRingkasanMasalah(initialData.ringkasan_uraian_masalah || '');
      setUpayaPenanganan(initialData.upaya_penanganan || '');
      setHasilKesimpulan(initialData.hasil_dan_kesimpulan || '');
      setKeterangan(initialData.keterangan || 'Dalam pemantauan berkala');
    }
  }, [initialData]);

  const dateObj = new Date(tanggal);
  const calculatedHari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][dateObj.getDay()] || 'Senin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaSiswa.trim() || !ringkasanMasalah.trim()) return;

    const payload: RekamPermasalahanItem = {
      id: initialData?.id,
      hari: calculatedHari,
      tanggal,
      waktu,
      kelas,
      nama_siswa: namaSiswa.trim(),
      nama_orang_tua: namaOrangTua.trim(),
      pekerjaan_orang_tua: pekerjaanOrangTua.trim(),
      alamat: alamat.trim(),
      ringkasan_uraian_masalah: ringkasanMasalah.trim(),
      upaya_penanganan: upayaPenanganan.trim(),
      hasil_dan_kesimpulan: hasilKesimpulan.trim(),
      keterangan: keterangan.trim(),
      nama_guru_bk: activeGuru.nama,
      nip_guru_bk: activeGuru.nip,
      nama_kepala_sekolah: KEPALA_SEKOLAH_DEFAULT.nama,
      nip_kepala_sekolah: KEPALA_SEKOLAH_DEFAULT.nip
    };

    await onSubmit(payload);
    if (!initialData) {
      setNamaSiswa('');
      setNamaOrangTua('');
      setRingkasanMasalah('');
      setUpayaPenanganan('');
      setHasilKesimpulan('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <FileWarning className="w-5 h-5 text-rose-600" />
            <span>{initialData ? 'Edit Rekam Permasalahan Siswa' : 'Form Rekam Permasalahan Siswa'}</span>
          </h2>
          <p className="text-xs text-slate-500">Pencatatan masalah, kronologi, upaya konselor, dan tindak lanjut kasus</p>
        </div>
        {initialData && onCancelEdit && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
          >
            Batal Edit
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Tanggal Kejadian / Rekam</label>
          <input
            type="date"
            value={tanggal}
            onChange={e => setTanggal(e.target.value)}
            required
            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 font-semibold"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Waktu / Jam</label>
          <input
            type="text"
            value={waktu}
            onChange={e => setWaktu(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 font-semibold"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Kelas Siswa</label>
          <select
            value={kelas}
            onChange={e => setKelas(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 font-semibold"
          >
            {DAFTAR_KELAS_24.map(k => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Nama Siswa</label>
          <SiswaSelector
            students={students}
            selectedClass={kelas}
            currentValue={namaSiswa}
            onSelectStudent={s => {
              setNamaSiswa(s.nama_siswa);
              setKelas(s.kelas);
            }}
            placeholder="Cari siswa..."
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Nama Orang Tua / Wali</label>
          <input
            type="text"
            value={namaOrangTua}
            onChange={e => setNamaOrangTua(e.target.value)}
            placeholder="Nama orang tua..."
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Ringkasan Uraian Permasalahan Siswa</label>
          <textarea
            rows={3}
            value={ringkasanMasalah}
            onChange={e => setRingkasanMasalah(e.target.value)}
            placeholder="Jelaskan kronologi dan permasalahan siswa..."
            required
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 leading-relaxed"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Upaya yang Sudah Dilakukan oleh Konselor / Wali Kelas</label>
          <textarea
            rows={2}
            value={upayaPenanganan}
            onChange={e => setUpayaPenanganan(e.target.value)}
            placeholder="Langkah bimbingan, konseling, atau mediasi yang telah ditempuh..."
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 leading-relaxed"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Hasil dan Kesimpulan</label>
          <textarea
            rows={2}
            value={hasilKesimpulan}
            onChange={e => setHasilKesimpulan(e.target.value)}
            placeholder="Hasil konseling / kesepakatan yang dicapai..."
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 leading-relaxed"
          />
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
        >
          <Check className="w-4 h-4" />
          <span>{isSubmitting ? 'Menyimpan...' : initialData ? 'Update Permasalahan' : 'Simpan Rekam Permasalahan'}</span>
        </button>
      </div>
    </form>
  );
};

export const TabelRekamPermasalahan: React.FC<{
  items: RekamPermasalahanItem[];
  onEdit: (item: RekamPermasalahanItem) => void;
  onDelete: (id: string) => Promise<void>;
  onPrintPreview: () => void;
}> = ({ items = [], onEdit, onDelete, onPrintPreview }) => {
  const [search, setSearch] = useState('');
  const [filterKelas, setFilterKelas] = useState('Semua');

  const filtered = items.filter(it => {
    const matchSearch =
      it.nama_siswa.toLowerCase().includes(search.toLowerCase()) ||
      it.ringkasan_uraian_masalah.toLowerCase().includes(search.toLowerCase());
    const matchKelas = filterKelas === 'Semua' || it.kelas === filterKelas;
    return matchSearch && matchKelas;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari nama siswa atau uraian..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900"
            />
          </div>
          <select
            value={filterKelas}
            onChange={e => setFilterKelas(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
          >
            <option value="Semua">Semua Kelas</option>
            {DAFTAR_KELAS_24.map(k => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={onPrintPreview}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors shadow-sm"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Cetak Rekap Kasus</span>
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-xs text-slate-800">
          <thead className="bg-slate-100 text-slate-700 font-extrabold uppercase tracking-wider text-[11px] border-b border-slate-200">
            <tr>
              <th className="px-3 py-3 text-center w-12">No</th>
              <th className="px-3 py-3 w-32">Hari / Tgl</th>
              <th className="px-3 py-3 w-36">Siswa & Kelas</th>
              <th className="px-4 py-3">Ringkasan Masalah</th>
              <th className="px-4 py-3">Upaya & Hasil</th>
              <th className="px-3 py-3 text-center w-20">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-slate-400">
                  Belum ada catatan rekam permasalahan siswa.
                </td>
              </tr>
            ) : (
              filtered.map((item, idx) => (
                <tr key={item.id || idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-3 py-2.5 text-center font-bold text-slate-500">{idx + 1}</td>
                  <td className="px-3 py-2.5">
                    <div className="font-bold text-slate-900">{item.hari}</div>
                    <div className="text-[11px] text-slate-500">{item.tanggal}</div>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="font-bold text-slate-900">{item.nama_siswa}</div>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 bg-rose-50 text-rose-700 rounded">
                      Kelas {item.kelas}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-slate-900 leading-relaxed">{item.ringkasan_uraian_masalah}</td>
                  <td className="px-4 py-2.5 text-slate-700 text-[11px]">
                    <div className="font-medium text-slate-800">Upaya: {item.upaya_penanganan || '-'}</div>
                    <div className="text-emerald-700 mt-0.5">Hasil: {item.hasil_dan_kesimpulan || '-'}</div>
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => onEdit(item)}
                        className="p-1 text-amber-600 hover:text-amber-800"
                        title="Edit"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => item.id && onDelete(item.id)}
                        className="p-1 text-rose-600 hover:text-rose-800"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
