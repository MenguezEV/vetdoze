import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      localStorage.setItem('vetdoze_token', res.data.token);
      localStorage.setItem('vetdoze_user', JSON.stringify(res.data.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 64px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#F7F8F3', padding: '40px 16px',
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '16px',
            background: 'linear-gradient(135deg, #3B2F8F, #5A4DB8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '24px', margin: '0 auto 16px',
          }}>🐾</div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1A1A2E', margin: '0 0 6px' }}>
            Welcome back
          </h1>
          <p style={{ fontSize: '14px', color: '#6B6B80', margin: 0 }}>
            Sign in to your VetDoze account
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'white', borderRadius: '20px',
          border: '1px solid #E2E4D0', padding: '32px',
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block', fontSize: '13px', fontWeight: '600',
                color: '#6B6B80', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em'
              }}>Email address</label>
              <input
                type="email" value={form.email} required
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                style={{
                  width: '100%', border: '1.5px solid #E2E4D0', borderRadius: '10px',
                  padding: '11px 14px', fontSize: '14px', fontFamily: 'inherit',
                  color: '#1A1A2E', background: 'white', outline: 'none', transition: 'border-color 0.2s'
                }}
                onFocus={e => e.target.style.borderColor = '#8B9D00'}
                onBlur={e => e.target.style.borderColor = '#E2E4D0'}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block', fontSize: '13px', fontWeight: '600',
                color: '#6B6B80', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em'
              }}>Password</label>
              <input
                type="password" value={form.password} required
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                style={{
                  width: '100%', border: '1.5px solid #E2E4D0', borderRadius: '10px',
                  padding: '11px 14px', fontSize: '14px', fontFamily: 'inherit',
                  color: '#1A1A2E', background: 'white', outline: 'none', transition: 'border-color 0.2s'
                }}
                onFocus={e => e.target.style.borderColor = '#8B9D00'}
                onBlur={e => e.target.style.borderColor = '#E2E4D0'}
              />
            </div>

            {error && (
              <div style={{
                background: '#FCEBEB', border: '1px solid #F7C1C1',
                borderRadius: '10px', padding: '12px 14px',
                fontSize: '13px', color: '#A32D2D', marginBottom: '16px'
              }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              width: '100%', background: '#8B9D00', color: 'white',
              border: 'none', borderRadius: '10px', padding: '13px',
              fontSize: '15px', fontWeight: '700', cursor: 'pointer',
              fontFamily: 'inherit', transition: 'background 0.2s',
              opacity: loading ? 0.6 : 1,
            }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={{
            borderTop: '1px solid #E2E4D0', marginTop: '24px', paddingTop: '20px',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: '14px', color: '#6B6B80', margin: 0 }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#8B9D00', fontWeight: '600', textDecoration: 'none' }}>
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}