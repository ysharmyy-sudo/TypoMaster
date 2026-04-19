import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageSkeleton } from '../components/SkeletonLoader';
import { Search, MapPin, Building2, Landmark, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

const Exams = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Central');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <PageSkeleton />;

  const examsData: Record<string, any[]> = {
    'Central': [
      { id: 'ssc-cgl', title: 'SSC CGL', detail: 'Skill Test for Tax Assistant & Auditor', posts: '7,500+ Posts' },
      { id: 'ssc-chsl', title: 'SSC CHSL', detail: 'Data Entry Operator & LDC', posts: '4,500+ Posts' },
      { id: 'stenographer', title: 'Stenographer', detail: 'Grade C & D Skill Test', posts: '1,200+ Posts' },
      { id: 'rrb-ntpc', title: 'RRB NTPC', detail: 'Railway Clerical Typing Test', posts: '35,000+ Posts' },
    ],
    'National': [
      { id: 'ibps-po', title: 'IBPS PO', detail: 'Descriptive Writing & Documentation', posts: '6,400+ Posts' },
      { id: 'sbi-clerk', title: 'SBI Clerk', detail: 'Junior Associate Mains Typing', posts: '8,000+ Posts' },
      { id: 'rbi-asst', title: 'RBI Assistant', detail: 'Language Proficiency & Typing', posts: '950+ Posts' },
      { id: 'lic-aao', title: 'LIC AAO', detail: 'Administrative Assistant Test', posts: '300+ Posts' },
    ],
    'Statewise': [
      { id: 'upsssc', title: 'UPSSSC VDO', detail: 'Junior Assistant Typing (Hindi/Eng)', posts: '1,262 Posts' },
      { id: 'bssc', title: 'Bihar SSC', detail: 'Inter Level Typing Test', posts: '11,000+ Posts' },
      { id: 'mpsc', title: 'Maharashtra PSC', detail: 'Typing Certificate Exam', posts: '5,000+ Posts' },
      { id: 'hssc', title: 'Haryana SSC', detail: 'Clerk & DEO Typing Test', posts: '3,000+ Posts' },
    ]
  };

  const tabs = [
    { name: 'Central', icon: <Building2 size={18} /> },
    { name: 'National', icon: <Landmark size={18} /> },
    { name: 'Statewise', icon: <MapPin size={18} /> },
  ];

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
              { id: 'ssc-chsl', title: 'CHSL Mock #42', time: '10 min', level: 'Easy' },
              { id: 'ssc-cgl', title: 'CGL Main Simulator', time: '15 min', level: 'Hard' },
              { id: 'ibps-po', title: 'IBPS PO Mains', time: '30 min', level: 'Medium' },
              { id: 'stenographer', title: 'Steno Grade C', time: '10 min', level: 'Medium' },
            ].map((test, i) => (
              <div key={i} className="bg-white border border-slate-200 p-4 rounded-2xl flex justify-between items-center group hover:border-sky-500 transition-all cursor-pointer" onClick={() => navigate(`/typing-test?exam=${test.id}&title=${encodeURIComponent(test.title)}`)}>
                <div>
                  <p className="font-bold text-sm">{test.title}</p>
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
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {examsData[activeTab].map((exam) => (
                <div key={exam.id} className="bg-white border border-slate-100 rounded-3xl p-8 hover:border-sky-500 transition-all hover:shadow-xl group">
                  <div className="flex justify-between items-start mb-6">
                    <div className="bg-sky-50 p-3 rounded-2xl text-sky-600 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                      <ShieldCheck />
                    </div>
                    <span className="text-xs font-bold bg-slate-100 px-3 py-1 rounded-full text-slate-500 uppercase tracking-wider">
                      {exam.posts}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{exam.title}</h3>
                  <p className="text-slate-500 mb-8">{exam.detail}</p>
                  <button 
                    onClick={() => navigate(`/typing-test?exam=${exam.id}&title=${encodeURIComponent(exam.title)}`)}
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
