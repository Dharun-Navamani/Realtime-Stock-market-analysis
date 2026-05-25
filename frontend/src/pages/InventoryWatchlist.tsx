import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { PackageSearch, ArrowLeft, Trash2 } from 'lucide-react';

export default function InventoryWatchlist() {
  const { logout } = useAuth();
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [newSku, setNewSku] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/watchlist/`);
      setWatchlist(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSku.trim()) return;
    try {
      setError('');
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/watchlist/add`, { sku: newSku.toUpperCase() });
      setNewSku('');
      fetchWatchlist();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to add product');
    }
  };

  const removeProduct = async (sku: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/watchlist/remove/${sku}`);
      fetchWatchlist();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '60px' }}>
      <header className="flex justify-between items-center" style={{ marginBottom: '32px' }}>
        <div className="flex items-center gap-4">
          <Link to="/store-dashboard" className="btn" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
            <ArrowLeft size={18} /> Back
          </Link>
          <div className="flex items-center gap-2">
            <PackageSearch color="var(--accent)" size={32} />
            <h1 style={{ margin: 0 }}>Inventory Watchlist</h1>
          </div>
        </div>
      </header>

      <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <form onSubmit={addProduct} className="flex gap-2" style={{ marginBottom: '24px' }}>
          <input 
            className="input" 
            placeholder="Track product SKU (e.g. IPH15)" 
            value={newSku}
            onChange={(e) => setNewSku(e.target.value)}
          />
          <button type="submit" className="btn">Add to Watchlist</button>
        </form>
        {error && <div style={{ color: 'var(--danger)', marginBottom: '16px' }}>{error}</div>}

        <div className="flex flex-col gap-4">
           {watchlist.length === 0 ? (
             <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '24px 0' }}>
               Your watchlist is empty. Add SKUs to monitor inventory levels!
             </p>
           ) : (
             watchlist.map((item) => (
                <div key={item.id} className="glass-panel flex justify-between items-center" style={{ padding: '16px' }}>
                  <div className="flex items-center gap-4">
                    <strong style={{ fontSize: '20px' }}>{item.sku}</strong>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                      Tracking since {new Date(item.added_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/store-dashboard?sku=${item.sku}`} className="btn" style={{ background: 'var(--bg-primary)' }}>Analyze Sales</Link>
                    <button className="btn btn-danger" onClick={() => removeProduct(item.sku)}><Trash2 size={16}/></button>
                  </div>
                </div>
             ))
           )}
        </div>
      </div>
    </div>
  );
}
