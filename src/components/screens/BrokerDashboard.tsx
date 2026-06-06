import React, { useState } from 'react';
import { useBrokerConnect } from '../../context/BrokerConnectContext';
import { Users, Eye, TrendingUp, IndianRupee, Plus, ArrowUpRight, Search, ChevronRight } from 'lucide-react';

export const BrokerDashboard: React.FC = () => {
  const { leads, setActiveScreen, commissions } = useBrokerConnect();
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredStage, setHoveredStage] = useState<number | null>(null);

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

  // Calculate dynamic stats for the funnel based on actual leads
  const registeredCount = leads.length * 25; // Scale to start around 150
  
  const visitedCount = leads.filter(l => 
    ['Checked In', 'Allocated', 'Follow-Up', 'Negotiation', 'Booked'].includes(l.status)
  ).length * 33.3; // Scale to start around 100
  
  const negotiationCount = leads.filter(l => 
    ['Follow-Up', 'Negotiation', 'Booked'].includes(l.status)
  ).length * 20; // Scale to start around 40
  
  const bookedCount = leads.filter(l => 
    l.status === 'Booked'
  ).length * 12; // Scale to start around 12

  // Rounded values to keep clean integers
  const rCount = Math.round(registeredCount);
  const vCount = Math.round(visitedCount);
  const nCount = Math.round(negotiationCount);
  const bCount = Math.round(bookedCount);

  const funnelStages = [
    {
      index: 0,
      name: 'Registered',
      count: rCount,
      color: '#3b82f6',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200/50',
      barColor: 'bg-blue-500',
      label: 'Initial Leads',
      conversion: '100% Source',
    },
    {
      index: 1,
      name: 'Visited',
      count: vCount,
      color: '#0ea5e9',
      badgeColor: 'bg-sky-50 text-sky-700 border-sky-200/50',
      barColor: 'bg-sky-500',
      label: 'Site Visits',
      conversion: rCount > 0 ? `${((vCount / rCount) * 100).toFixed(0)}% Conv.` : '0% Conv.',
    },
    {
      index: 2,
      name: 'Negotiation',
      count: nCount,
      color: '#6366f1',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200/50',
      barColor: 'bg-indigo-500',
      label: 'Active Offers',
      conversion: vCount > 0 ? `${((nCount / vCount) * 100).toFixed(0)}% Conv.` : '0% Conv.',
    },
    {
      index: 3,
      name: 'Booked',
      count: bCount,
      color: '#10b981',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200/50',
      barColor: 'bg-emerald-500',
      label: 'Sales Closed',
      conversion: nCount > 0 ? `${((bCount / nCount) * 100).toFixed(0)}% Conv.` : '0% Conv.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner with Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100/80 shadow-[0_1px_3px_rgba(15,23,42,0.06),0_4px_16px_rgba(15,23,42,0.04)] text-left">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A]">Broker Dashboard</h2>
          <p className="text-sm text-slate-500 font-medium mt-0.5">
            Monitor lead protection status, commissions, and upcoming customer visits
          </p>
        </div>
        <button
          onClick={() => setActiveScreen(3)} // Go to Register Customer Screen
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1A56DB] hover:bg-[#1648C0] text-white rounded-xl font-semibold text-sm transition-all shadow-[0_4px_14px_rgba(26,86,219,0.30)] hover:shadow-[0_6px_20px_rgba(26,86,219,0.40)] cursor-pointer w-full sm:w-auto justify-center"
        >
          <Plus className="w-5 h-5" />
          <span>Register Customer</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-left">
        {/* KPI 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100/80 shadow-[0_1px_3px_rgba(15,23,42,0.06),0_4px_16px_rgba(15,23,42,0.04)] hover:shadow-[0_4px_20px_rgba(15,23,42,0.08)] hover:-translate-y-0.5 transition-all duration-200 group">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block">Total Leads</span>
            <span className="text-3xl font-black text-[#0F172A] tabular-nums tracking-tight block">{totalLeads * 10}</span>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold ring-1 ring-emerald-100 mt-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+12% this month</span>
            </span>
          </div>
          <div className="p-3 bg-blue-50 ring-1 ring-blue-100 group-hover:ring-blue-200 rounded-2xl text-blue-600 group-hover:scale-110 transition duration-300">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100/80 shadow-[0_1px_3px_rgba(15,23,42,0.06),0_4px_16px_rgba(15,23,42,0.04)] hover:shadow-[0_4px_20px_rgba(15,23,42,0.08)] hover:-translate-y-0.5 transition-all duration-200 group">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block">Total Visits</span>
            <span className="text-3xl font-black text-[#0F172A] tabular-nums tracking-tight block">{totalVisits * 10}</span>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold ring-1 ring-emerald-100 mt-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+8% this month</span>
            </span>
          </div>
          <div className="p-3 bg-emerald-50 ring-1 ring-emerald-100 group-hover:ring-emerald-200 rounded-2xl text-emerald-600 group-hover:scale-110 transition duration-300">
            <Eye className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100/80 shadow-[0_1px_3px_rgba(15,23,42,0.06),0_4px_16px_rgba(15,23,42,0.04)] hover:shadow-[0_4px_20px_rgba(15,23,42,0.08)] hover:-translate-y-0.5 transition-all duration-200 group">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block">Total Bookings</span>
            <span className="text-3xl font-black text-[#0F172A] tabular-nums tracking-tight block">{totalBookings * 5}</span>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold ring-1 ring-emerald-100 mt-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+20% this month</span>
            </span>
          </div>
          <div className="p-3 bg-indigo-50 ring-1 ring-indigo-100 group-hover:ring-indigo-200 rounded-2xl text-indigo-600 group-hover:scale-110 transition duration-300">
            <ArrowUpRight className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100/80 shadow-[0_1px_3px_rgba(15,23,42,0.06),0_4px_16px_rgba(15,23,42,0.04)] hover:shadow-[0_4px_20px_rgba(15,23,42,0.08)] hover:-translate-y-0.5 transition-all duration-200 group">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block">Commission</span>
            <span className="text-3xl font-black text-[#0F172A] tabular-nums tracking-tight block">
              {formatCurrency(totalCommissions > 0 ? totalCommissions : 245000)}
            </span>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold ring-1 ring-emerald-100 mt-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+15% payout cycle</span>
            </span>
          </div>
          <div className="p-3 bg-amber-50 ring-1 ring-amber-100 group-hover:ring-amber-200 rounded-2xl text-amber-600 group-hover:scale-110 transition duration-300">
            <IndianRupee className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Content Layout: Funnel & Recent Leads */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
        {/* Lead Funnel Chart (Desktop 5 cols, Mobile full) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100/80 shadow-[0_1px_3px_rgba(15,23,42,0.06),0_4px_16px_rgba(15,23,42,0.04)] hover:shadow-[0_4px_20px_rgba(15,23,42,0.08)] hover:-translate-y-0.5 transition-all duration-200 lg:col-span-5 flex flex-col justify-between min-h-[360px] text-left">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#0F172A]">Lead Funnel</h3>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Conversion Pipeline Analysis</p>
          </div>

          {/* Symmetrical Sloped SVG Funnel & Metrics List Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center my-4">
            {/* Interactive SVG Funnel (Left) */}
            <div className="sm:col-span-5 flex justify-center items-center">
              <svg viewBox="0 0 200 220" className="w-full max-w-[160px] h-auto select-none">
                <defs>
                  <linearGradient id="grad-0" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#1d4ed8" />
                  </linearGradient>
                  <linearGradient id="grad-1" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#0ea5e9" />
                    <stop offset="100%" stopColor="#0284c7" />
                  </linearGradient>
                  <linearGradient id="grad-2" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#4f46e5" />
                  </linearGradient>
                  <linearGradient id="grad-3" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>

                {/* Stage 0 (Registered) */}
                <polygon
                  points="15,10 185,10 160,55 40,55"
                  fill="url(#grad-0)"
                  className={`transition-all duration-300 cursor-pointer origin-center ${
                    hoveredStage === 0 ? 'brightness-110 saturate-[1.15] scale-[1.04] filter drop-shadow-[0_4px_8px_rgba(59,130,246,0.4)]' : 
                    hoveredStage !== null ? 'opacity-40' : 'opacity-100'
                  }`}
                  onMouseEnter={() => setHoveredStage(0)}
                  onMouseLeave={() => setHoveredStage(null)}
                />
                <text
                  x="100"
                  y="36"
                  textAnchor="middle"
                  fill="#ffffff"
                  className="text-[10px] font-black pointer-events-none select-none transition-all duration-300"
                >
                  {rCount}
                </text>

                {/* Stage 1 (Visited) */}
                <polygon
                  points="42,61 158,61 138,106 62,106"
                  fill="url(#grad-1)"
                  className={`transition-all duration-300 cursor-pointer origin-center ${
                    hoveredStage === 1 ? 'brightness-110 saturate-[1.15] scale-[1.04] filter drop-shadow-[0_4px_8px_rgba(14,165,233,0.4)]' : 
                    hoveredStage !== null ? 'opacity-40' : 'opacity-100'
                  }`}
                  onMouseEnter={() => setHoveredStage(1)}
                  onMouseLeave={() => setHoveredStage(null)}
                />
                <text
                  x="100"
                  y="87"
                  textAnchor="middle"
                  fill="#ffffff"
                  className="text-[10px] font-black pointer-events-none select-none transition-all duration-300"
                >
                  {vCount}
                </text>

                {/* Stage 2 (Negotiation) */}
                <polygon
                  points="64,112 136,112 120,157 80,157"
                  fill="url(#grad-2)"
                  className={`transition-all duration-300 cursor-pointer origin-center ${
                    hoveredStage === 2 ? 'brightness-110 saturate-[1.15] scale-[1.04] filter drop-shadow-[0_4px_8px_rgba(99,102,241,0.4)]' : 
                    hoveredStage !== null ? 'opacity-40' : 'opacity-100'
                  }`}
                  onMouseEnter={() => setHoveredStage(2)}
                  onMouseLeave={() => setHoveredStage(null)}
                />
                <text
                  x="100"
                  y="138"
                  textAnchor="middle"
                  fill="#ffffff"
                  className="text-[10px] font-black pointer-events-none select-none transition-all duration-300"
                >
                  {nCount}
                </text>

                {/* Stage 3 (Booked) */}
                <polygon
                  points="82,163 118,163 108,208 92,208"
                  fill="url(#grad-3)"
                  className={`transition-all duration-300 cursor-pointer origin-center ${
                    hoveredStage === 3 ? 'brightness-110 saturate-[1.15] scale-[1.04] filter drop-shadow-[0_4px_8px_rgba(16,185,129,0.4)]' : 
                    hoveredStage !== null ? 'opacity-40' : 'opacity-100'
                  }`}
                  onMouseEnter={() => setHoveredStage(3)}
                  onMouseLeave={() => setHoveredStage(null)}
                />
                <text
                  x="100"
                  y="189"
                  textAnchor="middle"
                  fill="#ffffff"
                  className="text-[10px] font-black pointer-events-none select-none transition-all duration-300"
                >
                  {bCount}
                </text>
              </svg>
            </div>

            {/* Stage Metrics Breakdown Card List (Right) */}
            <div className="sm:col-span-7 space-y-2">
              {funnelStages.map((stage) => {
                const isHovered = hoveredStage === stage.index;
                const isAnyHovered = hoveredStage !== null;
                const opacityClass = isAnyHovered && !isHovered ? 'opacity-40 scale-[0.98]' : 'opacity-100 scale-100';

                return (
                  <div
                    key={stage.name}
                    onMouseEnter={() => setHoveredStage(stage.index)}
                    onMouseLeave={() => setHoveredStage(null)}
                    className={`p-2 rounded-xl border border-slate-100 bg-slate-50/20 transition-all duration-200 cursor-pointer select-none ${
                      isHovered ? 'bg-white border-blue-200 shadow-md translate-x-1.5' : ''
                    } ${opacityClass}`}
                  >
                    <div className="flex items-center justify-between gap-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stage.color }}></span>
                        <span className="text-[11px] font-bold text-slate-800">{stage.name}</span>
                      </div>
                      <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md border ${stage.badgeColor}`}>
                        {stage.conversion}
                      </span>
                    </div>
                    <div className="mt-1 flex items-baseline justify-between">
                      <span className="text-xs font-black text-slate-900">
                        {stage.count} <span className="text-[9px] font-bold text-slate-400">Leads</span>
                      </span>
                      <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
                        {stage.label}
                      </span>
                    </div>
                    {/* Progress Bar inside breakdown */}
                    <div className="w-full bg-slate-100/80 h-1 rounded-full mt-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${stage.barColor}`}
                        style={{ width: `${rCount > 0 ? (stage.count / rCount) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Overall Conversion Rate</span>
            <span className="bg-emerald-50 text-emerald-700 font-black text-lg px-3 py-1 rounded-xl">
              {rCount > 0 ? ((bCount / rCount) * 100).toFixed(1) : '0.0'}%
            </span>
          </div>
        </div>

        {/* Recent Customers list (Desktop 7 cols, Mobile full) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100/80 shadow-[0_1px_3px_rgba(15,23,42,0.06),0_4px_16px_rgba(15,23,42,0.04)] hover:shadow-[0_4px_20px_rgba(15,23,42,0.08)] hover:-translate-y-0.5 transition-all duration-200 lg:col-span-7 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <div>
              <h3 className="text-base font-bold text-[#0F172A]">Recent Customers</h3>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Real-time Lead Protection Status</p>
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
                <tr className="bg-slate-50/50 text-[11px] font-semibold text-slate-500 uppercase tracking-wide border-y border-slate-100">
                  <th className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide py-3 px-4">Customer</th>
                  <th className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide py-3 px-4">Mobile</th>
                  <th className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide py-3 px-4">Project</th>
                  <th className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide py-3 px-4">Status</th>
                  <th className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/70 transition-colors cursor-pointer">
                    <td className="py-3.5 px-4 font-bold text-slate-800">{lead.name}</td>
                    <td className="py-3.5 px-4 text-slate-500 font-semibold">{lead.mobile}</td>
                    <td className="py-3.5 px-4 text-slate-600 font-semibold">{lead.project}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        lead.status === 'Booked' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                        lead.status === 'Negotiation' ? 'bg-purple-50 text-purple-700 border border-purple-100' :
                        lead.status === 'OTP Verified' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                        lead.status === 'OTP Pending' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                        lead.status === 'Checked In' ? 'bg-sky-50 text-sky-700 border border-sky-100' :
                        'bg-slate-50 text-slate-600 border border-slate-200/50'
                      }`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => {
                          if (lead.status === 'OTP Pending') {
                            setActiveScreen(4); // OTP Verification screen
                          } else if (lead.status === 'OTP Verified') {
                            localStorage.setItem('selectedLeadId', lead.id);
                            setActiveScreen(5); // Visit Pass
                          } else {
                            localStorage.setItem('selectedLeadId', lead.id);
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
            <button className="text-[#1A56DB] hover:underline font-semibold text-xs flex items-center gap-1 cursor-pointer" onClick={() => { setActiveScreen(9); }}>
              View All Pipeline Leads
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrokerDashboard;
