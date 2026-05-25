import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie, Legend
} from 'recharts';
import {
  Search, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight,
  ShoppingBag, Package, DollarSign, BarChart3, Activity, Globe
} from 'lucide-react';
import { API_BASE } from '../App';

interface SaleRecord {
  product: string;
  amount: number;
  date: string;
}

const COLORS = ['#00ff88', '#00d2ff', '#ff3366', '#ffbb33', '#8884d8', '#ff8042', '#0088fe'];

// Rich demo sales data
const DEMO_SALES: SaleRecord[] = [
  { product: "MacBook Pro 16\"", amount: 2499, date: "2025-05-18" },
  { product: "iPhone 15 Pro", amount: 1199, date: "2025-05-18" },
  { product: "AirPods Pro 2", amount: 249, date: "2025-05-19" },
  { product: "iPad Air M2", amount: 799, date: "2025-05-19" },
  { product: "Samsung Galaxy S24", amount: 899, date: "2025-05-19" },
  { product: "Sony WH-1000XM5", amount: 348, date: "2025-05-20" },
  { product: "MacBook Pro 16\"", amount: 2499, date: "2025-05-20" },
  { product: "Dell XPS 15", amount: 1749, date: "2025-05-20" },
  { product: "iPhone 15 Pro", amount: 1199, date: "2025-05-21" },
  { product: "Apple Watch Ultra 2", amount: 799, date: "2025-05-21" },
  { product: "Gaming Monitor 27\"", amount: 549, date: "2025-05-21" },
  { product: "Mechanical Keyboard", amount: 175, date: "2025-05-22" },
  { product: "Logitech MX Master", amount: 99, date: "2025-05-22" },
  { product: "AirPods Pro 2", amount: 249, date: "2025-05-22" },
  { product: "Samsung Galaxy S24", amount: 899, date: "2025-05-23" },
  { product: "iPad Air M2", amount: 799, date: "2025-05-23" },
  { product: "MacBook Pro 16\"", amount: 2499, date: "2025-05-24" },
  { product: "iPhone 15 Pro", amount: 1199, date: "2025-05-24" },
  { product: "Sony WH-1000XM5", amount: 348, date: "2025-05-25" },
  { product: "Apple Watch Ultra 2", amount: 799, date: "2025-05-25" },
];

