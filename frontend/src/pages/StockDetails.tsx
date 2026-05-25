import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Activity } from 'lucide-react';

const StockDetails = ({ wsData }: { wsData: any }) => {
  const { ticker } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8000/api/stock/${ticker}`)
      .then(res => res.json())
      .then(result => {
        setData(result);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch stock data:", err);
        setLoading(false);
      });
  }, [ticker]);

  const livePrice = wsData?.[ticker!]?.price || data?.info?.currentPrice;

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}><Activity className="pulse" size={40} color="var(--accent)" /></div>;
  if (!data || !data.info) return <div>Failed to load data for {ticker}. Check backend setup.</div>;

  return (
    <div className="fade-in">
      <header style={{ marginBottom: '2rem' }}>
        <h1 className="page-title">{data.info.name || ticker} ({ticker})</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: 700 }}>${livePrice?.toFixed(2) || '---'}</h2>
        </div>
      </header>

      <div className="card" style={{ width: '100%', height: '400px', marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>1 Year Chart</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data.history}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="Date" stroke="var(--text-muted)" tickFormatter={(val) => val.split(' ')[0]} />
            <YAxis domain={['auto', 'auto']} stroke="var(--text-muted)" />
            <Tooltip
              contentStyle={{ background: 'var(--bg-panel)', border: '1px solid var(--border)', borderRadius: '8px' }}
              labelStyle={{ color: 'var(--text-muted)' }}
              itemStyle={{ color: 'var(--accent)' }}
            />
            <Line type="monotone" dataKey="Close" stroke="var(--accent)" strokeWidth={3} dot={false} />
            <Line type="monotone" dataKey="MA20" stroke="var(--accent-secondary)" strokeWidth={2} dot={false} strokeDasharray="5 5" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Key Statistics</h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Market Cap</span>
              <span>{data.info.marketCap ? `$${(data.info.marketCap / 1e9).toFixed(2)}B` : 'N/A'}</span>
            </li>
            <li style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Volume</span>
              <span>{data.info.volume?.toLocaleString() || 'N/A'}</span>
            </li>
            <li style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Day High</span>
              <span>{data.info.dayHigh ? `$${data.info.dayHigh}` : 'N/A'}</span>
            </li>
            <li style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Day Low</span>
              <span>{data.info.dayLow ? `$${data.info.dayLow}` : 'N/A'}</span>
            </li>
          </ul>
        </div>
        
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>About {data.info.name}</h3>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.9rem', maxHeight: '150px', overflowY: 'auto' }}>
            {data.info.description || 'No description available.'}
          </p>
        </div>
      </div>
    </div>
  );
};
export default StockDetails;
