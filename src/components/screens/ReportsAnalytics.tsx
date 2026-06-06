import React, { useState } from 'react';
import { useBrokerConnect } from '../../context/BrokerConnectContext';
import { Award, BarChart4, Calendar } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar
} from 'recharts';

export const ReportsAnalytics: React.FC = () => {
  const { leads } = useBrokerConnect();
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const descriptions: Record<string, string> = {
        'Reg ➜ Visit': 'Percentage of registered CP leads who completed front desk check-in.',
        'Visit ➜ Discuss': 'Percentage of checked-in visitors assigned to active sales executives.',
        'Discuss ➜ Book': 'Percentage of sales allocations successfully closed as final bookings.',
      };
      return (
        <div className="bg-slate-900 border border-slate-800 text-white p-3 rounded-xl shadow-xl max-w-[200px] text-left space-y-1">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">{data.name}</p>
          <p className="text-sm font-black text-blue-400">{data.ratio}% <span className="text-[10px] text-slate-400 font-bold">Conversion</span></p>
          <p className="text-[9px] text-slate-400 leading-normal font-semibold mt-1">
            {descriptions[data.name] || 'Pipeline stage conversion.'}
          </p>
        </div>
      );
    }
    return null;
  };

  // 1. Trend Line Chart Data
  const trendData = [
    { name: '01 May', Leads: 10 },
    { name: '08 May', Leads: 35 },
    { name: '15 May', Leads: 75 },
    { name: '22 May', Leads: 110 },
    { name: '31 May', Leads: 150 },
  ];

  // 2. Pie Donut Chart Data
  const projectData = [
    { name: 'Sunrise Meadows', value: 45, color: '#2563eb' },
    { name: 'Green Heights', value: 30, color: '#10b981' },
    { name: 'Ocean View', value: 25, color: '#6366f1' },
  ];

  // 3. Funnel Ratios Data
  const funnelData = [
    { name: 'Reg ➜ Visit', ratio: 66.6, color: '#2563eb' },
    { name: 'Visit ➜ Discuss', ratio: 40.0, color: '#6366f1' },
    { name: 'Discuss ➜ Book', ratio: 30.0, color: '#10b981' },
  ];

  // Top broker stats
  const topBrokers = [
    { name: 'Amit Patel', count: 18, conversions: 5, rank: 1 },
    { name: 'Kiran Desai', count: 12, conversions: 3, rank: 2 },
    { name: 'Neha Gupta', count: 9, conversions: 2, rank: 3 },
    { name: 'Rohit Sharma', count: 8, conversions: 1, rank: 4 }
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100/80 shadow-[0_1px_3px_rgba(15,23,42,0.06),0_4px_16px_rgba(15,23,42,0.04)]">
        <div>
          <h2 className="text-lg font-bold text-[#0F172A] font-sans">Reports &amp; Analytics</h2>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mt-0.5">
            Analyze platform conversion ratios, inventory values, and channel partner productivity
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span>01 May 2026 - 31 May 2026</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
        <div className="bg-white p-5 rounded-2xl border border-slate-100/80 shadow-[0_1px_3px_rgba(15,23,42,0.06),0_4px_16px_rgba(15,23,42,0.04)] flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Total Leads</span>
          <div className="flex items-baseline justify-center gap-1.5 mt-2">
            <span className="text-3xl font-semibold text-slate-800">150</span>
            <span className="text-xs text-emerald-600 font-bold flex items-center">+12%</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100/80 shadow-[0_1px_3px_rgba(15,23,42,0.06),0_4px_16px_rgba(15,23,42,0.04)] flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Total Visits</span>
          <div className="flex items-baseline justify-center gap-1.5 mt-2">
            <span className="text-3xl font-semibold text-slate-800">100</span>
            <span className="text-xs text-emerald-600 font-bold flex items-center">+8%</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100/80 shadow-[0_1px_3px_rgba(15,23,42,0.06),0_4px_16px_rgba(15,23,42,0.04)] flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Total Bookings</span>
          <div className="flex items-baseline justify-center gap-1.5 mt-2">
            <span className="text-3xl font-semibold text-slate-800">12</span>
            <span className="text-xs text-emerald-600 font-bold flex items-center">+20%</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100/80 shadow-[0_1px_3px_rgba(15,23,42,0.06),0_4px_16px_rgba(15,23,42,0.04)] flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Agreement Value</span>
          <div className="flex items-baseline justify-center gap-1.5 mt-2">
            <span className="text-2xl font-semibold text-slate-800">₹10.20 Cr</span>
            <span className="text-xs text-emerald-600 font-bold flex items-center">+15%</span>
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Line Chart: Leads Over Time (Desktop 8 columns) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100/80 shadow-[0_1px_3px_rgba(15,23,42,0.06),0_4px_16px_rgba(15,23,42,0.04)] lg:col-span-8 flex flex-col justify-between min-h-[360px]">
          <div className="space-y-1 mb-4">
            <h3 className="text-lg font-bold text-[#0F172A]">Leads Registration Trend</h3>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mt-0.5">Daily Lead Registrations Volume</p>
          </div>

          {/* Recharts AreaChart */}
          <div className="flex-1 h-60 w-full min-h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ background: '#0f172a', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '11px' }} />
                <Area type="monotone" dataKey="Leads" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#colorLeads)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart: Bookings by Project (Desktop 4 columns) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100/80 shadow-[0_1px_3px_rgba(15,23,42,0.06),0_4px_16px_rgba(15,23,42,0.04)] lg:col-span-4 flex flex-col justify-between min-h-[360px]">
          <div className="space-y-1 mb-4">
            <h3 className="text-lg font-bold text-[#0F172A]">Project Bookings</h3>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mt-0.5">Booking ratios by location</p>
          </div>

          {/* Recharts PieChart */}
          <div className="flex-1 flex items-center justify-center min-h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={projectData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={65}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {projectData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#0f172a', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Donut labels */}
          <div className="space-y-2 text-xs font-semibold pt-4 border-t border-slate-50">
            {projectData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-slate-600">{item.name}</span>
                </div>
                <span className="text-slate-800 font-bold">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Brokers Leaderboard (Desktop 6 columns) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100/80 shadow-[0_1px_3px_rgba(15,23,42,0.06),0_4px_16px_rgba(15,23,42,0.04)] lg:col-span-6">
          <h3 className="text-lg font-bold text-[#0F172A] mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <span>Top Brokers</span>
          </h3>

          <div className="space-y-3">
            {topBrokers.map((broker) => (
              <div key={broker.rank} className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200/50 rounded-xl text-xs font-semibold">
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${
                    broker.rank === 1 ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'
                  }`}>
                    #{broker.rank}
                  </span>
                  <span className="text-slate-800 font-bold">{broker.name}</span>
                </div>
                <div className="flex gap-4 text-slate-500 font-bold">
                  <span>Leads: <strong className="text-slate-700">{broker.count}</strong></span>
                  <span>Conversions: <strong className="text-emerald-600">{broker.conversions}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Funnel Ratios: Recharts BarChart (Desktop 6 columns) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100/80 shadow-[0_1px_3px_rgba(15,23,42,0.06),0_4px_16px_rgba(15,23,42,0.04)] lg:col-span-6 flex flex-col justify-between min-h-[300px]">
          <h3 className="text-lg font-bold text-[#0F172A] mb-4 flex items-center gap-2">
            <BarChart4 className="w-5 h-5 text-[#1A56DB]" />
            <span>Conversion Ratios</span>
          </h3>

          <div className="flex-1 w-full min-h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical" margin={{ top: 10, right: 15, left: 15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" domain={[0, 100]} stroke="#94a3b8" fontSize={9} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={9} width={90} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(241, 245, 249, 0.4)', radius: 6 }} />
                <Bar dataKey="ratio" radius={[0, 6, 6, 0]} barSize={14}>
                  {funnelData.map((entry, index) => {
                    const isHovered = hoveredBar === index;
                    const isAnyHovered = hoveredBar !== null;
                    return (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color} 
                        opacity={isAnyHovered && !isHovered ? 0.45 : 1}
                        className="transition-all duration-150 cursor-pointer"
                        onMouseEnter={() => setHoveredBar(index)}
                        onMouseLeave={() => setHoveredBar(null)}
                      />
                    );
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ReportsAnalytics;
