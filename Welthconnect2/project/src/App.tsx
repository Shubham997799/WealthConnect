import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Wallet, 
  ArrowRightLeft, 
  PieChart,
  LogOut,
  Building2,
  User,
  ChevronDown,
  Shield,
  Users,
  CreditCard,
  Smartphone
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would validate credentials here
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return <LandingPage onLogin={handleLogin} loginData={loginData} setLoginData={setLoginData} />;
  }

  return <Dashboard />;
}

export default App;