import React, { useState, useEffect } from 'react';
import { UserX, Check, Edit, Trash2, Search, Printer, Image as ImageIcon } from 'lucide-react';
import { SiswaATSItem, SiswaBK } from '../types';
import { compressImageFile } from '../lib/imageCompressor';
import { SiswaSelector, DAFTAR_KELAS_24 } from './SiswaSelector';
import { getActiveGuruBK, KEPALA_SEKOLAH_DEFAULT, DAFTAR_GURU_BK } from '../lib/guruBk';

interface FormSiswaATSProps {
  initialData?: SiswaATSItem | null;
  onSubmit: (data: SiswaATSItem) => Promise<void>;
  onCancelEdit?: () => void;
  isSubmitting?: boolean;
  students?: SiswaBK[];
}

export const KATEGORI_ATS_OPTIONS = [
  { id: 'DO (Drop Out)', label: 'DO (Drop Out)', desc: 'Putus Sekolah di Tengah Jenjang', color: 'rose' },
  { id: 'LTM (Lulus Tidak Melanjutkan)', label: 'LTM (Lulus Tdk Lanjut)', desc: 'Lulus SD/MI Tdk Masuk SMP', color: 'amber' },
  { id: 'Tidak DO/TLM', label: 'Tidak DO / TLM', desc: 'Bukan Siswa ATS / Masih Aktif', color: 'emerald' }
];

export const PRESET_ALASAN_ATS = [
  {
    kategori: 'Ekonomi',
    teks: 'Ekonomi: Tidak ada biaya operasional (seragam, transpor) atau anak harus bekerja membantu keuangan keluarga.'
  },
  {
    kategori: 'Keluarga & Sosial',
    teks: 'Keluarga & Sosial: Terjadi pernikahan dini, orang tua kurang mendukung pendidikan, atau anak harus mengurus rumah tangga/adik.'
  },
  {
    kategori: 'Akses & Aksesibilitas',
    teks: 'Akses & Aksesibilitas: Jarak sekolah terlalu jauh, jalur transportasi sulit, atau minimnya fasilitas untuk anak berkebutuhan khusus.'
  },
  {
    kategori: 'Internal & Lingkungan',
    teks: 'Internal & Lingkungan: Anak kehilangan minat belajar, menjadi korban perundungan (bullying), atau terpengaruh ajakan teman yang tidak sekolah.'
  }
];

