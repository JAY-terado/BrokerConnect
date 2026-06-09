import React, { useState } from 'react';
import { useBrokerConnect } from '../../../context/BrokerConnectContext';
import { Search, QrCode, UserCheck, Calendar, Clock, LogIn, ChevronRight } from 'lucide-react';

export const ReceptionDashboard: React.FC = () => {
  const { leads, setActiveScreen } = useBrokerConnect();
  const [searchQuery, setSearchQuery] = useState('');

  // Expected Visitors: OTP Verified but not checked in yet
  const expectedVisitors = leads.filter(l => 
    l.status === 'OTP Verified' &&
    (l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     l.visitCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
     l.mobile.includes(searchQuery))
  );

  // Already Checked-In/Allocated list
  const checkedInVisitors = leads.filter(l => 
    ['Checked In', 'Allocated', 'Follow-Up', 'Negotiation', 'Booked'].includes(l.status)
  );

  const handleScanQR = () => {
    // Pick the first expected lead to simulate checking in
    const firstExpected = leads.find(l => l.status === 'OTP Verified');
    if (firstExpected) {
      alert(`Simulation: QR Code scan success for customer: ${firstExpected.name} (Code: ${firstExpected.visitCode})`);
      // Simulates navigation to Check-In form
      setActiveScreen(7);
    } else {
      alert('Simulation: No pending OTP Verified visits found to check-in.');
    }
  };

  const handleStartCheckIn = (leadId: string) => {
    // Temporarily save selected lead ID in local storage or context if needed
    // In our context, we can just transition to Screen 7 and it will bind to the correct pending lead.
    setActiveScreen(7);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100/80 shadow-[0_1px_3px_rgba(15,23,42,0.06),0_4px_16px_rgba(15,23,42,0.04)] anim-fade-up">
        <div>
          <h2 className="text-lg font-bold text-[#0F172A] font-sans">Reception Dashboard</h2>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mt-0.5">
            Manage visitor validation, document uploads, and sales executive allocation on arrival
          </p>
        </div>
        <button
          onClick={handleScanQR}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1A56DB] hover:bg-[#1648C0] text-white rounded-xl font-semibold text-sm transition-all shadow-[0_4px_14px_rgba(26,86,219,0.25)] hover:shadow-[0_6px_20px_rgba(26,86,219,0.35)] cursor-pointer w-full sm:w-auto justify-center press pulse-glow"
        >
          <QrCode className="w-5 h-5" />
          <span>Scan QR Code</span>
        </button>
      </div>

      {/* Stats Board */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="bg-white p-5 rounded-2xl border border-slate-100/80 shadow-[0_1px_3px_rgba(15,23,42,0.06),0_4px_16px_rgba(15,23,42,0.04)] anim-fade-up stagger-1 card-hover">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Today's Visits</span>
          <span className="text-3xl font-extrabold text-[#0F172A] block mt-1 anim-number stagger-1">35</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100/80 shadow-[0_1px_3px_rgba(15,23,42,0.06),0_4px_16px_rgba(15,23,42,0.04)] anim-fade-up stagger-2 card-hover">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Checked In</span>
          <span className="text-3xl font-extrabold text-emerald-600 block mt-1 anim-number stagger-2">{checkedInVisitors.length + 20}</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100/80 shadow-[0_1px_3px_rgba(15,23,42,0.06),0_4px_16px_rgba(15,23,42,0.04)] anim-fade-up stagger-3 card-hover">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Expected</span>
          <span className="text-3xl font-extrabold text-blue-600 block mt-1 anim-number stagger-3">{expectedVisitors.length + 5}</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100/80 shadow-[0_1px_3px_rgba(15,23,42,0.06),0_4px_16px_rgba(15,23,42,0.04)] anim-fade-up stagger-4 card-hover">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Cancelled</span>
          <span className="text-3xl font-extrabold text-rose-600 block mt-1 anim-number stagger-4">0</span>
        </div>
      </div>

      {/* Lists Layout */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100/80 shadow-[0_1px_3px_rgba(15,23,42,0.06),0_4px_16px_rgba(15,23,42,0.04)] space-y-5 anim-fade-up stagger-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h3 className="text-base font-bold text-[#0F172A]">Expected Visitors Today</h3>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Validate visitor passes on entry</p>
          </div>
          
          <div className="relative w-full sm:w-64">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search by Pass ID, Name or Mobile..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-shadow duration-200 placeholder:text-slate-400 text-slate-700"
            />
          </div>
        </div>

        {/* Expected visitors table */}
        <div className="overflow-x-auto -mx-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-100">
                <th className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide bg-slate-50/70 py-3 px-4">Visit ID</th>
                <th className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide bg-slate-50/70 py-3 px-4">Customer Name</th>
                <th className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide bg-slate-50/70 py-3 px-4">Broker Name</th>
                <th className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide bg-slate-50/70 py-3 px-4">Project</th>
                <th className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide bg-slate-50/70 py-3 px-4">Scheduled Time</th>
                <th className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide bg-slate-50/70 py-3 px-4 text-center">Status</th>
                <th className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide bg-slate-50/70 py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {expectedVisitors.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8">
                    <div className="flex flex-col items-center justify-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-12 text-center">
                      <Search className="w-8 h-8 text-slate-400 mb-2" />
                      <span className="text-slate-400 text-sm font-medium">No matching expected visitors found. (Register a customer in Broker view to see them here!)</span>
                    </div>
                  </td>
                </tr>
              ) : (
                expectedVisitors.map((visitor, index) => (
                  <tr key={visitor.id} style={{ animationDelay: `${index * 0.05}s` }} className="hover:bg-slate-50/60 transition-colors cursor-pointer even:bg-slate-50/30 anim-fade-up">
                    <td className="py-4 px-4 font-extrabold text-blue-600">{visitor.visitCode}</td>
                    <td className="py-4 px-4 text-sm font-semibold text-slate-800">{visitor.name}</td>
                    <td className="py-4 px-4 text-xs text-slate-500 font-medium">{visitor.brokerName}</td>
                    <td className="py-4 px-4 text-slate-600 font-bold">{visitor.project}</td>
                    <td className="py-4 px-4 text-xs text-slate-500 font-medium">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{visitor.expectedTime}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-[10px] font-bold">
                        Expected
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => handleStartCheckIn(visitor.id)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-[#1A56DB] hover:bg-[#1648C0] text-white rounded-xl font-semibold text-xs transition-all shadow-[0_4px_14px_rgba(26,86,219,0.25)] hover:shadow-[0_6px_20px_rgba(26,86,219,0.35)] cursor-pointer mx-auto shadow-sm"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        <span>Check In</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
