import React, { useState } from 'react';
import { useBrokerConnect } from '../../context/BrokerConnectContext';
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 font-sans">Reception Dashboard</h2>
          <p className="text-sm text-slate-500 font-medium">
            Manage visitor validation, document uploads, and sales executive allocation on arrival
          </p>
        </div>
        <button
          onClick={handleScanQR}
          className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-all shadow-md shadow-blue-500/10 cursor-pointer w-full sm:w-auto justify-center"
        >
          <QrCode className="w-5 h-5" />
          <span>Scan QR Code</span>
        </button>
      </div>

      {/* Stats Board */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Today's Visits</span>
          <span className="text-3xl font-extrabold text-slate-800 block mt-1">35</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Checked In</span>
          <span className="text-3xl font-extrabold text-emerald-600 block mt-1">{checkedInVisitors.length + 20}</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Expected</span>
          <span className="text-3xl font-extrabold text-blue-600 block mt-1">{expectedVisitors.length + 5}</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Cancelled</span>
          <span className="text-3xl font-extrabold text-rose-600 block mt-1">0</span>
        </div>
      </div>

      {/* Lists Layout */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Expected Visitors Today</h3>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Validate visitor passes on entry</p>
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
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-700"
            />
          </div>
        </div>

        {/* Expected visitors table */}
        <div className="overflow-x-auto -mx-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-y border-slate-100">
                <th className="py-3 px-6">Visit ID</th>
                <th className="py-3 px-6">Customer Name</th>
                <th className="py-3 px-6">Broker Name</th>
                <th className="py-3 px-6">Project</th>
                <th className="py-3 px-6">Scheduled Time</th>
                <th className="py-3 px-6 text-center">Status</th>
                <th className="py-3 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {expectedVisitors.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 font-semibold">
                    No matching expected visitors found. (Register a customer in Broker view to see them here!)
                  </td>
                </tr>
              ) : (
                expectedVisitors.map((visitor) => (
                  <tr key={visitor.id} className="hover:bg-slate-50 transition duration-150">
                    <td className="py-4 px-6 font-extrabold text-blue-600">{visitor.visitCode}</td>
                    <td className="py-4 px-6 font-bold text-slate-800">{visitor.name}</td>
                    <td className="py-4 px-6 text-slate-500 font-medium">{visitor.brokerName}</td>
                    <td className="py-4 px-6 text-slate-600 font-bold">{visitor.project}</td>
                    <td className="py-4 px-6 text-slate-500 font-medium">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{visitor.expectedTime}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200/50 rounded-full font-bold text-[10px]">
                        Expected
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => handleStartCheckIn(visitor.id)}
                        className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 rounded-xl text-xs font-bold transition cursor-pointer mx-auto shadow-sm"
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
