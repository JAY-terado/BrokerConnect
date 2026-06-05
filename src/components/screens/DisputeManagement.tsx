import React, { useState } from 'react';
import { useBrokerConnect } from '../../context/BrokerConnectContext';
import type { Dispute } from '../../context/BrokerConnectContext';
import { ArrowLeft, ShieldAlert, CheckCircle, XCircle, HelpCircle, FileText } from 'lucide-react';

export const DisputeManagement: React.FC = () => {
  const { disputes, resolveDispute, setActiveScreen } = useBrokerConnect();
  
  // Track selected dispute
  const [selectedDisputeId, setSelectedDisputeId] = useState<string>(disputes[0]?.id || '');
  const activeDispute = disputes.find(d => d.id === selectedDisputeId) || disputes[0];

  const handleResolve = (decision: 'brokerA' | 'brokerB' | 'reject') => {
    if (activeDispute) {
      resolveDispute(activeDispute.id, decision);
      alert(`Simulation: Dispute resolved. Ownership assigned: ${
        decision === 'brokerA' ? 'Broker A (' + activeDispute.brokerAName + ')' :
        decision === 'brokerB' ? 'Broker B (' + activeDispute.brokerBName + ')' :
        'Rejected both claims'
      }`);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header Panel */}
      <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveScreen(14)} // Go to reports/analytics dashboard
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-800 font-sans">Dispute Management</h2>
            <p className="text-xs text-slate-400 font-semibold tracking-wider uppercase">
              Admin Panel &gt; Channel Partner Conflict Auditing
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left List Pane: All disputes (Desktop 4 columns) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Active Disputes</h3>
            <div className="space-y-2">
              {disputes.map((disp) => (
                <button
                  key={disp.id}
                  onClick={() => setSelectedDisputeId(disp.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer block ${
                    selectedDisputeId === disp.id 
                      ? 'bg-blue-50/70 border-blue-600 shadow-sm' 
                      : 'bg-slate-50 border-slate-200/60 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider">{disp.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                      disp.status.includes('Resolved') ? 'bg-emerald-500 text-white' :
                      disp.status === 'Rejected' ? 'bg-rose-500 text-white' :
                      'bg-amber-500 text-white'
                    }`}>
                      {disp.status}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-800 block">{disp.customerName}</span>
                  <span className="text-[10px] text-slate-400 font-medium block mt-0.5">Mobile: {disp.mobile}</span>
                </button>
              ))}

              {disputes.length === 0 && (
                <div className="text-center text-xs text-slate-400 py-6 font-medium">
                  No active disputes logs.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Detail Pane: Active Dispute verification sheet */}
        {activeDispute ? (
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-400 block uppercase">Dispute Audit Worksheet</span>
                <h3 className="text-base font-extrabold text-slate-800">Duplicate customer: {activeDispute.customerName}</h3>
              </div>
              <span className="text-xs font-extrabold text-slate-700 bg-slate-50 border px-2.5 py-1 rounded">
                Raised: {activeDispute.raisedOn}
              </span>
            </div>

            {/* Claims columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-xl space-y-2 text-xs">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Broker A (Primary Claim)</span>
                <span className="text-sm font-extrabold text-slate-800 block">{activeDispute.brokerAName}</span>
                <span className="text-[10px] text-slate-400 font-medium block">ID: {activeDispute.brokerAId}</span>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-xl space-y-2 text-xs">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Broker B (Secondary Claim)</span>
                <span className="text-sm font-extrabold text-slate-800 block">{activeDispute.brokerBName}</span>
                <span className="text-[10px] text-slate-400 font-medium block">ID: {activeDispute.brokerBId}</span>
              </div>
            </div>

            {/* Verification checklist items */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Audit Evidence checklist</h4>
              
              <div className="space-y-2 text-xs font-semibold text-slate-700">
                <div className="flex items-center gap-2.5 p-3.5 bg-slate-50 border border-slate-200/50 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span>Broker A locked customer mobile identity via SMS OTP: <strong className="text-emerald-600">Verified</strong></span>
                </div>

                <div className="flex items-center gap-2.5 p-3.5 bg-slate-50 border border-slate-200/50 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span>Primary Claim registered on timestamp: <strong className="text-slate-800">{activeDispute.registrationTime}</strong></span>
                </div>

                <div className="flex items-center gap-2.5 p-3.5 bg-slate-50 border border-slate-200/50 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span>Customer visit history logs recorded: <strong className="text-slate-800">{activeDispute.visitHistory} site visits</strong></span>
                </div>

                <div className="flex items-center gap-2.5 p-3.5 bg-slate-50 border border-slate-200/50 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span>Customer consent callback audit: <strong className="text-emerald-600">Confirmed</strong></span>
                </div>
              </div>
            </div>

            {/* Conflict resolution actions */}
            {activeDispute.status === 'Under Review' ? (
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
                <button
                  onClick={() => handleResolve('brokerA')}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition shadow-md shadow-blue-500/10 cursor-pointer text-center"
                >
                  Approve Broker A
                </button>
                <button
                  onClick={() => handleResolve('brokerB')}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition shadow-md shadow-indigo-500/10 cursor-pointer text-center"
                >
                  Approve Broker B
                </button>
                <button
                  onClick={() => handleResolve('reject')}
                  className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition cursor-pointer text-center"
                >
                  Reject Both
                </button>
              </div>
            ) : (
              <div className="p-4 bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl text-center">
                Dispute Status: {activeDispute.status}
              </div>
            )}
          </div>
        ) : (
          <div className="lg:col-span-8 flex items-center justify-center p-8 bg-white border border-slate-100 rounded-2xl shadow-sm text-slate-400 font-semibold text-xs text-center">
            Select an active dispute to inspect evidence.
          </div>
        )}

      </div>
    </div>
  );
};
