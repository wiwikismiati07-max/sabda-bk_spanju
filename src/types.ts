/**
 * Data Interfaces for SABDA BK SPANJU - SMPN 7 Pasuruan
 */

export interface SiswaBK {
  id?: string;
  created_at?: string;
  updated_at?: string;
  nama_siswa: string;
  kelas: string;
  nis: string;
  jenis_kelamin: 'Laki-laki' | 'Perempuan' | 'L' | 'P' | string;
  keterangan?: string;
}

export interface AgendaKerjaItem {
  id?: string;
  created_at?: string;
  updated_at?: string;
  hari: string;
  tanggal: string;
  bulan: string;
  tahun: string;
  waktu: string;
  uraian_kegiatan: string;
  sasaran: string;
  link_foto_kegiatan?: string;
  keterangan?: string;
}

export interface UndanganOrangTuaItem {
  id?: string;
  created_at?: string;
  updated_at?: string;
  hari: string;
  tanggal: string;
  waktu: string;
  tempat_pelaksanaan?: string;
  kelas: string;
  nama_siswa: string;
  nama_orang_tua: string;
  pekerjaan_orang_tua?: string;
  alamat?: string;
  perihal_undangan: string;
  uraian_permasalahan?: string;
  tindak_lanjut?: string;
  link_foto_kegiatan?: string;
  keterangan?: string;
  nomor_surat?: string;
  tanggal_surat?: string;
  tempat_surat?: string;
  semester?: string;
  nama_guru_bk?: string;
  nip_guru_bk?: string;
  nama_kepala_sekolah?: string;
  nip_kepala_sekolah?: string;
}

export interface HomeVisitItem {
  id?: string;
  created_at?: string;
  updated_at?: string;
  hari: string;
  tanggal: string;
  waktu?: string;
  kelas: string;
  nama_siswa: string;
  nama_orang_tua: string;
  pekerjaan_orang_tua?: string;
  alamat: string;
  perihal_home_visit: string;
  uraian_permasalahan?: string;
  tindak_lanjut?: string;
  link_foto_kegiatan?: string;
  keterangan?: string;
  // Surat Tugas & Pernyataan
  nomor_surat_tugas?: string;
  nis_siswa?: string;
  petugas_1?: string;
  jabatan_petugas_1?: string;
  petugas_2?: string;
  jabatan_petugas_2?: string;
  tanggal_surat_tugas?: string;
  tanggal_pernyataan_ortu?: string;
  // Laporan 14 Poin
  semester_laporan?: string;
  bidang_layanan?: string;
  topik_permasalahan?: string;
  fungsi_layanan?: string;
  pihak_terlibat?: string;
  tujuan_kegiatan?: string;
  gambaran_ringkas_masalah?: string;
  alamat_kunjungan?: string;
  hari_tanggal_lama_kunjungan?: string;
  anggota_keluarga_dikunjungi?: string;
  rencana_evaluasi?: string;
  tindak_lanjut_14_poin?: string;
  catatan_khusus?: string;
  nama_guru_bk?: string;
  nip_guru_bk?: string;
  nama_kepala_sekolah?: string;
  nip_kepala_sekolah?: string;
}

export interface RekamPermasalahanItem {
  id?: string;
  created_at?: string;
  updated_at?: string;
  hari: string;
  tanggal: string;
  waktu: string;
  kelas: string;
  nama_siswa: string;
  nama_orang_tua?: string;
  pekerjaan_orang_tua?: string;
  alamat?: string;
  ringkasan_uraian_masalah: string;
  upaya_penanganan: string;
  hasil_dan_kesimpulan: string;
  link_foto_kegiatan?: string;
  keterangan?: string;
  nama_guru_bk?: string;
  nip_guru_bk?: string;
  nama_kepala_sekolah?: string;
  nip_kepala_sekolah?: string;
}

export interface KonselingIndividuItem {
  id?: string;
  created_at?: string;
  updated_at?: string;
  hari: string;
  tanggal: string;
  waktu: string;
  kelas: string;
  nama_siswa: string;
  topik_permasalahan: string;
  media_yang_diperlukan?: string;
  ringkasan_uraian_masalah: string;
  pendekatan_teknik_konseling: string;
  hasil_yang_dicapai: string;
  link_foto_kegiatan?: string;
  keterangan?: string;
  nama_guru_bk?: string;
  nip_guru_bk?: string;
  nama_kepala_sekolah?: string;
  nip_kepala_sekolah?: string;
}

