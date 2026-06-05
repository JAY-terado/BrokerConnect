import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBrokerConnect } from '../context/BrokerConnectContext';
import { 
  LayoutDashboard, Users, Eye, Landmark, IndianRupee, 
  AlertTriangle, BarChart3, Building2, UserCheck, ShieldCheck, LogOut 
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
    <aside className="w-64 bg-slate-900 text-slate-400 p-6 flex flex-col justify-between shrink-0 h-screen border-r border-slate-800 relative z-20">
      <div className="space-y-8">
        {/* Branding Logo */}
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800">
          <div className="p-2 bg-blue-600 rounded-xl text-white">
            <Building2 className="w-5 h-5" />
          </div>
          <span className="text-white text-base font-bold tracking-tight">BrokerConnect</span>
        </div>

        {/* Role identifier badge */}
        <div className="px-3.5 py-2 bg-slate-800/60 border border-slate-700/50 rounded-xl">
          <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider">Signed in as</span>
          <span className="text-xs text-white font-extrabold capitalize block mt-0.5">{currentRole} Portal</span>
        </div>

        {/* Navigation links */}
        <nav className="space-y-1.5">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-3 pl-2">Navigation</span>
          
          {navItems.map((item) => {
            const Icon = item.icon;
            const isSelected = activeScreen === item.screenId;
            return (
              <button
                key={item.screenId}
                onClick={() => setActiveScreen(item.screenId)}
                className={`w-full flex items-center gap-3.5 py-3 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10' 
                    : 'hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-4.5 h-4.5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Log Out */}
      <button
        onClick={() => {
          setActiveScreen(2); // Reset to default screen for next login
          navigate('/login');
        }}
        className="w-full flex items-center gap-3 py-3 px-4 hover:bg-slate-800 hover:text-slate-200 text-slate-400 rounded-xl text-xs font-bold transition cursor-pointer"
      >
        <LogOut className="w-4.5 h-4.5 text-slate-400" />
        <span>Logout Session</span>
      </button>
    </aside>
  );
};
