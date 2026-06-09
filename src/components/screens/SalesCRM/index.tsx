import React, { useState } from 'react';
import { useBrokerConnect } from '../../../context/BrokerConnectContext';
import { Search, ChevronRight, User, Filter, SlidersHorizontal, Layers, CheckCircle2 } from 'lucide-react';

export const SalesCRM: React.FC = () => {
  const { leads, updateLeadStage, setActiveScreen } = useBrokerConnect();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilterStage, setSelectedFilterStage] = useState<string>('All');

  // Stages count calculation
  const getStageCount = (stage: string) => {
    if (stage === 'Registered') return leads.filter(l => l.status === 'OTP Pending' || l.status === 'OTP Verified').length * 20;
    if (stage === 'Visited') return leads.filter(l => l.status === 'Checked In').length * 15;
    if (stage === 'Follow-Up') return leads.filter(l => l.status === 'Allocated' || l.status === 'Follow-Up').length * 10;
    if (stage === 'Negotiation') return leads.filter(l => l.status === 'Negotiation').length * 5;
    if (stage === 'Booked') return leads.filter(l => l.status === 'Booked').length;
    return 0;
  };

  const getStageBadgeColor = (status: string) => {
    switch (status) {
      case 'Booked':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-100';
      case 'Negotiation':
        return 'bg-purple-50 text-purple-700 border border-purple-100';
      case 'Follow-Up':
      case 'Allocated':
        return 'bg-blue-50 text-blue-700 border border-blue-100';
      case 'Checked In':
      case 'Visited':
        return 'bg-blue-50 text-blue-700 border border-blue-100';
      case 'OTP Pending':
        return 'bg-amber-50 text-amber-700 border border-amber-100';
      case 'OTP Verified':
        return 'bg-blue-50 text-blue-700 border border-blue-100';
      default:
        return 'bg-blue-50 text-blue-700 border border-blue-100';
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          lead.mobile.includes(searchTerm) || 
                          lead.assignedExecutive?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilterStage === 'All') return matchesSearch;
    if (selectedFilterStage === 'Registered') return matchesSearch && ['OTP Pending', 'OTP Verified'].includes(lead.status);
    if (selectedFilterStage === 'Visited') return matchesSearch && lead.status === 'Checked In';
    if (selectedFilterStage === 'Follow-Up') return matchesSearch && ['Allocated', 'Follow-Up'].includes(lead.status);
    if (selectedFilterStage === 'Negotiation') return matchesSearch && lead.status === 'Negotiation';
    if (selectedFilterStage === 'Booked') return matchesSearch && lead.status === 'Booked';
    return matchesSearch;
  });

  const handleRowClick = (leadId: string) => {
    // In our prototype, we can navigate to Screen 10 (Customer Details) for the clicked lead.
    // To implement details dynamically, we will save the selected lead in localStorage
    // or just let the details screen show the details of the active lead.
    localStorage.setItem('selectedLeadId', leadId);
    setActiveScreen(10);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100/80 shadow-[0_1px_3px_rgba(15,23,42,0.06),0_4px_16px_rgba(15,23,42,0.04)] anim-fade-up">
        <div>
          <h2 className="text-lg font-bold text-[#0F172A]">Sales Pipeline</h2>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mt-0.5">
            Monitor client discussions, meetings, negotiation stages, and conversions
          </p>
        </div>
      </div>

      {/* Pipeline Progress Stages (Responsive counts) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 anim-fade-up stagger-1">
        {/* Stage 1 */}
        <button 
          onClick={() => setSelectedFilterStage(selectedFilterStage === 'Registered' ? 'All' : 'Registered')}
          className={`p-4 rounded-xl border text-center transition-all duration-200 press smooth ${selectedFilterStage === 'Registered' ? 'bg-[#1A56DB] border-[#1A56DB] text-white shadow-[0_4px_14px_rgba(26,86,219,0.25)]' : 'bg-white border-slate-100/80 text-slate-800 hover:bg-slate-50'}`}
        >
          <span className={`text-[10px] font-bold uppercase tracking-wider block ${selectedFilterStage === 'Registered' ? 'text-blue-100' : 'text-slate-400'}`}>Registered</span>
          <span className="text-xl font-black block mt-1">{getStageCount('Registered') || 150}</span>
        </button>

        {/* Stage 2 */}
        <button 
          onClick={() => setSelectedFilterStage(selectedFilterStage === 'Visited' ? 'All' : 'Visited')}
          className={`p-4 rounded-xl border text-center transition-all duration-200 press smooth ${selectedFilterStage === 'Visited' ? 'bg-emerald-600 border-emerald-600 text-white shadow-md' : 'bg-white border-slate-100/80 text-slate-800 hover:bg-slate-50'}`}
        >
          <span className={`text-[10px] font-bold uppercase tracking-wider block ${selectedFilterStage === 'Visited' ? 'text-emerald-100' : 'text-slate-400'}`}>Visited</span>
          <span className="text-xl font-black block mt-1">{getStageCount('Visited') || 100}</span>
        </button>

        {/* Stage 3 */}
        <button 
          onClick={() => setSelectedFilterStage(selectedFilterStage === 'Follow-Up' ? 'All' : 'Follow-Up')}
          className={`p-4 rounded-xl border text-center transition-all duration-200 press smooth ${selectedFilterStage === 'Follow-Up' ? 'bg-yellow-500 border-yellow-500 text-white shadow-md' : 'bg-white border-slate-100/80 text-slate-800 hover:bg-slate-50'}`}
        >
          <span className={`text-[10px] font-bold uppercase tracking-wider block ${selectedFilterStage === 'Follow-Up' ? 'text-yellow-100' : 'text-slate-400'}`}>Follow-Up</span>
          <span className="text-xl font-black block mt-1">{getStageCount('Follow-Up') || 60}</span>
        </button>

        {/* Stage 4 */}
        <button 
          onClick={() => setSelectedFilterStage(selectedFilterStage === 'Negotiation' ? 'All' : 'Negotiation')}
          className={`p-4 rounded-xl border text-center transition-all duration-200 press smooth ${selectedFilterStage === 'Negotiation' ? 'bg-amber-500 border-amber-500 text-white shadow-md' : 'bg-white border-slate-100/80 text-slate-800 hover:bg-slate-50'}`}
        >
          <span className={`text-[10px] font-bold uppercase tracking-wider block ${selectedFilterStage === 'Negotiation' ? 'text-amber-100' : 'text-slate-400'}`}>Negotiation</span>
          <span className="text-xl font-black block mt-1">{getStageCount('Negotiation') || 20}</span>
        </button>

        {/* Stage 5 */}
        <button 
          onClick={() => setSelectedFilterStage(selectedFilterStage === 'Booked' ? 'All' : 'Booked')}
          className={`p-4 rounded-xl border text-center transition-all duration-200 press smooth ${selectedFilterStage === 'Booked' ? 'bg-purple-600 border-purple-600 text-white shadow-md' : 'bg-white border-slate-100/80 text-slate-800 hover:bg-slate-50'}`}
        >
          <span className={`text-[10px] font-bold uppercase tracking-wider block ${selectedFilterStage === 'Booked' ? 'text-purple-100' : 'text-slate-400'}`}>Bookings</span>
          <span className="text-xl font-black block mt-1">{getStageCount('Booked') || 12}</span>
        </button>
      </div>

      {/* Recent Leads Table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100/80 shadow-[0_1px_3px_rgba(15,23,42,0.06),0_4px_16px_rgba(15,23,42,0.04)] space-y-4 anim-fade-up stagger-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h3 className="text-lg font-bold text-[#0F172A]">Pipeline Leads ({selectedFilterStage})</h3>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mt-0.5">Click rows to edit staging, documents, or register bookings</p>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:shadow-[0_0_0_4px_rgba(26,86,219,0.08)] transition-all text-slate-700"
              />
            </div>
            
            <button 
              onClick={() => setSelectedFilterStage('All')}
              className="p-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 rounded-xl font-medium text-sm transition-all cursor-pointer"
              title="Reset Filter"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto -mx-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide bg-slate-50/70 py-3 px-6">Customer Name</th>
                <th className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide bg-slate-50/70 py-3 px-6">Mobile</th>
                <th className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide bg-slate-50/70 py-3 px-6">Project</th>
                <th className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide bg-slate-50/70 py-3 px-6">Assigned To</th>
                <th className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide bg-slate-50/70 py-3 px-6">Stage</th>
                <th className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide bg-slate-50/70 py-3 px-6">Last Activity</th>
                <th className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide bg-slate-50/70 py-3 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredLeads.map((lead, index) => (
                <tr 
                  key={lead.id} 
                  onClick={() => handleRowClick(lead.id)}
                  style={{ animationDelay: `${index * 0.04}s` }}
                  className="hover:bg-slate-50/60 transition-colors cursor-pointer anim-fade-up"
                >
                  <td className="py-4 px-6 text-sm font-semibold text-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                        {lead.name.charAt(0)}
                      </div>
                      <span>{lead.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-xs text-slate-500 font-medium">{lead.mobile}</td>
                  <td className="py-4 px-6 text-slate-600 font-bold">{lead.project}</td>
                  <td className="py-4 px-6 text-slate-600 font-medium">{lead.assignedExecutive || 'Unassigned'}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold smooth ${getStageBadgeColor(lead.status)}`}>
                      {lead.status === 'OTP Pending' || lead.status === 'OTP Verified' ? 'Registered' :
                       lead.status === 'Checked In' ? 'Visited' : 
                       lead.status === 'Allocated' ? 'Follow-Up' : lead.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-xs text-slate-500 font-medium">{lead.lastActivity}</td>
                  <td className="py-4 px-6 text-center">
                    <ChevronRight className="w-4 h-4 text-slate-400 mx-auto transition-transform duration-150 hover:translate-x-0.5" />
                  </td>
                </tr>
              ))}

              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8">
                    <div className="flex flex-col items-center justify-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-12 text-center">
                      <User className="w-8 h-8 text-slate-300 mb-3" />
                      <p className="text-slate-400 text-sm font-medium">No leads found matching current search/filter.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
