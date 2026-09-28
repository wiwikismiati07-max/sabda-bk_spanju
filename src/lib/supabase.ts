import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  AgendaKerjaItem,
  UndanganOrangTuaItem,
  HomeVisitItem,
  RekamPermasalahanItem,
  KonselingIndividuItem,
  KonselingKelompokItem,
  SuratPernyataanItem,
  KonferensiKasusItem,
  SiswaATSItem,
  SiswaBK
} from '../types';

export const DEFAULT_SUPABASE_URL = 'https://kedffsrkxwlnynrnicek.supabase.co';
export const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_d_FaCtLsGNP2n2PKuI-1gQ_Lc3E5DJi';

const STORAGE_KEY_URL = 'sabda_bk_supabase_url';
const STORAGE_KEY_KEY = 'sabda_bk_supabase_anon_key';

let cachedClient: SupabaseClient | null = null;

export function getSavedSupabaseConfig() {
  const url = localStorage.getItem(STORAGE_KEY_URL) || DEFAULT_SUPABASE_URL;
  const anonKey = localStorage.getItem(STORAGE_KEY_KEY) || DEFAULT_SUPABASE_ANON_KEY;
  return { url, anonKey };
}

export function saveSupabaseConfig(url: string, anonKey: string) {
  localStorage.setItem(STORAGE_KEY_URL, url.trim());
  localStorage.setItem(STORAGE_KEY_KEY, anonKey.trim());
  cachedClient = null; // force recreate
}

export function getSupabaseClient(): SupabaseClient | null {
  if (cachedClient) return cachedClient;
  const { url, anonKey } = getSavedSupabaseConfig();
  if (url && anonKey) {
    try {
      cachedClient = createClient(url, anonKey, {
        auth: { persistSession: false },
        realtime: {
          params: {
            eventsPerSecond: 10
          }
        }
      });
      return cachedClient;
    } catch (e) {
      console.error('Failed to init Supabase client', e);
    }
  }
  return null;
}

// -------------------------------------------------------------
// SEEDING DATA FOR DEMO & FALLBACK
// -------------------------------------------------------------

export const SEED_SISWA: SiswaBK[] = [
  { nama_siswa: 'ADITYA PRATAMA', kelas: '7-A', nis: '10201', jenis_kelamin: 'Laki-laki' },
  { nama_siswa: 'AISYAH PUTRI NURAINI', kelas: '7-A', nis: '10202', jenis_kelamin: 'Perempuan' },
  { nama_siswa: 'BAGAS ALDIANSYAH', kelas: '7-B', nis: '10235', jenis_kelamin: 'Laki-laki' },
  { nama_siswa: 'CITRA LESTARI DEWI', kelas: '7-B', nis: '10236', jenis_kelamin: 'Perempuan' },
  { nama_siswa: 'DIMAS WAHYU PRASETYO', kelas: '8-A', nis: '09812', jenis_kelamin: 'Laki-laki' },
  { nama_siswa: 'FANI RAHMAWATI', kelas: '8-A', nis: '09813', jenis_kelamin: 'Perempuan' },
  { nama_siswa: 'HENDRA KUSUMA', kelas: '9-A', nis: '09405', jenis_kelamin: 'Laki-laki' },
  { nama_siswa: 'INTAN PERMATASARI', kelas: '9-A', nis: '09406', jenis_kelamin: 'Perempuan' }
];

export const SEED_AGENDA: AgendaKerjaItem[] = [
  {
    id: 'seed-agenda-1',
    hari: 'Senin',
    tanggal: '2026-09-07',
    bulan: 'September',
    tahun: '2026',
    waktu: '07.15-07.55 WIB',
    uraian_kegiatan: 'Bimbingan Klasikal Layanan Orientasi & Motivasi Belajar Semester Ganjil di Ruang Kelas 7-A',
    sasaran: 'Siswa Kelas 7-A',
    keterangan: 'Terlaksana dengan tertib dan aktif'
  },
  {
    id: 'seed-agenda-2',
    hari: 'Senin',
    tanggal: '2026-09-07',
    bulan: 'September',
    tahun: '2026',
    waktu: '08.35-09.15 WIB',
    uraian_kegiatan: 'Konseling Individual dengan siswa terkait penyesuaian diri dan manajemen waktu belajar',
    sasaran: 'DIMAS WAHYU PRASETYO',
    keterangan: 'Konseli menyepakati kontrak perilaku belajar mandiri'
  },
  {
    id: 'seed-agenda-3',
    hari: 'Selasa',
    tanggal: '2026-09-08',
    bulan: 'September',
    tahun: '2026',
    waktu: '09.15-09.55 WIB',
    uraian_kegiatan: 'Konseling Kelompok peningkatan motivasi belajar dan kerjasama tim',
    sasaran: 'Siswa Kelas 8-A',
    keterangan: 'Peserta aktif memberikan masukan dan refleksi diri'
  }
];

