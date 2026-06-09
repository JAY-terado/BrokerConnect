import React, { useState } from 'react';
import { useBrokerConnect } from '../../../context/BrokerConnectContext';
import { Search, Plus, UserPlus, ShieldAlert, CheckCircle, RefreshCw } from 'lucide-react';

export const BrokerManagement: React.FC = () => {
  const { brokers, addBroker, approveBroker, toggleBrokerStatus, setActiveScreen } = useBrokerConnect();
  
  // Tab filters
  const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'Active' | 'Suspended'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Onboarding Form
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');

  const filteredBrokers = brokers.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) || b.mobile.includes(searchTerm);
    if (activeTab === 'All') return matchesSearch;
    if (activeTab === 'Pending') return matchesSearch && b.status === 'Pending Approval';
    if (activeTab === 'Active') return matchesSearch && b.status === 'Active';
    if (activeTab === 'Suspended') return matchesSearch && b.status === 'Suspended';
    return matchesSearch;
  });

  const handleAddBrokerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && mobile.trim()) {
      addBroker(name, mobile);
      setName('');
      setMobile('');
      setShowAddForm(false);
      alert('Simulation: New broker registered! Awaiting admin approval.');
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100/80 shadow-[0_1px_3px_rgba(15,23,42,0.06),0_4px_16px_rgba(15,23,42,0.04)] anim-fade-up">
        <div>
          <h2 className="text-lg font-bold text-[#0F172A]">Broker Management</h2>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mt-0.5">
            Manage channel partner verification status, commission percentages, and account states
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1A56DB] hover:bg-[#1648C0] text-white rounded-xl font-semibold text-sm transition-all shadow-[0_4px_14px_rgba(26,86,219,0.25)] hover:shadow-[0_6px_20px_rgba(26,86,219,0.35)] cursor-pointer w-full sm:w-auto justify-center press pulse-glow"
        >
          <Plus className="w-5 h-5" />
          <span>Add Broker</span>
        </button>
      </div>

      {/* Tabs Selector & Search */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100/80 shadow-[0_1px_3px_rgba(15,23,42,0.06),0_4px_16px_rgba(15,23,42,0.04)] space-y-4 anim-fade-up stagger-2">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          {/* Tabs */}
          <div className="flex border-b border-slate-100 overflow-x-auto gap-4 text-xs font-bold text-slate-400 uppercase tracking-wider pb-2 w-full md:w-auto">
            <button
              onClick={() => setActiveTab('All')}
              className={`pb-1 transition whitespace-nowrap cursor-pointer ${activeTab === 'All' ? 'text-blue-600 border-b-2 border-blue-600' : 'hover:text-slate-600'}`}
            >
              All Brokers
            </button>
            <button
              onClick={() => setActiveTab('Pending')}
              className={`pb-1 transition whitespace-nowrap cursor-pointer ${activeTab === 'Pending' ? 'text-blue-600 border-b-2 border-blue-600' : 'hover:text-slate-600'}`}
            >
              Pending Approval
            </button>
            <button
              onClick={() => setActiveTab('Active')}
              className={`pb-1 transition whitespace-nowrap cursor-pointer ${activeTab === 'Active' ? 'text-blue-600 border-b-2 border-blue-600' : 'hover:text-slate-600'}`}
            >
              Active
            </button>
            <button
              onClick={() => setActiveTab('Suspended')}
              className={`pb-1 transition whitespace-nowrap cursor-pointer ${activeTab === 'Suspended' ? 'text-blue-600 border-b-2 border-blue-600' : 'hover:text-slate-600'}`}
            >
              Suspended
            </button>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-64">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search brokers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:shadow-[0_0_0_4px_rgba(26,86,219,0.08)] transition-shadow duration-200 placeholder:text-slate-400 text-slate-700"
            />
          </div>
        </div>

        {/* Brokers Grid */}
        <div className="overflow-x-auto -mx-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-100">
                <th className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide bg-slate-50/70 py-3 px-4">Broker ID</th>
                <th className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide bg-slate-50/70 py-3 px-4">Broker Name</th>
                <th className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide bg-slate-50/70 py-3 px-4">Mobile Number</th>
                <th className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide bg-slate-50/70 py-3 px-4 text-center">Status</th>
                <th className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide bg-slate-50/70 py-3 px-4 text-center">Action Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredBrokers.map((broker, index) => (
                <tr key={broker.id} style={{ animationDelay: `${index * 0.04}s` }} className="hover:bg-slate-50/60 transition-colors cursor-pointer even:bg-slate-50/30 anim-fade-up">
                  <td className="py-4 px-4 font-extrabold text-blue-600">{broker.id}</td>
                  <td className="py-4 px-4 text-sm font-semibold text-slate-800">{broker.name}</td>
                  <td className="py-4 px-4 text-xs text-slate-500 font-medium">{broker.mobile}</td>
                  <td className="py-4 px-4 text-center">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold smooth ${
                      broker.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                      broker.status === 'Suspended' ? 'bg-red-50 text-red-700 border border-red-100' :
                      'bg-amber-50 text-amber-700 border border-amber-100'
                    }`}>
                      {broker.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex gap-2 justify-center">
                      {broker.status === 'Pending Approval' && (
                        <button
                          onClick={() => approveBroker(broker.id)}
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-600 font-bold border border-emerald-200 rounded transition cursor-pointer"
                        >
                          Approve
                        </button>
                      )}
                      
                      <button
                        onClick={() => toggleBrokerStatus(broker.id)}
                        className={`px-2.5 py-1 font-bold border rounded transition cursor-pointer ${
                          broker.status === 'Active' 
                            ? 'bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 border-rose-200' 
                            : 'bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 border-blue-200'
                        }`}
                      >
                        {broker.status === 'Active' ? 'Suspend' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredBrokers.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8">
                    <div className="flex flex-col items-center justify-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-12 text-center">
                      <Search className="w-8 h-8 text-slate-400 mb-2" />
                      <span className="text-slate-400 text-sm font-medium">No brokers matching selection.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Broker Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 anim-fade-in">
          <form onSubmit={handleAddBrokerSubmit} className="bg-white p-6 sm:p-8 rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 space-y-5 text-left anim-scale-in">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="text-lg font-bold text-[#0F172A] flex items-center gap-1.5">
                <UserPlus className="w-5 h-5 text-blue-600" />
                <span>Onboard New Broker</span>
              </h3>
              <button 
                type="button" 
                onClick={() => setShowAddForm(false)} 
                className="text-slate-400 hover:text-slate-600 text-lg font-black transition"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Broker Name *</label>
                <input
                  type="text"
                  placeholder="Enter full agency name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-shadow duration-200 placeholder:text-slate-400 text-slate-800"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Mobile Number *</label>
                <input
                  type="text"
                  placeholder="e.g. 98765 00000"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="block w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-shadow duration-200 placeholder:text-slate-400 text-slate-800"
                  required
                />
              </div>
            </div>

            <div className="flex gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="flex-1 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 rounded-xl font-medium text-sm transition-all press smooth"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-[#1A56DB] hover:bg-[#1648C0] text-white rounded-xl font-semibold text-sm transition-all shadow-[0_4px_14px_rgba(26,86,219,0.25)] hover:shadow-[0_6px_20px_rgba(26,86,219,0.35)] cursor-pointer press pulse-glow"
              >
                Submit Broker
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
