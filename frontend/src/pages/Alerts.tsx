import React from 'react';
import { BellRing, PlusCircle, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';

const DEMO_ALERTS = [
  { id: 1, ticker: "AAPL", condition: "Price drops below $195.00", status: "Active", type: "price_drop", triggered: false },
  { id: 2, ticker: "TSLA", condition: "Price rises above $260.00", status: "Active", type: "price_rise", triggered: false },
  { id: 3, ticker: "RELIANCE.NS", condition: "Price crosses ₹3,000.00", status: "Active", type: "price_rise", triggered: false },
  { id: 4, ticker: "MSFT", condition: "Volume exceeds 30M", status: "Triggered", type: "volume", triggered: true },
  { id: 5, ticker: "GOOGL", condition: "RSI below 30 (Oversold)", status: "Active", type: "rsi", triggered: false },
  { id: 6, ticker: "INFY.NS", condition: "Price drops below ₹1,500.00", status: "Triggered", type: "price_drop", triggered: true },
];

const Alerts = ({ wsData }: { wsData?: any }) => {
  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="page-title" style={{ margin: 0 }}>Active Alerts</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.3rem' }}>Monitor price movements and get notified</p>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))', border: 'none', color: 'var(--bg-dark)', padding: '0.8rem 1.5rem', borderRadius: '10px', cursor: 'pointer', fontWeight: 600 }}>
          <PlusCircle size={18} /> New Alert
        </button>
      </div>

      {/* Summary Cards */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card" style={{ borderTop: '3px solid var(--accent)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Active Alerts</span>
              <h2 style={{ fontSize: '2rem', fontWeight: 700, marginTop: '0.5rem' }}>{DEMO_ALERTS.filter(a => !a.triggered).length}</h2>
            </div>
            <BellRing size={24} color="var(--accent)" />
          </div>
        </div>
        <div className="card" style={{ borderTop: '3px solid #ffbb33' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Triggered Today</span>
              <h2 style={{ fontSize: '2rem', fontWeight: 700, marginTop: '0.5rem' }}>{DEMO_ALERTS.filter(a => a.triggered).length}</h2>
            </div>
            <AlertTriangle size={24} color="#ffbb33" />
          </div>
        </div>
        <div className="card" style={{ borderTop: '3px solid var(--accent-secondary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Stocks Monitored</span>
              <h2 style={{ fontSize: '2rem', fontWeight: 700, marginTop: '0.5rem' }}>{new Set(DEMO_ALERTS.map(a => a.ticker)).size}</h2>
            </div>
            <TrendingUp size={24} color="var(--accent-secondary)" />
          </div>
        </div>
      </section>
      
      {/* Alert List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {DEMO_ALERTS.map(alert => (
          <div key={alert.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: `4px solid ${alert.triggered ? '#ffbb33' : 'var(--accent)'}` }}>
            <div style={{ padding: '1rem', background: 'var(--bg-panel-hover)', borderRadius: '50%' }}>
              {alert.triggered 
                ? <CheckCircle size={24} color="#ffbb33" />
                : <BellRing size={24} color="var(--accent)" />
              }
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.3rem' }}>
                <h3 style={{ fontSize: '1.1rem' }}>{alert.ticker}</h3>
                <span style={{ 
                  fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px',
                  background: alert.type === 'price_drop' ? 'rgba(255, 51, 102, 0.15)' : alert.type === 'price_rise' ? 'rgba(0, 255, 136, 0.15)' : 'rgba(0, 210, 255, 0.15)',
                  color: alert.type === 'price_drop' ? 'var(--danger)' : alert.type === 'price_rise' ? 'var(--success)' : 'var(--accent-secondary)'
                }}>
                  {alert.type === 'price_drop' ? 'Price Drop' : alert.type === 'price_rise' ? 'Price Rise' : alert.type === 'volume' ? 'Volume' : 'RSI'}
                </span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{alert.condition}</p>
              {wsData?.[alert.ticker] && (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.3rem' }}>
                  Current: {alert.ticker.endsWith('.NS') ? '₹' : '$'}{wsData[alert.ticker].price?.toFixed(2)}
                </p>
              )}
            </div>
            <div>
              <span style={{ 
                padding: '0.4rem 0.8rem', 
                background: alert.triggered ? 'rgba(255, 187, 51, 0.1)' : 'rgba(0, 255, 136, 0.1)', 
                color: alert.triggered ? '#ffbb33' : 'var(--success)', 
                borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 
              }}>
                {alert.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Alerts;
