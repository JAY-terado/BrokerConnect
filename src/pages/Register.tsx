import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useBrokerConnect } from '../context/BrokerConnectContext';
import {
  Building2, ArrowLeft, ChevronRight, ChevronLeft, MapPin,
  Smartphone, FileText, CheckCircle, Shield, Award, Mail, Info
} from 'lucide-react';
import { CustomSelect } from '../components/CustomSelect';

export const Register: React.FC = () => {
  const { addBroker } = useBrokerConnect();
  const navigate = useNavigate();

  // Wizard Step State
  const [wizardStep, setWizardStep] = useState(1);
  const [generatedBrokerId, setGeneratedBrokerId] = useState('');

  // Step 1: Basic Information
  const [brokerName, setBrokerName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [mobileNum, setMobileNum] = useState('');
  const [altMobileNum, setAltMobileNum] = useState('');
  const [emailId, setEmailId] = useState('');

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

  // Auto-generate Broker ID
  useEffect(() => {
    if (!generatedBrokerId) {
      setGeneratedBrokerId(`BRK-AUTO-${Math.floor(1000 + Math.random() * 9000)}`);
    }
  }, [generatedBrokerId]);

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
      if (altMobileNum && altMobileNum.length !== 10) {
        setError('Alternate Mobile Number must be exactly 10 digits');
        return;
      }
      if (!emailId.includes('@')) {
        setError('Please enter a valid email address');
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

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressLine1 || !city || !state || !pincode) {
      setError('Please fill in Address Line 1, City, State, and Pincode');
      return;
    }

    setLoading(true);
    setError('');

    setTimeout(() => {
      setLoading(false);
      // Register broker in global state
      addBroker(brokerName, mobileNum);

      // Redirect to login page with success state
      navigate('/login', {
        state: {
          success: `Registration submitted! Broker ID ${generatedBrokerId} is now pending admin approval.`
        }
      });
    }, 1000);
  };

  return (
    <div className="flex min-h-screen bg-blue-100/10 text-slate-800 text-left font-sans">

      {/* Left side: Premium Document Requirement Guide (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/3 bg-[#0A1628] text-white p-12 flex-col justify-between relative overflow-hidden border-r border-blue-950/40">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 z-0"></div>
        <div className="absolute bottom-0 left-0 w-[250px] h-[250px] bg-sky-500/8 rounded-full blur-2xl translate-y-1/3 z-0"></div>

        {/* Branding Logo */}
        <div className="relative z-20 self-start hover:opacity-90 transition-opacity">
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
          <div>
            <span className="text-[10px] text-blue-300 font-extrabold uppercase tracking-widest block mb-1">Onboarding Guide</span>
            <h2 className="text-xl font-black bg-gradient-to-br from-white to-blue-100 bg-clip-text text-transparent tracking-tight">Required Onboarding Steps</h2>
            <p className="text-xs text-blue-200/80 font-semibold mt-1.5 leading-relaxed">
              Verify your agency credentials to activate immediate lead protection locking.
            </p>
          </div>

          <div className="space-y-6">
            {/* Step 1 Indicator */}
            <div className={`relative flex items-start gap-4 transition-all duration-300 ${wizardStep === 1 ? 'opacity-100 scale-102' : 'opacity-55'}`}>
              <div className="absolute left-4 top-8 w-[2px] h-10 bg-blue-900/80"></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 shadow-xs z-10 ${
                wizardStep === 1 ? 'bg-[#1A56DB] text-white shadow-[0_0_0_4px_rgba(26,86,219,0.2)]' :
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
                wizardStep === 2 ? 'bg-[#1A56DB] text-white shadow-[0_0_0_4px_rgba(26,86,219,0.2)]' :
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
                wizardStep === 3 ? 'bg-[#1A56DB] text-white shadow-[0_0_0_4px_rgba(26,86,219,0.2)]' :
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
        <div className="my-auto py-8 max-w-[540px] w-full mx-auto bg-white border border-slate-100/80 rounded-3xl p-8 sm:p-10 shadow-xl shadow-slate-100/40 space-y-6">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Broker Registration</h2>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
              Register your partner account to secure client lead ownership
            </p>
          </div>

          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold animate-pulse">
              {error}
            </div>
          )}

          {/* STEP 1 FORM */}
          {wizardStep === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b pb-2">
                Basic Profile Info
              </h3>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider">Broker ID (Auto-Generated) *</label>
                <input
                  type="text"
                  value={generatedBrokerId}
                  readOnly
                  className="block w-full px-4 py-3 bg-blue-50/40 border border-slate-200 rounded-xl text-xs font-extrabold text-blue-600 outline-none select-all shadow-xs"
                />
              </div>

              <div className="space-y-1.5">
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

              <div className="space-y-1.5">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider">Mobile Number *</label>
                  <input
                    type="text"
                    maxLength={10}
                    placeholder="Primary Mobile Number"
                    value={mobileNum}
                    onChange={(e) => setMobileNum(e.target.value.replace(/[^0-9]/g, ''))}
                    className="block w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-slate-800 font-semibold shadow-xs transition"
                    required
                  />
                </div>
                <div className="space-y-1.5">
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
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider">Email ID *</label>
                <input
                  type="email"
                  placeholder="Enter business email address"
                  value={emailId}
                  onChange={(e) => setEmailId(e.target.value)}
                  className="block w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-slate-800 font-semibold shadow-xs transition"
                  required
                />
              </div>
            </div>
          )}

          {/* STEP 2 FORM */}
          {wizardStep === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b pb-2">
                Government Verification
              </h3>

              <div className="space-y-1.5">
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

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider">GST Number</label>
                <input
                  type="text"
                  placeholder="Enter GSTIN number (Optional)"
                  value={gstNumber}
                  onChange={(e) => setGSTNumber(e.target.value.toUpperCase())}
                  className="block w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-slate-800 font-semibold uppercase shadow-xs transition"
                />
              </div>

              <div className="space-y-1.5">
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
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b pb-2">
                Office Address Details
              </h3>

              <div className="space-y-1.5">
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

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider">Address Line 2</label>
                <input
                  type="text"
                  placeholder="Sector, Landmark (Optional)"
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                  className="block w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-slate-800 font-semibold shadow-xs transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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

              <div className="space-y-1.5">
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
                className="flex-1 flex items-center justify-center gap-1.5 py-3 border border-slate-200 hover:bg-slate-50 hover:text-slate-900 text-slate-500 font-bold rounded-xl text-xs transition active:scale-[0.98] cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="flex-1 py-3 border border-slate-200 hover:bg-slate-50 hover:text-slate-900 text-slate-500 font-bold rounded-xl text-xs transition cursor-pointer text-center block active:scale-[0.98]"
              >
                Cancel
              </Link>
            )}

            {wizardStep < 3 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="flex-1 flex items-center justify-center gap-1.5 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-xl text-xs transition shadow-md shadow-blue-500/10 active:scale-[0.98] cursor-pointer"
              >
                <span>Next Step</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleRegisterSubmit}
                disabled={loading}
                className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-blue-400 disabled:to-blue-500 text-white font-bold text-xs rounded-xl transition shadow-md shadow-blue-500/10 cursor-pointer text-center block active:scale-[0.98]"
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
    </div>
  );
};

export default Register;
