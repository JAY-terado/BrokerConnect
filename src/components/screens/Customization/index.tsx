import React, { useState } from 'react';
import { SlidersHorizontal, Plus, Trash2, Building2, Users, Check, Save, PlusCircle, X, Calendar, ChevronDown, CircleDot, Type, List } from 'lucide-react';

interface CustomField {
  id: string;
  title: string;
  description: string;
  type: 'dropdown' | 'multiselect' | 'radio' | 'date' | 'text';
  options: string[];
  isCustom?: boolean;
}

interface MasterFieldCardProps {
  field: CustomField;
  onAddOption: (option: string) => void;
  onRemoveOption: (index: number) => void;
  onRemoveField?: () => void;
}

const MasterFieldCard: React.FC<MasterFieldCardProps> = ({
  field,
  onAddOption,
  onRemoveOption,
  onRemoveField
}) => {
  const [newOption, setNewOption] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newOption.trim()) {
      onAddOption(newOption.trim());
      setNewOption('');
    }
  };

  const hasOptions = ['dropdown', 'multiselect', 'radio'].includes(field.type);

  // Type Badges & Icons
  const getTypeBadge = () => {
    switch (field.type) {
      case 'multiselect':
        return {
          label: 'Multi-select',
          style: 'bg-indigo-50 border-indigo-100 text-indigo-700',
          icon: List
        };
      case 'radio':
        return {
          label: 'Radio Buttons',
          style: 'bg-purple-50 border-purple-100 text-purple-700',
          icon: CircleDot
        };
      case 'date':
        return {
          label: 'Date Picker',
          style: 'bg-amber-50 border-amber-100 text-amber-700',
          icon: Calendar
        };
      case 'text':
        return {
          label: 'Text Input',
          style: 'bg-slate-50 border-slate-100 text-slate-700',
          icon: Type
        };
      default:
        return {
          label: 'Dropdown',
          style: 'bg-blue-50 border-blue-100 text-blue-700',
          icon: ChevronDown
        };
    }
  };

  const badge = getTypeBadge();
  const BadgeIcon = badge.icon;

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100/80 shadow-[0_1px_3px_rgba(15,23,42,0.06),0_4px_16px_rgba(15,23,42,0.04)] flex flex-col gap-4 text-left hover:shadow-[0_4px_20px_rgba(15,23,42,0.08)] transition-all relative group anim-scale-in">
      <div className="flex justify-between items-start">
        <div className="pr-8 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-sm font-bold text-slate-800">{field.title}</h4>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold border capitalize ${badge.style}`}>
              <BadgeIcon className="w-3 h-3" />
              <span>{badge.label}</span>
            </span>
            {field.isCustom && (
              <span className="px-1.5 py-0.5 rounded bg-blue-50 text-[9px] font-bold text-blue-600 border border-blue-100 uppercase tracking-wider">Custom</span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 font-medium">{field.description}</p>
        </div>
        {field.isCustom && onRemoveField && (
          <button
            type="button"
            onClick={onRemoveField}
            className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition cursor-pointer flex-shrink-0"
            title="Delete custom category"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Conditional UI based on field type */}
      {hasOptions ? (
        <>
          {/* Option Badges */}
          <div className="flex flex-wrap gap-2 min-h-[5rem] p-3 border border-slate-100 rounded-xl bg-slate-50/50 max-h-40 overflow-y-auto">
            {field.options.length === 0 ? (
              <span className="text-xs text-slate-400 my-auto mx-auto font-medium">No options set. Add one below.</span>
            ) : (
              field.options.map((opt, idx) => (
                <div 
                  key={idx} 
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm"
                >
                  {field.type === 'radio' && <span className="w-2.5 h-2.5 rounded-full border border-slate-300 inline-block bg-slate-100" />}
                  <span>{opt}</span>
                  <button 
                    type="button" 
                    onClick={() => onRemoveOption(idx)}
                    className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-slate-100 hover:text-rose-500 text-slate-400 transition cursor-pointer text-[10px]"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Add new option form */}
          <form onSubmit={handleAdd} className="flex gap-2">
            <input
              type="text"
              placeholder="Add value option..."
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:bg-white focus:border-blue-500 font-semibold placeholder:text-slate-400 text-slate-800"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-[#1A56DB] hover:bg-[#1648C0] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer press"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </form>
        </>
      ) : (
        /* Field Control Previews */
        <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100/80 flex flex-col gap-2 min-h-[5rem] justify-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Control Preview</span>
          {field.type === 'date' ? (
            <div className="relative">
              <input 
                type="date" 
                disabled 
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-400 font-semibold cursor-not-allowed select-none" 
              />
            </div>
          ) : (
            <input 
              type="text" 
              placeholder="User response text input..." 
              disabled 
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-400 font-semibold cursor-not-allowed select-none" 
            />
          )}
        </div>
      )}
    </div>
  );
};

export const Customization: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'project' | 'broker'>('project');
  const [hasSaved, setHasSaved] = useState(false);
  const [showAddFieldModal, setShowAddFieldModal] = useState(false);

  // New Category States
  const [newFieldTitle, setNewFieldTitle] = useState('');
  const [newFieldDesc, setNewFieldDesc] = useState('');
  const [newFieldType, setNewFieldType] = useState<'dropdown' | 'multiselect' | 'radio' | 'date' | 'text'>('dropdown');

  // --- Dynamic Master Project Fields ---
  const [projectFields, setProjectFields] = useState<CustomField[]>([
    {
      id: 'project_types',
      title: 'Project Types',
      description: 'Categories displayed in the Add Project selection form',
      type: 'dropdown',
      options: ['Residential', 'Commercial', 'Mixed Use', 'Plotting', 'Retail']
    },
    {
      id: 'project_statuses',
      title: 'Project Statuses',
      description: 'Active inventory staging statuses for filters and lists',
      type: 'dropdown',
      options: ['Upcoming', 'Active', 'Sold Out', 'Completed', 'On Hold']
    },
    {
      id: 'project_facilities',
      title: 'Amenities & Facilities',
      description: 'Checkboxes available when launching a new project',
      type: 'multiselect',
      options: ['Gymnasium', 'Swimming Pool', 'Clubhouse', '24/7 Security', 'Power Backup', 'Kids Play Area', 'Jogging Track']
    },
    {
      id: 'project_budgets',
      title: 'Budget Ranges',
      description: 'Standard budget bracket options for customer configuration cards',
      type: 'dropdown',
      options: ['₹40L - ₹50L', '₹50L - ₹60L', '₹80L - ₹1Cr', '₹1Cr - ₹1.2Cr']
    }
  ]);

  // --- Dynamic Master Broker Fields ---
  const [brokerFields, setBrokerFields] = useState<CustomField[]>([
    {
      id: 'broker_types',
      title: 'Broker Types',
      description: 'Business structural types for the broker onboarding form',
      type: 'dropdown',
      options: ['Individual', 'Sole Proprietorship', 'Partnership Firm', 'Private Limited']
    },
    {
      id: 'broker_experience',
      title: 'Experience Brackets',
      description: 'Years of professional experience selection ranges',
      type: 'dropdown',
      options: ['0-2 Years', '2-5 Years', '5-10 Years', '10+ Years']
    },
    {
      id: 'broker_statuses',
      title: 'Account Status Options',
      description: 'Lifecycle stages for partner approval workflows',
      type: 'dropdown',
      options: ['Pending Approval', 'Active', 'Suspended']
    },
    {
      id: 'broker_documents',
      title: 'Document Checklist',
      description: 'File verification uploads requested on onboarding',
      type: 'multiselect',
      options: ['PAN Card', 'GST Registration', 'RERA Certificate', 'Aadhaar Card']
    }
  ]);

  // Option actions
  const handleAddOption = (fieldId: string, option: string) => {
    const setter = activeSubTab === 'project' ? setProjectFields : setBrokerFields;
    setter(prev => prev.map(f => {
      if (f.id === fieldId) {
        return { ...f, options: [...new Set([...f.options, option])] };
      }
      return f;
    }));
  };

  const handleRemoveOption = (fieldId: string, optionIdx: number) => {
    const setter = activeSubTab === 'project' ? setProjectFields : setBrokerFields;
    setter(prev => prev.map(f => {
      if (f.id === fieldId) {
        return { ...f, options: f.options.filter((_, i) => i !== optionIdx) };
      }
      return f;
    }));
  };

  const handleRemoveField = (fieldId: string) => {
    const setter = activeSubTab === 'project' ? setProjectFields : setBrokerFields;
    setter(prev => prev.filter(f => f.id !== fieldId));
  };

  const handleAddNewCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFieldTitle.trim()) {
      const newField: CustomField = {
        id: `custom_${Date.now()}`,
        title: newFieldTitle.trim(),
        description: newFieldDesc.trim() || `Custom master ${newFieldType} category`,
        type: newFieldType,
        options: [],
        isCustom: true
      };
      
      const setter = activeSubTab === 'project' ? setProjectFields : setBrokerFields;
      setter(prev => [...prev, newField]);

      setNewFieldTitle('');
      setNewFieldDesc('');
      setNewFieldType('dropdown');
      setShowAddFieldModal(false);
    }
  };

  const handleSave = () => {
    setHasSaved(true);
    setTimeout(() => setHasSaved(false), 2000);
  };

  const activeFields = activeSubTab === 'project' ? projectFields : brokerFields;

  return (
    <div className="flex flex-col min-h-full gap-6 text-left">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100/80 shadow-[0_1px_3px_rgba(15,23,42,0.06),0_4px_16px_rgba(15,23,42,0.04)] anim-fade-up">
        <div>
          <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-blue-600 animate-pulse" />
            <span>Master Field Customization</span>
          </h2>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mt-0.5">
            Configure master dropdown values, status settings, and checklists used across system forms
          </p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm transition-all shadow-[0_4px_14px_rgba(16,185,129,0.25)] cursor-pointer w-full sm:w-auto justify-center press flex-shrink-0"
        >
          {hasSaved ? (
            <>
              <Check className="w-4 h-4 animate-scale-in" />
              <span>Master Configurations Saved!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Configurations</span>
            </>
          )}
        </button>
      </div>

      {/* Pages Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/60 bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] anim-fade-up stagger-1">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveSubTab('project')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl transition cursor-pointer ${
              activeSubTab === 'project'
                ? 'bg-blue-50 text-blue-600 shadow-sm border border-blue-100'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 border border-transparent'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Master Project Fields</span>
          </button>
          <button
            onClick={() => setActiveSubTab('broker')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl transition cursor-pointer ${
              activeSubTab === 'broker'
                ? 'bg-blue-50 text-blue-600 shadow-sm border border-blue-100'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 border border-transparent'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Master Broker Fields</span>
          </button>
        </div>

        <button
          onClick={() => setShowAddFieldModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition cursor-pointer press flex-shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Custom Category</span>
        </button>
      </div>

      {/* Grid of Customization Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 anim-fade-up stagger-2">
        {activeFields.map((field) => (
          <MasterFieldCard
            key={field.id}
            field={field}
            onAddOption={(opt) => handleAddOption(field.id, opt)}
            onRemoveOption={(idx) => handleRemoveOption(field.id, idx)}
            onRemoveField={() => handleRemoveField(field.id)}
          />
        ))}
      </div>

      {/* Add Custom Category Dialog */}
      {showAddFieldModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A1628]/75 backdrop-blur-md p-4 anim-fade-in">
          <form onSubmit={handleAddNewCategory} className="bg-white rounded-3xl w-full max-w-md shadow-[0_32px_80px_rgba(10,22,40,0.35)] overflow-hidden text-left anim-scale-in">
            {/* Header */}
            <div className="bg-gradient-to-br from-[#0A1628] via-[#1A3A6B] to-[#1A56DB] px-6 py-5 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, #60a5fa 0%, transparent 60%)' }} />
              <div className="relative flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                    <SlidersHorizontal className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Add Custom Category</h3>
                    <p className="text-[11px] text-blue-200/80 font-medium mt-0.5">Create a new customizable form section</p>
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={() => setShowAddFieldModal(false)} 
                  className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <div className="px-6 py-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Category Title <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. Payment Schedule"
                  value={newFieldTitle}
                  onChange={(e) => setNewFieldTitle(e.target.value)}
                  className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(26,86,219,0.12)] transition-all duration-200 placeholder:text-slate-400 text-slate-800 font-semibold"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Description</label>
                <input
                  type="text"
                  placeholder="e.g. Dropdown options for customer installment terms"
                  value={newFieldDesc}
                  onChange={(e) => setNewFieldDesc(e.target.value)}
                  className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(26,86,219,0.12)] transition-all duration-200 placeholder:text-slate-400 text-slate-800 font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Field Input Type</label>
                <select
                  value={newFieldType}
                  onChange={(e) => setNewFieldType(e.target.value as any)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:bg-white focus:border-blue-500 font-semibold text-slate-800"
                >
                  <option value="dropdown">Dropdown (Single Select)</option>
                  <option value="multiselect">Multi-select Checklist</option>
                  <option value="radio">Radio Buttons</option>
                  <option value="date">Date Picker</option>
                  <option value="text">Text Input Box</option>
                </select>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 px-6 pb-6 pt-2">
              <button
                type="button"
                onClick={() => setShowAddFieldModal(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-sm transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-[#1A56DB] hover:bg-[#1648C0] text-white rounded-xl font-semibold text-sm transition-all shadow-[0_4px_14px_rgba(26,86,219,0.35)] hover:shadow-[0_6px_20px_rgba(26,86,219,0.45)] cursor-pointer"
              >
                Create Category
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
