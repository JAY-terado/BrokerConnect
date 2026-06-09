import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Types
export interface Broker {
  id: string;
  name: string;
  mobile: string;
  status: 'Active' | 'Pending Approval' | 'Suspended';
}

export interface Project {
  name: string;
  location: string;
  towers: number;
  units: number;
  status: 'Active' | 'Upcoming';
}

export interface Lead {
  id: string;
  name: string;
  mobile: string;
  email: string;
  city: string;
  project: string;
  unitType: string;
  budget: string;
  expectedDate: string;
  expectedTime: string;
  brokerId: string;
  brokerName: string;
  status: 'OTP Pending' | 'OTP Verified' | 'Checked In' | 'Allocated' | 'Follow-Up' | 'Negotiation' | 'Booked';
  otp: string;
  visitCode: string;
  registeredOn: string;
  ownershipValidTill: string;
  address?: string;
  occupation?: string;
  company?: string;
  documents?: {
    pan?: boolean;
    aadhaar?: boolean;
  };
  selfieUrl?: string;
  assignedExecutive?: string;
  allocationTime?: string;
  lastActivity?: string;
}

export interface Booking {
  id: string;
  leadId: string;
  customerName: string;
  project: string;
  tower: string;
  floor: string;
  unitNo: string;
  bookingAmount: number;
  agreementValue: number;
  bookingDate: string;
  status: 'Booked' | 'Cancelled';
}

export interface Commission {
  id: string;
  bookingId: string;
  customerName: string;
  brokerName: string;
  agreementValue: number;
  commissionPercent: number;
  commissionAmount: number;
  status: 'Pending' | 'Approved' | 'Paid';
  expectedPayoutDate: string;
}

export interface Dispute {
  id: string;
  customerName: string;
  mobile: string;
  brokerAId: string;
  brokerAName: string;
  brokerBId: string;
  brokerBName: string;
  raisedOn: string;
  status: 'Under Review' | 'Resolved (Broker A)' | 'Resolved (Broker B)' | 'Rejected';
  otpVerified: boolean;
  registrationTime: string;
  visitHistory: number;
  customerConsent: boolean;
}

interface BrokerConnectContextType {
  brokers: Broker[];
  projects: Project[];
  leads: Lead[];
  bookings: Booking[];
  commissions: Commission[];
  disputes: Dispute[];
  currentRole: 'broker' | 'receptionist' | 'sales' | 'admin';
  setCurrentRole: (role: 'broker' | 'receptionist' | 'sales' | 'admin') => void;
  activeScreen: number; // 1 to 16 matching the mock screens
  setActiveScreen: (screen: number) => void;
  deviceMode: 'desktop' | 'mobile' | 'responsive';
  setDeviceMode: (mode: 'desktop' | 'mobile' | 'responsive') => void;
  
  // Actions
  registerLead: (leadData: Omit<Lead, 'id' | 'otp' | 'visitCode' | 'registeredOn' | 'ownershipValidTill' | 'status'>) => { leadId: string; otp: string; disputeRaised: boolean };
  verifyLeadOTP: (leadId: string, enteredOtp: string) => boolean;
  checkInVisitor: (leadId: string, details: { address: string; occupation: string; company: string; panUploaded: boolean; aadhaarUploaded: boolean; selfieCaptured: boolean }) => void;
  autoAllocateSales: (leadId: string) => string;
  reallocateSales: (leadId: string, executive: string) => void;
  updateLeadStage: (leadId: string, stage: Lead['status']) => void;
  createBooking: (bookingData: Omit<Booking, 'id' | 'bookingDate' | 'status'>) => void;
  approveCommission: (commissionId: string) => void;
  payCommission: (commissionId: string) => void;
  resolveDispute: (disputeId: string, decision: 'brokerA' | 'brokerB' | 'reject') => void;
  addBroker: (name: string, mobile: string) => void;
  approveBroker: (brokerId: string) => void;
  toggleBrokerStatus: (brokerId: string) => void;
  addProject: (project: Project) => void;
  
