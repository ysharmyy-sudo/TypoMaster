import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BarChart3, CalendarDays, TrendingUp } from 'lucide-react';
import { apiGet } from '../utils/api';

type Session = {
  ts: number; // epoch ms
  examId: string;
  examTitle: string;
  durationMin: number;
  language: string;
  wpm: number;
  accuracy: number;
  typedChars?: number;
  correctChars?: number;
  errors?: number;
};

const STORAGE_KEY = 'ptt_sessions_v1';

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const toKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

const Analytics = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    // Prefer backend (cross-device), fallback to localStorage (offline)
    void (async () => {
      try {
        const res = await apiGet<{ success: boolean; sessions: Session[] }>('/api/sessions?days=30&limit=2000');
        if (res?.sessions && Array.isArray(res.sessions)) {
          setSessions(res.sessions);
          return;
        }
      } catch {
        // fallback to local
      }
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const parsed = raw ? (JSON.parse(raw) as Session[]) : [];
        if (Array.isArray(parsed)) setSessions(parsed);
      } catch {
        setSessions([]);
      }
    })();
  }, []);

  const last30 = useMemo(() => {
    const now = new Date();
    const from = startOfDay(new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000)).getTime();
    return sessions
      .filter((s) => typeof s?.ts === 'number' && s.ts >= from)
      .sort((a, b) => a.ts - b.ts);
  }, [sessions]);

  const daily = useMemo(() => {
    const now = new Date();
    const days: Array<{ key: string; label: string; avgWpm: number; avgAcc: number; count: number }> = [];

    const map = new Map<string, { wpm: number; acc: number; count: number }>();
    for (const s of last30) {
      const k = toKey(new Date(s.ts));
      const cur = map.get(k) || { wpm: 0, acc: 0, count: 0 };
      cur.wpm += Number(s.wpm || 0);
      cur.acc += Number(s.accuracy || 0);
      cur.count += 1;
      map.set(k, cur);
    }

    for (let i = 29; i >= 0; i--) {
      const d = startOfDay(new Date(now.getTime() - i * 24 * 60 * 60 * 1000));
      const k = toKey(d);
      const v = map.get(k);
      const avgWpm = v ? Math.round(v.wpm / v.count) : 0;
      const avgAcc = v ? Math.round(v.acc / v.count) : 0;
      days.push({
        key: k,
        label: `${d.getDate()}/${d.getMonth() + 1}`,
        avgWpm,
        avgAcc,
        count: v?.count || 0,
      });
    }
    return days;
  }, [last30]);

  const summary = useMemo(() => {
    const total = last30.length;
    const avgWpm = total ? Math.round(last30.reduce((a, s) => a + (s.wpm || 0), 0) / total) : 0;
    const avgAcc = total ? Math.round(last30.reduce((a, s) => a + (s.accuracy || 0), 0) / total) : 0;
    const bestWpm = total ? Math.max(...last30.map((s) => s.wpm || 0)) : 0;

    // trend: compare last 7 days avg vs previous 7 days avg
    const now = Date.now();
    const d7 = 7 * 24 * 60 * 60 * 1000;
    const last7 = last30.filter((s) => s.ts >= now - d7);
    const prev7 = last30.filter((s) => s.ts < now - d7 && s.ts >= now - 2 * d7);
    const last7Avg = last7.length ? last7.reduce((a, s) => a + (s.wpm || 0), 0) / last7.length : 0;
    const prev7Avg = prev7.length ? prev7.reduce((a, s) => a + (s.wpm || 0), 0) / prev7.length : 0;
    const delta = Math.round(last7Avg - prev7Avg);

    return { total, avgWpm, avgAcc, bestWpm, delta };
  }, [last30]);

  const chart = useMemo(() => {
    const values = daily.map((d) => d.avgWpm);
    const max = Math.max(20, ...values);
    const min = 0;
    const w = 720;
    const h = 180;
    const pad = 16;

    const xStep = (w - pad * 2) / (daily.length - 1);
    const y = (v: number) => {
      const t = (v - min) / (max - min || 1);
      return h - pad - t * (h - pad * 2);
    };

    const pts = daily.map((d, i) => `${pad + i * xStep},${y(d.avgWpm)}`).join(' ');
    return { pts, max, w, h, pad };
  }, [daily]);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-white border border-slate-200 hover:border-sky-300 transition-colors"
            aria-label="Back"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <BarChart3 className="text-sky-600" /> Detailed Analytics
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <p className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
              <CalendarDays size={14} /> Tests (30 days)
            </p>
            <p className="text-3xl font-bold mt-2">{summary.total}</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <p className="text-xs font-bold text-slate-400 uppercase">Avg WPM</p>
            <p className="text-3xl font-bold mt-2 text-sky-600">{summary.avgWpm}</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <p className="text-xs font-bold text-slate-400 uppercase">Avg Accuracy</p>
            <p className="text-3xl font-bold mt-2 text-sky-600">{summary.avgAcc}%</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <p className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
              <TrendingUp size={14} /> 7-day Trend
            </p>
            <p className={`text-3xl font-bold mt-2 ${summary.delta >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {summary.delta >= 0 ? `+${summary.delta}` : `${summary.delta}`} WPM
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8">
          <h2 className="text-xl font-bold mb-1">Monthly Speed Graph (Last 30 Days)</h2>
          <p className="text-sm text-slate-500 mb-6">
            This chart shows your daily average typing speed (WPM). Keep practicing to push the trend upward.
          </p>

          <div className="w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${chart.w} ${chart.h}`}
              className="w-full min-w-[720px]"
              role="img"
              aria-label="Monthly typing speed chart"
            >
              {/* grid */}
              {[0.25, 0.5, 0.75].map((t) => (
                <line
                  key={t}
                  x1={chart.pad}
                  x2={chart.w - chart.pad}
                  y1={chart.h - chart.pad - t * (chart.h - chart.pad * 2)}
                  y2={chart.h - chart.pad - t * (chart.h - chart.pad * 2)}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                />
              ))}

              {/* line */}
              <polyline
                points={chart.pts}
                fill="none"
                stroke="#0ea5e9"
                strokeWidth="3"
                strokeLinejoin="round"
                strokeLinecap="round"
              />

              {/* dots */}
              {daily.map((d, i) => {
                const xStep = (chart.w - chart.pad * 2) / (daily.length - 1);
                const x = chart.pad + i * xStep;
                const max = chart.max;
                const y =
                  chart.h -
                  chart.pad -
                  ((d.avgWpm - 0) / (max - 0 || 1)) * (chart.h - chart.pad * 2);
                const r = d.count ? 3.5 : 2.5;
                const fill = d.count ? '#0ea5e9' : '#cbd5e1';
                return <circle key={d.key} cx={x} cy={y} r={r} fill={fill} />;
              })}
            </svg>
          </div>

          <div className="mt-6 text-sm text-slate-600">
            <p>
              <span className="font-bold">Best WPM (30 days):</span> {summary.bestWpm}
            </p>
            <p>
              <span className="font-bold">Tip:</span> Use Focus Mode daily for consistent improvement.
            </p>
          </div>
        </div>

        <div className="mt-6 bg-white border border-slate-200 rounded-3xl p-6">
          <h3 className="font-bold text-lg mb-3">Recent Sessions</h3>
          {last30.slice(-8).reverse().map((s) => (
            <div key={s.ts} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-b-0">
              <div>
                <p className="font-semibold text-slate-800">{s.examTitle || 'Typing Test'}</p>
                <p className="text-xs text-slate-500">
                  {new Date(s.ts).toLocaleString()} • {s.durationMin} min • {s.language}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-sky-600">{s.wpm} WPM</p>
                <p className="text-xs text-slate-500">{clamp(s.accuracy || 0, 0, 100)}% accuracy</p>
              </div>
            </div>
          ))}

          {!last30.length && (
            <p className="text-slate-500 text-sm">
              No data yet. Complete a few typing tests and your monthly analytics will appear here.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
