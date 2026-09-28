import React, { useState, useEffect } from 'react';
import { Home, User, Check, Edit, Trash2, Search, FileText } from 'lucide-react';
import { HomeVisitItem, SiswaBK } from '../types';
import { SiswaSelector, DAFTAR_KELAS_24 } from './SiswaSelector';
import { getActiveGuruBK, KEPALA_SEKOLAH_DEFAULT } from '../lib/guruBk';

interface FormHomeVisitProps {
  initialData?: HomeVisitItem | null;
  onSubmit: (data: HomeVisitItem) => Promise<void>;
  onCancelEdit?: () => void;
  isSubmitting?: boolean;
  students?: SiswaBK[];
}

export const FormHomeVisit: React.FC<FormHomeVisitProps> = ({
  initialData,
  onSubmit,
  onCancelEdit,
  isSubmitting = false,
  students = []
}) => {
  const activeGuru = getActiveGuruBK();

  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [waktu, setWaktu] = useState('09.00 WIB s/d Selesai');
  const [kelas, setKelas] = useState('7-A');
  const [namaSiswa, setNamaSiswa] = useState('');
  const [namaOrangTua, setNamaOrangTua] = useState('');
  const [pekerjaanOrangTua, setPekerjaanOrangTua] = useState('');
  const [alamat, setAlamat] = useState('');
  const [perihal, setPerihal] = useState('Kunjungan Rumah Terkait Kehadiran dan Kedisiplinan Belajar Siswa');
  const [uraianMasalah, setUraianMasalah] = useState('');
  const [tindakLanjut, setTindakLanjut] = useState('');
  const [keterangan, setKeterangan] = useState('');

  // Surat Tugas & Pernyataan
  const [nomorSuratTugas, setNomorSuratTugas] = useState('400/ 015 /423.102.54/2026');
  const [nisSiswa, setNisSiswa] = useState('');
  const [petugas1, setPetugas1] = useState(activeGuru.nama);
  const [jabatanPetugas1, setJabatanPetugas1] = useState('Guru Bimbingan dan Konseling');
  const [petugas2, setPetugas2] = useState('');
  const [jabatanPetugas2, setJabatanPetugas2] = useState('Wali Kelas');
  const [tglSuratTugas, setTglSuratTugas] = useState(new Date().toISOString().split('T')[0]);
  const [tglPernyataanOrtu, setTglPernyataanOrtu] = useState(new Date().toISOString().split('T')[0]);

  // Laporan 14 Poin
  const [semesterLaporan, setSemesterLaporan] = useState('SEMESTER 1 (GANJIL) TAHUN PELAJARAN 2026-2027');
  const [bidangLayanan, setBidangLayanan] = useState('Pribadi & Sosial');
  const [fungsiLayanan, setFungsiLayanan] = useState('Pengentasan & Advokasi');
  const [pihakTerlibat, setPihakTerlibat] = useState('Guru BK, Wali Kelas, dan Orang Tua / Wali Siswa');
  const [tujuanKegiatan, setTujuanKegiatan] = useState('Mengetahui kondisi lingkungan rumah dan menjalin kerjasama dengan orang tua');
  const [gambaranMasalah, setGambaranMasalah] = useState('');
  const [anggotaKeluarga, setAnggotaKeluarga] = useState('Ayah / Ibu Kandung');
  const [rencanaEvaluasi, setRencanaEvaluasi] = useState('Pemantauan kehadiran dan perubahan perilaku siswa di sekolah');

  useEffect(() => {
    if (initialData) {
      setTanggal(initialData.tanggal || new Date().toISOString().split('T')[0]);
      setWaktu(initialData.waktu || '09.00 WIB s/d Selesai');
      setKelas(initialData.kelas || '7-A');
      setNamaSiswa(initialData.nama_siswa || '');
      setNamaOrangTua(initialData.nama_orang_tua || '');
      setPekerjaanOrangTua(initialData.pekerjaan_orang_tua || '');
      setAlamat(initialData.alamat || '');
      setPerihal(initialData.perihal_home_visit || '');
      setUraianMasalah(initialData.uraian_permasalahan || '');
      setTindakLanjut(initialData.tindak_lanjut || '');
      setKeterangan(initialData.keterangan || '');
      setNomorSuratTugas(initialData.nomor_surat_tugas || '400/ 015 /423.102.54/2026');
      setNisSiswa(initialData.nis_siswa || '');
      setPetugas1(initialData.petugas_1 || activeGuru.nama);
      setJabatanPetugas1(initialData.jabatan_petugas_1 || 'Guru Bimbingan dan Konseling');
      setPetugas2(initialData.petugas_2 || '');
      setJabatanPetugas2(initialData.jabatan_petugas_2 || 'Wali Kelas');
      setTglSuratTugas(initialData.tanggal_surat_tugas || new Date().toISOString().split('T')[0]);
      setTglPernyataanOrtu(initialData.tanggal_pernyataan_ortu || new Date().toISOString().split('T')[0]);
      setSemesterLaporan(initialData.semester_laporan || 'SEMESTER 1 (GANJIL) TAHUN PELAJARAN 2026-2027');
      setBidangLayanan(initialData.bidang_layanan || 'Pribadi & Sosial');
      setFungsiLayanan(initialData.fungsi_layanan || 'Pengentasan & Advokasi');
      setPihakTerlibat(initialData.pihak_terlibat || 'Guru BK, Wali Kelas, dan Orang Tua / Wali Siswa');
      setTujuanKegiatan(initialData.tujuan_kegiatan || 'Mengetahui kondisi lingkungan rumah');
      setGambaranMasalah(initialData.gambaran_ringkas_masalah || '');
      setAnggotaKeluarga(initialData.anggota_keluarga_dikunjungi || 'Ayah / Ibu Kandung');
      setRencanaEvaluasi(initialData.rencana_evaluasi || 'Pemantauan kehadiran dan perubahan perilaku siswa');
    }
  }, [initialData]);

  const dateObj = new Date(tanggal);
  const calculatedHari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][dateObj.getDay()] || 'Senin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaSiswa.trim() || !alamat.trim()) return;

    const payload: HomeVisitItem = {
      id: initialData?.id,
      hari: calculatedHari,
      tanggal,
      waktu,
      kelas,
      nama_siswa: namaSiswa.trim(),
      nama_orang_tua: namaOrangTua.trim() || `Orang Tua / Wali dari ${namaSiswa.trim()}`,
      pekerjaan_orang_tua: pekerjaanOrangTua.trim(),
      alamat: alamat.trim(),
      perihal_home_visit: perihal.trim(),
      uraian_permasalahan: uraianMasalah.trim(),
      tindak_lanjut: tindakLanjut.trim(),
      keterangan: keterangan.trim(),
      nomor_surat_tugas: nomorSuratTugas.trim(),
      nis_siswa: nisSiswa.trim(),
      petugas_1: petugas1.trim(),
      jabatan_petugas_1: jabatanPetugas1.trim(),
      petugas_2: petugas2.trim(),
      jabatan_petugas_2: jabatanPetugas2.trim(),
      tanggal_surat_tugas: tglSuratTugas,
      tanggal_pernyataan_ortu: tglPernyataanOrtu,
      semester_laporan: semesterLaporan,
      bidang_layanan: bidangLayanan,
      topik_permasalahan: perihal.trim(),
      fungsi_layanan: fungsiLayanan,
      pihak_terlibat: pihakTerlibat,
      tujuan_kegiatan: tujuanKegiatan,
      gambaran_ringkas_masalah: gambaranMasalah || uraianMasalah,
      alamat_kunjungan: alamat.trim(),
      hari_tanggal_lama_kunjungan: `${calculatedHari}, ${tanggal} (${waktu})`,
      anggota_keluarga_dikunjungi: anggotaKeluarga,
      rencana_evaluasi: rencanaEvaluasi,
      tindak_lanjut_14_poin: tindakLanjut,
      nama_guru_bk: activeGuru.nama,
      nip_guru_bk: activeGuru.nip,
      nama_kepala_sekolah: KEPALA_SEKOLAH_DEFAULT.nama,
      nip_kepala_sekolah: KEPALA_SEKOLAH_DEFAULT.nip
    };

    await onSubmit(payload);
    if (!initialData) {
      setNamaSiswa('');
      setNamaOrangTua('');
      setAlamat('');
      setUraianMasalah('');
      setTindakLanjut('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Home className="w-5 h-5 text-amber-600" />
            <span>{initialData ? 'Edit Home Visit / Kunjungan Rumah' : 'Form Home Visit / Kunjungan Rumah'}</span>
          </h2>
          <p className="text-xs text-slate-500">Surat tugas, surat kesediaan ortu, dan laporan 14 poin kunjungan rumah</p>
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

      {/* 1. Pelaksanaan & Sasaran */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Tanggal Kunjungan</label>
          <input
            type="date"
            value={tanggal}
            onChange={e => setTanggal(e.target.value)}
            required
            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 font-semibold"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Waktu Kunjungan</label>
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

      {/* 2. Identitas Siswa & Keluarga */}
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
              if (s.nis) setNisSiswa(s.nis);
            }}
            placeholder="Cari nama siswa..."
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">NIS Siswa</label>
          <input
            type="text"
            value={nisSiswa}
            onChange={e => setNisSiswa(e.target.value)}
            placeholder="Nomor Induk Siswa..."
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Nama Orang Tua / Wali</label>
          <input
            type="text"
            value={namaOrangTua}
            onChange={e => setNamaOrangTua(e.target.value)}
            placeholder="Nama ayah / ibu..."
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Pekerjaan Orang Tua</label>
          <input
            type="text"
            value={pekerjaanOrangTua}
            onChange={e => setPekerjaanOrangTua(e.target.value)}
            placeholder="Pekerjaan orang tua..."
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
          />
        </div>

        <div className="md:col-span-2 space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Alamat Tempat Tinggal / Lokasi Kunjungan</label>
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

      {/* 3. Masalah & Rincian */}
      <div className="space-y-3">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Perihal / Topik Permasalahan</label>
          <input
            type="text"
            value={perihal}
            onChange={e => setPerihal(e.target.value)}
            required
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Uraian Permasalahan Siswa</label>
          <textarea
            rows={3}
            value={uraianMasalah}
            onChange={e => setUraianMasalah(e.target.value)}
            placeholder="Deskripsi masalah yang dihadapi siswa..."
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Tindak Lanjut & Kesepakatan</label>
          <textarea
            rows={2}
            value={tindakLanjut}
            onChange={e => setTindakLanjut(e.target.value)}
            placeholder="Rencana tindak lanjut bimbingan konseling..."
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
          />
        </div>
      </div>

      {/* 4. Administrasi Surat Tugas & Kesediaan Ortu */}
      <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div>
          <label className="font-bold text-slate-700">Nomor Surat Tugas</label>
          <input
            type="text"
            value={nomorSuratTugas}
            onChange={e => setNomorSuratTugas(e.target.value)}
            className="w-full px-2.5 py-1.5 mt-1 bg-white border border-slate-300 rounded-lg text-slate-900"
          />
        </div>
        <div>
          <label className="font-bold text-slate-700">Tgl Surat Tugas</label>
          <input
            type="date"
            value={tglSuratTugas}
            onChange={e => setTglSuratTugas(e.target.value)}
            className="w-full px-2.5 py-1.5 mt-1 bg-white border border-slate-300 rounded-lg text-slate-900"
          />
        </div>
        <div>
          <label className="font-bold text-slate-700">Tgl Pernyataan Ortu</label>
          <input
            type="date"
            value={tglPernyataanOrtu}
            onChange={e => setTglPernyataanOrtu(e.target.value)}
            className="w-full px-2.5 py-1.5 mt-1 bg-white border border-slate-300 rounded-lg text-slate-900"
          />
        </div>
      </div>

      {/* Submit */}
      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
        >
          <Check className="w-4 h-4" />
          <span>{isSubmitting ? 'Menyimpan...' : initialData ? 'Update Home Visit' : 'Simpan Home Visit'}</span>
        </button>
      </div>
    </form>
  );
};