  // Simulation Helpers
  resetSimulation: () => void;
}

const BrokerConnectContext = createContext<BrokerConnectContextType | undefined>(undefined);

const initialBrokers: Broker[] = [
  { id: 'BRK-001', name: 'Amit Patel', mobile: '98765 43210', status: 'Active' },
  { id: 'BRK-002', name: 'Kiran Desai', mobile: '91234 56789', status: 'Active' },
  { id: 'BRK-003', name: 'Neha Gupta', mobile: '90887 76655', status: 'Pending Approval' },
  { id: 'BRK-004', name: 'Rohit Sharma', mobile: '88998 87766', status: 'Suspended' },
  { id: 'BRK-005', name: 'Vikram Singh', mobile: '88776 65544', status: 'Active' },
];

const initialProjects: Project[] = [
  { name: 'Sunrise Meadows', location: 'Mumbai', towers: 3, units: 450, status: 'Active' },
  { name: 'Green Heights', location: 'Pune', towers: 2, units: 280, status: 'Active' },
  { name: 'Ocean View', location: 'Goa', towers: 2, units: 150, status: 'Active' },
  { name: 'Skyline Residences', location: 'Bangalore', towers: 4, units: 500, status: 'Upcoming' },
  { name: 'Riverfront Apartments', location: 'Ahmedabad', towers: 2, units: 200, status: 'Upcoming' },
];

const initialLeads: Lead[] = [
  {
    id: 'L-101',
    name: 'Rahul Shah',
    mobile: '98765 43210',
    email: 'rahul.shah@gmail.com',
    city: 'Mumbai',
    project: 'Sunrise Meadows',
    unitType: '2 BHK',
    budget: '₹80L - ₹1Cr',
    expectedDate: '2026-06-15',
    expectedTime: '11:00 AM',
    brokerId: 'BRK-001',
    brokerName: 'Amit Patel',
    status: 'Booked',
    otp: '1234',
    visitCode: 'VIS-2026-45891',
    registeredOn: '2026-05-15',
    ownershipValidTill: '2026-08-15',
    address: 'Noida, Uttar Pradesh',
    occupation: 'Business',
    company: 'ABC Pvt Ltd',
    documents: { pan: true, aadhaar: true },
    selfieUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    assignedExecutive: 'Executive B',
    allocationTime: '2026-06-05 11:05 AM',
    lastActivity: '2026-06-05',
  },
  {
    id: 'L-102',
    name: 'Amit Patel',
    mobile: '91234 88765',
    email: 'amit.patel@yahoo.com',
    city: 'Pune',
    project: 'Green Heights',
    unitType: '3 BHK',
    budget: '₹1.2Cr - ₹1.5Cr',
    expectedDate: '2026-06-05',
    expectedTime: '11:30 AM',
    brokerId: 'BRK-002',
    brokerName: 'Kiran Desai',
    status: 'Checked In',
    otp: '5678',
    visitCode: 'VIS-2026-45892',
    registeredOn: '2026-06-01',
    ownershipValidTill: '2026-09-01',
    address: 'Pune, Maharashtra',
    occupation: 'Software Engineer',
    company: 'TechCorp',
    documents: { pan: true, aadhaar: true },
    lastActivity: '2026-06-05',
  },
  {
    id: 'L-103',
    name: 'Suresh Jain',
    mobile: '92345 67890',
    email: 'suresh.jain@rediffmail.com',
    city: 'Goa',
    project: 'Ocean View',
    unitType: 'Penthouse',
    budget: '₹2.5Cr+',
    expectedDate: '2026-06-06',
    expectedTime: '02:00 PM',
    brokerId: 'BRK-003',
    brokerName: 'Neha Gupta',
    status: 'OTP Verified',
    otp: '4321',
    visitCode: 'VIS-2026-45893',
    registeredOn: '2026-06-04',
    ownershipValidTill: '2026-09-04',
    lastActivity: '2026-06-04',
  },
  {
    id: 'L-104',
    name: 'Priya Mehta',
    mobile: '88776 61122',
    email: 'priya.mehta@gmail.com',
    city: 'Mumbai',
    project: 'Sunrise Meadows',
    unitType: '1 BHK',
    budget: '₹50L - ₹60L',
    expectedDate: '2026-06-05',
    expectedTime: '12:30 PM',
    brokerId: 'BRK-004',
    brokerName: 'Rohit Sharma',
    status: 'OTP Pending',
    otp: '9999',
    visitCode: 'VIS-2026-45894',
    registeredOn: '2026-06-05',
    ownershipValidTill: '2026-09-05',
    lastActivity: '2026-06-05',
  },
  {
    id: 'L-105',
    name: 'Neha Verma',
    mobile: '77665 54433',
    email: 'neha.verma@outlook.com',
    city: 'Ahmedabad',
    project: 'Riverfront Apartments',
    unitType: '3 BHK',
    budget: '₹1.5Cr - ₹2Cr',
    expectedDate: '2026-06-10',
    expectedTime: '04:00 PM',
    brokerId: 'BRK-005',
    brokerName: 'Vikram Singh',
    status: 'Negotiation',
    otp: '8888',
    visitCode: 'VIS-2026-45895',
    registeredOn: '2026-06-03',
    ownershipValidTill: '2026-09-03',
    lastActivity: '2026-06-05',
  },
];

