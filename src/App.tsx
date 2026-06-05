import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { BrokerConnectProvider } from './context/BrokerConnectContext';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';

function App() {
  return (
    <BrokerConnectProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Default Redirect to Login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </BrokerConnectProvider>
  );
}

export default App;
