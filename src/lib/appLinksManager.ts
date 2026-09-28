import { AppMenuItem } from '../types';

export const DEFAULT_MENU_ITEMS: AppMenuItem[] = [
  {
    id: 'link-agenda-kerja',
    title: 'Agenda Kerja BK SMPN 7',
    category: 'Layanan Utama',
    badgeCode: 'FORM A',
    iconName: 'CalendarCheck',
    routeId: 'internal:agenda_kerja',
    description: 'Pencatatan agenda kerja harian bimbingan dan konseling'
  },
  {
    id: 'link-undangan-ortu',
    title: 'Undangan Orang Tua Siswa',
    category: 'Layanan Utama',
    badgeCode: 'FORM B',
    iconName: 'Mail',
    routeId: 'internal:undangan_orang_tua',
    description: 'Surat panggilan & lembar konsultasi orang tua siswa'
  },
  {
    id: 'link-home-visit',
    title: 'Home Visit / Kunjungan Rumah',
    category: 'Layanan Utama',
    badgeCode: 'FORM C',
    iconName: 'Home',
    routeId: 'internal:home_visit',
    description: 'Surat tugas, surat kesediaan, & laporan 14 poin kunjungan rumah'
  },
  {
    id: 'link-rekam-masalah',
    title: 'Rekam Permasalahan Siswa',
    category: 'Bimbingan & Konseling',
    badgeCode: 'FORM D',
    iconName: 'FileWarning',
    routeId: 'internal:rekam_permasalahan',
    description: 'Dokumentasi penanganan dan rekaman kasus siswa'
  },
  {
    id: 'link-konseling-individu',
    title: 'Rencana Konseling Individu',
    category: 'Bimbingan & Konseling',
    badgeCode: 'FORM E',
    iconName: 'UserCheck',
    routeId: 'internal:konseling_individu',
    description: 'Rencana & evaluasi layanan konseling individu dengan 5 pendekatan'
  },
  {
    id: 'link-konseling-kelompok',
    title: 'Rencana Konseling Kelompok',
    category: 'Bimbingan & Konseling',
    badgeCode: 'FORM F',
    iconName: 'Users',
    routeId: 'internal:konseling_kelompok',
    description: 'Rencana & evaluasi layanan konseling kelompok'
  },
  {
    id: 'link-surat-pernyataan',
    title: 'Surat Pernyataan Siswa',
    category: 'Administrasi Tambahan',
    badgeCode: 'FORM G',
    iconName: 'FileText',
    routeId: 'internal:surat_pernyataan',
    description: 'Pengelolaan SP 1-3, SP Orang Tua, Pengunduran Diri, & SP Damai'
  },
  {
    id: 'link-konferensi-kasus',
    title: 'Konferensi Kasus Siswa',
    category: 'Administrasi Tambahan',
    badgeCode: 'FORM H',
    iconName: 'Briefcase',
    routeId: 'internal:konferensi_kasus',
    description: 'Notula kasus, notulen rapat kasus, & daftar hadir peserta'
  },
  {
    id: 'link-siswa-ats',
    title: 'Siswa ATS (Anak Tidak Sekolah)',
    category: 'Administrasi Tambahan',
    badgeCode: 'FORM I',
    iconName: 'UserX',
    routeId: 'internal:siswa_ats',
    description: 'Pendataan anak tidak sekolah (DO, LTM, Tidak DO/TLM)'
  },
  {
    id: 'link-management-siswa',
    title: 'Management Siswa',
    category: 'Data Master',
    badgeCode: 'MASTER',
    iconName: 'GraduationCap',
    routeId: 'internal:management_siswa',
    description: 'Basis data siswa 24 kelas (7A-7H, 8A-8H, 9A-9H) & import Excel'
  }
];

export function getSavedAppLinks(): AppMenuItem[] {
  return DEFAULT_MENU_ITEMS;
}