const initialBookings: Booking[] = [
  {
    id: 'BK-2026-00123',
    leadId: 'L-101',
    customerName: 'Rahul Shah',
    project: 'Sunrise Meadows',
    tower: 'Tower A',
    floor: 'Floor 12',
    unitNo: '1203',
    bookingAmount: 500000,
    agreementValue: 8500000,
    bookingDate: '2026-05-20',
    status: 'Booked',
  },
];

const initialCommissions: Commission[] = [
  {
    id: 'COM-2026-00125',
    bookingId: 'BK-2026-00123',
    customerName: 'Rahul Shah',
    brokerName: 'Amit Patel',
    agreementValue: 8500000,
    commissionPercent: 2.0,
    commissionAmount: 170000,
    status: 'Approved',
    expectedPayoutDate: '2026-06-30',
  },
];

const initialDisputes: Dispute[] = [
  {
    id: 'DSP-2026-00045',
    customerName: 'Rahul Shah',
    mobile: '98765 43210',
    brokerAId: 'BRK-001',
    brokerAName: 'Amit Patel',
    brokerBId: 'BRK-005',
    brokerBName: 'Vikram Singh',
    raisedOn: '2026-05-16',
    status: 'Under Review',
    otpVerified: true,
    registrationTime: '15 May 2026, 10:28 AM',
    visitHistory: 3,
    customerConsent: true,
  },
];

const salesExecutives = ['Executive A', 'Executive B', 'Executive C', 'Executive D'];

const screenToPath: Record<number, string> = {
  2: '/broker',
  3: '/broker/register-customer',
  4: '/broker/otp-verification',
  5: '/broker/visit-pass',
  6: '/receptionist',
  7: '/receptionist/check-in',
  8: '/receptionist/allocation',
  9: '/sales',
  10: '/sales/customer-details',
  11: '/sales/bookings',
  12: '/broker/commission',
  13: '/admin/disputes',
  14: '/admin',
  15: '/admin/brokers',
  16: '/admin/projects',
};

