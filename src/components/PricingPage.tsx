import React from 'react';

// Using simple SVG icons to avoid dependency issues if lucide-react is not available
const CheckIcon = () => (
  <svg className="flex-shrink-0 w-5 h-5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const StarIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const ZapIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const CheckBadgeIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

interface PricingPageProps {
  onUpgrade: (plan: string) => void;
  onBack: () => void;
  showBack?: boolean;
}

const PricingPage: React.FC<PricingPageProps> = ({ onUpgrade, onBack, showBack = true }) => {
  const plans = [
    {
      name: 'Monthly',
      price: '₹99',
      period: 'per month',
      features: ['Unlimited Practice', 'All 15+ Lessons', 'All 6 Games', 'Detailed Analytics', 'Achievement Badges'],
      buttonText: 'Get Started',
      popular: false,
      valuable: false,
    },
    {
      name: 'Quarterly',
      price: '₹299',
      period: 'for 3 months',
      features: ['Everything in Monthly', 'Save 15%', 'Priority Support'],
      buttonText: 'Get Started',
      popular: false,
      valuable: false,
    },
    {
      name: 'Semi-Annual',
      price: '₹499',
      period: 'for 6 months',
      features: ['Everything in Quarterly', 'Save 30%', 'Expert Tips'],
      buttonText: 'Most Valuable',
      popular: false,
      valuable: true,
      tag: 'Most Valuable'
    },
    {
      name: 'Annual',
      price: '₹999',
      period: 'for 12 months',
      features: ['Everything in Semi-Annual', 'Save 50%', 'Lifetime Stats Access'],
      buttonText: 'Most Popular',
      popular: true,
      valuable: false,
      tag: 'Most Popular'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Upgrade to TypeMaster Pro
          </h2>
          <p className="mt-4 text-xl text-slate-600">
            You've used your 3 free tries. Unlock unlimited access to all features.
          </p>
          {showBack && (
            <button 
              onClick={onBack}
              className="mt-4 text-indigo-600 hover:text-indigo-500 font-medium"
            >
              ← Back to Home
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col p-8 bg-white border rounded-2xl shadow-sm transition-all duration-200 hover:shadow-lg ${
                plan.popular ? 'border-indigo-500 ring-2 ring-indigo-500' : 
                plan.valuable ? 'border-emerald-500 ring-2 ring-emerald-500' : 'border-slate-200'
              }`}
            >
              {plan.tag && (
                <div className={`absolute top-0 right-6 transform -translate-y-1/2 px-3 py-1 text-xs font-bold tracking-wider text-white uppercase rounded-full ${
                  plan.popular ? 'bg-indigo-500' : 'bg-emerald-500'
                }`}>
                  {plan.tag}
                </div>
              )}
              
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-slate-900">{plan.name}</h3>
                <p className="mt-4 flex items-baseline text-slate-900">
                  <span className="text-4xl font-extrabold tracking-tight">{plan.price}</span>
                  <span className="ml-1 text-xl font-semibold">{plan.period}</span>
                </p>
                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <CheckIcon />
                      <span className="ml-3 text-slate-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => onUpgrade(plan.name)}
                className={`mt-8 w-full py-3 px-6 rounded-xl font-bold text-center transition-colors ${
                  plan.popular ? 'bg-indigo-600 text-white hover:bg-indigo-700' :
                  plan.valuable ? 'bg-emerald-600 text-white hover:bg-emerald-700' :
                  'bg-slate-100 text-slate-900 hover:bg-slate-200'
                }`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8">Why go Pro?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full mb-4">
                <StarIcon />
              </div>
              <h4 className="font-bold mb-2">Exclusive Content</h4>
              <p className="text-slate-600 text-sm">Access specialized lessons and elite practice sets designed by pros.</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full mb-4">
                <ZapIcon />
              </div>
              <h4 className="font-bold mb-2">No Limitations</h4>
              <p className="text-slate-600 text-sm">Type as much as you want, anytime. No more "tries remaining".</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 text-amber-600 rounded-full mb-4">
                <CheckBadgeIcon />
              </div>
              <h4 className="font-bold mb-2">Full Statistics</h4>
              <p className="text-slate-600 text-sm">Unlock heatmap, finger analysis, and historical progress charts.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
