import React from 'react';
import { useBrokerConnect } from '../../context/BrokerConnectContext';
import { ArrowLeft, Share2, Download, Clock, Calendar, ShieldCheck, MapPin, Ticket, ChevronRight } from 'lucide-react';

export const VisitPass: React.FC = () => {
  const { leads, setActiveScreen } = useBrokerConnect();

  // Find all verified leads that have a visit pass generated
  const verifiedLeads = leads.filter(l => 
    ['OTP Verified', 'Checked In', 'Allocated', 'Booked', 'Follow-Up', 'Negotiation'].includes(l.status)
  );

  // Initialize selected lead state dynamically
  const [selectedId, setSelectedId] = React.useState<string>(() => {
    const stored = localStorage.getItem('selectedLeadId');
    const matched = verifiedLeads.find(l => l.id === stored);
    return matched ? matched.id : (verifiedLeads[0]?.id || '');
  });

  // Keep localStorage and selectedId in sync
  React.useEffect(() => {
    if (selectedId) {
      localStorage.setItem('selectedLeadId', selectedId);
    }
  }, [selectedId]);

  // Sync selectedId if leads list updates and our current selectedId is not in verified list
  React.useEffect(() => {
    const matched = verifiedLeads.find(l => l.id === selectedId);
    if (!matched && verifiedLeads.length > 0) {
      setSelectedId(verifiedLeads[0].id);
    }
  }, [leads, selectedId]);

  const handleShare = (name: string, mobile: string) => {
    alert(`Simulation: Visit Pass link shared with ${name} (+91 ${mobile}) on WhatsApp!`);
  };

  const handleDownload = () => {
    alert('Simulation: Downloading Visit Pass PDF ticket...');
  };

  // If there are no verified passes, render clean fallback empty state
  if (verifiedLeads.length === 0) {
    return (
      <div className="space-y-6 text-left">
        {/* Header Panel */}
        <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-100/80 shadow-[0_1px_3px_rgba(15,23,42,0.06),0_4px_16px_rgba(15,23,42,0.04)] text-left anim-fade-up">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveScreen(2)}
              className="p-2 border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 rounded-xl transition-all cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-lg font-bold text-[#0F172A]">Visit Pass</h2>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mt-0.5">
                Broker Portal &gt; Registration Ticket Generated
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveScreen(2)}
            className="text-xs font-bold text-[#1A56DB] hover:text-[#1648C0] transition-colors cursor-pointer"
          >
            Go back to Dashboard
          </button>
        </div>

        <div className="flex flex-col items-center justify-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-12 text-center max-w-lg mx-auto anim-scale-in">
          <Ticket className="w-8 h-8 text-slate-300 mb-3" />
          <h3 className="text-lg font-bold text-[#0F172A] mb-1">No active visit passes found</h3>
          <p className="text-slate-400 text-sm font-medium mb-4">
            Register a customer and verify their mobile OTP to generate an active digital entry pass.
          </p>
          <button
            onClick={() => setActiveScreen(3)}
            className="px-5 py-2.5 bg-[#1A56DB] hover:bg-[#1648C0] text-white rounded-xl font-semibold text-sm transition-all shadow-[0_4px_14px_rgba(26,86,219,0.25)] hover:shadow-[0_6px_20px_rgba(26,86,219,0.35)] cursor-pointer press pulse-glow"
          >
            Register Customer
          </button>
        </div>
      </div>
    );
  }

  // Find the selected lead object
  const activeLead = verifiedLeads.find(l => l.id === selectedId) || verifiedLeads[0];

  const customerName = activeLead.name;
  const visitCode = activeLead.visitCode;
  const brokerName = activeLead.brokerName;
  const visitDateTime = `${activeLead.expectedDate} at ${activeLead.expectedTime}`;
  const projectName = activeLead.project;

  return (
    <div className="space-y-6 text-left">
      {/* Header Panel */}
      <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-100/80 shadow-[0_1px_3px_rgba(15,23,42,0.06),0_4px_16px_rgba(15,23,42,0.04)] text-left anim-fade-up">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveScreen(2)}
            className="p-2 border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 rounded-xl transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-lg font-bold text-[#0F172A]">Visit Pass</h2>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mt-0.5">
              Broker Portal &gt; Registration Ticket Generated
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveScreen(2)}
          className="text-xs font-bold text-[#1A56DB] hover:text-[#1648C0] transition-colors cursor-pointer"
        >
          Go back to Dashboard
        </button>
      </div>

      {/* Main Grid: Selector sidebar & Ticket display */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-left items-start">
        
        {/* Pass Selector Sidebar (Left 5/4 cols) */}
        <div className="md:col-span-5 lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-100/80 shadow-[0_1px_3px_rgba(15,23,42,0.06),0_4px_16px_rgba(15,23,42,0.04)] space-y-4 anim-fade-up stagger-2">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-[#0F172A]">Select Visit Pass</h3>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mt-0.5">
              {verifiedLeads.length} active digital tickets
            </p>
          </div>

          <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
            {verifiedLeads.map((lead) => {
              const isSelected = activeLead.id === lead.id;
              return (
                <button
                  key={lead.id}
                  onClick={() => setSelectedId(lead.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all duration-150 flex items-center justify-between gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/70 border-blue-100 text-blue-700 font-bold shadow-sm translate-x-1'
                      : 'bg-slate-50/30 hover:bg-slate-50/80 border-slate-100/80 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isSelected ? 'bg-blue-600 animate-pulse' : 'bg-slate-400'}`}></span>
                      <span className={`text-xs font-bold block truncate ${isSelected ? 'text-blue-800' : 'text-slate-800'}`}>
                        {lead.name}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 font-medium block truncate">
                      {lead.project}
                    </span>
                    <span className="text-[9px] font-mono font-bold text-slate-400 block tracking-tight uppercase">
                      {lead.visitCode}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1 shrink-0">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold smooth ${
                      lead.status === 'Booked' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                      lead.status === 'Negotiation' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                      lead.status === 'Checked In' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                      'bg-blue-50 text-blue-700 border-blue-100'
                    }`}>
                      {lead.status === 'OTP Verified' ? 'Verified' : lead.status}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Pass Detail Ticket (Right 8/7 cols) */}
        <div className="md:col-span-7 lg:col-span-8 flex justify-center items-center p-2 anim-fade-up stagger-3">
          {/* Ticket Layout with Premium Shadow and Glass Overlay */}
          <div className="w-full max-w-[400px] bg-white rounded-3xl border border-slate-100/80 shadow-[0_1px_3px_rgba(15,23,42,0.06),0_12px_24px_rgba(15,23,42,0.08)] overflow-hidden relative anim-scale-in stagger-1">
            
            {/* Subtle shimmer sweep */}
            <div 
              className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit]"
              style={{ zIndex: 1 }}
            >
              <div 
                className="absolute inset-0 -skew-x-12"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)',
                  animation: 'shimmerSweep 1.2s ease 0.3s both',
                  backgroundSize: '200% 100%',
                }}
              ></div>
            </div>

            {/* Top Ticket Header Banner */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white space-y-2 relative">
              {/* Ticket notch cutouts */}
              <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-slate-50 rounded-full border border-slate-100 shadow-inner"></div>
              <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-slate-50 rounded-full border border-slate-100 shadow-inner"></div>

              <div className="flex justify-between items-start">
                <span className="px-2 py-0.5 bg-white/20 text-white text-[10px] font-bold rounded border border-white/10 uppercase tracking-widest">
                  Premium Pass
                </span>
                <span className="text-xs font-extrabold text-blue-100 tracking-wide uppercase">
                  {visitCode}
                </span>
              </div>

              <div className="space-y-1 text-left">
                <h3 className="text-xl font-black tracking-tight">{projectName}</h3>
                <p className="text-[10px] text-blue-100/80 font-bold uppercase tracking-widest flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-blue-200" />
                  <span>Premium Living Spaces</span>
                </p>
              </div>
            </div>

            {/* Ticket Body: QR and Details */}
            <div className="p-6 sm:p-8 space-y-6 text-center">
              
              {/* SVG QR Code Illustration */}
              <div className="mx-auto w-40 h-40 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center p-4 shadow-inner anim-fade-up stagger-3">
                <svg viewBox="0 0 100 100" className="w-full h-full text-slate-800" fill="currentColor">
                  <rect x="0" y="0" width="25" height="25" />
                  <rect x="5" y="5" width="15" height="15" fill="white" />
                  <rect x="10" y="10" width="5" height="5" />
                  
                  <rect x="75" y="0" width="25" height="25" />
                  <rect x="80" y="5" width="15" height="15" fill="white" />
                  <rect x="85" y="10" width="5" height="5" />
                  
                  <rect x="0" y="75" width="25" height="25" />
                  <rect x="5" y="80" width="15" height="15" fill="white" />
                  <rect x="10" y="85" width="5" height="5" />

                  <rect x="35" y="10" width="10" height="15" />
                  <rect x="55" y="0" width="10" height="20" />
                  <rect x="30" y="35" width="15" height="5" />
                  <rect x="15" y="45" width="20" height="10" />
                  <rect x="45" y="50" width="30" height="15" />
                  <rect x="65" y="25" width="5" height="15" />
                  <rect x="80" y="40" width="15" height="15" />
                  <rect x="80" y="75" width="15" height="15" />
                  <rect x="40" y="75" width="20" height="10" />
                </svg>
              </div>

              {/* Visit Pass Details */}
              <div className="space-y-4 text-left border-y border-dashed border-slate-200 py-6">
                <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Customer Name</span>
                    <span className="text-slate-800 font-extrabold">{customerName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Broker Name</span>
                    <span className="text-slate-800 font-extrabold">{brokerName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Visit Date & Time</span>
                    <span className="text-slate-800 font-extrabold flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span>{visitDateTime.split(' at ')[0]}</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Expected Time</span>
                    <span className="text-slate-800 font-extrabold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span>{visitDateTime.split(' at ')[1] || '11:00 AM'}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={() => handleShare(customerName, activeLead.mobile)}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition-all shadow-[0_4px_14px_rgba(16,185,129,0.25)] cursor-pointer press pulse-glow"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share on WhatsApp</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="w-full flex items-center justify-center gap-2 py-3 border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 rounded-xl font-medium text-sm transition-all cursor-pointer press smooth"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Pass</span>
                </button>
              </div>

              <div className="pt-2 text-[10px] text-emerald-600 font-bold flex items-center justify-center gap-1 animate-pulse">
                <ShieldCheck className="w-4 h-4" />
                <span>Lead protected & verification lock active</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
