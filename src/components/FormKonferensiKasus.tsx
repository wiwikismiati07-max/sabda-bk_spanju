import React, { useState, useEffect } from 'react';
import { Briefcase, Check, Edit, Trash2, Search, Printer, Sparkles, UserPlus, Users, X } from 'lucide-react';
import { KonferensiKasusItem, PesertaKonferensiRow, SiswaBK } from '../types';
import { SiswaSelector, DAFTAR_KELAS_24 } from './SiswaSelector';
import { getActiveGuruBK, KEPALA_SEKOLAH_DEFAULT } from '../lib/guruBk';

interface FormKonferensiKasusProps {
  initialData?: KonferensiKasusItem | null;
  onSubmit: (data: KonferensiKasusItem) => Promise<void>;
  onCancelEdit?: () => void;
  isSubmitting?: boolean;
  students?: SiswaBK[];
}

export const PRESET_6_KASUS = [
  {
    jenis: 'Perselisihan Antar Siswa',
    tujuan: 'Bertujuan untuk menggali pemicu dan sudut pandang dari kedua belah pihak secara objektif, meredakan ketegangan demi menciptakan suasana kelas yang kondusif, serta melatih siswa agar mampu menyelesaikan perbedaan pendapat secara damai.',
    kegiatanInti: `a. Memanggil dan mempertemukan siswa yang berselisih secara terpisah terlebih dahulu, kemudian bersama-sama dalam sesi mediasi.
b. Mendengarkan keterangan dari masing-masing pihak secara adil tanpa menghakimi.
c. Memberikan pemahaman tentang pentingnya menghargai perbedaan pendapat dan memfasilitasi proses perdamaian serta penandatanganan kesepakatan damai.`,
    kesimpulan: `Kesimpulan: Masalah terjadi karena salah paham dan emosi remaja.
Data: Kedua siswa sepakat berdamai dan berjanji tidak bertengkar lagi.`,
    hasilRapat: `a. Jalannya Rapat: Mempertemukan kedua siswa yang berselisih didampingi guru BK dan wali kelas untuk membahas akar kesalahpahaman.
b. Hasil Keputusan: Kedua siswa sepakat untuk berdamai, saling memaafkan, dan menandatangani surat perdamaian agar hubungan kembali kondusif.`
  },
  {
    jenis: 'Perkelahian Antar Siswa',
    tujuan: 'Diarahkan untuk menghentikan tindakan kekerasan secara tegas namun tetap edukatif, menyelidiki akar pemicu masalah, serta memberikan sanksi pembinaan mental agar siswa dapat mengelola emosi dengan lebih baik ke depannya.',
    kegiatanInti: `a. Mengamankan situasi dan memisahkan siswa yang terlibat perkelahian guna mencegah perluasan konflik.
b. Melakukan investigasi singkat bersama guru piket/wali kelas untuk mengetahui kronologi kejadian.
c. Memberikan sanksi mendidik sesuai tata tertib sekolah serta memberikan konseling manajemen amarah (anger management) kepada siswa.`,
    kesimpulan: `Kesimpulan: Perkelahian disebabkan oleh emosi sesaat dan provokasi teman.
Data: Diketahui kronologi kejadian, siswa diberi sanksi pembinaan, dan wajib mengikuti konseling amarah.`,
    hasilRapat: `a. Jalannya Rapat: Membahas kronologi perkelahian bersama pihak sekolah, orang tua, dan siswa yang terlibat untuk mengevaluasi tindakan kekerasan yang terjadi.
b. Hasil Keputusan: Siswa diberikan sanksi pembinaan tata tertib sekolah, wajib mengikuti konseling manajemen emosi, dan orang tua sepakat meningkatkan pengawasan di rumah.`
  },
  {
    jenis: 'Tindakan Perundungan (Bullying)',
    tujuan: 'Difokuskan untuk memberikan perlindungan serta pemulihan psikologis bagi korban, menyadarkan pelaku mengenai dampak buruk tindakannya, sekaligus membangun kembali budaya sekolah yang aman dan bebas dari intimidasi.',
    kegiatanInti: `a. Memberikan perlindungan dan ruang aman bagi korban, serta penanganan psikologis awal untuk memulihkan rasa percaya diri.
b. Memanggil pelaku untuk mengonfirmasi tindakan, menyadarkan tentang dampak emosional korban, dan memberikan sanksi pembinaan.
c. Melibatkan pihak keluarga pelaku dan korban serta memperketat pengawasan di area rawan sekolah.`,
    kesimpulan: `Kesimpulan: Pelaku ingin mendominasi, sedangkan korban butuh pemulihan mental.
Data: Korban mendapat pendampingan, pelaku diberi sanksi pembinaan, dan pengawasan sekolah diperketat.`,
    hasilRapat: `a. Jalannya Rapat: Mengevaluasi laporan perundungan, mendengarkan keterangan korban dan pelaku, serta melibatkan orang tua masing-masing pihak.
b. Hasil Keputusan: Pelaku diberikan sanksi tegas yang mendidik, korban mendapat pendampingan psikologis untuk pemulihan, dan pihak sekolah memperketat pengawasan di area rawan.`
  },
  {
    jenis: 'Membawa Minuman Keras (Miras) ke Sekolah',
    tujuan: 'Bertujuan untuk menyelidiki sumber perolehan dan motif siswa, memberikan edukasi mendalam mengenai bahaya zat adiktif bagi kesehatan remaja, serta memperkuat intervensi dan pengawasan ketat dari pihak keluarga.',
    kegiatanInti: `a. Mengamankan barang bukti berupa miras dan mencatat temuan secara administratif.
b. Memanggil orang tua/wali murid ke sekolah untuk menyampaikan temuan secara transparan.
c. Melakukan asesmen mendalam terkait alasan siswa membawa miras (pengaruh pergaulan atau coba-coba) serta memberikan pembinaan khusus dan surat perjanjian bermaterai.`,
    kesimpulan: `Kesimpulan: Siswa terpengaruh pergaulan luar dan kurang pengawasan.
Data: Asal miras diketahui, siswa diberi pembinaan keras, dan orang tua berjanji lebih ketat mengawasi di rumah.`,
    hasilRapat: `a. Jalannya Rapat: Rapat khusus antara pihak sekolah (Kepala Sekolah, Guru BK, Wali Kelas) dan orang tua siswa untuk membahas temuan pelanggaran berat tersebut.
b. Hasil Keputusan: Siswa diberi pembinaan keras dan peringatan terakhir, membuat surat perjanjian bermaterai, serta orang tua menyatakan kesanggupannya untuk mengawasi pergaulan anak di luar sekolah.`
  },
  {
    jenis: 'Merokok di Lingkungan Sekolah',
    tujuan: 'Dilaksanakan untuk menegakkan tata tertib sekolah, memberikan penyuluhan kesehatan terkait dampak buruk rokok, serta melakukan konseling perilaku untuk menghentikan kebiasaan tersebut.',
    kegiatanInti: `a. Mengamankan siswa yang kedapatan merokok beserta barang bukti (rokok/korek) di area sekolah.
b. Memberikan teguran lisan maupun tertulis sesuai tingkat pelanggaran tata tertib sekolah.
c. Memberikan edukasi kesehatan tentang bahaya merokok bagi remaja dan mewajibkan siswa membuat surat pernyataan tidak mengulangi.`,
    kesimpulan: `Kesimpulan: Siswa melanggar aturan karena ikut-ikutan teman atau coba-coba.
Data: Titik merokok terdeteksi, siswa diberi sanksi teguran, dan membuat surat pernyataan.`,
    hasilRapat: `a. Jalannya Rapat: Membahas temuan pelanggaran aturan larangan merokok di area sekolah berdasarkan laporan guru piket.
b. Hasil Keputusan: Siswa diberikan teguran resmi, diminta membuat surat pernyataan untuk tidak mengulangi perbuatannya, serta diberikan edukasi bahaya merokok oleh Guru BK.`
  },
  {
    jenis: 'Mengambil Barang Milik Teman (Pencurian)',
    tujuan: 'Bertujuan untuk mengembalikan hak milik korban, menggali motif di balik tindakan siswa (faktor ekonomi, lingkungan, atau psikologis), serta menanamkan kembali nilai-nilai kejujuran dan rasa tanggung jawab moral.',
    kegiatanInti: `a. Mengklarifikasi temuan laporan kehilangan secara bijak dan privat untuk menjaga kerahasiaan serta mental siswa.
b. Mengembalikan barang yang diambil kepada pemiliknya secara sah.
c. Menggali motif di balik tindakan siswa, memberikan teguran keras yang edukatif, serta menanamkan nilai moral kejujuran melalui bimbingan konseling intensif.`,
    kesimpulan: `Kesimpulan: Tindakan dilakukan karena dorongan sesaat dan kurangnya pemahaman kejujuran.
Data: Barang berhasil dikembalikan ke pemiliknya, dan siswa diberi pembinaan moral agar tidak mengulanginya.`,
    hasilRapat: `a. Jalannya Rapat: Membahas kasus kehilangan barang milik siswa dengan mengklarifikasi pihak terkait secara tertutup untuk menjaga kerahasiaan dan mental anak.
b. Hasil Keputusan: Barang bukti dikembalikan kepada pemilik sahnya, siswa yang mengambil diberi pembinaan moral intensif tentang kejujuran, dan orang tua diinformasikan untuk mendampingi di rumah.`
  }
];

