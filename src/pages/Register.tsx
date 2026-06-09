import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useBrokerConnect } from '../context/BrokerConnectContext';
import {
  Building2, ArrowLeft, ChevronRight, ChevronLeft, MapPin,
  Smartphone, FileText, CheckCircle, Shield, Award, Mail, Info
} from 'lucide-react';
import { CustomSelect } from '../components/CustomSelect';
import { PinCode } from 'rizzui/pin-code';
import { requestEmailOtp, verifyEmailOtp, registerBroker } from './api/register';


export const Register: React.FC = () => {
  const { addBroker } = useBrokerConnect();
  const navigate = useNavigate();

  // Wizard Step State
  const [wizardStep, setWizardStep] = useState(1);

  // Step 1: Basic Information
  const [brokerName, setBrokerName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [mobileNum, setMobileNum] = useState('');
  const [altMobileNum, setAltMobileNum] = useState('');
  const [emailId, setEmailId] = useState('');

  const [isMobileVerified, setIsMobileVerified] = useState(false);
  const [mobileOtpSent, setMobileOtpSent] = useState(false);
  const [mobileOtp, setMobileOtp] = useState('');
  const [otpVerificationError, setOtpVerificationError] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const [pinKey, setPinKey] = useState(0);

  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtp, setEmailOtp] = useState('');
  const [emailOtpError, setEmailOtpError] = useState('');
  const [emailResendTimer, setEmailResendTimer] = useState(30);
  const [emailPinKey, setEmailPinKey] = useState(0);
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [verifyingEmailOtp, setVerifyingEmailOtp] = useState(false);

  // Step 2: Verification Documents
  const [panNumber, setPANNumber] = useState('');
  const [gstNumber, setGSTNumber] = useState('');
  const [reraNumber, setRERANumber] = useState('');

  // Step 3: Address details
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [state, setState] = useState('Maharashtra');
  const [pincode, setPincode] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Auto-generate Broker ID effect removed

  const handlePinChange = (val: string) => {
    setMobileOtp(val);
    if (val.length === 6) {
      if (val === '123456') {
        setIsMobileVerified(true);
        setMobileOtpSent(false);
        setOtpVerificationError('');
      } else {
        setOtpVerificationError('Invalid OTP code. Use 123456.');
      }
    } else {
      setOtpVerificationError('');
    }
  };

  const handleVerifyEmailOtp = async (codeToVerify: string) => {
    if (codeToVerify.length !== 6) {
      setEmailOtpError('Please enter a 6-digit OTP code');
      return;
    }
    setVerifyingEmailOtp(true);
    setEmailOtpError('');
    try {
      const res = await verifyEmailOtp(emailId, Number(codeToVerify));
      if (res.success) {
        setIsEmailVerified(true);
        setEmailOtpSent(false);
        setEmailOtpError('');
      } else {
        setEmailOtpError(res.message || 'Invalid OTP code.');
      }
    } catch (err: any) {
      setEmailOtpError(err.message || 'An error occurred during verification.');
    } finally {
      setVerifyingEmailOtp(false);
    }
  };

  const handleEmailPinChange = (val: string) => {
    setEmailOtp(val);
    if (val.length === 6) {
      handleVerifyEmailOtp(val);
    } else {
      setEmailOtpError('');
    }
  };

  // Resend OTP Countdown Timer
  useEffect(() => {
    let interval: any;
    if (mobileOtpSent && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [mobileOtpSent, resendTimer]);

  // Resend Email OTP Countdown Timer
  useEffect(() => {
    let interval: any;
    if (emailOtpSent && emailResendTimer > 0) {
      interval = setInterval(() => {
        setEmailResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [emailOtpSent, emailResendTimer]);

  const handleNextStep = () => {
    setError('');
    if (wizardStep === 1) {
      if (!brokerName || !companyName || !mobileNum || !emailId) {
        setError('Please fill in all required fields (Broker Name, Company, Mobile, Email)');
        return;
      }
      if (mobileNum.length !== 10) {
        setError('Primary Mobile Number must be exactly 10 digits');
        return;
      }
      if (!isMobileVerified) {
        setError('Please verify your primary mobile number first.');
        return;
      }
      if (altMobileNum && altMobileNum.length !== 10) {
        setError('Alternate Mobile Number must be exactly 10 digits');
        return;
      }
      if (!emailId.includes('@')) {
        setError('Please enter a valid email address');
        return;
      }
      if (!isEmailVerified) {
        setError('Please verify your email address first.');
        return;
      }
    } else if (wizardStep === 2) {
      if (!panNumber || !reraNumber) {
        setError('Please fill in both PAN and RERA registration numbers');
        return;
      }
    }
    setWizardStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setError('');
    setWizardStep(prev => Math.max(1, prev - 1));
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressLine1 || !city || !state || !pincode) {
      setError('Please fill in Address Line 1, City, State, and Pincode');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        broker_name: brokerName,
        company_name: companyName,
        mobile_number: mobileNum,
        alternate_mobile: altMobileNum,
        email: emailId,
        pan_number: panNumber,
        gst_number: gstNumber || undefined,
        rera_registration_number: reraNumber,
        address_line_1: addressLine1,
        address_line_2: addressLine2 || undefined,
        city: city,
        state: state,
        pincode: pincode
      };
      
      const res = await registerBroker(payload);
      
      if (res.success) {
        addBroker({
          name: brokerName,
          mobile: mobileNum,
          companyName: companyName,
          email: emailId,
          altMobile: altMobileNum || undefined,
          addressLine1,
          addressLine2: addressLine2 || undefined,
          city,
          state,
          pincode,
          reraNumber,
          panNumber,
          gstNumber: gstNumber || undefined
        });

        // Redirect to login page with success state
        navigate('/login', {
          state: {
            success: res.message || `Registration submitted! Your broker account is now pending admin approval.`
          }
        });
      } else {
        setError(res.message || 'Registration failed. Please check your inputs.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-blue-100/10 text-slate-800 text-left font-sans">

      {/* Left side: Premium Document Requirement Guide (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/3 bg-[#0A1628] text-white p-12 flex-col justify-between relative overflow-hidden border-r border-blue-950/40">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 z-0"></div>
        <div className="absolute bottom-0 left-0 w-[250px] h-[250px] bg-sky-500/8 rounded-full blur-2xl translate-y-1/3 z-0"></div>

        {/* Branding Logo */}
        <div className="relative z-20 self-start hover:opacity-90 transition-opacity anim-fade-in">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-8.5 w-auto object-contain"
          />
        </div>

        <div className="relative z-10 w-full bg-white/8 rounded-full h-1 mb-8">
          <div 
            className="bg-gradient-to-r from-sky-400 to-blue-500 h-1 rounded-full transition-all duration-500"
            style={{ width: `${(wizardStep / 3) * 100}%` }}
          ></div>
        </div>

        {/* Dynamic Checklist Guide directly on background */}
        <div className="relative z-10 space-y-8 my-auto">
          <div className="anim-fade-up stagger-1">
            <span className="text-[10px] text-blue-300 font-extrabold uppercase tracking-widest block mb-1">Onboarding Guide</span>
            <h2 className="text-xl font-black bg-gradient-to-br from-white to-blue-100 bg-clip-text text-transparent tracking-tight">Required Onboarding Steps</h2>
            <p className="text-xs text-blue-200/80 font-semibold mt-1.5 leading-relaxed">
              Verify your agency credentials to activate immediate lead protection locking.
            </p>
          </div>

          <div className="space-y-6 anim-fade-up stagger-2">
            {/* Step 1 Indicator */}
            <div className={`relative flex items-start gap-4 transition-all duration-300 ${wizardStep === 1 ? 'opacity-100 scale-102' : 'opacity-55'}`}>
              <div className="absolute left-4 top-8 w-[2px] h-10 bg-blue-900/80"></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 shadow-xs z-10 ${
                wizardStep === 1 ? 'bg-[#1A56DB] text-white shadow-[0_0_0_4px_rgba(26,86,219,0.2)] pulse-glow' :
                wizardStep > 1 ? 'bg-emerald-500 text-white' : 'bg-white/8 text-blue-300 border border-white/10'
              }`}>
                {wizardStep > 1 ? <CheckCircle className="w-5 h-5" /> : '01'}
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white block">Basic Information</span>
                <span className="text-[10px] text-blue-300/70 font-semibold leading-relaxed block">
                  Verify name, corporate email, and primary mobile number.
                </span>
              </div>
            </div>

            {/* Step 2 Indicator */}
            <div className={`relative flex items-start gap-4 transition-all duration-300 ${wizardStep === 2 ? 'opacity-100 scale-102' : 'opacity-55'}`}>
              <div className="absolute left-4 top-8 w-[2px] h-10 bg-blue-900/80"></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 shadow-xs z-10 ${
                wizardStep === 2 ? 'bg-[#1A56DB] text-white shadow-[0_0_0_4px_rgba(26,86,219,0.2)] pulse-glow' :
                wizardStep > 2 ? 'bg-emerald-500 text-white' : 'bg-white/8 text-blue-300 border border-white/10'
              }`}>
                {wizardStep > 2 ? <CheckCircle className="w-5 h-5" /> : '02'}
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white block">Government Documents</span>
                <span className="text-[10px] text-blue-300/70 font-semibold leading-relaxed block">
                  Tax registration validation (RERA &amp; PAN card details).
                </span>
              </div>
            </div>

            {/* Step 3 Indicator */}
            <div className={`relative flex items-start gap-4 transition-all duration-300 ${wizardStep === 3 ? 'opacity-100 scale-102' : 'opacity-55'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 shadow-xs z-10 ${
                wizardStep === 3 ? 'bg-[#1A56DB] text-white shadow-[0_0_0_4px_rgba(26,86,219,0.2)] pulse-glow' :
                wizardStep > 3 ? 'bg-emerald-500 text-white' : 'bg-white/8 text-blue-300 border border-white/10'
              }`}>
                03
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white block">Office Address</span>
                <span className="text-[10px] text-blue-300/70 font-semibold leading-relaxed block">
                  Physical registered business address &amp; pincode validation.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Security badge */}
        <div className="relative z-10 pt-6 border-t border-blue-950/60 flex items-center gap-3">
          <div className="p-1.5 bg-blue-900/50 rounded-lg shadow-xs border border-blue-800/50 text-blue-400 shrink-0">
            <Shield className="w-4 h-4" />
          </div>
          <span className="text-[10px] text-blue-300 font-bold uppercase tracking-wider">
            Secured RERA &amp; PAN verification lock
          </span>
        </div>
      </div>

      {/* Right side: Register Multi-step Wizard */}
      <div className="w-full lg:w-2/3 flex flex-col justify-between min-h-screen p-6 sm:p-12 md:p-16">

        {/* Top Header */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-100 shrink-0">
          <Link
            to="/login"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Login</span>
          </Link>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Step {wizardStep} of 3
          </span>
        </div>

        {/* Form Container Card */}
        <div className="my-auto py-8 max-w-[540px] w-full mx-auto bg-white border border-slate-100/80 rounded-3xl p-8 sm:p-10 shadow-xl shadow-slate-100/40 space-y-6 anim-scale-in">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Broker Registration</h2>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
              Register your partner account to secure client lead ownership
            </p>
          </div>

          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold anim-slide-right">
              {error}
            </div>
          )}

          {/* STEP 1 FORM */}
          {wizardStep === 1 && (
            <div key={wizardStep} className="space-y-4 anim-slide-right">
              <div className="anim-fade-up">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b pb-2">
                  Basic Profile Info
                </h3>
              </div>

              <div className="space-y-1.5 anim-fade-up stagger-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider">Broker Name *</label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={brokerName}
                  onChange={(e) => setBrokerName(e.target.value)}
                  className="block w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-slate-800 font-semibold shadow-xs transition"
                  required
                />
              </div>

              <div className="space-y-1.5 anim-fade-up stagger-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider">Company Name *</label>
                <input
                  type="text"
                  placeholder="Enter company registered name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="block w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-slate-800 font-semibold shadow-xs transition"
                  required
                />
              </div>

              <div className="space-y-1.5 anim-fade-up stagger-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider">Mobile Number *</label>
                <div className="relative flex gap-2">
                  <input
                    type="text"
                    maxLength={10}
                    disabled={isMobileVerified}
                    placeholder="Primary Mobile Number"
                    value={mobileNum}
                    onChange={(e) => {
                      setMobileNum(e.target.value.replace(/[^0-9]/g, ''));
                      setIsMobileVerified(false);
                      setMobileOtpSent(false);
                    }}
                    className={`block w-full px-4 py-3 bg-white border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-semibold shadow-xs transition ${
                      isMobileVerified ? 'border-emerald-250 bg-emerald-50/30 text-emerald-700' : 'border-slate-200 text-slate-800'
                    }`}
                    required
                  />
                  {mobileNum.length === 10 && !isMobileVerified && !mobileOtpSent && (
                    <button
                      type="button"
                      onClick={() => {
                        setMobileOtpSent(true);
                        setResendTimer(30);
                        setOtpVerificationError('');
                        setMobileOtp('');
                        setPinKey(prev => prev + 1);
                        alert("Simulation: SMS OTP code '123456' sent to primary mobile.");
                      }}
                      className="px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer active:scale-95 shrink-0"
                    >
                      Verify
                    </button>
                  )}
                  {isMobileVerified && (
                    <span className="flex items-center gap-1.5 px-3 bg-emerald-50 border border-emerald-100 text-emerald-600 font-extrabold text-[10px] uppercase tracking-wider rounded-xl shrink-0">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Verified</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-1.5 anim-fade-up stagger-4">
                <label className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider">Alternate Mobile</label>
                <input
                  type="text"
                  maxLength={10}
                  placeholder="Alternate Mobile (Optional)"
                  value={altMobileNum}
                  onChange={(e) => setAltMobileNum(e.target.value.replace(/[^0-9]/g, ''))}
                  className="block w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-slate-800 font-semibold shadow-xs transition"
                />
              </div>

              <div className="space-y-1.5 anim-fade-up stagger-5">
                <label className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider">Email ID *</label>
                <div className="relative flex gap-2">
                  <input
                    type="email"
                    disabled={isEmailVerified}
                    placeholder="Enter business email address"
                    value={emailId}
                    onChange={(e) => {
                      setEmailId(e.target.value);
                      setIsEmailVerified(false);
                      setEmailOtpSent(false);
                    }}
                    className={`block w-full px-4 py-3 bg-white border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-semibold shadow-xs transition ${
                      isEmailVerified ? 'border-emerald-250 bg-emerald-50/30 text-emerald-700' : 'border-slate-200 text-slate-800'
                    }`}
                    required
                  />
                  {emailId.length > 3 && emailId.includes('@') && !isEmailVerified && !emailOtpSent && (
                    <button
                      type="button"
                      disabled={loadingOtp}
                      onClick={async () => {
                        setLoadingOtp(true);
                        setError('');
                        try {
                          const res = await requestEmailOtp(emailId);
                          if (res.success) {
                            setEmailOtpSent(true);
                            setEmailResendTimer(30);
                            setEmailOtpError('');
                            setEmailOtp('');
                            setEmailPinKey(prev => prev + 1);
                          } else {
                            setError(res.message || 'Failed to send OTP');
                          }
                        } catch (err: any) {
                          setError(err.message || 'An error occurred while sending OTP');
                        } finally {
                          setLoadingOtp(false);
                        }
                      }}
                      className="px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer active:scale-95 shrink-0"
                    >
                      {loadingOtp ? 'Sending...' : 'Verify'}
                    </button>
                  )}
                  {isEmailVerified && (
                    <span className="flex items-center gap-1.5 px-3 bg-emerald-50 border border-emerald-100 text-emerald-600 font-extrabold text-[10px] uppercase tracking-wider rounded-xl shrink-0">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Verified</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 FORM */}
          {wizardStep === 2 && (
            <div key={wizardStep} className="space-y-4 anim-slide-right">
              <div className="anim-fade-up">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b pb-2">
                  Government Verification
                </h3>
              </div>

              <div className="space-y-1.5 anim-fade-up stagger-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider">PAN Number *</label>
                <input
                  type="text"
                  placeholder="e.g. ABCDE1234F"
                  value={panNumber}
                  onChange={(e) => setPANNumber(e.target.value.toUpperCase())}
                  className="block w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-slate-800 font-semibold uppercase shadow-xs transition"
                  required
                />
              </div>

              <div className="space-y-1.5 anim-fade-up stagger-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider">GST Number</label>
                <input
                  type="text"
                  placeholder="Enter GSTIN number (Optional)"
                  value={gstNumber}
                  onChange={(e) => setGSTNumber(e.target.value.toUpperCase())}
                  className="block w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-slate-800 font-semibold uppercase shadow-xs transition"
                />
              </div>

              <div className="space-y-1.5 anim-fade-up stagger-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider">RERA Registration Number *</label>
                <input
                  type="text"
                  placeholder="e.g. PR-1234-ABCD"
                  value={reraNumber}
                  onChange={(e) => setRERANumber(e.target.value.toUpperCase())}
                  className="block w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-slate-800 font-semibold uppercase shadow-xs transition"
                  required
                />
              </div>
            </div>
          )}

          {/* STEP 3 FORM */}
          {wizardStep === 3 && (
            <div key={wizardStep} className="space-y-4 anim-slide-right">
              <div className="anim-fade-up">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b pb-2">
                  Office Address Details
                </h3>
              </div>

              <div className="space-y-1.5 anim-fade-up stagger-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider">Address Line 1 *</label>
                <input
                  type="text"
                  placeholder="Flat, Building name, Street address"
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  className="block w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-slate-800 font-semibold shadow-xs transition"
                  required
                />
              </div>

              <div className="space-y-1.5 anim-fade-up stagger-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider">Address Line 2</label>
                <input
                  type="text"
                  placeholder="Sector, Landmark (Optional)"
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                  className="block w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-slate-800 font-semibold shadow-xs transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 anim-fade-up stagger-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider">City *</label>
                  <CustomSelect
                    value={city}
                    onChange={(val) => setCity(val)}
                    options={['Mumbai', 'Pune', 'Goa', 'Bangalore', 'Ahmedabad']}
                    placeholder="Select City"
                    icon={MapPin}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider">State *</label>
                  <CustomSelect
                    value={state}
                    onChange={(val) => setState(val)}
                    options={['Maharashtra', 'Goa', 'Karnataka', 'Gujarat', 'Delhi']}
                    placeholder="Select State"
                    icon={MapPin}
                  />
                </div>
              </div>

              <div className="space-y-1.5 anim-fade-up stagger-4">
                <label className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider">Pincode *</label>
                <input
                  type="number"
                  placeholder="Enter 6-digit Pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="block w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-slate-800 font-semibold shadow-xs transition"
                  required
                />
              </div>
            </div>
          )}

          {/* Stepper Navigation bar */}
          <div className="flex gap-4 pt-6 border-t border-slate-100">
            {wizardStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="flex-1 flex items-center justify-center gap-1.5 py-3 border border-slate-200 hover:bg-slate-50 hover:text-slate-900 text-slate-500 font-bold rounded-xl text-xs transition cursor-pointer press"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="flex-1 py-3 border border-slate-200 hover:bg-slate-50 hover:text-slate-900 text-slate-500 font-bold rounded-xl text-xs transition cursor-pointer text-center block press"
              >
                Cancel
              </Link>
            )}

            {wizardStep < 3 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="flex-1 flex items-center justify-center gap-1.5 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-xl text-xs transition shadow-md shadow-blue-500/10 cursor-pointer press"
              >
                <span>Next Step</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleRegisterSubmit}
                disabled={loading}
                className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-blue-400 disabled:to-blue-500 text-white font-bold text-xs rounded-xl transition shadow-md shadow-blue-500/10 cursor-pointer text-center block press"
              >
                {loading ? 'Submitting...' : 'Register Broker'}
              </button>
            )}
          </div>
        </div>

        {/* Footer info links */}
        <div className="text-center text-[10px] text-slate-400 font-semibold tracking-wider uppercase shrink-0 pt-4 border-t border-slate-100">
          <span>Protected Lead Registry &middot; BrokerConnect v2.0</span>
        </div>
      </div>
      {/* Mobile OTP Verification Modal */}
      {mobileOtpSent && !isMobileVerified && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 anim-fade-in">
          <div className="bg-white p-8 rounded-3xl max-w-sm w-full shadow-[0_8px_32px_rgba(15,23,42,0.12)] border border-slate-100 space-y-6 text-center anim-scale-in">
            <div className="mx-auto w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 shadow-sm">
              <Smartphone className="w-5 h-5 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900 font-sans tracking-tight">Verify Mobile Number</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed px-2">
                We've sent a 6-digit code to <strong className="text-slate-800">{mobileNum}</strong>. Please enter it below to verify your device.
              </p>
            </div>

            {/* Premium PinCode Styling */}
            <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 flex flex-col items-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-3.5">Verification Security PIN</span>
              <PinCode
                key={pinKey}
                length={6}
                setValue={handlePinChange as any}
                size="lg"
                placeholder="o"
                center={true}
                inputClassName="!w-10 !h-10 text-center text-md font-black !bg-white !border !border-slate-200 !rounded-xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:bg-white text-slate-800 transition shadow-xs !mr-1 last:!mr-0 placeholder:!text-slate-300 placeholder:!font-normal"
              />
              {otpVerificationError && (
                <p className="text-[10px] text-red-600 font-bold mt-3.5">{otpVerificationError}</p>
              )}
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  if (mobileOtp === '123456') {
                    setIsMobileVerified(true);
                    setMobileOtpSent(false);
                    setOtpVerificationError('');
                  } else {
                    setOtpVerificationError('Invalid OTP code. Use 123456.');
                  }
                }}
                className="w-full py-3 bg-[#1A56DB] hover:bg-[#1648C0] text-white font-bold rounded-xl text-xs transition shadow-[0_4px_14px_rgba(26,86,219,0.25)] cursor-pointer press"
              >
                Verify Code
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={resendTimer > 0}
                  onClick={() => {
                    setResendTimer(30);
                    setPinKey(prev => prev + 1);
                    setMobileOtp('');
                    setOtpVerificationError('');
                    alert("Simulation: SMS OTP code '123456' resent to primary mobile.");
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition ${
                    resendTimer > 0 
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-transparent' 
                      : 'border border-slate-200 hover:bg-slate-50 text-slate-600 cursor-pointer press'
                  }`}
                >
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                </button>

                <button
                  type="button"
                  onClick={() => setMobileOtpSent(false)}
                  className="flex-1 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-500 font-bold rounded-xl text-xs transition cursor-pointer press"
                >
                  Cancel
                </button>
              </div>
            </div>

            <div className="text-[10px] text-slate-450 font-semibold leading-normal pt-1.5 border-t border-slate-50">
              Demo bypass OTP: <strong className="text-blue-600">123456</strong>
            </div>
          </div>
        </div>
      )}
      {/* Email OTP Verification Modal */}
      {emailOtpSent && !isEmailVerified && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 anim-fade-in">
          <div className="bg-white p-8 rounded-3xl max-w-sm w-full shadow-[0_8px_32px_rgba(15,23,42,0.12)] border border-slate-100 space-y-6 text-center anim-scale-in">
            <div className="mx-auto w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 shadow-sm">
              <Mail className="w-5 h-5 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900 font-sans tracking-tight">Verify Email Address</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed px-2">
                We've sent a 6-digit code to <strong className="text-slate-800">{emailId}</strong>. Please enter it below to verify your email.
              </p>
            </div>

            {/* Premium PinCode Styling */}
            <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 flex flex-col items-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-3.5">Verification Security PIN</span>
              <PinCode
                key={emailPinKey}
                length={6}
                setValue={handleEmailPinChange as any}
                size="lg"
                placeholder="o"
                center={true}
                inputClassName="!w-10 !h-10 text-center text-md font-black !bg-white !border !border-slate-200 !rounded-xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:bg-white text-slate-800 transition shadow-xs !mr-1 last:!mr-0 placeholder:!text-slate-300 placeholder:!font-normal"
              />
              {emailOtpError && (
                <p className="text-[10px] text-red-600 font-bold mt-3.5">{emailOtpError}</p>
              )}
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                disabled={verifyingEmailOtp}
                onClick={() => handleVerifyEmailOtp(emailOtp)}
                className="w-full py-3 bg-[#1A56DB] hover:bg-[#1648C0] text-white font-bold rounded-xl text-xs transition shadow-[0_4px_14px_rgba(26,86,219,0.25)] cursor-pointer press disabled:bg-blue-400"
              >
                {verifyingEmailOtp ? 'Verifying...' : 'Verify Code'}
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={emailResendTimer > 0}
                  onClick={async () => {
                    setEmailResendTimer(30);
                    setEmailPinKey(prev => prev + 1);
                    setEmailOtp('');
                    setEmailOtpError('');
                    try {
                      const res = await requestEmailOtp(emailId);
                      if (!res.success) {
                        setEmailOtpError(res.message || 'Failed to resend OTP');
                      }
                    } catch (err: any) {
                      setEmailOtpError(err.message || 'An error occurred while resending OTP');
                    }
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition ${
                    emailResendTimer > 0 
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-transparent' 
                      : 'border border-slate-200 hover:bg-slate-50 text-slate-600 cursor-pointer press'
                  }`}
                >
                  {emailResendTimer > 0 ? `Resend in ${emailResendTimer}s` : 'Resend OTP'}
                </button>

                <button
                  type="button"
                  onClick={() => setEmailOtpSent(false)}
                  className="flex-1 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-500 font-bold rounded-xl text-xs transition cursor-pointer press"
                >
                  Cancel
                </button>
              </div>
            </div>

            <div className="text-[10px] text-slate-450 font-semibold leading-normal pt-1.5 border-t border-slate-50">
              Enter the 6-digit verification code.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