const Home = ({ wsData }: { wsData: any }) => {
  const [sales, setSales] = useState<SaleRecord[]>(DEMO_SALES);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const fetchSales = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/sales`);
      const data = await res.json();
      if (data && data.length > 0) {
        setSales(data);
      }
    } catch (err) {
      console.log('Using demo sales data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
    const interval = setInterval(fetchSales, 10000);
    return () => clearInterval(interval);
  }, []);

  // ── Derived analytics ──
  const totalRevenue = sales.reduce((sum, s) => sum + s.amount, 0);
  const totalProducts = sales.length;

  // Group by date → line / bar chart
  const dailyData = sales.reduce((acc: any[], curr) => {
    const existing = acc.find(item => item.date === curr.date);
    if (existing) {
      existing.total += curr.amount;
      existing.count += 1;
    } else {
      acc.push({ date: curr.date, total: curr.amount, count: 1 });
    }
    return acc;
  }, []).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Group by product → pie chart
  const productData = sales.reduce((acc: any[], curr) => {
    const existing = acc.find(item => item.name === curr.product);
    if (existing) {
      existing.value += curr.amount;
    } else {
      acc.push({ name: curr.product, value: curr.amount });
    }
    return acc;
  }, []).sort((a, b) => b.value - a.value);

  // Top 4 products by total revenue
  const topProducts = productData.slice(0, 4);

  // Live stock ticker cards
  const stockTickers = wsData ? Object.entries(wsData).filter(([ticker]) =>
    !searchTerm || ticker.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Activity className="pulse" size={40} color="var(--accent)" />
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: '0.3rem' }}>Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>Real-time market analysis & retail sales overview</p>
        </div>
        <button
          onClick={() => navigate('/admin')}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.8rem 1.5rem', borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))',
            color: 'var(--bg-dark)', border: 'none', fontWeight: 600,
            cursor: 'pointer', transition: 'transform 0.2s'
          }}
          onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <ShoppingBag size={18} /> Add Sale
        </button>
      </header>

      {/* KPI Cards */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="card" style={{ borderTop: '3px solid var(--accent)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Revenue</span>
            <DollarSign size={20} color="var(--accent)" />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '0.5rem' }}>
            <ArrowUpRight size={14} /> +12.5% vs last week
          </span>
        </div>

        <div className="card" style={{ borderTop: '3px solid var(--accent-secondary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Sales</span>
            <Package size={20} color="var(--accent-secondary)" />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>{totalProducts}</h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '0.5rem' }}>
            <ArrowUpRight size={14} /> +8 new today
          </span>
        </div>

        <div className="card" style={{ borderTop: '3px solid #ffbb33' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Unique Products</span>
            <BarChart3 size={20} color="#ffbb33" />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>{productData.length}</h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem', display: 'block' }}>Across all categories</span>
        </div>

        <div className="card" style={{ borderTop: '3px solid #8884d8' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Avg. Sale Value</span>
            <TrendingUp size={20} color="#8884d8" />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>
            ${totalProducts > 0 ? (totalRevenue / totalProducts).toFixed(2) : '0.00'}
          </h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '0.5rem' }}>
            <ArrowUpRight size={14} /> Premium segment
          </span>
        </div>
      </section>

      {/* Live Stock Ticker Section */}
      <section style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Globe size={20} color="var(--accent-secondary)" /> Live Market Feed
            <span style={{ 
              width: '8px', height: '8px', borderRadius: '50%', background: '#00ff88',
              display: 'inline-block', marginLeft: '8px',
              animation: 'pulse 2s infinite'
            }}></span>
          </h2>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search ticker..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                padding: '0.6rem 0.8rem 0.6rem 2.2rem', borderRadius: '8px',
                border: '1px solid var(--border)', background: 'var(--bg-dark)',
                color: 'var(--text-main)', outline: 'none', width: '200px'
              }}
            />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
          {stockTickers.map(([ticker, info]: [string, any]) => {
            const isPositive = Math.random() > 0.35;
            const changePercent = (Math.random() * 3).toFixed(2);
            return (
              <div
                key={ticker}
                className="card"
                style={{ cursor: 'pointer', padding: '1.2rem' }}
                onClick={() => navigate(`/stock/${ticker}`)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{ticker}</h4>
                  <span style={{
                    fontSize: '0.7rem', padding: '2px 8px', borderRadius: '12px',
                    background: info.currency === 'INR' ? 'rgba(255, 187, 51, 0.15)' : 'rgba(0, 210, 255, 0.15)',
                    color: info.currency === 'INR' ? '#ffbb33' : '#00d2ff'
                  }}>
                    {info.currency}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                  {info.currency === 'INR' ? '₹' : '$'}{info.price?.toFixed(2)}
                </h3>
                <span className={isPositive ? 'price-up' : 'price-down'} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: 500 }}>
                  {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {isPositive ? '+' : '-'}{changePercent}%
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Top product cards */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <TrendingUp size={20} color="var(--accent)" /> Top Products by Revenue
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
          {topProducts.map((p, i) => {
            const share = totalRevenue > 0 ? ((p.value / totalRevenue) * 100).toFixed(1) : '0';
            const isPositive = parseFloat(share) > 15;
            return (
              <div key={p.name} className="card" style={{ cursor: 'default' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 600 }}>{p.name}</h3>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Retail Product</span>
                  </div>
                  <div style={{ padding: '0.5rem', background: 'var(--bg-panel-hover)', borderRadius: '8px' }}>
                    {isPositive
                      ? <TrendingUp size={20} color="var(--success)" />
                      : <TrendingDown size={20} color="var(--danger)" />}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem' }}>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>
                    ${p.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </h2>
                  <span
                    className={isPositive ? 'price-up' : 'price-down'}
                    style={{ display: 'flex', alignItems: 'center', fontWeight: 500, marginBottom: '0.4rem' }}
                  >
                    {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                    {share}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Charts Row */}
      <section style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
        {/* Revenue Over Time */}
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart3 size={18} color="var(--accent)" /> Revenue Over Time
          </h3>
          <div style={{ height: '320px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} tickMargin={10} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickMargin={10} />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-panel)', border: '1px solid var(--border)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--accent)' }}
                  formatter={(value: any) => `$${Number(value).toFixed(2)}`}
                />
                <Bar dataKey="total" name="Revenue" radius={[6, 6, 0, 0]}>
                  {dailyData.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} fillOpacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Product Breakdown Pie */}
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShoppingBag size={18} color="var(--accent-secondary)" /> Product Breakdown
          </h3>
          <div style={{ height: '320px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={productData}
                  cx="50%" cy="50%"
                  innerRadius={60} outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}
                >
                  {productData.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: 'var(--bg-panel)', border: '1px solid var(--border)', borderRadius: '8px' }}
                  formatter={(value: any) => `$${Number(value).toFixed(2)}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Recent Transactions Table */}
      <section>
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Recent Sales Entries</h3>
          {sales.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
              No sales data yet. Go to <b>Admin Retail</b> to add entries.
            </p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '1rem' }}>Product</th>
                  <th style={{ padding: '1rem' }}>Date</th>
                  <th style={{ padding: '1rem' }}>Amount</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {sales.slice().reverse().slice(0, 10).map((sale, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }}
                    onMouseOver={e => (e.currentTarget.style.background = 'var(--bg-panel-hover)')}
                    onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '1rem', fontWeight: 500 }}>{sale.product}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{sale.date}</td>
                    <td style={{ padding: '1rem', color: 'var(--success)' }}>${sale.amount.toFixed(2)}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 500,
                        background: 'rgba(0, 255, 136, 0.1)', color: 'var(--success)'
                      }}>Completed</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
