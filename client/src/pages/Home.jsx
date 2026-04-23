import { Link } from 'react-router-dom';

const features = [
  {
    icon: '💊',
    title: 'Precision Dosage Calculator',
    desc: 'Accurate dose computation for dogs and cats by weight, breed, and drug class.',
    link: '/calculator',
  },
  {
    icon: '📋',
    title: 'Treatment Plan Generator',
    desc: 'Generate complete treatment schedules with clear owner instructions instantly.',
    link: '/treatment',
  },
  {
    icon: '🎓',
    title: 'Student Practice Mode',
    desc: 'Realistic clinical cases with instant feedback for vet students.',
    link: '/student',
  },
  {
    icon: '📖',
    title: 'Drug Information',
    desc: 'Quick-access drug descriptions, usage guidelines, and breed-specific warnings.',
    link: '/drugs',
  },
  {
    icon: '🐾',
    title: 'Pet Owner View',
    desc: 'Simplified treatment instructions pet owners can actually understand.',
    link: '/owner',
  },
  {
    icon: '⚠️',
    title: 'Breed Sensitivity Flags',
    desc: 'Automatic MDR1 and breed-specific drug interaction warnings.',
    link: '/calculator',
  },
];

export default function Home() {
  const user = JSON.parse(localStorage.getItem('vetdoze_user') || 'null');

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #3B2F8F 0%, #5A4DB8 50%, #2A2168 100%)',
        padding: '80px 40px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{
          position: 'absolute', top: '-60px', right: '-60px',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'rgba(139,157,0,0.15)', pointerEvents: 'none'
        }}/>
        <div style={{
          position: 'absolute', bottom: '-40px', left: '-40px',
          width: '200px', height: '200px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)', pointerEvents: 'none'
        }}/>

        <div style={{ position: 'relative', maxWidth: '640px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(139,157,0,0.2)', border: '1px solid rgba(139,157,0,0.4)',
            borderRadius: '20px', padding: '6px 16px', marginBottom: '24px',
          }}>
            <span style={{ fontSize: '12px', color: '#C8D96A', fontWeight: '600', letterSpacing: '0.05em' }}>
              BASED ON PLUMB'S VETERINARY DRUG HANDBOOK
            </span>
          </div>

          <h1 style={{
            fontSize: '48px', fontWeight: '700', color: 'white',
            lineHeight: '1.15', marginBottom: '20px',
          }}>
            Innovative Pet<br/>
            <span style={{ color: '#A8BC00' }}>Care Solutions</span>
          </h1>

          <p style={{
            fontSize: '17px', color: 'rgba(255,255,255,0.75)',
            lineHeight: '1.7', marginBottom: '36px', maxWidth: '480px', margin: '0 auto 36px',
          }}>
            A unified platform for veterinarians, students, and pet owners — precise dosage calculations, treatment plans, and clear medication instructions.
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to={user ? '/calculator' : '/register'} style={{
              background: '#8B9D00', color: 'white', textDecoration: 'none',
              padding: '14px 32px', borderRadius: '10px',
              fontSize: '15px', fontWeight: '700', transition: 'background 0.2s',
              display: 'inline-block',
            }}>
              {user ? 'Open Calculator' : 'Get Started Free'}
            </Link>
            <Link to="/drugs" style={{
              background: 'rgba(255,255,255,0.1)', color: 'white', textDecoration: 'none',
              padding: '14px 32px', borderRadius: '10px',
              fontSize: '15px', fontWeight: '600', border: '1px solid rgba(255,255,255,0.2)',
              display: 'inline-block',
            }}>
              Browse Drug Info
            </Link>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{
        background: '#8B9D00', padding: '20px 40px',
        display: 'flex', justifyContent: 'center', gap: '60px', flexWrap: 'wrap',
      }}>
        {[
          { number: '4+', label: 'Drugs in database' },
          { number: '9+', label: 'Breeds supported' },
          { number: '3', label: 'User roles' },
          { number: '100%', label: 'Plumb\'s handbook' },
        ].map((s, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '24px', fontWeight: '700', color: 'white', margin: 0 }}>{s.number}</p>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', margin: 0 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Features grid */}
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '64px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{
            display: 'inline-block', background: '#F4F6DC', color: '#6B7A00',
            fontSize: '12px', fontWeight: '600', padding: '4px 14px',
            borderRadius: '20px', letterSpacing: '0.05em', marginBottom: '12px',
          }}>
            PLATFORM FEATURES
          </span>
          <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#1A1A2E', marginBottom: '12px' }}>
            Everything your clinic needs
          </h2>
          <p style={{ fontSize: '15px', color: '#6B6B80', maxWidth: '480px', margin: '0 auto' }}>
            Built for veterinary professionals, students, and pet owners — all in one place.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
        }}>
          {features.map((f, i) => (
            <Link key={i} to={f.link} style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'white', border: '1px solid #E2E4D0',
                borderRadius: '16px', padding: '28px 24px',
                transition: 'all 0.2s', cursor: 'pointer',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#8B9D00';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(139,157,0,0.12)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#E2E4D0';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px',
                  background: '#F4F6DC', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '22px', marginBottom: '16px',
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1A1A2E', marginBottom: '8px' }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: '13px', color: '#6B6B80', lineHeight: '1.6', margin: 0 }}>
                  {f.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA banner */}
      <div style={{
        background: 'linear-gradient(135deg, #2A2168, #3B2F8F)',
        margin: '0 24px 64px', borderRadius: '24px',
        padding: '48px', textAlign: 'center', maxWidth: '960px',
        marginLeft: 'auto', marginRight: 'auto',
      }}>
        <h2 style={{ fontSize: '28px', fontWeight: '700', color: 'white', marginBottom: '12px' }}>
          Ready to improve clinical accuracy?
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '28px', fontSize: '15px' }}>
          Join veterinarians and students using VetDoze for safer, faster dosage decisions.
        </p>
        <Link to={user ? '/calculator' : '/register'} style={{
          background: '#8B9D00', color: 'white', textDecoration: 'none',
          padding: '14px 36px', borderRadius: '10px',
          fontSize: '15px', fontWeight: '700', display: 'inline-block',
        }}>
          {user ? 'Go to Calculator' : 'Create Free Account'}
        </Link>
      </div>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid #E2E4D0', padding: '24px 40px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: '12px', background: 'white',
      }}>
        <p style={{ fontSize: '13px', color: '#6B6B80', margin: 0 }}>
          © 2026 VetDoze · Jeric Jed Mendez, Earl Vincent Menguez, Francis Yosores
        </p>
        <p style={{ fontSize: '13px', color: '#8B9D00', fontWeight: '600', margin: 0 }}>
          Powered by Plumb's Veterinary Drug Handbook
        </p>
      </footer>
    </div>
  );
}