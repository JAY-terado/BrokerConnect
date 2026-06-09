import React, { useState, useEffect } from 'react';
import { useBrokerConnect } from '../../../context/BrokerConnectContext';
import { ArrowLeft, ShieldAlert, ShieldCheck, Smartphone, Key } from 'lucide-react';

export const OTPVerification: React.FC = () => {
  const { leads, verifyLeadOTP, setActiveScreen } = useBrokerConnect();
  
  // Get the most recently registered lead that is still pending OTP
  const latestPendingLead = leads.find(l => l.status === 'OTP Pending') || leads[0];
  const customerMobile = latestPendingLead?.mobile || '+91 98765 43210';
  const expectedOtp = latestPendingLead?.otp || '1234';

  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(45);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (timer > 0 && !success) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer, success]);

  const handleDigitChange = (index: number, val: string) => {
    if (isNaN(Number(val))) return;
    
    const nextDigits = [...otpDigits];
    nextDigits[index] = val.slice(-1); // keep only last character
    setOtpDigits(nextDigits);

    // Auto-focus next input
    if (val && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const fullOtp = otpDigits.join('');
    if (fullOtp.length < 4) {
      setError('Please enter all 4 digits');
      return;
    }

    setError('');
    
    const isValid = verifyLeadOTP(latestPendingLead.id, fullOtp);
    
    if (isValid) {
      localStorage.setItem('selectedLeadId', latestPendingLead.id);
      setSuccess(true);
      setTimeout(() => {
        setActiveScreen(5); // Go to Visit Pass
      }, 1200);
    } else {
      setError('Invalid OTP code. Please try again.');
      setOtpDigits(['', '', '', '']);
      document.getElementById('otp-input-0')?.focus();
    }
  };

  const handleResend = () => {
    if (timer === 0) {
      setTimer(45);
      setError('');
      // Simulation alerts the user again
      alert(`Simulation: Resent SMS OTP code: ${expectedOtp}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex items-center gap-3 bg-white p-5 rounded-2xl border border-slate-100/80 shadow-[0_1px_3px_rgba(15,23,42,0.06),0_4px_16px_rgba(15,23,42,0.04)] anim-fade-up">
        <button
          onClick={() => setActiveScreen(3)}
          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-lg font-bold text-[#0F172A]">OTP Verification</h2>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mt-0.5">
            Broker Portal &gt; Customer Identity Verification
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Verification Card (Desktop 7 columns, Mobile full) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-2xl border border-slate-100/80 shadow-[0_1px_3px_rgba(15,23,42,0.06),0_4px_16px_rgba(15,23,42,0.04)] flex flex-col justify-between anim-scale-in">
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-[#0F172A]">Verify OTP</h3>
              <p className="text-xs font-semibold text-slate-400 leading-relaxed max-w-sm">
                OTP has been simulated and sent to the customer's mobile number:
              </p>
              <span className="text-lg font-bold text-slate-800 tracking-wide block mt-1">
                {customerMobile}
              </span>
            </div>

            <form onSubmit={handleVerify} className="space-y-6">
              {error && (
                <div className="p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium animate-pulse">
                  {error}
                </div>
              )}

              {success && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-xl text-sm font-bold animate-bounce flex items-center justify-center gap-2">
                  <span className="anim-scale-in"><ShieldCheck className="w-5 h-5" /></span>
                  <span>OTP Verified Successfully! Redirecting...</span>
                </div>
              )}

              {/* OTP Squares */}
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-blue-500/5 anim-fade-in" style={{animationDelay:'0.2s'}}></div>
                <div className="flex gap-4 max-w-[280px] relative">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-input-${idx}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      className="w-14 h-14 bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-center font-extrabold text-xl text-slate-800 rounded-xl transition-all duration-200 hover:border-blue-300 focus:shadow-[0_0_0_6px_rgba(26,86,219,0.10)]"
                    />
                  ))}
                </div>
              </div>

              {/* Timer/Resend */}
              <div className="text-xs text-slate-400 font-semibold flex items-center gap-2">
                <span>Resend OTP in</span>
                {timer > 0 ? (
                  <span className="text-blue-600 font-bold">00:{timer.toString().padStart(2, '0')}</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="text-blue-600 hover:underline font-bold"
                  >
                    Resend Code
                  </button>
                )}
              </div>

              {/* Verify button */}
              <div className="space-y-3 pt-4">
                <button
                  type="submit"
                  disabled={success}
                  className="w-full max-w-[280px] py-2.5 bg-[#1A56DB] hover:bg-[#1648C0] disabled:bg-emerald-600 text-white rounded-xl font-semibold text-sm transition-all shadow-[0_4px_14px_rgba(26,86,219,0.35)] hover:shadow-[0_6px_20px_rgba(26,86,219,0.45)] cursor-pointer press pulse-glow"
                >
                  Verify OTP
                </button>
                <button
                  type="button"
                  onClick={() => setActiveScreen(3)}
                  className="block text-xs font-semibold text-slate-500 hover:text-slate-600 transition"
                >
                  Change Mobile Number
                </button>
              </div>
            </form>
          </div>

          <div className="pt-6 border-t border-slate-50 text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5 mt-8">
            <Smartphone className="w-4 h-4 text-blue-500" />
            <span>Simulated SMS Lock: OTP is {expectedOtp}</span>
          </div>
        </div>

        {/* Visual Mockup graphic (Desktop 5 columns, Mobile hidden) */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-2xl border border-slate-100 flex-col items-center justify-center relative overflow-hidden shadow-inner">
          {/* Padlock success shield graphic */}
          <div className="relative w-44 h-72 bg-white border-4 border-slate-800 rounded-[32px] shadow-xl flex flex-col justify-between p-4 overflow-hidden">
            {/* Phone notch */}
            <div className="absolute top-0 inset-x-0 mx-auto w-24 h-4 bg-slate-800 rounded-b-xl"></div>
            
            <div className="pt-8 text-center space-y-1">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">BrokerConnect</span>
              <span className="text-xs font-extrabold text-slate-700 block">Identity Shield</span>
            </div>

            <div className="my-auto flex flex-col items-center justify-center space-y-3">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${success ? 'bg-emerald-500 text-white animate-ping-once' : 'bg-blue-500 text-white'} transition-all duration-300 shadow-md`}>
                {success ? (
                  <ShieldCheck className="w-8 h-8" />
                ) : (
                  <Key className="w-7 h-7" />
                )}
              </div>
              <span className={`text-[10px] font-bold uppercase ${success ? 'text-emerald-600' : 'text-blue-600'} tracking-wider text-center block`}>
                {success ? 'Lead Locked' : 'Verifying OTP'}
              </span>
            </div>

            <div className="pb-2 text-center text-[8px] font-bold text-slate-400 uppercase tracking-widest">
              Broker Connect App
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
