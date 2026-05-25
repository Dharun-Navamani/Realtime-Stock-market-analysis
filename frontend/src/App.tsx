import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import StockDetails from './pages/StockDetails';
import Analysis from './pages/Analysis';
import Portfolio from './pages/Portfolio';
import Alerts from './pages/Alerts';
import Login from './pages/Login';
import Admin from './pages/Admin';
import { LineChart, LayoutDashboard, PieChart, Bell, LogIn, TrendingUp, ShieldCheck } from 'lucide-react';

function Navigation() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <ul className="nav-links">
      <li>
        <Link to="/" className={isActive('/')}>
          <LayoutDashboard size={20} /> <span className="link-text">Dashboard</span>
        </Link>
      </li>
      <li>
        <Link to="/analysis" className={isActive('/analysis')}>
          <LineChart size={20} /> <span className="link-text">Analysis</span>
        </Link>
      </li>
      <li>
        <Link to="/portfolio" className={isActive('/portfolio')}>
          <PieChart size={20} /> <span className="link-text">Portfolio</span>
        </Link>
      </li>
      <li>
        <Link to="/alerts" className={isActive('/alerts')}>
          <Bell size={20} /> <span className="link-text">Alerts</span>
        </Link>
      </li>
      <li>
        <Link to="/admin" className={isActive('/admin')}>
          <ShieldCheck size={20} /> <span className="link-text">Admin Retail</span>
        </Link>
      </li>
      <div className="spacer"></div>
      <li>
        <Link to="/login" className={`login-link ${isActive('/login')}`}>
          <LogIn size={20} /> <span className="link-text">Login</span>
        </Link>
      </li>
    </ul>
  );
}

function App() {
  const [wsData, setWsData] = useState<any>(null);

  useEffect(() => {
    // Connect to WebSocket
    const ws = new WebSocket('ws://localhost:8000/ws');
    
    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'MARKET_DATA') {
          setWsData(message.data);
        }
      } catch (e) {
        console.error("Error parsing WebSocket message:", e);
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <Router>
      <div className="app-container">
        <nav className="sidebar">
          <div className="logo-container">
            <TrendingUp size={32} color="#00ff88" />
            <span className="logo-text">PulseMarket</span>
          </div>
          <Navigation />
        </nav>
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home wsData={wsData} />} />
            <Route path="/stock/:ticker" element={<StockDetails wsData={wsData} />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