// -------------------------------------------------------------
// GENERIC LOCALSTORAGE + SUPABASE HELPERS
// -------------------------------------------------------------

function getLocal<T>(key: string, fallback: T[] = []): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Read local storage error', key, e);
  }
  return fallback;
}

function setLocal<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Write local storage error', key, e);
  }
}

// -------------------------------------------------------------
// 1. SISWA BK
// -------------------------------------------------------------
export async function fetchAllSiswa(): Promise<SiswaBK[]> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client.from('siswa_bk').select('*').order('kelas', { ascending: true });
      if (!error && data && data.length > 0) {
        setLocal('sabda_siswa_bk', data);
        return data;
      }
    } catch (e) {
      console.warn('Supabase fetch siswa error', e);
    }
  }
  return getLocal<SiswaBK>('sabda_siswa_bk', SEED_SISWA);
}

export async function saveOrUpdateSiswa(item: SiswaBK): Promise<SiswaBK> {
  const client = getSupabaseClient();
  const id = item.id || `siswa-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const payload = { ...item, id, updated_at: new Date().toISOString() };

  if (client) {
    try {
      await client.from('siswa_bk').upsert(payload, { onConflict: 'nis' });
    } catch (e) {
      console.warn('Supabase save siswa error', e);
    }
  }

  const list = getLocal<SiswaBK>('sabda_siswa_bk', SEED_SISWA);
  const idx = list.findIndex(s => (s.id && s.id === id) || (s.nis && s.nis === item.nis));
  if (idx >= 0) {
    list[idx] = payload;
  } else {
    list.unshift(payload);
  }
  setLocal('sabda_siswa_bk', list);
  return payload;
}

export async function bulkSaveOrUpdateSiswa(items: SiswaBK[]): Promise<number> {
  const client = getSupabaseClient();
  const now = new Date().toISOString();
  
  // Deduplicate by NIS
  const map = new Map<string, SiswaBK>();
  items.forEach((it, i) => {
    const nis = it.nis ? String(it.nis).trim() : `NIS-${Date.now()}-${i}`;
    map.set(nis, {
      ...it,
      id: it.id || `siswa-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 5)}`,
      nis,
      created_at: it.created_at || now,
      updated_at: now
    });
  });

  const cleanItems = Array.from(map.values());

  if (client) {
    try {
      await client.from('siswa_bk').upsert(cleanItems, { onConflict: 'nis' });
    } catch (e) {
      console.warn('Supabase bulk save siswa error', e);
    }
  }

  setLocal('sabda_siswa_bk', cleanItems);
  return cleanItems.length;
}

export async function deleteSiswaItem(id: string): Promise<void> {
  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('siswa_bk').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase delete error', e);
    }
  }
  const list = getLocal<SiswaBK>('sabda_siswa_bk', SEED_SISWA);
  const filtered = list.filter(it => it.id !== id);
  setLocal('sabda_siswa_bk', filtered);
}

// -------------------------------------------------------------
// 2. AGENDA KERJA BK
// -------------------------------------------------------------
export async function fetchAllAgenda(): Promise<AgendaKerjaItem[]> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client.from('agenda_kerja_bk').select('*').order('tanggal', { ascending: false });
      if (!error && data) {
        setLocal('sabda_agenda_bk', data);
        return data;
      }
    } catch (e) {
      console.warn('Supabase fetch agenda error', e);
    }
  }
  return getLocal<AgendaKerjaItem>('sabda_agenda_bk', SEED_AGENDA);
}

export async function saveOrUpdateAgenda(item: AgendaKerjaItem): Promise<AgendaKerjaItem> {
  const client = getSupabaseClient();
  const id = item.id || `agenda-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const payload = { ...item, id, updated_at: new Date().toISOString() };

  if (client) {
    try {
      await client.from('agenda_kerja_bk').upsert(payload);
    } catch (e) {
      console.warn('Supabase save agenda error', e);
    }
  }

  const list = getLocal<AgendaKerjaItem>('sabda_agenda_bk', SEED_AGENDA);
  const idx = list.findIndex(a => a.id === id);
  if (idx >= 0) list[idx] = payload;
  else list.unshift(payload);
  setLocal('sabda_agenda_bk', list);
  return payload;
}

export async function deleteAgendaItem(id: string): Promise<void> {
  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('agenda_kerja_bk').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase delete agenda error', e);
    }
  }
  const list = getLocal<AgendaKerjaItem>('sabda_agenda_bk', SEED_AGENDA);
  setLocal('sabda_agenda_bk', list.filter(a => a.id !== id));
}

