import React, { useState, useEffect } from 'react';
import { UserCheck, Check, Edit, Trash2, Search, Printer, Sparkles, BookOpen } from 'lucide-react';
import { KonselingIndividuItem, SiswaBK } from '../types';
import { SiswaSelector, DAFTAR_KELAS_24 } from './SiswaSelector';
import { getActiveGuruBK, KEPALA_SEKOLAH_DEFAULT } from '../lib/guruBk';

interface FormKonselingIndividuProps {
  initialData?: KonselingIndividuItem | null;
  onSubmit: (data: KonselingIndividuItem) => Promise<void>;
  onCancelEdit?: () => void;
  isSubmitting?: boolean;
  students?: SiswaBK[];
}

export const PENDEKATAN_KONSELING_INDIVIDU = [
  {
    nama: 'CBT (Cognitive Behavioral Therapy)',
    fokus: 'Mengidentifikasi dan mengubah pola pikir negatif / irasional menjadi rasional & adaptif.',
    teknik: 'Restrukturisasi Kognitif, Thought Stopping, Analisis Bukti, & Tugas Rumah (Homework Assignment).'
  },
  {
    nama: 'Pendekatan Behavioral',
    fokus: 'Mengubah perilaku maladaptif menjadi perilaku adaptif yang diharapkan.',
    teknik: 'Kontrak Perilaku (Behavior Contract), Penguatan Positif (Reinforcement), Token Economy, & Self-Management.'
  },
  {
    nama: 'Person-Centered / Client-Centered',
    fokus: 'Memberikan ruang empati dan penerimaan positif tanpa syarat agar konseli menemukan potensi dirinya.',
    teknik: 'Empati Akurat, Refleksi Perasaan, Active Listening, & Penerimaan Tanpa Syarat (Unconditional Positive Regard).'
  },
  {
    nama: 'Reality Therapy / Terapi Realitas (WDEP)',
    fokus: 'Membantu konseli mengevaluasi perilaku saat ini dan membuat rencana tindakan nyata yang bertanggung jawab.',
    teknik: 'Sistem WDEP (Wants, Direction/Doing, Evaluation, Planning) & Kontrak Komitmen Nyata.'
  },
  {
    nama: 'SFBT (Solution-Focused Brief Therapy)',
    fokus: 'Fokus pada kekuatan, pengecualian masalah, dan perumusan solusi masa depan yang cepat.',
    teknik: 'Miracle Question (Pertanyaan Keajaiban), Scaling Questions (1-10), Exception Questions, & Coping Questions.'
  }
];

