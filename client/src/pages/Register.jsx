import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

const roles = [
  { value: 'vet',     label: 'Veterinarian', desc: 'Clinical dosage & treatment plans', icon: '🩺' },
  { value: 'student', label: 'Vet Student',   desc: 'Practice mode & case drills',       icon: '🎓' },
  { value: 'owner',   label: 'Pet Owner',     desc: "View my pet's treatment plan",      icon: '🐾' },
];

export default function Register() {
  const [form, setForm]       = useState({ name: '', email: '', password: '', role: 'vet' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await api.post('/auth/register', form);
      localStorage.setItem('vetdoze_token', res.data.token);
      localStorage.setItem('vetdoze_user', JSON.stringify(res.data.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed.');
    } finally { setLoading(false); }
  };

  const inputStyle = {
    width: '100%', border: '1.5px solid #E8EAF0', borderRadius: '10px',
    padding: '12px 14px', fontSize: '14px', fontFamily: 'inherit',
    color: '#1A1A2E', background: 'white', outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s', boxSizing: 'border-box',
  };
  const focusOn  = e => { e.target.style.borderColor = '#5A4DB8'; e.target.style.boxShadow = '0 0 0 3px rgba(90,77,184,0.12)'; };
  const focusOff = e => { e.target.style.borderColor = '#E8EAF0'; e.target.style.boxShadow = 'none'; };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: 'linear-gradient(135deg, #3B2F8F 0%, #5A4DB8 50%, #2A2168 100%)',
      position: 'relative', overflow: 'hidden',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      <style>{`
        .register-btn { transition: all 0.18s ease; }
        .register-btn:hover:not(:disabled) { opacity: 0.9 !important; transform: translateY(-1px); box-shadow: 0 10px 28px rgba(59,47,143,0.5) !important; }
        .role-card { transition: all 0.15s ease; }
        .role-card:hover { border-color: #9B8FD8 !important; background: #F4F3FE !important; }
      `}</style>

      {/* Decorative circles */}
      <div style={{ position: 'absolute', top: '-120px', right: '-120px', width: '420px', height: '420px', borderRadius: '50%', background: 'rgba(139,157,0,0.12)', pointerEvents: 'none' }}/>
      <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }}/>

      <div style={{
        width: '100%', maxWidth: '480px',
        margin: 'auto', padding: '40px 16px',
        position: 'relative', zIndex: 1,
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: 'white', margin: '0 0 6px', letterSpacing: '-0.01em' }}>
            Create your account
          </h1>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', margin: 0 }}>
            Join VetDoze — it's free
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.98)', borderRadius: '20px',
          border: '1px solid rgba(255,255,255,0.3)', padding: '28px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
        }}>
          <form onSubmit={handleSubmit}>

            {/* Role selector */}
            <div style={{ marginBottom: '22px' }}>
              <label style={{ display: 'block', fontSize: '10px', fontWeight: '800', color: '#94A3B8', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                I am a
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {roles.map(r => (
                  <div key={r.value} className="role-card" onClick={() => setForm({ ...form, role: r.value })} style={{
                    display: 'flex', alignItems: 'center', gap: '14px',
                    padding: '13px 16px', borderRadius: '12px', cursor: 'pointer',
                    border: form.role === r.value ? '2px solid #5A4DB8' : '1.5px solid #E8EAF0',
                    background: form.role === r.value ? '#EEEDFE' : 'white',
                    transition: 'all 0.15s',
                    boxShadow: form.role === r.value ? '0 4px 14px rgba(90,77,184,0.14)' : '0 1px 4px rgba(0,0,0,0.04)',
                  }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '12px',
                      background: form.role === r.value ? 'rgba(90,77,184,0.12)' : '#F7F8F3',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '20px', flexShrink: 0,
                    }}>{r.icon}</div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '14px', fontWeight: '700', color: form.role === r.value ? '#3B2F8F' : '#1A1A2E', margin: '0 0 2px' }}>
                        {r.label}
                      </p>
                      <p style={{ fontSize: '12px', color: '#94A3B8', margin: 0 }}>{r.desc}</p>
                    </div>
                    {form.role === r.value && (
                      <div style={{
                        width: '22px', height: '22px', borderRadius: '50%',
                        background: '#5A4DB8', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: '800',
                        flexShrink: 0, boxShadow: '0 3px 8px rgba(90,77,184,0.3)',
                      }}>✓</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Name */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '10px', fontWeight: '800', color: '#94A3B8', marginBottom: '7px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Full name
              </label>
              <input value={form.name} required onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Dr. Juan Cruz" style={inputStyle} onFocus={focusOn} onBlur={focusOff} />
            </div>

            {/* Email */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '10px', fontWeight: '800', color: '#94A3B8', marginBottom: '7px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Email address
              </label>
              <input type="email" value={form.email} required onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com" style={inputStyle} onFocus={focusOn} onBlur={focusOff} />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '22px' }}>
              <label style={{ display: 'block', fontSize: '10px', fontWeight: '800', color: '#94A3B8', marginBottom: '7px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Password
              </label>
              <input type="password" value={form.password} required onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••" style={inputStyle} onFocus={focusOn} onBlur={focusOff} />
            </div>

            {error && (
              <div style={{
                background: '#FCEBEB', border: '1px solid #F7C1C1', borderRadius: '10px',
                padding: '12px 14px', fontSize: '13px', color: '#A32D2D',
                marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                <span>⚠️</span> {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="register-btn" style={{
              width: '100%',
              background: 'linear-gradient(135deg, #3B2F8F, #5A4DB8)',
              color: 'white', border: 'none', borderRadius: '12px',
              padding: '14px', fontSize: '15px', fontWeight: '800',
              cursor: 'pointer', fontFamily: 'inherit',
              opacity: loading ? 0.65 : 1,
              boxShadow: '0 6px 20px rgba(59,47,143,0.38)',
              letterSpacing: '0.01em',
            }}>
              {loading ? '⏳ Creating account...' : 'Create Account'}
            </button>
          </form>

          <div style={{ borderTop: '1px solid #F0F2F5', marginTop: '20px', paddingTop: '18px', textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: '#6B6B80', margin: 0 }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#3B2F8F', fontWeight: '800', textDecoration: 'none' }}>
                Sign in
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