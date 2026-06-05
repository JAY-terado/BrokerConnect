import React, { useState, useEffect } from 'react';
import { useBrokerConnect } from '../../context/BrokerConnectContext';
import { ArrowLeft, UserCheck, ShieldAlert, Sparkles, RefreshCw, CheckCircle } from 'lucide-react';

export const SalesAllocation: React.FC = () => {
  const { leads, reallocateSales, setActiveScreen, setCurrentRole } = useBrokerConnect();
  
  // Get the most recently allocated lead
  const latestAllocatedLead = leads.find(l => l.status === 'Allocated') || leads[0];
  const assignedExec = latestAllocatedLead?.assignedExecutive || 'Executive B';
  const visitCode = latestAllocatedLead?.visitCode || 'VIS-2026-45891';
  
  const [currentAllocated, setCurrentAllocated] = useState(assignedExec);
  const [isAllocating, setIsAllocating] = useState(false);
  const [allocationFinished, setAllocationFinished] = useState(true);

  // List of executives
  const executives = ['Executive A', 'Executive B', 'Executive C', 'Executive D'];

  const handleReallocate = () => {
    setIsAllocating(true);
    setAllocationFinished(false);

    // Simulate allocation rolling animation
    let count = 0;
    const interval = setInterval(() => {
      setCurrentAllocated(executives[count % executives.length]);
      count++;
      if (count > 8) {
        clearInterval(interval);
        // Find next index or just pick Executive C
        const nextExec = executives[(executives.indexOf(currentAllocated) + 1) % executives.length];
        setCurrentAllocated(nextExec);
        reallocateSales(latestAllocatedLead.id, nextExec);
        setIsAllocating(false);
        setAllocationFinished(true);
      }
    }, 120);
  };

  const handleProceed = () => {
    // Transition to Sales CRM Pipeline (Screen 9) and switch role to Sales
    setCurrentRole('sales');
    setActiveScreen(9);
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveScreen(6)}
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Sales Allocation</h2>
            <p className="text-xs text-slate-400 font-semibold tracking-wider uppercase">
              Reception Desk &gt; Automated Agent Assignment
            </p>
          </div>
        </div>
        <span className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 uppercase tracking-widest">
          {visitCode}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Side: Circular Status Display */}
        <div className="lg:col-span-6 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center space-y-6 text-center">
          
          <div className="relative">
            {/* Spinning/pulsing aura */}
            <div className={`absolute inset-0 rounded-full blur-xl opacity-20 bg-blue-500 ${isAllocating ? 'animate-pulse' : ''}`}></div>
            
            {/* Big avatar ring */}
            <div className="relative w-44 h-44 rounded-full border-4 border-slate-100 flex items-center justify-center p-2 bg-slate-50 shadow-inner">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex flex-col items-center justify-center text-white p-4 shadow-lg">
                <UserCheck className={`w-12 h-12 mb-1.5 ${isAllocating ? 'animate-spin' : ''}`} />
                <span className="text-[10px] text-blue-200 font-bold uppercase tracking-wider block">Allocated to</span>
                <span className="text-sm font-extrabold tracking-tight">{currentAllocated}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded border border-blue-100 uppercase tracking-widest">
              Round Robin Order Rule
            </span>
            <h3 className="text-lg font-black text-slate-800">
              {isAllocating ? 'Allocating Sales Representative...' : `Allocated to ${currentAllocated}`}
            </h3>
            <p className="text-xs text-slate-500 font-semibold max-w-xs mx-auto leading-relaxed">
              Customer <strong className="text-slate-700">{latestAllocatedLead?.name || 'Rahul Shah'}</strong> is automatically assigned based on sales queue availability.
            </p>
          </div>
        </div>

        {/* Right Side: Round Robin Queue Order */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="space-y-1 text-left">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Sales Queue Lineup</h3>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Round Robin Order Sequence</p>
            </div>

            <div className="space-y-2.5">
              {executives.map((exec, idx) => {
                const isSelected = currentAllocated === exec;
                return (
                  <div
                    key={exec}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-all duration-300 ${
                      isSelected
                        ? 'bg-blue-50/70 border-blue-600 shadow-sm'
                        : 'bg-slate-50 border-slate-200/60 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {idx + 1}
                      </span>
                      <span className={`text-xs font-bold ${isSelected ? 'text-slate-800' : 'text-slate-600'}`}>
                        {exec}
                      </span>
                    </div>

                    {isSelected && (
                      <span className="text-[10px] text-blue-600 font-bold bg-blue-100 px-2 py-0.5 rounded uppercase tracking-wider">
                        Assigned
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100 text-left">
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              <span>Allocation Time</span>
              <span className="text-slate-600">
                {latestAllocatedLead?.allocationTime || '15 May 2026, 11:05 AM'}
              </span>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleReallocate}
                disabled={isAllocating}
                className="flex-1 flex items-center justify-center gap-1.5 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reallocate Agent</span>
              </button>

              <button
                type="button"
                onClick={handleProceed}
                disabled={isAllocating}
                className="flex-1 flex items-center justify-center gap-1.5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition shadow-md shadow-blue-500/10 cursor-pointer"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Proceed to Meeting</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
