import React, { useState, useEffect } from 'react';
import { FileText, Check, Edit, Trash2, Search, Printer, Users } from 'lucide-react';
import { SuratPernyataanItem, SiswaBK } from '../types';
import { SiswaSelector, DAFTAR_KELAS_24 } from './SiswaSelector';
import { getActiveGuruBK, KEPALA_SEKOLAH_DEFAULT } from '../lib/guruBk';

interface FormSuratPernyataanProps {
  initialData?: SuratPernyataanItem | null;
  onSubmit: (data: SuratPernyataanItem) => Promise<void>;
  onCancelEdit?: () => void;
  isSubmitting?: boolean;
  students?: SiswaBK[];
}

export const JENIS_SP_LIST = [
  'SP 1',
  'SP 2',
  'SP 3',
  'SP ORANG TUA 1',
  'SP ORANG TUA 2',
  'SP PENGUNDURAN DIRI',
  'SP DAMAI SISWA'
];

export const FormSuratPernyataan: React.FC<FormSuratPernyataanProps> = ({
  initialData,
  onSubmit,
  onCancelEdit,
  isSubmitting = false,
  students = []
}) => {
  const activeGuru = getActiveGuruBK();

  const [jenisSP, setJenisSP] = useState<string>('SP 1');
  const [namaSiswa, setNamaSiswa] = useState('');
  const [kelas, setKelas] = useState('7-A');
  const [nis, setNis] = useState('');

  // Fields for SP Damai Siswa
  const [namaSiswa2, setNamaSiswa2] = useState('');
  const [kelas2, setKelas2] = useState('7-A');
  const [hariTglKejadian, setHariTglKejadian] = useState('Senin, 07 September 2026');
  const [tahunAjaran, setTahunAjaran] = useState('2026-2027');

  // Fields for Orang Tua & Peraturan
  const [namaOrangTua, setNamaOrangTua] = useState('');
  const [pekerjaanOrangTua, setPekerjaanOrangTua] = useState('');
  const [alamatOrangTua, setAlamatOrangTua] = useState('');
  const [peraturanDiketahui, setPeraturanDiketahui] = useState('Menaati tata tertib sekolah, hadir tepat waktu, dan tidak melakukan pelanggaran disiplin.');
  const [alasanPengunduran, setAlasanPengunduran] = useState('');
  const [tanggalSurat, setTanggalSurat] = useState(new Date().toISOString().split('T')[0]);
  const [tempatSurat, setTempatSurat] = useState('Pasuruan');

  useEffect(() => {
    if (initialData) {
      setJenisSP(initialData.jenis_sp || 'SP 1');
      setNamaSiswa(initialData.nama_siswa || '');
      setKelas(initialData.kelas || '7-A');
      setNis(initialData.nis || '');
      setNamaSiswa2(initialData.nama_siswa_2 || '');
      setKelas2(initialData.kelas_2 || '7-A');
      setHariTglKejadian(initialData.hari_tanggal_kejadian || 'Senin, 07 September 2026');
      setTahunAjaran(initialData.tahun_ajaran || '2026-2027');
      setNamaOrangTua(initialData.nama_orang_tua || '');
      setPekerjaanOrangTua(initialData.pekerjaan_orang_tua || '');
      setAlamatOrangTua(initialData.alamat_orang_tua || '');
      setPeraturanDiketahui(initialData.peraturan_diketahui || '');
      setAlasanPengunduran(initialData.alasan_pengunduran || '');
      setTanggalSurat(initialData.tanggal_surat || new Date().toISOString().split('T')[0]);
      setTempatSurat(initialData.tempat_surat || 'Pasuruan');
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaSiswa.trim()) return;

    const payload: SuratPernyataanItem = {
      id: initialData?.id,
      jenis_sp: jenisSP,
      nama_siswa: namaSiswa.trim(),
      kelas,
      nis: nis.trim(),
      nama_siswa_2: namaSiswa2.trim(),
      kelas_2: kelas2,
      hari_tanggal_kejadian: hariTglKejadian.trim(),
      tahun_ajaran: tahunAjaran,
      jabatan_pengetahu: 'Guru BK / Wali Kelas',
      nama_orang_tua: namaOrangTua.trim(),
      pekerjaan_orang_tua: pekerjaanOrangTua.trim(),
      alamat_orang_tua: alamatOrangTua.trim(),
      peraturan_diketahui: peraturanDiketahui.trim(),
      alasan_pengunduran: alasanPengunduran.trim(),
      tanggal_surat: tanggalSurat,
      tempat_surat: tempatSurat,
      nama_guru_bk: activeGuru.nama,
      nip_guru_bk: activeGuru.nip,
      nama_kepala_sekolah: KEPALA_SEKOLAH_DEFAULT.nama,
      nip_kepala_sekolah: KEPALA_SEKOLAH_DEFAULT.nip
    };

    await onSubmit(payload);
    if (!initialData) {
      setNamaSiswa('');
      setNamaSiswa2('');
      setNamaOrangTua('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            <span>{initialData ? 'Edit Surat Pernyataan Siswa' : 'Form Surat Pernyataan Siswa'}</span>
          </h2>
          <p className="text-xs text-slate-500">Penerbitan surat pernyataan komitmen (SP 1-3, SP Ortu, Pindah, & SP Damai)</p>
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

      {/* Jenis SP Buttons */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
          Pilih Jenis Surat Pernyataan
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {JENIS_SP_LIST.map(j => (
            <button
              key={j}
              type="button"
              onClick={() => setJenisSP(j)}
              className={`p-2 rounded-xl text-xs font-bold transition-all border text-center ${
                jenisSP === j
                  ? j === 'SP DAMAI SISWA'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                    : 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              {j}
            </button>
          ))}
        </div>
      </div>

      {/* SP Damai Special Section */}
      {jenisSP === 'SP DAMAI SISWA' ? (
        <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200 space-y-4">
          <div className="text-xs font-extrabold text-emerald-950 uppercase flex items-center gap-1.5">
            <Users className="w-4 h-4 text-emerald-700" />
            <span>Identitas Kedua Pihak Siswa yang Berdamai</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Siswa 1 */}
            <div className="bg-white p-3 rounded-xl border border-emerald-200 space-y-2">
              <div className="text-xs font-bold text-slate-800">Pihak 1 (Siswa Pertama)</div>
              <select
                value={kelas}
                onChange={e => setKelas(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
              >
                {DAFTAR_KELAS_24.map(k => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
              <SiswaSelector
                students={students}
                selectedClass={kelas}
                currentValue={namaSiswa}
                onSelectStudent={s => {
                  setNamaSiswa(s.nama_siswa);
                  setKelas(s.kelas);
                  if (s.nis) setNis(s.nis);
                }}
                placeholder="Pilih nama siswa pertama..."
              />
            </div>

            {/* Siswa 2 */}
            <div className="bg-white p-3 rounded-xl border border-emerald-200 space-y-2">
              <div className="text-xs font-bold text-slate-800">Pihak 2 (Siswa Kedua)</div>
              <select
                value={kelas2}
                onChange={e => setKelas2(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
              >
                {DAFTAR_KELAS_24.map(k => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
              <SiswaSelector
                students={students}
                selectedClass={kelas2}
                currentValue={namaSiswa2}
                onSelectStudent={s => {
                  setNamaSiswa2(s.nama_siswa);
                  setKelas2(s.kelas);
                }}
                placeholder="Pilih nama siswa kedua..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-emerald-950">Hari & Tanggal Kejadian</label>
              <input
                type="text"
                value={hariTglKejadian}
                onChange={e => setHariTglKejadian(e.target.value)}
                placeholder="Contoh: Senin, 07 September 2026"
                className="w-full px-3 py-1.5 text-xs bg-white border border-emerald-300 rounded-lg text-slate-900 mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-emerald-950">Tahun Ajaran</label>
              <input
                type="text"
                value={tahunAjaran}
                onChange={e => setTahunAjaran(e.target.value)}
                placeholder="2026-2027"
                className="w-full px-3 py-1.5 text-xs bg-white border border-emerald-300 rounded-lg text-slate-900 mt-1"
              />
            </div>
          </div>
        </div>
      ) : (
        /* Regular SP 1-3 & Ortu & Pindah */
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
                if (s.nis) setNis(s.nis);
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

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Pekerjaan Orang Tua</label>
            <input
              type="text"
              value={pekerjaanOrangTua}
              onChange={e => setPekerjaanOrangTua(e.target.value)}
              placeholder="Pekerjaan..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
            />
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Alamat Tempat Tinggal</label>
            <input
              type="text"
              value={alamatOrangTua}
              onChange={e => setAlamatOrangTua(e.target.value)}
              placeholder="Alamat rumah..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
            />
          </div>

          {jenisSP === 'SP PENGUNDURAN DIRI' ? (
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Alasan Pengunduran Diri / Pindah Sekolah</label>
              <textarea
                rows={3}
                value={alasanPengunduran}
                onChange={e => setAlasanPengunduran(e.target.value)}
                placeholder="Tuliskan alasan pindah sekolah atau pengunduran diri..."
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
              />
            </div>
          ) : (
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Poin Komitmen & Peraturan yang Disetujui</label>
              <textarea
                rows={3}
                value={peraturanDiketahui}
                onChange={e => setPeraturanDiketahui(e.target.value)}
                placeholder="Poin-poin komitmen yang ditandatangani..."
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
              />
            </div>
          )}
        </div>
      )}

      {/* Tanggal & Tempat Pembuatan Surat */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div>
          <label className="font-bold text-slate-700">Tempat Surat</label>
          <input
            type="text"
            value={tempatSurat}
            onChange={e => setTempatSurat(e.target.value)}
            className="w-full px-2.5 py-1.5 mt-1 bg-white border border-slate-300 rounded-lg text-slate-900"
          />
        </div>
        <div>
          <label className="font-bold text-slate-700">Tanggal Pembuatan Surat</label>
          <input
            type="date"
            value={tanggalSurat}
            onChange={e => setTanggalSurat(e.target.value)}
            className="w-full px-2.5 py-1.5 mt-1 bg-white border border-slate-300 rounded-lg text-slate-900"
          />
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
        >
          <Check className="w-4 h-4" />
          <span>{isSubmitting ? 'Menyimpan...' : initialData ? 'Update Surat' : 'Simpan Surat Pernyataan'}</span>
        </button>
      </div>
    </form>
  );
};

export const TabelSuratPernyataan: React.FC<{
  items: SuratPernyataanItem[];
  onEdit: (item: SuratPernyataanItem) => void;
  onDelete: (id: string) => Promise<void>;
  onPrintPreview: (item: SuratPernyataanItem) => void;
}> = ({ items = [], onEdit, onDelete, onPrintPreview }) => {
  const [search, setSearch] = useState('');
  const [filterSP, setFilterSP] = useState('Semua');

  const filtered = items.filter(it => {
    const matchSearch =
      it.nama_siswa.toLowerCase().includes(search.toLowerCase()) ||
      (it.nama_siswa_2 && it.nama_siswa_2.toLowerCase().includes(search.toLowerCase())) ||
      it.jenis_sp.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filterSP === 'Semua' || it.jenis_sp === filterSP;
    return matchSearch && matchFilter;
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
              placeholder="Cari siswa atau jenis SP..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900"
            />
          </div>
          <select
            value={filterSP}
            onChange={e => setFilterSP(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
          >
            <option value="Semua">Semua Jenis SP</option>
            {JENIS_SP_LIST.map(j => (
              <option key={j} value={j}>{j}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-xs text-slate-800">
          <thead className="bg-slate-100 text-slate-700 font-extrabold uppercase tracking-wider text-[11px] border-b border-slate-200">
            <tr>
              <th className="px-3 py-3 text-center w-12">No</th>
              <th className="px-3 py-3 w-36">Jenis Dokumen</th>
              <th className="px-3 py-3 w-40">Siswa (Pihak 1)</th>
              <th className="px-3 py-3 w-40">Pihak 2 / Orang Tua</th>
              <th className="px-3 py-3 w-28">Tgl Surat</th>
              <th className="px-3 py-3 text-center w-28">Cetak</th>
              <th className="px-3 py-3 text-center w-20">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-slate-400">
                  Belum ada data surat pernyataan siswa.
                </td>
              </tr>
            ) : (
              filtered.map((item, idx) => (
                <tr key={item.id || idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-3 py-2.5 text-center font-bold text-slate-500">{idx + 1}</td>
                  <td className="px-3 py-2.5">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                        item.jenis_sp === 'SP DAMAI SISWA'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.jenis_sp === 'SP 3' || item.jenis_sp === 'SP PENGUNDURAN DIRI'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}
                    >
                      {item.jenis_sp}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="font-bold text-slate-900">{item.nama_siswa}</div>
                    <span className="text-[10px] text-slate-500">Kelas {item.kelas}</span>
                  </td>
                  <td className="px-3 py-2.5 text-slate-700">
                    {item.jenis_sp === 'SP DAMAI SISWA' ? (
                      <div>
                        <div className="font-bold text-emerald-900">{item.nama_siswa_2 || '-'}</div>
                        <span className="text-[10px] text-slate-500">Kelas {item.kelas_2}</span>
                      </div>
                    ) : (
                      item.nama_orang_tua || '-'
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-slate-600 text-[11px]">{item.tanggal_surat || '-'}</td>
                  <td className="px-3 py-2.5 text-center">
                    <button
                      type="button"
                      onClick={() => onPrintPreview(item)}
                      className="px-2.5 py-1 text-[11px] font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition-colors"
                    >
                      Cetak Surat
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
