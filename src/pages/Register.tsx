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
    <div className="flex min-h-screen bg-slate-50 text-slate-800 text-left font-sans">
      
      {/* Left side: Premium Document Requirement Guide (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/3 bg-slate-900 text-white p-12 flex-col justify-between relative overflow-hidden border-r border-slate-800">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        
        {/* Branding Logo */}
        <div className="relative z-10 flex items-center gap-2">
          <div className="p-2.5 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-500/20">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">BrokerConnect</span>
        </div>

        {/* Dynamic Checklist Guide */}
        <div className="relative z-10 space-y-8 my-auto">
          <div>
            <span className="text-[10px] text-blue-400 font-extrabold uppercase tracking-widest block mb-1">Onboarding Guide</span>
            <h2 className="text-xl font-black text-white tracking-tight">Required Onboarding Steps</h2>
            <p className="text-xs text-slate-400 font-semibold mt-1 leading-relaxed">
              Verify your agency credentials to activate immediate lead protection locking.
            </p>
          </div>

          <div className="space-y-6">
            {/* Step 1 Indicator */}
            <div className={`flex items-start gap-4 transition-all duration-300 ${wizardStep === 1 ? 'opacity-100 scale-102' : 'opacity-50'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                wizardStep > 1 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}>
                {wizardStep > 1 ? <CheckCircle className="w-5 h-5" /> : '01'}
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white block">Basic Information</span>
                <span className="text-[10px] text-slate-400 font-semibold leading-relaxed block">
                  Verify name, corporate email, and primary mobile number.
                </span>
              </div>
            </div>

            {/* Step 2 Indicator */}
            <div className={`flex items-start gap-4 transition-all duration-300 ${wizardStep === 2 ? 'opacity-100 scale-102' : 'opacity-50'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                wizardStep > 2 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}>
                {wizardStep > 2 ? <CheckCircle className="w-5 h-5" /> : '02'}
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white block">Government Documents</span>
                <span className="text-[10px] text-slate-400 font-semibold leading-relaxed block">
                  Tax registration validation (RERA &amp; PAN card details).
                </span>
              </div>
            </div>

            {/* Step 3 Indicator */}
            <div className={`flex items-start gap-4 transition-all duration-300 ${wizardStep === 3 ? 'opacity-100 scale-102' : 'opacity-50'}`}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black bg-slate-800 text-slate-400 border border-slate-700 shrink-0">
                03
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white block">Office Address</span>
                <span className="text-[10px] text-slate-400 font-semibold leading-relaxed block">
                  Physical registered business address &amp; pincode validation.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Security badge */}
        <div className="relative z-10 pt-6 border-t border-slate-800 flex items-center gap-3">
          <Shield className="w-5 h-5 text-blue-500 shrink-0" />
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
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

        {/* Form Container */}
        <div className="my-auto py-8 max-w-[520px] w-full mx-auto space-y-6">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Broker Registration</h2>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
              Register your partner account to secure and protect client lead ownership
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
                  className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-extrabold text-blue-600 outline-none select-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider">Broker Name *</label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={brokerName}
                  onChange={(e) => setBrokerName(e.target.value)}
                  className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-800 font-semibold"
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
                  className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-800 font-semibold"
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
                    className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-800 font-semibold"
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
                    className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-800 font-semibold"
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
                  className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-800 font-semibold"
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
                  className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-800 font-semibold uppercase"
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
                  className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-800 font-semibold uppercase"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider">RERA Registration Number *</label>
                <input
                  type="text"
                  placeholder="e.g. PR-1234-ABCD"
                  value={reraNumber}
                  onChange={(e) => setRERANumber(e.target.value.toUpperCase())}
                  className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-800 font-semibold uppercase"
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
                  className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-800 font-semibold"
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
                  className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-800 font-semibold"
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
                  className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-800 font-semibold"
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
                className="flex-1 flex items-center justify-center gap-1.5 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="flex-1 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer text-center block"
              >
                Cancel
              </Link>
            )}

            {wizardStep < 3 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="flex-1 flex items-center justify-center gap-1.5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition shadow-md cursor-pointer"
              >
                <span>Next Step</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleRegisterSubmit}
                disabled={loading}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-xs rounded-xl transition shadow-md cursor-pointer text-center block"
              >
                {loading ? 'Submitting Registration...' : 'Register Broker'}
              </button>
            )}
          </div>
        </div>

        {/* Footer info links */}
        <div className="text-center text-[10px] text-slate-400 font-semibold tracking-wider uppercase shrink-0 pt-4 border-t border-slate-50">
          <span>Protected Lead Registry &middot; BrokerConnect v2.0</span>
        </div>
      </div>
    </div>
  );
};

export default Register;