export const FormKonferensiKasus: React.FC<FormKonferensiKasusProps> = ({
  initialData,
  onSubmit,
  onCancelEdit,
  isSubmitting = false,
  students = []
}) => {
  const activeGuru = getActiveGuruBK();
  const [activeTab, setActiveTab] = useState<'notula' | 'rapat' | 'hadir'>('notula');

  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [waktu, setWaktu] = useState('09.00 WIB s/d Selesai');
  const [tempat, setTempat] = useState('Ruang BK SMPN 7 Pasuruan');
  const [kelas, setKelas] = useState('8-A');
  const [namaSiswa, setNamaSiswa] = useState('');
  const [nis, setNis] = useState('');
  const [jenisMasalah, setJenisMasalah] = useState(PRESET_6_KASUS[0].jenis);
  const [koordinator, setKoordinator] = useState(activeGuru.nama);
  const [tujuan, setTujuan] = useState(PRESET_6_KASUS[0].tujuan);
  const [pihakTerlibat, setPihakTerlibat] = useState('Kepala Sekolah, Guru BK, Wali Kelas, Guru Mata Pelajaran, & Orang Tua');
  const [kegiatanInti, setKegiatanInti] = useState(PRESET_6_KASUS[0].kegiatanInti);
  const [kesimpulanData, setKesimpulanData] = useState(PRESET_6_KASUS[0].kesimpulan);
  const [tindakLanjut, setTindakLanjut] = useState('Pemberian bimbingan intensif dan pemantauan harian oleh guru BK & wali kelas.');

  // Notulen Rapat
  const [pimpinanRapat, setPimpinanRapat] = useState(KEPALA_SEKOLAH_DEFAULT.nama);
  const [notulisRapat, setNotulisRapat] = useState(activeGuru.nama);
  const [uraianHasilRapat, setUraianHasilRapat] = useState(PRESET_6_KASUS[0].hasilRapat);

  // Daftar Hadir
  const [daftarHadirRows, setDaftarHadirRows] = useState<PesertaKonferensiRow[]>([
    { no: 1, nama: KEPALA_SEKOLAH_DEFAULT.nama, jabatan: 'Kepala Sekolah', asal_sekolah: 'SMPN 7 Pasuruan' },
    { no: 2, nama: activeGuru.nama, jabatan: 'Guru BK / Konselor', asal_sekolah: 'SMPN 7 Pasuruan' },
    { no: 3, nama: 'Wali Kelas ' + kelas, jabatan: 'Wali Kelas', asal_sekolah: 'SMPN 7 Pasuruan' },
    { no: 4, nama: 'Orang Tua / Wali Siswa', jabatan: 'Orang Tua / Wali', asal_sekolah: 'Pasuruan' },
    { no: 5, nama: 'Guru Mata Pelajaran', jabatan: 'Guru Pengajar', asal_sekolah: 'SMPN 7 Pasuruan' }
  ]);

  useEffect(() => {
    if (initialData) {
      setTanggal(initialData.tanggal || new Date().toISOString().split('T')[0]);
      setWaktu(initialData.waktu || '09.00 WIB s/d Selesai');
      setTempat(initialData.tempat || 'Ruang BK SMPN 7 Pasuruan');
      setKelas(initialData.kelas || '8-A');
      setNamaSiswa(initialData.nama_siswa || '');
      setNis(initialData.nis || '');
      setJenisMasalah(initialData.jenis_masalah || PRESET_6_KASUS[0].jenis);
      setKoordinator(initialData.koordinator || activeGuru.nama);
      setTujuan(initialData.data_yang_ingin_diperoleh || '');
      setPihakTerlibat(initialData.pihak_terlibat || '');
      setKegiatanInti(initialData.uraian_kegiatan_inti || '');
      setKesimpulanData(initialData.kesimpulan_data || '');
      setTindakLanjut(initialData.rencana_tindak_lanjut || '');
      setPimpinanRapat(initialData.rapat_pimpinan || KEPALA_SEKOLAH_DEFAULT.nama);
      setNotulisRapat(initialData.rapat_notulis || activeGuru.nama);
      setUraianHasilRapat(initialData.rapat_uraian_hasil || '');
      if (initialData.daftar_hadir_rows && initialData.daftar_hadir_rows.length > 0) {
        setDaftarHadirRows(initialData.daftar_hadir_rows);
      }
    }
  }, [initialData]);

  const handleApplyKasusPreset = (preset: typeof PRESET_6_KASUS[0]) => {
    setJenisMasalah(preset.jenis);
    setTujuan(preset.tujuan);
    setKegiatanInti(preset.kegiatanInti);
    setKesimpulanData(preset.kesimpulan);
    setUraianHasilRapat(preset.hasilRapat);
  };

  const handleAddPesertaRow = () => {
    const nextNo = daftarHadirRows.length + 1;
    setDaftarHadirRows([
      ...daftarHadirRows,
      { no: nextNo, nama: '', jabatan: 'Guru Pengajar', asal_sekolah: 'SMPN 7 Pasuruan' }
    ]);
  };

  const handleRemovePesertaRow = (idx: number) => {
    const updated = daftarHadirRows.filter((_, i) => i !== idx).map((r, i) => ({ ...r, no: i + 1 }));
    setDaftarHadirRows(updated);
  };

  const handleUpdatePesertaRow = (idx: number, field: keyof PesertaKonferensiRow, val: string) => {
    const updated = [...daftarHadirRows];
    updated[idx] = { ...updated[idx], [field]: val };
    setDaftarHadirRows(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaSiswa.trim() || !jenisMasalah.trim()) return;

    const dateObj = new Date(tanggal);
    const calculatedHari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][dateObj.getDay()] || 'Senin';

    const payload: KonferensiKasusItem = {
      id: initialData?.id,
      hari: calculatedHari,
      tanggal,
      waktu,
      tempat,
      kelas,
      nama_siswa: namaSiswa.trim(),
      nis: nis.trim(),
      jenis_masalah: jenisMasalah.trim(),
      koordinator: koordinator.trim(),
      data_yang_ingin_diperoleh: tujuan.trim(),
      pihak_terlibat: pihakTerlibat.trim(),
      uraian_kegiatan_inti: kegiatanInti.trim(),
      kesimpulan_data: kesimpulanData.trim(),
      rencana_tindak_lanjut: tindakLanjut.trim(),
      rapat_pimpinan: pimpinanRapat.trim(),
      rapat_notulis: notulisRapat.trim(),
      rapat_jumlah_hadir: daftarHadirRows.length,
      rapat_uraian_hasil: uraianHasilRapat.trim(),
      daftar_hadir_rows: daftarHadirRows,
      tahun_ajaran: '2026/2027',
      nama_guru_bk: activeGuru.nama,
      nip_guru_bk: activeGuru.nip,
      nama_kepala_sekolah: KEPALA_SEKOLAH_DEFAULT.nama,
      nip_kepala_sekolah: KEPALA_SEKOLAH_DEFAULT.nip
    };

    await onSubmit(payload);
    if (!initialData) {
      setNamaSiswa('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-600" />
            <span>{initialData ? 'Edit Konferensi Kasus Siswa' : 'Form Konferensi Kasus Siswa'}</span>
          </h2>
          <p className="text-xs text-slate-500">Notula kasus, notulen rapat pembahasan, dan daftar hadir konferensi kasus</p>
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

      {/* Preset 6 Kasus Selector */}
      <div className="bg-indigo-50/70 p-4 rounded-xl border border-indigo-200 space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Pilihan Cepat Template 6 Jenis Kasus</span>
          </label>
          <span className="text-[11px] text-indigo-700 font-semibold">Otomatis Mengisi Notula & Notulen</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {PRESET_6_KASUS.map(p => (
            <button
              key={p.jenis}
              type="button"
              onClick={() => handleApplyKasusPreset(p)}
              className={`p-2 rounded-xl text-xs font-bold transition-all border text-left ${
                jenisMasalah === p.jenis
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                  : 'bg-white hover:bg-indigo-50 text-slate-800 border-indigo-200'
              }`}
            >
              <div className="truncate">{p.jenis}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex p-1 bg-slate-100 rounded-xl">
        <button
          type="button"
          onClick={() => setActiveTab('notula')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'notula' ? 'bg-white text-indigo-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          1. Notula Kasus (10 Poin)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('rapat')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'rapat' ? 'bg-white text-indigo-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          2. Notulen Rapat Kasus
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('hadir')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'hadir' ? 'bg-white text-indigo-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          3. Daftar Hadir Peserta ({daftarHadirRows.length})
        </button>
      </div>

      {/* Tab 1: Notula */}
      {activeTab === 'notula' && (
        <div className="space-y-4">
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
              <label className="text-xs font-bold text-slate-700">Waktu / Jam Kejadian</label>
              <input
                type="text"
                value={waktu}
                onChange={e => setWaktu(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 font-semibold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Tempat Pelaksanaan</label>
              <input
                type="text"
                value={tempat}
                onChange={e => setTempat(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 font-semibold"
              />
            </div>
          </div>

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
              <label className="text-xs font-bold text-slate-700">Nama Siswa / Konseli</label>
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
          </div>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Data yang Ingin Diperoleh (Tujuan Konferensi)</label>
              <textarea
                rows={2}
                value={tujuan}
                onChange={e => setTujuan(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 leading-relaxed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Uraian Singkat Kegiatan Inti</label>
              <textarea
                rows={3}
                value={kegiatanInti}
                onChange={e => setKegiatanInti(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 leading-relaxed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Kesimpulan / Data yang Diperoleh</label>
              <textarea
                rows={2}
                value={kesimpulanData}
                onChange={e => setKesimpulanData(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 leading-relaxed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Rencana Tindak Lanjut Layanan</label>
              <textarea
                rows={2}
                value={tindakLanjut}
                onChange={e => setTindakLanjut(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 leading-relaxed"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Notulen Rapat */}
      {activeTab === 'rapat' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Pimpinan Rapat</label>
              <input
                type="text"
                value={pimpinanRapat}
                onChange={e => setPimpinanRapat(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Notulis Rapat</label>
              <input
                type="text"
                value={notulisRapat}
                onChange={e => setNotulisRapat(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Uraian Hasil Pertemuan / Jalannya Rapat & Keputusan</label>
            <textarea
              rows={6}
              value={uraianHasilRapat}
              onChange={e => setUraianHasilRapat(e.target.value)}
              placeholder="Tuliskan jalannya rapat dan kesepakatan keputusan..."
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 leading-relaxed"
            />
          </div>
        </div>
      )}

      {/* Tab 3: Daftar Hadir */}
      {activeTab === 'hadir' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-slate-800">Daftar Hadir Peserta Konferensi Kasus</div>
            <button
              type="button"
              onClick={handleAddPesertaRow}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl border border-blue-200 transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Tambah Peserta</span>
            </button>
          </div>

          <div className="space-y-2">
            {daftarHadirRows.map((row, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200">
                <span className="w-6 text-center font-bold text-slate-500 text-xs">{row.no}</span>
                <input
                  type="text"
                  value={row.nama}
                  onChange={e => handleUpdatePesertaRow(idx, 'nama', e.target.value)}
                  placeholder="Nama peserta..."
                  className="flex-1 px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 font-medium"
                />
                <input
                  type="text"
                  value={row.jabatan}
                  onChange={e => handleUpdatePesertaRow(idx, 'jabatan', e.target.value)}
                  placeholder="Jabatan / Peran..."
                  className="w-36 sm:w-44 px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900"
                />
                <button
                  type="button"
                  onClick={() => handleRemovePesertaRow(idx)}
                  className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
        >
          <Check className="w-4 h-4" />
          <span>{isSubmitting ? 'Menyimpan...' : initialData ? 'Update Konferensi' : 'Simpan Konferensi Kasus'}</span>
        </button>
      </div>
    </form>
  );
};

export const TabelKonferensiKasus: React.FC<{
  items: KonferensiKasusItem[];
  onEdit: (item: KonferensiKasusItem) => void;
  onDelete: (id: string) => Promise<void>;
  onPrintNotula: (item: KonferensiKasusItem) => void;
  onPrintRapat: (item: KonferensiKasusItem) => void;
  onPrintHadir: (item: KonferensiKasusItem) => void;
}> = ({ items = [], onEdit, onDelete, onPrintNotula, onPrintRapat, onPrintHadir }) => {
  const [search, setSearch] = useState('');

  const filtered = items.filter(it =>
    it.nama_siswa.toLowerCase().includes(search.toLowerCase()) ||
    it.jenis_masalah.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="relative flex-1 sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari siswa atau kasus..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-xs text-slate-800">
          <thead className="bg-slate-100 text-slate-700 font-extrabold uppercase tracking-wider text-[11px] border-b border-slate-200">
            <tr>
              <th className="px-3 py-3 text-center w-12">No</th>
              <th className="px-3 py-3 w-32">Hari / Tgl</th>
              <th className="px-3 py-3 w-36">Siswa & Kelas</th>
              <th className="px-4 py-3">Jenis Masalah</th>
              <th className="px-3 py-3 text-center w-52">Cetak Dokumen Kasus</th>
              <th className="px-3 py-3 text-center w-20">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-slate-400">
                  Belum ada data konferensi kasus siswa.
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
                    <span className="text-[10px] font-bold px-1.5 py-0.2 bg-indigo-50 text-indigo-700 rounded">
                      Kelas {item.kelas}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-slate-900 font-medium">{item.jenis_masalah}</td>
                  <td className="px-3 py-2.5 text-center">
                    <div className="flex flex-wrap items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => onPrintNotula(item)}
                        className="px-2 py-0.5 text-[10px] font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded transition-colors"
                      >
                        Notula
                      </button>
                      <button
                        type="button"
                        onClick={() => onPrintRapat(item)}
                        className="px-2 py-0.5 text-[10px] font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 rounded transition-colors"
                      >
                        Notulen Rapat
                      </button>
                      <button
                        type="button"
                        onClick={() => onPrintHadir(item)}
                        className="px-2 py-0.5 text-[10px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded transition-colors"
                      >
                        Daftar Hadir
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
