import { useState, useEffect } from 'react';

export default function SplashScreen({ onDone }) {
  const [phase, setPhase] = useState('in');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('visible'), 100);
    const t2 = setTimeout(() => setPhase('out'), 2600);
    const t3 = setTimeout(() => { setPhase('done'); onDone(); }, 3400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  if (phase === 'done') return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      /* Purple gradient — same as hero/home background */
      background: 'linear-gradient(135deg, #3B2F8F 0%, #5A4DB8 50%, #2A2168 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      opacity: phase === 'out' ? 0 : 1,
      transition: phase === 'out' ? 'opacity 0.8s ease' : 'opacity 0.4s ease',
      pointerEvents: phase === 'out' ? 'none' : 'all',
      overflow: 'hidden',
    }}>

      {/* Decorative background circles — matching home hero */}
      <div style={{
        position: 'absolute', top: '-100px', right: '-100px',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'rgba(139,157,0,0.12)', pointerEvents: 'none',
      }}/>
      <div style={{
        position: 'absolute', bottom: '-80px', left: '-80px',
        width: '300px', height: '300px', borderRadius: '50%',
        background: 'rgba(255,255,255,0.05)', pointerEvents: 'none',
      }}/>
      <div style={{
        position: 'absolute', bottom: '10%', right: '8%',
        width: '180px', height: '180px', borderRadius: '50%',
        background: 'rgba(90,77,184,0.4)', pointerEvents: 'none',
      }}/>

      {/* Logo + content */}
      <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        transform: phase === 'visible' ? 'scale(1) translateY(0)' : 'scale(0.88) translateY(20px)',
        opacity: phase === 'visible' ? 1 : 0,
        transition: 'transform 0.7s cubic-bezier(0.34,1.56,0.64,1), opacity 0.5s ease',
        position: 'relative', zIndex: 1,
        padding: '0 24px', textAlign: 'center',
      }}>

        {/* Full logo — LARGER size */}
        <img
          src="/logo-full.png"
          alt="VetDoze"
          style={{
            width: 'min(560px, 88vw)',   /* increased from 420px */
            height: 'auto',
            objectFit: 'contain',
            marginBottom: '4px',
            filter: 'drop-shadow(0 8px 32px rgba(0,0,0,0.25))',
          }}
          onError={e => { e.target.style.display = 'none'; }}
        />

        {/* Tagline */}
        <p style={{
          fontSize: '15px',
          color: 'rgba(255,255,255,0.65)',
          fontWeight: '500',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          letterSpacing: '0.06em',
          marginTop: '16px',
          opacity: phase === 'visible' ? 1 : 0,
          transition: 'opacity 0.4s ease 0.4s',
        }}>
          Precision Veterinary Dosage Platform
        </p>
      </div>

      {/* Loading dots */}
      <div style={{
        display: 'flex', gap: '7px', marginTop: '48px',
        opacity: phase === 'visible' ? 1 : 0,
        transition: 'opacity 0.4s ease 0.6s',
        position: 'relative', zIndex: 1,
      }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: '#F5C300',
            animation: `vd-bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}/>
        ))}
      </div>

      <style>{`
        @keyframes vd-bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40%            { transform: translateY(-9px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}