export const FormKonselingIndividu: React.FC<FormKonselingIndividuProps> = ({
  initialData,
  onSubmit,
  onCancelEdit,
  isSubmitting = false,
  students = []
}) => {
  const activeGuru = getActiveGuruBK();

  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [waktu, setWaktu] = useState('08.35-09.15 WIB');
  const [kelas, setKelas] = useState('7-A');
  const [namaSiswa, setNamaSiswa] = useState('');
  const [topik, setTopik] = useState('');
  const [media, setMedia] = useState('Lembar Kerja Siswa, Instrumen Self-Assessment');
  const [ringkasanMasalah, setRingkasanMasalah] = useState('');
  const [pendekatan, setPendekatan] = useState(PENDEKATAN_KONSELING_INDIVIDU[0].nama);
  const [hasilDicapai, setHasilDicapai] = useState('');
  const [keterangan, setKeterangan] = useState('Terlaksana & Konseli Membuat Kontrak Perilaku');

  useEffect(() => {
    if (initialData) {
      setTanggal(initialData.tanggal || new Date().toISOString().split('T')[0]);
      setWaktu(initialData.waktu || '08.35-09.15 WIB');
      setKelas(initialData.kelas || '7-A');
      setNamaSiswa(initialData.nama_siswa || '');
      setTopik(initialData.topik_permasalahan || '');
      setMedia(initialData.media_yang_diperlukan || '');
      setRingkasanMasalah(initialData.ringkasan_uraian_masalah || '');
      setPendekatan(initialData.pendekatan_teknik_konseling || PENDEKATAN_KONSELING_INDIVIDU[0].nama);
      setHasilDicapai(initialData.hasil_yang_dicapai || '');
      setKeterangan(initialData.keterangan || '');
    }
  }, [initialData]);

  const dateObj = new Date(tanggal);
  const calculatedHari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][dateObj.getDay()] || 'Senin';

  const handleApplyPendekatan = (item: typeof PENDEKATAN_KONSELING_INDIVIDU[0]) => {
    setPendekatan(`${item.nama} - Teknik: ${item.teknik}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaSiswa.trim() || !topik.trim()) return;

    const payload: KonselingIndividuItem = {
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
            <UserCheck className="w-5 h-5 text-blue-600" />
            <span>{initialData ? 'Edit Rencana Konseling Individu' : 'Form Rencana Konseling Individu'}</span>
          </h2>
          <p className="text-xs text-slate-500">Perencanaan dan evaluasi sesi konseling individual siswa</p>
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
          <label className="text-xs font-bold text-slate-700">Tanggal Konseling</label>
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
          <label className="text-xs font-bold text-slate-700">Nama Siswa / Konseli</label>
          <SiswaSelector
            students={students}
            selectedClass={kelas}
            currentValue={namaSiswa}
            onSelectStudent={s => {
              setNamaSiswa(s.nama_siswa);
              setKelas(s.kelas);
            }}
            placeholder="Cari siswa konseli..."
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Topik Permasalahan</label>
          <input
            type="text"
            value={topik}
            onChange={e => setTopik(e.target.value)}
            placeholder="Contoh: Penyesuaian diri & manajemen waktu belajar..."
            required
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold"
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Ringkasan Uraian Masalah</label>
          <textarea
            rows={3}
            value={ringkasanMasalah}
            onChange={e => setRingkasanMasalah(e.target.value)}
            placeholder="Deskripsikan kondisi permasalahan yang dialami siswa..."
            required
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
          />
        </div>

        {/* 5 Pendekatan Konseling */}
        <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-200 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>Pendekatan & Teknik Konseling</span>
            </label>
            <span className="text-[11px] text-blue-700 font-semibold">5 Teori Terstruktur</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-1">
            {PENDEKATAN_KONSELING_INDIVIDU.map(p => (
              <button
                key={p.nama}
                type="button"
                onClick={() => handleApplyPendekatan(p)}
                className="p-2 text-left bg-white hover:bg-blue-100/70 border border-blue-200 rounded-lg text-xs transition-colors shadow-2xs"
              >
                <div className="font-bold text-blue-950 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-blue-600 shrink-0" />
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
            className="w-full px-3 py-2 text-xs bg-white border border-blue-300 rounded-lg text-slate-900 font-semibold mt-2"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Hasil yang Dicapai</label>
          <textarea
            rows={2}
            value={hasilDicapai}
            onChange={e => setHasilDicapai(e.target.value)}
            placeholder="Evaluasi dan perubahan kognitif/perilaku konseli..."
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
          <span>{isSubmitting ? 'Menyimpan...' : initialData ? 'Update Konseling' : 'Simpan Konseling Individu'}</span>
        </button>
      </div>
    </form>
  );
};

export const TabelKonselingIndividu: React.FC<{
  items: KonselingIndividuItem[];
  onEdit: (item: KonselingIndividuItem) => void;
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
              placeholder="Cari konseli atau topik..."
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
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors shadow-sm"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Cetak Rekap Konseling</span>
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-xs text-slate-800">
          <thead className="bg-slate-100 text-slate-700 font-extrabold uppercase tracking-wider text-[11px] border-b border-slate-200">
            <tr>
              <th className="px-3 py-3 text-center w-12">No</th>
              <th className="px-3 py-3 w-32">Hari / Tgl</th>
              <th className="px-3 py-3 w-36">Siswa & Kelas</th>
              <th className="px-4 py-3">Topik Permasalahan</th>
              <th className="px-4 py-3">Pendekatan & Hasil</th>
              <th className="px-3 py-3 text-center w-20">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-slate-400">
                  Belum ada data rencana konseling individu.
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
                  <td className="px-4 py-2.5 text-slate-900 font-medium">{item.topik_permasalahan}</td>
                  <td className="px-4 py-2.5 text-slate-700 text-[11px]">
                    <div className="font-semibold text-blue-900">{item.pendekatan_teknik_konseling}</div>
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
