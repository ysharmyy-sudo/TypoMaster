import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Camera, Crown, LogOut, Save, TrendingUp } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { logoutAndClearTokens } from '../utils/logout';
import { updateProfile } from 'firebase/auth';
import { auth } from '../firebase';

type Session = {
  ts: number; // epoch ms
  examId: string;
  examTitle: string;
  durationMin: number;
  language: string;
  wpm: number;
  accuracy: number;
};

const STORAGE_KEY = 'ptt_sessions_v1';
const PROFILE_PHOTO_KEY = 'ptt_profilePhoto_v1';

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

const ProfileSection = () => {
  const { user, setUser, setPremium, isPremium } = useAppContext();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [displayName, setDisplayName] = useState<string>(user?.name || '');
  const [photoUrl, setPhotoUrl] = useState<string>(() => {
    try {
      return localStorage.getItem(PROFILE_PHOTO_KEY) || '';
    } catch {
      return '';
    }
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<string>('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? (JSON.parse(raw) as Session[]) : [];
      if (Array.isArray(parsed)) setSessions(parsed);
    } catch {
      setSessions([]);
    }
  }, []);

  useEffect(() => {
    setDisplayName(user?.name || '');
  }, [user?.name]);

  const summary = useMemo(() => {
    const now = Date.now();
    const from = startOfDay(new Date(now - 29 * 24 * 60 * 60 * 1000));
    const last30 = sessions.filter((s) => typeof s?.ts === 'number' && s.ts >= from);

    const total = last30.length;
    const avgWpm = total ? Math.round(last30.reduce((a, s) => a + (s.wpm || 0), 0) / total) : 0;
    const avgAcc = total ? Math.round(last30.reduce((a, s) => a + (s.accuracy || 0), 0) / total) : 0;
    const bestWpm = total ? Math.max(...last30.map((s) => s.wpm || 0)) : 0;

    // trend: last 7 days avg vs previous 7 days avg
    const d7 = 7 * 24 * 60 * 60 * 1000;
    const last7 = last30.filter((s) => s.ts >= now - d7);
    const prev7 = last30.filter((s) => s.ts < now - d7 && s.ts >= now - 2 * d7);
    const last7Avg = last7.length ? last7.reduce((a, s) => a + (s.wpm || 0), 0) / last7.length : 0;
    const prev7Avg = prev7.length ? prev7.reduce((a, s) => a + (s.wpm || 0), 0) / prev7.length : 0;
    const delta = Math.round(last7Avg - prev7Avg);

    return { total, avgWpm, avgAcc, bestWpm, delta };
  }, [sessions]);

  const handlePickPhoto = async (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = String(reader.result || '');
      setPhotoUrl(dataUrl);
      try {
        localStorage.setItem(PROFILE_PHOTO_KEY, dataUrl);
      } catch {
        // ignore
      }

      // Best-effort: update Firebase profile photo URL (no upload, just storing the data URL)
      try {
        const u = auth.currentUser;
        if (u) await updateProfile(u, { photoURL: dataUrl });
      } catch {
        // ignore
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = async () => {
    setPhotoUrl('');
    try {
      localStorage.removeItem(PROFILE_PHOTO_KEY);
    } catch {
      // ignore
    }
    try {
      const u = auth.currentUser;
      if (u) await updateProfile(u, { photoURL: '' });
    } catch {
      // ignore
    }
  };

  const handleSaveProfile = async () => {
    const name = displayName.trim();
    if (!name) return;
    setIsSavingProfile(true);
    setProfileMsg('');
    try {
      const u = auth.currentUser;
      if (u) await updateProfile(u, { displayName: name });
      setUser((prev: any) => ({ ...(prev || {}), name }));
      setProfileMsg('Profile updated.');
    } catch {
      setProfileMsg('Unable to update profile right now.');
    } finally {
      setIsSavingProfile(false);
      window.setTimeout(() => setProfileMsg(''), 2500);
    }
  };

  const handleLogout = async () => {
    await logoutAndClearTokens();
    setUser(null);
    setPremium(false);
    navigate('/login');
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        {/* Left: avatar */}
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="h-20 w-20 rounded-3xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center">
              {photoUrl ? (
                <img src={photoUrl} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <span className="text-2xl font-extrabold text-slate-500">
                  {(user?.name || 'U').slice(0, 1).toUpperCase()}
                </span>
              )}
            </div>
            <label className="absolute -bottom-2 -right-2 cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => void handlePickPhoto(e.target.files?.[0] || null)}
              />
              <span className="inline-flex items-center justify-center h-9 w-9 rounded-2xl bg-black text-white border border-slate-800 hover:bg-slate-900 transition-colors">
                <Camera size={18} />
              </span>
            </label>
          </div>

          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">My Profile</p>
            <p className="text-slate-500 text-sm mt-1">{user?.email || ''}</p>
            {photoUrl && (
              <button
                onClick={() => void handleRemovePhoto()}
                className="text-xs font-bold text-red-600 hover:underline mt-2"
              >
                Remove photo
              </button>
            )}
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate('/pricing')}
            className="px-4 py-2 rounded-2xl bg-sky-500 hover:bg-sky-400 text-black font-bold flex items-center gap-2 transition-colors"
          >
            <Crown size={18} />
            {isPremium ? 'Manage Plan' : 'Upgrade Plan'}
          </button>
          <button
            onClick={() => navigate('/analytics')}
            className="px-4 py-2 rounded-2xl bg-white hover:bg-slate-50 text-slate-900 font-bold border border-slate-200 flex items-center gap-2 transition-colors"
          >
            <BarChart3 size={18} />
            Analytics
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-2xl bg-slate-900 hover:bg-black text-white font-bold flex items-center gap-2 transition-colors"
          >
            <LogOut size={18} />
            Log out
          </button>
        </div>
      </div>

      {/* Editable info */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-slate-50 border border-slate-200 rounded-2xl p-5">
          <p className="text-xs font-bold text-slate-400 uppercase">Basic details</p>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1">Full name</label>
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="Your name"
              />
            </div>
            <button
              onClick={() => void handleSaveProfile()}
              disabled={isSavingProfile || !displayName.trim()}
              className={`w-full px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors ${
                isSavingProfile || !displayName.trim()
                  ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                  : 'bg-black text-white hover:bg-slate-900'
              }`}
            >
              <Save size={18} />
              {isSavingProfile ? 'Saving...' : 'Save'}
            </button>
          </div>
          {!!profileMsg && <p className="text-sm text-slate-600 mt-3">{profileMsg}</p>}
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
          <p className="text-xs font-bold text-slate-400 uppercase">Plan</p>
          <p className="text-xl font-extrabold mt-2">{isPremium ? 'Premium' : 'Free'}</p>
          <p className="text-sm text-slate-600 mt-1">
            {isPremium ? 'Your premium features are active.' : 'Upgrade to unlock premium features.'}
          </p>
          <button
            onClick={() => navigate('/pricing')}
            className="mt-4 w-full px-4 py-3 rounded-xl font-bold bg-white border border-slate-200 hover:border-slate-400 transition-colors"
          >
            {isPremium ? 'View plan details' : 'See plans'}
          </button>
        </div>
      </div>

      {/* Performance */}
      <div className="mt-10">
        <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
          <TrendingUp size={18} className="text-sky-600" /> Performance (Last 30 Days)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
            <p className="text-xs font-bold text-slate-400 uppercase">Tests</p>
            <p className="text-3xl font-extrabold mt-2">{summary.total}</p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
            <p className="text-xs font-bold text-slate-400 uppercase">Avg WPM</p>
            <p className="text-3xl font-extrabold mt-2 text-sky-600">{summary.avgWpm}</p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
            <p className="text-xs font-bold text-slate-400 uppercase">Avg Accuracy</p>
            <p className="text-3xl font-extrabold mt-2 text-sky-600">{summary.avgAcc}%</p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
            <p className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
              <TrendingUp size={14} /> 7-day Trend
            </p>
            <p className={`text-3xl font-extrabold mt-2 ${summary.delta >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {summary.delta >= 0 ? `+${summary.delta}` : `${summary.delta}`} WPM
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
