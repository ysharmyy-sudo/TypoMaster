import { auth } from '../config/firebase';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Automatically attaches the Firebase token to every request
const authFetch = async (endpoint: string, options: RequestInit = {}) => {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');

  const token = await user.getIdToken();

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
};

// ── Auth ─────────────────────────────────────────────────

export const apiRegister = (name: string) =>
  authFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name }),
  });

export const apiLogin = () =>
  authFetch('/auth/login', { method: 'POST' });

export const apiGetMe = () =>
  authFetch('/auth/me');

export const apiIncrementTrial = () =>
  authFetch('/auth/trials', { method: 'PATCH' });

// ── Payments ─────────────────────────────────────────────

export const apiCreateOrder = (plan: 'pro' | 'lifetime') =>
  authFetch('/payments/create-order', {
    method: 'POST',
    body: JSON.stringify({ plan }),
  });

export const apiVerifyPayment = (payload: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  plan: 'pro' | 'lifetime';
}) =>
  authFetch('/payments/verify', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
