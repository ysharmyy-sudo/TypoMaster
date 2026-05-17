import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Zap, Target, BarChart3, Clock, ShieldCheck, Gamepad2 } from 'lucide-react';
import { PageSkeleton } from '../components/SkeletonLoader';
import { motion } from 'framer-motion';

const Home = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <PageSkeleton />;

  const examCategories = [
    { title: 'Central Exams', exams: ['SSC CGL', 'CHSL', 'Stenographer', 'RRB NTPC'], icon: <ShieldCheck className="text-sky-600" /> },
    { title: 'National Exams', exams: ['UPSC', 'IBPS PO', 'SBI Clerk', 'RBI Grade B'], icon: <Target className="text-sky-600" /> },
    { title: 'State Exams', exams: ['UPSSSC', 'BSSC', 'MPPSC', 'MPSC Typing'], icon: <BarChart3 className="text-sky-600" /> }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-black text-white py-20 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 space-y-6">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-bold leading-tight"
            >
              Pariksha <span className="text-sky-400">Typing Tutor.</span>
            </motion.h1>
            <p className="text-slate-400 text-xl max-w-lg">
              The only platform designed specifically for SSC, Bank, and State Government typing tests. Accurate simulation, real-time analytics.
            </p>
            <div className="flex space-x-4 pt-4">
              <button 
                onClick={() => navigate('/tests')}
                className="bg-sky-500 text-black px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-2 hover:bg-sky-400 transition-all transform hover:scale-105"
              >
                Start Practice <ArrowRight size={20} />
              </button>
              <button 
                onClick={() => navigate('/pricing')}
                className="border-2 border-slate-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-colors"
              >
                View Plans
              </button>
            </div>
          </div>
          <div className="md:w-1/2 mt-12 md:mt-0 relative">
            <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl shadow-2xl">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="space-y-4 font-mono text-sky-300">
                <p># Central Government Exam Protocol</p>
                <p className="text-white">The quick brown fox jumps over the lazy dog...</p>
                <div className="flex gap-4 pt-4">
                  <div className="bg-slate-800 p-3 rounded-lg flex-1">
                    <p className="text-xs text-slate-500">WPM</p>
                    <p className="text-2xl font-bold text-sky-400">45</p>
                  </div>
                  <div className="bg-slate-800 p-3 rounded-lg flex-1">
                    <p className="text-xs text-slate-500">Accuracy</p>
                    <p className="text-2xl font-bold text-sky-400">98%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats / Dashboard Overview */}
      <section className="py-12 px-8 -mt-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Avg Speed', value: '32 WPM', color: 'bg-white' },
            { label: 'Highest', value: '54 WPM', color: 'bg-white' },
            { label: 'Accuracy', value: '96.4%', color: 'bg-white' },
            { label: 'Rank', value: '#1,204', color: 'bg-white' },
          ].map((stat, i) => (
            <div key={i} className={`${stat.color} border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow`}>
              <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
              <p className="text-3xl font-bold text-black mt-1">{stat.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Exam Sections */}
      <section className="py-20 px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Exam Specific Preparation</h2>
          <p className="text-slate-600">Choose your target exam and start practicing with exact layout and character limits.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {examCategories.map((cat, i) => (
            <div key={i} className="bg-slate-50 border border-slate-200 p-8 rounded-3xl hover:border-sky-500 transition-colors group">
              <div className="bg-sky-100 w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                {cat.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4">{cat.title}</h3>
              <ul className="space-y-3 mb-8">
                {cat.exams.map((exam, j) => (
                  <li key={j} className="flex items-center text-slate-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-sky-500 mr-3"></div>
                    {exam}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => navigate('/exams')}
                className="w-full py-3 border-2 border-black rounded-xl font-bold hover:bg-black hover:text-white transition-all"
              >
                Select Exam
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-50 py-20 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-bold">Why Pariksha Typing Tutor is the <br/><span className="text-sky-600">Gold Standard?</span></h2>
            <div className="space-y-6">
              {[
                { title: 'Exact Exam Layouts', desc: 'Simulate the exact UI of SSC and IBPS interfaces.', icon: <ShieldCheck className="text-sky-500" /> },
                { title: 'Interactive Games', desc: 'Fun ways to build muscle memory without the stress.', icon: <Gamepad2 className="text-sky-500" /> },
                { title: 'Daily Challenges', desc: 'Compete with 10,000+ aspirants across India.', icon: <Zap className="text-sky-500" /> }
              ].map((f, i) => (
                <div key={i} className="flex gap-4">
                  <div className="mt-1">{f.icon}</div>
                  <div>
                    <h4 className="font-bold text-lg">{f.title}</h4>
                    <p className="text-slate-600">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm mt-8">
              <Clock className="text-sky-500 mb-2" />
              <p className="font-bold">Real-time Feedback</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <Target className="text-sky-500 mb-2" />
              <p className="font-bold">Focus Mode</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <BarChart3 className="text-sky-500 mb-2" />
              <p className="font-bold">Detailed Analytics</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm -mt-8">
              <Gamepad2 className="text-sky-500 mb-2" />
              <p className="font-bold">Pro Games</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