export const TabelHomeVisit: React.FC<{
  items: HomeVisitItem[];
  onEdit: (item: HomeVisitItem) => void;
  onDelete: (id: string) => Promise<void>;
  onPrintSuratTugas: (item: HomeVisitItem) => void;
  onPrintKesediaan: (item: HomeVisitItem) => void;
  onPrintLaporan14Poin: (item: HomeVisitItem) => void;
}> = ({ items = [], onEdit, onDelete, onPrintSuratTugas, onPrintKesediaan, onPrintLaporan14Poin }) => {
  const [search, setSearch] = useState('');
  const [filterKelas, setFilterKelas] = useState('Semua');

  const filtered = items.filter(it => {
    const matchSearch =
      it.nama_siswa.toLowerCase().includes(search.toLowerCase()) ||
      it.perihal_home_visit.toLowerCase().includes(search.toLowerCase());
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
              <th className="px-3 py-3 w-36">Siswa & Kelas</th>
              <th className="px-3 py-3 w-32">Orang Tua</th>
              <th className="px-4 py-3">Alamat & Perihal</th>
              <th className="px-3 py-3 text-center w-52">Cetak Dokumen Resmi</th>
              <th className="px-3 py-3 text-center w-20">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-slate-400">
                  Belum ada data kunjungan rumah (home visit).
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
                    <span className="text-[10px] font-bold px-1.5 py-0.2 bg-amber-50 text-amber-800 rounded">
                      Kelas {item.kelas}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-slate-700">{item.nama_orang_tua || '-'}</td>
                  <td className="px-4 py-2.5 text-slate-900">
                    <div className="font-semibold text-slate-800">{item.perihal_home_visit}</div>
                    <div className="text-[11px] text-slate-500 truncate max-w-xs">{item.alamat}</div>
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <div className="flex flex-wrap items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => onPrintSuratTugas(item)}
                        className="px-2 py-0.5 text-[10px] font-bold bg-amber-50 hover:bg-amber-100 text-amber-800 rounded transition-colors"
                      >
                        Surat Tugas
                      </button>
                      <button
                        type="button"
                        onClick={() => onPrintKesediaan(item)}
                        className="px-2 py-0.5 text-[10px] font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded transition-colors"
                      >
                        Kesediaan Ortu
                      </button>
                      <button
                        type="button"
                        onClick={() => onPrintLaporan14Poin(item)}
                        className="px-2 py-0.5 text-[10px] font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 rounded transition-colors"
                      >
                        14 Poin
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
