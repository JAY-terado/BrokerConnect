import React from 'react';
import { useBrokerConnect } from '../context/BrokerConnectContext';
import { LayoutDashboard, Users, Eye, Landmark, Menu } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { currentRole, activeScreen, setActiveScreen } = useBrokerConnect();

  // Highlight button statuses
  const isSelected = (screenIds: number[]) => screenIds.includes(activeScreen);

  return (
    <nav className="fixed bottom-0 inset-x-0 lg:hidden border-t border-slate-100 bg-white/95 backdrop-blur-md flex items-center justify-around py-3 select-none shadow-2xl z-50">
      
      {/* Tab 1: Dashboard */}
      <button
        onClick={() => {
          if (currentRole === 'broker') setActiveScreen(2);
          else if (currentRole === 'receptionist') setActiveScreen(6);
          else if (currentRole === 'sales') setActiveScreen(9);
          else setActiveScreen(14);
        }}
        className={`flex flex-col items-center gap-1 text-[9px] font-bold uppercase transition cursor-pointer ${
          isSelected([2, 6, 9, 14]) ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <LayoutDashboard className="w-5 h-5" />
        <span>Dashboard</span>
      </button>

      {/* Tab 2: Leads / Register */}
      <button
        onClick={() => {
          if (currentRole === 'broker') setActiveScreen(3);
          else if (currentRole === 'receptionist') setActiveScreen(7);
          else if (currentRole === 'sales') setActiveScreen(9);
          else setActiveScreen(15);
        }}
        className={`flex flex-col items-center gap-1 text-[9px] font-bold uppercase transition cursor-pointer ${
          isSelected([3, 7, 15]) ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <Users className="w-5 h-5" />
        <span>{currentRole === 'receptionist' ? 'Check-In' : 'Leads'}</span>
      </button>

      {/* Tab 3: Visits */}
      <button
        onClick={() => {
          if (currentRole === 'broker') setActiveScreen(5);
          else if (currentRole === 'receptionist') setActiveScreen(8);
          else if (currentRole === 'sales') setActiveScreen(10);
          else setActiveScreen(13);
        }}
        className={`flex flex-col items-center gap-1 text-[9px] font-bold uppercase transition cursor-pointer ${
          isSelected([5, 8, 10, 13]) ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <Eye className="w-5 h-5" />
        <span>{currentRole === 'broker' ? 'Pass' : currentRole === 'receptionist' ? 'Alloc' : 'Disputes'}</span>
      </button>

      {/* Tab 4: Bookings / Projects */}
      <button
        onClick={() => {
          if (currentRole === 'admin') setActiveScreen(16);
          else setActiveScreen(11);
        }}
        className={`flex flex-col items-center gap-1 text-[9px] font-bold uppercase transition cursor-pointer ${
          isSelected([11, 16]) ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <Landmark className="w-5 h-5" />
        <span>{currentRole === 'admin' ? 'Projects' : 'Bookings'}</span>
      </button>

      {/* Tab 5: More options menu */}
      <button
        onClick={() => {
          if (currentRole === 'broker') setActiveScreen(12);
          else setActiveScreen(1); // Sign out
        }}
        className={`flex flex-col items-center gap-1 text-[9px] font-bold uppercase transition cursor-pointer ${
          isSelected([12, 1]) ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <Menu className="w-5 h-5" />
        <span>{currentRole === 'broker' ? 'Payouts' : 'Logout'}</span>
      </button>
    </nav>
  );
};
