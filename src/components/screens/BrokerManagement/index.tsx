import React, { useState } from 'react';
import { useBrokerConnect } from '../../../context/BrokerConnectContext';
import { Search, Plus, UserPlus, ShieldAlert, CheckCircle, RefreshCw } from 'lucide-react';

export const BrokerManagement: React.FC = () => {
  const { brokers, leads, projects, addBroker, approveBroker, toggleBrokerStatus, setActiveScreen } = useBrokerConnect();
  
  // Tab filters
  const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'Active' | 'Suspended'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Onboarding Form States
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [brokerType, setBrokerType] = useState('Individual');
  const [mobile, setMobile] = useState('');
  const [altMobile, setAltMobile] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [yearsExperience, setYearsExperience] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [areaLocality, setAreaLocality] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [state, setState] = useState('Maharashtra');
  const [country, setCountry] = useState('India');
  const [pincode, setPincode] = useState('');
  const [reraNumber, setReraNumber] = useState('');
  const [reraExpiry, setReraExpiry] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [gstNumber, setGstNumber] = useState('');

  const filteredBrokers = brokers.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) || b.mobile.includes(searchTerm);
    if (activeTab === 'All') return matchesSearch;
    if (activeTab === 'Pending') return matchesSearch && b.status === 'Pending Approval';
    if (activeTab === 'Active') return matchesSearch && b.status === 'Active';
    if (activeTab === 'Suspended') return matchesSearch && b.status === 'Suspended';
    return matchesSearch;
  });

  // Compute per-broker stats derived from leads data
  const getBrokerStats = (brokerId: string) => {
    const brokerLeads = leads.filter(l => l.brokerId === brokerId);
    const visits = brokerLeads.filter(l =>
      ['Checked In', 'Allocated', 'Follow-Up', 'Negotiation', 'Booked'].includes(l.status)
    ).length;
    const bookings = brokerLeads.filter(l => l.status === 'Booked').length;
    const projectSet = new Set(brokerLeads.map(l => l.project));
    return {
      leads: brokerLeads.length,
      visits,
      bookings,
      projects: projectSet.size,
    };
  };

  const handleAddBrokerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert('Broker Name is required');
    if (!companyName.trim()) return alert('Company/Firm Name is required');
    if (!mobile.trim() || mobile.length !== 10) return alert('Valid 10-digit Mobile Number is required');
    if (altMobile.trim() && altMobile.length !== 10) return alert('Alternate Mobile Number must be 10 digits');
    if (!email.trim() || !email.includes('@')) return alert('Valid Email Address is required');
    if (!addressLine1.trim()) return alert('Address Line 1 is required');
    if (!areaLocality.trim()) return alert('Area/Locality is required');
    if (!city.trim()) return alert('City is required');
    if (!state.trim()) return alert('State is required');
    if (!country.trim()) return alert('Country is required');
    if (!pincode.trim() || pincode.length !== 6) return alert('Valid 6-digit Pincode is required');
    if (!reraNumber.trim()) return alert('RERA Number is required');
    if (!panNumber.trim() || panNumber.length !== 10) return alert('Valid 10-digit PAN Number is required');

    addBroker({
      name,
      mobile,
      companyName,
      brokerType,
      altMobile: altMobile || undefined,
      email,
      gender: gender || undefined,
      addressLine1,
      addressLine2: addressLine2 || undefined,
      areaLocality,
      city,
      state,
      country,
      pincode,
      reraNumber,
      reraExpiry: reraExpiry || undefined,
      panNumber,
      gstNumber: gstNumber || undefined,
      yearsExperience: yearsExperience ? String(yearsExperience) : undefined
    });

    // Reset Form
    setName('');
    setCompanyName('');
    setBrokerType('Individual');
    setMobile('');
    setAltMobile('');
    setEmail('');
    setGender('');
    setYearsExperience('');
    setAddressLine1('');
    setAddressLine2('');
    setAreaLocality('');
    setCity('Mumbai');
    setState('Maharashtra');
    setCountry('India');
    setPincode('');
    setReraNumber('');
    setReraExpiry('');
    setPanNumber('');
    setGstNumber('');
    
    setShowAddForm(false);
    alert('Simulation: New broker onboarded! Awaiting admin approval.');
  };

  return (
    <div className="flex flex-col min-h-full gap-6 text-left">
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
      <div className="flex-1 flex flex-col bg-white p-6 rounded-2xl border border-slate-100/80 shadow-[0_1px_3px_rgba(15,23,42,0.06),0_4px_16px_rgba(15,23,42,0.04)] space-y-4 anim-fade-up stagger-2">
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
        <div className="flex-1 overflow-x-auto -mx-6">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-100">
                <th className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide bg-slate-50/70 py-3 px-4">Broker ID</th>
                <th className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide bg-slate-50/70 py-3 px-4">Broker Name</th>
                <th className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide bg-slate-50/70 py-3 px-4">Company</th>
                <th className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide bg-slate-50/70 py-3 px-4">Mobile</th>
                <th className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide bg-slate-50/70 py-3 px-4 text-center">Projects</th>
                <th className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide bg-slate-50/70 py-3 px-4 text-center">Leads</th>
                <th className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide bg-slate-50/70 py-3 px-4 text-center">Visits</th>
                <th className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide bg-slate-50/70 py-3 px-4 text-center">Bookings</th>
                <th className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide bg-slate-50/70 py-3 px-4 text-center">Status</th>
                <th className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide bg-slate-50/70 py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredBrokers.map((broker, index) => {
                const stats = getBrokerStats(broker.id);
                return (
                  <tr key={broker.id} style={{ animationDelay: `${index * 0.04}s` }} className="hover:bg-slate-50/60 transition-colors even:bg-slate-50/30 anim-fade-up">
                    <td className="py-4 px-4 font-extrabold text-blue-600 whitespace-nowrap">{broker.id}</td>
                    <td className="py-4 px-4 text-sm font-semibold text-slate-800 whitespace-nowrap">{broker.name}</td>
                    <td className="py-4 px-4 text-xs text-slate-600 font-medium whitespace-nowrap">{broker.companyName || <span className="text-slate-300 italic">—</span>}</td>
                    <td className="py-4 px-4 text-xs text-slate-500 font-medium whitespace-nowrap">{broker.mobile}</td>
                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-blue-50 text-blue-700 font-extrabold text-xs">{stats.projects}</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 font-extrabold text-xs">{stats.leads}</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-sky-50 text-sky-700 font-extrabold text-xs">{stats.visits}</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 font-extrabold text-xs">{stats.bookings}</span>
                    </td>
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
                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-600 font-bold border border-emerald-200 rounded-lg transition cursor-pointer text-[11px]"
                          >
                            Approve
                          </button>
                        )}
                        <button
                          onClick={() => toggleBrokerStatus(broker.id)}
                          className={`px-2.5 py-1 font-bold border rounded-lg transition cursor-pointer text-[11px] ${
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
                );
              })}

              {filteredBrokers.length === 0 && (
                <tr>
                  <td colSpan={10} className="py-8">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A1628]/75 backdrop-blur-md p-4 sm:p-6 anim-fade-in">
          <form onSubmit={handleAddBrokerSubmit} className="bg-white rounded-3xl w-full max-w-3xl flex flex-col shadow-[0_32px_80px_rgba(10,22,40,0.35)] overflow-hidden text-left anim-scale-in" style={{ maxHeight: 'min(90vh, 820px)' }}>
            {/* Gradient Header */}
            <div className="bg-gradient-to-br from-[#0A1628] via-[#1A3A6B] to-[#1A56DB] px-6 py-5 relative overflow-hidden shrink-0">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, #60a5fa 0%, transparent 60%)' }} />
              <div className="relative flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                    <UserPlus className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Onboard New Broker</h3>
                    <p className="text-[11px] text-blue-200/80 font-medium mt-0.5">Register a new channel partner</p>
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={() => setShowAddForm(false)} 
                  className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>

            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
              
              {/* --- Section 1: General Info --- */}
              <div>
                <h4 className="text-[11px] font-extrabold text-blue-600 uppercase tracking-widest border-b border-slate-100 pb-1 mb-3.5">
                  General Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Broker Name */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Broker Name *</label>
                    <input
                      type="text"
                      placeholder="Enter full agency/broker name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:bg-white focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(26,86,219,0.12)] transition-all duration-200 text-slate-800 font-semibold"
                      required
                    />
                  </div>

                  {/* Company/Firm Name */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Company/Firm Name *</label>
                    <input
                      type="text"
                      placeholder="Enter registered firm name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:bg-white focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(26,86,219,0.12)] transition-all duration-200 text-slate-800 font-semibold"
                      required
                    />
                  </div>

                  {/* Broker Type */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Broker Type *</label>
                    <select
                      value={brokerType}
                      onChange={(e) => setBrokerType(e.target.value)}
                      className="block w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-slate-850 font-semibold"
                      required
                    >
                      <option value="Individual">Individual</option>
                      <option value="Company">Company</option>
                    </select>
                  </div>

                  {/* Mobile Number */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Mobile Number *</label>
                    <input
                      type="text"
                      maxLength={10}
                      placeholder="e.g. 9876500000"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/[^0-9]/g, ''))}
                      className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:bg-white focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(26,86,219,0.12)] transition-all duration-200 text-slate-800 font-semibold"
                      required
                    />
                  </div>

                  {/* Alternate Mobile Number */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Alternate Mobile Number</label>
                    <input
                      type="text"
                      maxLength={10}
                      placeholder="Alternate Mobile (Optional)"
                      value={altMobile}
                      onChange={(e) => setAltMobile(e.target.value.replace(/[^0-9]/g, ''))}
                      className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:bg-white focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(26,86,219,0.12)] transition-all duration-200 text-slate-800 font-semibold"
                    />
                  </div>

                  {/* Email Address */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Email Address *</label>
                    <input
                      type="email"
                      placeholder="e.g. broker@firm.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-slate-850 font-semibold"
                      required
                    />
                  </div>

                  {/* Gender */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="block w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-slate-850 font-semibold"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Years of Experience */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Years of Experience</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="Experience in years (Optional)"
                      value={yearsExperience}
                      onChange={(e) => setYearsExperience(e.target.value)}
                      className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:bg-white focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(26,86,219,0.12)] transition-all duration-200 text-slate-800 font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* --- Section 2: Address & Location --- */}
              <div>
                <h4 className="text-[11px] font-extrabold text-blue-600 uppercase tracking-widest border-b border-slate-100 pb-1 mb-3.5 mt-2">
                  Address & Office Location
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Address Line 1 */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Address Line 1 *</label>
                    <input
                      type="text"
                      placeholder="Flat, Office No, Building name"
                      value={addressLine1}
                      onChange={(e) => setAddressLine1(e.target.value)}
                      className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:bg-white focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(26,86,219,0.12)] transition-all duration-200 text-slate-800 font-semibold"
                      required
                    />
                  </div>

                  {/* Address Line 2 */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Address Line 2</label>
                    <input
                      type="text"
                      placeholder="Street, Sector, Landmark (Optional)"
                      value={addressLine2}
                      onChange={(e) => setAddressLine2(e.target.value)}
                      className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:bg-white focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(26,86,219,0.12)] transition-all duration-200 text-slate-800 font-semibold"
                    />
                  </div>

                  {/* Area/Locality */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Area/Locality *</label>
                    <input
                      type="text"
                      placeholder="Locality or Neighborhood"
                      value={areaLocality}
                      onChange={(e) => setAreaLocality(e.target.value)}
                      className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:bg-white focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(26,86,219,0.12)] transition-all duration-200 text-slate-800 font-semibold"
                      required
                    />
                  </div>

                  {/* City */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">City *</label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="block w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-slate-850 font-semibold"
                      required
                    >
                      <option value="Mumbai">Mumbai</option>
                      <option value="Pune">Pune</option>
                      <option value="Goa">Goa</option>
                      <option value="Bangalore">Bangalore</option>
                      <option value="Ahmedabad">Ahmedabad</option>
                    </select>
                  </div>

                  {/* State */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">State *</label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="block w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-slate-855 font-semibold"
                      required
                    >
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Goa">Goa</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Delhi">Delhi</option>
                    </select>
                  </div>

                  {/* Country */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Country *</label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="block w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-slate-855 font-semibold"
                      required
                    >
                      <option value="India">India</option>
                      <option value="UAE">UAE</option>
                      <option value="USA">USA</option>
                    </select>
                  </div>

                  {/* Pincode */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Pincode *</label>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="e.g. 400001"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value.replace(/[^0-9]/g, ''))}
                      className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:bg-white focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(26,86,219,0.12)] transition-all duration-200 text-slate-800 font-semibold"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* --- Section 3: Credentials --- */}
              <div>
                <h4 className="text-[11px] font-extrabold text-blue-600 uppercase tracking-widest border-b border-slate-100 pb-1 mb-3.5 mt-2">
                  Credentials & Verification
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* RERA Number */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">RERA Number *</label>
                    <input
                      type="text"
                      placeholder="e.g. PRERA5934568"
                      value={reraNumber}
                      onChange={(e) => setReraNumber(e.target.value.toUpperCase())}
                      className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:bg-white focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(26,86,219,0.12)] transition-all duration-200 text-slate-800 font-semibold"
                      required
                    />
                  </div>

                  {/* RERA Expiry Date */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">RERA Expiry Date</label>
                    <input
                      type="date"
                      value={reraExpiry}
                      onChange={(e) => setReraExpiry(e.target.value)}
                      className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:bg-white focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(26,86,219,0.12)] transition-all duration-200 text-slate-800 font-semibold"
                    />
                  </div>

                  {/* PAN Number */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">PAN Number *</label>
                    <input
                      type="text"
                      maxLength={10}
                      placeholder="e.g. ABCDE1234F"
                      value={panNumber}
                      onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                      className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:bg-white focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(26,86,219,0.12)] transition-all duration-200 text-slate-800 font-semibold"
                      required
                    />
                  </div>

                  {/* GST Number */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">GST Number</label>
                    <input
                      type="text"
                      maxLength={15}
                      placeholder="e.g. 27ABCDE294F1Z8"
                      value={gstNumber}
                      onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                      className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:bg-white focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(26,86,219,0.12)] transition-all duration-200 text-slate-800 font-semibold"
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* Footer Buttons */}
            <div className="flex gap-3 px-6 pt-3 pb-5 border-t border-slate-100 shrink-0">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-sm transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-[#1A56DB] hover:bg-[#1648C0] text-white rounded-xl font-semibold text-sm transition-all shadow-[0_4px_14px_rgba(26,86,219,0.35)] hover:shadow-[0_6px_20px_rgba(26,86,219,0.45)] cursor-pointer"
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
