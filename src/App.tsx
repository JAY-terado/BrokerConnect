import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { BrokerConnectProvider } from './context/BrokerConnectContext';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';

// Screen imports
import { BrokerDashboard } from './components/screens/BrokerDashboard';
import { RegisterCustomer } from './components/screens/RegisterCustomer';
import { OTPVerification } from './components/screens/OTPVerification';
import { VisitPass } from './components/screens/VisitPass';
import { ReceptionDashboard } from './components/screens/ReceptionDashboard';
import { VisitorCheckIn } from './components/screens/VisitorCheckIn';
import { SalesAllocation } from './components/screens/SalesAllocation';
import { SalesCRM } from './components/screens/SalesCRM';
import { CustomerDetails } from './components/screens/CustomerDetails';
import { BookingManagement } from './components/screens/BookingManagement';
import { CommissionManagement } from './components/screens/CommissionManagement';
import { DisputeManagement } from './components/screens/DisputeManagement';
import { ReportsAnalytics } from './components/screens/ReportsAnalytics';
import { BrokerManagement } from './components/screens/BrokerManagement';
import { ProjectManagement } from './components/screens/ProjectManagement';

// Middleware imports

function App() {
  return (
    <Router>
      <BrokerConnectProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/dashboard" element={<Navigate to="/broker" replace />} />
          
          <Route element={<Dashboard />}>
            {/* Broker routes */}
            <Route path="/broker" element={<BrokerDashboard />} />
            <Route path="/broker/register-customer" element={<RegisterCustomer />} />
            <Route path="/broker/otp-verification" element={<OTPVerification />} />
            <Route path="/broker/visit-pass" element={<VisitPass />} />
            <Route path="/broker/commission" element={<CommissionManagement />} />
            
            {/* Receptionist routes */}
            <Route path="/receptionist" element={<ReceptionDashboard />} />
            <Route path="/receptionist/check-in" element={<VisitorCheckIn />} />
            <Route path="/receptionist/allocation" element={<SalesAllocation />} />
            
            {/* Sales routes */}
            <Route path="/sales" element={<SalesCRM />} />
            <Route path="/sales/customer-details" element={<CustomerDetails />} />
            <Route path="/sales/bookings" element={<BookingManagement />} />
            <Route path="/sales/commission" element={<CommissionManagement />} />
            
            {/* Admin routes */}
            <Route path="/admin" element={<ReportsAnalytics />} />
            <Route path="/admin/disputes" element={<DisputeManagement />} />
            <Route path="/admin/brokers" element={<BrokerManagement />} />
            <Route path="/admin/projects" element={<ProjectManagement />} />
          </Route>
          
          {/* Default Redirect to Login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrokerConnectProvider>
    </Router>
  );
}

export default App;
