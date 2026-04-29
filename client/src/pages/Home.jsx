import { Link } from 'react-router-dom';

const features = [
  { icon: '🧮', title: 'Precision Dosage Calculator',  desc: 'Accurate dose computation by weight, breed, and drug class.',      link: '/calculator', roles: ['vet','student'] },
  { icon: '📋', title: 'Treatment Plan Generator',     desc: 'Generate complete schedules with clear owner instructions.',         link: '/treatment',  roles: ['vet'] },
  { icon: '🎓', title: 'Student Practice Mode',        desc: 'Realistic clinical cases with instant feedback.',                   link: '/student',    roles: ['student'] },
  { icon: '💊', title: 'Drug Information',             desc: 'Quick-access drug descriptions and breed-specific warnings.',       link: '/drugs',      roles: ['vet','student','owner'] },
  { icon: '🐾', title: "Pet Owner View",               desc: 'Simplified treatment instructions for pet owners.',                 link: '/owner',      roles: ['owner'] },
  { icon: '⚠️', title: 'Breed Sensitivity Flags',     desc: 'Automatic MDR1 and breed-specific drug interaction warnings.',      link: '/calculator', roles: ['vet','student'] },
];

export default function Home() {
  const user    = JSON.parse(localStorage.getItem('vetdoze_user') || 'null');
  const role    = user?.role || 'owner';
  const visible = features.filter(f => f.roles.includes(role));

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        .feature-card { transition: all 0.22s cubic-bezier(0.16,1,0.3,1); }
        .feature-card:hover { border-color: #8B9D00 !important; transform: translateY(-3px); box-shadow: 0 12px 32px rgba(139,157,0,0.13) !important; }
        .cta-btn-primary { transition: all 0.18s ease; }
        .cta-btn-primary:hover { background: #7A8B00 !important; box-shadow: 0 8px 24px rgba(139,157,0,0.4) !important; transform: translateY(-1px); }
        .cta-btn-secondary { transition: all 0.18s ease; }
        .cta-btn-secondary:hover { background: rgba(255,255,255,0.2) !important; }
      `}</style>

      {/* ── Hero ── */}
      <div style={{
        background: 'linear-gradient(135deg, #3B2F8F 0%, #5A4DB8 50%, #2A2168 100%)',
        padding: '64px 48px 56px', position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '320px', height: '320px', borderRadius: '50%', background: 'rgba(139,157,0,0.12)', pointerEvents: 'none' }}/>
        <div style={{ position: 'absolute', bottom: '-60px', left: '30%', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }}/>
        <div style={{ position: 'absolute', top: '20%', right: '15%', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(245,195,0,0.08)', pointerEvents: 'none' }}/>

        <div style={{ position: 'relative', maxWidth: '580px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: 'rgba(139,157,0,0.2)', border: '1px solid rgba(200,217,106,0.4)',
            borderRadius: '20px', padding: '5px 14px', marginBottom: '22px',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#C8D96A', display: 'inline-block' }}/>
            <span style={{ fontSize: '11px', color: '#C8D96A', fontWeight: '700', letterSpacing: '0.08em' }}>
              PLUMB'S VETERINARY DRUG HANDBOOK
            </span>
          </div>

          <h1 style={{
            fontSize: '46px', fontWeight: '800', color: 'white',
            lineHeight: '1.12', margin: '0 0 18px', letterSpacing: '-0.02em',
          }}>
            Innovative Pet<br/>
            <span style={{ color: '#A8BC00' }}>Care Solutions</span>
          </h1>

          <p style={{
            fontSize: '16px', color: 'rgba(255,255,255,0.68)',
            lineHeight: '1.75', margin: '0 0 36px', maxWidth: '440px',
          }}>
            A unified platform for veterinarians, students, and pet owners — precise dosage calculations, treatment plans, and clear medication instructions.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link to={role === 'owner' ? '/owner' : '/calculator'}
              className="cta-btn-primary"
              style={{
                background: '#8B9D00', color: 'white', textDecoration: 'none',
                padding: '13px 28px', borderRadius: '12px',
                fontSize: '14px', fontWeight: '700', display: 'inline-flex',
                alignItems: 'center', gap: '8px',
                boxShadow: '0 6px 20px rgba(139,157,0,0.35)',
              }}>
              {role === 'owner' ? "🐾 View My Pet's Plan" : '🧮 Open Calculator'}
            </Link>
            <Link to="/drugs"
              className="cta-btn-secondary"
              style={{
                background: 'rgba(255,255,255,0.1)', color: 'white', textDecoration: 'none',
                padding: '13px 28px', borderRadius: '12px', fontSize: '14px', fontWeight: '600',
                border: '1px solid rgba(255,255,255,0.2)', display: 'inline-block',
              }}>
              Browse Drug Info
            </Link>
          </div>
        </div>
      </div>

      {/* ── Stats bar ── */}
      <div style={{
        background: '#8B9D00', padding: '16px 48px',
        display: 'flex', gap: '48px', flexWrap: 'wrap',
        boxShadow: '0 4px 16px rgba(139,157,0,0.25)',
      }}>
        {[
          { number: '4+',   label: 'Drugs in database' },
          { number: '9+',   label: 'Breeds supported' },
          { number: '3',    label: 'User roles' },
          { number: '100%', label: "Plumb's handbook" },
        ].map((s, i) => (
          <div key={i}>
            <p style={{ fontSize: '22px', fontWeight: '800', color: 'white', margin: 0, letterSpacing: '-0.01em' }}>{s.number}</p>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', margin: 0, fontWeight: '500' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Features ── */}
      <div style={{ padding: '52px 48px' }}>
        <div style={{ marginBottom: '36px' }}>
          <span style={{
            display: 'inline-block', background: '#F4F6DC', color: '#5A6600',
            fontSize: '10px', fontWeight: '800', padding: '4px 14px',
            borderRadius: '20px', letterSpacing: '0.08em', marginBottom: '12px',
            border: '1px solid #C8D800',
          }}>PLATFORM FEATURES</span>
          <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#1A1A2E', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
            Everything you need
          </h2>
          <p style={{ fontSize: '14px', color: '#94A3B8', margin: 0 }}>
            Tools built specifically for your role.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {visible.map((f, i) => (
            <Link key={i} to={f.link} style={{ textDecoration: 'none' }}>
              <div className="feature-card" style={{
                background: 'white', border: '1px solid #ECEEF2',
                borderRadius: '18px', padding: '24px',
                cursor: 'pointer',
                boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
              }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '14px',
                  background: '#F4F6DC', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '22px', marginBottom: '16px',
                  boxShadow: '0 2px 8px rgba(139,157,0,0.12)',
                }}>{f.icon}</div>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1A1A2E', margin: '0 0 8px', letterSpacing: '-0.01em' }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: '1.65', margin: 0 }}>
                  {f.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div style={{
        background: 'linear-gradient(135deg, #2A2168, #3B2F8F)',
        margin: '0 48px 48px', borderRadius: '20px', padding: '40px 44px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: '20px',
        boxShadow: '0 12px 40px rgba(42,33,104,0.35)',
      }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'white', margin: '0 0 8px', letterSpacing: '-0.01em' }}>
            Ready to improve clinical accuracy?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', margin: 0, fontSize: '14px' }}>
            Safer, faster dosage decisions for every patient.
          </p>
        </div>
        <Link to={role === 'owner' ? '/owner' : '/calculator'}
          className="cta-btn-primary"
          style={{
            background: '#8B9D00', color: 'white', textDecoration: 'none',
            padding: '13px 28px', borderRadius: '12px', fontSize: '14px', fontWeight: '700',
            whiteSpace: 'nowrap', display: 'inline-block',
            boxShadow: '0 6px 20px rgba(139,157,0,0.35)',
          }}>
          {role === 'owner' ? "View My Pet's Plan" : 'Go to Calculator →'}
        </Link>
      </div>

      {/* ── Footer ── */}
      <footer style={{
        borderTop: '1px solid #F0F2F5', padding: '20px 48px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: '10px', background: 'white',
      }}>
        <p style={{ fontSize: '12px', color: '#94A3B8', margin: 0 }}>
          © 2026 VetDoze · Mendez, Menguez, Yosores
        </p>
        <p style={{ fontSize: '12px', color: '#8B9D00', fontWeight: '700', margin: 0 }}>
          Powered by Plumb's Veterinary Drug Handbook
        </p>
      </footer>
    </div>
  );
}