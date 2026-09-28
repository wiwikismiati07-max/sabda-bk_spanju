import React, { useState, useEffect } from 'react';
import { Users, Check, Edit, Trash2, Search, Printer, Sparkles, BookOpen } from 'lucide-react';
import { KonselingKelompokItem, SiswaBK } from '../types';
import { SiswaSelector, DAFTAR_KELAS_24 } from './SiswaSelector';
import { getActiveGuruBK, KEPALA_SEKOLAH_DEFAULT } from '../lib/guruBk';

interface FormKonselingKelompokProps {
  initialData?: KonselingKelompokItem | null;
  onSubmit: (data: KonselingKelompokItem) => Promise<void>;
  onCancelEdit?: () => void;
  isSubmitting?: boolean;
  students?: SiswaBK[];
}

export const PENDEKATAN_KONSELING_KELOMPOK = [
  {
    nama: 'CBT Kelompok (Group CBT)',
    fokus: 'Restrukturisasi pola pikir negatif melalui dinamika kelompok & feedback teman sebaya.',
    teknik: 'Diskusi Sokratik Kelompok, Role-Playing, Modelling Teman Sebaya, & Evaluasi Bersama.'
  },
  {
    nama: 'Behavioral Kelompok',
    fokus: 'Pembentukan perilaku adaptif dan peningkatan keterampilan sosial.',
    teknik: 'Social Skills Training, Kontrak Perilaku Kelompok, Assertive Training, & Token Kelompok.'
  },
  {
    nama: 'Reality Therapy (Kelompok WDEP)',
    fokus: 'Eksplorasi kebutuhan kelompok dan penyusunan rencana aksi komitmen bersama.',
    teknik: 'Sharing WDEP Kelompok, Evaluasi Diri Terbimbing, & Komitmen Tindakan Nyata.'
  },
  {
    nama: 'SFBT Kelompok (Solution-Focused)',
    fokus: 'Membangun solusi kolektif dan mengidentifikasi keberhasilan masa lalu anggota.',
    teknik: 'Miracle Question Bersama, Scaling Questions Dinamis, & Saling Mengapresiasi Solusi.'
  },
  {
    nama: 'Konseling Eksistensial-Humanistik Kelompok',
    fokus: 'Meningkatkan kesadaran diri, tanggung jawab sosial, dan keterbukaan emosional.',
    teknik: 'Here-and-Now Awareness, Sharing Emosional Jujur, & Penguatan Eksplorasi Diri.'
  }
];

