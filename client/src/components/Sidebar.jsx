import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

const navItems = [
  { path: '/',           label: 'Home',           icon: '🏠', roles: ['vet','student','owner'] },
  { path: '/calculator', label: 'Calculator',     icon: '🧮', roles: ['vet'] },
  { path: '/drugs',      label: 'Drug Info',      icon: '💊', roles: ['vet','student','owner'] },
  { path: '/treatment',  label: 'Treatment Plans',icon: '📋', roles: ['vet'] },
  { path: '/student',    label: 'Practice Mode',  icon: '🎓', roles: ['student'] },
  { path: '/owner',      label: "My Pet's Plan",  icon: '🐾', roles: ['owner'] },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user     = JSON.parse(localStorage.getItem('vetdoze_user') || 'null');
  const role     = user?.role || 'owner';
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile]     = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Close drawer on route change
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const logout = () => {
    localStorage.removeItem('vetdoze_token');
    localStorage.removeItem('vetdoze_user');
    navigate('/login');
  };

  const visible  = navItems.filter(item => item.roles.includes(role));
  const isActive = (path) => path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const sidebarContent = (
    <aside style={{
      width: '240px', minWidth: '240px', height: '100vh',
      position: 'sticky', top: 0,
      background: 'white',
      borderRight: '1px solid #ECEEF2',
      boxShadow: '4px 0 24px -4px rgba(0,0,0,0.07)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
    }}>
      {/* ─── Logo ─── */}
      <div style={{
        padding: '18px 20px 16px',
        borderBottom: '1px solid #ECEEF2',
        display: 'flex', alignItems: 'center',
        justifyContent: isMobile ? 'space-between' : 'center',
        background: 'white',
      }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src="/logo-text.png"
            alt="VETDOZE"
            style={{ height: '36px', width: 'auto', objectFit: 'contain' }}
            onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
          />
          <span style={{
            display: 'none', fontSize: '22px', fontWeight: '900', color: '#F5C300',
            fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '0.04em',
          }}>VETDOZE</span>
        </Link>
        {isMobile && (
          <button onClick={() => setMobileOpen(false)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '20px', color: '#6B6B80', padding: '4px',
          }}>✕</button>
        )}
      </div>

      {/* ─── User info ─── */}
      {user && (
        <div style={{
          padding: '14px 20px', borderBottom: '1px solid #ECEEF2',
          display: 'flex', alignItems: 'center', gap: '10px',
        }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: '#FFF8D6', border: '2px solid #F5C300',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '13px', fontWeight: '800', color: '#C49A00', flexShrink: 0,
            boxShadow: '0 2px 8px rgba(245,195,0,0.2)',
          }}>
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <p style={{
              fontSize: '13px', fontWeight: '700', color: '#1A1A2E', margin: 0,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>{user.name}</p>
            <span style={{
              fontSize: '10px', fontWeight: '700', color: '#C49A00',
              background: '#FFF8D6', padding: '1px 8px', borderRadius: '10px',
              textTransform: 'capitalize', display: 'inline-block', marginTop: '2px',
            }}>{user.role}</span>
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
              padding: '9px 10px 9px 8px',
              borderRadius: '10px', textDecoration: 'none',
              marginBottom: '2px',
              background: active ? '#FFF8D6' : 'transparent',
              borderLeft: active ? '3px solid #F5C300' : '3px solid transparent',
              transition: 'all 0.15s ease',
              boxShadow: active ? '0 2px 8px rgba(245,195,0,0.12)' : 'none',
            }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = '#F7F8F3'; e.currentTarget.style.borderLeftColor = '#E2E4D0'; } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderLeftColor = 'transparent'; } }}
            >
              <span style={{
                width: '30px', height: '30px', borderRadius: '8px',
                background: active ? '#F5C300' : '#F0F1EA',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '14px', flexShrink: 0, transition: 'background 0.15s',
                boxShadow: active ? '0 2px 6px rgba(245,195,0,0.3)' : 'none',
              }}>{item.icon}</span>
              <span style={{
                fontSize: '13px',
                fontWeight: active ? '700' : '500',
                color: active ? '#8A6A00' : '#4A4A5A',
                transition: 'color 0.15s',
              }}>{item.label}</span>
              {active && (
                <div style={{
                  marginLeft: 'auto', width: '6px', height: '6px',
                  borderRadius: '50%', background: '#F5C300',
                  boxShadow: '0 0 6px rgba(245,195,0,0.6)',
                }}/>
              )}
            </Link>
          );
        })}
      </nav>

      {/* ─── Logout / Login ─── */}
      <div style={{ padding: '10px', borderTop: '1px solid #ECEEF2' }}>
        {user ? (
          <button onClick={logout} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
            padding: '9px 10px', borderRadius: '10px', cursor: 'pointer',
            background: 'transparent', border: '1px solid #E2E4D0',
            transition: 'all 0.15s', fontFamily: 'inherit',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = '#FCEBEB'; e.currentTarget.style.borderColor = '#F7C1C1'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(163,45,45,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#E2E4D0'; e.currentTarget.style.boxShadow = 'none'; }}
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
            background: '#F5C300', textDecoration: 'none', transition: 'all 0.15s',
            boxShadow: '0 4px 12px rgba(245,195,0,0.3)',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = '#E6B800'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(245,195,0,0.4)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#F5C300'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(245,195,0,0.3)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <span style={{
              width: '30px', height: '30px', borderRadius: '8px',
              background: 'rgba(255,255,255,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px',
            }}>🔑</span>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#5A4000' }}>Login / Register</span>
          </Link>
        )}
      </div>
    </aside>
  );

  if (isMobile) {
    return (
      <>
        {/* Mobile top bar */}
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
          background: 'white', borderBottom: '1px solid #ECEEF2',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 20px', height: '56px',
        }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <img src="/logo-text.png" alt="VETDOZE"
              style={{ height: '28px', width: 'auto', objectFit: 'contain' }}
              onError={e => { e.target.style.display='none'; }}
            />
            <span style={{ fontSize: '18px', fontWeight: '900', color: '#F5C300',
              fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '0.04em' }}>
              VETDOZE
            </span>
          </Link>
          <button onClick={() => setMobileOpen(true)} style={{
            background: 'none', border: '1px solid #E2E4D0', borderRadius: '8px',
            cursor: 'pointer', padding: '6px 10px', fontSize: '18px',
            display: 'flex', alignItems: 'center', gap: '6px',
            color: '#1A1A2E',
          }}>☰</button>
        </div>

        {/* Overlay */}
        {mobileOpen && (
          <div
            onClick={() => setMobileOpen(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 1001,
              background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)',
            }}
          />
        )}

        {/* Drawer */}
        <div style={{
          position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 1002,
          transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
          display: 'flex',
        }}>
          {sidebarContent}
        </div>

        {/* Spacer to push content below top bar */}
        <div style={{ height: '56px', flexShrink: 0 }} />
      </>
    );
  }

  return sidebarContent;
}