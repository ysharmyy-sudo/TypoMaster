import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import TypingTest from './pages/TypingTest';
import Exams from './pages/Exams';
import Tests from './pages/Tests';
import Games from './pages/Games';
import Pricing from './pages/Pricing';

const Footer = () => (
  <footer className="bg-black text-white py-12 px-8">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
      <div className="space-y-4">
        <h3 className="text-xl font-bold uppercase tracking-tighter">Pariksha<span className="text-sky-400">Typing Tutor</span></h3>
        <p className="text-slate-400 text-sm">Empowering Indian aspirants with the world's most advanced typing training platform.</p>
      </div>
      <div>
        <h4 className="font-bold mb-4">Quick Links</h4>
        <ul className="text-slate-400 space-y-2 text-sm">
          <li className="hover:text-sky-400 cursor-pointer transition-colors">Central Exams</li>
          <li className="hover:text-sky-400 cursor-pointer transition-colors">National Exams</li>
          <li className="hover:text-sky-400 cursor-pointer transition-colors">State Exams</li>
          <li className="hover:text-sky-400 cursor-pointer transition-colors">Typing Speed Test</li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold mb-4">Support</h4>
        <ul className="text-slate-400 space-y-2 text-sm">
          <li className="hover:text-sky-400 cursor-pointer transition-colors">Pricing Plans</li>
          <li className="hover:text-sky-400 cursor-pointer transition-colors">Help Center</li>
          <li className="hover:text-sky-400 cursor-pointer transition-colors">Terms of Service</li>
          <li className="hover:text-sky-400 cursor-pointer transition-colors">Privacy Policy</li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold mb-4">Stay Connected</h4>
        <div className="flex space-x-4 mb-4">
          <div className="w-8 h-8 bg-slate-800 rounded-lg"></div>
          <div className="w-8 h-8 bg-slate-800 rounded-lg"></div>
          <div className="w-8 h-8 bg-slate-800 rounded-lg"></div>
        </div>
        <p className="text-slate-400 text-sm">© 2026 Pariksha Typing Tutor. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const MainContent = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/tests" element={<Tests />} />
          <Route path="/typing-test" element={<TypingTest />} />
          <Route path="/exams" element={<Exams />} />
          <Route path="/games" element={<Games />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <Router>
        <ScrollToTop />
        <MainContent />
      </Router>
    </AppProvider>
  );
}

export default App;
