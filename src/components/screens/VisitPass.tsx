import React from 'react';
import { useBrokerConnect } from '../../context/BrokerConnectContext';
import { ArrowLeft, Share2, Download, CheckCircle, Clock, Calendar, ShieldCheck, MapPin } from 'lucide-react';

export const VisitPass: React.FC = () => {
  const { leads, setActiveScreen } = useBrokerConnect();

  // Find the most recently verified lead, or fallback to the first verified lead
  const latestVerifiedLead = leads.find(l => ['OTP Verified', 'Checked In', 'Allocated', 'Booked', 'Follow-Up', 'Negotiation'].includes(l.status)) || leads[0];
  
  const customerName = latestVerifiedLead?.name || 'Rahul Shah';
  const visitCode = latestVerifiedLead?.visitCode || 'VIS-2026-45891';
  const brokerName = latestVerifiedLead?.brokerName || 'Amit Patel';
  const visitDateTime = latestVerifiedLead 
    ? `${latestVerifiedLead.expectedDate} at ${latestVerifiedLead.expectedTime}` 
    : '15 May 2026, 11:00 AM';
  const projectName = latestVerifiedLead?.project || 'Sunrise Meadows';

  const handleShare = () => {
    alert(`Simulation: Visit Pass link shared with ${customerName} (+91 ${latestVerifiedLead?.mobile}) on WhatsApp!`);
  };

  const handleDownload = () => {
    alert('Simulation: Downloading Visit Pass PDF ticket...');
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveScreen(2)}
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Visit Pass</h2>
            <p className="text-xs text-slate-400 font-semibold tracking-wider uppercase">
              Broker Portal &gt; Registration Ticket Generated
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveScreen(2)}
          className="text-xs font-bold text-blue-600 hover:text-blue-700 transition"
        >
          Go back to Dashboard
        </button>
      </div>

      <div className="flex items-center justify-center p-4">
        {/* Ticket Layout with Premium Shadow and Glass Overlay */}
        <div className="w-full max-w-[420px] bg-white rounded-3xl border border-slate-100 shadow-2xl overflow-hidden relative">
          
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
            <div className="mx-auto w-44 h-44 bg-slate-50 border-2 border-slate-100 rounded-2xl flex items-center justify-center p-4 shadow-inner">
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
                onClick={handleShare}
                className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-emerald-500/10 cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Share on WhatsApp</span>
              </button>
              <button
                onClick={handleDownload}
                className="w-full flex items-center justify-center gap-2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm transition-all cursor-pointer"
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
  );
};
