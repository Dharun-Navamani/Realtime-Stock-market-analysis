import React from 'react';
import { PieChart as PieChartIcon } from 'lucide-react';

const Portfolio = () => {
  return (
    <div className="fade-in">
      <h1 className="page-title">My Portfolio</h1>
      <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '400px' }}>
        <PieChartIcon size={64} color="var(--accent)" style={{ marginBottom: '1.5rem', opacity: 0.5 }} />
        <h2 style={{ marginBottom: '0.5rem' }}>No Stocks Added Yet</h2>
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', maxWidth: '400px' }}>
          Your portfolio is empty. Add stocks you own from the Stock Details page to track your profit/loss here.
        </p>
        <button style={{ 
          marginTop: '2rem', 
          padding: '0.8rem 2rem', 
          background: 'var(--accent)', 
          color: 'var(--bg-dark)', 
          border: 'none', 
          borderRadius: '8px',
          fontWeight: 600,
          cursor: 'pointer'
        }}>
          Explore Stocks
        </button>
      </div>
    </div>
  );
};
export default Portfolio;
