import React, { useState } from 'react';
import { useBrokerConnect } from '../../context/BrokerConnectContext';
import { ArrowLeft, User, MapPin, Briefcase, Building, Upload, Camera, Trash2, Plus, Check, CheckCircle2 } from 'lucide-react';

export const VisitorCheckIn: React.FC = () => {
  const { leads, checkInVisitor, autoAllocateSales, setActiveScreen } = useBrokerConnect();

  // Find the first customer that is OTP Verified but not checked-in yet
  const pendingVisitor = leads.find(l => l.status === 'OTP Verified') || leads[0];
  
  const customerName = pendingVisitor?.name || 'Rahul Shah';
  const visitCode = pendingVisitor?.visitCode || 'VIS-2026-45891';

  // Form states
  const [address, setAddress] = useState(pendingVisitor?.address || 'Noida, Uttar Pradesh');
  const [occupation, setOccupation] = useState(pendingVisitor?.occupation || 'Business');
  const [company, setCompany] = useState(pendingVisitor?.company || 'ABC Pvt Ltd');
  const [purpose, setPurpose] = useState('End User');
  
  // Document uploading mock states
  const [panUploaded, setPanUploaded] = useState(false);
  const [aadhaarUploaded, setAadhaarUploaded] = useState(false);
  const [selfieCaptured, setSelfieCaptured] = useState(false);
  
  // Family members list
  const [familyInput, setFamilyInput] = useState('');
  const [familyMembers, setFamilyMembers] = useState<string[]>([]);

  const handleAddFamily = () => {
    if (familyInput.trim()) {
      setFamilyMembers(prev => [...prev, familyInput.trim()]);
      familyInput.trim();
      setFamilyInput('');
    }
  };

  const handleRemoveFamily = (idx: number) => {
    setFamilyMembers(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check-in in global context
    checkInVisitor(pendingVisitor.id, {
      address,
      occupation,
      company,
      panUploaded,
      aadhaarUploaded,
      selfieCaptured,
    });

    // Auto-allocate sales executive via Round Robin
    autoAllocateSales(pendingVisitor.id);

    // Redirect to Sales Allocation Animation screen
    setActiveScreen(8);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header Panel */}
      <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-100/80 shadow-[0_1px_3px_rgba(15,23,42,0.06),0_4px_16px_rgba(15,23,42,0.04)]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveScreen(6)}
            className="p-2 border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 rounded-xl transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-lg font-bold text-[#0F172A]">Visitor Check-In</h2>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mt-0.5">
              Reception Desk &gt; Customer Details Validation
            </p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wider">
          {visitCode}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Details Panel (Desktop 8 columns) */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-2xl border border-slate-100/80 shadow-[0_1px_3px_rgba(15,23,42,0.06),0_4px_16px_rgba(15,23,42,0.04)] space-y-8">
          
          {/* Customer Greeting */}
          <div className="flex items-center gap-4 bg-slate-50/70 p-4 rounded-xl border border-slate-100">
            <div className="w-12 h-12 bg-[#1A56DB] text-white rounded-full flex items-center justify-center text-lg font-black shadow-md">
              {customerName.charAt(0)}
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#0F172A]">{customerName}</h3>
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wide mt-0.5 block">Currently Checking In</span>
            </div>
          </div>

          {/* Personal details */}
          <div className="space-y-5">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
              Personal details
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2 md:col-span-2">
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Residential Address</label>
                <div className="relative">
                  <span className="absolute top-3 left-3.5 text-slate-400">
                    <MapPin className="w-4.5 h-4.5" />
                  </span>
                  <textarea
                    placeholder="Enter resident address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="block w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-shadow duration-200 placeholder:text-slate-400 min-h-[70px] resize-none text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Occupation</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Briefcase className="w-4.5 h-4.5" />
                  </span>
                  <input
                    type="text"
                    placeholder="Enter occupation"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    className="block w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-shadow duration-200 placeholder:text-slate-400 text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Company Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Building className="w-4.5 h-4.5" />
                  </span>
                  <input
                    type="text"
                    placeholder="Enter company name"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="block w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-shadow duration-200 placeholder:text-slate-400 text-slate-800"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Requirements Details */}
          <div className="space-y-5">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
              Requirement Info
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Budget Range</label>
                <div className="py-2.5 px-4 bg-slate-50/70 border border-slate-100 rounded-xl text-xs font-extrabold text-slate-700">
                  {pendingVisitor?.budget || '₹80L - ₹1Cr'}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Purpose of Visit</label>
                <div className="flex gap-3">
                  <label className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 border rounded-xl text-sm transition-all cursor-pointer ${purpose === 'End User' ? 'bg-blue-50 text-blue-700 border-blue-100 font-semibold' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 font-medium'}`}>
                    <input type="radio" className="hidden" checked={purpose === 'End User'} onChange={() => setPurpose('End User')} />
                    <span>End User</span>
                  </label>
                  <label className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 border rounded-xl text-sm transition-all cursor-pointer ${purpose === 'Investor' ? 'bg-blue-50 text-blue-700 border-blue-100 font-semibold' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 font-medium'}`}>
                    <input type="radio" className="hidden" checked={purpose === 'Investor'} onChange={() => setPurpose('Investor')} />
                    <span>Investor</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Family members */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
              Family Members accompanying
            </h4>
            
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter family member name & relation"
                value={familyInput}
                onChange={(e) => setFamilyInput(e.target.value)}
                className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-shadow duration-200 placeholder:text-slate-400 text-slate-800"
              />
              <button
                type="button"
                onClick={handleAddFamily}
                className="flex items-center gap-1.5 px-4 bg-[#1A56DB] hover:bg-[#1648C0] text-white rounded-xl font-semibold text-sm transition-all shadow-[0_4px_14px_rgba(26,86,219,0.25)] hover:shadow-[0_6px_20px_rgba(26,86,219,0.35)] cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>

            {familyMembers.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {familyMembers.map((member, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 border border-slate-200 text-slate-700 rounded-full text-xs font-semibold">
                    <span>{member}</span>
                    <button type="button" onClick={() => handleRemoveFamily(idx)} className="text-slate-400 hover:text-red-500 transition cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Uploads and Actions Panel (Desktop 4 columns) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Document Upload Status */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100/80 shadow-[0_1px_3px_rgba(15,23,42,0.06),0_4px_16px_rgba(15,23,42,0.04)] space-y-5">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Documents & KYC</h4>
            
            {/* PAN card */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200/60 rounded-xl">
              <div className="text-left space-y-0.5">
                <span className="text-xs font-bold text-slate-800">PAN Card</span>
                <span className="text-xs text-slate-500 font-medium block">Required for KYC</span>
              </div>
              <button
                type="button"
                onClick={() => setPanUploaded(p => !p)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${panUploaded ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm' : 'border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'}`}
              >
                {panUploaded ? <Check className="w-3.5 h-3.5" /> : <Upload className="w-3.5 h-3.5" />}
                <span>{panUploaded ? 'Uploaded' : 'Upload'}</span>
              </button>
            </div>

            {/* Aadhaar card */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200/60 rounded-xl">
              <div className="text-left space-y-0.5">
                <span className="text-xs font-bold text-slate-800">Aadhaar Card</span>
                <span className="text-xs text-slate-500 font-medium block">Required for registration</span>
              </div>
              <button
                type="button"
                onClick={() => setAadhaarUploaded(a => !a)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${aadhaarUploaded ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm' : 'border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'}`}
              >
                {aadhaarUploaded ? <Check className="w-3.5 h-3.5" /> : <Upload className="w-3.5 h-3.5" />}
                <span>{aadhaarUploaded ? 'Uploaded' : 'Upload'}</span>
              </button>
            </div>

            {/* Selfie Capture */}
            <div className="space-y-3 pt-2 font-sans">
              <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Selfie Capture</span>
              <div className="w-full h-36 bg-slate-50 border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-4 text-center relative overflow-hidden group">
                {selfieCaptured ? (
                  <>
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200" alt="Selfie" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200">
                      <button type="button" onClick={() => setSelfieCaptured(false)} className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold text-xs transition-all shadow-[0_4px_14px_rgba(220,38,38,0.25)] cursor-pointer">
                        Retake
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <Camera className="w-8 h-8 text-slate-400 mb-1.5" />
                    <button
                      type="button"
                      onClick={() => setSelfieCaptured(true)}
                      className="px-3.5 py-1.5 bg-[#1A56DB] hover:bg-[#1648C0] text-white rounded-xl font-semibold text-xs transition-all shadow-[0_4px_14px_rgba(26,86,219,0.25)] hover:shadow-[0_6px_20px_rgba(26,86,219,0.35)] cursor-pointer"
                    >
                      Capture Photo
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Submits */}
          <button
            type="submit"
            className="w-full py-4 bg-[#1A56DB] hover:bg-[#1648C0] text-white font-semibold rounded-xl text-sm transition-all shadow-[0_4px_14px_rgba(26,86,219,0.25)] hover:shadow-[0_6px_20px_rgba(26,86,219,0.35)] cursor-pointer text-center block"
          >
            Check-In Visitor & Allocate
          </button>
        </div>

      </form>
    </div>
  );
};
