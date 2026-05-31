import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageSkeleton } from '../components/SkeletonLoader';
import { Search, MapPin, Building2, Landmark, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

const Exams = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Central');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <PageSkeleton />;

  type ExamCard = {
    id: string;
    title: string;
    detail: string;
    posts: string;
    defaultDurationMin?: 1 | 3 | 5 | 10 | 15;
    durationOptionsMin?: Array<1 | 3 | 5 | 10 | 15>;
  };

  const examsData: Record<string, ExamCard[]> = {
    'Central': [
      { id: 'ssc-cgl', title: 'SSC CGL', detail: 'Skill Test for Tax Assistant & Auditor', posts: '7,500+ Posts', defaultDurationMin: 15, durationOptionsMin: [1, 3, 5, 10, 15] },
      { id: 'ssc-chsl', title: 'SSC CHSL', detail: 'Data Entry Operator & LDC', posts: '4,500+ Posts', defaultDurationMin: 10, durationOptionsMin: [1, 3, 5, 10, 15] },
      { id: 'stenographer', title: 'Stenographer', detail: 'Grade C & D Skill Test', posts: '1,200+ Posts', defaultDurationMin: 10, durationOptionsMin: [1, 3, 5, 10, 15] },
      { id: 'rrb-ntpc', title: 'RRB NTPC', detail: 'Railway Clerical Typing Test', posts: '35,000+ Posts', defaultDurationMin: 10, durationOptionsMin: [1, 3, 5, 10, 15] },
      // Added (from your screenshots) — merged into existing sections
      { id: 'dsssb-ja-pa-spa', title: 'DSSSB JJA / PA / SPA', detail: 'Typing Test Series', posts: 'New', defaultDurationMin: 10, durationOptionsMin: [1, 3, 5, 10, 15] },
      { id: 'dsssb-ja-ldc-dass', title: 'DSSSB Junior Assistant / LDC / DASS IV', detail: 'Typing Test Series', posts: 'New', defaultDurationMin: 10, durationOptionsMin: [1, 3, 5, 10, 15] },
      { id: 'delhi-hc-jja', title: 'Delhi High Court JJA', detail: 'Junior Judicial Assistant Typing Test Series', posts: 'New', defaultDurationMin: 10, durationOptionsMin: [1, 3, 5, 10, 15] },
      { id: 'delhi-hc-pa-spa', title: 'Delhi High Court PA / SPA', detail: 'Typing Tests', posts: 'New', defaultDurationMin: 10, durationOptionsMin: [1, 3, 5, 10, 15] },
      { id: 'supreme-court-jca', title: 'Supreme Court JCA', detail: 'Junior Court Assistant Typing Tests', posts: 'New', defaultDurationMin: 10, durationOptionsMin: [1, 3, 5, 10, 15] },
      { id: 'rrb-ntpc-gdce', title: 'RRB NTPC / GDCE', detail: 'Typing Test Series', posts: 'New', defaultDurationMin: 10, durationOptionsMin: [1, 3, 5, 10, 15] },
      { id: 'delhi-police-typing-course', title: 'Delhi Police', detail: 'Typing Course Test Series', posts: 'New', defaultDurationMin: 5, durationOptionsMin: [1, 3, 5, 10, 15] },
      { id: 'delhi-police-awo-tpo', title: 'Delhi Police AWO / TPO', detail: 'Typing Test Course', posts: 'New', defaultDurationMin: 5, durationOptionsMin: [1, 3, 5, 10, 15] },
      { id: 'bsf-hcm', title: 'BSF Head Constable Ministerial (HCM)', detail: 'Typing Test Course', posts: 'New', defaultDurationMin: 5, durationOptionsMin: [1, 3, 5, 10, 15] },
      { id: 'crpf-hcm', title: 'CRPF HCM', detail: 'Typing Practice / Paragraphs', posts: 'New', defaultDurationMin: 5, durationOptionsMin: [1, 3, 5, 10, 15] },
    ],
    'National': [
      { id: 'ibps-po', title: 'IBPS PO', detail: 'Descriptive Writing & Documentation', posts: '6,400+ Posts', defaultDurationMin: 15, durationOptionsMin: [1, 3, 5, 10, 15] },
      { id: 'sbi-clerk', title: 'SBI Clerk', detail: 'Junior Associate Mains Typing', posts: '8,000+ Posts', defaultDurationMin: 10, durationOptionsMin: [1, 3, 5, 10, 15] },
      { id: 'rbi-asst', title: 'RBI Assistant', detail: 'Language Proficiency & Typing', posts: '950+ Posts', defaultDurationMin: 10, durationOptionsMin: [1, 3, 5, 10, 15] },
      { id: 'lic-aao', title: 'LIC AAO', detail: 'Administrative Assistant Test', posts: '300+ Posts', defaultDurationMin: 10, durationOptionsMin: [1, 3, 5, 10, 15] },
      // Added (from your screenshots)
      { id: 'nvs-jsa', title: 'NVS Junior Secretariat Assistant', detail: 'Typing Tests', posts: 'New', defaultDurationMin: 10, durationOptionsMin: [1, 3, 5, 10, 15] },
      { id: 'csir-jsa-english', title: 'CSIR JSA (English)', detail: 'Typing Test Series', posts: 'New', defaultDurationMin: 10, durationOptionsMin: [1, 3, 5, 10, 15] },
      { id: 'ncert-ldc', title: 'NCERT LDC (English)', detail: 'Typing Tests', posts: 'New', defaultDurationMin: 10, durationOptionsMin: [1, 3, 5, 10, 15] },
      { id: 'kvs-jsa', title: 'KVS JSA', detail: 'Typing Practice Test Series', posts: 'New', defaultDurationMin: 10, durationOptionsMin: [1, 3, 5, 10, 15] },
      { id: 'dda-jsa', title: 'DDA JSA', detail: 'Typing Practice Test Series', posts: 'New', defaultDurationMin: 10, durationOptionsMin: [1, 3, 5, 10, 15] },
      { id: 'epfo-ssa', title: 'EPFO SSA', detail: 'Social Security Assistant Typing Course', posts: 'New', defaultDurationMin: 10, durationOptionsMin: [1, 3, 5, 10, 15] },
      { id: 'cbse-typing', title: 'CBSE English Typing', detail: 'Typing Skill Test', posts: 'New', defaultDurationMin: 5, durationOptionsMin: [1, 3, 5, 10, 15] },
      { id: 'drdo-assistant-typing', title: 'DRDO Assistant', detail: 'Typing Test Course', posts: 'New', defaultDurationMin: 5, durationOptionsMin: [1, 3, 5, 10, 15] },
      { id: 'aiims-cre-typing', title: 'AIIMS CRE (English)', detail: 'Typing Skill Test', posts: 'New', defaultDurationMin: 5, durationOptionsMin: [1, 3, 5, 10, 15] },
      { id: 'jnu-ja', title: 'JNU Junior Assistant', detail: 'Typing Test Course', posts: 'New', defaultDurationMin: 5, durationOptionsMin: [1, 3, 5, 10, 15] },
    ],
    'Statewise': [
      { id: 'upsssc', title: 'UPSSSC VDO', detail: 'Junior Assistant Typing (Hindi/Eng)', posts: '1,262 Posts', defaultDurationMin: 10, durationOptionsMin: [1, 3, 5, 10, 15] },
      { id: 'bssc', title: 'Bihar SSC', detail: 'Inter Level Typing Test', posts: '11,000+ Posts', defaultDurationMin: 10, durationOptionsMin: [1, 3, 5, 10, 15] },
      { id: 'mpsc', title: 'Maharashtra PSC', detail: 'Typing Certificate Exam', posts: '5,000+ Posts', defaultDurationMin: 10, durationOptionsMin: [1, 3, 5, 10, 15] },
      { id: 'hssc', title: 'Haryana SSC', detail: 'Clerk & DEO Typing Test', posts: '3,000+ Posts', defaultDurationMin: 10, durationOptionsMin: [1, 3, 5, 10, 15] },
      // Added (from your screenshots)
      { id: 'allahabad-hc-ja-steno', title: 'Allahabad HC JA & Apprentices', detail: 'JA / Apprentices / Steno Typing Tests', posts: 'New', defaultDurationMin: 10, durationOptionsMin: [1, 3, 5, 10, 15] },
      { id: 'allahabad-hc-ro-aro', title: 'Allahabad HC RO / ARO', detail: 'Typing Test Series', posts: 'New', defaultDurationMin: 10, durationOptionsMin: [1, 3, 5, 10, 15] },
      { id: 'up-police-typing', title: 'UP Police (UPPRPB) SI/ASI/CO', detail: 'Computer Operator / SI / ASI Typing Tests', posts: 'New', defaultDurationMin: 5, durationOptionsMin: [1, 3, 5, 10, 15] },
      { id: 'upsssc-ja', title: 'UPSSSC Junior Assistant', detail: 'Typing Skill Test Series', posts: 'New', defaultDurationMin: 10, durationOptionsMin: [1, 3, 5, 10, 15] },
    ],
  };

  const tabs = [
    { name: 'Central', icon: <Building2 size={18} /> },
    { name: 'National', icon: <Landmark size={18} /> },
    { name: 'Statewise', icon: <MapPin size={18} /> },
  ];

  /**
   * Organization-level logos (official where available).
   * You can add more org logos in: public/exam-logos/
   */
  const ORG_LOGO: Record<string, string> = {
    // already present
    ssc: '/exam-logos/ssc.jpg',
    rrb: '/exam-logos/rrb.svg',
    ibps: '/exam-logos/ibps.png',
    sbi: '/exam-logos/sbi.svg',
    rbi: '/exam-logos/rbi.svg',
    upsc: '/exam-logos/upsc.png',

    // not yet added (falls back to placeholder until you add these files)
    dsssb: '/exam-logos/dsssb.png',
    'delhi-hc': '/exam-logos/delhi-hc.png',
    'supreme-court': '/exam-logos/supreme-court.png',
    'delhi-police': '/exam-logos/delhi-police.png',
    bsf: '/exam-logos/bsf.png',
    crpf: '/exam-logos/crpf.png',
    // generated placeholder logos (so UI doesn't show generic placeholder)
    'allahabad-hc': '/exam-logos/allahabad-hc.svg',
    upsssc: '/exam-logos/upsssc.svg',
    bssc: '/exam-logos/bssc.svg',
    mpsc: '/exam-logos/mpsc.svg',
    hssc: '/exam-logos/hssc.svg',
    lic: '/exam-logos/lic.svg',
    nvs: '/exam-logos/nvs.svg',
    csir: '/exam-logos/csir.svg',
    ncert: '/exam-logos/ncert.png',
    kvs: '/exam-logos/kvs.png',
    dda: '/exam-logos/dda.png',
    epfo: '/exam-logos/epfo.png',
    cbse: '/exam-logos/cbse.png',
    drdo: '/exam-logos/drdo.png',
    aiims: '/exam-logos/aiims.png',
    jnu: '/exam-logos/jnu.png',
    upprpb: '/exam-logos/upprpb.png',
  };

  const getOrgKey = (examId: string, examTitle?: string) => {
    const id = (examId || '').toLowerCase();
    const first = id.split('-')[0] || '';
    if (first && ORG_LOGO[first]) return first;

    // custom id patterns
    if (id.startsWith('delhi-hc-')) return 'delhi-hc';
    if (id.startsWith('delhi-police-')) return 'delhi-police';
    if (id.startsWith('supreme-court-')) return 'supreme-court';
    if (id.startsWith('allahabad-hc-')) return 'allahabad-hc';

    const t = (examTitle || '').toLowerCase();
    if (t.includes('ssc')) return 'ssc';
    if (t.includes('rrb') || t.includes('railway')) return 'rrb';
    if (t.includes('ibps')) return 'ibps';
    if (t.includes('sbi')) return 'sbi';
    if (t.includes('rbi')) return 'rbi';
    if (t.includes('upsc')) return 'upsc';
    if (t.includes('dsssb')) return 'dsssb';
    if (t.includes('delhi high court') || t.includes('delhi hc')) return 'delhi-hc';
    if (t.includes('supreme court')) return 'supreme-court';
    if (t.includes('delhi police')) return 'delhi-police';
    if (t.includes('bsf')) return 'bsf';
    if (t.includes('crpf')) return 'crpf';
    if (t.includes('allahabad')) return 'allahabad-hc';
    if (t.includes('upsssc')) return 'upsssc';
    if (t.includes('bihar ssc') || t.includes('bssc')) return 'bssc';
    if (t.includes('mpsc')) return 'mpsc';
    if (t.includes('hssc')) return 'hssc';
    if (t.includes('lic')) return 'lic';
    if (t.includes('nvs')) return 'nvs';
    if (t.includes('csir')) return 'csir';
    if (t.includes('ncert')) return 'ncert';
    if (t.includes('kvs')) return 'kvs';
    if (t.includes('dda')) return 'dda';
    if (t.includes('epfo')) return 'epfo';
    if (t.includes('cbse')) return 'cbse';
    if (t.includes('drdo')) return 'drdo';
    if (t.includes('aiims')) return 'aiims';
    if (t.includes('jnu')) return 'jnu';
    if (t.includes('up police') || t.includes('upprpb')) return 'upprpb';
    return '';
  };

  const ExamLogo = ({
    examId,
    examTitle,
    size = 32,
  }: {
    examId: string;
    examTitle?: string;
    size?: number;
  }) => {
    const [idx, setIdx] = useState(0);
    const orgKey = getOrgKey(examId, examTitle);
    const orgLogo = orgKey ? ORG_LOGO[orgKey] : '';

    // Hybrid approach:
    // 1) Try per-exam logo (if you add it) => /public/exam-logos/exams/{examId}.(png|svg|jpg)
    // 2) Fallback to organization logo
    // 3) Fallback to placeholder
    const candidates = [
      `/exam-logos/exams/${examId}.png`,
      `/exam-logos/exams/${examId}.svg`,
      `/exam-logos/exams/${examId}.jpg`,
      orgLogo,
      '/exam-logos/placeholder.svg',
    ].filter(Boolean);

    return (
      <img
        src={candidates[Math.min(idx, candidates.length - 1)]}
        alt=""
        className="object-contain"
        style={{ width: size, height: size }}
        loading="lazy"
        onError={() => setIdx((v) => Math.min(v + 1, candidates.length - 1))}
      />
    );
  };

  const list = examsData[activeTab] || [];
  const q = searchTerm.trim().toLowerCase();
  const filtered = q
    ? list.filter((x) => {
        const hay = `${x.title} ${x.detail} ${x.posts}`.toLowerCase();
        return hay.includes(q);
      })
    : list;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Competitive <span className="text-sky-600">Exam Portal</span></h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Select your target exam to access custom-curated paragraphs that match the exact difficulty and character count of previous years.
          </p>
        </div>

        {/* Featured / Daily Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Zap className="text-amber-500 fill-amber-500" size={20} /> Today's Recommended Tests
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { id: 'ssc-chsl', title: 'CHSL Mock #42', time: '10 min', level: 'Easy', duration: 10 },
              { id: 'ssc-cgl', title: 'CGL Main Simulator', time: '15 min', level: 'Hard', duration: 15 },
              // keep as-is (30 min) but TypingTest currently supports up to 15 min presets; so map to 15 for now.
              { id: 'ibps-po', title: 'IBPS PO Mains', time: '15 min', level: 'Medium', duration: 15 },
              { id: 'stenographer', title: 'Steno Grade C', time: '10 min', level: 'Medium', duration: 10 },
            ].map((test, i) => (
              <div
                key={i}
                className="bg-white border border-slate-200 p-4 rounded-2xl flex justify-between items-center group hover:border-sky-500 transition-all cursor-pointer"
                onClick={() => navigate(`/typing-test?exam=${test.id}&title=${encodeURIComponent(test.title)}&duration=${test.duration}`)}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <ExamLogo examId={test.id} examTitle={test.title} size={20} />
                    <p className="font-bold text-sm">{test.title}</p>
                  </div>
                  <p className="text-xs text-slate-400">{test.time} • {test.level}</p>
                </div>
                <ArrowRight size={16} className="text-slate-300 group-hover:text-sky-500 transition-colors" />
              </div>
            ))}
          </div>
        </section>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Tabs */}
          <div className="md:w-64 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${
                  activeTab === tab.name 
                    ? 'bg-black text-white shadow-lg shadow-slate-200' 
                    : 'bg-white text-slate-500 hover:bg-slate-100'
                }`}
              >
                {tab.icon}
                {tab.name}
              </button>
            ))}
          </div>

          {/* Exam Grid */}
          <div className="flex-1">
            <div className="bg-white p-4 rounded-3xl border border-slate-200 mb-8 flex items-center">
              <Search className="text-slate-400 ml-4" />
              <input 
                type="text" 
                placeholder="Search for exam name (e.g. SSC, BSSC, UPSSSC)..." 
                className="w-full px-4 py-2 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filtered.map((exam) => (
                <div key={exam.id} className="bg-white border border-slate-100 rounded-3xl p-8 hover:border-sky-500 transition-all hover:shadow-xl group">
                  <div className="flex justify-between items-start mb-6">
                    <div className="bg-sky-50 p-3 rounded-2xl text-sky-600 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                      <ShieldCheck />
                    </div>
                    <span className="text-xs font-bold bg-slate-100 px-3 py-1 rounded-full text-slate-500 uppercase tracking-wider">
                      {exam.posts}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <ExamLogo examId={exam.id} examTitle={exam.title} size={32} />
                    <h3 className="text-2xl font-bold">{exam.title}</h3>
                  </div>
                  <p className="text-slate-500 mb-8">{exam.detail}</p>
                  <button 
                    onClick={() => {
                      const duration = exam.defaultDurationMin || 1;
                      navigate(`/typing-test?exam=${exam.id}&title=${encodeURIComponent(exam.title)}&duration=${duration}`);
                    }}
                    className="flex items-center gap-2 text-black font-bold group-hover:text-sky-600 transition-colors"
                  >
                    Start Exam Simulator <ArrowRight size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exams;
