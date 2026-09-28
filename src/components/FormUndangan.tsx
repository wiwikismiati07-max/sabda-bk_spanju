import React, { useState, useEffect } from 'react';
import { Mail, Calendar, User, MapPin, Check, Image as ImageIcon, Search, Edit, Trash2 } from 'lucide-react';
import { UndanganOrangTuaItem, SiswaBK } from '../types';
import { compressImageFile } from '../lib/imageCompressor';
import { SiswaSelector, DAFTAR_KELAS_24 } from './SiswaSelector';
import { getActiveGuruBK, KEPALA_SEKOLAH_DEFAULT } from '../lib/guruBk';

interface FormUndanganProps {
  initialData?: UndanganOrangTuaItem | null;
  onSubmit: (data: UndanganOrangTuaItem) => Promise<void>;
  onCancelEdit?: () => void;
  isSubmitting?: boolean;
  students?: SiswaBK[];
}

export const PRESET_PERIHAL_UNDANGAN = [
  'Konsultasi Perkembangan Belajar Siswa',
  'Pembahasan Kedisiplinan & Keterlambatan Masuk Sekolah',
  'Penyelesaian Masalah Ketidakhadiran (Alpa / Bolos)',
  'Konsultasi Perilaku & Hubungan Sosial Siswa',
  'Penyelesaian Masalah Tata Tertib Sekolah',
  'Konsultasi Lanjutan Penanganan Kasus Siswa'
];

