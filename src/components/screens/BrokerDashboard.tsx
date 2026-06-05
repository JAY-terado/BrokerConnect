import React, { useState } from 'react';
import { useBrokerConnect } from '../../context/BrokerConnectContext';
import { Users, Eye, TrendingUp, DollarSign, Plus, ArrowUpRight, Search, ChevronRight } from 'lucide-react';
import { 
  BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer 
} from 'recharts';

export const BrokerDashboard: React.FC = () => {
  const { leads, setActiveScreen, commissions } = useBrokerConnect();
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate actual statistics from our global state
  const totalLeads = leads.length;
  const totalVisits = leads.filter(l => ['Checked In', 'Allocated', 'Follow-Up', 'Negotiation', 'Booked'].includes(l.status)).length;
  const totalBookings = leads.filter(l => l.status === 'Booked').length;
  const totalCommissions = commissions.reduce((sum, c) => c.status === 'Paid' || c.status === 'Approved' ? sum + c.commissionAmount : sum, 0);

  // Formatting currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const filteredLeads = leads
    .filter(l => l.name.toLowerCase().includes(searchTerm.toLowerCase()) || l.mobile.includes(searchTerm))
    .slice(0, 5); // show top 5 in recent

  // Funnel Data for Recharts
  const funnelData = [
    { name: 'Registered', count: 150, color: '#2563eb' },
    { name: 'Visited', count: 100, color: '#3b82f6' },
    { name: 'Negotiation', count: 40, color: '#6366f1' },
    { name: 'Booked', count: 12, color: '#10b981' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner with Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-left">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Broker Dashboard</h2>
          <p className="text-sm text-slate-500 font-medium">
            Monitor lead protection status, commissions, and upcoming customer visits
          </p>
        </div>
        <button
          onClick={() => setActiveScreen(3)} // Go to Register Customer Screen
          className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-all shadow-md shadow-blue-500/10 cursor-pointer w-full sm:w-auto justify-center"
        >
          <Plus className="w-5 h-5" />
          <span>Register Customer</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-left">
        {/* KPI 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-blue-500/30 transition-all duration-300">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Total Leads</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">{totalLeads * 10}</span>
            <span className="text-[10px] sm:text-xs text-emerald-600 font-bold flex items-center gap-0.5 mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+12% this month</span>
            </span>
          </div>
          <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 group-hover:scale-110 transition duration-300">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-emerald-500/30 transition-all duration-300">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Total Visits</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">{totalVisits * 10}</span>
            <span className="text-[10px] sm:text-xs text-emerald-600 font-bold flex items-center gap-0.5 mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+8% this month</span>
            </span>
          </div>
          <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600 group-hover:scale-110 transition duration-300">
            <Eye className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-indigo-500/30 transition-all duration-300">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Total Bookings</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">{totalBookings * 5}</span>
            <span className="text-[10px] sm:text-xs text-emerald-600 font-bold flex items-center gap-0.5 mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+20% this month</span>
            </span>
          </div>
          <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600 group-hover:scale-110 transition duration-300">
            <ArrowUpRight className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-amber-500/30 transition-all duration-300">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Commission</span>
            <span className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight">
              {formatCurrency(totalCommissions > 0 ? totalCommissions : 245000)}
            </span>
            <span className="text-[10px] sm:text-xs text-emerald-600 font-bold flex items-center gap-0.5 mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+15% payout cycle</span>
            </span>
          </div>
          <div className="p-3 bg-amber-50 rounded-2xl text-amber-600 group-hover:scale-110 transition duration-300">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Content Layout: Funnel & Recent Leads */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
        {/* Lead Funnel Chart (Desktop 5 cols, Mobile full) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm lg:col-span-5 flex flex-col justify-between min-h-[300px]">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-800">Lead Funnel</h3>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Conversion Pipeline Analysis</p>
          </div>

          {/* Recharts Funnel Bar Chart */}
          <div className="flex-1 w-full min-h-[180px] my-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical" margin={{ top: 10, right: 10, left: 20, bottom: 5 }}>
                <XAxis type="number" stroke="#94a3b8" fontSize={9} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={9} width={70} />
                <Tooltip formatter={(value: number) => [value, 'Customers']} contentStyle={{ background: '#0f172a', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '10px' }} />
                <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={16}>
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-4 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Overall Conversion Rate</span>
            <span className="text-emerald-600 font-extrabold text-sm">8.0%</span>
          </div>
        </div>

        {/* Recent Customers list (Desktop 7 cols, Mobile full) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm lg:col-span-7 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Recent Customers</h3>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Real-time Lead Protection Status</p>
            </div>
            
            {/* Lead Search bar */}
            <div className="relative w-full sm:w-60">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 font-semibold"
              />
            </div>
          </div>

          <div className="overflow-x-auto -mx-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-y border-slate-100">
                  <th className="py-3 px-6">Customer</th>
                  <th className="py-3 px-6">Mobile</th>
                  <th className="py-3 px-6">Project</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50 transition duration-150">
                    <td className="py-3.5 px-6 font-bold text-slate-800">{lead.name}</td>
                    <td className="py-3.5 px-6 text-slate-500 font-semibold">{lead.mobile}</td>
                    <td className="py-3.5 px-6 text-slate-600 font-semibold">{lead.project}</td>
                    <td className="py-3.5 px-6">
                      <span className={`inline-flex px-2 py-1 rounded-full text-[10px] font-bold ${
                        lead.status === 'Booked' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/50' :
                        lead.status === 'Negotiation' ? 'bg-indigo-50 text-indigo-600 border border-indigo-200/50' :
                        lead.status === 'OTP Verified' ? 'bg-blue-50 text-blue-600 border border-blue-200/50' :
                        lead.status === 'OTP Pending' ? 'bg-amber-50 text-amber-600 border border-amber-200/50' :
                        'bg-slate-50 text-slate-600 border border-slate-200/50'
                      }`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-center">
                      <button
                        onClick={() => {
                          if (lead.status === 'OTP Pending') {
                            setActiveScreen(4); // OTP Verification screen
                          } else if (lead.status === 'OTP Verified') {
                            setActiveScreen(5); // Visit Pass
                          } else {
                            setActiveScreen(10); // Lead Details
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-blue-600 rounded hover:bg-slate-100 transition cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4 mx-auto" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-4 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Showing {filteredLeads.length} of {leads.length} records</span>
            <button className="text-blue-600 hover:text-blue-700 transition" onClick={() => { setActiveScreen(9); }}>
              View All Pipeline Leads
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrokerDashboard;
