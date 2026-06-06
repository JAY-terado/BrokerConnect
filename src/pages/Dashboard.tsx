import React from 'react';
import { useBrokerConnect } from '../context/BrokerConnectContext';
import { Sidebar } from '../components/Sidebar';
import { MobileNav } from '../components/MobileNav';

// Screen imports
import { BrokerDashboard } from '../components/screens/BrokerDashboard';
import { RegisterCustomer } from '../components/screens/RegisterCustomer';
import { OTPVerification } from '../components/screens/OTPVerification';
import { VisitPass } from '../components/screens/VisitPass';
import { ReceptionDashboard } from '../components/screens/ReceptionDashboard';
import { VisitorCheckIn } from '../components/screens/VisitorCheckIn';
import { SalesAllocation } from '../components/screens/SalesAllocation';
import { SalesCRM } from '../components/screens/SalesCRM';
import { CustomerDetails } from '../components/screens/CustomerDetails';
import { BookingManagement } from '../components/screens/BookingManagement';
import { CommissionManagement } from '../components/screens/CommissionManagement';
import { DisputeManagement } from '../components/screens/DisputeManagement';
import { ReportsAnalytics } from '../components/screens/ReportsAnalytics';
import { BrokerManagement } from '../components/screens/BrokerManagement';
import { ProjectManagement } from '../components/screens/ProjectManagement';

