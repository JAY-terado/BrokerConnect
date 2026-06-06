import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBrokerConnect } from '../context/BrokerConnectContext';
import { LayoutDashboard, Users, Eye, Landmark, Menu } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { currentRole, activeScreen, setActiveScreen } = useBrokerConnect();
  const navigate = useNavigate();

  // Highlight button statuses
  const isSelected = (screenIds: number[]) => screenIds.includes(activeScreen);

  return (
    <nav 
      className="fixed bottom-0 inset-x-0 lg:hidden bg-[#0A1628] border-t border-white/8 backdrop-blur-xl shadow-[0_-4px_24px_rgba(10,22,40,0.3)] flex items-center justify-around h-16 pb-safe select-none z-50 translate-y-0 transition-transform duration-300 [will-change:transform]"
      style={{ animation: 'slideUpNav 0.35s cubic-bezier(0.16,1,0.3,1) both' }}
    >
      
      {/* Tab 1: Dashboard */}
      <button
        onClick={() => {
          if (currentRole === 'broker') setActiveScreen(2);
          else if (currentRole === 'receptionist') setActiveScreen(6);
          else if (currentRole === 'sales') setActiveScreen(9);
          else setActiveScreen(14);
        }}
        className={`relative flex flex-col items-center gap-0.5 px-3 py-1 text-[9px] uppercase tracking-widest transition-all duration-150 cursor-pointer active:scale-90 ${
          isSelected([2, 6, 9, 14])
            ? 'text-white font-bold'
            : 'text-white/35 hover:text-white/70 font-medium'
        }`}
      >
        {isSelected([2, 6, 9, 14]) && (
          <span className="absolute top-0 inset-x-0 h-0.5 bg-sky-400 rounded-b anim-scale-in" />
        )}
        <LayoutDashboard 
          className={`w-5 h-5 transition-transform duration-200 ${isSelected([2, 6, 9, 14]) ? 'text-sky-400' : ''}`} 
          style={isSelected([2, 6, 9, 14]) ? { transform: 'scale(1.1)' } : undefined}
        />
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
        className={`relative flex flex-col items-center gap-0.5 px-3 py-1 text-[9px] uppercase tracking-widest transition-all duration-150 cursor-pointer active:scale-90 ${
          isSelected([3, 7, 15])
            ? 'text-white font-bold'
            : 'text-white/35 hover:text-white/70 font-medium'
        }`}
      >
        {isSelected([3, 7, 15]) && (
          <span className="absolute top-0 inset-x-0 h-0.5 bg-sky-400 rounded-b anim-scale-in" />
        )}
        <Users 
          className={`w-5 h-5 transition-transform duration-200 ${isSelected([3, 7, 15]) ? 'text-sky-400' : ''}`} 
          style={isSelected([3, 7, 15]) ? { transform: 'scale(1.1)' } : undefined}
        />
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
        className={`relative flex flex-col items-center gap-0.5 px-3 py-1 text-[9px] uppercase tracking-widest transition-all duration-150 cursor-pointer active:scale-90 ${
          isSelected([5, 8, 10, 13])
            ? 'text-white font-bold'
            : 'text-white/35 hover:text-white/70 font-medium'
        }`}
      >
        {isSelected([5, 8, 10, 13]) && (
          <span className="absolute top-0 inset-x-0 h-0.5 bg-sky-400 rounded-b anim-scale-in" />
        )}
        <Eye 
          className={`w-5 h-5 transition-transform duration-200 ${isSelected([5, 8, 10, 13]) ? 'text-sky-400' : ''}`} 
          style={isSelected([5, 8, 10, 13]) ? { transform: 'scale(1.1)' } : undefined}
        />
        <span>{currentRole === 'broker' ? 'Pass' : currentRole === 'receptionist' ? 'Alloc' : 'Disputes'}</span>
      </button>

      {/* Tab 4: Bookings / Projects */}
      <button
        onClick={() => {
          if (currentRole === 'admin') setActiveScreen(16);
          else setActiveScreen(11);
        }}
        className={`relative flex flex-col items-center gap-0.5 px-3 py-1 text-[9px] uppercase tracking-widest transition-all duration-150 cursor-pointer active:scale-90 ${
          isSelected([11, 16])
            ? 'text-white font-bold'
            : 'text-white/35 hover:text-white/70 font-medium'
        }`}
      >
        {isSelected([11, 16]) && (
          <span className="absolute top-0 inset-x-0 h-0.5 bg-sky-400 rounded-b anim-scale-in" />
        )}
        <Landmark 
          className={`w-5 h-5 transition-transform duration-200 ${isSelected([11, 16]) ? 'text-sky-400' : ''}`} 
          style={isSelected([11, 16]) ? { transform: 'scale(1.1)' } : undefined}
        />
        <span>{currentRole === 'admin' ? 'Projects' : 'Bookings'}</span>
      </button>

      {/* Tab 5: More options menu */}
      <button
        onClick={() => {
          if (currentRole === 'broker') {
            setActiveScreen(12);
          } else {
            setActiveScreen(2); // Reset to default screen
            navigate('/login');
          }
        }}
        className={`relative flex flex-col items-center gap-0.5 px-3 py-1 text-[9px] uppercase tracking-widest transition-all duration-150 cursor-pointer active:scale-90 ${
          isSelected([12, 1])
            ? 'text-white font-bold'
            : 'text-white/35 hover:text-white/70 font-medium'
        }`}
      >
        {isSelected([12, 1]) && (
          <span className="absolute top-0 inset-x-0 h-0.5 bg-sky-400 rounded-b anim-scale-in" />
        )}
        <Menu 
          className={`w-5 h-5 transition-transform duration-200 ${isSelected([12, 1]) ? 'text-sky-400' : ''}`} 
          style={isSelected([12, 1]) ? { transform: 'scale(1.1)' } : undefined}
        />
        <span>{currentRole === 'broker' ? 'Payouts' : 'Logout'}</span>
      </button>
    </nav>
  );
};
