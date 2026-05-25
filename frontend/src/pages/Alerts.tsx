import React from 'react';
import { BellRing, PlusCircle } from 'lucide-react';

const Alerts = () => {
  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Active Alerts</h1>
        <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', padding: '0.8rem 1.5rem', borderRadius: '8px', cursor: 'pointer' }}>
          <PlusCircle size={18} /> New Alert
        </button>
      </div>
      
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid var(--accent)' }}>
        <div style={{ padding: '1rem', background: 'var(--bg-panel-hover)', borderRadius: '50%' }}>
          <BellRing size={24} color="var(--accent)" />
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>AAPL Price Alert</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Notify me when price drops below $160.00</p>
        </div>
        <div>
          <span style={{ padding: '0.4rem 0.8rem', background: 'rgba(0, 255, 136, 0.1)', color: 'var(--success)', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>Active</span>
        </div>
      </div>
    </div>
  );
};
export default Alerts;