export const FormKonselingKelompok: React.FC<FormKonselingKelompokProps> = ({
  initialData,
  onSubmit,
  onCancelEdit,
  isSubmitting = false,
  students = []
}) => {
  const activeGuru = getActiveGuruBK();

  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [waktu, setWaktu] = useState('09.15-09.55 WIB');
  const [kelas, setKelas] = useState('8-A');
  const [namaSiswa, setNamaSiswa] = useState('');
  const [topik, setTopik] = useState('');
  const [media, setMedia] = useState('Lembar Kerja Kelompok, Papan Refleksi');
  const [ringkasanMasalah, setRingkasanMasalah] = useState('');
  const [pendekatan, setPendekatan] = useState(PENDEKATAN_KONSELING_KELOMPOK[0].nama);
  const [hasilDicapai, setHasilDicapai] = useState('');
  const [keterangan, setKeterangan] = useState('Terlaksana dengan dinamika kelompok aktif');

  useEffect(() => {
    if (initialData) {
      setTanggal(initialData.tanggal || new Date().toISOString().split('T')[0]);
      setWaktu(initialData.waktu || '09.15-09.55 WIB');
      setKelas(initialData.kelas || '8-A');
      setNamaSiswa(initialData.nama_siswa || '');
      setTopik(initialData.topik_permasalahan || '');
      setMedia(initialData.media_yang_diperlukan || '');
      setRingkasanMasalah(initialData.ringkasan_uraian_masalah || '');
      setPendekatan(initialData.pendekatan_teknik_konseling || PENDEKATAN_KONSELING_KELOMPOK[0].nama);
      setHasilDicapai(initialData.hasil_yang_dicapai || '');
      setKeterangan(initialData.keterangan || '');
    }
  }, [initialData]);

  const dateObj = new Date(tanggal);
  const calculatedHari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][dateObj.getDay()] || 'Senin';

  const handleApplyPendekatan = (item: typeof PENDEKATAN_KONSELING_KELOMPOK[0]) => {
    setPendekatan(`${item.nama} - Teknik: ${item.teknik}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaSiswa.trim() || !topik.trim()) return;

    const payload: KonselingKelompokItem = {
      id: initialData?.id,
      hari: calculatedHari,
      tanggal,
      waktu,
      kelas,
      nama_siswa: namaSiswa.trim(),
      topik_permasalahan: topik.trim(),
      media_yang_diperlukan: media.trim(),
      ringkasan_uraian_masalah: ringkasanMasalah.trim(),
      pendekatan_teknik_konseling: pendekatan.trim(),
      hasil_yang_dicapai: hasilDicapai.trim(),
      keterangan: keterangan.trim(),
      nama_guru_bk: activeGuru.nama,
      nip_guru_bk: activeGuru.nip,
      nama_kepala_sekolah: KEPALA_SEKOLAH_DEFAULT.nama,
      nip_kepala_sekolah: KEPALA_SEKOLAH_DEFAULT.nip
    };

    await onSubmit(payload);
    if (!initialData) {
      setNamaSiswa('');
      setTopik('');
      setRingkasanMasalah('');
      setHasilDicapai('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <span>{initialData ? 'Edit Rencana Konseling Kelompok' : 'Form Rencana Konseling Kelompok'}</span>
          </h2>
          <p className="text-xs text-slate-500">Perencanaan dan evaluasi dinamika sesi konseling kelompok</p>
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
          <label className="text-xs font-bold text-slate-700">Waktu / Sesi</label>
          <input
            type="text"
            value={waktu}
            onChange={e => setWaktu(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 font-semibold"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Kelas Kelompok</label>
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
          <label className="text-xs font-bold text-slate-700">Daftar Anggota Kelompok (Siswa)</label>
          <SiswaSelector
            students={students}
            selectedClass={kelas}
            currentValue={namaSiswa}
            isMulti={true}
            onSelectMultiple={sl => setNamaSiswa(sl.map(s => s.nama_siswa).join(', '))}
            placeholder="Pilih anggota kelompok..."
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Topik Permasalahan Kelompok</label>
          <input
            type="text"
            value={topik}
            onChange={e => setTopik(e.target.value)}
            placeholder="Contoh: Peningkatan motivasi belajar & kerjasama tim..."
            required
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold"
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Ringkasan Uraian Masalah Kelompok</label>
          <textarea
            rows={3}
            value={ringkasanMasalah}
            onChange={e => setRingkasanMasalah(e.target.value)}
            placeholder="Deskripsikan dinamika dan permasalahan yang dibahas bersama anggota kelompok..."
            required
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
          />
        </div>

        {/* 5 Pendekatan Kelompok */}
        <div className="bg-indigo-50/60 p-4 rounded-xl border border-indigo-200 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>Pendekatan & Teknik Konseling Kelompok</span>
            </label>
            <span className="text-[11px] text-indigo-700 font-semibold">5 Teori Dinamika Kelompok</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-1">
            {PENDEKATAN_KONSELING_KELOMPOK.map(p => (
              <button
                key={p.nama}
                type="button"
                onClick={() => handleApplyPendekatan(p)}
                className="p-2 text-left bg-white hover:bg-indigo-100/70 border border-indigo-200 rounded-lg text-xs transition-colors shadow-2xs"
              >
                <div className="font-bold text-indigo-950 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-indigo-600 shrink-0" />
                  <span className="truncate">{p.nama}</span>
                </div>
                <div className="text-[10px] text-slate-600 mt-1 line-clamp-2">{p.teknik}</div>
              </button>
            ))}
          </div>

          <input
            type="text"
            value={pendekatan}
            onChange={e => setPendekatan(e.target.value)}
            required
            className="w-full px-3 py-2 text-xs bg-white border border-indigo-300 rounded-lg text-slate-900 font-semibold mt-2"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Hasil yang Dicapai</label>
          <textarea
            rows={2}
            value={hasilDicapai}
            onChange={e => setHasilDicapai(e.target.value)}
            placeholder="Kesepakatan bersama dan perubahan perilaku anggota kelompok..."
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
          />
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
        >
          <Check className="w-4 h-4" />
          <span>{isSubmitting ? 'Menyimpan...' : initialData ? 'Update Kelompok' : 'Simpan Konseling Kelompok'}</span>
        </button>
      </div>
    </form>
  );
};

export const TabelKonselingKelompok: React.FC<{
  items: KonselingKelompokItem[];
  onEdit: (item: KonselingKelompokItem) => void;
  onDelete: (id: string) => Promise<void>;
  onPrintPreview: () => void;
}> = ({ items = [], onEdit, onDelete, onPrintPreview }) => {
  const [search, setSearch] = useState('');
  const [filterKelas, setFilterKelas] = useState('Semua');

  const filtered = items.filter(it => {
    const matchSearch =
      it.nama_siswa.toLowerCase().includes(search.toLowerCase()) ||
      it.topik_permasalahan.toLowerCase().includes(search.toLowerCase());
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
              placeholder="Cari anggota kelompok atau topik..."
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
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-colors shadow-sm"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Cetak Rekap Kelompok</span>
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-xs text-slate-800">
          <thead className="bg-slate-100 text-slate-700 font-extrabold uppercase tracking-wider text-[11px] border-b border-slate-200">
            <tr>
              <th className="px-3 py-3 text-center w-12">No</th>
              <th className="px-3 py-3 w-32">Hari / Tgl</th>
              <th className="px-3 py-3 w-44">Anggota Kelompok & Kelas</th>
              <th className="px-4 py-3">Topik Permasalahan</th>
              <th className="px-4 py-3">Pendekatan & Hasil</th>
              <th className="px-3 py-3 text-center w-20">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-slate-400">
                  Belum ada data rencana konseling kelompok.
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
                    <div className="font-bold text-slate-900 line-clamp-2">{item.nama_siswa}</div>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 bg-indigo-50 text-indigo-700 rounded">
                      Kelas {item.kelas}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-slate-900 font-medium">{item.topik_permasalahan}</td>
                  <td className="px-4 py-2.5 text-slate-700 text-[11px]">
                    <div className="font-semibold text-indigo-900">{item.pendekatan_teknik_konseling}</div>
                    <div className="text-emerald-700 mt-0.5">Hasil: {item.hasil_yang_dicapai || '-'}</div>
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
