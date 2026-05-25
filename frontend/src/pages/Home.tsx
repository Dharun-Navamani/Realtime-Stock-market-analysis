import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie, Legend
} from 'recharts';
import {
  Search, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight,
  ShoppingBag, Package, DollarSign, BarChart3, Activity
} from 'lucide-react';

interface SaleRecord {
  product: string;
  amount: number;
  date: string;
}

const COLORS = ['#00ff88', '#00d2ff', '#ff3366', '#ffbb33', '#8884d8', '#ff8042', '#0088fe'];

const Home = ({ wsData }: { wsData: any }) => {
  const [sales, setSales] = useState<SaleRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchSales = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/sales');
      const data = await res.json();
      setSales(data);
    } catch (err) {
      console.error('Error fetching sales:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
    // Auto-refresh every 5 seconds so new admin entries show up live
    const interval = setInterval(fetchSales, 5000);
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
          <p style={{ color: 'var(--text-muted)' }}>Live retail sales overview — data entered by Admin</p>
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
        </div>

        <div className="card" style={{ borderTop: '3px solid var(--accent-secondary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Sales</span>
            <Package size={20} color="var(--accent-secondary)" />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>{totalProducts}</h2>
        </div>

        <div className="card" style={{ borderTop: '3px solid #ffbb33' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Unique Products</span>
            <BarChart3 size={20} color="#ffbb33" />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>{productData.length}</h2>
        </div>

        <div className="card" style={{ borderTop: '3px solid #8884d8' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Avg. Sale Value</span>
            <TrendingUp size={20} color="#8884d8" />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>
            ${totalProducts > 0 ? (totalRevenue / totalProducts).toFixed(2) : '0.00'}
          </h2>
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
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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
