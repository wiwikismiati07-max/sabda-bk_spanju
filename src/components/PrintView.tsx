import React from 'react';
import { Printer, ArrowLeft, Download } from 'lucide-react';
import { SignatureBox } from './SignatureBox';
import { exportHtmlToWord } from '../lib/wordExporter';

interface PrintViewProps {
  docType: string;
  data: any;
  onBack: () => void;
}

export const KopSuratSMPN7: React.FC = () => {
  return (
    <div className="w-full text-center border-b-4 border-double border-black pb-3 mb-6">
      <div className="flex items-center justify-between px-4">
        {/* Logo Kiri: Pemkot Pasuruan */}
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Logo_Kota_Pasuruan_-_Seal_of_Pasuruan_City.svg/200px-Logo_Kota_Pasuruan_-_Seal_of_Pasuruan_City.svg.png"
          alt="Logo Pemkot Pasuruan"
          className="w-20 h-20 object-contain"
        />

        {/* Header Text */}
        <div className="flex-1 px-4 text-center">
          <div className="font-extrabold text-base tracking-wider uppercase text-black leading-tight">
            PEMERINTAH KOTA PASURAN
          </div>
          <div className="font-extrabold text-lg uppercase text-black tracking-wide leading-tight">
            DINAS PENDIDIKAN DAN KEBUDAYAAN
          </div>
          <div className="font-black text-xl uppercase text-black tracking-widest leading-tight">
            UPT SMP NEGERI 7 PASURAN
          </div>
          <div className="text-xs text-black font-normal mt-0.5 leading-snug">
            Jalan Simpang Slamet Riadi Nomor 2, Kota Pasuruan, Jawa Timur 67139<br />
            Telepon: (0343) 426845 • Pos-el: smp7pas@yahoo.co.id • Laman: www.smpn7pasuruan.sch.id
          </div>
        </div>

        {/* Logo Kanan: SMPN 7 Pasuruan */}
        <img
          src="https://iili.io/KDFk4fI.png"
          alt="Logo SMPN 7"
          className="w-20 h-20 object-contain"
        />
      </div>
    </div>
  );
};