// -------------------------------------------------------------
// 3. UNDANGAN ORANG TUA
// -------------------------------------------------------------
export async function fetchAllUndangan(): Promise<UndanganOrangTuaItem[]> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client.from('undangan_orang_tua').select('*').order('tanggal', { ascending: false });
      if (!error && data) {
        setLocal('sabda_undangan_ortu', data);
        return data;
      }
    } catch (e) {
      console.warn('Supabase fetch undangan error', e);
    }
  }
  return getLocal<UndanganOrangTuaItem>('sabda_undangan_ortu', []);
}

export async function saveOrUpdateUndangan(item: UndanganOrangTuaItem): Promise<UndanganOrangTuaItem> {
  const client = getSupabaseClient();
  const id = item.id || `undangan-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const payload = { ...item, id, updated_at: new Date().toISOString() };

  if (client) {
    try {
      await client.from('undangan_orang_tua').upsert(payload);
    } catch (e) {
      console.warn('Supabase save undangan error', e);
    }
  }

  const list = getLocal<UndanganOrangTuaItem>('sabda_undangan_ortu', []);
  const idx = list.findIndex(u => u.id === id);
  if (idx >= 0) list[idx] = payload;
  else list.unshift(payload);
  setLocal('sabda_undangan_ortu', list);
  return payload;
}

export async function deleteUndanganItem(id: string): Promise<void> {
  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('undangan_orang_tua').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase delete undangan error', e);
    }
  }
  const list = getLocal<UndanganOrangTuaItem>('sabda_undangan_ortu', []);
  setLocal('sabda_undangan_ortu', list.filter(u => u.id !== id));
}

// -------------------------------------------------------------
// 4. HOME VISIT / KUNJUNGAN RUMAH
// -------------------------------------------------------------
export async function fetchAllHomeVisit(): Promise<HomeVisitItem[]> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client.from('home_visit_bk').select('*').order('tanggal', { ascending: false });
      if (!error && data) {
        setLocal('sabda_home_visit', data);
        return data;
      }
    } catch (e) {
      console.warn('Supabase fetch home visit error', e);
    }
  }
  return getLocal<HomeVisitItem>('sabda_home_visit', []);
}

export async function saveOrUpdateHomeVisit(item: HomeVisitItem): Promise<HomeVisitItem> {
  const client = getSupabaseClient();
  const id = item.id || `hv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const payload = { ...item, id, updated_at: new Date().toISOString() };

  if (client) {
    try {
      await client.from('home_visit_bk').upsert(payload);
    } catch (e) {
      console.warn('Supabase save home visit error', e);
    }
  }

  const list = getLocal<HomeVisitItem>('sabda_home_visit', []);
  const idx = list.findIndex(h => h.id === id);
  if (idx >= 0) list[idx] = payload;
  else list.unshift(payload);
  setLocal('sabda_home_visit', list);
  return payload;
}

export async function deleteHomeVisitItem(id: string): Promise<void> {
  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('home_visit_bk').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase delete home visit error', e);
    }
  }
  const list = getLocal<HomeVisitItem>('sabda_home_visit', []);
  setLocal('sabda_home_visit', list.filter(h => h.id !== id));
}

// -------------------------------------------------------------
// 5. REKAM PERMASALAHAN SISWA
// -------------------------------------------------------------
export async function fetchAllRekamPermasalahan(): Promise<RekamPermasalahanItem[]> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client.from('rekam_permasalahan_siswa').select('*').order('tanggal', { ascending: false });
      if (!error && data) {
        setLocal('sabda_rekam_masalah', data);
        return data;
      }
    } catch (e) {
      console.warn('Supabase fetch rekam masalah error', e);
    }
  }
  return getLocal<RekamPermasalahanItem>('sabda_rekam_masalah', []);
}