export const FormSiswaATS: React.FC<FormSiswaATSProps> = ({
  initialData,
  onSubmit,
  onCancelEdit,
  isSubmitting = false,
  students = []
}) => {
  const activeGuru = getActiveGuruBK();

  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [waktu, setWaktu] = useState('09.00 WIB');
  const [tahunAjaran, setTahunAjaran] = useState('2026/2027');
  const [kategoriATS, setKategoriATS] = useState('DO (Drop Out)');
  const [kelas, setKelas] = useState('7-A');
  const [namaSiswa, setNamaSiswa] = useState('');
  const [namaOrangTua, setNamaOrangTua] = useState('');
  const [alamat, setAlamat] = useState('');
  const [alasanATS, setAlasanATS] = useState(PRESET_ALASAN_ATS[0].teks);
  const [alasanManual, setAlasanManual] = useState('');
  const [fotoKunjungan1, setFotoKunjungan1] = useState('');
  const [fotoBuktiFisik2, setFotoBuktiFisik2] = useState('');
  const [tempatLaporan, setTempatLaporan] = useState('Pasuruan');
  const [tanggalLaporan, setTanggalLaporan] = useState(new Date().toISOString().split('T')[0]);
  const [namaGuruKunjungan, setNamaGuruKunjungan] = useState(activeGuru.nama);
  const [nipGuruKunjungan, setNipGuruKunjungan] = useState(activeGuru.nip);
  const [uploading1, setUploading1] = useState(false);
  const [uploading2, setUploading2] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTanggal(initialData.tanggal || new Date().toISOString().split('T')[0]);
      setWaktu(initialData.waktu || '09.00 WIB');
      setTahunAjaran(initialData.tahun_ajaran || '2026/2027');
      setKategoriATS(initialData.kategori_ats || 'DO (Drop Out)');
      setKelas(initialData.kelas || '7-A');
      setNamaSiswa(initialData.nama_siswa || '');
      setNamaOrangTua(initialData.nama_orang_tua || '');
      setAlamat(initialData.alamat || '');
      setAlasanATS(initialData.alasan_ats || PRESET_ALASAN_ATS[0].teks);
      setAlasanManual(initialData.alasan_manual || '');
      setFotoKunjungan1(initialData.foto_kunjungan_1 || '');
      setFotoBuktiFisik2(initialData.foto_bukti_fisik_2 || '');
      setTempatLaporan(initialData.tempat_laporan || 'Pasuruan');
      setTanggalLaporan(initialData.tanggal_laporan || new Date().toISOString().split('T')[0]);
      setNamaGuruKunjungan(initialData.nama_guru_kunjungan || activeGuru.nama);
      setNipGuruKunjungan(initialData.nip_guru_kunjungan || activeGuru.nip);
    }
  }, [initialData]);

  const dateObj = new Date(tanggal);
  const calculatedHari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][dateObj.getDay()] || 'Senin';

  const handleUploadPhoto1 = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading1(true);
    try {
      const comp = await compressImageFile(file);
      setFotoKunjungan1(comp);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading1(false);
    }
  };

  const handleUploadPhoto2 = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading2(true);
    try {
      const comp = await compressImageFile(file);
      setFotoBuktiFisik2(comp);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading2(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaSiswa.trim() || !alamat.trim()) return;

    const payload: SiswaATSItem = {
      id: initialData?.id,
      hari: calculatedHari,
      tanggal,
      waktu,
      tahun_ajaran: tahunAjaran,
      nama_siswa: namaSiswa.trim(),
      kategori_ats: kategoriATS,
      kelas,
      nama_orang_tua: namaOrangTua.trim(),
      alamat: alamat.trim(),
      alasan_ats: alasanATS,
      alasan_manual: alasanManual.trim(),
      foto_kunjungan_1: fotoKunjungan1,
      foto_bukti_fisik_2: fotoBuktiFisik2,
      tempat_laporan: tempatLaporan,
      tanggal_laporan: tanggalLaporan,
      nama_guru_kunjungan: namaGuruKunjungan,
      nip_guru_kunjungan: nipGuruKunjungan,
      nama_kepala_sekolah: KEPALA_SEKOLAH_DEFAULT.nama,
      nip_kepala_sekolah: KEPALA_SEKOLAH_DEFAULT.nip
    };

    await onSubmit(payload);
    if (!initialData) {
      setNamaSiswa('');
      setNamaOrangTua('');
      setAlamat('');
      setAlasanManual('');
      setFotoKunjungan1('');
      setFotoBuktiFisik2('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <UserX className="w-5 h-5 text-rose-600" />
            <span>{initialData ? 'Edit Data Siswa ATS' : 'Form Pendataan Siswa ATS (Anak Tidak Sekolah)'}</span>
          </h2>
          <p className="text-xs text-slate-500">Pencatatan penanganan anak putus sekolah (DO), lulus tidak lanjut (LTM), dan verifikasi</p>
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

      {/* 1. Pelaksanaan & Tahun Ajaran */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Tanggal Pelaporan / Kunjungan</label>
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
          <label className="text-xs font-bold text-slate-700">Tahun Ajaran</label>
          <select
            value={tahunAjaran}
            onChange={e => setTahunAjaran(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 font-semibold"
          >
            <option value="2026/2027">T.A. 2026/2027</option>
            <option value="2027/2028">T.A. 2027/2028</option>
          </select>
        </div>
      </div>

      {/* 2. Status Kategori ATS */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
          Status / Kategori Siswa ATS
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {KATEGORI_ATS_OPTIONS.map(opt => {
            const isSelected = kategoriATS === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setKategoriATS(opt.id)}
                className={`p-3 rounded-2xl text-left border transition-all ${
                  isSelected
                    ? opt.id === 'DO (Drop Out)'
                      ? 'bg-rose-50 border-rose-400 text-rose-950 ring-2 ring-rose-500/20 font-bold'
                      : opt.id === 'LTM (Lulus Tidak Melanjutkan)'
                      ? 'bg-amber-50 border-amber-400 text-amber-950 ring-2 ring-amber-500/20 font-bold'
                      : 'bg-emerald-50 border-emerald-400 text-emerald-950 ring-2 ring-emerald-500/20 font-bold'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="font-bold text-xs">{opt.label}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{opt.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Identitas Siswa ATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Kelas Terakhir / Terdaftar</label>
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
          <label className="text-xs font-bold text-slate-700">Nama Siswa ATS</label>
          <SiswaSelector
            students={students}
            selectedClass={kelas}
            currentValue={namaSiswa}
            onSelectStudent={s => {
              setNamaSiswa(s.nama_siswa);
              setKelas(s.kelas);
            }}
            placeholder="Ketik atau cari nama siswa..."
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Nama Orang Tua / Wali Siswa ATS</label>
          <input
            type="text"
            value={namaOrangTua}
            onChange={e => setNamaOrangTua(e.target.value)}
            placeholder="Nama orang tua/wali..."
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Alamat Tempat Tinggal</label>
          <input
            type="text"
            value={alamat}
            onChange={e => setAlamat(e.target.value)}
            placeholder="Alamat lengkap rumah siswa..."
            required
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium"
          />
        </div>
      </div>

      {/* 4. Alasan ATS */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
          Alasan Anak Tidak Sekolah (ATS)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {PRESET_ALASAN_ATS.map(p => (
            <button
              key={p.kategori}
              type="button"
              onClick={() => setAlasanATS(p.teks)}
              className={`p-2.5 rounded-xl text-left border text-xs transition-all ${
                alasanATS === p.teks
                  ? 'bg-rose-50 border-rose-300 text-rose-950 font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="font-bold text-slate-900">{p.kategori}</div>
              <div className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">{p.teks}</div>
            </button>
          ))}
        </div>

        <div className="pt-1">
          <textarea
            rows={2}
            value={alasanManual}
            onChange={e => setAlasanManual(e.target.value)}
            placeholder="Tambahan keterangan / catatan manual terkait alasan ATS..."
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
          />
        </div>
      </div>

      {/* 5. Dua Foto Dokumentasi & Bukti Fisik */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
        {/* Foto 1 */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4 text-blue-600" />
            <span>Foto Kunjungan 1 (Dokumentasi Foto)</span>
          </label>
          <div className="space-y-1.5">
            <input
              type="text"
              value={fotoKunjungan1.startsWith('data:') ? '(Foto Terunggah)' : fotoKunjungan1}
              onChange={e => setFotoKunjungan1(e.target.value)}
              placeholder="Link URL foto..."
              className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800"
            />
            <label className="cursor-pointer inline-flex px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-sm transition-colors items-center gap-1.5">
              <span>{uploading1 ? 'Mengompres...' : 'Upload Foto 1'}</span>
              <input type="file" accept="image/*" onChange={handleUploadPhoto1} className="hidden" />
            </label>
          </div>
          <div className="h-24 bg-white rounded-lg border border-slate-200 flex items-center justify-center p-1">
            {fotoKunjungan1 ? (
              <img src={fotoKunjungan1} alt="Foto 1" className="max-h-full max-w-full object-contain rounded" />
            ) : (
              <span className="text-[11px] text-slate-400 italic">Belum ada foto 1</span>
            )}
          </div>
        </div>

        {/* Foto 2 */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4 text-indigo-600" />
            <span>Foto Bukti Fisik 2 (Surat / Dokumen)</span>
          </label>
          <div className="space-y-1.5">
            <input
              type="text"
              value={fotoBuktiFisik2.startsWith('data:') ? '(Foto Terunggah)' : fotoBuktiFisik2}
              onChange={e => setFotoBuktiFisik2(e.target.value)}
              placeholder="Link URL foto bukti fisik..."
              className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800"
            />
            <label className="cursor-pointer inline-flex px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow-sm transition-colors items-center gap-1.5">
              <span>{uploading2 ? 'Mengompres...' : 'Upload Foto 2'}</span>
              <input type="file" accept="image/*" onChange={handleUploadPhoto2} className="hidden" />
            </label>
          </div>
          <div className="h-24 bg-white rounded-lg border border-slate-200 flex items-center justify-center p-1">
            {fotoBuktiFisik2 ? (
              <img src={fotoBuktiFisik2} alt="Foto 2" className="max-h-full max-w-full object-contain rounded" />
            ) : (
              <span className="text-[11px] text-slate-400 italic">Belum ada foto 2</span>
            )}
          </div>
        </div>
      </div>

      {/* 6. Pengesahan Guru Kunjungan */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div>
          <label className="font-bold text-slate-700">Guru BK yang Melakukan Kunjungan</label>
          <select
            value={namaGuruKunjungan}
            onChange={e => {
              const found = DAFTAR_GURU_BK.find(g => g.nama === e.target.value);
              if (found) {
                setNamaGuruKunjungan(found.nama);
                setNipGuruKunjungan(found.nip);
              }
            }}
            className="w-full px-2.5 py-1.5 mt-1 bg-white border border-slate-300 rounded-lg text-slate-900 font-semibold"
          >
            {DAFTAR_GURU_BK.map(g => (
              <option key={g.nip} value={g.nama}>{g.nama}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="font-bold text-slate-700">Tanggal & Tempat Laporan</label>
          <div className="flex gap-1 mt-1">
            <input
              type="text"
              value={tempatLaporan}
              onChange={e => setTempatLaporan(e.target.value)}
              className="w-24 px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900"
            />
            <input
              type="date"
              value={tanggalLaporan}
              onChange={e => setTanggalLaporan(e.target.value)}
              className="flex-1 px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900"
            />
          </div>
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
        >
          <Check className="w-4 h-4" />
          <span>{isSubmitting ? 'Menyimpan...' : initialData ? 'Update Siswa ATS' : 'Simpan Data Siswa ATS'}</span>
        </button>
      </div>
    </form>
  );
};

export const TabelSiswaATS: React.FC<{
  items: SiswaATSItem[];
  onEdit: (item: SiswaATSItem) => void;
  onDelete: (id: string) => Promise<void>;
  onPrintPreview: (item: SiswaATSItem) => void;
}> = ({ items = [], onEdit, onDelete, onPrintPreview }) => {
  const [search, setSearch] = useState('');
  const [filterKategori, setFilterKategori] = useState('Semua');

  const filtered = items.filter(it => {
    const matchSearch =
      it.nama_siswa.toLowerCase().includes(search.toLowerCase()) ||
      it.alamat.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterKategori === 'Semua' || it.kategori_ats === filterKategori;
    return matchSearch && matchCat;
  });

  const countDO = items.filter(i => i.kategori_ats.includes('DO')).length;
  const countLTM = items.filter(i => i.kategori_ats.includes('LTM') && !i.kategori_ats.includes('Tidak')).length;
  const countTidak = items.filter(i => i.kategori_ats.includes('Tidak')).length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
      {/* Stats Header */}
      <div className="grid grid-cols-3 gap-2 pb-2">
        <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl text-center">
          <div className="text-xl font-extrabold text-rose-700">{countDO}</div>
          <div className="text-[10px] font-bold text-rose-900 uppercase">Siswa DO (Drop Out)</div>
        </div>
        <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-center">
          <div className="text-xl font-extrabold text-amber-700">{countLTM}</div>
          <div className="text-[10px] font-bold text-amber-900 uppercase">Siswa LTM (Lulus Tdk Lanjut)</div>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-center">
          <div className="text-xl font-extrabold text-emerald-700">{countTidak}</div>
          <div className="text-[10px] font-bold text-emerald-900 uppercase">Bukan ATS / Aktif</div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari nama siswa ATS..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900"
            />
          </div>
          <select
            value={filterKategori}
            onChange={e => setFilterKategori(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
          >
            <option value="Semua">Semua Kategori</option>
            {KATEGORI_ATS_OPTIONS.map(k => (
              <option key={k.id} value={k.id}>{k.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-xs text-slate-800">
          <thead className="bg-slate-100 text-slate-700 font-extrabold uppercase tracking-wider text-[11px] border-b border-slate-200">
            <tr>
              <th className="px-3 py-3 text-center w-12">No</th>
              <th className="px-3 py-3 w-32">Status ATS</th>
              <th className="px-3 py-3 w-40">Siswa & Kelas</th>
              <th className="px-3 py-3 w-36">Orang Tua</th>
              <th className="px-4 py-3">Alamat & Alasan ATS</th>
              <th className="px-3 py-3 text-center w-28">Cetak</th>
              <th className="px-3 py-3 text-center w-20">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-slate-400">
                  Belum ada data siswa ATS yang tercatat.
                </td>
              </tr>
            ) : (
              filtered.map((item, idx) => (
                <tr key={item.id || idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-3 py-2.5 text-center font-bold text-slate-500">{idx + 1}</td>
                  <td className="px-3 py-2.5">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.kategori_ats.includes('DO')
                          ? 'bg-rose-100 text-rose-800'
                          : item.kategori_ats.includes('LTM') && !item.kategori_ats.includes('Tidak')
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {item.kategori_ats}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="font-bold text-slate-900">{item.nama_siswa}</div>
                    <span className="text-[10px] text-slate-500">Kelas {item.kelas}</span>
                  </td>
                  <td className="px-3 py-2.5 text-slate-700">{item.nama_orang_tua || '-'}</td>
                  <td className="px-4 py-2.5 text-slate-900 leading-relaxed">
                    <div className="font-semibold text-slate-800 text-[11px]">{item.alasan_ats}</div>
                    <div className="text-[10px] text-slate-500 truncate max-w-xs">{item.alamat}</div>
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <button
                      type="button"
                      onClick={() => onPrintPreview(item)}
                      className="px-2.5 py-1 text-[11px] font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg transition-colors"
                    >
                      Cetak Berkas
                    </button>
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
