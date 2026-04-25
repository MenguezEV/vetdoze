import { Link, useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/',           label: 'Home',           icon: '', roles: ['vet','student','owner'] },
  { path: '/calculator', label: 'Calculator',     icon: '', roles: ['vet','student'] },
  { path: '/drugs',      label: 'Drug Info',      icon: '', roles: ['vet','student','owner'] },
  { path: '/treatment',  label: 'Treatment Plans',icon: '', roles: ['vet'] },
  { path: '/student',    label: 'Practice Mode',  icon: '', roles: ['student'] },
  { path: '/owner',      label: "My Pet's Plan",  icon: '', roles: ['owner'] },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user     = JSON.parse(localStorage.getItem('vetdoze_user') || 'null');
  const role     = user?.role || 'owner';

  const logout = () => {
    localStorage.removeItem('vetdoze_token');
    localStorage.removeItem('vetdoze_user');
    navigate('/login');
  };

  const visible = navItems.filter(item => item.roles.includes(role));
  const isActive = (path) => path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <aside style={{
      width:'240px', minWidth:'240px', height:'100vh', position:'sticky', top:0,
      background:'white', borderRight:'1px solid #E2E4D0',
      display:'flex', flexDirection:'column', overflow:'hidden',
    }}>

      {/* Logo */}
      <div style={{ padding:'22px 20px 18px', borderBottom:'1px solid #E2E4D0' }}>
        <Link to="/" style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:'10px' }}>
          <div style={{
            width:'36px', height:'36px', borderRadius:'10px',
            background:'linear-gradient(135deg,#3B2F8F,#5A4DB8)',
            display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px',
          }}>🐾</div>
          <span style={{
            fontSize:'20px', fontWeight:'800', color:'#8B9D00',
            fontFamily:"'Plus Jakarta Sans',sans-serif", letterSpacing:'-0.02em',
          }}>vetdoze</span>
        </Link>
      </div>

      {/* User info */}
      {user && (
        <div style={{
          padding:'14px 20px', borderBottom:'1px solid #E2E4D0',
          display:'flex', alignItems:'center', gap:'10px',
        }}>
          <div style={{
            width:'36px', height:'36px', borderRadius:'50%',
            background:'#F4F6DC', border:'2px solid #8B9D00',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:'13px', fontWeight:'800', color:'#6B7A00', flexShrink:0,
          }}>
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div style={{ overflow:'hidden', flex:1 }}>
            <p style={{ fontSize:'13px', fontWeight:'700', color:'#1A1A2E', margin:0,
              whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
              {user.name}
            </p>
            <span style={{
              fontSize:'10px', fontWeight:'700', color:'#6B7A00',
              background:'#F4F6DC', padding:'1px 8px', borderRadius:'10px',
              textTransform:'capitalize', display:'inline-block', marginTop:'2px',
            }}>
              {user.role}
            </span>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav style={{ flex:1, padding:'10px', overflowY:'auto' }}>
        <p style={{
          fontSize:'10px', fontWeight:'700', color:'#B0B0C0',
          textTransform:'uppercase', letterSpacing:'0.1em',
          padding:'6px 10px 4px', margin:'0 0 4px',
        }}>Menu</p>

        {visible.map(item => {
          const active = isActive(item.path);
          return (
            <Link key={item.path} to={item.path} style={{
              display:'flex', alignItems:'center', gap:'10px',
              padding:'9px 10px', borderRadius:'10px', textDecoration:'none',
              marginBottom:'2px',
              background: active ? '#F4F6DC' : 'transparent',
              border: active ? '1px solid #C8D800' : '1px solid transparent',
              transition:'all 0.15s',
            }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#F7F8F3'; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
            >
              <span style={{
                width:'30px', height:'30px', borderRadius:'8px',
                background: active ? '#8B9D00' : '#F0F1EA',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:'14px', flexShrink:0, transition:'background 0.15s',
              }}>{item.icon}</span>
              <span style={{
                fontSize:'13px', fontWeight: active ? '700' : '500',
                color: active ? '#5A6600' : '#4A4A5A',
              }}>{item.label}</span>
              {active && (
                <div style={{ marginLeft:'auto', width:'6px', height:'6px',
                  borderRadius:'50%', background:'#8B9D00' }}/>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding:'10px', borderTop:'1px solid #E2E4D0' }}>
        {user ? (
          <button onClick={logout} style={{
            width:'100%', display:'flex', alignItems:'center', gap:'10px',
            padding:'9px 10px', borderRadius:'10px', cursor:'pointer',
            background:'transparent', border:'1px solid #E2E4D0',
            transition:'all 0.15s', fontFamily:'inherit',
          }}
            onMouseEnter={e => { e.currentTarget.style.background='#FCEBEB'; e.currentTarget.style.borderColor='#F7C1C1'; }}
            onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='#E2E4D0'; }}
          >
            <span style={{
              width:'30px', height:'30px', borderRadius:'8px', background:'#F7F8F3',
              display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px',
            }}>🚪</span>
            <span style={{ fontSize:'13px', fontWeight:'600', color:'#A32D2D' }}>Logout</span>
          </button>
        ) : (
          <Link to="/login" style={{
            display:'flex', alignItems:'center', gap:'10px',
            padding:'9px 10px', borderRadius:'10px', background:'#8B9D00', textDecoration:'none',
          }}>
            <span style={{
              width:'30px', height:'30px', borderRadius:'8px',
              background:'rgba(255,255,255,0.2)',
              display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px',
            }}>🔑</span>
            <span style={{ fontSize:'13px', fontWeight:'700', color:'white' }}>Login / Register</span>
          </Link>
        )}
      </div>
    </aside>
  );
}