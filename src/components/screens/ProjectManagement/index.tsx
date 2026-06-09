import React, { useState, useEffect } from 'react';
import { useBrokerConnect } from '../../../context/BrokerConnectContext';
import { Search, Plus, Building2, MapPin, Grid, Layers, Calendar, Shield, Check, Trash2, PlusCircle, AlertCircle, Map, Info } from 'lucide-react';
import { CustomSelect } from '../../CustomSelect';
import { createProject, getAllProjects } from '../../../pages/api/projects';

export const ProjectManagement: React.FC = () => {
  const { projects, leads, addProject, setProjects, setActiveScreen } = useBrokerConnect();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'location' | 'rera' | 'units'>('basic');
  
  // API Call States
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProjectsList = async () => {
      setIsLoading(true);
      try {
        const res = await getAllProjects();
        const projectTypeReverseMap: Record<number, string> = {
          1: 'Residential',
          2: 'Commercial',
          3: 'Mixed Use',
          4: 'Plotting',
          5: 'Retail'
        };

        const projectStatusReverseMap: Record<number, string> = {
          1: 'Upcoming',
          2: 'Active',
          3: 'Sold Out',
          4: 'Completed',
          5: 'On Hold'
        };

        let rawList: any[] = [];
        if (res && res.success && res.data && Array.isArray(res.data)) {
          rawList = res.data;
        } else if (Array.isArray(res)) {
          rawList = res;
        } else if (res && (res as any).projects && Array.isArray((res as any).projects)) {
          rawList = (res as any).projects;
        }

        if (rawList.length > 0) {
          const mapped = rawList.map((apiProj: any) => ({
            name: apiProj.project_name || apiProj.name,
            location: apiProj.full_address || apiProj.location || `${apiProj.area_locality || ''}, ${apiProj.city || ''}`.trim() || 'N/A',
            towers: Number(apiProj.towers) || 2,
            units: Number(apiProj.units) || 100,
            status: apiProj.project_status || projectStatusReverseMap[apiProj.project_status_id] || 'Active',
            project_type: apiProj.project_type || projectTypeReverseMap[apiProj.project_type_id] || 'Residential',
            launch_date: apiProj.launch_date,
            possession_date: apiProj.possession_date,
            country: apiProj.country,
            state: apiProj.state,
            city: apiProj.city,
            area_locality: apiProj.area_locality,
            landmark: apiProj.landmark,
            full_address: apiProj.full_address,
            pincode: apiProj.pincode,
            rera_registration_number: apiProj.rera_registration_number,
            rera_registration_date: apiProj.rera_registration_date,
            rera_expiry_date: apiProj.rera_expiry_date,
            facilities: apiProj.facilities,
            unit_configs: apiProj.unit_configs
          }));
          setProjects(mapped);
        }
      } catch (err) {
        console.error('Failed to load projects from server:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectsList();
  }, [setProjects]);

  // Add Project Form States
  const [projectName, setProjectName] = useState('');
  const [projectType, setProjectType] = useState<'Residential' | 'Commercial' | 'Mixed Use' | 'Plotting' | 'Retail'>('Residential');
  const [projectStatus, setProjectStatus] = useState<'Upcoming' | 'Active' | 'Sold Out' | 'Completed' | 'On Hold'>('Active');
  const [launchDate, setLaunchDate] = useState('2026-06-01');
  const [possessionDate, setPossessionDate] = useState('2029-12-31');
  const [towers, setTowers] = useState('2');
  const [units, setUnits] = useState('100');

  // Location States
  const [country, setCountry] = useState('India');
  const [state, setState] = useState('Maharashtra');
  const [city, setCity] = useState('Pune');
  const [areaLocality, setAreaLocality] = useState('Kalyani Nagar');
  const [landmark, setLandmark] = useState('Near Jogger Park');
  const [fullAddress, setFullAddress] = useState('123 Elite Residency, Kalyani Nagar, Pune');
  const [pincode, setPincode] = useState('411006');

  // RERA & Facilities States
  const [reraNum, setReraNum] = useState('RERA-P52100012345');
  const [reraRegDate, setReraRegDate] = useState('2026-06-05');
  const [reraExpDate, setReraExpDate] = useState('2030-06-05');
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([
    'Gymnasium', 'Swimming Pool', 'Clubhouse', '24/7 Security'
  ]);
  const [customFacility, setCustomFacility] = useState('');

  // Unit Configurations
  const [unitConfigs, setUnitConfigs] = useState<{ unit_type: string; budgets: string[] }[]>([
    { unit_type: '1BHK', budgets: ['₹40L - ₹50L', '₹50L - ₹60L'] },
    { unit_type: '2BHK', budgets: ['₹80L - ₹1Cr', '₹1Cr - ₹1.2Cr'] }
  ]);
  
  const [newUnitType, setNewUnitType] = useState('3BHK');
  const [newUnitBudgets, setNewUnitBudgets] = useState('');

  const resetForm = () => {
    setProjectName('');
    setProjectType('Residential');
    setProjectStatus('Active');
    setLaunchDate('2026-06-01');
    setPossessionDate('2029-12-31');
    setTowers('2');
    setUnits('100');
    setCountry('India');
    setState('Maharashtra');
    setCity('Pune');
    setAreaLocality('Kalyani Nagar');
    setLandmark('Near Jogger Park');
    setFullAddress('123 Elite Residency, Kalyani Nagar, Pune');
    setPincode('411006');
    setReraNum('RERA-P52100012345');
    setReraRegDate('2026-06-05');
    setReraExpDate('2030-06-05');
    setSelectedFacilities(['Gymnasium', 'Swimming Pool', 'Clubhouse', '24/7 Security']);
    setUnitConfigs([
      { unit_type: '1BHK', budgets: ['₹40L - ₹50L', '₹50L - ₹60L'] },
      { unit_type: '2BHK', budgets: ['₹80L - ₹1Cr', '₹1Cr - ₹1.2Cr'] }
    ]);
    setActiveTab('basic');
    setErrorMsg('');
    setSuccessMsg('');
  };

  // Per-project stats derived from leads
  const getProjectStats = (name: string, totalUnits: number) => {
    const booked = leads.filter(l => l.project === name && l.status === 'Booked').length;
    const available = Math.max(0, totalUnits - booked);
    return { booked, available };
  };

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!projectName.trim()) {
      setErrorMsg('Project Name is required');
      setActiveTab('basic');
      return;
    }
    if (!city.trim() || !state.trim() || !pincode.trim() || !fullAddress.trim() || !areaLocality.trim()) {
      setErrorMsg('Please complete all required location fields');
      setActiveTab('location');
      return;
    }
    if (!reraNum.trim() || !reraRegDate || !reraExpDate) {
      setErrorMsg('Please complete all RERA details');
      setActiveTab('rera');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const projectTypeMap: Record<string, number> = {
        'Residential': 1,
        'Commercial': 2,
        'Mixed Use': 3,
        'Plotting': 4,
        'Retail': 5
      };

      const projectStatusMap: Record<string, number> = {
        'Upcoming': 1,
        'Active': 2,
        'Sold Out': 3,
        'Completed': 4,
        'On Hold': 5
      };

      const payload = {
        project_name: projectName.trim(),
        project_type_id: projectTypeMap[projectType] || 1,
        project_status_id: projectStatusMap[projectStatus] || 2,
        launch_date: launchDate,
        possession_date: possessionDate,
        country: country.trim(),
        state: state.trim(),
        city: city.trim(),
        area_locality: areaLocality.trim(),
        landmark: landmark.trim(),
        full_address: fullAddress.trim(),
        pincode: pincode.trim(),
        towers: Number(towers) || 2,
        units: Number(units) || 100,
        rera_registration_number: reraNum.trim(),
        rera_registration_date: reraRegDate,
        rera_expiry_date: reraExpDate,
        facilities: selectedFacilities,
        unit_configs: unitConfigs
      };

      const res = await createProject(payload);
      if (res.success) {
        setSuccessMsg(res.message || 'Project created successfully');
        
        // Update local context state
        addProject({
          name: projectName.trim(),
          location: `${areaLocality.trim()}, ${city.trim()}`,
          towers: Number(towers) || 2,
          units: Number(units) || 100,
          status: projectStatus,
          project_type: projectType,
          launch_date: launchDate,
          possession_date: possessionDate,
          country: country.trim(),
          state: state.trim(),
          city: city.trim(),
          area_locality: areaLocality.trim(),
          landmark: landmark.trim(),
          full_address: fullAddress.trim(),
          pincode: pincode.trim(),
          rera_registration_number: reraNum.trim(),
          rera_registration_date: reraRegDate,
          rera_expiry_date: reraExpDate,
          facilities: selectedFacilities,
          unit_configs: unitConfigs
        });

        setTimeout(() => {
          setShowAddForm(false);
          resetForm();
        }, 1500);
      } else {
        setErrorMsg(res.message || 'Failed to create project');
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || err.message || 'An error occurred during submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full gap-6 text-left">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100/80 shadow-[0_1px_3px_rgba(15,23,42,0.06),0_4px_16px_rgba(15,23,42,0.04)] anim-fade-up">
        <div>
          <h2 className="text-lg font-bold text-[#0F172A]">Project Management</h2>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mt-0.5">
            Manage real estate inventories, configurations, and active project locations
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowAddForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1A56DB] hover:bg-[#1648C0] text-white rounded-xl font-semibold text-sm transition-all shadow-[0_4px_14px_rgba(26,86,219,0.25)] hover:shadow-[0_6px_20px_rgba(26,86,219,0.35)] cursor-pointer w-full sm:w-auto justify-center press pulse-glow"
        >
          <Plus className="w-5 h-5" />
          <span>Add Project</span>
        </button>
      </div>

      {/* Search and Table List */}
      <div className="flex-1 flex flex-col bg-white p-6 rounded-2xl border border-slate-100/80 shadow-[0_1px_3px_rgba(15,23,42,0.06),0_4px_16px_rgba(15,23,42,0.04)] space-y-4 anim-fade-up stagger-2">
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
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:shadow-[0_0_0_4px_rgba(26,86,219,0.08)] transition-shadow duration-200 placeholder:text-slate-400 text-slate-700"
            />
          </div>
        </div>

        {/* Projects grid */}
        <div className="flex-1 overflow-x-auto -mx-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-100">
                <th className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide bg-slate-50/70 py-3 px-4">Project Name</th>
                <th className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide bg-slate-50/70 py-3 px-4">Location</th>
                <th className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide bg-slate-50/70 py-3 px-4 text-center">Towers</th>
                <th className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide bg-slate-50/70 py-3 px-4 text-center">Units</th>
                <th className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide bg-slate-50/70 py-3 px-4 text-center">Available</th>
                <th className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide bg-slate-50/70 py-3 px-4 text-center">Booked</th>
                <th className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide bg-slate-50/70 py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 font-semibold bg-white">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-[#1A56DB]" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span className="text-xs text-slate-500 font-medium">Loading active projects...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 font-medium bg-white">
                    No active projects found.
                  </td>
                </tr>
              ) : (
                filteredProjects.map((proj, index) => {
                  const { booked, available } = getProjectStats(proj.name, proj.units);
                  return (
                    <tr key={proj.name} style={{ animationDelay: `${index * 0.04}s` }} className="hover:bg-slate-50/60 transition-colors cursor-pointer even:bg-slate-50/30 anim-fade-up">
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
                      <td className="py-4 px-4 text-slate-600 font-bold text-center">{proj.units}</td>
                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 font-extrabold text-xs border border-emerald-100">{available}</span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-0.5 rounded-lg bg-rose-50 text-rose-700 font-extrabold text-xs border border-rose-100">{booked}</span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold smooth ${
                          proj.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                          proj.status === 'Upcoming' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                          proj.status === 'Sold Out' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                          proj.status === 'Completed' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                          'bg-amber-50 text-amber-700 border border-amber-100'
                        }`}>
                          {proj.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Project Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A1628]/75 backdrop-blur-md p-4 anim-fade-in">
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl w-full max-w-2xl shadow-[0_32px_80px_rgba(10,22,40,0.35)] overflow-hidden text-left anim-scale-in flex flex-col max-h-[90vh]">
            
            {/* Gradient Header */}
            <div className="bg-gradient-to-br from-[#0A1628] via-[#1A3A6B] to-[#1A56DB] px-6 py-5 relative overflow-hidden flex-shrink-0">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, #60a5fa 0%, transparent 60%)' }} />
              <div className="relative flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Add New Project</h3>
                    <p className="text-[11px] text-blue-200/80 font-medium mt-0.5">Launch a new real estate inventory</p>
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

            {/* Tabs Navigation */}
            <div className="flex border-b border-slate-100 bg-slate-50 px-4 py-2 overflow-x-auto gap-1 flex-shrink-0">
              {[
                { id: 'basic', label: 'Basic Info', icon: Info },
                { id: 'location', label: 'Location & Address', icon: Map },
                { id: 'rera', label: 'RERA & Facilities', icon: Shield },
                { id: 'units', label: 'Unit Configurations', icon: Grid }
              ].map(t => {
                const Icon = t.icon;
                const active = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveTab(t.id as any)}
                    className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition cursor-pointer whitespace-nowrap ${
                      active
                        ? 'bg-white text-blue-600 shadow-sm border border-slate-200/50'
                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Form Body Container */}
            <div className="px-6 py-5 overflow-y-auto flex-1 min-h-0">
              {/* API Feedback Alerts */}
              {errorMsg && (
                <div className="mb-4 p-3.5 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl flex items-start gap-2.5 text-xs font-semibold">
                  <AlertCircle className="w-4.5 h-4.5 text-rose-500 flex-shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}
              {successMsg && (
                <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl flex items-start gap-2.5 text-xs font-semibold">
                  <Check className="w-4.5 h-4.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Tab 1: Basic Details */}
              {activeTab === 'basic' && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Project Name <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      placeholder="e.g. Elysium Towers"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(26,86,219,0.12)] transition-all duration-200 placeholder:text-slate-400 text-slate-800 font-semibold"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Project Type <span className="text-rose-500">*</span></label>
                      <CustomSelect
                        value={projectType}
                        onChange={(val) => setProjectType(val as any)}
                        options={['Residential', 'Commercial', 'Mixed Use', 'Plotting', 'Retail']}
                        placeholder="Select Type"
                        icon={Building2}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Status <span className="text-rose-500">*</span></label>
                      <CustomSelect
                        value={projectStatus}
                        onChange={(val) => setProjectStatus(val as any)}
                        options={['Upcoming', 'Active', 'Sold Out', 'Completed', 'On Hold']}
                        placeholder="Select Status"
                        icon={Layers}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Launch Date <span className="text-rose-500">*</span></label>
                      <input
                        type="date"
                        value={launchDate}
                        onChange={(e) => setLaunchDate(e.target.value)}
                        className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(26,86,219,0.12)] transition-all duration-200 text-slate-800 font-semibold"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Possession Date <span className="text-rose-500">*</span></label>
                      <input
                        type="date"
                        value={possessionDate}
                        onChange={(e) => setPossessionDate(e.target.value)}
                        className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(26,86,219,0.12)] transition-all duration-200 text-slate-800 font-semibold"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Towers <span className="text-rose-500">*</span></label>
                      <input
                        type="number"
                        min="1"
                        placeholder="2"
                        value={towers}
                        onChange={(e) => setTowers(e.target.value)}
                        className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(26,86,219,0.12)] transition-all duration-200 placeholder:text-slate-400 text-slate-800 font-semibold"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Units <span className="text-rose-500">*</span></label>
                      <input
                        type="number"
                        min="1"
                        placeholder="100"
                        value={units}
                        onChange={(e) => setUnits(e.target.value)}
                        className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(26,86,219,0.12)] transition-all duration-200 placeholder:text-slate-400 text-slate-800 font-semibold"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Location Details */}
              {activeTab === 'location' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Country <span className="text-rose-500">*</span></label>
                      <input
                        type="text"
                        placeholder="e.g. India"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(26,86,219,0.12)] transition-all duration-200 text-slate-800 font-semibold"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">State <span className="text-rose-500">*</span></label>
                      <input
                        type="text"
                        placeholder="e.g. Maharashtra"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(26,86,219,0.12)] transition-all duration-200 text-slate-800 font-semibold"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2 space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">City <span className="text-rose-500">*</span></label>
                      <input
                        type="text"
                        placeholder="e.g. Pune"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(26,86,219,0.12)] transition-all duration-200 text-slate-800 font-semibold"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Pincode <span className="text-rose-500">*</span></label>
                      <input
                        type="text"
                        placeholder="411006"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(26,86,219,0.12)] transition-all duration-200 text-slate-800 font-semibold"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Area Locality <span className="text-rose-500">*</span></label>
                      <input
                        type="text"
                        placeholder="e.g. Kalyani Nagar"
                        value={areaLocality}
                        onChange={(e) => setAreaLocality(e.target.value)}
                        className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(26,86,219,0.12)] transition-all duration-200 text-slate-800 font-semibold"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Landmark</label>
                      <input
                        type="text"
                        placeholder="e.g. Near Jogger Park"
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(26,86,219,0.12)] transition-all duration-200 text-slate-800 font-semibold"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Full Address <span className="text-rose-500">*</span></label>
                    <textarea
                      placeholder="e.g. 123 Elite Residency, Kalyani Nagar, Pune"
                      value={fullAddress}
                      onChange={(e) => setFullAddress(e.target.value)}
                      rows={2}
                      className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(26,86,219,0.12)] transition-all duration-200 text-slate-800 font-semibold resize-none"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Tab 3: RERA & Facilities */}
              {activeTab === 'rera' && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">RERA Registration Number <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      placeholder="RERA-P52100012345"
                      value={reraNum}
                      onChange={(e) => setReraNum(e.target.value)}
                      className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(26,86,219,0.12)] transition-all duration-200 text-slate-800 font-semibold"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">RERA Reg Date <span className="text-rose-500">*</span></label>
                      <input
                        type="date"
                        value={reraRegDate}
                        onChange={(e) => setReraRegDate(e.target.value)}
                        className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(26,86,219,0.12)] transition-all duration-200 text-slate-800 font-semibold"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">RERA Expiry Date <span className="text-rose-500">*</span></label>
                      <input
                        type="date"
                        value={reraExpDate}
                        onChange={(e) => setReraExpDate(e.target.value)}
                        className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(26,86,219,0.12)] transition-all duration-200 text-slate-800 font-semibold"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Facilities / Amenities</label>
                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-1 border border-slate-100 rounded-xl bg-slate-50/50">
                      {['Gymnasium', 'Swimming Pool', 'Clubhouse', '24/7 Security', 'Power Backup', 'Kids Play Area', 'Jogging Track', 'Tennis Court'].map(f => {
                        const isSelected = selectedFacilities.includes(f);
                        return (
                          <button
                            key={f}
                            type="button"
                            onClick={() => {
                              setSelectedFacilities(prev =>
                                prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]
                              );
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer flex items-center gap-1 ${
                              isSelected
                                ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm'
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5" />}
                            <span>{f}</span>
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add custom facility..."
                        value={customFacility}
                        onChange={(e) => setCustomFacility(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (customFacility.trim()) {
                              setSelectedFacilities(prev => [...new Set([...prev, customFacility.trim()])]);
                              setCustomFacility('');
                            }
                          }
                        }}
                        className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (customFacility.trim()) {
                            setSelectedFacilities(prev => [...new Set([...prev, customFacility.trim()])]);
                            setCustomFacility('');
                          }
                        }}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Unit Configurations */}
              {activeTab === 'units' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Unit Configurations & Budgets</label>
                    <div className="space-y-2 max-h-40 overflow-y-auto border border-slate-100 rounded-xl p-2 bg-slate-50/50">
                      {unitConfigs.length === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-4">No configurations added yet.</p>
                      ) : (
                        unitConfigs.map((config, idx) => (
                          <div key={idx} className="flex justify-between items-start p-2.5 bg-white border border-slate-100 rounded-xl shadow-sm">
                            <div className="space-y-1 text-left">
                              <span className="inline-block px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider">{config.unit_type}</span>
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                {config.budgets.map((b, bIdx) => (
                                  <span key={bIdx} className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold">{b}</span>
                                ))}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setUnitConfigs(prev => prev.filter((_, i) => i !== idx));
                              }}
                              className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                            >
                              <Trash2 className="w-4.5 h-4.5" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Add Unit Config controls */}
                  <div className="border border-dashed border-slate-200 rounded-2xl p-3 space-y-3 bg-slate-50/30">
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                      <PlusCircle className="w-3.5 h-3.5 text-blue-500" />
                      <span>Add Configuration</span>
                    </span>

                    <div className="grid grid-cols-2 gap-3 text-left">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 block uppercase">Unit Type</label>
                        <select
                          value={newUnitType}
                          onChange={(e) => setNewUnitType(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-semibold"
                        >
                          {['1BHK', '2BHK', '3BHK', '4BHK', '5BHK', 'Studio', 'Penthouse', 'Duplex', 'Retail Space', 'Office Space'].map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 block uppercase">Budgets (comma-separated)</label>
                        <input
                          type="text"
                          placeholder="e.g. ₹80L - ₹1Cr, ₹1Cr - ₹1.2Cr"
                          value={newUnitBudgets}
                          onChange={(e) => setNewUnitBudgets(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-medium"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (newUnitType && newUnitBudgets.trim()) {
                          const budgetArray = newUnitBudgets.split(',').map(s => s.trim()).filter(Boolean);
                          if (budgetArray.length > 0) {
                            setUnitConfigs(prev => {
                              const existingIdx = prev.findIndex(c => c.unit_type === newUnitType);
                              if (existingIdx !== -1) {
                                const updated = [...prev];
                                updated[existingIdx] = {
                                  ...updated[existingIdx],
                                  budgets: [...new Set([...updated[existingIdx].budgets, ...budgetArray])]
                                };
                                return updated;
                              } else {
                                return [...prev, { unit_type: newUnitType, budgets: budgetArray }];
                              }
                            });
                            setNewUnitBudgets('');
                          }
                        }
                      }}
                      className="w-full py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      Add to Configuration List
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center gap-3 px-6 pb-6 pt-3 border-t border-slate-100 bg-slate-50/50 flex-shrink-0">
              <button
                type="button"
                onClick={() => {
                  if (activeTab === 'units') setActiveTab('rera');
                  else if (activeTab === 'rera') setActiveTab('location');
                  else if (activeTab === 'location') setActiveTab('basic');
                  else setShowAddForm(false);
                }}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-sm transition-all cursor-pointer min-w-[5rem]"
              >
                {activeTab === 'basic' ? 'Cancel' : 'Back'}
              </button>
              
              <div className="flex gap-2">
                {activeTab !== 'units' ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (activeTab === 'basic') setActiveTab('location');
                      else if (activeTab === 'location') setActiveTab('rera');
                      else if (activeTab === 'rera') setActiveTab('units');
                    }}
                    className="px-5 py-2.5 bg-[#1A56DB] hover:bg-[#1648C0] text-white rounded-xl font-semibold text-sm transition-all cursor-pointer shadow-[0_4px_14px_rgba(26,86,219,0.25)]"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-[#1A56DB] hover:bg-[#1648C0] text-white rounded-xl font-semibold text-sm transition-all shadow-[0_4px_14px_rgba(26,86,219,0.35)] hover:shadow-[0_6px_20px_rgba(26,86,219,0.45)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <span>Submit Project</span>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
