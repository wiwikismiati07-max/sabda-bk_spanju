import { GuruBKProfile } from '../types';

export const DAFTAR_GURU_BK: GuruBKProfile[] = [
  {
    nama: 'WIWIK ISMIATI, S.Pd',
    nip: '19831116 200904 2 003'
  },
  {
    nama: 'EKI FEBRIANI, S.Pd',
    nip: '19940214 202221 2 014'
  }
];

export const KEPALA_SEKOLAH_DEFAULT = {
  nama: 'NUR FADILAH, S.Pd,. M.Pd',
  nip: '19860410 201001 2 030'
};

const STORAGE_KEY_ACTIVE_GURU = 'sabda_bk_active_guru';

export function getActiveGuruBK(): GuruBKProfile {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_ACTIVE_GURU);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed?.nama && parsed?.nip) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error loading active Guru BK', e);
  }
  return DAFTAR_GURU_BK[0];
}

export function setActiveGuruBK(guru: GuruBKProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY_ACTIVE_GURU, JSON.stringify(guru));
  } catch (e) {
    console.error('Error saving active Guru BK', e);
  }
}