export const FormUndangan: React.FC<FormUndanganProps> = ({
  initialData,
  onSubmit,
  onCancelEdit,
  isSubmitting = false,
  students = []
}) => {
  const activeGuru = getActiveGuruBK();

  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [waktu, setWaktu] = useState('08.30 WIB s/d Selesai');
  const [tempat, setTempat] = useState('Ruang BK SMP Negeri 7 Pasuruan');
  const [kelas, setKelas] = useState('7-A');
  const [namaSiswa, setNamaSiswa] = useState('');
  const [namaOrangTua, setNamaOrangTua] = useState('');
  const [pekerjaanOrangTua, setPekerjaanOrangTua] = useState('');
  const [alamat, setAlamat] = useState('');
  const [perihal, setPerihal] = useState(PRESET_PERIHAL_UNDANGAN[0]);
  const [uraianMasalah, setUraianMasalah] = useState('');
  const [tindakLanjut, setTindakLanjut] = useState('');
  const [linkFoto, setLinkFoto] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [nomorSurat, setNomorSurat] = useState('400/ 015 /423.102.54/2026');
  const [tanggalSurat, setTanggalSurat] = useState(new Date().toISOString().split('T')[0]);
  const [tempatSurat, setTempatSurat] = useState('Pasuruan');
  const [namaGuru, setNamaGuru] = useState(activeGuru.nama);
  const [nipGuru, setNipGuru] = useState(activeGuru.nip);
  const [namaKepsek, setNamaKepsek] = useState(KEPALA_SEKOLAH_DEFAULT.nama);
  const [nipKepsek, setNipKepsek] = useState(KEPALA_SEKOLAH_DEFAULT.nip);
  const [uploadingImg, setUploadingImg] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTanggal(initialData.tanggal || new Date().toISOString().split('T')[0]);
      setWaktu(initialData.waktu || '08.30 WIB s/d Selesai');
      setTempat(initialData.tempat_pelaksanaan || 'Ruang BK SMP Negeri 7 Pasuruan');
      setKelas(initialData.kelas || '7-A');
      setNamaSiswa(initialData.nama_siswa || '');
      setNamaOrangTua(initialData.nama_orang_tua || '');
      setPekerjaanOrangTua(initialData.pekerjaan_orang_tua || '');
      setAlamat(initialData.alamat || '');
      setPerihal(initialData.perihal_undangan || PRESET_PERIHAL_UNDANGAN[0]);
      setUraianMasalah(initialData.uraian_permasalahan || '');
      setTindakLanjut(initialData.tindak_lanjut || '');
      setLinkFoto(initialData.link_foto_kegiatan || '');
      setKeterangan(initialData.keterangan || '');
      setNomorSurat(initialData.nomor_surat || '400/ 015 /423.102.54/2026');
      setTanggalSurat(initialData.tanggal_surat || new Date().toISOString().split('T')[0]);
      setTempatSurat(initialData.tempat_surat || 'Pasuruan');
      setNamaGuru(initialData.nama_guru_bk || activeGuru.nama);
      setNipGuru(initialData.nip_guru_bk || activeGuru.nip);
      setNamaKepsek(initialData.nama_kepala_sekolah || KEPALA_SEKOLAH_DEFAULT.nama);
      setNipKepsek(initialData.nip_kepala_sekolah || KEPALA_SEKOLAH_DEFAULT.nip);
    }
  }, [initialData]);

  const dateObj = new Date(tanggal);
  const calculatedHari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][dateObj.getDay()] || 'Senin';

  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImg(true);
    try {
      const comp = await compressImageFile(file);
      setLinkFoto(comp);
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingImg(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaSiswa.trim() || !perihal.trim()) return;

    const payload: UndanganOrangTuaItem = {
      id: initialData?.id,
      hari: calculatedHari,
      tanggal,
      waktu,
      tempat_pelaksanaan: tempat,
      kelas,
      nama_siswa: namaSiswa.trim(),
      nama_orang_tua: namaOrangTua.trim() || `Orang Tua / Wali dari ${namaSiswa.trim()}`,
      pekerjaan_orang_tua: pekerjaanOrangTua.trim(),
      alamat: alamat.trim(),
      perihal_undangan: perihal.trim(),
      uraian_permasalahan: uraianMasalah.trim(),
      tindak_lanjut: tindakLanjut.trim(),
      link_foto_kegiatan: linkFoto,
      keterangan: keterangan.trim(),
      nomor_surat: nomorSurat.trim(),
      tanggal_surat: tanggalSurat,
      tempat_surat: tempatSurat,
      nama_guru_bk: namaGuru,
      nip_guru_bk: nipGuru,
      nama_kepala_sekolah: namaKepsek,
      nip_kepala_sekolah: nipKepsek
    };

    await onSubmit(payload);
    if (!initialData) {
      setNamaSiswa('');
      setNamaOrangTua('');
      setAlamat('');
      setUraianMasalah('');
      setTindakLanjut('');
      setLinkFoto('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Mail className="w-5 h-5 text-indigo-600" />
            <span>{initialData ? 'Edit Surat Undangan Orang Tua' : 'Form Undangan Orang Tua Siswa'}</span>
          </h2>
          <p className="text-xs text-slate-500">Penerbitan surat panggilan dan laporan konsultasi orang tua</p>
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

      {/* 1. Pelaksanaan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Tanggal Pelaksanaan</label>
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
            required
            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 font-semibold"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Tempat Pertemuan</label>
          <input
            type="text"
            value={tempat}
            onChange={e => setTempat(e.target.value)}
            required
            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 font-semibold"
          />
        </div>
      </div>

      {/* 2. Identitas Siswa & Orang Tua */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Kelas Siswa</label>
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
          <label className="text-xs font-bold text-slate-700">Nama Siswa</label>
          <SiswaSelector
            students={students}
            selectedClass={kelas}
            currentValue={namaSiswa}
            onSelectStudent={s => {
              setNamaSiswa(s.nama_siswa);
              setKelas(s.kelas);
            }}
            placeholder="Cari nama siswa dari database..."
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Nama Orang Tua / Wali (Opsional)</label>
          <input
            type="text"
            value={namaOrangTua}
            onChange={e => setNamaOrangTua(e.target.value)}
            placeholder="Nama ayah / ibu / wali..."
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Pekerjaan Orang Tua (Opsional)</label>
          <input
            type="text"
            value={pekerjaanOrangTua}
            onChange={e => setPekerjaanOrangTua(e.target.value)}
            placeholder="Pekerjaan..."
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
          />
        </div>

        <div className="md:col-span-2 space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Alamat Tempat Tinggal (Opsional)</label>
          <input
            type="text"
            value={alamat}
            onChange={e => setAlamat(e.target.value)}
            placeholder="Alamat rumah..."
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
          />
        </div>
      </div>

      {/* 3. Perihal & Uraian Masalah */}
      <div className="space-y-3">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Perihal Undangan</label>
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={PRESET_PERIHAL_UNDANGAN.includes(perihal) ? perihal : 'Kustom'}
              onChange={e => {
                if (e.target.value !== 'Kustom') setPerihal(e.target.value);
              }}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold"
            >
              {PRESET_PERIHAL_UNDANGAN.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
              <option value="Kustom">Ketik Perihal Kustom...</option>
            </select>
            <input
              type="text"
              value={perihal}
              onChange={e => setPerihal(e.target.value)}
              required
              className="flex-1 px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 font-semibold"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Uraian Permasalahan Siswa</label>
          <textarea
            rows={3}
            value={uraianMasalah}
            onChange={e => setUraianMasalah(e.target.value)}
            placeholder="Jelaskan ringkasan permasalahan yang perlu dikonsultasikan..."
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Tindak Lanjut / Kesepakatan</label>
          <textarea
            rows={2}
            value={tindakLanjut}
            onChange={e => setTindakLanjut(e.target.value)}
            placeholder="Tuliskan tindak lanjut hasil koordinasi dengan orang tua..."
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
          />
        </div>
      </div>

      {/* 4. Administrasi Cetak Surat */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div>
          <label className="font-bold text-slate-700">Nomor Surat</label>
          <input
            type="text"
            value={nomorSurat}
            onChange={e => setNomorSurat(e.target.value)}
            className="w-full px-2.5 py-1.5 mt-1 bg-white border border-slate-300 rounded-lg text-slate-900"
          />
        </div>
        <div>
          <label className="font-bold text-slate-700">Tempat & Tanggal Surat</label>
          <div className="flex gap-1 mt-1">
            <input
              type="text"
              value={tempatSurat}
              onChange={e => setTempatSurat(e.target.value)}
              className="w-24 px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900"
            />
            <input
              type="date"
              value={tanggalSurat}
              onChange={e => setTanggalSurat(e.target.value)}
              className="flex-1 px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900"
            />
          </div>
        </div>
        <div>
          <label className="font-bold text-slate-700">Guru BK / Konselor</label>
          <input
            type="text"
            value={namaGuru}
            onChange={e => setNamaGuru(e.target.value)}
            className="w-full px-2.5 py-1.5 mt-1 bg-white border border-slate-300 rounded-lg text-slate-900"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
        >
          <Check className="w-4 h-4" />
          <span>{isSubmitting ? 'Menyimpan...' : initialData ? 'Update Undangan' : 'Simpan Undangan Ortu'}</span>
        </button>
      </div>
    </form>
  );
};

export const TabelUndangan: React.FC<{
  items: UndanganOrangTuaItem[];
  onEdit: (item: UndanganOrangTuaItem) => void;
  onDelete: (id: string) => Promise<void>;
  onPrintSurat: (item: UndanganOrangTuaItem) => void;
  onPrintLaporan: (item: UndanganOrangTuaItem) => void;
}> = ({ items = [], onEdit, onDelete, onPrintSurat, onPrintLaporan }) => {
  const [search, setSearch] = useState('');
  const [filterKelas, setFilterKelas] = useState('Semua');

  const filtered = items.filter(it => {
    const matchSearch =
      it.nama_siswa.toLowerCase().includes(search.toLowerCase()) ||
      it.perihal_undangan.toLowerCase().includes(search.toLowerCase());
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
              placeholder="Cari siswa atau perihal..."
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
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-xs text-slate-800">
          <thead className="bg-slate-100 text-slate-700 font-extrabold uppercase tracking-wider text-[11px] border-b border-slate-200">
            <tr>
              <th className="px-3 py-3 text-center w-12">No</th>
              <th className="px-3 py-3 w-32">Hari / Tgl</th>
              <th className="px-3 py-3 w-40">Siswa & Kelas</th>
              <th className="px-3 py-3 w-36">Orang Tua</th>
              <th className="px-4 py-3">Perihal Undangan</th>
              <th className="px-3 py-3 text-center w-36">Cetak Dokumen</th>
              <th className="px-3 py-3 text-center w-20">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-slate-400">
                  Belum ada data undangan orang tua siswa.
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
                    <span className="text-[10px] font-bold px-1.5 py-0.2 bg-blue-50 text-blue-700 rounded">
                      Kelas {item.kelas}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-slate-700">{item.nama_orang_tua || '-'}</td>
                  <td className="px-4 py-2.5 text-slate-900">{item.perihal_undangan}</td>
                  <td className="px-3 py-2.5 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onPrintSurat(item)}
                        className="px-2 py-1 text-[11px] font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition-colors"
                      >
                        Surat Undangan
                      </button>
                      <button
                        type="button"
                        onClick={() => onPrintLaporan(item)}
                        className="px-2 py-1 text-[11px] font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
                      >
                        Laporan
                      </button>
                    </div>
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
