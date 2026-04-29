import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

export default function Login() {
  const [form, setForm]       = useState({ email: '', password: '' });
  const [error, setError]     = useState('');
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

  const inputStyle = {
    width: '100%', border: '1.5px solid #E8EAF0', borderRadius: '10px',
    padding: '12px 14px', fontSize: '14px', fontFamily: 'inherit',
    color: '#1A1A2E', background: 'white', outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s', boxSizing: 'border-box',
  };
  const focusOn  = e => { e.target.style.borderColor = '#5A4DB8'; e.target.style.boxShadow = '0 0 0 3px rgba(90,77,184,0.14)'; };
  const focusOff = e => { e.target.style.borderColor = '#E8EAF0'; e.target.style.boxShadow = 'none'; };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: 'linear-gradient(135deg, #3B2F8F 0%, #5A4DB8 50%, #2A2168 100%)',
      position: 'relative', overflow: 'hidden',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      <style>{`
        .login-btn { transition: all 0.18s ease; }
        .login-btn:hover:not(:disabled) { opacity: 0.9 !important; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(59,47,143,0.5) !important; }
      `}</style>

      {/* Decorative circles */}
      <div style={{ position: 'absolute', top: '-120px', right: '-120px', width: '420px', height: '420px', borderRadius: '50%', background: 'rgba(139,157,0,0.12)', pointerEvents: 'none' }}/>
      <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }}/>
      <div style={{ position: 'absolute', bottom: '15%', right: '5%', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(90,77,184,0.35)', pointerEvents: 'none' }}/>

      <div style={{
        width: '100%', maxWidth: '420px',
        margin: 'auto', padding: '40px 16px',
        position: 'relative', zIndex: 1,
      }}>
        {/* Logo area */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: 'white', margin: '0 0 6px', letterSpacing: '-0.01em' }}>
            Welcome back
          </h1>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', margin: 0 }}>
            Sign in to your VetDoze account
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.98)', borderRadius: '20px',
          border: '1px solid rgba(255,255,255,0.3)', padding: '32px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.1)',
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '18px' }}>
              <label style={{
                display: 'block', fontSize: '10px', fontWeight: '800', color: '#94A3B8',
                marginBottom: '7px', textTransform: 'uppercase', letterSpacing: '0.08em',
              }}>Email address</label>
              <input
                type="email" value={form.email} required
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                style={inputStyle}
                onFocus={focusOn} onBlur={focusOff}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block', fontSize: '10px', fontWeight: '800', color: '#94A3B8',
                marginBottom: '7px', textTransform: 'uppercase', letterSpacing: '0.08em',
              }}>Password</label>
              <input
                type="password" value={form.password} required
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                style={inputStyle}
                onFocus={focusOn} onBlur={focusOff}
              />
            </div>

            {error && (
              <div style={{
                background: '#FCEBEB', border: '1px solid #F7C1C1', borderRadius: '10px',
                padding: '12px 14px', fontSize: '13px', color: '#A32D2D',
                marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                <span>⚠️</span> {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="login-btn" style={{
              width: '100%',
              background: 'linear-gradient(135deg, #3B2F8F, #5A4DB8)',
              color: 'white', border: 'none', borderRadius: '12px',
              padding: '14px', fontSize: '15px', fontWeight: '800',
              cursor: 'pointer', fontFamily: 'inherit',
              opacity: loading ? 0.65 : 1,
              boxShadow: '0 6px 20px rgba(59,47,143,0.38)',
              letterSpacing: '0.01em',
            }}>
              {loading ? '⏳ Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={{ borderTop: '1px solid #F0F2F5', marginTop: '24px', paddingTop: '20px', textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: '#6B6B80', margin: 0 }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#3B2F8F', fontWeight: '800', textDecoration: 'none' }}>
                Create one
              </Link>
            </p>
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '20px' }}>
          Powered by Plumb's Veterinary Drug Handbook
        </p>
      </div>
    </div>
  );
}