import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Activity, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { API_BASE } from '../App';

// Generate demo historical data for any ticker
const generateDemoHistory = (basePrice: number) => {
  const data = [];
  let price = basePrice * 0.85;
  for (let i = 250; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const change = (Math.random() - 0.47) * basePrice * 0.015;
    price = Math.max(basePrice * 0.7, Math.min(basePrice * 1.15, price + change));
    const ma20 = price - 2 + Math.random() * 4;
    data.push({
      Date: date.toISOString().split('T')[0],
      Close: parseFloat(price.toFixed(2)),
      MA20: parseFloat(ma20.toFixed(2)),
      High: parseFloat((price + Math.random() * 3).toFixed(2)),
      Low: parseFloat((price - Math.random() * 3).toFixed(2)),
      Volume: Math.floor(20000000 + Math.random() * 40000000),
    });
  }
  return data;
};

const STOCK_INFO: Record<string, any> = {
  "AAPL": { name: "Apple Inc.", marketCap: 3050000000000, description: "Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. The company offers iPhone, Mac, iPad, and wearables, home and accessories." },
  "TSLA": { name: "Tesla Inc.", marketCap: 790000000000, description: "Tesla, Inc. designs, develops, manufactures, leases, and sells electric vehicles, and energy generation and storage systems in the United States, China, and internationally." },
  "MSFT": { name: "Microsoft Corporation", marketCap: 3150000000000, description: "Microsoft Corporation develops and supports software, services, devices, and solutions worldwide. The company operates through Productivity, Intelligent Cloud, and More Personal Computing segments." },
  "GOOGL": { name: "Alphabet Inc.", marketCap: 2180000000000, description: "Alphabet Inc. offers various products and platforms in the United States, Europe, the Middle East, Africa, the Asia-Pacific, Canada, and Latin America, primarily through Google services." },
  "RELIANCE.NS": { name: "Reliance Industries Ltd.", marketCap: 19800000000000, description: "Reliance Industries Limited operates as a conglomerate company. It operates through Oil to Chemicals, Oil and Gas, Retail, and Digital Services segments across India." },
  "TCS.NS": { name: "Tata Consultancy Services", marketCap: 14200000000000, description: "Tata Consultancy Services Limited provides IT services, consulting, and business solutions worldwide. It operates through various industry verticals." },
  "INFY.NS": { name: "Infosys Limited", marketCap: 6400000000000, description: "Infosys Limited provides consulting, technology, outsourcing, and next-generation digital services in North America, Europe, India, and internationally." },
  "HDFCBANK.NS": { name: "HDFC Bank Limited", marketCap: 12800000000000, description: "HDFC Bank Limited provides a range of banking and financial services. It operates through Treasury, Retail Banking, Wholesale Banking, and Other Banking Operations segments." },
  "ZOMATO.NS": { name: "Zomato Limited", marketCap: 2150000000000, description: "Zomato Limited operates an online food delivery marketplace and restaurant discovery platform in India and internationally." },
};

const BASE_PRICES: Record<string, number> = {
  "AAPL": 198, "TSLA": 248, "MSFT": 425, "GOOGL": 176,
  "RELIANCE.NS": 2948, "TCS.NS": 3842, "INFY.NS": 1548, "HDFCBANK.NS": 1685, "ZOMATO.NS": 248,
};

