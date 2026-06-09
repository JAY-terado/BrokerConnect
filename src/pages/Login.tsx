import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useBrokerConnect } from '../context/BrokerConnectContext';
import { Mail, Building2, ShieldCheck, ArrowRight, UserPlus, CheckCircle, Smartphone, KeyRound, ChevronLeft, Users, BarChart3 } from 'lucide-react';
import { PinCode } from 'rizzui/pin-code';
import Cookies from 'js-cookie';
import { requestLoginOtp, verifyLoginOtp } from './api/login';

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

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone) {
      setLoginError('Please enter your Email or Phone');
      return;
    }
    setLoginError('');
    setLoading(true);

    try {
      const res = await requestLoginOtp(emailOrPhone);
      if (res.success) {
        setOtpStep(true);
        setLoginSuccess(res.message || 'OTP sent successfully');
      } else {
        setLoginError(res.message || 'Failed to send OTP. Please check your credentials.');
      }
    } catch (err: any) {
      setLoginError(err.message || 'An error occurred while sending OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e?: React.FormEvent, codeOverride?: string) => {
    if (e) e.preventDefault();
    const finalCode = codeOverride || pin;
    if (!finalCode || finalCode.length < 6) {
      setLoginError('Please enter the 6-digit OTP code');
      return;
    }

    setLoading(true);
    setLoginError('');

    try {
      const res = await verifyLoginOtp(emailOrPhone, Number(finalCode));
      if (res.success) {
        // Set the token cookie from backend if provided, fallback to mock token
        const userToken = res.token || 'mock-jwt-token-xyz';
        Cookies.set('token', userToken, { expires: 1 });
        Cookies.set('is_profile_completed', '1', { expires: 1 });

        // Store user's full name in a cookie if present
        if (res.user?.full_name) {
          Cookies.set('full_name', res.user.full_name, { expires: 1 });
        } else {
          Cookies.set('full_name', 'Amit Patel', { expires: 1 });
        }

        // Set the user role context and cookie based on the backend role response
        // Default roles map: "BROKER" -> "broker", "RECEPTIONIST" -> "receptionist", "SALES" -> "sales", "ADMIN" -> "admin"
        const backendRole = res.user?.role?.toLowerCase() || 'broker';
        
        let assignedRole: 'broker' | 'receptionist' | 'sales' | 'admin' = 'broker';
        if (backendRole.includes('admin')) assignedRole = 'admin';
        else if (backendRole.includes('receptionist') || backendRole.includes('reception')) assignedRole = 'receptionist';
        else if (backendRole.includes('sales')) assignedRole = 'sales';

        Cookies.set('userRole', assignedRole, { expires: 1 });
        setCurrentRole(assignedRole);
        
        // Redirect to their respective dashboards
        if (assignedRole === 'admin') navigate('/admin');
        else if (assignedRole === 'receptionist') navigate('/receptionist');
        else if (assignedRole === 'sales') navigate('/sales');
        else navigate('/broker');
      } else {
        setLoginError(res.message || 'Invalid OTP code.');
      }
    } catch (err: any) {
      setLoginError(err.message || 'An error occurred during verification.');
    } finally {
      setLoading(false);
    }
  };

  const handlePinChange = (val: string) => {
    setPin(val);
    if (val.length === 6) {
      handleLoginSubmit(undefined, val);
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
    <div className="flex min-h-screen flex-col lg:flex-row bg-[#F8FAFC] text-slate-800 text-left font-sans">
      {/* Mobile Branding Header */}
      <div className="flex lg:hidden w-full bg-[#0d284a] py-4 px-6 items-center justify-center border-b border-blue-950/80 shadow-md">
        <img 
          src="/logo.png" 
          alt="Logo" 
          className="h-8.5 w-auto object-contain" 
        />
      </div>

      {/* Left side: Premium Branding (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0A1628] text-white p-16 flex-col justify-between relative overflow-hidden border-r border-blue-950/40">
        {/* Background noise texture + grid overlay patterns */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzlIj48cGF0aCBkPSJNIDYwIDAgTCAwIDAgMCA2MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] z-0"></div>
        <div className="absolute top-0 right-0 w-[480px] h-[480px] bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 z-0 anim-orb"></div>
        <div className="absolute bottom-0 left-0 w-[280px] h-[280px] bg-sky-500/8 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4 z-0 anim-orb-slow"></div>
        <div className="absolute top-1/2 left-1/4 w-[200px] h-[200px] bg-blue-400/5 rounded-full blur-2xl z-0 anim-orb" style={{animationDelay:'4s'}}></div>
 
        <div className="relative z-20 self-start hover:opacity-90 transition-opacity anim-fade-in">
          <img 
            src="/logo.png" 
            alt="Logo" 
            className="h-8.5 w-auto object-contain" 
          />
        </div>
 
        {/* Branding text directly on background */}
        <div className="relative z-10 space-y-6 flex flex-col">
          <span className="self-start px-3.5 py-1.5 bg-white/8 text-sky-300 border border-white/10 backdrop-blur-sm text-[10px] font-extrabold rounded-full uppercase tracking-widest anim-fade-up stagger-1">
            Channel Partner Protection
          </span>
          <div className="space-y-4">
            <h1 className="text-3xl xl:text-4xl font-black tracking-tight leading-[1.2] bg-gradient-to-br from-white via-white to-blue-200 bg-clip-text text-transparent anim-fade-up stagger-2">
              Lead Protection &amp; Sales Management
            </h1>
            <div className="w-16 h-[2px] bg-gradient-to-r from-sky-400 to-blue-600 anim-fade-up stagger-3"></div>
          </div>
          <p className="text-xs text-blue-200/90 font-semibold leading-relaxed anim-fade-up stagger-4">
            Eliminating channel partner disputes through instant OTP-based customer ownership locks and transparent audit trails.
          </p>
        </div>
 
        {/* Features list below the card */}
        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex items-center gap-4 text-xs font-semibold text-blue-250 anim-fade-up stagger-5">
            <div className="w-12 h-12 rounded-2xl bg-white/6 border border-white/10 flex items-center justify-center text-sky-400 shrink-0 shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <span className="text-sm font-bold text-white block">Secure OTP-based lead locking</span>
              <span className="text-[10px] text-blue-300/70 font-semibold block">Locks active for 60 seconds</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold text-blue-250 anim-fade-up stagger-6">
            <div className="w-12 h-12 rounded-2xl bg-white/6 border border-white/10 flex items-center justify-center text-sky-400 shrink-0 shadow-xs">
              <Users className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <span className="text-sm font-bold text-white block">Automated round-robin allocation</span>
              <span className="text-[10px] text-blue-300/70 font-semibold block">Fair &amp; intelligent lead distribution</span>
            </div>
          </div>
          <p className="text-[10px] text-blue-400/80 mt-4 font-bold tracking-wide">
            © 2026 BrokerConnect Technologies. All rights reserved.
          </p>
        </div>
      </div>
 
      {/* Right side: Forms Canvas */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-16 bg-[#F8FAFC]">
        <div className="w-full max-w-[460px] bg-white border border-slate-100 shadow-[0_4px_32px_rgba(15,23,42,0.08)] rounded-3xl p-8 sm:p-10 space-y-8 anim-scale-in">
 
          <div className="space-y-6">
            <div className="space-y-2 anim-fade-up stagger-1">
              <h2 className="text-3xl font-black tracking-tight text-[#0F172A] font-['Plus_Jakarta_Sans']">
                Welcome Back
              </h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block anim-fade-up stagger-2">
                {otpStep ? 'Verify your identity' : 'Login to access your partner dashboard & leads'}
              </p>
            </div>
 
            {loginSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-xl text-xs font-bold flex items-center gap-2 anim-fade-up">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{loginSuccess}</span>
              </div>
            )}
 
            {loginError && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold anim-slide-right">
                {loginError}
              </div>
            )}
 
            {/* STEP 1: ENTER EMAIL OR PHONE */}
            {!otpStep ? (
              <form onSubmit={handleSendOtp} className="space-y-5 anim-slide-left">
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
                      className="block w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:shadow-[0_0_0_4px_rgba(26,86,219,0.08)] text-slate-800 font-semibold shadow-xs transition-all duration-200"
                      required
                    />
                  </div>
                </div>
 
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer"
                      />
                    </div>
                    <span>Remember Me</span>
                  </label>
                </div>
 
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center gap-2 py-3.5 bg-[#1A56DB] hover:bg-[#1648C0] disabled:bg-blue-300 text-white rounded-xl font-bold text-sm transition-all shadow-[0_4px_14px_rgba(26,86,219,0.35)] hover:shadow-[0_6px_20px_rgba(26,86,219,0.45)] cursor-pointer pulse-glow press"
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
              <form onSubmit={(e) => handleLoginSubmit(e)} className="space-y-5 anim-slide-right">
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
                      length={6}
                      setValue={handlePinChange as any}
                      size="lg"
                      placeholder="o"
                      center={true}
                      inputClassName="!w-10 !h-10 text-center text-lg font-extrabold !bg-white !border !border-slate-200 !rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white text-slate-800 transition-all duration-200 !shadow-sm !mr-1 placeholder:!text-slate-300 placeholder:!font-normal"
                    />
                  </div>
                </div>
 
                <div className="text-xs text-slate-400 font-semibold">
                  OTP simulated sent to <strong className="text-slate-700">{emailOrPhone}</strong>. Key in <strong className="text-blue-600">123456</strong> to login.
                </div>
 
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center gap-2 py-3.5 bg-[#1A56DB] hover:bg-[#1648C0] disabled:bg-blue-300 text-white rounded-xl font-bold text-sm transition-all shadow-[0_4px_14px_rgba(26,86,219,0.35)] hover:shadow-[0_6px_20px_rgba(26,86,219,0.45)] cursor-pointer pulse-glow press"
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
            <div className="pt-4 border-t border-slate-100/80 flex justify-between items-center text-xs font-semibold text-slate-500">
              <span>New channel partner?</span>
              <Link
                to="/register"
                className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 transition font-bold"
              >
                <UserPlus className="w-4 h-4" />
                <span>Register as Broker</span>
              </Link>
            </div>
 
            {/* Quick Access Grid Panel */}
            <div className="mt-8 pt-6 border-t border-slate-100/80 space-y-3">
              <span className="text-[10px] font-bold text-slate-400 block text-center uppercase tracking-widest">
                Quick Access
              </span>
              <div className="grid grid-cols-2 gap-3 text-xs font-medium">
                <button
                  onClick={() => triggerQuickShortcut('98765 43210')}
                  className="flex items-center gap-3 p-3 bg-white hover:bg-slate-50 hover:border-blue-200 border border-slate-150 rounded-xl text-left transition-all duration-200 cursor-pointer shadow-xs hover:shadow-sm anim-fade-up stagger-1 press"
                >
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-slate-800 block">Broker</span>
                    <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">(Amit Patel)</span>
                  </div>
                </button>
                <button
                  onClick={() => triggerQuickShortcut('reception')}
                  className="flex items-center gap-3 p-3 bg-white hover:bg-slate-50 hover:border-blue-200 border border-slate-150 rounded-xl text-left transition-all duration-200 cursor-pointer shadow-xs hover:shadow-sm anim-fade-up stagger-2 press"
                >
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-slate-800 block">Receptionist</span>
                    <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">Portal</span>
                  </div>
                </button>
                <button
                  onClick={() => triggerQuickShortcut('sales')}
                  className="flex items-center gap-3 p-3 bg-white hover:bg-slate-50 hover:border-blue-200 border border-slate-150 rounded-xl text-left transition-all duration-200 cursor-pointer shadow-xs hover:shadow-sm anim-fade-up stagger-3 press"
                >
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-slate-800 block">Sales CRM</span>
                    <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">View</span>
                  </div>
                </button>
                <button
                  onClick={() => triggerQuickShortcut('admin')}
                  className="flex items-center gap-3 p-3 bg-white hover:bg-slate-50 hover:border-blue-200 border border-slate-150 rounded-xl text-left transition-all duration-200 cursor-pointer shadow-xs hover:shadow-sm anim-fade-up stagger-4 press"
                >
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-slate-800 block">Admin Panel</span>
                    <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">(Disputes)</span>
                  </div>
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