export const PrintView: React.FC<PrintViewProps> = ({ docType, data, onBack }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleExportWord = () => {
    const el = document.getElementById('printable-document-content');
    if (el) {
      exportHtmlToWord(el.innerHTML, `Dokumen_${docType}_${new Date().toISOString().split('T')[0]}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6 text-black">
      {/* Top Action Toolbar (Hidden in Print) */}
      <div className="no-print max-w-4xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Form / Tabel</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportWord}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors shadow-2xs"
          >
            <Download className="w-4 h-4" />
            <span>Unduh Word (.doc)</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / Simpan PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet (A4 Styling) */}
      <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-2xl shadow-lg border border-slate-200 print:shadow-none print:border-none print:p-0">
        <div id="printable-document-content" className="space-y-6">
          <KopSuratSMPN7 />

          {/* 1. AGENDA KERJA BK */}
          {docType === 'agenda_kerja' && (
            <div>
              <div className="text-center font-extrabold text-base uppercase underline underline-offset-4 mb-4">
                AGENDA KERJA HARIAN BIMBINGAN DAN KONSELING
              </div>
              <table className="w-full text-left border-collapse border border-black text-xs">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border border-black p-2 text-center w-10">No</th>
                    <th className="border border-black p-2 w-36">Hari / Tanggal</th>
                    <th className="border border-black p-2 w-28">Waktu</th>
                    <th className="border border-black p-2">Uraian Kegiatan</th>
                    <th className="border border-black p-2 w-32">Sasaran</th>
                    <th className="border border-black p-2 w-24">Keterangan</th>
                  </tr>
                </thead>
                <tbody>
                  {(Array.isArray(data) ? data : [data]).map((it: any, i: number) => (
                    <tr key={i}>
                      <td className="border border-black p-2 text-center">{i + 1}</td>
                      <td className="border border-black p-2">{it.hari}, {it.tanggal}</td>
                      <td className="border border-black p-2">{it.waktu}</td>
                      <td className="border border-black p-2">{it.uraian_kegiatan}</td>
                      <td className="border border-black p-2">{it.sasaran}</td>
                      <td className="border border-black p-2">{it.keterangan || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="grid grid-cols-2 gap-4 mt-8 pt-4">
                <SignatureBox
                  id="agenda-kepsek"
                  role="Mengetahui, Kepala Sekolah"
                  name={data?.nama_kepala_sekolah || 'NUR FADILAH, S.Pd,. M.Pd'}
                  nip={data?.nip_kepala_sekolah || '19860410 201001 2 030'}
                  isKepalaSekolah={true}
                />
                <SignatureBox
                  id="agenda-guru-bk"
                  role="Guru Bimbingan dan Konseling"
                  name={data?.nama_guru_bk || 'WIWIK ISMIATI, S.Pd'}
                  nip={data?.nip_guru_bk || '19831116 200904 2 003'}
                />
              </div>
            </div>
          )}

          {/* 2. SURAT UNDANGAN ORANG TUA */}
          {docType === 'undangan_surat' && (
            <div className="space-y-4 text-sm leading-relaxed">
              <div className="flex justify-between items-start text-xs">
                <div>
                  <div>Nomor : {data.nomor_surat || '400/ 015 /423.102.54/2026'}</div>
                  <div>Lampiran : -</div>
                  <div>Perihal : <b>Undangan Orang Tua / Wali Siswa</b></div>
                </div>
                <div className="text-right">
                  <div>{data.tempat_surat || 'Pasuruan'}, {data.tanggal_surat || data.tanggal}</div>
                  <div className="mt-2">Kepada Yth.</div>
                  <div className="font-bold">Bapak / Ibu / Wali dari Siswa:</div>
                  <div className="font-extrabold uppercase">{data.nama_siswa} (Kelas {data.kelas})</div>
                  <div>di Tempat</div>
                </div>
              </div>

              <div className="mt-4">Dengan hormat,</div>
              <p>
                Sehubungan dengan pentingnya koordinasi antara pihak sekolah dengan orang tua/wali siswa demi peningkatan perkembangan belajar dan pembinaan kedisiplinan siswa di sekolah, maka dengan ini kami mengharap kehadiran Bapak/Ibu/Wali murid pada:
              </p>

              <div className="pl-6 space-y-1 my-3">
                <div className="grid grid-cols-4 gap-2">
                  <div className="font-semibold">Hari / Tanggal</div>
                  <div className="col-span-3">: {data.hari}, {data.tanggal}</div>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <div className="font-semibold">Waktu / Pukul</div>
                  <div className="col-span-3">: {data.waktu}</div>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <div className="font-semibold">Tempat</div>
                  <div className="col-span-3">: {data.tempat_pelaksanaan || 'Ruang BK SMP Negeri 7 Pasuruan'}</div>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <div className="font-semibold">Acara / Perihal</div>
                  <div className="col-span-3 font-bold">: {data.perihal_undangan}</div>
                </div>
              </div>

              <p>
                Mengingat pentingnya acara ini demi kebaikan dan masa depan putra/putri Bapak/Ibu, dimohon untuk hadir tepat waktu dan <span className="underline font-bold">tidak diwakilkan</span>.
              </p>

              <p className="mt-2">
                Demikian surat undangan ini kami sampaikan. Atas perhatian, kehadiran, dan kerjasamanya, kami sampaikan terima kasih.
              </p>

              <div className="grid grid-cols-2 gap-4 mt-8 pt-4">
                <SignatureBox
                  id={`undangan-kepsek-${data.id || 'new'}`}
                  role="Mengetahui, Kepala Sekolah"
                  name={data.nama_kepala_sekolah || 'NUR FADILAH, S.Pd,. M.Pd'}
                  nip={data.nip_kepala_sekolah || '19860410 201001 2 030'}
                  isKepalaSekolah={true}
                />
                <SignatureBox
                  id={`undangan-guru-${data.id || 'new'}`}
                  role="Guru Bimbingan dan Konseling"
                  name={data.nama_guru_bk || 'WIWIK ISMIATI, S.Pd'}
                  nip={data.nip_guru_bk || '19831116 200904 2 003'}
                />
              </div>
            </div>
          )}

          {/* 3. LAPORAN KONSULTASI ORTU */}
          {docType === 'undangan_laporan' && (
            <div className="space-y-4">
              <div className="text-center font-extrabold text-base uppercase underline underline-offset-4 mb-2">
                LAPORAN KONSULTASI DENGAN ORANG TUA SISWA
              </div>

              <div className="border border-black p-4 rounded text-xs space-y-2">
                <div className="grid grid-cols-4 gap-2"><span className="font-bold">Nama Siswa / Konseli</span><span className="col-span-3">: {data.nama_siswa}</span></div>
                <div className="grid grid-cols-4 gap-2"><span className="font-bold">Kelas</span><span className="col-span-3">: {data.kelas}</span></div>
                <div className="grid grid-cols-4 gap-2"><span className="font-bold">Hari / Tanggal Konsultasi</span><span className="col-span-3">: {data.hari}, {data.tanggal} ({data.waktu})</span></div>
                <div className="grid grid-cols-4 gap-2"><span className="font-bold">Nama Orang Tua / Wali</span><span className="col-span-3">: {data.nama_orang_tua || '-'}</span></div>
                <div className="grid grid-cols-4 gap-2"><span className="font-bold">Topik / Masalah</span><span className="col-span-3 font-semibold">: {data.perihal_undangan}</span></div>
                <div className="grid grid-cols-4 gap-2"><span className="font-bold">Uraian Permasalahan</span><span className="col-span-3">: {data.uraian_permasalahan || '-'}</span></div>
                <div className="grid grid-cols-4 gap-2"><span className="font-bold">Tindak Lanjut & Kesepakatan</span><span className="col-span-3">: {data.tindak_lanjut || '-'}</span></div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8 pt-4">
                <SignatureBox
                  id={`konsul-ortu-${data.id || 'new'}`}
                  role="Orang Tua / Wali Siswa"
                  name={data.nama_orang_tua || 'Orang Tua / Wali'}
                />
                <SignatureBox
                  id={`konsul-guru-${data.id || 'new'}`}
                  role="Guru Bimbingan dan Konseling"
                  name={data.nama_guru_bk || 'WIWIK ISMIATI, S.Pd'}
                  nip={data.nip_guru_bk || '19831116 200904 2 003'}
                />
              </div>
            </div>
          )}

          {/* 4. SURAT TUGAS HOME VISIT */}
          {docType === 'home_visit_surat_tugas' && (
            <div className="space-y-4 text-sm leading-relaxed">
              <div className="text-center font-extrabold text-base uppercase underline underline-offset-4">
                SURAT TUGAS KUNJUNGAN RUMAH (HOME VISIT)
              </div>
              <div className="text-center text-xs font-semibold -mt-2">
                Nomor: {data.nomor_surat_tugas || '400/ 015 /423.102.54/2026'}
              </div>

              <p className="mt-4">
                Yang bertanda tangan di bawah ini Kepala UPT SMP Negeri 7 Pasuruan memberikan tugas kepada:
              </p>

              <div className="pl-6 space-y-1 text-xs">
                <div className="grid grid-cols-4 gap-2 font-bold"><span className="w-8">1.</span><span>Nama</span><span className="col-span-2">: {data.petugas_1 || 'WIWIK ISMIATI, S.Pd'}</span></div>
                <div className="grid grid-cols-4 gap-2"><span className="w-8"></span><span>Jabatan</span><span className="col-span-2">: {data.jabatan_petugas_1 || 'Guru Bimbingan dan Konseling'}</span></div>
                <div className="grid grid-cols-4 gap-2 font-bold mt-2"><span className="w-8">2.</span><span>Nama</span><span className="col-span-2">: {data.petugas_2 || 'Wali Kelas ' + data.kelas}</span></div>
                <div className="grid grid-cols-4 gap-2"><span className="w-8"></span><span>Jabatan</span><span className="col-span-2">: {data.jabatan_petugas_2 || 'Wali Kelas'}</span></div>
              </div>

              <p className="mt-3">
                Untuk melaksanakan kunjungan rumah (home visit) ke tempat kediaman orang tua/wali siswa:
              </p>

              <div className="pl-6 space-y-1 text-xs bg-slate-50 p-3 rounded border border-slate-300">
                <div className="grid grid-cols-4 gap-2"><span className="font-bold">Nama Siswa</span><span className="col-span-3 font-extrabold uppercase">: {data.nama_siswa}</span></div>
                <div className="grid grid-cols-4 gap-2"><span className="font-bold">Kelas / NIS</span><span className="col-span-3">: Kelas {data.kelas} / NIS: {data.nis_siswa || '-'}</span></div>
                <div className="grid grid-cols-4 gap-2"><span className="font-bold">Orang Tua / Wali</span><span className="col-span-3">: {data.nama_orang_tua}</span></div>
                <div className="grid grid-cols-4 gap-2"><span className="font-bold">Alamat Rumah</span><span className="col-span-3">: {data.alamat}</span></div>
                <div className="grid grid-cols-4 gap-2"><span className="font-bold">Hari / Tanggal</span><span className="col-span-3">: {data.hari}, {data.tanggal}</span></div>
                <div className="grid grid-cols-4 gap-2"><span className="font-bold">Tujuan / Kasus</span><span className="col-span-3 font-semibold">: {data.perihal_home_visit}</span></div>
              </div>

              <p className="mt-3">
                Demikian surat tugas ini dibuat agar dilaksanakan dengan sebaik-baiknya dan penuh rasa tanggung jawab.
              </p>

              <div className="grid grid-cols-2 gap-4 mt-8 pt-4">
                <div className="text-xs text-slate-500 italic flex items-end">
                  SMP Negeri 7 Pasuruan
                </div>
                <SignatureBox
                  id={`hv-st-kepsek-${data.id || 'new'}`}
                  role="Kepala UPT SMPN 7 Pasuruan"
                  name={data.nama_kepala_sekolah || 'NUR FADILAH, S.Pd,. M.Pd'}
                  nip={data.nip_kepala_sekolah || '19860410 201001 2 030'}
                  isKepalaSekolah={true}
                />
              </div>
            </div>
          )}

          {/* 5. SURAT PERNYATAAN DAMAI SISWA */}
          {docType === 'sp_damai' && (
            <div className="space-y-4 text-sm leading-relaxed">
              <div className="text-center font-extrabold text-base uppercase underline underline-offset-4">
                SURAT PERNYATAAN DAMAI SISWA
              </div>
              <div className="text-center text-xs font-semibold -mt-2">
                SMP NEGERI 7 PASURUAN • TAHUN AJARAN {data.tahun_ajaran || '2026-2027'}
              </div>

              <p className="mt-4">
                Pada hari ini, <b>{data.hari_tanggal_kejadian || `${data.hari}, ${data.tanggal}`}</b>, kami yang bertanda tangan di bawah ini:
              </p>

              <div className="pl-6 space-y-1 text-xs bg-slate-50 p-3.5 rounded-lg border border-slate-300">
                <div className="grid grid-cols-4 gap-2"><span className="font-bold">Nama Siswa Pertama</span><span className="col-span-3 font-extrabold">: {data.nama_siswa}</span></div>
                <div className="grid grid-cols-4 gap-2"><span className="font-bold">Kelas</span><span className="col-span-3">: Kelas {data.kelas}</span></div>
                <div className="grid grid-cols-4 gap-2 mt-2 pt-2 border-t border-slate-200"><span className="font-bold">Nama Siswa Kedua</span><span className="col-span-3 font-extrabold">: {data.nama_siswa_2 || '-'}</span></div>
                <div className="grid grid-cols-4 gap-2"><span className="font-bold">Kelas</span><span className="col-span-3">: Kelas {data.kelas_2 || '-'}</span></div>
              </div>

              <p className="mt-2 font-medium">
                Menyatakan bahwa kami telah bersepakat untuk damai dan menyelesaikan perselisihan yang pernah terjadi secara kekeluargaan. Dengan ini kami berjanji:
              </p>

              <ol className="list-decimal pl-6 space-y-1.5 text-xs">
                <li>Saling memaafkan dengan tulus dan tidak akan mengungkit atau memperpanjang masalah ini lagi.</li>
                <li>Kembali berteman dengan baik serta tidak akan saling mengejek, mengancam, memprovokasi, atau melakukan kekerasan dalam bentuk apa pun.</li>
                <li>Siap menerima sanksi tegas dari pihak sekolah sesuai dengan aturan yang berlaku apabila melanggar janji ini.</li>
              </ol>

              <p className="mt-3">
                Demikian surat pernyataan damai ini kami buat dengan penuh kesadaran dan tanggung jawab, tanpa ada paksaan dari pihak mana pun.
              </p>

              <div className="grid grid-cols-2 gap-4 mt-6 pt-2">
                <SignatureBox
                  id={`sp-damai-p1-${data.id || 'new'}`}
                  role="Siswa Pertama (Pihak 1)"
                  name={data.nama_siswa}
                />
                <SignatureBox
                  id={`sp-damai-p2-${data.id || 'new'}`}
                  role="Siswa Kedua (Pihak 2)"
                  name={data.nama_siswa_2 || 'Siswa Kedua'}
                />
              </div>

              <div className="mt-6 flex justify-center">
                <SignatureBox
                  id={`sp-damai-guru-${data.id || 'new'}`}
                  role="Mengetahui, Guru BK / Wali Kelas"
                  name={data.nama_guru_bk || 'WIWIK ISMIATI, S.Pd'}
                  nip={data.nip_guru_bk || '19831116 200904 2 003'}
                />
              </div>
            </div>
          )}

          {/* 6. SURAT PERNYATAAN REGULER (SP 1-3, ORTU, PINDAH) */}
          {docType === 'surat_pernyataan_reguler' && (
            <div className="space-y-4 text-sm leading-relaxed">
              <div className="text-center font-extrabold text-base uppercase underline underline-offset-4">
                SURAT PERNYATAAN SISWA ({data.jenis_sp})
              </div>
              <div className="text-center text-xs font-semibold -mt-2">
                UPT SMP NEGERI 7 PASURUAN
              </div>

              <p className="mt-4">Yang bertanda tangan di bawah ini:</p>
              <div className="pl-6 space-y-1 text-xs">
                <div className="grid grid-cols-4 gap-2"><span className="font-bold">Nama Siswa</span><span className="col-span-3 font-bold">: {data.nama_siswa}</span></div>
                <div className="grid grid-cols-4 gap-2"><span className="font-bold">Kelas</span><span className="col-span-3">: Kelas {data.kelas}</span></div>
                <div className="grid grid-cols-4 gap-2"><span className="font-bold">Nama Orang Tua / Wali</span><span className="col-span-3">: {data.nama_orang_tua || '-'}</span></div>
                <div className="grid grid-cols-4 gap-2"><span className="font-bold">Alamat</span><span className="col-span-3">: {data.alamat_orang_tua || '-'}</span></div>
              </div>

              <p className="mt-2 font-medium">
                {data.jenis_sp === 'SP PENGUNDURAN DIRI'
                  ? 'Dengan ini menyatakan mengajukan pengunduran diri / pindah sekolah dengan alasan sebagai berikut:'
                  : 'Dengan ini sungguh-sungguh menyatakan dan berjanji untuk:'}
              </p>

              <div className="p-3 bg-slate-50 rounded border border-slate-300 text-xs">
                {data.jenis_sp === 'SP PENGUNDURAN DIRI'
                  ? (data.alasan_pengunduran || 'Alasan pribadi keluarga.')
                  : (data.peraturan_diketahui || 'Menaati seluruh tata tertib sekolah, hadir tepat waktu, dan tidak mengulangi pelanggaran.')}
              </div>

              <p className="mt-2">
                Demikian surat pernyataan ini dibuat dengan sadar tanpa paksaan dari pihak mana pun.
              </p>

              <div className="grid grid-cols-2 gap-4 mt-8 pt-4">
                <SignatureBox
                  id={`sp-ortu-${data.id || 'new'}`}
                  role="Orang Tua / Wali Siswa"
                  name={data.nama_orang_tua || 'Orang Tua'}
                />
                <SignatureBox
                  id={`sp-siswa-${data.id || 'new'}`}
                  role="Siswa yang Menyatakan"
                  name={data.nama_siswa}
                />
              </div>

              <div className="mt-6 flex justify-center">
                <SignatureBox
                  id={`sp-guru-${data.id || 'new'}`}
                  role="Mengetahui, Guru BK / Konselor"
                  name={data.nama_guru_bk || 'WIWIK ISMIATI, S.Pd'}
                  nip={data.nip_guru_bk || '19831116 200904 2 003'}
                />
              </div>
            </div>
          )}

          {/* 7. SISWA ATS (ANAK TIDAK SEKOLAH) */}
          {docType === 'siswa_ats' && (
            <div className="space-y-4 text-sm leading-relaxed">
              <div className="text-center font-extrabold text-base uppercase underline underline-offset-4">
                LAPORAN PENDATAAN & PENANGANAN SISWA ATS (ANAK TIDAK SEKOLAH)
              </div>
              <div className="text-center text-xs font-semibold -mt-2">
                TAHUN AJARAN {data.tahun_ajaran || '2026/2027'} • UPT SMP NEGERI 7 PASURUAN
              </div>

              <div className="border border-black p-4 rounded text-xs space-y-2 mt-4">
                <div className="grid grid-cols-4 gap-2"><span className="font-bold">Status / Kategori ATS</span><span className="col-span-3 font-extrabold text-rose-700">: {data.kategori_ats}</span></div>
                <div className="grid grid-cols-4 gap-2"><span className="font-bold">Nama Siswa ATS</span><span className="col-span-3 font-extrabold uppercase">: {data.nama_siswa}</span></div>
                <div className="grid grid-cols-4 gap-2"><span className="font-bold">Kelas Terakhir</span><span className="col-span-3">: Kelas {data.kelas}</span></div>
                <div className="grid grid-cols-4 gap-2"><span className="font-bold">Nama Orang Tua / Wali</span><span className="col-span-3">: {data.nama_orang_tua || '-'}</span></div>
                <div className="grid grid-cols-4 gap-2"><span className="font-bold">Alamat Lengkap</span><span className="col-span-3">: {data.alamat}</span></div>
                <div className="grid grid-cols-4 gap-2"><span className="font-bold">Hari / Tanggal Kunjungan</span><span className="col-span-3">: {data.hari}, {data.tanggal} ({data.waktu})</span></div>
                <div className="grid grid-cols-4 gap-2"><span className="font-bold">Penyebab / Alasan ATS</span><span className="col-span-3 font-semibold">: {data.alasan_ats}</span></div>
                {data.alasan_manual && (
                  <div className="grid grid-cols-4 gap-2"><span className="font-bold">Catatan Penanganan</span><span className="col-span-3">: {data.alasan_manual}</span></div>
                )}
              </div>

              {/* Photos in Print */}
              {(data.foto_kunjungan_1 || data.foto_bukti_fisik_2) && (
                <div className="grid grid-cols-2 gap-4 mt-3">
                  {data.foto_kunjungan_1 && (
                    <div className="border border-slate-300 p-2 text-center rounded">
                      <div className="text-[10px] font-bold text-slate-700 mb-1">Foto Kunjungan Lapangan</div>
                      <img src={data.foto_kunjungan_1} alt="Foto 1" className="max-h-40 mx-auto object-contain rounded" />
                    </div>
                  )}
                  {data.foto_bukti_fisik_2 && (
                    <div className="border border-slate-300 p-2 text-center rounded">
                      <div className="text-[10px] font-bold text-slate-700 mb-1">Foto Bukti Fisik / Dokumen</div>
                      <img src={data.foto_bukti_fisik_2} alt="Foto 2" className="max-h-40 mx-auto object-contain rounded" />
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mt-8 pt-4">
                <SignatureBox
                  id={`ats-kepsek-${data.id || 'new'}`}
                  role="Mengetahui, Kepala Sekolah"
                  name={data.nama_kepala_sekolah || 'NUR FADILAH, S.Pd,. M.Pd'}
                  nip={data.nip_kepala_sekolah || '19860410 201001 2 030'}
                  isKepalaSekolah={true}
                />
                <SignatureBox
                  id={`ats-guru-${data.id || 'new'}`}
                  role="Guru BK Petugas Kunjungan"
                  name={data.nama_guru_kunjungan || 'WIWIK ISMIATI, S.Pd'}
                  nip={data.nip_guru_kunjungan || '19831116 200904 2 003'}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
