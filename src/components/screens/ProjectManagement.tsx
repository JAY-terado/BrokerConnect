import React, { useState } from 'react';
import { useBrokerConnect } from '../../context/BrokerConnectContext';
import { Search, Plus, Building2, MapPin, Grid, Layers } from 'lucide-react';
import { CustomSelect } from '../CustomSelect';

export const ProjectManagement: React.FC = () => {
  const { projects, addProject, setActiveScreen } = useBrokerConnect();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Add Project Form States
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [towers, setTowers] = useState('2');
  const [units, setUnits] = useState('100');
  const [status, setStatus] = useState<'Active' | 'Upcoming'>('Active');

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && location.trim() && towers && units) {
      addProject({
        name: name.trim(),
        location: location.trim(),
        towers: Number(towers),
        units: Number(units),
        status,
      });
      setName('');
      setLocation('');
      setTowers('2');
      setUnits('100');
      setStatus('Active');
      setShowAddForm(false);
      alert('Simulation: New project launched! Channel partners can now register leads under this project.');
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100/80 shadow-[0_1px_3px_rgba(15,23,42,0.06),0_4px_16px_rgba(15,23,42,0.04)]">
        <div>
          <h2 className="text-lg font-bold text-[#0F172A]">Project Management</h2>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mt-0.5">
            Manage real estate inventories, configurations, and active project locations
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1A56DB] hover:bg-[#1648C0] text-white rounded-xl font-semibold text-sm transition-all shadow-[0_4px_14px_rgba(26,86,219,0.25)] hover:shadow-[0_6px_20px_rgba(26,86,219,0.35)] cursor-pointer w-full sm:w-auto justify-center"
        >
          <Plus className="w-5 h-5" />
          <span>Add Project</span>
        </button>
      </div>

      {/* Search and Table List */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100/80 shadow-[0_1px_3px_rgba(15,23,42,0.06),0_4px_16px_rgba(15,23,42,0.04)] space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider">Active Inventories</h3>
          
          <div className="relative w-full sm:w-64">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-shadow duration-200 placeholder:text-slate-400 text-slate-700"
            />
          </div>
        </div>

        {/* Projects grid */}
        <div className="overflow-x-auto -mx-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-100">
                <th className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide bg-slate-50/70 py-3 px-4">Project Name</th>
                <th className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide bg-slate-50/70 py-3 px-4">Location</th>
                <th className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide bg-slate-50/70 py-3 px-4 text-center">Towers</th>
                <th className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide bg-slate-50/70 py-3 px-4 text-center">Units</th>
                <th className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide bg-slate-50/70 py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredProjects.map((proj) => (
                <tr key={proj.name} className="hover:bg-slate-50/60 transition-colors cursor-pointer even:bg-slate-50/30">
                  <td className="py-4 px-4 text-sm font-semibold text-slate-800">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4.5 h-4.5 text-blue-600" />
                      <span>{proj.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-xs text-slate-500 font-medium">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{proj.location}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-600 font-medium text-center">{proj.towers}</td>
                  <td className="py-4 px-4 text-slate-600 font-medium text-center">{proj.units}</td>
                  <td className="py-4 px-4 text-center">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      proj.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                      'bg-amber-50 text-amber-700 border border-amber-100'
                    }`}>
                      {proj.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Project Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in-95 duration-200 text-left">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="text-lg font-bold text-[#0F172A] flex items-center gap-1.5">
                <Building2 className="w-5 h-5 text-blue-600" />
                <span>Add New Project</span>
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
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Project Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Sunrise Meadows"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-shadow duration-200 placeholder:text-slate-400 text-slate-800"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Location *</label>
                <input
                  type="text"
                  placeholder="e.g. Sector 45, Noida"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="block w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-shadow duration-200 placeholder:text-slate-400 text-slate-800"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Total Towers</label>
                  <input
                    type="number"
                    placeholder="2"
                    value={towers}
                    onChange={(e) => setTowers(e.target.value)}
                    className="block w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-shadow duration-200 placeholder:text-slate-400 text-slate-800"
                    required
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Total Units</label>
                  <input
                    type="number"
                    placeholder="100"
                    value={units}
                    onChange={(e) => setUnits(e.target.value)}
                    className="block w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-shadow duration-200 placeholder:text-slate-400 text-slate-800"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Status</label>
                <CustomSelect
                  value={status}
                  onChange={(val) => setStatus(val as any)}
                  options={['Active', 'Upcoming']}
                  placeholder="Select Status"
                  icon={Layers}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="flex-1 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 rounded-xl font-medium text-sm transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-[#1A56DB] hover:bg-[#1648C0] text-white rounded-xl font-semibold text-sm transition-all shadow-[0_4px_14px_rgba(26,86,219,0.25)] hover:shadow-[0_6px_20px_rgba(26,86,219,0.35)] cursor-pointer"
              >
                Submit Project
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
