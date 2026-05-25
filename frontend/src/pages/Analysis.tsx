import React from 'react';
import { Target, AlertTriangle } from 'lucide-react';

const Analysis = () => {
  return (
    <div className="fade-in">
      <h1 className="page-title">Technical Analysis</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem' }}>
        <div className="card">
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Target size={20} color="var(--accent)" /> AI Signals
          </h2>
          <div style={{ padding: '1rem', background: 'rgba(0, 255, 136, 0.1)', borderLeft: '4px solid var(--success)', borderRadius: '4px', marginBottom: '1rem' }}>
            <h3 style={{ color: 'var(--success)', marginBottom: '0.5rem' }}>BULLISH: AAPL</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>RSI is breaking out above 50 with strong volume support.</p>
          </div>
          <div style={{ padding: '1rem', background: 'rgba(255, 51, 102, 0.1)', borderLeft: '4px solid var(--danger)', borderRadius: '4px' }}>
            <h3 style={{ color: 'var(--danger)', marginBottom: '0.5rem' }}>BEARISH: TSLA</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>MACD crossover indicates short-term downward trend.</p>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <AlertTriangle size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
          <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>Analysis chart features require live historical metrics.<br/>Select a stock on the Dashboard to view specific indicators.</p>
        </div>
      </div>
    </div>
  );
};
export default Analysis;