export async function saveOrUpdateRekamPermasalahan(item: RekamPermasalahanItem): Promise<RekamPermasalahanItem> {
  const client = getSupabaseClient();
  const id = item.id || `rekam-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const payload = { ...item, id, updated_at: new Date().toISOString() };

  if (client) {
    try {
      await client.from('rekam_permasalahan_siswa').upsert(payload);
    } catch (e) {
      console.warn('Supabase save rekam masalah error', e);
    }
  }

  const list = getLocal<RekamPermasalahanItem>('sabda_rekam_masalah', []);
  const idx = list.findIndex(r => r.id === id);
  if (idx >= 0) list[idx] = payload;
  else list.unshift(payload);
  setLocal('sabda_rekam_masalah', list);
  return payload;
}

export async function deleteRekamPermasalahanItem(id: string): Promise<void> {
  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('rekam_permasalahan_siswa').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase delete rekam error', e);
    }
  }
  const list = getLocal<RekamPermasalahanItem>('sabda_rekam_masalah', []);
  setLocal('sabda_rekam_masalah', list.filter(r => r.id !== id));
}

// -------------------------------------------------------------
// 6. KONSELING INDIVIDU
// -------------------------------------------------------------
export async function fetchAllKonselingIndividu(): Promise<KonselingIndividuItem[]> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client.from('rencana_konseling_individu').select('*').order('tanggal', { ascending: false });
      if (!error && data) {
        setLocal('sabda_konseling_ind', data);
        return data;
      }
    } catch (e) {
      console.warn('Supabase fetch konseling ind error', e);
    }
  }
  return getLocal<KonselingIndividuItem>('sabda_konseling_ind', []);
}

export async function saveOrUpdateKonselingIndividu(item: KonselingIndividuItem): Promise<KonselingIndividuItem> {
  const client = getSupabaseClient();
  const id = item.id || `ki-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const payload = { ...item, id, updated_at: new Date().toISOString() };

  if (client) {
    try {
      await client.from('rencana_konseling_individu').upsert(payload);
    } catch (e) {
      console.warn('Supabase save konseling ind error', e);
    }
  }

  const list = getLocal<KonselingIndividuItem>('sabda_konseling_ind', []);
  const idx = list.findIndex(k => k.id === id);
  if (idx >= 0) list[idx] = payload;
  else list.unshift(payload);
  setLocal('sabda_konseling_ind', list);
  return payload;
}

export async function deleteKonselingIndividuItem(id: string): Promise<void> {
  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('rencana_konseling_individu').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase delete konseling ind error', e);
    }
  }
  const list = getLocal<KonselingIndividuItem>('sabda_konseling_ind', []);
  setLocal('sabda_konseling_ind', list.filter(k => k.id !== id));
}

// -------------------------------------------------------------
// 7. KONSELING KELOMPOK
// -------------------------------------------------------------
export async function fetchAllKonselingKelompok(): Promise<KonselingKelompokItem[]> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client.from('rencana_konseling_kelompok').select('*').order('tanggal', { ascending: false });
      if (!error && data) {
        setLocal('sabda_konseling_kel', data);
        return data;
      }
    } catch (e) {
      console.warn('Supabase fetch konseling kel error', e);
    }
  }
  return getLocal<KonselingKelompokItem>('sabda_konseling_kel', []);
}

export async function saveOrUpdateKonselingKelompok(item: KonselingKelompokItem): Promise<KonselingKelompokItem> {
  const client = getSupabaseClient();
  const id = item.id || `kk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const payload = { ...item, id, updated_at: new Date().toISOString() };

  if (client) {
    try {
      await client.from('rencana_konseling_kelompok').upsert(payload);
    } catch (e) {
      console.warn('Supabase save konseling kel error', e);
    }
  }

  const list = getLocal<KonselingKelompokItem>('sabda_konseling_kel', []);
  const idx = list.findIndex(k => k.id === id);
  if (idx >= 0) list[idx] = payload;
  else list.unshift(payload);
  setLocal('sabda_konseling_kel', list);
  return payload;
}

export async function deleteKonselingKelompokItem(id: string): Promise<void> {
  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('rencana_konseling_kelompok').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase delete konseling kel error', e);
    }
  }
  const list = getLocal<KonselingKelompokItem>('sabda_konseling_kel', []);
  setLocal('sabda_konseling_kel', list.filter(k => k.id !== id));
}

// -------------------------------------------------------------
// 8. SURAT PERNYATAAN SISWA
// -------------------------------------------------------------
export async function fetchAllSuratPernyataan(): Promise<SuratPernyataanItem[]> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client.from('surat_pernyataan_siswa').select('*').order('tanggal_surat', { ascending: false });
      if (!error && data) {
        setLocal('sabda_sp_siswa', data);
        return data;
      }
    } catch (e) {
      console.warn('Supabase fetch SP error', e);
    }
  }
  return getLocal<SuratPernyataanItem>('sabda_sp_siswa', []);
}

export async function saveOrUpdateSuratPernyataan(item: SuratPernyataanItem): Promise<SuratPernyataanItem> {
  const client = getSupabaseClient();
  const id = item.id || `sp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const payload = { ...item, id, updated_at: new Date().toISOString() };

  if (client) {
    try {
      await client.from('surat_pernyataan_siswa').upsert(payload);
    } catch (e) {
      console.warn('Supabase save SP error', e);
    }
  }

  const list = getLocal<SuratPernyataanItem>('sabda_sp_siswa', []);
  const idx = list.findIndex(s => s.id === id);
  if (idx >= 0) list[idx] = payload;
  else list.unshift(payload);
  setLocal('sabda_sp_siswa', list);
  return payload;
}

