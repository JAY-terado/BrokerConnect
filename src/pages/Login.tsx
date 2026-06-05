import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useBrokerConnect } from '../context/BrokerConnectContext';
import { Mail, Building2, ShieldCheck, ArrowRight, UserPlus, CheckCircle, Smartphone, KeyRound, ChevronLeft } from 'lucide-react';
import { PinCode } from 'rizzui/pin-code';

export const Login: React.FC = () => {
  const { setCurrentRole, setActiveScreen } = useBrokerConnect();
  const navigate = useNavigate();
  const location = useLocation();

  // Route state notifications (like registration success redirects)
  const redirectSuccess = location.state?.success as string || '';

  // Form States
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [otpStep, setOtpStep] = useState(false); // Toggle Step 1 vs Step 2
  const [pin, setPin] = useState('');
  const [pinKey, setPinKey] = useState(0);

  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(redirectSuccess);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (otpStep) {
      setTimeout(() => {
        const firstInput = document.querySelector('.rizzui-pin-code-root input') as HTMLInputElement;
        firstInput?.focus();
      }, 150);
    }
  }, [otpStep, pinKey]);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone) {
      setLoginError('Please enter your Email or Phone');
      return;
    }
    setLoginError('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setOtpStep(true);
      alert(`Simulation: SMS/Email OTP code '1234' sent to ${emailOrPhone}`);
    }, 600);
  };

  const handleLoginSubmit = (e?: React.FormEvent, codeOverride?: string) => {
    if (e) e.preventDefault();
    const finalCode = codeOverride || pin;
    if (!finalCode || finalCode.length < 4) {
      setLoginError('Please enter the 4-digit OTP code');
      return;
    }
    if (finalCode !== '1234') {
      setLoginError('Invalid OTP code. Please enter 1234 to verify.');
      return;
    }

    setLoading(true);
    setLoginError('');

    setTimeout(() => {
      setLoading(false);
      const userLower = emailOrPhone.toLowerCase();
      if (userLower.includes('admin')) {
        setCurrentRole('admin');
        setActiveScreen(14);
      } else if (userLower.includes('reception') || userLower.includes('desk')) {
        setCurrentRole('receptionist');
        setActiveScreen(6);
      } else if (userLower.includes('sales') || userLower.includes('exec')) {
        setCurrentRole('sales');
        setActiveScreen(9);
      } else {
        setCurrentRole('broker');
        setActiveScreen(2);
      }
      navigate('/dashboard');
    }, 800);
  };

  const handlePinChange = (val: string) => {
    setPin(val);
    if (val.length === 4) {
      if (val === '1234') {
        handleLoginSubmit(undefined, val);
      } else {
        setLoginError('Invalid OTP code. Please enter 1234 to verify.');
      }
    } else {
      setLoginError('');
    }
  };

  const handleBackToEmail = () => {
    setOtpStep(false);
    setPin('');
    setPinKey(prev => prev + 1);
    setLoginError('');
  };

  const triggerQuickShortcut = (value: string) => {
    setEmailOrPhone(value);
    setOtpStep(false);
    setPin('');
    setPinKey(prev => prev + 1);
    setLoginError('');
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 text-left font-sans">
      {/* Left side: Premium Branding (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-700 via-indigo-800 to-blue-900 text-white p-16 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-500 rounded-full blur-[100px] opacity-40"></div>

        <div className="relative z-10 flex items-center gap-2">
          <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-md border border-white/20">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">BrokerConnect</span>
        </div>

        <div className="relative z-10 space-y-6">
          <span className="px-3 py-1 bg-white/10 text-blue-100 text-xs font-semibold rounded-full border border-white/10 uppercase tracking-widest">
            Channel Partner Protection
          </span>
          <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight leading-[1.15] text-white">
            Lead Protection & Sales Management
          </h1>
          <p className="text-sm text-blue-100/90 max-w-md font-medium leading-relaxed">
            Eliminating channel partner disputes through instant OTP-based customer ownership locks and transparent audit trails.
          </p>
        </div>

        <div className="relative z-10 flex flex-col gap-3 border-t border-white/10 pt-8 text-xs font-semibold">
          <div className="flex items-center gap-3 text-blue-100">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Secure OTP-based lead locking inside 60 seconds</span>
          </div>
          <div className="flex items-center gap-3 text-blue-100">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Automated round-robin visitor allocation</span>
          </div>
          <p className="text-[10px] text-blue-300/80 mt-4 font-bold">
            © 2026 BrokerConnect Technologies. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right side: Forms Canvas */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-16">
        <div className="w-full max-w-[420px] space-y-8 animate-in fade-in zoom-in-95 duration-200">

          {/* Mobile Branding Logo */}
          <div className="flex lg:hidden items-center gap-2 mb-4">
            <div className="p-2 bg-blue-600 rounded-lg text-white">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold text-slate-900">BrokerConnect</span>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
                Welcome Back
              </h2>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                {otpStep ? 'Verify your identity' : 'Login to access your partner dashboard & leads'}
              </p>
            </div>

            {loginSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-xl text-xs font-bold flex items-center gap-2 animate-bounce">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{loginSuccess}</span>
              </div>
            )}

            {loginError && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold">
                {loginError}
              </div>
            )}

            {/* STEP 1: ENTER EMAIL OR PHONE */}
            {!otpStep ? (
              <form onSubmit={handleSendOtp} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider">
                    Email or Phone *
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4.5 h-4.5" />
                    </span>
                    <input
                      type="text"
                      placeholder="Enter registered email or phone number"
                      value={emailOrPhone}
                      onChange={(e) => setEmailOrPhone(e.target.value)}
                      className="block w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-800 font-semibold shadow-sm"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Remember Me</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-450 text-white rounded-xl font-bold text-xs transition-all shadow-md shadow-blue-500/10 cursor-pointer"
                >
                  {loading ? (
                    <div className="w-4.5 h-4.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Send OTP Code</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* STEP 2: VERIFY OTP CODE */
              <form onSubmit={(e) => handleLoginSubmit(e)} className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-200">
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider">
                      OTP Security PIN *
                    </label>
                    <button
                      type="button"
                      onClick={handleBackToEmail}
                      className="flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:underline transition"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Change Email/Phone</span>
                    </button>
                  </div>

                  {/* RizzUI PinCode Component */}
                  <div className="py-2.5">
                    <PinCode
                      key={pinKey}
                      length={4}
                      setValue={handlePinChange as any}
                      size="lg"
                      placeholder="o"
                      center={true}
                      inputClassName="!w-14 !h-14 text-center text-xl font-extrabold !bg-slate-50 !border !border-slate-200 !rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:bg-white text-slate-800 transition-all duration-150 !shadow-sm !mr-2 placeholder:!text-slate-300 placeholder:!font-normal"
                    />
                  </div>
                </div>

                <div className="text-xs text-slate-400 font-semibold">
                  OTP simulated sent to <strong className="text-slate-700">{emailOrPhone}</strong>. Key in <strong className="text-blue-600">1234</strong> to login.
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-450 text-white rounded-xl font-bold text-xs transition-all shadow-md shadow-blue-500/10 cursor-pointer"
                >
                  {loading ? (
                    <div className="w-4.5 h-4.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Verify &amp; Login</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Redirection to register */}
            <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-xs font-semibold text-slate-500">
              <span>New channel partner?</span>
              <Link
                to="/register"
                className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 transition font-bold"
              >
                <UserPlus className="w-4 h-4" />
                <span>Register as Broker</span>
              </Link>
            </div>

            {/* Quick Role Selection Panel for Simulator */}
            <div className="mt-8 pt-6 border-t border-slate-100 space-y-3">
              <span className="text-[10px] font-bold text-slate-400 block text-center uppercase tracking-wider">
                Quick Role Login Shortcuts
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs font-medium">
                <button
                  onClick={() => triggerQuickShortcut('98765 43210')}
                  className="py-2.5 px-3 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 border border-slate-200 rounded-xl text-slate-700 text-center transition cursor-pointer font-bold"
                >
                  Broker (Amit Patel)
                </button>
                <button
                  onClick={() => triggerQuickShortcut('reception')}
                  className="py-2.5 px-3 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 border border-slate-200 rounded-xl text-slate-700 text-center transition cursor-pointer font-bold"
                >
                  Receptionist Portal
                </button>
                <button
                  onClick={() => triggerQuickShortcut('sales')}
                  className="py-2.5 px-3 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 border border-slate-200 rounded-xl text-slate-700 text-center transition cursor-pointer font-bold"
                >
                  Sales CRM View
                </button>
                <button
                  onClick={() => triggerQuickShortcut('admin')}
                  className="py-2.5 px-3 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 border border-slate-200 rounded-xl text-slate-700 text-center transition cursor-pointer font-bold"
                >
                  Admin Panel (Disputes)
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
