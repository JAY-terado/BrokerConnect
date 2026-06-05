import React, { useState } from 'react';
import { useBrokerConnect } from '../../context/BrokerConnectContext';
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
        return 'bg-purple-50 text-purple-600 border border-purple-200/55';
      case 'Negotiation':
        return 'bg-amber-50 text-amber-600 border border-amber-200/55';
      case 'Follow-Up':
        return 'bg-yellow-50 text-yellow-600 border border-yellow-200/55';
      case 'Checked In':
      case 'Visited':
        return 'bg-emerald-50 text-emerald-600 border border-emerald-200/55';
      default:
        return 'bg-blue-50 text-blue-600 border border-blue-200/55';
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Sales Pipeline</h2>
          <p className="text-sm text-slate-500 font-medium">
            Monitor client discussions, meetings, negotiation stages, and conversions
          </p>
        </div>
      </div>

      {/* Pipeline Progress Stages (Responsive counts) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {/* Stage 1 */}
        <button 
          onClick={() => setSelectedFilterStage(selectedFilterStage === 'Registered' ? 'All' : 'Registered')}
          className={`p-4 rounded-xl border text-center transition-all ${selectedFilterStage === 'Registered' ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-white border-slate-100 text-slate-800 hover:bg-slate-50'}`}
        >
          <span className={`text-[10px] font-bold uppercase tracking-wider block ${selectedFilterStage === 'Registered' ? 'text-blue-100' : 'text-slate-400'}`}>Registered</span>
          <span className="text-xl font-black block mt-1">{getStageCount('Registered') || 150}</span>
        </button>

        {/* Stage 2 */}
        <button 
          onClick={() => setSelectedFilterStage(selectedFilterStage === 'Visited' ? 'All' : 'Visited')}
          className={`p-4 rounded-xl border text-center transition-all ${selectedFilterStage === 'Visited' ? 'bg-emerald-600 border-emerald-600 text-white shadow-md' : 'bg-white border-slate-100 text-slate-800 hover:bg-slate-50'}`}
        >
          <span className={`text-[10px] font-bold uppercase tracking-wider block ${selectedFilterStage === 'Visited' ? 'text-emerald-100' : 'text-slate-400'}`}>Visited</span>
          <span className="text-xl font-black block mt-1">{getStageCount('Visited') || 100}</span>
        </button>

        {/* Stage 3 */}
        <button 
          onClick={() => setSelectedFilterStage(selectedFilterStage === 'Follow-Up' ? 'All' : 'Follow-Up')}
          className={`p-4 rounded-xl border text-center transition-all ${selectedFilterStage === 'Follow-Up' ? 'bg-yellow-500 border-yellow-500 text-white shadow-md' : 'bg-white border-slate-100 text-slate-800 hover:bg-slate-50'}`}
        >
          <span className={`text-[10px] font-bold uppercase tracking-wider block ${selectedFilterStage === 'Follow-Up' ? 'text-yellow-100' : 'text-slate-400'}`}>Follow-Up</span>
          <span className="text-xl font-black block mt-1">{getStageCount('Follow-Up') || 60}</span>
        </button>

        {/* Stage 4 */}
        <button 
          onClick={() => setSelectedFilterStage(selectedFilterStage === 'Negotiation' ? 'All' : 'Negotiation')}
          className={`p-4 rounded-xl border text-center transition-all ${selectedFilterStage === 'Negotiation' ? 'bg-amber-500 border-amber-500 text-white shadow-md' : 'bg-white border-slate-100 text-slate-800 hover:bg-slate-50'}`}
        >
          <span className={`text-[10px] font-bold uppercase tracking-wider block ${selectedFilterStage === 'Negotiation' ? 'text-amber-100' : 'text-slate-400'}`}>Negotiation</span>
          <span className="text-xl font-black block mt-1">{getStageCount('Negotiation') || 20}</span>
        </button>

        {/* Stage 5 */}
        <button 
          onClick={() => setSelectedFilterStage(selectedFilterStage === 'Booked' ? 'All' : 'Booked')}
          className={`p-4 rounded-xl border text-center transition-all ${selectedFilterStage === 'Booked' ? 'bg-purple-600 border-purple-600 text-white shadow-md' : 'bg-white border-slate-100 text-slate-800 hover:bg-slate-50'}`}
        >
          <span className={`text-[10px] font-bold uppercase tracking-wider block ${selectedFilterStage === 'Booked' ? 'text-purple-100' : 'text-slate-400'}`}>Bookings</span>
          <span className="text-xl font-black block mt-1">{getStageCount('Booked') || 12}</span>
        </button>
      </div>

      {/* Recent Leads Table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Pipeline Leads ({selectedFilterStage})</h3>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Click rows to edit staging, documents, or register bookings</p>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-700"
              />
            </div>
            
            <button 
              onClick={() => setSelectedFilterStage('All')}
              className="p-2.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-xl text-slate-500 transition cursor-pointer"
              title="Reset Filter"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto -mx-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-y border-slate-100">
                <th className="py-3 px-6">Customer Name</th>
                <th className="py-3 px-6">Mobile</th>
                <th className="py-3 px-6">Project</th>
                <th className="py-3 px-6">Assigned To</th>
                <th className="py-3 px-6">Stage</th>
                <th className="py-3 px-6">Last Activity</th>
                <th className="py-3 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredLeads.map((lead) => (
                <tr 
                  key={lead.id} 
                  onClick={() => handleRowClick(lead.id)}
                  className="hover:bg-slate-50 cursor-pointer transition duration-150"
                >
                  <td className="py-4 px-6 font-bold text-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                        {lead.name.charAt(0)}
                      </div>
                      <span>{lead.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-500 font-medium">{lead.mobile}</td>
                  <td className="py-4 px-6 text-slate-600 font-bold">{lead.project}</td>
                  <td className="py-4 px-6 text-slate-600 font-medium">{lead.assignedExecutive || 'Unassigned'}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-extrabold ${getStageBadgeColor(lead.status)}`}>
                      {lead.status === 'OTP Pending' || lead.status === 'OTP Verified' ? 'Registered' :
                       lead.status === 'Checked In' ? 'Visited' : 
                       lead.status === 'Allocated' ? 'Follow-Up' : lead.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-500 font-medium">{lead.lastActivity}</td>
                  <td className="py-4 px-6 text-center">
                    <ChevronRight className="w-4 h-4 text-slate-400 mx-auto" />
                  </td>
                </tr>
              ))}

              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 font-medium">
                    No leads found matching current search/filter.
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