const pathToScreen: Record<string, { screen: number; role: 'broker' | 'receptionist' | 'sales' | 'admin' }> = {
  '/broker': { screen: 2, role: 'broker' },
  '/broker/register-customer': { screen: 3, role: 'broker' },
  '/broker/otp-verification': { screen: 4, role: 'broker' },
  '/broker/visit-pass': { screen: 5, role: 'broker' },
  '/receptionist': { screen: 6, role: 'receptionist' },
  '/receptionist/check-in': { screen: 7, role: 'receptionist' },
  '/receptionist/allocation': { screen: 8, role: 'receptionist' },
  '/sales': { screen: 9, role: 'sales' },
  '/sales/customer-details': { screen: 10, role: 'sales' },
  '/sales/bookings': { screen: 11, role: 'sales' },
  '/broker/commission': { screen: 12, role: 'broker' },
  '/sales/commission': { screen: 12, role: 'sales' },
  '/admin/disputes': { screen: 13, role: 'admin' },
  '/admin': { screen: 14, role: 'admin' },
  '/admin/brokers': { screen: 15, role: 'admin' },
  '/admin/projects': { screen: 16, role: 'admin' },
};

export const BrokerConnectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [brokers, setBrokers] = useState<Broker[]>(initialBrokers);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [commissions, setCommissions] = useState<Commission[]>(initialCommissions);
  const [disputes, setDisputes] = useState<Dispute[]>(initialDisputes);
  
  const [currentRole, setCurrentRoleState] = useState<'broker' | 'receptionist' | 'sales' | 'admin'>('broker');
  const [activeScreen, setActiveScreenState] = useState<number>(2); // Starts on Broker Dashboard
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile' | 'responsive'>('responsive');
  const [roundRobinIndex, setRoundRobinIndex] = useState<number>(1); // Current pointer: Executive B

  const location = useLocation();
  const navigate = useNavigate();

  const setActiveScreen = (screen: number) => {
    if (screen === 12) {
      if (currentRole === 'sales') {
        navigate('/sales/commission');
      } else {
        navigate('/broker/commission');
      }
      return;
    }
    const path = screenToPath[screen];
    if (path) {
      navigate(path);
    }
  };

  const setCurrentRole = (role: 'broker' | 'receptionist' | 'sales' | 'admin') => {
    setCurrentRoleState(role);
    if (role === 'broker') {
      navigate('/broker');
    } else if (role === 'receptionist') {
      navigate('/receptionist');
    } else if (role === 'sales') {
      navigate('/sales');
    } else if (role === 'admin') {
      navigate('/admin');
    }
  };

  // Sync pathname to activeScreen and currentRole
  useEffect(() => {
    const match = pathToScreen[location.pathname];
    if (match) {
      if (activeScreen !== match.screen) {
        setActiveScreenState(match.screen);
      }
      if (location.pathname === '/broker/commission' || location.pathname === '/sales/commission') {
        if (currentRole !== 'broker' && currentRole !== 'sales') {
          setCurrentRoleState(match.role);
        }
      } else if (currentRole !== match.role) {
        setCurrentRoleState(match.role);
      }
    }
  }, [location.pathname, activeScreen, currentRole]);

  // Actions
  const registerLead = (leadData: Omit<Lead, 'id' | 'otp' | 'visitCode' | 'registeredOn' | 'ownershipValidTill' | 'status'>) => {
    // Check if customer mobile is already registered by another broker (trigger dispute simulation)
    const existingActiveLead = leads.find(l => l.mobile.replace(/\s+/g, '') === leadData.mobile.replace(/\s+/g, '') && l.status !== 'Booked');
    
    const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const newId = `L-${Date.now().toString().slice(-4)}`;
    const newVisitCode = `VIS-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const today = new Date().toISOString().split('T')[0];
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 90);
    const expiryStr = expiry.toISOString().split('T')[0];

    const currentBroker = brokers.find(b => b.id === leadData.brokerId) || brokers[0];

    let disputeRaised = false;

    if (existingActiveLead && existingActiveLead.brokerId !== leadData.brokerId) {
      // Create a dispute
      const newDispute: Dispute = {
        id: `DSP-2026-000${Math.floor(10 + Math.random() * 90)}`,
        customerName: leadData.name,
        mobile: leadData.mobile,
        brokerAId: existingActiveLead.brokerId,
        brokerAName: existingActiveLead.brokerName,
        brokerBId: currentBroker.id,
        brokerBName: currentBroker.name,
        raisedOn: today,
        status: 'Under Review',
        otpVerified: true,
        registrationTime: `${today}, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        visitHistory: 0,
        customerConsent: true,
      };
      setDisputes(prev => [newDispute, ...prev]);
      disputeRaised = true;
    }

    const newLead: Lead = {
      ...leadData,
      id: newId,
      status: 'OTP Pending',
      otp: randomOtp,
      visitCode: newVisitCode,
      registeredOn: today,
      ownershipValidTill: expiryStr,
      brokerName: currentBroker.name,
      lastActivity: today,
    };

    setLeads(prev => [newLead, ...prev]);

    return { leadId: newId, otp: randomOtp, disputeRaised };
  };

  const verifyLeadOTP = (leadId: string, enteredOtp: string) => {
    let success = false;
    setLeads(prev => prev.map(lead => {
      if (lead.id === leadId && (lead.otp === enteredOtp || enteredOtp === '1234')) { // Bypass for easy demo
        success = true;
        return {
          ...lead,
          status: 'OTP Verified',
          lastActivity: new Date().toISOString().split('T')[0],
        };
      }
      return lead;
    }));
    return success;
  };

  const checkInVisitor = (leadId: string, details: { address: string; occupation: string; company: string; panUploaded: boolean; aadhaarUploaded: boolean; selfieCaptured: boolean }) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id === leadId) {
        return {
          ...lead,
          status: 'Checked In',
          address: details.address,
          occupation: details.occupation,
          company: details.company,
          documents: { pan: details.panUploaded, aadhaar: details.aadhaarUploaded },
          selfieUrl: details.selfieCaptured ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200' : undefined,
          lastActivity: new Date().toISOString().split('T')[0],
        };
      }
      return lead;
    }));
  };

  const autoAllocateSales = (leadId: string) => {
    const allocatedExec = salesExecutives[roundRobinIndex];
    
    // Increment Round Robin Executive Index
    setRoundRobinIndex(prev => (prev + 1) % salesExecutives.length);

    setLeads(prev => prev.map(lead => {
      if (lead.id === leadId) {
        return {
          ...lead,
          status: 'Allocated',
          assignedExecutive: allocatedExec,
          allocationTime: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
          lastActivity: new Date().toISOString().split('T')[0],
        };
      }
      return lead;
    }));

    return allocatedExec;
  };

  const reallocateSales = (leadId: string, executive: string) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id === leadId) {
        return {
          ...lead,
          assignedExecutive: executive,
          allocationTime: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
          lastActivity: new Date().toISOString().split('T')[0],
        };
      }
      return lead;
    }));
  };

  const updateLeadStage = (leadId: string, stage: Lead['status']) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id === leadId) {
        return {
          ...lead,
          status: stage,
          lastActivity: new Date().toISOString().split('T')[0],
        };
      }
      return lead;
    }));
  };

  const createBooking = (bookingData: Omit<Booking, 'id' | 'bookingDate' | 'status'>) => {
    const newBookingId = `BK-2026-00${Math.floor(100 + Math.random() * 900)}`;
    const today = new Date().toISOString().split('T')[0];
    
    const newBooking: Booking = {
      ...bookingData,
      id: newBookingId,
      bookingDate: today,
      status: 'Booked',
    };

    setBookings(prev => [newBooking, ...prev]);

    // Update lead status to Booked
    updateLeadStage(bookingData.leadId, 'Booked');

    // Auto-generate commission record (e.g. 2% standard)
    const currentLead = leads.find(l => l.id === bookingData.leadId);
    const brokerName = currentLead ? currentLead.brokerName : 'Amit Patel';
    
    const commissionPercent = 2.0;
    const commissionAmount = (bookingData.agreementValue * commissionPercent) / 100;
    const payoutDate = new Date();
    payoutDate.setDate(payoutDate.getDate() + 30);
    
    const newCommission: Commission = {
      id: `COM-2026-00${Math.floor(100 + Math.random() * 900)}`,
      bookingId: newBookingId,
      customerName: bookingData.customerName,
      brokerName: brokerName,
      agreementValue: bookingData.agreementValue,
      commissionPercent: commissionPercent,
      commissionAmount: commissionAmount,
      status: 'Pending',
      expectedPayoutDate: payoutDate.toISOString().split('T')[0],
    };

    setCommissions(prev => [newCommission, ...prev]);
  };

  const approveCommission = (commissionId: string) => {
    setCommissions(prev => prev.map(com => {
      if (com.id === commissionId) {
        return { ...com, status: 'Approved' };
      }
      return com;
    }));
  };

  const payCommission = (commissionId: string) => {
    setCommissions(prev => prev.map(com => {
      if (com.id === commissionId) {
        return { ...com, status: 'Paid' };
      }
      return com;
    }));
  };

  const resolveDispute = (disputeId: string, decision: 'brokerA' | 'brokerB' | 'reject') => {
    setDisputes(prev => prev.map(disp => {
      if (disp.id === disputeId) {
        let status: Dispute['status'] = 'Under Review';
        if (decision === 'brokerA') status = 'Resolved (Broker A)';
        else if (decision === 'brokerB') status = 'Resolved (Broker B)';
        else if (decision === 'reject') status = 'Rejected';
        return { ...disp, status };
      }
      return disp;
    }));
  };

  const addBroker = (name: string, mobile: string) => {
    const newBrokerId = `BRK-00${brokers.length + 1}`;
    setBrokers(prev => [...prev, {
      id: newBrokerId,
      name,
      mobile,
      status: 'Pending Approval',
    }]);
  };

  const approveBroker = (brokerId: string) => {
    setBrokers(prev => prev.map(b => b.id === brokerId ? { ...b, status: 'Active' } : b));
  };

  const toggleBrokerStatus = (brokerId: string) => {
    setBrokers(prev => prev.map(b => {
      if (b.id === brokerId) {
        const nextStatus: Broker['status'] = b.status === 'Active' ? 'Suspended' : 'Active';
        return { ...b, status: nextStatus };
      }
      return b;
    }));
  };

  const addProject = (project: Project) => {
    setProjects(prev => [...prev, project]);
  };

  const resetSimulation = () => {
    setBrokers(initialBrokers);
    setProjects(initialProjects);
    setLeads(initialLeads);
    setBookings(initialBookings);
    setCommissions(initialCommissions);
    setDisputes(initialDisputes);
    setRoundRobinIndex(1);
    setCurrentRole('broker');
    setActiveScreen(2);
  };

  return (
    <BrokerConnectContext.Provider value={{
      brokers,
      projects,
      leads,
      bookings,
      commissions,
      disputes,
      currentRole,
      setCurrentRole,
      activeScreen,
      setActiveScreen,
      deviceMode,
      setDeviceMode,
      
      registerLead,
      verifyLeadOTP,
      checkInVisitor,
      autoAllocateSales,
      reallocateSales,
      updateLeadStage,
      createBooking,
      approveCommission,
      payCommission,
      resolveDispute,
      addBroker,
      approveBroker,
      toggleBrokerStatus,
      addProject,
      resetSimulation,
    }}>
      {children}
    </BrokerConnectContext.Provider>
  );
};

export const useBrokerConnect = () => {
  const context = useContext(BrokerConnectContext);
  if (context === undefined) {
    throw new Error('useBrokerConnect must be used within a BrokerConnectProvider');
  }
  return context;
};
