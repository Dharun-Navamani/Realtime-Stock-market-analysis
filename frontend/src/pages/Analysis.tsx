import React from 'react';
import { Target, AlertTriangle, TrendingUp, TrendingDown, BarChart3, Activity } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Generate demo RSI data
const generateAnalysisData = () => {
  const data = [];
  let price = 195;
  let rsi = 55;
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const change = (Math.random() - 0.45) * 4;
    price = Math.max(180, Math.min(210, price + change));
    rsi = Math.max(20, Math.min(80, rsi + (Math.random() - 0.5) * 10));
    data.push({
      date: date.toISOString().split('T')[0],
      price: parseFloat(price.toFixed(2)),
      rsi: parseFloat(rsi.toFixed(1)),
      ma20: parseFloat((price - 2 + Math.random() * 4).toFixed(2)),
      volume: Math.floor(40000000 + Math.random() * 30000000),
    });
  }
  return data;
};

const analysisData = generateAnalysisData();

const SIGNALS = [
  { ticker: "AAPL", signal: "BULLISH", reason: "RSI breaking out above 50 with strong volume support. Golden cross forming on 20/50 MA.", color: "var(--success)" },
  { ticker: "TSLA", signal: "BEARISH", reason: "MACD crossover indicates short-term downward trend. Support at $240.", color: "var(--danger)" },
  { ticker: "MSFT", signal: "BULLISH", reason: "Consistent uptrend with higher highs. Volume confirming momentum.", color: "var(--success)" },
  { ticker: "RELIANCE.NS", signal: "NEUTRAL", reason: "Consolidating near resistance at ₹3,000. Wait for breakout confirmation.", color: "#ffbb33" },
  { ticker: "GOOGL", signal: "BULLISH", reason: "Bouncing off key support at $172. RSI recovering from oversold territory.", color: "var(--success)" },
];

const Analysis = () => {
  return (
    <div className="fade-in">
      <h1 className="page-title">Technical Analysis</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', marginBottom: '2.5rem' }}>
        {/* AI Signals Panel */}
        <div className="card">
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Target size={20} color="var(--accent)" /> AI Trading Signals
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {SIGNALS.map((s, i) => (
              <div key={i} style={{ 
                padding: '1rem', 
                background: s.signal === 'BULLISH' ? 'rgba(0, 255, 136, 0.08)' : s.signal === 'BEARISH' ? 'rgba(255, 51, 102, 0.08)' : 'rgba(255, 187, 51, 0.08)',
                borderLeft: `4px solid ${s.color}`, 
                borderRadius: '4px' 
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h3 style={{ color: s.color, fontSize: '1rem' }}>{s.signal}: {s.ticker}</h3>
                  {s.signal === 'BULLISH' ? <TrendingUp size={16} color={s.color} /> : s.signal === 'BEARISH' ? <TrendingDown size={16} color={s.color} /> : <Activity size={16} color={s.color} />}
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>{s.reason}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Price Chart */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="card">
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BarChart3 size={18} color="var(--accent)" /> AAPL — Price vs Moving Average (30 Days)
            </h3>
            <div style={{ height: '280px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analysisData}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00ff88" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={11} tickMargin={10} />
                  <YAxis domain={['auto', 'auto']} stroke="var(--text-muted)" fontSize={11} />
                  <Tooltip contentStyle={{ background: 'var(--bg-panel)', border: '1px solid var(--border)', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="price" stroke="#00ff88" strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" name="Price" />
                  <Line type="monotone" dataKey="ma20" stroke="#00d2ff" strokeWidth={2} dot={false} strokeDasharray="5 5" name="MA20" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* RSI Chart */}
          <div className="card">
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={18} color="#8884d8" /> RSI Indicator
            </h3>
            <div style={{ height: '200px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analysisData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={11} tickMargin={10} />
                  <YAxis domain={[0, 100]} stroke="var(--text-muted)" fontSize={11} ticks={[20, 30, 50, 70, 80]} />
                  <Tooltip contentStyle={{ background: 'var(--bg-panel)', border: '1px solid var(--border)', borderRadius: '8px' }} />
                  {/* Overbought/Oversold zones */}
                  <Line type="monotone" dataKey="rsi" stroke="#8884d8" strokeWidth={2} dot={false} name="RSI" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '0.5rem', fontSize: '0.8rem' }}>
              <span style={{ color: 'var(--danger)' }}>■ Overbought (&gt;70)</span>
              <span style={{ color: '#8884d8' }}>■ RSI Value</span>
              <span style={{ color: 'var(--success)' }}>■ Oversold (&lt;30)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Analysis;
