import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple mock authentication
    if (email === 'admin@pulse.com' && password === 'admin123') {
      navigate('/admin');
    } else {
      setError('Invalid credentials. Use admin@pulse.com / admin123');
    }
  };

  return (
    <div className="fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', flexDirection: 'column' }}>
      <div className="card" style={{ width: '400px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Admin Access</h2>
          <p style={{ color: 'var(--text-muted)' }}>Sign in to manage retail sales</p>
        </div>
        
        {error && (
          <div style={{ marginBottom: '1.5rem', padding: '0.8rem', background: 'rgba(255, 51, 102, 0.1)', border: '1px solid var(--danger)', borderRadius: '8px', color: 'var(--danger)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Email</label>
            <input 
              type="email" 
              placeholder="admin@pulse.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '0.8rem 1rem',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                background: 'var(--bg-dark)',
                color: 'var(--text-main)',
                outline: 'none',
                borderColor: email ? 'var(--accent)' : 'var(--border)'
              }} 
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.8rem 1rem',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                background: 'var(--bg-dark)',
                color: 'var(--text-main)',
                outline: 'none',
                borderColor: password ? 'var(--accent)' : 'var(--border)'
              }} 
            />
          </div>
          <button 
            type="submit"
            style={{ 
              marginTop: '1rem',
              padding: '1rem', 
              background: 'var(--accent)', 
              color: 'var(--bg-dark)', 
              border: 'none', 
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => (e.currentTarget.style.filter = 'brightness(1.1)')}
            onMouseOut={(e) => (e.currentTarget.style.filter = 'brightness(1)')}
          >
            Login as Admin
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Tip: Use <b style={{ color: 'var(--accent-secondary)' }}>admin123</b> to access the dashboard.
        </p>
      </div>
    </div>
  );
};

export default Login;
