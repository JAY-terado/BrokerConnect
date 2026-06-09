import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBrokerConnect } from '../context/BrokerConnectContext';
import Cookies from 'js-cookie';
import { 
  LayoutDashboard, Users, Eye, Landmark, IndianRupee, 
  AlertTriangle, BarChart3, Building2, UserCheck, ShieldCheck, LogOut, SlidersHorizontal 
} from 'lucide-react';

interface SidebarItem {
  name: string;
  screenId: number;
  icon: React.ComponentType<{ className?: string }>;
}

export const Sidebar: React.FC = () => {
  const { currentRole, activeScreen, setActiveScreen } = useBrokerConnect();
  const navigate = useNavigate();

  // Define navigations based on selected role
  const brokerItems: SidebarItem[] = [
    { name: 'Dashboard', screenId: 2, icon: LayoutDashboard },
    { name: 'Register Lead', screenId: 3, icon: UserCheck },
    { name: 'Visit Pass', screenId: 5, icon: ShieldCheck },
    { name: 'Commission', screenId: 12, icon: IndianRupee },
  ];

  const receptionistItems: SidebarItem[] = [
    { name: 'Reception Dash', screenId: 6, icon: LayoutDashboard },
    { name: 'Visitor Check-In', screenId: 7, icon: Eye },
    { name: 'Allocation', screenId: 8, icon: UserCheck },
  ];

  const salesItems: SidebarItem[] = [
    { name: 'Sales Pipeline', screenId: 9, icon: LayoutDashboard },
    { name: 'Customer File', screenId: 10, icon: Users },
    { name: 'Bookings', screenId: 11, icon: Landmark },
    { name: 'Commissions', screenId: 12, icon: IndianRupee },
  ];

  const adminItems: SidebarItem[] = [
    { name: 'Reports & Analytics', screenId: 14, icon: BarChart3 },
    { name: 'Disputes Audit', screenId: 13, icon: AlertTriangle },
    { name: 'Manage Brokers', screenId: 15, icon: Users },
    { name: 'Manage Projects', screenId: 16, icon: Building2 },
    { name: 'Customization', screenId: 17, icon: SlidersHorizontal },
  ];

  const getActiveItems = () => {
    switch (currentRole) {
      case 'receptionist': return receptionistItems;
      case 'sales': return salesItems;
      case 'admin': return adminItems;
      default: return brokerItems;
    }
  };

  const navItems = getActiveItems();

  return (
    <aside className="w-60 bg-[#0A1628] text-blue-200 p-6 flex flex-col justify-between gap-2 shrink-0 h-screen border-r border-white/5 relative z-20 shadow-lg">
      <div className="space-y-8 anim-slide-left">
        {/* Branding Logo */}
        <div className="mb-2 flex items-center justify-start pl-1 anim-fade-in stagger-1">
          <img 
            src="/logo.png" 
            alt="Logo" 
            className="h-8.5 w-auto object-contain" 
          />
        </div>
 
        {/* Role identifier badge */}
        <div key={currentRole} className="mx-1 px-3 py-2.5 bg-white/5 border border-white/8 rounded-xl flex items-center gap-2.5 anim-fade-up stagger-2">
          <div className="w-7 h-7 rounded-lg bg-blue-600/30 border border-blue-500/20 flex items-center justify-center text-blue-300 text-[10px] font-black uppercase">
            {currentRole[0]}
          </div>
          <div>
            <span className="text-[9px] text-blue-400/80 font-bold block uppercase tracking-wider">Signed in as</span>
            <span className="text-xs text-white font-bold capitalize block">{currentRole} Portal</span>
          </div>
        </div>
 
        {/* Navigation links */}
        <nav className="space-y-0.5">
          <span className="text-[9px] text-white/25 font-bold uppercase tracking-[0.12em] block mb-2 px-3">Navigation</span>
          
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isSelected = activeScreen === item.screenId;
            return (
              <button
                key={item.screenId}
                onClick={() => setActiveScreen(item.screenId)}
                style={{ animationDelay: `${0.05 + index * 0.04}s` }}
                className={`group w-full flex items-center py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer anim-fade-up ${
                  isSelected 
                    ? 'bg-white/10 text-white border-white/10 shadow-none' 
                    : 'text-white/50 hover:text-white/90 hover:bg-white/6 border-transparent rounded-xl transition-all duration-150'
                }`}
              >
                <span className="relative flex items-center gap-3 w-full pl-3">
                  {isSelected && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-blue-400 rounded-r-full transition-all duration-200 anim-scale-in"></span>
                  )}
                  <Icon className={`w-4.5 h-4.5 transition-transform duration-200 group-hover:translate-x-0.5 ${isSelected ? 'text-blue-400' : 'text-white/35'}`} />
                  <span>{item.name}</span>
                </span>
              </button>
            );
          })}
        </nav>
      </div>
 
      {/* Log Out */}
      <div>
        <div className="border-t border-white/6 mx-1 mb-2"></div>
        <button
          onClick={() => {
            Cookies.remove('token');
            Cookies.remove('userRole');
            Cookies.remove('full_name');
            Cookies.remove('is_profile_completed');
            setActiveScreen(2); // Reset to default screen for next login
            navigate('/login');
          }}
          className="w-full flex items-center gap-3 py-2.5 px-3 text-white/30 hover:text-red-400 hover:bg-red-500/8 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer border border-transparent hover:border-red-500/10 press smooth"
        >
          <LogOut className="w-4.5 h-4.5" />
          <span>Logout Session</span>
        </button>
      </div>
    </aside>
  );
};
