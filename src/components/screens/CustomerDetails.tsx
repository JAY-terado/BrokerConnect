import React, { useState } from 'react';
import { useBrokerConnect } from '../../context/BrokerConnectContext';
import { ArrowLeft, Edit2, Calendar, Phone, Mail, MapPin, CheckSquare, Clock, Sliders, ChevronDown, Landmark } from 'lucide-react';

export const CustomerDetails: React.FC = () => {
  const { leads, updateLeadStage, setActiveScreen } = useBrokerConnect();

  // Find the selected lead or default to Rahul Shah
  const selectedLeadId = localStorage.getItem('selectedLeadId');
  const activeLead = leads.find(l => l.id === selectedLeadId) || leads[0];

  const [activeTab, setActiveTab] = useState<'details' | 'visits' | 'followup' | 'docs' | 'notes'>('details');
  const [newNote, setNewNote] = useState('');
  const [notes, setNotes] = useState<string[]>([
    'Customer interested in higher floor units with sea view.',
    'Visit completed successfully. Executive B guided through site layout.'
  ]);

  if (!activeLead) {
    return <div className="p-8 text-center text-slate-400">Loading customer details...</div>;
  }

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNote.trim()) {
      setNotes(prev => [...prev, newNote.trim()]);
      setNewNote('');
    }
  };

  const handleStageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateLeadStage(activeLead.id, e.target.value as any);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveScreen(9)}
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Customer Details</h2>
            <p className="text-xs text-slate-400 font-semibold tracking-wider uppercase">
              Sales Desk &gt; Client Profile &amp; Timeline
            </p>
          </div>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          {/* Stage advance selector */}
          <div className="relative flex-1 sm:w-44">
            <select
              value={activeLead.status}
              onChange={handleStageChange}
              className="w-full bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 py-2.5 pl-3 pr-8 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-600 appearance-none cursor-pointer"
            >
              <option value="OTP Verified">Registered</option>
              <option value="Checked In">Visited</option>
              <option value="Allocated">Follow-Up</option>
              <option value="Negotiation">Negotiation</option>
              <option value="Booked">Booked</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
          </div>

          <button
            onClick={() => setActiveScreen(11)} // Navigate to booking management form
            className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-md cursor-pointer"
          >
            <Landmark className="w-4 h-4" />
            <span>Create Booking</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Card: Customer Profile Summary */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6 self-start">
          <div className="text-center space-y-3 pb-6 border-b border-slate-50">
            <div className="mx-auto w-16 h-16 bg-blue-50 text-blue-600 border border-blue-100 rounded-full flex items-center justify-center text-2xl font-black shadow-inner">
              {activeLead.name.charAt(0)}
            </div>
            
            <div className="space-y-0.5">
              <h3 className="text-lg font-black text-slate-800">{activeLead.name}</h3>
              <span className="text-[10px] text-blue-600 font-extrabold bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full uppercase tracking-widest inline-block">
                {activeLead.status}
              </span>
            </div>
          </div>

          <div className="space-y-4 text-xs font-semibold text-slate-600">
            <div className="flex items-center gap-3">
              <Phone className="w-4.5 h-4.5 text-slate-400 shrink-0" />
              <span>{activeLead.mobile}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4.5 h-4.5 text-slate-400 shrink-0" />
              <span className="break-all">{activeLead.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-4.5 h-4.5 text-slate-400 shrink-0" />
              <span>{activeLead.address || activeLead.city || 'Noida, Uttar Pradesh'}</span>
            </div>
          </div>

          {/* Lead Protection valid badge */}
          <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 space-y-1 text-center">
            <span className="text-[9px] text-emerald-600 font-bold uppercase tracking-wider block">Lead Protection Guaranteed</span>
            <span className="text-xs font-bold text-slate-700 block">
              Valid Till: {activeLead.ownershipValidTill}
            </span>
          </div>
        </div>

        {/* Right Card: Tabs & Details Panel */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            {/* Tabs Selector */}
            <div className="flex border-b border-slate-100 -mx-6 px-6 overflow-x-auto gap-4 text-xs font-bold text-slate-400 uppercase tracking-wider pb-3.5">
              <button
                onClick={() => setActiveTab('details')}
                className={`pb-1 transition whitespace-nowrap cursor-pointer ${activeTab === 'details' ? 'text-blue-600 border-b-2 border-blue-600' : 'hover:text-slate-600'}`}
              >
                Requirement Details
              </button>
              <button
                onClick={() => setActiveTab('visits')}
                className={`pb-1 transition whitespace-nowrap cursor-pointer ${activeTab === 'visits' ? 'text-blue-600 border-b-2 border-blue-600' : 'hover:text-slate-600'}`}
              >
                Visit History
              </button>
              <button
                onClick={() => setActiveTab('docs')}
                className={`pb-1 transition whitespace-nowrap whitespace-nowrap cursor-pointer ${activeTab === 'docs' ? 'text-blue-600 border-b-2 border-blue-600' : 'hover:text-slate-600'}`}
              >
                Documents
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`pb-1 transition whitespace-nowrap whitespace-nowrap cursor-pointer ${activeTab === 'notes' ? 'text-blue-600 border-b-2 border-blue-600' : 'hover:text-slate-600'}`}
              >
                Agent Notes
              </button>
            </div>

            {/* Tab 1: Details */}
            {activeTab === 'details' && (
              <div className="pt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Project Choice</span>
                    <span className="text-sm font-extrabold text-slate-800">{activeLead.project}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Unit Type</span>
                    <span className="text-sm font-extrabold text-slate-800">{activeLead.unitType}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Budget Range</span>
                    <span className="text-sm font-extrabold text-slate-800">{activeLead.budget}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Sales Agent</span>
                    <span className="text-sm font-extrabold text-slate-800">{activeLead.assignedExecutive || 'Unassigned'}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Accompanying Family</span>
                    <span className="text-sm font-extrabold text-slate-800">Rahul Shah (Self), Priya Shah (Wife)</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Broker Account</span>
                    <span className="text-sm font-extrabold text-blue-600">{activeLead.brokerName} ({activeLead.brokerId})</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Timeline logs */}
            {activeTab === 'visits' && (
              <div className="pt-6 space-y-5">
                <div className="relative border-l border-slate-100 pl-4 space-y-5">
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white"></div>
                    <div className="text-xs space-y-0.5">
                      <span className="font-extrabold text-slate-800">Customer registered by channel partner</span>
                      <span className="text-[10px] text-slate-400 font-bold block">{activeLead.registeredOn}</span>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white"></div>
                    <div className="text-xs space-y-0.5">
                      <span className="font-extrabold text-slate-800">SMS Verification OTP lock verified</span>
                      <span className="text-[10px] text-slate-400 font-bold block">{activeLead.registeredOn}</span>
                    </div>
                  </div>
                  {['Checked In', 'Allocated', 'Follow-Up', 'Negotiation', 'Booked'].includes(activeLead.status) && (
                    <div className="relative">
                      <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white"></div>
                      <div className="text-xs space-y-0.5">
                        <span className="font-extrabold text-slate-800">Checked-in at reception desk</span>
                        <span className="text-[10px] text-slate-400 font-bold block">05 June 2026, 11:00 AM</span>
                      </div>
                    </div>
                  )}
                  {['Allocated', 'Follow-Up', 'Negotiation', 'Booked'].includes(activeLead.status) && (
                    <div className="relative">
                      <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-blue-500 border border-white"></div>
                      <div className="text-xs space-y-0.5">
                        <span className="font-extrabold text-slate-800">Sales Executive assigned via Round Robin queue</span>
                        <span className="text-[10px] text-slate-400 font-bold block">{activeLead.allocationTime}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 3: Documents Checklist */}
            {activeTab === 'docs' && (
              <div className="pt-6 space-y-4 text-xs font-semibold">
                <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200/60 rounded-xl">
                  <span>PAN Card Registration Proof</span>
                  <span className="text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded font-extrabold text-[10px] uppercase border border-emerald-100">
                    Uploaded
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200/60 rounded-xl">
                  <span>Aadhaar Identity Verification</span>
                  <span className="text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded font-extrabold text-[10px] uppercase border border-emerald-100">
                    Uploaded
                  </span>
                </div>
              </div>
            )}

            {/* Tab 4: Agent Notes */}
            {activeTab === 'notes' && (
              <div className="pt-6 space-y-5">
                <div className="space-y-3">
                  {notes.map((note, idx) => (
                    <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200/60 rounded-xl text-xs text-slate-700 leading-relaxed font-semibold">
                      {note}
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddNote} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter discussion logs..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-800"
                  />
                  <button
                    type="submit"
                    className="px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition cursor-pointer"
                  >
                    Add Log
                  </button>
                </form>
              </div>
            )}

          </div>

          <div className="pt-6 border-t border-slate-50 text-[10px] text-slate-400 font-bold uppercase tracking-wider flex justify-between mt-8">
            <span>Customer ID: {activeLead.id}</span>
            <span>Last Updated: {activeLead.lastActivity}</span>
          </div>
        </div>

      </div>
    </div>
  );
};
