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

import { Bell, HelpCircle, Building2 } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { activeScreen, currentRole, setCurrentRole } = useBrokerConnect();

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
    <div className="flex min-h-screen bg-slate-50 text-slate-800 w-full overflow-x-hidden text-left">
      {/* Desktop Sidebar (automatically hidden on mobile widths) */}
      <div className="hidden lg:block sticky top-0 h-screen shrink-0">
        <Sidebar />
      </div>

      {/* Core content wrapper */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen relative pb-20 lg:pb-0">
        
        {/* Dashboard Header Bar */}
        <header className="bg-white border-b border-slate-100 px-6 py-4 flex justify-between items-center shrink-0 relative z-10 select-none shadow-sm">
          {/* Left side info / Logo */}
          <div className="flex items-center gap-3">
            {/* Mobile Branding Logo */}
            <div className="flex lg:hidden items-center gap-2">
              <div className="p-1.5 bg-blue-600 rounded-lg text-white">
                <Building2 className="w-4 h-4" />
              </div>
              <span className="text-sm font-black text-slate-900 tracking-tight">BrokerConnect</span>
            </div>

            <span className="hidden lg:inline-block text-xs font-extrabold text-slate-500 uppercase tracking-wider bg-slate-50 border px-3 py-1.5 rounded-lg">
              Role Context: {currentRole}
            </span>
          </div>

          {/* Right side controls / Profiles */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Quick Demo Role Switcher Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-xl text-[10px] sm:text-xs font-bold text-slate-600">
              <span className="hidden sm:inline">Demo Role:</span>
              <select
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value as any)}
                className="bg-transparent text-slate-800 font-extrabold focus:outline-none cursor-pointer"
              >
                <option value="broker">Broker</option>
                <option value="receptionist">Receptionist</option>
                <option value="sales">Sales CRM</option>
                <option value="admin">Admin Panel</option>
              </select>
            </div>

            {/* Notification icon */}
            <button 
              onClick={() => alert('Simulation: Open Notification Center')}
              className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 border border-slate-200/50 transition cursor-pointer relative"
            >
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full"></span>
            </button>

            {/* Profile details (Desktop only) */}
            <div className="hidden sm:flex items-center gap-2.5 border-l border-slate-100 pl-4">
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
              <div className="w-8.5 h-8.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm select-none">
                {currentRole.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Screen Content Body */}
        <div className="flex-1 p-4 sm:p-6 pb-24 lg:pb-6">
          {renderScreen()}
        </div>

        {/* Mobile Bottom Navigation (shown on mobile widths) */}
        <MobileNav />
      </div>
    </div>
  );
};

export default Dashboard;
