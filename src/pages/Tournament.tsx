import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Trophy, Clock, Users, MapPin, Calendar, ChevronRight,
  Zap, Medal, Crown, Shield, AlertCircle, CheckCircle,
  Loader2, Lock, RefreshCw, Wifi, WifiOff, Star, Timer
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type SlotStatus = 'completed' | 'live' | 'upcoming' | 'tbd';

interface Winner {
  username: string;
  wpm: number;
  accuracy: number;
  district?: string;
}

interface ScheduleSlot {
  day: number;
  state: string;
  date: string;         // YYYY-MM-DD
  time: string;         // HH:mm (24hr)
  status: SlotStatus;
  participants?: number;
  maxParticipants?: number;
  winner?: Winner;
  top3?: Winner[];
}

interface RegFormState {
  username: string;
  state: string;
  email: string;
}

type ApiStatus = 'idle' | 'loading' | 'success' | 'error' | 'rate_limited' | 'closed' | 'already_registered';

// ─── Mock Schedule Data ────────────────────────────────────────────────────────
// In production: fetched from GET /api/tournament/schedule

const SCHEDULE: ScheduleSlot[] = [
  {
    day: 1, state: 'Rajasthan', date: '2026-06-01', time: '16:00', status: 'completed',
    participants: 1842, maxParticipants: 5000,
    winner: { username: 'priya_raj_typing', wpm: 68, accuracy: 97.2, district: 'Jaipur' },
    top3: [
      { username: 'priya_raj_typing', wpm: 68, accuracy: 97.2, district: 'Jaipur' },
      { username: 'mukesh_kota99', wpm: 64, accuracy: 96.5, district: 'Kota' },
      { username: 'sunita_jodhpur', wpm: 61, accuracy: 95.8, district: 'Jodhpur' },
    ]
  },
  {
    day: 2, state: 'Uttar Pradesh', date: '2026-06-02', time: '14:00', status: 'completed',
    participants: 3241, maxParticipants: 8000,
    winner: { username: 'rahul_lucknow99', wpm: 72, accuracy: 98.1, district: 'Lucknow' },
    top3: [
      { username: 'rahul_lucknow99', wpm: 72, accuracy: 98.1, district: 'Lucknow' },
      { username: 'deepa_varanasi', wpm: 69, accuracy: 97.4, district: 'Varanasi' },
      { username: 'ajay_agra_fast', wpm: 67, accuracy: 96.9, district: 'Agra' },
    ]
  },
  {
    day: 3, state: 'Bihar', date: '2026-06-03', time: '11:00', status: 'completed',
    participants: 2103, maxParticipants: 6000,
    winner: { username: 'anjali_patna', wpm: 65, accuracy: 96.8, district: 'Patna' },
    top3: [
      { username: 'anjali_patna', wpm: 65, accuracy: 96.8, district: 'Patna' },
      { username: 'rohit_muzaffarpur', wpm: 62, accuracy: 95.5, district: 'Muzaffarpur' },
      { username: 'kavita_gaya01', wpm: 60, accuracy: 94.9, district: 'Gaya' },
    ]
  },
  { day: 4, state: 'Madhya Pradesh', date: '2026-06-04', time: '16:00', status: 'live', participants: 1897, maxParticipants: 5500 },
  { day: 5, state: 'Maharashtra', date: '2026-06-05', time: '15:00', status: 'upcoming', maxParticipants: 7000 },
  { day: 6, state: 'Gujarat', date: '2026-06-06', time: '10:00', status: 'upcoming', maxParticipants: 4500 },
  { day: 7, state: 'West Bengal', date: '2026-06-07', time: '13:00', status: 'upcoming', maxParticipants: 5000 },
  { day: 8, state: 'Karnataka', date: '2026-06-08', time: '16:00', status: 'upcoming', maxParticipants: 4000 },
  { day: 9, state: 'Andhra Pradesh', date: '2026-06-09', time: '11:00', status: 'upcoming', maxParticipants: 3500 },
  { day: 10, state: 'Tamil Nadu', date: '2026-06-10', time: '14:00', status: 'upcoming', maxParticipants: 4500 },
  { day: 11, state: 'Telangana', date: '2026-06-11', time: '16:00', status: 'upcoming', maxParticipants: 3000 },
  { day: 12, state: 'Kerala', date: '2026-06-12', time: '10:00', status: 'upcoming', maxParticipants: 3000 },
  { day: 13, state: 'Odisha', date: '2026-06-13', time: '13:00', status: 'upcoming', maxParticipants: 3500 },
  { day: 14, state: 'Punjab', date: '2026-06-14', time: '16:00', status: 'upcoming', maxParticipants: 3000 },
  { day: 15, state: 'Haryana', date: '2026-06-15', time: '15:00', status: 'upcoming', maxParticipants: 3000 },
  { day: 16, state: 'Jharkhand', date: '2026-06-16', time: '11:00', status: 'upcoming', maxParticipants: 2500 },
  { day: 17, state: 'Assam', date: '2026-06-17', time: '13:00', status: 'upcoming', maxParticipants: 2500 },
  { day: 18, state: 'Chhattisgarh', date: '2026-06-18', time: '16:00', status: 'upcoming', maxParticipants: 2500 },
  { day: 19, state: 'Himachal Pradesh', date: '2026-06-19', time: '11:00', status: 'upcoming', maxParticipants: 1500 },
  { day: 20, state: 'Uttarakhand', date: '2026-06-20', time: '14:00', status: 'upcoming', maxParticipants: 1500 },
  { day: 21, state: 'Goa', date: '2026-06-21', time: '16:00', status: 'upcoming', maxParticipants: 800 },
  { day: 22, state: 'Manipur', date: '2026-06-22', time: '11:00', status: 'upcoming', maxParticipants: 1000 },
  { day: 23, state: 'Meghalaya', date: '2026-06-23', time: '13:00', status: 'upcoming', maxParticipants: 800 },
  { day: 24, state: 'Tripura', date: '2026-06-24', time: '16:00', status: 'upcoming', maxParticipants: 700 },
  { day: 25, state: 'Arunachal Pradesh', date: '2026-06-25', time: '11:00', status: 'tbd', maxParticipants: 500 },
  { day: 26, state: 'Nagaland', date: '2026-06-26', time: '13:00', status: 'tbd', maxParticipants: 500 },
  { day: 27, state: 'Mizoram', date: '2026-06-27', time: '16:00', status: 'tbd', maxParticipants: 400 },
  { day: 28, state: 'Sikkim', date: '2026-06-28', time: '14:00', status: 'tbd', maxParticipants: 300 },
];

