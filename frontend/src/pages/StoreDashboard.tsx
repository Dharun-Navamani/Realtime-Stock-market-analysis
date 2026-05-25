import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link, useSearchParams } from 'react-router-dom';
import SalesChart from '../components/SalesChart';
import { ShoppingBag, Search, Layers, LogOut, Tags, PackageSearch } from 'lucide-react';

export default function StoreDashboard() {
  const { logout } = useAuth();
  const [searchParams] = useSearchParams();
  const querySku = searchParams.get('sku');
  const [sku, setSku] = useState(querySku || 'IPH15');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [liveInfo, setLiveInfo] = useState<any>(null);
  const [analysis, setAnalysis] = useState<any>(null);

  useEffect(() => {
    if (querySku) setSku(querySku);
  }, [querySku]);

  useEffect(() => {
    fetchHistory(sku);
    fetchAnalysis(sku);
    fetchLiveInfo(sku);
  }, [sku]);

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/sales/ws`);
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "sales_update" && msg.data[sku]) {
        setLiveInfo(msg.data[sku]);
        // Also subtly refresh history/analysis occasionally or optimistic updates
      }
    };
    return () => ws.close();
  }, [sku]);

  const fetchLiveInfo = async (sym: string) => {
    try {
      const res = await axios.get(`http://localhost:8000/sales/${sym}`);
      setLiveInfo(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchHistory = async (sym: string) => {
    try {
      const res = await axios.get(`http://localhost:8000/sales/history/${sym}?period=24h`);
      if (res.data.data) {
        setHistoryData(res.data.data);
      }
    } catch (err) { console.error(err); }
  };

  const fetchAnalysis = async (sym: string) => {
    try {
      const res = await axios.get(`http://localhost:8000/analysis/${sym}`);
      if (res.data.indicators) {
        setAnalysis(res.data);
      }
    } catch (err) { console.error(err); }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSku(searchQuery.toUpperCase());
    }
  };

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '60px' }}>
      <header className="flex justify-between items-center" style={{ marginBottom: '32px' }}>
        <div className="flex items-center gap-2">
          <ShoppingBag color="var(--accent)" size={32} />
          <h1 style={{ margin: 0 }}>Sales Tracker</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/watchlist" className="btn" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
            <PackageSearch size={18} /> Watchlist
          </Link>
          <form onSubmit={handleSearch} className="flex gap-2">
            <input 
              className="input" 
              placeholder="Search SKU (e.g. IPH15)" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '250px' }}
            />
            <button type="submit" className="btn"><Search size={18} /></button>
          </form>
          <button className="btn btn-danger" onClick={logout}><LogOut size={18} /> Logout</button>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-4">
        <div className="card" style={{ gridColumn: 'span 8' }}>
          <div className="flex justify-between items-center" style={{ marginBottom: '24px' }}>
            <div>
              <h2 style={{ fontSize: '24px', margin: 0 }}>{liveInfo?.name || sku} <span style={{fontSize: '14px', color: 'var(--text-secondary)'}}>({sku})</span></h2>
              <div className="flex gap-4" style={{ marginTop: '8px' }}>
                 <h3 style={{ fontSize: '28px', margin: 0, color: 'var(--success)' }}>
                   ${liveInfo?.revenue?.toLocaleString() ?? 0} <span style={{fontSize:'12px', color:'var(--text-secondary)'}}>Total Revenue</span>
                 </h3>
                 <h3 style={{ fontSize: '28px', margin: 0, color: liveInfo?.inventory < 50 ? 'var(--danger)' : 'var(--accent)' }}>
                   {liveInfo?.inventory ?? 0} <span style={{fontSize:'12px', color:'var(--text-secondary)'}}>Units In Stock</span>
                 </h3>
              </div>
            </div>
            {analysis && (
              <div className="glass-panel" style={{ padding: '12px', borderLeft: `4px solid ${analysis.indicators.trend.includes('Stable') ? 'var(--success)' : 'var(--danger)'}` }}>
                <span style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)' }}>Inventory Alert</span>
                <strong>{analysis.indicators.trend}</strong>
              </div>
            )}
          </div>
          <SalesChart data={historyData} sku={sku} />
        </div>

        <div className="card" style={{ gridColumn: 'span 4' }}>
          <h3 className="flex items-center gap-2" style={{ marginBottom: '16px' }}><Layers size={20}/> Sales Intelligence</h3>
          {analysis ? (
            <div className="flex flex-col gap-4">
               <div className="flex justify-between" style={{ paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
                 <span style={{ color: 'var(--text-secondary)' }}>5h Avg Sales Velocity</span>
                 <strong>{analysis.indicators.sales_velocity_5h} units/hr</strong>
               </div>
               <div className="flex justify-between" style={{ paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
                 <span style={{ color: 'var(--text-secondary)' }}>Est. Conv. Rate</span>
                 <strong>{analysis.indicators.conversion_rate_pct}%</strong>
               </div>
               <div className="flex justify-between" style={{ paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
                 <span style={{ color: 'var(--text-secondary)' }}>Burn Rate</span>
                 <strong style={{ color: 'var(--danger)' }}>-{analysis.indicators.hourly_burn_rate} units/hr</strong>
               </div>
               <div style={{ marginTop: '16px' }}>
                 <h4 style={{ marginBottom: '12px', color: 'var(--accent)' }}>AI Forecasting</h4>
                 <div className="glass-panel text-center">
                    <span style={{fontSize: '12px', display: 'block', marginBottom: '4px'}}>Predicted Stockout Date</span>
                    <strong style={{fontSize: '16px'}}>{analysis.predictions.inventory_depletion_date}</strong>
                 </div>
               </div>
            </div>
          ) : (
            <p style={{ color: 'var(--text-secondary)' }}>Loading analytics...</p>
          )}

          {/* Manual Entry Form */}
          <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
            <h4 style={{ marginBottom: '12px', color: 'var(--text-primary)' }}>Adjust Operations</h4>
            <form 
              className="flex gap-2"
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const units = parseInt((form.elements.namedItem('manualUnits') as HTMLInputElement).value);
                const isRestock = (form.elements.namedItem('isRestock') as HTMLSelectElement).value === 'true';
                if (!isNaN(units)) {
                   try {
                     await axios.post('http://localhost:8000/sales/manual-update', { sku, units, is_restock: isRestock });
                     (form.elements.namedItem('manualUnits') as HTMLInputElement).value = '';
                     fetchLiveInfo(sku); // Force refresh
                   } catch(err) { console.error(err); }
                }
              }}
            >
              <select name="isRestock" className="input" style={{ width: 'auto' }}>
                 <option value="false">Sale</option>
                 <option value="true">Restock</option>
              </select>
              <input 
                name="manualUnits"
                type="number" 
                step="1" 
                className="input" 
                placeholder={`Units...`} 
                required
              />
              <button type="submit" className="btn">Push</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
