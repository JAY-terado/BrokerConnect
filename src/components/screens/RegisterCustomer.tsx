import React, { useState } from 'react';
import { useBrokerConnect } from '../../context/BrokerConnectContext';
import { ArrowLeft, User, Phone, Mail, MapPin, Building, Home, CreditCard, Calendar, Clock, AlertTriangle } from 'lucide-react';
import { CustomSelect } from '../CustomSelect';

export const RegisterCustomer: React.FC = () => {
  const { registerLead, setActiveScreen, projects, brokers } = useBrokerConnect();
  
  // State variables
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [project, setProject] = useState(projects[0]?.name || 'Sunrise Meadows');
  const [unitType, setUnitType] = useState('2 BHK');
  const [budget, setBudget] = useState('₹80L - ₹1Cr');
  const [expectedDate, setExpectedDate] = useState('');
  const [expectedTime, setExpectedTime] = useState('11:00 AM');
  const [selectedBroker, setSelectedBroker] = useState('BRK-001'); // Mock current logged in broker
  
  const [error, setError] = useState('');
  const [simulationAlert, setSimulationAlert] = useState<{ show: boolean; otp: string; leadId: string; dispute: boolean } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !mobile || !email || !expectedDate) {
      setError('Please fill in all required fields (Name, Mobile, Email, and Expected Visit Date)');
      return;
    }
    
    setError('');
    
    // Call registration context action
    const currentBrokerObj = brokers.find(b => b.id === selectedBroker) || brokers[0];
    
    const result = registerLead({
      name,
      mobile,
      email,
      city,
      project,
      unitType,
      budget,
      expectedDate,
      expectedTime,
      brokerId: selectedBroker,
      brokerName: currentBrokerObj.name,
    });

    // Save simulation details to show a popup before redirection
    setSimulationAlert({
      show: true,
      otp: result.otp,
      leadId: result.leadId,
      dispute: result.disputeRaised
    });
  };

  const handleProceedToOtp = () => {
    if (simulationAlert) {
      setSimulationAlert(null);
      // Redirect to OTP verification screen
      setActiveScreen(4);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex items-center gap-3 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <button
          onClick={() => setActiveScreen(2)}
          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Register Customer</h2>
          <p className="text-xs text-slate-400 font-semibold tracking-wider uppercase">
            Broker Portal &gt; Lead Protection Registration
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm space-y-8">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium animate-pulse">
              {error}
            </div>
          )}

          {/* Section 1: Basic Info */}
          <div className="space-y-5">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
              Basic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase">Customer Name *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4.5 h-4.5" />
                  </span>
                  <input
                    type="text"
                    placeholder="Enter full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase">Mobile Number *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4.5 h-4.5" />
                  </span>
                  <input
                    type="text"
                    placeholder="Enter mobile number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase">Email *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4.5 h-4.5" />
                  </span>
                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase">City</label>
                <CustomSelect
                  value={city}
                  onChange={(val) => setCity(val)}
                  options={['Mumbai', 'Pune', 'Goa', 'Bangalore', 'Ahmedabad']}
                  placeholder="Select City"
                  icon={MapPin}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Requirements */}
          <div className="space-y-5">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
              Requirements
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase">Project</label>
                <CustomSelect
                  value={project}
                  onChange={(val) => setProject(val)}
                  options={projects.map((p) => p.name)}
                  placeholder="Select Project"
                  icon={Building}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase">Unit Type</label>
                <CustomSelect
                  value={unitType}
                  onChange={(val) => setUnitType(val)}
                  options={['1 BHK', '2 BHK', '3 BHK', '4 BHK', 'Penthouse']}
                  placeholder="Select Unit Type"
                  icon={Home}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase">Budget</label>
                <CustomSelect
                  value={budget}
                  onChange={(val) => setBudget(val)}
                  options={['₹50L - ₹60L', '₹60L - ₹80L', '₹80L - ₹1Cr', '₹1Cr - ₹1.2Cr', '₹1.2Cr - ₹1.5Cr', '₹1.5Cr - ₹2Cr', '₹2Cr - ₹2.5Cr', '₹2.5Cr+']}
                  placeholder="Select Budget"
                  icon={CreditCard}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Visit Schedule */}
          <div className="space-y-5">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
              Scheduled Visit details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase">Expected Visit Date *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Calendar className="w-4.5 h-4.5" />
                  </span>
                  <input
                    type="date"
                    value={expectedDate}
                    onChange={(e) => setExpectedDate(e.target.value)}
                    className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase">Expected Visit Time</label>
                <CustomSelect
                  value={expectedTime}
                  onChange={(val) => setExpectedTime(val)}
                  options={['10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM']}
                  placeholder="Select Visit Time"
                  icon={Clock}
                />
              </div>
            </div>
          </div>

          {/* Submits */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => setActiveScreen(2)}
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm transition cursor-pointer text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition shadow-md shadow-blue-500/10 cursor-pointer text-center"
            >
              Send OTP Verification
            </button>
          </div>
        </div>

        {/* Sidebar Info/Policy Guide (Desktop Only) */}
        <div className="hidden lg:block lg:col-span-4 space-y-6">
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-6 rounded-2xl border border-slate-800 shadow-lg space-y-4">
            <h4 className="text-sm font-bold tracking-wider uppercase text-blue-400">Lead Protection Policy</h4>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              BrokerConnect enforces strict lead protection rules. To register a customer:
            </p>
            <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside">
              <li>Customer must verify registration via a real-time OTP security pin.</li>
              <li>Once verified, lead ownership locks to your ID for <strong className="text-white">90 days</strong>.</li>
              <li>If the lead is registered by another broker within the lock period, a dispute will be generated automatically.</li>
            </ul>
          </div>

        </div>
      </form>

      {/* Verification Simulation Popup */}
      {simulationAlert?.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white p-8 rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 space-y-6 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="mx-auto w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
              <Phone className="w-6 h-6 animate-bounce" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900">OTP Code Generated</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                We've simulated sending an SMS to the customer's phone number <strong className="text-slate-800">{mobile}</strong>.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Customer SMS Verification Pin</span>
              <span className="text-3xl font-extrabold text-blue-600 tracking-widest">{simulationAlert.otp}</span>
            </div>

            {simulationAlert.dispute && (
              <div className="bg-amber-50 p-3.5 border border-amber-200 rounded-xl flex gap-3 text-left">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-amber-800 block">Lead Conflict Detected!</span>
                  <span className="text-[10px] text-amber-700 font-medium leading-relaxed block">
                    This phone number is already active under another broker. A dispute has been filed automatically for Admin audit.
                  </span>
                </div>
              </div>
            )}

            <button
              onClick={handleProceedToOtp}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition shadow-md shadow-blue-500/10 cursor-pointer"
            >
              Enter OTP Code
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
