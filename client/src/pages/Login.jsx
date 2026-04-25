import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

export default function Login() {
  const [form, setForm]     = useState({ email: '', password: '' });
  const [error, setError]   = useState('');
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
      minHeight: '100vh',
      display: 'flex',
      /* Purple gradient — same as hero */
      background: 'linear-gradient(135deg, #3B2F8F 0%, #5A4DB8 50%, #2A2168 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Decorative circles — matching hero */}
      <div style={{
        position: 'absolute', top: '-120px', right: '-120px',
        width: '420px', height: '420px', borderRadius: '50%',
        background: 'rgba(139,157,0,0.12)', pointerEvents: 'none',
      }}/>
      <div style={{
        position: 'absolute', bottom: '-80px', left: '-80px',
        width: '300px', height: '300px', borderRadius: '50%',
        background: 'rgba(255,255,255,0.05)', pointerEvents: 'none',
      }}/>
      <div style={{
        position: 'absolute', bottom: '15%', right: '5%',
        width: '200px', height: '200px', borderRadius: '50%',
        background: 'rgba(90,77,184,0.35)', pointerEvents: 'none',
      }}/>

      {/* Centered form */}
      <div style={{
        width: '100%', maxWidth: '420px',
        margin: 'auto',
        padding: '40px 16px',
        position: 'relative', zIndex: 1,
      }}>

        {/* VetDoze logo — text wordmark */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          {/* Fallback text */}
          <span style={{
            display: 'none',
            fontSize: '28px', fontWeight: '900', color: '#F5C300',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            letterSpacing: '0.04em',
          }}>VETDOZE</span>

          <h1 style={{
            fontSize: '22px', fontWeight: '700',
            color: 'white', margin: '0 0 4px',
          }}>
            Welcome back
          </h1>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.65)', margin: 0 }}>
            Sign in to your VetDoze account
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.97)',
          borderRadius: '20px',
          border: '1px solid rgba(255,255,255,0.3)',
          padding: '32px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
        }}>
          <form onSubmit={handleSubmit}>

            {/* Email */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{
                display: 'block', fontSize: '11px', fontWeight: '700',
                color: '#6B6B80', marginBottom: '6px',
                textTransform: 'uppercase', letterSpacing: '0.07em',
              }}>Email address</label>
              <input
                type="email" value={form.email} required
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                style={{
                  width: '100%', border: '1.5px solid #E2E4D0', borderRadius: '10px',
                  padding: '11px 14px', fontSize: '14px', fontFamily: 'inherit',
                  color: '#1A1A2E', background: 'white', outline: 'none',
                  transition: 'border-color 0.2s', boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = '#5A4DB8'}
                onBlur={e  => e.target.style.borderColor = '#E2E4D0'}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block', fontSize: '11px', fontWeight: '700',
                color: '#6B6B80', marginBottom: '6px',
                textTransform: 'uppercase', letterSpacing: '0.07em',
              }}>Password</label>
              <input
                type="password" value={form.password} required
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                style={{
                  width: '100%', border: '1.5px solid #E2E4D0', borderRadius: '10px',
                  padding: '11px 14px', fontSize: '14px', fontFamily: 'inherit',
                  color: '#1A1A2E', background: 'white', outline: 'none',
                  transition: 'border-color 0.2s', boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = '#5A4DB8'}
                onBlur={e  => e.target.style.borderColor = '#E2E4D0'}
              />
            </div>

            {/* Error */}
            {error && (
              <div style={{
                background: '#FCEBEB', border: '1px solid #F7C1C1',
                borderRadius: '10px', padding: '12px 14px',
                fontSize: '13px', color: '#A32D2D', marginBottom: '16px',
              }}>
                {error}
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={loading} style={{
              width: '100%',
              background: 'linear-gradient(135deg, #3B2F8F, #5A4DB8)',
              color: 'white', border: 'none', borderRadius: '10px',
              padding: '13px', fontSize: '15px', fontWeight: '700',
              cursor: 'pointer', fontFamily: 'inherit',
              transition: 'opacity 0.2s',
              opacity: loading ? 0.65 : 1,
              boxShadow: '0 4px 14px rgba(59,47,143,0.35)',
            }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div style={{
            borderTop: '1px solid #E2E4D0', marginTop: '24px', paddingTop: '20px',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: '14px', color: '#6B6B80', margin: 0 }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#5A4DB8', fontWeight: '700', textDecoration: 'none' }}>
                Create one
              </Link>
            </p>
          </div>
        </div>

        {/* Footer note */}
        <p style={{
          textAlign: 'center', fontSize: '12px',
          color: 'rgba(255,255,255,0.45)', marginTop: '20px',
        }}>
          Powered by Plumb's Veterinary Drug Handbook
        </p>
      </div>
    </div>
  );
}