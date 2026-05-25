import React from 'react';
import { PieChart as PieChartIcon, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, DollarSign } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#00ff88', '#00d2ff', '#ff3366', '#ffbb33', '#8884d8'];

const DEMO_PORTFOLIO = [
  { ticker: "AAPL", name: "Apple Inc.", shares: 25, avgCost: 185.20, currentPrice: 198.45 },
  { ticker: "MSFT", name: "Microsoft Corp.", shares: 15, avgCost: 410.50, currentPrice: 425.12 },
  { ticker: "GOOGL", name: "Alphabet Inc.", shares: 30, avgCost: 168.30, currentPrice: 176.85 },
  { ticker: "TSLA", name: "Tesla Inc.", shares: 10, avgCost: 235.80, currentPrice: 248.30 },
  { ticker: "RELIANCE.NS", name: "Reliance Industries", shares: 50, avgCost: 2850.00, currentPrice: 2948.75 },
];

const Portfolio = ({ wsData }: { wsData?: any }) => {
  const portfolio = DEMO_PORTFOLIO.map(stock => {
    const livePrice = wsData?.[stock.ticker]?.price || stock.currentPrice;
    const totalValue = livePrice * stock.shares;
    const totalCost = stock.avgCost * stock.shares;
    const pnl = totalValue - totalCost;
    const pnlPercent = ((pnl / totalCost) * 100).toFixed(2);
    return { ...stock, livePrice, totalValue, totalCost, pnl, pnlPercent };
  });

  const totalPortfolioValue = portfolio.reduce((sum, s) => sum + s.totalValue, 0);
  const totalPnL = portfolio.reduce((sum, s) => sum + s.pnl, 0);
  const totalInvested = portfolio.reduce((sum, s) => sum + s.totalCost, 0);

  const pieData = portfolio.map(s => ({ name: s.ticker, value: s.totalValue }));

  return (
    <div className="fade-in">
      <h1 className="page-title">My Portfolio</h1>

      {/* Portfolio KPIs */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="card" style={{ borderTop: '3px solid var(--accent)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Value</span>
            <DollarSign size={20} color="var(--accent)" />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>${totalPortfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
        </div>
        <div className="card" style={{ borderTop: '3px solid var(--accent-secondary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Invested</span>
            <PieChartIcon size={20} color="var(--accent-secondary)" />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>${totalInvested.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
        </div>
        <div className="card" style={{ borderTop: `3px solid ${totalPnL >= 0 ? 'var(--success)' : 'var(--danger)'}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total P&L</span>
            {totalPnL >= 0 ? <TrendingUp size={20} color="var(--success)" /> : <TrendingDown size={20} color="var(--danger)" />}
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: totalPnL >= 0 ? 'var(--success)' : 'var(--danger)' }}>
            {totalPnL >= 0 ? '+' : ''}${totalPnL.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h2>
        </div>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
        {/* Holdings Table */}
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Holdings</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.8rem' }}>Stock</th>
                <th style={{ padding: '0.8rem' }}>Shares</th>
                <th style={{ padding: '0.8rem' }}>Avg Cost</th>
                <th style={{ padding: '0.8rem' }}>Current</th>
                <th style={{ padding: '0.8rem' }}>P&L</th>
              </tr>
            </thead>
            <tbody>
              {portfolio.map((stock) => (
                <tr key={stock.ticker} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }}
                  onMouseOver={e => (e.currentTarget.style.background = 'var(--bg-panel-hover)')}
                  onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '0.8rem' }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{stock.ticker}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{stock.name}</div>
                    </div>
                  </td>
                  <td style={{ padding: '0.8rem' }}>{stock.shares}</td>
                  <td style={{ padding: '0.8rem', color: 'var(--text-muted)' }}>${stock.avgCost.toFixed(2)}</td>
                  <td style={{ padding: '0.8rem', fontWeight: 500 }}>${stock.livePrice.toFixed(2)}</td>
                  <td style={{ padding: '0.8rem' }}>
                    <div style={{ color: stock.pnl >= 0 ? 'var(--success)' : 'var(--danger)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
                      {stock.pnl >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      ${Math.abs(stock.pnl).toFixed(2)} ({stock.pnlPercent}%)
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Allocation Pie */}
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Allocation</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--bg-panel)', border: '1px solid var(--border)', borderRadius: '8px' }}
                  formatter={(value: any) => `$${Number(value).toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Portfolio;
