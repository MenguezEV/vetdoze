import { Link } from 'react-router-dom';

const features = [
  { icon:'💊', title:'Precision Dosage Calculator',  desc:'Accurate dose computation by weight, breed, and drug class.',      link:'/calculator', roles:['vet','student'] },
  { icon:'📋', title:'Treatment Plan Generator',     desc:'Generate complete schedules with clear owner instructions.',         link:'/treatment',  roles:['vet'] },
  { icon:'🎓', title:'Student Practice Mode',        desc:'Realistic clinical cases with instant feedback.',                   link:'/student',    roles:['student'] },
  { icon:'📖', title:'Drug Information',             desc:'Quick-access drug descriptions and breed-specific warnings.',       link:'/drugs',      roles:['vet','student','owner'] },
  { icon:'🐾', title:'Pet Owner View',               desc:'Simplified treatment instructions for pet owners.',                 link:'/owner',      roles:['owner'] },
  { icon:'⚠️', title:'Breed Sensitivity Flags',     desc:'Automatic MDR1 and breed-specific drug interaction warnings.',      link:'/calculator', roles:['vet','student'] },
];

export default function Home() {
  const user = JSON.parse(localStorage.getItem('vetdoze_user') || 'null');
  const role = user?.role || 'owner';
  const visible = features.filter(f => f.roles.includes(role));

  return (
    <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif" }}>

      {/* Hero */}
      <div style={{
        background:'linear-gradient(135deg,#3B2F8F 0%,#5A4DB8 50%,#2A2168 100%)',
        padding:'64px 48px', position:'relative', overflow:'hidden',
      }}>
        <div style={{
          position:'absolute', top:'-80px', right:'-80px', width:'320px', height:'320px',
          borderRadius:'50%', background:'rgba(139,157,0,0.12)', pointerEvents:'none',
        }}/>
        <div style={{
          position:'absolute', bottom:'-60px', left:'30%', width:'200px', height:'200px',
          borderRadius:'50%', background:'rgba(255,255,255,0.04)', pointerEvents:'none',
        }}/>
        <div style={{ position:'relative', maxWidth:'580px' }}>
          <div style={{
            display:'inline-flex', alignItems:'center', gap:'6px',
            background:'rgba(139,157,0,0.2)', border:'1px solid rgba(139,157,0,0.4)',
            borderRadius:'20px', padding:'5px 14px', marginBottom:'20px',
          }}>
            <span style={{ fontSize:'11px', color:'#C8D96A', fontWeight:'700', letterSpacing:'0.06em' }}>
              PLUMB'S VETERINARY DRUG HANDBOOK
            </span>
          </div>
          <h1 style={{
            fontSize:'42px', fontWeight:'800', color:'white',
            lineHeight:'1.15', marginBottom:'16px', margin:'0 0 16px',
          }}>
            Innovative Pet<br/>
            <span style={{ color:'#A8BC00' }}>Care Solutions</span>
          </h1>
          <p style={{
            fontSize:'16px', color:'rgba(255,255,255,0.72)',
            lineHeight:'1.7', margin:'0 0 32px', maxWidth:'460px',
          }}>
            A unified platform for veterinarians, students, and pet owners — precise dosage calculations, treatment plans, and clear medication instructions.
          </p>
          <div style={{ display:'flex', gap:'12px', flexWrap:'wrap' }}>
            <Link to={role === 'owner' ? '/owner' : '/calculator'} style={{
              background:'#8B9D00', color:'white', textDecoration:'none',
              padding:'12px 28px', borderRadius:'10px',
              fontSize:'14px', fontWeight:'700', display:'inline-block',
            }}>
              {role === 'owner' ? "View My Pet's Plan" : 'Open Calculator'}
            </Link>
            <Link to="/drugs" style={{
              background:'rgba(255,255,255,0.1)', color:'white', textDecoration:'none',
              padding:'12px 28px', borderRadius:'10px', fontSize:'14px', fontWeight:'600',
              border:'1px solid rgba(255,255,255,0.2)', display:'inline-block',
            }}>
              Browse Drug Info
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{
        background:'#8B9D00', padding:'16px 48px',
        display:'flex', gap:'48px', flexWrap:'wrap',
      }}>
        {[
          { number:'4+',   label:'Drugs in database' },
          { number:'9+',   label:'Breeds supported' },
          { number:'3',    label:'User roles' },
          { number:'100%', label:"Plumb's handbook" },
        ].map((s,i) => (
          <div key={i}>
            <p style={{ fontSize:'22px', fontWeight:'800', color:'white', margin:0 }}>{s.number}</p>
            <p style={{ fontSize:'12px', color:'rgba(255,255,255,0.8)', margin:0 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Features */}
      <div style={{ padding:'48px' }}>
        <div style={{ marginBottom:'32px' }}>
          <span style={{
            display:'inline-block', background:'#F4F6DC', color:'#6B7A00',
            fontSize:'11px', fontWeight:'700', padding:'4px 12px',
            borderRadius:'20px', letterSpacing:'0.06em', marginBottom:'10px',
          }}>
            PLATFORM FEATURES
          </span>
          <h2 style={{ fontSize:'26px', fontWeight:'800', color:'#1A1A2E', margin:'0 0 8px' }}>
            Everything you need
          </h2>
          <p style={{ fontSize:'14px', color:'#6B6B80', margin:0 }}>
            Tools built specifically for your role.
          </p>
        </div>

        <div style={{
          display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:'16px',
        }}>
          {visible.map((f,i) => (
            <Link key={i} to={f.link} style={{ textDecoration:'none' }}>
              <div style={{
                background:'white', border:'1px solid #E2E4D0',
                borderRadius:'16px', padding:'24px',
                transition:'all 0.2s', cursor:'pointer',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#8B9D00';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(139,157,0,0.1)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#E2E4D0';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  width:'44px', height:'44px', borderRadius:'12px', background:'#F4F6DC',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:'20px', marginBottom:'14px',
                }}>{f.icon}</div>
                <h3 style={{ fontSize:'14px', fontWeight:'700', color:'#1A1A2E', margin:'0 0 6px' }}>
                  {f.title}
                </h3>
                <p style={{ fontSize:'13px', color:'#6B6B80', lineHeight:'1.6', margin:0 }}>
                  {f.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{
        background:'linear-gradient(135deg,#2A2168,#3B2F8F)',
        margin:'0 48px 48px', borderRadius:'20px', padding:'40px',
        display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'20px',
      }}>
        <div>
          <h2 style={{ fontSize:'22px', fontWeight:'800', color:'white', margin:'0 0 6px' }}>
            Ready to improve clinical accuracy?
          </h2>
          <p style={{ color:'rgba(255,255,255,0.7)', margin:0, fontSize:'14px' }}>
            Safer, faster dosage decisions for every patient.
          </p>
        </div>
        <Link to={role === 'owner' ? '/owner' : '/calculator'} style={{
          background:'#8B9D00', color:'white', textDecoration:'none',
          padding:'12px 28px', borderRadius:'10px', fontSize:'14px', fontWeight:'700',
          whiteSpace:'nowrap', display:'inline-block',
        }}>
          {role === 'owner' ? "View My Pet's Plan" : 'Go to Calculator →'}
        </Link>
      </div>

      {/* Footer */}
      <footer style={{
        borderTop:'1px solid #E2E4D0', padding:'20px 48px',
        display:'flex', justifyContent:'space-between', alignItems:'center',
        flexWrap:'wrap', gap:'10px', background:'white',
      }}>
        <p style={{ fontSize:'12px', color:'#6B6B80', margin:0 }}>
          © 2026 VetDoze · Mendez, Menguez, Yosores
        </p>
        <p style={{ fontSize:'12px', color:'#8B9D00', fontWeight:'700', margin:0 }}>
          Powered by Plumb's Veterinary Drug Handbook
        </p>
      </footer>
    </div>
  );
}