export async function deleteSuratPernyataanItem(id: string): Promise<void> {
  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('surat_pernyataan_siswa').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase delete SP error', e);
    }
  }
  const list = getLocal<SuratPernyataanItem>('sabda_sp_siswa', []);
  setLocal('sabda_sp_siswa', list.filter(s => s.id !== id));
}

// -------------------------------------------------------------
// 9. KONFERENSI KASUS SISWA
// -------------------------------------------------------------
export async function fetchAllKonferensiKasus(): Promise<KonferensiKasusItem[]> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client.from('konferensi_kasus_siswa').select('*').order('tanggal', { ascending: false });
      if (!error && data) {
        setLocal('sabda_konferensi_kasus', data);
        return data;
      }
    } catch (e) {
      console.warn('Supabase fetch konferensi error', e);
    }
  }
  return getLocal<KonferensiKasusItem>('sabda_konferensi_kasus', []);
}

export async function saveOrUpdateKonferensiKasus(item: KonferensiKasusItem): Promise<KonferensiKasusItem> {
  const client = getSupabaseClient();
  const id = item.id || `kk-kasus-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const payload = { ...item, id, updated_at: new Date().toISOString() };

  if (client) {
    try {
      await client.from('konferensi_kasus_siswa').upsert(payload);
    } catch (e) {
      console.warn('Supabase save konferensi error', e);
    }
  }

  const list = getLocal<KonferensiKasusItem>('sabda_konferensi_kasus', []);
  const idx = list.findIndex(k => k.id === id);
  if (idx >= 0) list[idx] = payload;
  else list.unshift(payload);
  setLocal('sabda_konferensi_kasus', list);
  return payload;
}

export async function deleteKonferensiKasusItem(id: string): Promise<void> {
  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('konferensi_kasus_siswa').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase delete konferensi error', e);
    }
  }
  const list = getLocal<KonferensiKasusItem>('sabda_konferensi_kasus', []);
  setLocal('sabda_konferensi_kasus', list.filter(k => k.id !== id));
}

// -------------------------------------------------------------
// 10. SISWA ATS (ANAK TIDAK SEKOLAH)
// -------------------------------------------------------------
export async function fetchAllSiswaATS(): Promise<SiswaATSItem[]> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client.from('siswa_ats_bk').select('*').order('tanggal', { ascending: false });
      if (!error && data) {
        setLocal('sabda_siswa_ats', data);
        return data;
      }
    } catch (e) {
      console.warn('Supabase fetch ATS error', e);
    }
  }
  return getLocal<SiswaATSItem>('sabda_siswa_ats', []);
}

export async function saveOrUpdateSiswaATS(item: SiswaATSItem): Promise<SiswaATSItem> {
  const client = getSupabaseClient();
  const id = item.id || `ats-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const payload = { ...item, id, updated_at: new Date().toISOString() };

  if (client) {
    try {
      await client.from('siswa_ats_bk').upsert(payload);
    } catch (e) {
      console.warn('Supabase save ATS error', e);
    }
  }

  const list = getLocal<SiswaATSItem>('sabda_siswa_ats', []);
  const idx = list.findIndex(a => a.id === id);
  if (idx >= 0) list[idx] = payload;
  else list.unshift(payload);
  setLocal('sabda_siswa_ats', list);
  return payload;
}

export async function deleteSiswaATSItem(id: string): Promise<void> {
  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('siswa_ats_bk').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase delete ATS error', e);
    }
  }
  const list = getLocal<SiswaATSItem>('sabda_siswa_ats', []);
  setLocal('sabda_siswa_ats', list.filter(a => a.id !== id));
}

