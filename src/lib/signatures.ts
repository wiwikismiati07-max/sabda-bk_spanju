import { getSupabaseClient } from './supabase';

export interface SignatureEntry {
  id: string;
  role: string;
  name: string;
  signatureDataUrl: string;
  updated_at: string;
}

const LOCAL_STORAGE_SIGNATURES_KEY = 'sabda_bk_signatures_data';

export async function fetchAllSignatures(): Promise<Record<string, string>> {
  const map: Record<string, string> = {};
  
  // Try to load from localStorage first for instant response
  try {
    const local = localStorage.getItem(LOCAL_STORAGE_SIGNATURES_KEY);
    if (local) {
      const parsed = JSON.parse(local);
      Object.assign(map, parsed);
    }
  } catch (e) {
    console.error('Error reading local signatures', e);
  }

  // Then fetch from Supabase if connected
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client.from('signatures_bk').select('*');
      if (!error && data) {
        data.forEach((item: any) => {
          if (item.id && item.signatureDataUrl) {
            map[item.id] = item.signatureDataUrl;
          }
        });
        localStorage.setItem(LOCAL_STORAGE_SIGNATURES_KEY, JSON.stringify(map));
      }
    } catch (e) {
      // silent fallback
    }
  }

  return map;
}

export async function saveSignature(id: string, signatureDataUrl: string, role = '', name = ''): Promise<void> {
  // Update local
  try {
    const local = localStorage.getItem(LOCAL_STORAGE_SIGNATURES_KEY);
    const parsed = local ? JSON.parse(local) : {};
    parsed[id] = signatureDataUrl;
    localStorage.setItem(LOCAL_STORAGE_SIGNATURES_KEY, JSON.stringify(parsed));
  } catch (e) {
    console.error('Error writing local signature', e);
  }

  // Update Supabase
  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('signatures_bk').upsert({
        id,
        role,
        name,
        signatureDataUrl,
        updated_at: new Date().toISOString()
      });
    } catch (e) {
      console.warn('Could not sync signature to Supabase', e);
    }
  }
}

export async function removeSignature(id: string): Promise<void> {
  try {
    const local = localStorage.getItem(LOCAL_STORAGE_SIGNATURES_KEY);
    const parsed = local ? JSON.parse(local) : {};
    delete parsed[id];
    localStorage.setItem(LOCAL_STORAGE_SIGNATURES_KEY, JSON.stringify(parsed));
  } catch (e) {
    console.error('Error removing local signature', e);
  }

  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('signatures_bk').delete().eq('id', id);
    } catch (e) {
      console.warn('Could not delete signature on Supabase', e);
    }
  }
}