import { Bell, HelpCircle, Building2, ChevronDown, Check, LayoutDashboard, UserCheck, Layers, Shield } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { activeScreen, currentRole, setCurrentRole } = useBrokerConnect();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const roles = [
    {
      id: 'broker',
      name: 'Broker Portal',
      description: 'Manage client registrations, visits, and track commissions.',
      icon: LayoutDashboard,
    },
    {
      id: 'receptionist',
      name: 'Receptionist Desk',
      description: 'Check-in visitors, verify OTPs, and scan document proofs.',
      icon: UserCheck,
    },
    {
      id: 'sales',
      name: 'Sales CRM',
      description: 'Allocate leads, track follow-ups, and log bookings.',
      icon: Layers,
    },
    {
      id: 'admin',
      name: 'Admin Panel',
      description: 'Review analytics, manage brokers, and resolve disputes.',
      icon: Shield,
    },
  ] as const;

  const roleStyles = {
    broker: {
      bg: 'bg-blue-50/70 border-blue-100/60 text-blue-700',
      dot: 'bg-blue-500',
      label: 'Broker Portal',
    },
    receptionist: {
      bg: 'bg-emerald-50/70 border-emerald-100/60 text-emerald-700',
      dot: 'bg-emerald-500',
      label: 'Receptionist Desk',
    },
    sales: {
      bg: 'bg-indigo-50/70 border-indigo-100/60 text-indigo-700',
      dot: 'bg-indigo-500',
      label: 'Sales CRM Portal',
    },
    admin: {
      bg: 'bg-rose-50/70 border-rose-100/60 text-rose-700',
      dot: 'bg-rose-500',
      label: 'Admin Control Panel',
    },
  };

  // Render the selected view component
  const renderScreen = () => {
    switch (activeScreen) {
      case 2: return <BrokerDashboard />;
      case 3: return <RegisterCustomer />;
      case 4: return <OTPVerification />;
      case 5: return <VisitPass />;
      case 6: return <ReceptionDashboard />;
      case 7: return <VisitorCheckIn />;
      case 8: return <SalesAllocation />;
      case 9: return <SalesCRM />;
      case 10: return <CustomerDetails />;
      case 11: return <BookingManagement />;
      case 12: return <CommissionManagement />;
      case 13: return <DisputeManagement />;
      case 14: return <ReportsAnalytics />;
      case 15: return <BrokerManagement />;
      case 16: return <ProjectManagement />;
      default: return <BrokerDashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F1F5F9] text-slate-800 w-full overflow-x-hidden text-left">
      {/* Desktop Sidebar (automatically hidden on mobile widths) */}
      <div className="hidden lg:block w-60 shrink-0">
        <div className="fixed top-0 bottom-0 left-0 w-60 h-screen z-20">
          <Sidebar />
        </div>
      </div>

      {/* Core content wrapper */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen relative pb-20 lg:pb-0">
        
        {/* Dashboard Header Bar */}
        <header className="bg-[#0A1628] lg:bg-white border-b border-white/5 lg:border-slate-100 px-6 h-16 flex justify-between items-center shrink-0 relative z-10 select-none shadow-[0_1px_0_rgba(15,23,42,0.06)] anim-fade-in">
          {/* Left side info / Logo */}
          <div className="flex items-center gap-3">
            {/* Mobile Branding Logo */}
            <div className="flex lg:hidden items-center">
              <img 
                src="/logo.png" 
                alt="Logo" 
                className="h-7.5 w-auto object-contain" 
              />
            </div>

            {/* Elegant Status Pill Badge */}
            <div key={currentRole} className="hidden lg:flex items-center gap-2.5 bg-slate-100 text-slate-600 border border-slate-200/80 rounded-full px-3 py-1 text-xs font-semibold shadow-xs transition-all duration-300 smooth">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${roleStyles[currentRole].dot}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${roleStyles[currentRole].dot}`}></span>
              </span>
              <span>Role Context: <strong className="font-semibold">{roleStyles[currentRole].label}</strong></span>
            </div>
          </div>

          {/* Right side controls / Profiles */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Premium Custom Demo Role Switcher Dropdown */}
            <div ref={dropdownRef} className="relative select-none">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 bg-blue-900/40 hover:bg-blue-800/60 border border-blue-800/40 lg:bg-slate-50 lg:hover:bg-slate-100 lg:border-slate-200/80 px-3.5 py-2 rounded-xl text-[11px] sm:text-xs font-bold text-blue-100 lg:text-slate-700 transition cursor-pointer shadow-xs active:scale-[0.98]"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${roleStyles[currentRole].dot} animate-pulse`}></span>
                <span className="hidden sm:inline">Demo Role:</span>
                <span className="font-black text-white lg:text-slate-900 capitalize">{currentRole === 'sales' ? 'Sales CRM' : currentRole === 'receptionist' ? 'Receptionist' : currentRole === 'admin' ? 'Admin' : 'Broker'}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-blue-300 lg:text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-100 rounded-2xl shadow-[0_8px_32px_rgba(15,23,42,0.12)] z-50 py-1.5 anim-scale-in">
                  <div className="px-4 py-2 border-b border-slate-50">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Switch Dashboard View</span>
                  </div>
                  <div className="p-1 space-y-0.5">
                    {roles.map((r) => {
                       const IconComponent = r.icon;
                       const isSelected = currentRole === r.id;
                       const activeStyles = isSelected 
                         ? 'bg-blue-50/50 text-blue-600 border border-blue-100/50' 
                         : 'hover:bg-slate-50/80 border border-transparent text-slate-600 hover:text-slate-900';
                       const iconColor = isSelected ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600';
                       return (
                         <button
                           key={r.id}
                           onClick={() => {
                             setCurrentRole(r.id);
                             setIsDropdownOpen(false);
                           }}
                           className={`w-full flex items-start gap-3 p-2.5 rounded-xl transition-all duration-150 cursor-pointer text-left ${activeStyles}`}
                         >
                           <div className={`p-1.5 bg-slate-50 rounded-lg shrink-0 ${iconColor}`}>
                             <IconComponent className="w-4 h-4" />
                           </div>
                           <div className="flex-1 space-y-0.5 min-w-0">
                             <div className="flex items-center justify-between">
                               <span className={`text-xs font-bold block ${isSelected ? 'text-blue-700 font-extrabold' : 'text-slate-800'}`}>
                                 {r.name}
                               </span>
                               {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 stroke-[3]" />}
                             </div>
                             <p className="text-[10px] text-slate-400 leading-normal font-semibold">
                               {r.description}
                             </p>
                           </div>
                         </button>
                       );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Notification icon */}
            <button 
              onClick={() => alert('Simulation: Open Notification Center')}
              className="p-2 bg-blue-900/50 hover:bg-blue-800/60 border border-blue-800/40 lg:bg-slate-50 lg:hover:bg-slate-100 lg:border-slate-200/50 transition cursor-pointer relative rounded-xl text-blue-200 lg:text-slate-400 hover:text-white lg:hover:text-slate-600"
            >
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-60"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-600"></span>
              </span>
            </button>

            {/* Profile details (Desktop only) */}
            <div className="hidden sm:flex items-center gap-2.5 border-l border-slate-100 pl-4 anim-fade-in stagger-3">
              <div className="text-right space-y-0.5">
                <span className="text-xs font-black text-slate-800 block">
                  {currentRole === 'broker' ? 'Amit Patel' :
                   currentRole === 'receptionist' ? 'Front Desk Staff' :
                   currentRole === 'sales' ? 'Executive B' : 'Admin System'}
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  {currentRole} Account
                </span>
              </div>
              <div className="w-9 h-9 rounded-xl bg-[#1A56DB] text-white font-bold text-sm flex items-center justify-center shadow-sm select-none">
                {currentRole.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Screen Content Body */}
        <div className="flex-1 p-6 pb-24 lg:pb-6 bg-[#F1F5F9]">
          <div key={activeScreen} className="anim-fade-up">
            {renderScreen()}
          </div>
        </div>

        {/* Mobile Bottom Navigation (shown on mobile widths) */}
        <MobileNav />
      </div>
    </div>
  );
};

export default Dashboard;
