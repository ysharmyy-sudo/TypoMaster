import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, LogOut, Trophy, TrendingUp } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { logoutAndClearTokens } from '../utils/logout';

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

const EXAM_LOGOS: Array<{ key: string; label: string; src: string }> = [
  { key: 'ssc', label: 'SSC', src: '/exam-logos/ssc.svg' },
  { key: 'rrb', label: 'RRB', src: '/exam-logos/rrb.svg' },
  { key: 'ibps', label: 'IBPS', src: '/exam-logos/ibps.svg' },
  { key: 'sbi', label: 'SBI', src: '/exam-logos/sbi.svg' },
  { key: 'rbi', label: 'RBI', src: '/exam-logos/rbi.svg' },
  { key: 'upsc', label: 'UPSC', src: '/exam-logos/upsc.svg' },
];

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

const ProfileSection = () => {
  const { user, setUser, setPremium } = useAppContext();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? (JSON.parse(raw) as Session[]) : [];
      if (Array.isArray(parsed)) setSessions(parsed);
    } catch {
      setSessions([]);
    }
  }, []);

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

  const handleLogout = async () => {
    await logoutAndClearTokens();
    setUser(null);
    setPremium(false);
    navigate('/login');
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Profile</p>
          <h1 className="text-3xl font-extrabold tracking-tight mt-1">
            {user?.name || 'User'}
          </h1>
          {user?.email && <p className="text-slate-500 text-sm mt-1">{user.email}</p>}
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate('/analytics')}
            className="px-4 py-2 rounded-2xl bg-sky-500 hover:bg-sky-400 text-black font-bold flex items-center gap-2 transition-colors"
          >
            <BarChart3 size={18} />
            View Analytics
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

      {/* Analysis */}
      <div className="mt-8">
        <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
          <Trophy size={18} className="text-amber-500" /> Your Analysis (Last 30 Days)
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

        <p className="text-xs text-slate-500 mt-3">
          Note: analytics is computed from your saved sessions on this device.
        </p>
      </div>

      {/* Exam logos */}
      <div className="mt-10">
        <h2 className="text-lg font-bold mb-3">Official Exam Logos</h2>
        <p className="text-sm text-slate-500 mb-5">
          Replace the placeholder SVGs in <span className="font-semibold">public/exam-logos</span> with the official logos for each exam/organization.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {EXAM_LOGOS.map((l) => (
            <div
              key={l.key}
              className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center gap-3"
            >
              <img
                src={l.src}
                alt={`${l.label} logo`}
                className="h-12 w-auto object-contain"
                loading="lazy"
                onError={(e) => {
                  // fallback if logo missing
                  (e.currentTarget as HTMLImageElement).src = '/exam-logos/placeholder.svg';
                }}
              />
              <p className="text-xs font-bold text-slate-600">{l.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;

