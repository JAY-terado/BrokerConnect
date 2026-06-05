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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Project Management</h2>
          <p className="text-sm text-slate-500 font-medium">
            Manage real estate inventories, configurations, and active project locations
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-all shadow-md shadow-blue-500/10 cursor-pointer w-full sm:w-auto justify-center"
        >
          <Plus className="w-5 h-5" />
          <span>Add Project</span>
        </button>
      </div>

      {/* Search and Table List */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Active Inventories</h3>
          
          <div className="relative w-full sm:w-64">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-700"
            />
          </div>
        </div>

        {/* Projects grid */}
        <div className="overflow-x-auto -mx-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-y border-slate-100">
                <th className="py-3 px-6">Project Name</th>
                <th className="py-3 px-6">Location</th>
                <th className="py-3 px-6 text-center">Towers</th>
                <th className="py-3 px-6 text-center">Units</th>
                <th className="py-3 px-6 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredProjects.map((proj) => (
                <tr key={proj.name} className="hover:bg-slate-50 transition duration-150">
                  <td className="py-4 px-6 font-bold text-slate-800">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4.5 h-4.5 text-blue-600" />
                      <span>{proj.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-500 font-medium">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{proj.location}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-600 font-medium text-center">{proj.towers}</td>
                  <td className="py-4 px-6 text-slate-600 font-medium text-center">{proj.units}</td>
                  <td className="py-4 px-6 text-center">
                    <span className={`inline-flex px-2.5 py-0.5 rounded font-extrabold text-[10px] uppercase ${
                      proj.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/50' :
                      'bg-amber-50 text-amber-600 border border-amber-200/50'
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
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-1.5">
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
                <label className="text-xs font-bold text-slate-600 uppercase">Project Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Sunrise Meadows"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-800"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase">Location *</label>
                <input
                  type="text"
                  placeholder="e.g. Sector 45, Noida"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-800"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 uppercase">Total Towers</label>
                  <input
                    type="number"
                    placeholder="2"
                    value={towers}
                    onChange={(e) => setTowers(e.target.value)}
                    className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-800"
                    required
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 uppercase">Total Units</label>
                  <input
                    type="number"
                    placeholder="100"
                    value={units}
                    onChange={(e) => setUnits(e.target.value)}
                    className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-800"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase">Status</label>
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
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition shadow-md"
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
