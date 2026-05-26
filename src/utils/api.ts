import { auth } from "../firebase";

// NOTE:
// - Prefer setting VITE_API_URL to your backend origin (example: https://your-backend.com)
// - If not set, we fall back to same-origin in production, and localhost in dev.
const API_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost'
    ? window.location.origin
    : 'http://localhost:5000');

const joinUrl = (base: string, path: string) => {
  const b = (base || '').replace(/\/$/, '');
  let p = path || '';
  // If base already contains "/api" and caller also passes "/api/..", avoid "/api/api/.."
  if (b.endsWith('/api') && p.startsWith('/api/')) p = p.slice(4);
  return `${b}${p}`;
};

const getIdToken = async () => {
  const u = auth.currentUser;
  if (!u) return "";
  return await u.getIdToken();
};

export const apiGet = async <T>(path: string): Promise<T> => {
  const token = await getIdToken();
  try {
    const res = await fetch(joinUrl(API_URL, path), {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.message || data?.error || 'Request failed');
    return data as T;
  } catch (err: any) {
    // Network / CORS / DNS errors usually come as TypeError in fetch
    if (err?.name === 'TypeError') {
      throw new Error('Unable to reach the server. Please check your internet connection and backend URL (VITE_API_URL).');
    }
    throw err;
  }
};

export const apiPost = async <T>(path: string, body?: any): Promise<T> => {
  const token = await getIdToken();
  try {
    const res = await fetch(joinUrl(API_URL, path), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body ?? {}),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.message || data?.error || 'Request failed');
    return data as T;
  } catch (err: any) {
    if (err?.name === 'TypeError') {
      throw new Error('Unable to reach the server. Please check your internet connection and backend URL (VITE_API_URL).');
    }
    throw err;
  }
};
