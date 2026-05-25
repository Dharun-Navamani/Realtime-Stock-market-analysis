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

// Backend API URL - uses Render deployment or falls back to localhost
const API_BASE = import.meta.env.VITE_API_URL || 'https://hanu-backend.onrender.com';
const WS_BASE = API_BASE.replace('https://', 'wss://').replace('http://', 'ws://');

// Demo market data for when backend is sleeping / unavailable
const DEMO_MARKET_DATA: Record<string, any> = {
  "AAPL": { price: 198.45, volume: 54200000, high: 199.62, low: 196.80, timestamp: new Date().toISOString(), currency: "USD" },
  "TSLA": { price: 248.30, volume: 91800000, high: 252.18, low: 245.50, timestamp: new Date().toISOString(), currency: "USD" },
  "MSFT": { price: 425.12, volume: 22400000, high: 427.50, low: 422.80, timestamp: new Date().toISOString(), currency: "USD" },
  "GOOGL": { price: 176.85, volume: 28700000, high: 178.20, low: 175.40, timestamp: new Date().toISOString(), currency: "USD" },
  "RELIANCE.NS": { price: 2948.75, volume: 15200000, high: 2965.00, low: 2930.50, timestamp: new Date().toISOString(), currency: "INR" },
  "TCS.NS": { price: 3842.50, volume: 4800000, high: 3870.00, low: 3825.00, timestamp: new Date().toISOString(), currency: "INR" },
  "INFY.NS": { price: 1548.25, volume: 12300000, high: 1560.00, low: 1540.00, timestamp: new Date().toISOString(), currency: "INR" },
  "HDFCBANK.NS": { price: 1685.40, volume: 8900000, high: 1695.00, low: 1675.00, timestamp: new Date().toISOString(), currency: "INR" },
  "ZOMATO.NS": { price: 248.60, volume: 32100000, high: 252.00, low: 245.80, timestamp: new Date().toISOString(), currency: "INR" },
};

export { API_BASE, WS_BASE, DEMO_MARKET_DATA };

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
  const [wsData, setWsData] = useState<any>(DEMO_MARKET_DATA);

  useEffect(() => {
    // Try connecting to WebSocket; if it fails, keep demo data
    let ws: WebSocket | null = null;
    try {
      ws = new WebSocket(`${WS_BASE}/ws`);
      
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

      ws.onerror = () => {
        console.log("WebSocket unavailable, using demo data");
        setWsData(DEMO_MARKET_DATA);
      };
    } catch (e) {
      console.log("WebSocket connection failed, using demo data");
    }

    // Simulate small live price fluctuations for demo
    const demoInterval = setInterval(() => {
      setWsData((prev: any) => {
        const updated = { ...prev };
        Object.keys(updated).forEach(ticker => {
          if (updated[ticker] && updated[ticker].price) {
            const change = (Math.random() - 0.48) * updated[ticker].price * 0.002;
            updated[ticker] = {
              ...updated[ticker],
              price: parseFloat((updated[ticker].price + change).toFixed(2)),
              timestamp: new Date().toISOString()
            };
          }
        });
        return updated;
      });
    }, 3000);

    return () => {
      if (ws) ws.close();
      clearInterval(demoInterval);
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
            <Route path="/portfolio" element={<Portfolio wsData={wsData} />} />
            <Route path="/alerts" element={<Alerts wsData={wsData} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