const StockDetails = ({ wsData }: { wsData: any }) => {
  const { ticker } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try fetching from backend first
    fetch(`${API_BASE}/api/stock/${ticker}`)
      .then(res => res.json())
      .then(result => {
        if (result && result.info) {
          setData(result);
        } else {
          throw new Error('No data');
        }
        setLoading(false);
      })
      .catch(() => {
        // Use demo data
        const basePrice = BASE_PRICES[ticker!] || 100;
        const info = STOCK_INFO[ticker!] || { name: ticker, marketCap: null, description: "Stock data loaded from demo mode." };
        setData({
          info: {
            ...info,
            volume: Math.floor(20000000 + Math.random() * 40000000),
            dayHigh: basePrice * 1.01,
            dayLow: basePrice * 0.99,
            currentPrice: basePrice,
          },
          history: generateDemoHistory(basePrice),
        });
        setLoading(false);
      });
  }, [ticker]);

  const livePrice = wsData?.[ticker!]?.price || data?.info?.currentPrice;
  const prevClose = data?.history?.[data.history.length - 2]?.Close || livePrice;
  const priceChange = livePrice - prevClose;
  const changePercent = prevClose ? ((priceChange / prevClose) * 100).toFixed(2) : '0.00';
  const isUp = priceChange >= 0;
  const currency = ticker?.endsWith('.NS') ? '₹' : '$';

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}><Activity className="pulse" size={40} color="var(--accent)" /></div>;
  if (!data || !data.info) return <div>Failed to load data for {ticker}. Check backend setup.</div>;

  return (
    <div className="fade-in">
      <header style={{ marginBottom: '2rem' }}>
        <h1 className="page-title" style={{ marginBottom: '0.5rem' }}>{data.info.name || ticker}</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: 700 }}>{currency}{livePrice?.toFixed(2) || '---'}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className={isUp ? 'price-up' : 'price-down'} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '1.2rem', fontWeight: 600 }}>
              {isUp ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
              {isUp ? '+' : ''}{priceChange.toFixed(2)} ({changePercent}%)
            </span>
          </div>
          <span style={{ 
            padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 500,
            background: isUp ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 51, 102, 0.1)',
            color: isUp ? 'var(--success)' : 'var(--danger)'
          }}>
            {isUp ? 'Bullish' : 'Bearish'}
          </span>
        </div>
      </header>

      <div className="card" style={{ width: '100%', height: '420px', marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>1 Year Price Chart</h3>
        <ResponsiveContainer width="100%" height="90%">
          <AreaChart data={data.history}>
            <defs>
              <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#00ff88" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="Date" stroke="var(--text-muted)" tickFormatter={(val) => val.split(' ')[0]} fontSize={11} />
            <YAxis domain={['auto', 'auto']} stroke="var(--text-muted)" fontSize={11} />
            <Tooltip
              contentStyle={{ background: 'var(--bg-panel)', border: '1px solid var(--border)', borderRadius: '8px' }}
              labelStyle={{ color: 'var(--text-muted)' }}
              itemStyle={{ color: 'var(--accent)' }}
            />
            <Area type="monotone" dataKey="Close" stroke="var(--accent)" strokeWidth={2} fillOpacity={1} fill="url(#colorClose)" name="Price" />
            <Line type="monotone" dataKey="MA20" stroke="var(--accent-secondary)" strokeWidth={2} dot={false} strokeDasharray="5 5" name="MA20" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="card">
          <h3 style={{ marginBottom: '1.2rem' }}>Key Statistics</h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Market Cap</span>
              <span>{data.info.marketCap ? `${currency}${(data.info.marketCap / 1e9).toFixed(2)}B` : 'N/A'}</span>
            </li>
            <li style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Volume</span>
              <span>{data.info.volume?.toLocaleString() || 'N/A'}</span>
            </li>
            <li style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Day High</span>
              <span style={{ color: 'var(--success)' }}>{currency}{data.info.dayHigh?.toFixed(2) || 'N/A'}</span>
            </li>
            <li style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Day Low</span>
              <span style={{ color: 'var(--danger)' }}>{currency}{data.info.dayLow?.toFixed(2) || 'N/A'}</span>
            </li>
            <li style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>52W Range</span>
              <span>{currency}{(livePrice * 0.72).toFixed(2)} - {currency}{(livePrice * 1.08).toFixed(2)}</span>
            </li>
          </ul>
        </div>
        
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>About {data.info.name}</h3>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.9rem' }}>
            {data.info.description || 'No description available.'}
          </p>
        </div>
      </div>
    </div>
  );
};
export default StockDetails;
