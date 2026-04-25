import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

const roles = [
  { value: 'vet',     label: 'Veterinarian', desc: 'Clinical dosage & treatment plans', icon: '🩺' },
  { value: 'student', label: 'Vet Student',   desc: 'Practice mode & case drills',       icon: '🎓' },
  { value: 'owner',   label: 'Pet Owner',     desc: "View my pet's treatment plan",      icon: '🐾' },
];

export default function Register() {
  const [form, setForm]     = useState({ name: '', email: '', password: '', role: 'vet' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/register', form);
      localStorage.setItem('vetdoze_token', res.data.token);
      localStorage.setItem('vetdoze_user', JSON.stringify(res.data.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', border: '1.5px solid #E2E4D0', borderRadius: '10px',
    padding: '11px 14px', fontSize: '14px', fontFamily: 'inherit',
    color: '#1A1A2E', background: 'white', outline: 'none',
    transition: 'border-color 0.2s', boxSizing: 'border-box',
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'linear-gradient(135deg, #3B2F8F 0%, #5A4DB8 50%, #2A2168 100%)',
      position: 'relative', overflow: 'hidden',
    }}>

      {/* Decorative circles */}
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

      {/* Centered form */}
      <div style={{
        width: '100%', maxWidth: '460px',
        margin: 'auto', padding: '40px 16px',
        position: 'relative', zIndex: 1,
      }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <img
            src="/logo-text.png"
            alt="VETDOZE"
            style={{
              height: '48px', width: 'auto', objectFit: 'contain',
              marginBottom: '12px',
              filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.2))',
            }}
            onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
          />
          <span style={{
            display: 'none', fontSize: '28px', fontWeight: '900', color: '#F5C300',
            fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '0.04em',
          }}>VETDOZE</span>

          <h1 style={{ fontSize: '22px', fontWeight: '700', color: 'white', margin: '0 0 4px' }}>
            Create your account
          </h1>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.65)', margin: 0 }}>
            Join VetDoze — it's free
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.97)', borderRadius: '20px',
          border: '1px solid rgba(255,255,255,0.3)', padding: '28px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
        }}>
          <form onSubmit={handleSubmit}>

            {/* Role selector */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block', fontSize: '11px', fontWeight: '700', color: '#6B6B80',
                marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.07em',
              }}>I am a</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                {roles.map(r => (
                  <div key={r.value} onClick={() => setForm({ ...form, role: r.value })} style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '11px 14px', borderRadius: '10px', cursor: 'pointer',
                    border: form.role === r.value ? '2px solid #5A4DB8' : '1.5px solid #E2E4D0',
                    background: form.role === r.value ? '#EEEDFE' : 'white',
                    transition: 'all 0.15s',
                  }}>
                    <span style={{ fontSize: '18px' }}>{r.icon}</span>
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: '700', color: '#1A1A2E', margin: 0 }}>
                        {r.label}
                      </p>
                      <p style={{ fontSize: '11px', color: '#6B6B80', margin: 0 }}>{r.desc}</p>
                    </div>
                    {form.role === r.value && (
                      <div style={{
                        marginLeft: 'auto', width: '18px', height: '18px', borderRadius: '50%',
                        background: '#5A4DB8', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', color: 'white', fontSize: '11px', fontWeight: '700',
                      }}>✓</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Name */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#6B6B80', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Full name</label>
              <input value={form.name} required onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Dr. Juan Cruz" style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#5A4DB8'}
                onBlur={e  => e.target.style.borderColor = '#E2E4D0'}
              />
            </div>

            {/* Email */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#6B6B80', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Email address</label>
              <input type="email" value={form.email} required
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com" style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#5A4DB8'}
                onBlur={e  => e.target.style.borderColor = '#E2E4D0'}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#6B6B80', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Password</label>
              <input type="password" value={form.password} required
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••" style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#5A4DB8'}
                onBlur={e  => e.target.style.borderColor = '#E2E4D0'}
              />
            </div>

            {error && (
              <div style={{
                background: '#FCEBEB', border: '1px solid #F7C1C1', borderRadius: '10px',
                padding: '12px 14px', fontSize: '13px', color: '#A32D2D', marginBottom: '14px',
              }}>{error}</div>
            )}

            <button type="submit" disabled={loading} style={{
              width: '100%',
              background: 'linear-gradient(135deg, #3B2F8F, #5A4DB8)',
              color: 'white', border: 'none', borderRadius: '10px',
              padding: '13px', fontSize: '15px', fontWeight: '700',
              cursor: 'pointer', fontFamily: 'inherit', transition: 'opacity 0.2s',
              opacity: loading ? 0.65 : 1,
              boxShadow: '0 4px 14px rgba(59,47,143,0.35)',
            }}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div style={{ borderTop: '1px solid #E2E4D0', marginTop: '20px', paddingTop: '16px', textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: '#6B6B80', margin: 0 }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#5A4DB8', fontWeight: '700', textDecoration: 'none' }}>
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.45)', marginTop: '20px' }}>
          Powered by Plumb's Veterinary Drug Handbook
        </p>
      </div>
    </div>
  );
}