const ALL_STATES = SCHEDULE.map(s => s.state);

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatTime12 = (time24: string) => {
  const [h, m] = time24.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
};

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

const getStatusColors = (status: SlotStatus) => {
  switch (status) {
    case 'live': return { badge: 'bg-red-500 text-white', border: 'border-red-400', bg: 'bg-red-50' };
    case 'completed': return { badge: 'bg-emerald-100 text-emerald-700', border: 'border-emerald-200', bg: 'bg-emerald-50' };
    case 'upcoming': return { badge: 'bg-sky-100 text-sky-700', border: 'border-sky-200', bg: 'bg-sky-50' };
    case 'tbd': return { badge: 'bg-slate-100 text-slate-500', border: 'border-slate-200', bg: 'bg-slate-50' };
  }
};

const getMedalColor = (rank: number) => {
  if (rank === 1) return 'text-amber-500';
  if (rank === 2) return 'text-slate-400';
  return 'text-amber-700';
};

// ─── Countdown Hook ───────────────────────────────────────────────────────────

const useCountdown = (targetDate: string, targetTime: string) => {
  const [remaining, setRemaining] = useState({ h: 0, m: 0, s: 0, total: 0 });

  useEffect(() => {
    const calc = () => {
      const target = new Date(`${targetDate}T${targetTime}:00`).getTime();
      const now = Date.now();
      const diff = target - now;
      if (diff <= 0) { setRemaining({ h: 0, m: 0, s: 0, total: 0 }); return; }
      setRemaining({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
        total: diff,
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetDate, targetTime]);

  return remaining;
};

// ─── Registration API mock ────────────────────────────────────────────────────
// Replace this with real fetch() calls to your backend

const mockRegisterApi = async (data: RegFormState & { slotDay: number }): Promise<{ ok: boolean; error?: string; registrationId?: string; retryAfter?: number }> => {
  await new Promise(r => setTimeout(r, 1600));

  // Simulate rate limit on fast repeat
  const lastCall = parseInt(sessionStorage.getItem('last_reg_call') || '0');
  const now = Date.now();
  if (now - lastCall < 8000) {
    return { ok: false, error: 'RATE_LIMITED', retryAfter: Math.ceil((8000 - (now - lastCall)) / 1000) };
  }
  sessionStorage.setItem('last_reg_call', String(now));

  // Simulate already registered check
  const registered = JSON.parse(localStorage.getItem('tournament_registrations') || '{}');
  if (registered[data.state]) {
    return { ok: false, error: 'ALREADY_REGISTERED' };
  }

  // Simulate slot full check (10% chance for demo)
  if (Math.random() < 0.05) {
    return { ok: false, error: 'SLOT_FULL' };
  }

  // Success — save to localStorage
  const regId = `PTT-${data.slotDay.toString().padStart(2,'0')}-${Math.random().toString(36).slice(2,8).toUpperCase()}`;
  registered[data.state] = { registrationId: regId, username: data.username, timestamp: now };
  localStorage.setItem('tournament_registrations', JSON.stringify(registered));

  return { ok: true, registrationId: regId };
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const LiveParticipantCount = ({ base }: { base: number }) => {
  const [count, setCount] = useState(base);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + Math.floor(Math.random() * 3));
    }, 3200);
    return () => clearInterval(id);
  }, []);
  return <span>{count.toLocaleString('en-IN')}</span>;
};

