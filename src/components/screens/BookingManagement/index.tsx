import React, { useState } from 'react';
import { useBrokerConnect } from '../../../context/BrokerConnectContext';
import { ArrowLeft, Landmark, CheckCircle, Percent, Building } from 'lucide-react';

export const BookingManagement: React.FC = () => {
  const { leads, createBooking, setActiveScreen } = useBrokerConnect();

  // Find the first client that is in negotiation or allocated state to book
  const negotiableLead = leads.find(l => ['Negotiation', 'Allocated', 'Checked In'].includes(l.status)) || leads[0];
  const customerName = negotiableLead?.name || 'Rahul Shah';
  const projectName = negotiableLead?.project || 'Sunrise Meadows';

  // Form states
  const [tower, setTower] = useState('Tower A');
  const [floor, setFloor] = useState('Floor 12');
  const [unitNo, setUnitNo] = useState('1203');
  const [bookingAmount, setBookingAmount] = useState('500000');
  const [agreementValue, setAgreementValue] = useState('8500000');
  const [status, setStatus] = useState<'Booked' | 'Cancelled'>('Booked');

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tower || !floor || !unitNo || !bookingAmount || !agreementValue) {
      setError('Please fill in all booking fields');
      return;
    }

    setError('');
    
    // Call Context action
    createBooking({
      leadId: negotiableLead.id,
      customerName,
      project: projectName,
      tower,
      floor,
      unitNo,
      bookingAmount: Number(bookingAmount),
      agreementValue: Number(agreementValue),
    });

    setSuccessMsg('Booking saved! Commission ledger updated automatically.');
    
    setTimeout(() => {
      setSuccessMsg('');
      setActiveScreen(12); // Redirect to Commission Management Screen
    }, 1200);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header Panel */}
      <div className="flex items-center gap-3 bg-white p-5 rounded-2xl border border-slate-100/80 shadow-[0_1px_3px_rgba(15,23,42,0.06),0_4px_16px_rgba(15,23,42,0.04)] anim-fade-up">
        <button
          onClick={() => setActiveScreen(10)}
          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-lg font-bold text-[#0F172A]">Booking Management</h2>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mt-0.5">
            Sales Desk &gt; Allocate Inventory &amp; Finalize Sale
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Details Panel (Desktop 8 columns) */}
        <form onSubmit={handleCreateBooking} className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-2xl border border-slate-100/80 shadow-[0_1px_3px_rgba(15,23,42,0.06),0_4px_16px_rgba(15,23,42,0.04)] space-y-6 anim-fade-up stagger-2">
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold animate-pulse">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-xl text-xs font-bold animate-bounce flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/60">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Customer &amp; Project choice</span>
              <span className="text-sm font-semibold text-slate-800">{customerName} &middot; {projectName}</span>
            </div>
          </div>

          {/* Unit details */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#0F172A] border-b border-slate-100 pb-2">
              Unit details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Tower</label>
                <input
                  type="text"
                  placeholder="e.g. Tower A"
                  value={tower}
                  onChange={(e) => setTower(e.target.value)}
                  className="block w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:shadow-[0_0_0_4px_rgba(26,86,219,0.08)] transition-shadow duration-200 placeholder:text-slate-400 text-slate-800"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Floor</label>
                <input
                  type="text"
                  placeholder="e.g. Floor 12"
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                  className="block w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:shadow-[0_0_0_4px_rgba(26,86,219,0.08)] transition-shadow duration-200 placeholder:text-slate-400 text-slate-800"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Unit No.</label>
                <input
                  type="text"
                  placeholder="e.g. 1203"
                  value={unitNo}
                  onChange={(e) => setUnitNo(e.target.value)}
                  className="block w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:shadow-[0_0_0_4px_rgba(26,86,219,0.08)] transition-shadow duration-200 placeholder:text-slate-400 text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Financial details */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#0F172A] border-b border-slate-100 pb-2">
              Financial details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Booking token Amount (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 500000"
                  value={bookingAmount}
                  onChange={(e) => setBookingAmount(e.target.value)}
                  className="block w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-shadow duration-200 placeholder:text-slate-400 text-slate-800"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Total Agreement Value (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 8500000"
                  value={agreementValue}
                  onChange={(e) => setAgreementValue(e.target.value)}
                  className="block w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-shadow duration-200 placeholder:text-slate-400 text-slate-800"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => setActiveScreen(10)}
              className="flex-1 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 rounded-xl font-medium text-sm transition-all text-center press smooth"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-[#1A56DB] hover:bg-[#1648C0] text-white rounded-xl font-semibold text-sm transition-all shadow-[0_4px_14px_rgba(26,86,219,0.25)] hover:shadow-[0_6px_20px_rgba(26,86,219,0.35)] cursor-pointer text-center press pulse-glow"
            >
              Submit Booking
            </button>
          </div>
        </form>

        {/* Sidebar Guide Info (Desktop 4 columns) */}
        <div className="hidden lg:block lg:col-span-4 bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-6 rounded-2xl border border-slate-800 shadow-lg space-y-4 h-fit anim-fade-up stagger-3">
          <h4 className="text-sm font-bold tracking-wider uppercase text-blue-400">Commission Trigger</h4>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            Completing the booking form will trigger several system actions automatically:
          </p>
          <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside">
            <li>Moves the client pipeline stage to <strong className="text-white">Booked</strong>.</li>
            <li>Calculates the partner broker's commission ledger entry (fixed at <strong className="text-white">2.0%</strong>).</li>
            <li>Creates a payout record pending approval by the Admin Panel.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