// -------------------------------------------------------------
// SQL SCRIPT GENERATOR FOR SUPABASE SETUP
// -------------------------------------------------------------
export function generateSupabaseSetupSQL(): string {
  return `-- ====================================================================
-- SKRIP SETUP DATABASE SUPABASE SABDA BK SPANJU (SMPN 7 PASURUAN)
-- ====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABEL DATA MASTER SISWA
CREATE TABLE IF NOT EXISTS public.siswa_bk (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  nama_siswa TEXT NOT NULL,
  kelas TEXT NOT NULL,
  nis TEXT NOT NULL UNIQUE,
  jenis_kelamin TEXT NOT NULL,
  keterangan TEXT DEFAULT ''
);

-- 2. TABEL AGENDA KERJA BK
CREATE TABLE IF NOT EXISTS public.agenda_kerja_bk (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  hari TEXT NOT NULL,
  tanggal DATE NOT NULL,
  bulan TEXT NOT NULL,
  tahun TEXT NOT NULL,
  waktu TEXT NOT NULL,
  uraian_kegiatan TEXT NOT NULL,
  sasaran TEXT NOT NULL,
  link_foto_kegiatan TEXT DEFAULT '',
  keterangan TEXT DEFAULT ''
);

-- 3. TABEL UNDANGAN ORANG TUA SISWA
CREATE TABLE IF NOT EXISTS public.undangan_orang_tua (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  hari TEXT NOT NULL,
  tanggal DATE NOT NULL,
  waktu TEXT NOT NULL,
  tempat_pelaksanaan TEXT DEFAULT 'SMP Negeri 7 Pasuruan',
  kelas TEXT NOT NULL,
  nama_siswa TEXT NOT NULL,
  nama_orang_tua TEXT NOT NULL,
  pekerjaan_orang_tua TEXT DEFAULT '',
  alamat TEXT DEFAULT '',
  perihal_undangan TEXT NOT NULL,
  uraian_permasalahan TEXT DEFAULT '',
  tindak_lanjut TEXT DEFAULT '',
  link_foto_kegiatan TEXT DEFAULT '',
  keterangan TEXT DEFAULT '',
  nomor_surat TEXT DEFAULT '',
  tanggal_surat DATE DEFAULT CURRENT_DATE,
  tempat_surat TEXT DEFAULT 'Pasuruan',
  semester TEXT DEFAULT '',
  nama_guru_bk TEXT DEFAULT 'WIWIK ISMIATI, S.Pd',
  nip_guru_bk TEXT DEFAULT '19831116 200904 2 003',
  nama_kepala_sekolah TEXT DEFAULT 'NUR FADILAH, S.Pd,. M.Pd',
  nip_kepala_sekolah TEXT DEFAULT '19860410 201001 2 030'
);

-- 4. TABEL HOME VISIT / KUNJUNGAN RUMAH
CREATE TABLE IF NOT EXISTS public.home_visit_bk (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  hari TEXT NOT NULL,
  tanggal DATE NOT NULL,
  waktu TEXT DEFAULT '',
  kelas TEXT NOT NULL,
  nama_siswa TEXT NOT NULL,
  nama_orang_tua TEXT NOT NULL,
  pekerjaan_orang_tua TEXT DEFAULT '',
  alamat TEXT DEFAULT '',
  perihal_home_visit TEXT NOT NULL,
  uraian_permasalahan TEXT DEFAULT '',
  tindak_lanjut TEXT DEFAULT '',
  link_foto_kegiatan TEXT DEFAULT '',
  keterangan TEXT DEFAULT '',
  nomor_surat_tugas TEXT DEFAULT '',
  nis_siswa TEXT DEFAULT '',
  petugas_1 TEXT DEFAULT 'WIWIK ISMIATI, S.Pd',
  jabatan_petugas_1 TEXT DEFAULT 'Guru Bimbingan dan Konseling',
  petugas_2 TEXT DEFAULT '',
  jabatan_petugas_2 TEXT DEFAULT '',
  tanggal_surat_tugas DATE DEFAULT CURRENT_DATE,
  tanggal_pernyataan_ortu DATE DEFAULT CURRENT_DATE,
  semester_laporan TEXT DEFAULT '',
  bidang_layanan TEXT DEFAULT '',
  topik_permasalahan TEXT DEFAULT '',
  fungsi_layanan TEXT DEFAULT '',
  pihak_terlibat TEXT DEFAULT '',
  tujuan_kegiatan TEXT DEFAULT '',
  gambaran_ringkas_masalah TEXT DEFAULT '',
  alamat_kunjungan TEXT DEFAULT '',
  hari_tanggal_lama_kunjungan TEXT DEFAULT '',
  anggota_keluarga_dikunjungi TEXT DEFAULT '',
  rencana_evaluasi TEXT DEFAULT '',
  tindak_lanjut_14_poin TEXT DEFAULT '',
  catatan_khusus TEXT DEFAULT '',
  nama_guru_bk TEXT DEFAULT 'WIWIK ISMIATI, S.Pd',
  nip_guru_bk TEXT DEFAULT '19831116 200904 2 003',
  nama_kepala_sekolah TEXT DEFAULT 'NUR FADILAH, S.Pd,. M.Pd',
  nip_kepala_sekolah TEXT DEFAULT '19860410 201001 2 030'
);

-- 5. TABEL REKAM PERMASALAHAN SISWA
CREATE TABLE IF NOT EXISTS public.rekam_permasalahan_siswa (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  hari TEXT NOT NULL,
  tanggal DATE NOT NULL,
  waktu TEXT NOT NULL,
  kelas TEXT NOT NULL,
  nama_siswa TEXT NOT NULL,
  nama_orang_tua TEXT DEFAULT '',
  pekerjaan_orang_tua TEXT DEFAULT '',
  alamat TEXT DEFAULT '',
  ringkasan_uraian_masalah TEXT NOT NULL,
  upaya_penanganan TEXT NOT NULL,
  hasil_dan_kesimpulan TEXT NOT NULL,
  link_foto_kegiatan TEXT DEFAULT '',
  keterangan TEXT DEFAULT '',
  nama_guru_bk TEXT DEFAULT 'WIWIK ISMIATI, S.Pd',
  nip_guru_bk TEXT DEFAULT '19831116 200904 2 003',
  nama_kepala_sekolah TEXT DEFAULT 'NUR FADILAH, S.Pd,. M.Pd',
  nip_kepala_sekolah TEXT DEFAULT '19860410 201001 2 030'
);

-- 6. TABEL RENCANA KONSELING INDIVIDU
CREATE TABLE IF NOT EXISTS public.rencana_konseling_individu (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  hari TEXT NOT NULL,
  tanggal DATE NOT NULL,
  waktu TEXT NOT NULL,
  kelas TEXT NOT NULL,
  nama_siswa TEXT NOT NULL,
  topik_permasalahan TEXT NOT NULL,
  media_yang_diperlukan TEXT DEFAULT '',
  ringkasan_uraian_masalah TEXT NOT NULL,
  pendekatan_teknik_konseling TEXT NOT NULL,
  hasil_yang_dicapai TEXT NOT NULL,
  link_foto_kegiatan TEXT DEFAULT '',
  keterangan TEXT DEFAULT '',
  nama_guru_bk TEXT DEFAULT 'WIWIK ISMIATI, S.Pd',
  nip_guru_bk TEXT DEFAULT '19831116 200904 2 003',
  nama_kepala_sekolah TEXT DEFAULT 'NUR FADILAH, S.Pd,. M.Pd',
  nip_kepala_sekolah TEXT DEFAULT '19860410 201001 2 030'
);

-- 7. TABEL RENCANA KONSELING KELOMPOK
CREATE TABLE IF NOT EXISTS public.rencana_konseling_kelompok (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  hari TEXT NOT NULL,
  tanggal DATE NOT NULL,
  waktu TEXT NOT NULL,
  kelas TEXT NOT NULL,
  nama_siswa TEXT NOT NULL,
  topik_permasalahan TEXT NOT NULL,
  media_yang_diperlukan TEXT DEFAULT '',
  ringkasan_uraian_masalah TEXT NOT NULL,
  pendekatan_teknik_konseling TEXT NOT NULL,
  hasil_yang_dicapai TEXT NOT NULL,
  link_foto_kegiatan TEXT DEFAULT '',
  keterangan TEXT DEFAULT '',
  nama_guru_bk TEXT DEFAULT 'WIWIK ISMIATI, S.Pd',
  nip_guru_bk TEXT DEFAULT '19831116 200904 2 003',
  nama_kepala_sekolah TEXT DEFAULT 'NUR FADILAH, S.Pd,. M.Pd',
  nip_kepala_sekolah TEXT DEFAULT '19860410 201001 2 030'
);

-- 8. TABEL SURAT PERNYATAAN SISWA (SP 1-3, ORTU, PINDAH, DAMAI)
CREATE TABLE IF NOT EXISTS public.surat_pernyataan_siswa (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  jenis_sp TEXT NOT NULL,
  nama_siswa TEXT NOT NULL,
  kelas TEXT NOT NULL,
  nis TEXT DEFAULT '',
  nama_siswa_2 TEXT DEFAULT '',
  kelas_2 TEXT DEFAULT '',
  hari_tanggal_kejadian TEXT DEFAULT '',
  tahun_ajaran TEXT DEFAULT '2026-2027',
  jabatan_pengetahu TEXT DEFAULT 'Guru BK / Wali Kelas',
  nama_orang_tua TEXT DEFAULT '',
  pekerjaan_orang_tua TEXT DEFAULT '',
  alamat_orang_tua TEXT DEFAULT '',
  hubungan_keluarga TEXT DEFAULT '',
  peraturan_diketahui TEXT DEFAULT '',
  alasan_pengunduran TEXT DEFAULT '',
  tanggal_surat DATE DEFAULT CURRENT_DATE,
  tempat_surat TEXT DEFAULT 'Pasuruan',
  keterangan TEXT DEFAULT '',
  nama_guru_bk TEXT DEFAULT 'WIWIK ISMIATI, S.Pd',
  nip_guru_bk TEXT DEFAULT '19831116 200904 2 003',
  nama_kepala_sekolah TEXT DEFAULT 'NUR FADILAH, S.Pd,. M.Pd',
  nip_kepala_sekolah TEXT DEFAULT '19860410 201001 2 030'
);

-- 9. TABEL KONFERENSI KASUS SISWA
CREATE TABLE IF NOT EXISTS public.konferensi_kasus_siswa (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  hari TEXT NOT NULL,
  tanggal DATE NOT NULL,
  waktu TEXT NOT NULL,
  tempat TEXT DEFAULT 'Ruang BK SMPN 7 Pasuruan',
  kelas TEXT NOT NULL,
  nama_siswa TEXT NOT NULL,
  nis TEXT DEFAULT '',
  jenis_masalah TEXT NOT NULL,
  koordinator TEXT DEFAULT 'WIWIK ISMIATI, S.Pd',
  data_yang_ingin_diperoleh TEXT NOT NULL,
  pihak_terlibat TEXT NOT NULL,
  uraian_kegiatan_inti TEXT NOT NULL,
  kesimpulan_data TEXT NOT NULL,
  rencana_tindak_lanjut TEXT NOT NULL,
  rapat_pimpinan TEXT DEFAULT 'NUR FADILAH, S.Pd,. M.Pd',
  rapat_notulis TEXT DEFAULT 'WIWIK ISMIATI, S.Pd',
  rapat_jumlah_hadir INTEGER DEFAULT 5,
  rapat_uraian_hasil TEXT DEFAULT '',
  daftar_hadir_rows JSONB DEFAULT '[]'::jsonb,
  tahun_ajaran TEXT DEFAULT '2026/2027',
  nama_guru_bk TEXT DEFAULT 'WIWIK ISMIATI, S.Pd',
  nip_guru_bk TEXT DEFAULT '19831116 200904 2 003',
  nama_kepala_sekolah TEXT DEFAULT 'NUR FADILAH, S.Pd,. M.Pd',
  nip_kepala_sekolah TEXT DEFAULT '19860410 201001 2 030'
);

-- 10. TABEL SISWA ATS (ANAK TIDAK SEKOLAH)
CREATE TABLE IF NOT EXISTS public.siswa_ats_bk (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  hari TEXT NOT NULL,
  tanggal DATE NOT NULL,
  tahun_ajaran TEXT DEFAULT '2026/2027',
  waktu TEXT NOT NULL,
  nama_siswa TEXT NOT NULL,
  kategori_ats TEXT DEFAULT 'DO (Drop Out)',
  kelas TEXT DEFAULT '',
  nama_orang_tua TEXT DEFAULT '',
  alamat TEXT DEFAULT '',
  alasan_ats TEXT NOT NULL,
  alasan_manual TEXT DEFAULT '',
  foto_kunjungan_1 TEXT DEFAULT '',
  foto_bukti_fisik_2 TEXT DEFAULT '',
  tempat_laporan TEXT DEFAULT 'Pasuruan',
  tanggal_laporan DATE DEFAULT CURRENT_DATE,
  nama_guru_kunjungan TEXT DEFAULT 'WIWIK ISMIATI, S.Pd',
  nip_guru_kunjungan TEXT DEFAULT '19831116 200904 2 003',
  nama_kepala_sekolah TEXT DEFAULT 'NUR FADILAH, S.Pd,. M.Pd',
  nip_kepala_sekolah TEXT DEFAULT '19860410 201001 2 030',
  keterangan TEXT DEFAULT ''
);

-- 11. TABEL TANDA TANGAN DIGITAL
CREATE TABLE IF NOT EXISTS public.signatures_bk (
  id TEXT PRIMARY KEY,
  role TEXT DEFAULT '',
  name TEXT DEFAULT '',
  "signatureDataUrl" TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- AKTIFKAN RLS UNTUK SEMUA TABEL
ALTER TABLE public.siswa_bk ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agenda_kerja_bk ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.undangan_orang_tua ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.home_visit_bk ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rekam_permasalahan_siswa ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rencana_konseling_individu ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rencana_konseling_kelompok ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.surat_pernyataan_siswa ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.konferensi_kasus_siswa ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.siswa_ats_bk ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.signatures_bk ENABLE ROW LEVEL SECURITY;

-- KEBIJAKAN AKSES PUBLIK (SELECT, INSERT, UPDATE, DELETE)
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'siswa_bk', 'agenda_kerja_bk', 'undangan_orang_tua', 'home_visit_bk',
    'rekam_permasalahan_siswa', 'rencana_konseling_individu', 'rencana_konseling_kelompok',
    'surat_pernyataan_siswa', 'konferensi_kasus_siswa', 'siswa_ats_bk', 'signatures_bk'
  ]
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Akses Publik %s" ON public.%I', tbl, tbl);
    EXECUTE format('CREATE POLICY "Akses Publik %s" ON public.%I FOR ALL USING (true) WITH CHECK (true)', tbl, tbl);
  END LOOP;
END $$;
`;
}
