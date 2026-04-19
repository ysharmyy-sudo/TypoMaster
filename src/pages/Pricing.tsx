import { Check, ShieldCheck } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const Pricing = () => {
  const { setPremium } = useAppContext();
  const navigate = useNavigate();

  const handleUpgrade = () => {
    setPremium(true);
    alert('Thank you for upgrading! You now have unlimited access.');
    navigate('/');
  };

  const plans = [
    {
      name: 'Free Starter',
      price: '₹0',
      features: [
        '3 Free Typing Trials',
        'Basic Performance Stats',
        'Beginner Level Games',
        'Community Support',
      ],
      cta: 'Free Forever',
      highlight: false,
    },
    {
      name: 'Pro Aspirant',
      price: '₹299',
      period: '/month',
      features: [
        'Unlimited Typing Practice',
        'All Game Levels Unlocked',
        'SSC & Bank Exam Interface',
        'Detailed Error Analytics',
        'PDF Performance Reports',
      ],
      cta: 'Upgrade to Pro',
      highlight: true,
    },
    {
      name: 'Lifetime Master',
      price: '₹999',
      period: 'one-time',
      features: [
        'Everything in Pro Plan',
        'Priority Support',
        'Hindi & English Typing',
        'Ad-free Experience',
        'Mock Exam Series',
      ],
      cta: 'Get Lifetime Access',
      highlight: false,
    }
  ];

  return (
    <div className="min-h-screen bg-white py-20 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">Choose Your <span className="text-sky-600">Growth Path</span></h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Invest in your career. Thousands of successful candidates used Pariksha Typing Tutor to clear their skill tests with flying colors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <div 
              key={i} 
              className={`rounded-3xl p-10 border-2 transition-all cursor-pointer group hover:scale-[1.03] duration-300 ${
                plan.highlight 
                  ? 'border-sky-500 shadow-2xl shadow-sky-100 scale-105 relative z-10 bg-white' 
                  : 'border-slate-100 bg-slate-50 hover:border-sky-200'
              }`}
              onClick={() => plan.price !== '₹0' && handleUpgrade()}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-sky-500 text-black px-4 py-1 rounded-full text-xs font-bold uppercase">
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl font-bold mb-2 group-hover:text-sky-600 transition-colors">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.period && <span className="text-slate-500 font-medium">{plan.period}</span>}
              </div>

              <ul className="space-y-4 mb-10">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <div className="bg-sky-100 group-hover:bg-sky-200 rounded-full p-1 mt-0.5 transition-colors">
                      <Check size={14} className="text-sky-600" />
                    </div>
                    <span className="text-slate-600 group-hover:text-slate-900 transition-colors">{feature}</span>
                  </li>
                ))}
              </ul>

              <button 
                className={`w-full py-4 rounded-xl font-bold transition-all ${
                  plan.highlight 
                    ? 'bg-sky-500 text-black group-hover:bg-sky-400' 
                    : plan.price === '₹0' 
                      ? 'bg-slate-200 text-slate-500'
                      : 'bg-black text-white group-hover:bg-slate-800'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-20 bg-black rounded-[3rem] p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="bg-sky-500 p-4 rounded-3xl">
              <ShieldCheck size={40} className="text-black" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">100% Satisfaction Guarantee</h2>
              <p className="text-slate-400 mt-2">If you don't improve your speed within 30 days, we'll refund your money. No questions asked.</p>
            </div>
          </div>
          <button className="bg-white text-black px-10 py-5 rounded-2xl font-bold text-lg hover:bg-sky-400 transition-all">
            Secure Enrollment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
