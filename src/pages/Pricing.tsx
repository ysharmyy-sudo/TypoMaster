import { useState } from 'react';
import { Check, ShieldCheck, Loader2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { apiCreateOrder, apiVerifyPayment } from '../services/api';

// Extend window to include Razorpay script type
declare global {
  interface Window {
    Razorpay: any;
  }
}

// Dynamically load the Razorpay checkout script
const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Pricing = () => {
  const { setPremium, user } = useAppContext();
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState('');

  const handleUpgrade = async (plan: 'pro' | 'lifetime') => {
    setPaymentError('');

    // Must be logged in to pay
    if (!user) {
      navigate('/login');
      return;
    }

    setLoadingPlan(plan);

    try {
      // 1. Load Razorpay SDK
      const sdkLoaded = await loadRazorpayScript();
      if (!sdkLoaded) {
        setPaymentError('Could not load payment gateway. Check your network.');
        setLoadingPlan(null);
        return;
      }

      // 2. Create order on backend
      const { orderId, amount, currency } = await apiCreateOrder(plan);

      // 3. Open Razorpay checkout modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Public key only — safe for frontend
        amount,
        currency,
        name: 'Pariksha Typing Tutor',
        description: plan === 'pro' ? 'Pro Aspirant Plan - ₹299/month' : 'Lifetime Master Plan - ₹999',
        order_id: orderId,
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: { color: '#0ea5e9' },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            // 4. Verify payment on backend
            await apiVerifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              plan,
            });

            // 5. Update local state
            setPremium(true);
            alert(`🎉 Payment successful! You now have ${plan === 'pro' ? 'Pro' : 'Lifetime'} access.`);
            navigate('/');
          } catch {
            setPaymentError('Payment was received but verification failed. Please contact support.');
          }
        },
        modal: {
          ondismiss: () => setLoadingPlan(null),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response: any) => {
        setPaymentError(`Payment failed: ${response.error.description}`);
        setLoadingPlan(null);
      });
      rzp.open();
    } catch (err: any) {
      setPaymentError(err.message || 'Payment setup failed. Try again.');
      setLoadingPlan(null);
    }
  };

  const plans = [
    {
      name: 'Free Starter',
      price: '₹0',
      plan: null,
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
      plan: 'pro' as const,
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
      plan: 'lifetime' as const,
      features: [
        'Everything in Pro Plan',
        'Priority Support',
        'Hindi & English Typing',
        'Ad-free Experience',
        'Mock Exam Series',
      ],
      cta: 'Get Lifetime Access',
      highlight: false,
    },
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

        {paymentError && (
          <div className="max-w-xl mx-auto mb-8 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl text-sm font-medium text-center">
            {paymentError}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`rounded-3xl p-10 border-2 transition-all group ${
                plan.highlight
                  ? 'border-sky-500 shadow-2xl shadow-sky-100 scale-105 relative z-10 bg-white'
                  : 'border-slate-100 bg-slate-50 hover:border-sky-200'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-sky-500 text-black px-4 py-1 rounded-full text-xs font-bold uppercase">
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.period && <span className="text-slate-500 font-medium">{plan.period}</span>}
              </div>

              <ul className="space-y-4 mb-10">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <div className="bg-sky-100 rounded-full p-1 mt-0.5">
                      <Check size={14} className="text-sky-600" />
                    </div>
                    <span className="text-slate-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                disabled={!plan.plan || loadingPlan !== null}
                onClick={() => plan.plan && handleUpgrade(plan.plan)}
                className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                  plan.highlight
                    ? 'bg-sky-500 text-black hover:bg-sky-400 disabled:opacity-60'
                    : plan.price === '₹0'
                    ? 'bg-slate-200 text-slate-500 cursor-default'
                    : 'bg-black text-white hover:bg-slate-800 disabled:opacity-60'
                } disabled:cursor-not-allowed`}
              >
                {loadingPlan === plan.plan ? (
                  <><Loader2 size={18} className="animate-spin" /> Processing...</>
                ) : (
                  plan.cta
                )}
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
          <button
            onClick={() => handleUpgrade('pro')}
            className="bg-white text-black px-10 py-5 rounded-2xl font-bold text-lg hover:bg-sky-400 transition-all"
          >
            Secure Enrollment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
