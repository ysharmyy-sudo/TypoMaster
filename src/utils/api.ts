import { auth } from "../firebase";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getIdToken = async () => {
  const u = auth.currentUser;
  if (!u) return "";
  return await u.getIdToken();
};

export const apiGet = async <T>(path: string): Promise<T> => {
  const token = await getIdToken();
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || 'Request failed');
  return data as T;
};

export const apiPost = async <T>(path: string, body?: any): Promise<T> => {
  const token = await getIdToken();
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body ?? {}),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || 'Request failed');
  return data as T;
};
