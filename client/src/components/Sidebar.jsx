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

  const visible  = navItems.filter(item => item.roles.includes(role));
  const isActive = (path) => path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <aside style={{
      width: '240px', minWidth: '240px', height: '100vh',
      position: 'sticky', top: 0,
      background: 'white', borderRight: '1px solid #E2E4D0',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>

      {/* ─── Logo ─── */}
      <div style={{
        padding: '18px 20px 16px',
        borderBottom: '1px solid #E2E4D0',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'white',
      }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Text logo image — yellow VETDOZE wordmark */}
          <img
            src="/logo-text.png"
            alt="VETDOZE"
            style={{
              height: '36px',
              width: 'auto',
              objectFit: 'contain',
            }}
            onError={e => {
              // Fallback: render text if image not found
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          {/* Fallback text logo (hidden unless image fails) */}
          <span style={{
            display: 'none',
            fontSize: '22px', fontWeight: '900', color: '#F5C300',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            letterSpacing: '0.04em',
          }}>
            VETDOZE
          </span>
        </Link>
      </div>

      {/* ─── User info ─── */}
      {user && (
        <div style={{
          padding: '14px 20px', borderBottom: '1px solid #E2E4D0',
          display: 'flex', alignItems: 'center', gap: '10px',
        }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: '#FFF8D6', border: '2px solid #F5C300',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '13px', fontWeight: '800', color: '#C49A00', flexShrink: 0,
          }}>
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <p style={{
              fontSize: '13px', fontWeight: '700', color: '#1A1A2E', margin: 0,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {user.name}
            </p>
            <span style={{
              fontSize: '10px', fontWeight: '700', color: '#C49A00',
              background: '#FFF8D6', padding: '1px 8px', borderRadius: '10px',
              textTransform: 'capitalize', display: 'inline-block', marginTop: '2px',
            }}>
              {user.role}
            </span>
          </div>
        </div>
      )}

      {/* ─── Nav links ─── */}
      <nav style={{ flex: 1, padding: '10px', overflowY: 'auto' }}>
        <p style={{
          fontSize: '10px', fontWeight: '700', color: '#B0B0C0',
          textTransform: 'uppercase', letterSpacing: '0.1em',
          padding: '6px 10px 4px', margin: '0 0 4px',
        }}>Menu</p>

        {visible.map(item => {
          const active = isActive(item.path);
          return (
            <Link key={item.path} to={item.path} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '9px 10px', borderRadius: '10px', textDecoration: 'none',
              marginBottom: '2px',
              background: active ? '#FFF8D6' : 'transparent',
              border: active ? '1px solid #F5C300' : '1px solid transparent',
              transition: 'all 0.15s',
            }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#F7F8F3'; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
            >
              <span style={{
                width: '30px', height: '30px', borderRadius: '8px',
                background: active ? '#F5C300' : '#F0F1EA',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '14px', flexShrink: 0, transition: 'background 0.15s',
              }}>
                {item.icon}
              </span>
              <span style={{
                fontSize: '13px',
                fontWeight: active ? '700' : '500',
                color: active ? '#8A6A00' : '#4A4A5A',
              }}>
                {item.label}
              </span>
              {active && (
                <div style={{
                  marginLeft: 'auto', width: '6px', height: '6px',
                  borderRadius: '50%', background: '#F5C300',
                }}/>
              )}
            </Link>
          );
        })}
      </nav>

      {/* ─── Logout / Login ─── */}
      <div style={{ padding: '10px', borderTop: '1px solid #E2E4D0' }}>
        {user ? (
          <button onClick={logout} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
            padding: '9px 10px', borderRadius: '10px', cursor: 'pointer',
            background: 'transparent', border: '1px solid #E2E4D0',
            transition: 'all 0.15s', fontFamily: 'inherit',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = '#FCEBEB'; e.currentTarget.style.borderColor = '#F7C1C1'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#E2E4D0'; }}
          >
            <span style={{
              width: '30px', height: '30px', borderRadius: '8px', background: '#F7F8F3',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px',
            }}>🚪</span>
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#A32D2D' }}>Logout</span>
          </button>
        ) : (
          <Link to="/login" style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '9px 10px', borderRadius: '10px',
            background: '#F5C300', textDecoration: 'none', transition: 'background 0.15s',
          }}>
            <span style={{
              width: '30px', height: '30px', borderRadius: '8px',
              background: 'rgba(255,255,255,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px',
            }}>🔑</span>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#5A4000' }}>
              Login / Register
            </span>
          </Link>
        )}
      </div>
    </aside>
  );
}