export interface KonselingKelompokItem {
  id?: string;
  created_at?: string;
  updated_at?: string;
  hari: string;
  tanggal: string;
  waktu: string;
  kelas: string;
  nama_siswa: string; // List or comma-separated members
  anggota_kelompok?: string[];
  topik_permasalahan: string;
  media_yang_diperlukan?: string;
  ringkasan_uraian_masalah: string;
  pendekatan_teknik_konseling: string;
  hasil_yang_dicapai: string;
  link_foto_kegiatan?: string;
  keterangan?: string;
  nama_guru_bk?: string;
  nip_guru_bk?: string;
  nama_kepala_sekolah?: string;
  nip_kepala_sekolah?: string;
}

export interface SuratPernyataanItem {
  id?: string;
  created_at?: string;
  updated_at?: string;
  jenis_sp: 'SP 1' | 'SP 2' | 'SP 3' | 'SP ORANG TUA 1' | 'SP ORANG TUA 2' | 'SP PENGUNDURAN DIRI' | 'SP DAMAI SISWA' | string;
  nama_siswa: string;
  kelas: string;
  nis?: string;
  nama_siswa_2?: string;
  kelas_2?: string;
  hari_tanggal_kejadian?: string;
  tahun_ajaran?: string;
  jabatan_pengetahu?: string;
  nama_orang_tua?: string;
  pekerjaan_orang_tua?: string;
  alamat_orang_tua?: string;
  hubungan_keluarga?: string;
  peraturan_diketahui?: string;
  alasan_pengunduran?: string;
  tanggal_surat?: string;
  tempat_surat?: string;
  keterangan?: string;
  nama_guru_bk?: string;
  nip_guru_bk?: string;
  nama_kepala_sekolah?: string;
  nip_kepala_sekolah?: string;
}

export interface PesertaKonferensiRow {
  no: number;
  nama: string;
  jabatan: string;
  kelas?: string;
  asal_sekolah?: string;
  tanda_tangan?: string;
}

export interface KonferensiKasusItem {
  id?: string;
  created_at?: string;
  updated_at?: string;
  hari: string;
  tanggal: string;
  waktu: string;
  tempat?: string;
  kelas: string;
  nama_siswa: string;
  nis?: string;
  jenis_masalah: string;
  koordinator: string;
  data_yang_ingin_diperoleh: string; // Tujuan
  pihak_terlibat: string;
  uraian_kegiatan_inti: string;
  kesimpulan_data: string;
  rencana_tindak_lanjut: string;
  // Notulen Rapat
  rapat_pimpinan?: string;
  rapat_notulis?: string;
  rapat_jumlah_hadir?: number;
  rapat_uraian_hasil?: string;
  // Daftar Hadir
  daftar_hadir_rows?: PesertaKonferensiRow[];
  tahun_ajaran?: string;
  nama_guru_bk?: string;
  nip_guru_bk?: string;
  nama_kepala_sekolah?: string;
  nip_kepala_sekolah?: string;
}

export interface SiswaATSItem {
  id?: string;
  created_at?: string;
  updated_at?: string;
  hari: string;
  tanggal: string;
  waktu: string;
  tahun_ajaran: string;
  nama_siswa: string;
  kategori_ats: 'DO (Drop Out)' | 'LTM (Lulus Tidak Melanjutkan)' | 'Tidak DO/TLM' | string;
  kelas: string;
  nama_orang_tua?: string;
  alamat: string;
  alasan_ats: string;
  alasan_manual?: string;
  foto_kunjungan_1?: string;
  foto_bukti_fisik_2?: string;
  tempat_laporan?: string;
  tanggal_laporan: string;
  nama_guru_kunjungan: string;
  nip_guru_kunjungan: string;
  nama_kepala_sekolah?: string;
  nip_kepala_sekolah?: string;
  keterangan?: string;
}

export interface GuruBKProfile {
  nama: string;
  nip: string;
}

export interface AppMenuItem {
  id: string;
  title: string;
  category: 'Layanan Utama' | 'Bimbingan & Konseling' | 'Administrasi Tambahan' | 'Data Master';
  badgeCode: string;
  iconName: string;
  routeId: string;
  description: string;
}
