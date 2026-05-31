// NOTE:
// - Prefer setting VITE_API_URL to your backend origin (example: https://your-backend.com)
// - If not set, we fall back to localhost in dev.
//   In production (e.g., Vercel + Render), you MUST set VITE_API_URL, otherwise requests will go to the frontend domain.
const API_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : '');

const joinUrl = (base: string, path: string) => {
  const b = (base || '').replace(/\/$/, '');
  let p = path || '';
  // If base already contains "/api" and caller also passes "/api/..", avoid "/api/api/.."
  if (b.endsWith('/api') && p.startsWith('/api/')) p = p.slice(4);
  return `${b}${p}`;
};

const getAppToken = () => {
  try {
    return localStorage.getItem('ptt_token') || '';
  } catch {
    return '';
  }
};

export const apiGet = async <T>(path: string): Promise<T> => {
  const token = getAppToken();
  try {
    if (!API_URL) throw new Error('Backend URL missing. Please set VITE_API_URL in your frontend environment.');
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
  const token = getAppToken();
  try {
    if (!API_URL) throw new Error('Backend URL missing. Please set VITE_API_URL in your frontend environment.');
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

export const apiPatch = async <T>(path: string, body?: any): Promise<T> => {
  const token = getAppToken();
  try {
    if (!API_URL) throw new Error('Backend URL missing. Please set VITE_API_URL in your frontend environment.');
    const res = await fetch(joinUrl(API_URL, path), {
      method: 'PATCH',
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