const CountdownBlock = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center">
    <div className="bg-black border border-slate-700 rounded-xl px-4 py-3 min-w-[64px] text-center">
      <span className="text-3xl font-bold text-sky-400 tabular-nums font-mono">
        {String(value).padStart(2, '0')}
      </span>
    </div>
    <span className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-bold">{label}</span>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

type Tab = 'schedule' | 'register' | 'champions' | 'finals';

const Tournament = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('schedule');
  const [scheduleFilter, setScheduleFilter] = useState<'all' | SlotStatus>('all');

  // Registration form
  const [form, setForm] = useState<RegFormState>({ username: '', state: '', email: '' });
  const [apiStatus, setApiStatus] = useState<ApiStatus>('idle');
  const [apiMsg, setApiMsg] = useState('');
  const [regId, setRegId] = useState('');
  const [retryAfter, setRetryAfter] = useState(0);
  const [retryTimer, setRetryTimer] = useState(0);

  // Connection health indicator (for advanced backend feel)
  const [wsConnected] = useState(true);

  const liveSlot = SCHEDULE.find(s => s.status === 'live');
  const nextSlot = SCHEDULE.find(s => s.status === 'upcoming');
  const completedSlots = SCHEDULE.filter(s => s.status === 'completed');

  const nextCountdown = useCountdown(
    nextSlot?.date ?? '2099-01-01',
    nextSlot?.time ?? '00:00'
  );

  // Retry countdown
  useEffect(() => {
    if (retryAfter <= 0) return;
    setRetryTimer(retryAfter);
    const id = setInterval(() => {
      setRetryTimer(t => {
        if (t <= 1) { setApiStatus('idle'); clearInterval(id); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [retryAfter]);

  // Check existing registration
  const existingReg = JSON.parse(localStorage.getItem('tournament_registrations') || '{}');
  const userRegisteredStates = Object.keys(existingReg);

  const handleSubmit = useCallback(async () => {
    // Validation
    if (!form.username.trim() || form.username.length < 3) {
      setApiStatus('error'); setApiMsg('Username kam se kam 3 characters ka hona chahiye.'); return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(form.username)) {
      setApiStatus('error'); setApiMsg('Username mein sirf letters, numbers aur underscore (_) allowed hain.'); return;
    }
    if (!form.state) {
      setApiStatus('error'); setApiMsg('Apna state select karein.'); return;
    }

    const slot = SCHEDULE.find(s => s.state === form.state);
    if (!slot) { setApiStatus('error'); setApiMsg('Invalid state.'); return; }
    if (slot.status === 'completed' || slot.status === 'live') {
      setApiStatus('closed'); setApiMsg(
        slot.status === 'live'
          ? 'Aapke state ka tournament abhi live chal raha hai. Registration band ho gayi.'
          : 'Aapke state ka tournament khatam ho gaya hai.'
      ); return;
    }

    setApiStatus('loading');
    setApiMsg('');

    const result = await mockRegisterApi({ ...form, slotDay: slot.day });

    if (result.ok) {
      setApiStatus('success');
      setRegId(result.registrationId!);
    } else if (result.error === 'RATE_LIMITED') {
      setApiStatus('rate_limited');
      setRetryAfter(result.retryAfter!);
      setApiMsg(`Bahut zyada requests. ${result.retryAfter} seconds mein dobara try karein.`);
    } else if (result.error === 'ALREADY_REGISTERED') {
      setApiStatus('already_registered');
      setApiMsg('Aap pehle se is state ke tournament mein register hain.');
    } else if (result.error === 'SLOT_FULL') {
      setApiStatus('error');
      setApiMsg('Is slot ki seats bhar gayi hain. Waitlist ke liye admin se contact karein.');
    } else {
      setApiStatus('error');
      setApiMsg('Server error. Thodi der baad dobara try karein.');
    }
  }, [form]);

  const filteredSchedule = scheduleFilter === 'all'
    ? SCHEDULE
    : SCHEDULE.filter(s => s.status === scheduleFilter);

  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="bg-black text-white py-16 px-8 relative overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div className="space-y-5 max-w-2xl">
              <div className="flex items-center gap-3">
                <div className="bg-amber-500 p-2.5 rounded-xl">
                  <Trophy size={22} className="text-black" />
                </div>
                <span className="text-amber-400 font-bold text-sm uppercase tracking-widest">National Championship 2026</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Pariksha <span className="text-amber-400">State</span><br />
                Typing Championship
              </h1>
              <p className="text-slate-400 text-lg">
                28 states. 28 days. Ek champion. Apne state ki taraf se type karo aur national level par apni jagah pakki karo.
              </p>
              <div className="flex flex-wrap gap-6 pt-2">
                {[
                  { icon: <MapPin size={16} />, label: '28 States' },
                  { icon: <Users size={16} />, label: '50,000+ Aspirants' },
                  { icon: <Calendar size={16} />, label: 'June 1–28, 2026' },
                  { icon: <Trophy size={16} />, label: 'Top 3 Nationally' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2 text-slate-300 text-sm font-medium">
                    <span className="text-amber-400">{item.icon}</span> {item.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Stats panel */}
            <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 min-w-[240px] space-y-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Live Stats</span>
                <div className={`flex items-center gap-1.5 text-xs font-bold ${wsConnected ? 'text-emerald-400' : 'text-red-400'}`}>
                  {wsConnected ? <Wifi size={12} /> : <WifiOff size={12} />}
                  {wsConnected ? 'Connected' : 'Offline'}
                </div>
              </div>
              {[
                { label: 'Days Completed', value: `${completedSlots.length}/28` },
                { label: 'State Champions', value: completedSlots.length.toString() },
                { label: 'Total Registered', value: '12,847' },
                { label: 'Live Right Now', value: liveSlot ? '🔴 Active' : '—' },
              ].map(item => (
                <div key={item.label} className="flex justify-between items-center border-b border-slate-800 pb-3 last:border-0 last:pb-0">
                  <span className="text-slate-400 text-sm">{item.label}</span>
                  <span className="font-bold text-white text-sm">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Live Now Banner ───────────────────────────────────────── */}
      {liveSlot && (
        <section className="bg-red-600 text-white px-8 py-5">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                <span className="text-sm font-bold uppercase tracking-widest">LIVE NOW</span>
              </div>
              <div>
                <span className="font-bold text-xl">{liveSlot.state} State Round</span>
                <span className="ml-3 text-red-200 text-sm">
                  <LiveParticipantCount base={liveSlot.participants ?? 0} /> participants typing right now
                </span>
              </div>
            </div>
            <button
              onClick={() => { setTab('register'); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
              className="bg-white text-red-600 px-6 py-2.5 rounded-xl font-bold hover:bg-red-50 transition-all flex items-center gap-2 whitespace-nowrap"
            >
              Register Karo <ChevronRight size={16} />
            </button>
          </div>
        </section>
      )}

      {/* ── Next Up Countdown ─────────────────────────────────────── */}
      {nextSlot && !liveSlot && (
        <section className="bg-slate-900 text-white px-8 py-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">Agle Round Mein</p>
              <p className="text-2xl font-bold">{nextSlot.state} — Day {nextSlot.day}</p>
              <p className="text-slate-400">{formatDate(nextSlot.date)} · {formatTime12(nextSlot.time)} IST</p>
            </div>
            <div className="flex items-end gap-3">
              <CountdownBlock value={nextCountdown.h} label="Hours" />
              <span className="text-slate-500 text-2xl font-bold mb-4">:</span>
              <CountdownBlock value={nextCountdown.m} label="Mins" />
              <span className="text-slate-500 text-2xl font-bold mb-4">:</span>
              <CountdownBlock value={nextCountdown.s} label="Secs" />
            </div>
            <button
              onClick={() => { setTab('register'); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
              className="bg-sky-500 text-black px-8 py-3 rounded-xl font-bold hover:bg-sky-400 transition-all whitespace-nowrap"
            >
              Abhi Register Karein
            </button>
          </div>
        </section>
      )}

      {/* ── Tab Navigation ────────────────────────────────────────── */}
      <div className="sticky top-[64px] z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex overflow-x-auto gap-0 no-scrollbar">
            {([
              { id: 'schedule', label: 'Schedule', icon: <Calendar size={16} /> },
              { id: 'register', label: 'Register', icon: <Shield size={16} /> },
              { id: 'champions', label: 'State Champions', icon: <Medal size={16} /> },
              { id: 'finals', label: 'Grand Finale', icon: <Crown size={16} /> },
            ] as { id: Tab; label: string; icon: React.ReactNode }[]).map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-6 py-4 font-bold text-sm border-b-2 transition-all whitespace-nowrap ${
                  tab === t.id
                    ? 'border-sky-500 text-sky-600'
                    : 'border-transparent text-slate-500 hover:text-black'
                }`}
              >
                {t.icon} {t.label}
                {t.id === 'register' && (
                  <span className="bg-sky-100 text-sky-600 text-[10px] font-bold px-2 py-0.5 rounded-full">Open</span>
                )}
                {t.id === 'champions' && completedSlots.length > 0 && (
                  <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">{completedSlots.length}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12">

        {/* ══════════════════════════════════════════════════════════
            TAB: SCHEDULE
        ══════════════════════════════════════════════════════════ */}
        {tab === 'schedule' && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold">28-Day Schedule</h2>
                <p className="text-slate-500 mt-1">Har din ek state. Har state ek baar. Admin dwara decide kiya gaya.</p>
              </div>
              {/* Filter chips */}
              <div className="flex gap-2 flex-wrap">
                {(['all', 'live', 'upcoming', 'completed', 'tbd'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setScheduleFilter(f)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all capitalize ${
                      scheduleFilter === f
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    {f === 'all' ? 'All Days' : f === 'tbd' ? 'TBD' : f.charAt(0).toUpperCase() + f.slice(1)}
                    {f === 'live' && <span className="ml-1 inline-block w-1.5 h-1.5 rounded-full bg-red-500 align-middle"></span>}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredSchedule.map((slot) => {
                const colors = getStatusColors(slot.status);
                return (
                  <div
                    key={slot.day}
                    className={`bg-white border-2 rounded-2xl p-5 transition-all hover:shadow-lg group ${
                      slot.status === 'live'
                        ? 'border-red-400 shadow-lg shadow-red-100'
                        : slot.status === 'completed'
                        ? 'border-emerald-200 hover:border-emerald-400'
                        : 'border-slate-100 hover:border-sky-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                          Day {slot.day}
                        </span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${colors.badge}`}>
                          {slot.status === 'live' && <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>}
                          {slot.status.toUpperCase()}
                        </span>
                      </div>
                      {slot.status === 'completed' && (
                        <CheckCircle size={16} className="text-emerald-500" />
                      )}
                      {slot.status === 'tbd' && (
                        <Lock size={14} className="text-slate-400" />
                      )}
                    </div>

                    <h3 className={`text-xl font-bold mb-1 ${slot.status === 'live' ? 'text-red-600' : 'text-black'}`}>
                      {slot.state}
                    </h3>

                    <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={13} /> {slot.status === 'tbd' ? 'Date TBD' : formatDate(slot.date)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={13} /> {slot.status === 'tbd' ? 'Time TBD' : formatTime12(slot.time)}
                      </span>
                    </div>

                    {/* Participants bar */}
                    {slot.participants !== undefined && slot.maxParticipants && (
                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                          <span className="flex items-center gap-1">
                            <Users size={11} />
                            {slot.status === 'live'
                              ? <><LiveParticipantCount base={slot.participants} /> registered</>
                              : `${slot.participants.toLocaleString('en-IN')} participated`
                            }
                          </span>
                          <span>{slot.maxParticipants.toLocaleString('en-IN')} max</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${slot.status === 'live' ? 'bg-red-400' : 'bg-emerald-400'}`}
                            style={{ width: `${Math.min((slot.participants / slot.maxParticipants) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Winner */}
                    {slot.winner && (
                      <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                        <Crown size={16} className="text-amber-500 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs text-amber-600 font-bold uppercase tracking-wider">State Champion</p>
                          <p className="font-bold text-sm text-slate-800 truncate">{slot.winner.username}</p>
                          <p className="text-xs text-slate-500">{slot.winner.wpm} WPM · {slot.winner.accuracy}% acc</p>
                        </div>
                      </div>
                    )}

                    {slot.status === 'upcoming' && (
                      <button
                        onClick={() => setTab('register')}
                        className="w-full mt-2 py-2 rounded-xl text-sm font-bold text-sky-600 bg-sky-50 hover:bg-sky-100 transition-colors flex items-center justify-center gap-1"
                      >
                        Register Karein <ChevronRight size={14} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
            TAB: REGISTER
        ══════════════════════════════════════════════════════════ */}
        {tab === 'register' && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

            {/* How it works */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-3xl font-bold mb-2">Register Karein</h2>
                <p className="text-slate-500">Apne state ke tournament ke liye sirf ek baar register karna hoga.</p>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-lg">Kaise kaam karta hai?</h3>
                {[
                  { step: '01', title: 'State aur username dalo', desc: 'Apna state select karo aur ek unique username choose karo.' },
                  { step: '02', title: 'Confirmation milegi', desc: 'Registration ID mil jaayegi — ise save kar lo.' },
                  { step: '03', title: 'Tournament ke din aao', desc: 'Apne state ke slot ke time par /typing-test par jaao aur participate karo.' },
                  { step: '04', title: 'Top performer finals mein', desc: 'Highest WPM + accuracy wala candidate state champion banega aur Grand Finale mein jaayega.' },
                ].map(item => (
                  <div key={item.step} className="flex gap-4">
                    <span className="text-2xl font-black text-slate-200 flex-shrink-0 w-10">{item.step}</span>
                    <div>
                      <p className="font-bold text-slate-800">{item.title}</p>
                      <p className="text-sm text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2">
                <p className="font-bold text-sm flex items-center gap-2"><Shield size={14} className="text-sky-500" /> Rate Limiting Notice</p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Spam prevent karne ke liye registrations rate-limited hain. Ek IP se 5 minutes mein zyada attempts block ho jaayenge. 
                  Ek state mein sirf ek baar register kar sakte hain.
                </p>
              </div>

              {/* Already registered list */}
              {userRegisteredStates.length > 0 && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
                  <p className="font-bold text-sm text-emerald-700 mb-2 flex items-center gap-2">
                    <CheckCircle size={14} /> Aapki Registrations
                  </p>
                  {userRegisteredStates.map(s => (
                    <div key={s} className="text-xs text-emerald-600 font-medium">
                      ✓ {s} — {existingReg[s].username} ({existingReg[s].registrationId})
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Registration Form */}
            <div className="lg:col-span-3">
              <div className="bg-white border-2 border-slate-100 rounded-3xl p-8 shadow-xl">
                <h3 className="text-xl font-bold mb-6">Tournament Registration Form</h3>

                {apiStatus === 'success' ? (
                  <div className="text-center py-8 space-y-4">
                    <div className="bg-emerald-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto">
                      <CheckCircle size={32} className="text-emerald-600" />
                    </div>
                    <h3 className="text-2xl font-bold">Registration Successful!</h3>
                    <p className="text-slate-600">Aap <strong>{form.state}</strong> ke tournament mein register ho gaye hain.</p>
                    <div className="bg-slate-900 text-white rounded-2xl p-4 font-mono text-center">
                      <p className="text-xs text-slate-400 mb-1 uppercase tracking-wider">Registration ID</p>
                      <p className="text-xl font-bold text-sky-400">{regId}</p>
                    </div>
                    <p className="text-sm text-slate-500">Yeh ID save kar lo. Tournament ke din isko verify kiya jaayega.</p>
                    {(() => {
                      const slot = SCHEDULE.find(s => s.state === form.state);
                      return slot ? (
                        <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 text-sm">
                          <p className="font-bold text-sky-700">{slot.state} Round</p>
                          <p className="text-sky-600">{formatDate(slot.date)} · {formatTime12(slot.time)} IST</p>
                        </div>
                      ) : null;
                    })()}
                    <button
                      onClick={() => { setApiStatus('idle'); setForm({ username: '', state: '', email: '' }); }}
                      className="text-sky-600 font-bold hover:underline text-sm"
                    >
                      Kisi aur state ke liye register karein
                    </button>
                  </div>
                ) : (
                  <div className="space-y-5">

                    {/* State Select */}
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Apna State Chunein <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3.5 text-slate-400" size={18} />
                        <select
                          value={form.state}
                          onChange={e => { setForm(f => ({ ...f, state: e.target.value })); setApiStatus('idle'); }}
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none appearance-none font-medium"
                        >
                          <option value="">— State select karein —</option>
                          {ALL_STATES.map(s => {
                            const slot = SCHEDULE.find(sl => sl.state === s)!;
                            const isRegistered = userRegisteredStates.includes(s);
                            const isPast = slot.status === 'completed' || slot.status === 'live';
                            return (
                              <option key={s} value={s} disabled={isPast}>
                                {s}
                                {isRegistered ? ' ✓ Registered' : ''}
                                {isPast ? ` (${slot.status === 'live' ? 'Live Now' : 'Ended'})` : ''}
                                {slot.status === 'tbd' ? ' (Date TBD)' : ` — ${formatDate(slot.date)}`}
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      {/* Slot preview */}
                      {form.state && (() => {
                        const slot = SCHEDULE.find(s => s.state === form.state);
                        if (!slot) return null;
                        const colors = getStatusColors(slot.status);
                        return (
                          <div className={`mt-2 flex items-center gap-3 px-4 py-3 rounded-xl border ${colors.border} ${colors.bg}`}>
                            <Timer size={16} className="text-slate-500 flex-shrink-0" />
                            <div className="text-sm">
                              <span className="font-bold">{slot.state}</span> — Day {slot.day} ·{' '}
                              {slot.status === 'tbd' ? 'Schedule TBD' : `${formatDate(slot.date)}, ${formatTime12(slot.time)} IST`}
                              {slot.status === 'completed' && <span className="ml-2 text-red-500 font-bold">Khatam ho gaya</span>}
                              {slot.status === 'live' && <span className="ml-2 text-red-500 font-bold">Abhi live chal raha hai!</span>}
                              {slot.status === 'upcoming' && slot.maxParticipants && (
                                <span className="ml-2 text-slate-500">· Max {slot.maxParticipants.toLocaleString('en-IN')} seats</span>
                              )}
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Username */}
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Username Chunein <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-slate-400 font-mono text-sm">@</span>
                        <input
                          type="text"
                          value={form.username}
                          onChange={e => { setForm(f => ({ ...f, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') })); setApiStatus('idle'); }}
                          maxLength={20}
                          placeholder="eg. priya_typing99"
                          className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none font-mono"
                        />
                        <span className="absolute right-3 top-3.5 text-xs text-slate-400">{form.username.length}/20</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">Letters, numbers aur underscore hi allowed hain. Yeh publicly dikhega.</p>
                    </div>

                    {/* Email (optional) */}
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Email (Optional) <span className="text-slate-400 font-normal">— Tournament reminder ke liye</span>
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="aapka@email.com"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
                      />
                    </div>

                    {/* Error / Status messages */}
                    {(apiStatus === 'error' || apiStatus === 'closed' || apiStatus === 'already_registered') && (
                      <div className={`flex items-start gap-3 p-4 rounded-xl border ${
                        apiStatus === 'already_registered'
                          ? 'bg-amber-50 border-amber-200 text-amber-700'
                          : 'bg-red-50 border-red-200 text-red-700'
                      }`}>
                        <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                        <p className="text-sm font-medium">{apiMsg}</p>
                      </div>
                    )}

                    {apiStatus === 'rate_limited' && (
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-orange-50 border border-orange-200 text-orange-700">
                        <RefreshCw size={18} className="flex-shrink-0 animate-spin" />
                        <div>
                          <p className="text-sm font-bold">Request Rate Limited</p>
                          <p className="text-sm">{retryTimer}s mein dobara try kar sakte hain.</p>
                        </div>
                      </div>
                    )}

                    {/* Submit */}
                    <button
                      onClick={handleSubmit}
                      disabled={apiStatus === 'loading' || apiStatus === 'rate_limited'}
                      className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                        apiStatus === 'loading' || apiStatus === 'rate_limited'
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          : 'bg-black text-white hover:bg-slate-800 active:scale-[0.98]'
                      }`}
                    >
                      {apiStatus === 'loading'
                        ? <><Loader2 size={20} className="animate-spin" /> Registering...</>
                        : apiStatus === 'rate_limited'
                        ? <><Clock size={20} /> Wait {retryTimer}s</>
                        : <><Shield size={20} /> Secure Registration Karein</>
                      }
                    </button>

                    <p className="text-center text-xs text-slate-400">
                      Registration free hai. Ek state mein ek baar hi register kar sakte hain.
                      Server-side rate limiting aur anti-spam measures active hain.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
            TAB: STATE CHAMPIONS
        ══════════════════════════════════════════════════════════ */}
        {tab === 'champions' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold">State Champions</h2>
              <p className="text-slate-500 mt-1">
                {completedSlots.length} states complete · {28 - completedSlots.length} baaki hain · Ye sab Grand Finale mein jaayenge
              </p>
            </div>

            {completedSlots.length === 0 ? (
              <div className="text-center py-20 text-slate-400">
                <Trophy size={48} className="mx-auto mb-4 opacity-30" />
                <p className="font-bold text-lg">Abhi koi state round complete nahi hua.</p>
                <p className="text-sm">Pehle round ke baad champions yahan dikhenge.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {completedSlots.map((slot) => (
                  <div key={slot.day} className="bg-white border border-slate-100 rounded-3xl p-6 hover:shadow-xl transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Day {slot.day}</span>
                        <h3 className="text-2xl font-bold">{slot.state}</h3>
                        <p className="text-sm text-slate-400">{formatDate(slot.date)} · {slot.participants?.toLocaleString('en-IN')} participants</p>
                      </div>
                      <div className="bg-amber-100 p-2 rounded-xl">
                        <Crown size={20} className="text-amber-500" />
                      </div>
                    </div>

                    {slot.top3?.map((candidate, i) => (
                      <div key={candidate.username} className={`flex items-center gap-3 py-3 ${i < 2 ? 'border-b border-slate-100' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0 ${
                          i === 0 ? 'bg-amber-100' : i === 1 ? 'bg-slate-100' : 'bg-orange-50'
                        }`}>
                          <span className={getMedalColor(i + 1)}>
                            {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm truncate">{candidate.username}</p>
                          <p className="text-xs text-slate-400">{candidate.district}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-bold text-sky-600 text-sm">{candidate.wpm} WPM</p>
                          <p className="text-xs text-slate-400">{candidate.accuracy}% acc</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
            TAB: GRAND FINALE
        ══════════════════════════════════════════════════════════ */}
        {tab === 'finals' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold">Grand Finale</h2>
              <p className="text-slate-500 mt-1">Sabhi 28 state champions ek stage par — top 3 nationally selected honge.</p>
            </div>

            {/* Status */}
            <div className={`rounded-3xl p-8 text-center ${completedSlots.length < 28 ? 'bg-slate-900 text-white' : 'bg-amber-50 border-2 border-amber-300'}`}>
              {completedSlots.length < 28 ? (
                <>
                  <Lock size={40} className="mx-auto mb-4 text-slate-400" />
                  <h3 className="text-2xl font-bold mb-2">Finals Locked</h3>
                  <p className="text-slate-400 mb-4">
                    Abhi <strong className="text-white">{28 - completedSlots.length} state rounds</strong> baaki hain.
                    Jab sab 28 complete honge, finale announce kiya jaayega.
                  </p>
                  <div className="bg-slate-800 rounded-2xl p-4 inline-block">
                    <p className="text-sm text-slate-400 mb-1">Progress</p>
                    <div className="flex items-center gap-3">
                      <div className="w-40 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-sky-500 rounded-full transition-all" style={{ width: `${(completedSlots.length / 28) * 100}%` }}></div>
                      </div>
                      <span className="font-bold text-sky-400">{completedSlots.length}/28</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Trophy size={48} className="mx-auto mb-4 text-amber-500" />
                  <h3 className="text-3xl font-bold text-amber-700">Grand Finale Active!</h3>
                  <p className="text-slate-600 mt-2">Sab 28 state champions compete kar rahe hain.</p>
                </>
              )}
            </div>

            {/* Prize Structure */}
            <div>
              <h3 className="text-xl font-bold mb-4">Prize & Recognition</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { rank: '1st', icon: '🥇', color: 'border-amber-400 bg-amber-50', title: 'National Champion', perks: ['Certificate of Excellence', 'Lifetime Premium Access', 'Featured on Platform', 'National Rank #1 Badge'] },
                  { rank: '2nd', icon: '🥈', color: 'border-slate-300 bg-slate-50', title: 'National Runner-Up', perks: ['Certificate of Merit', '1 Year Premium Access', 'National Rank #2 Badge'] },
                  { rank: '3rd', icon: '🥉', color: 'border-orange-300 bg-orange-50', title: 'Third Place', perks: ['Certificate', '6 Month Premium', 'National Rank #3 Badge'] },
                ].map(p => (
                  <div key={p.rank} className={`border-2 rounded-3xl p-6 ${p.color}`}>
                    <div className="text-4xl mb-3">{p.icon}</div>
                    <p className="text-2xl font-black mb-1">{p.rank}</p>
                    <p className="font-bold text-lg mb-4">{p.title}</p>
                    <ul className="space-y-2">
                      {p.perks.map(perk => (
                        <li key={perk} className="flex items-center gap-2 text-sm text-slate-600">
                          <Star size={12} className="text-amber-500 flex-shrink-0" fill="currentColor" />
                          {perk}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Finals Leaderboard Placeholder */}
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8">
              <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
                <Zap size={18} className="text-amber-500" /> Finals Leaderboard
              </h3>
              <p className="text-sm text-slate-500 mb-6">Live results — sabhi 28 state champions ke scores yahan real-time update honge.</p>
              <div className="space-y-2">
                {completedSlots.slice(0, 3).map((slot, i) => slot.winner && (
                  <div key={slot.state} className="flex items-center gap-4 bg-white border border-slate-100 rounded-2xl px-5 py-4">
                    <span className="text-2xl flex-shrink-0">{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold">{slot.winner.username}</p>
                      <p className="text-sm text-slate-500">{slot.state}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sky-600">{slot.winner.wpm} WPM</p>
                      <p className="text-xs text-slate-400">{slot.winner.accuracy}% accuracy</p>
                    </div>
                  </div>
                ))}
                {completedSlots.length < 28 && (
                  <div className="flex items-center justify-center py-8 text-slate-400">
                    <Lock size={14} className="mr-2" />
                    <span className="text-sm">{28 - completedSlots.length} more state rounds remaining before full leaderboard unlocks</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Tournament;
