import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('vetdoze_user') || 'null');

  const logout = () => {
    localStorage.removeItem('vetdoze_token');
    localStorage.removeItem('vetdoze_user');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navLink = (to, label) => (
    <Link
      to={to}
      style={{
        fontSize: '14px',
        fontWeight: isActive(to) ? '600' : '500',
        color: isActive(to) ? '#8B9D00' : '#4A4A5A',
        textDecoration: 'none',
        padding: '6px 12px',
        borderRadius: '8px',
        background: isActive(to) ? '#F4F6DC' : 'transparent',
        transition: 'all 0.2s',
      }}
    >
      {label}
    </Link>
  );

  return (
    <nav style={{
      background: 'white',
      borderBottom: '1px solid #E2E4D0',
      padding: '0 32px',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      {/* Logo */}
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <svg width="120" height="32" viewBox="0 0 120 32" fill="none">
          <text
            x="0" y="26"
            fontFamily="'Plus Jakarta Sans', sans-serif"
            fontWeight="700"
            fontSize="26"
            fill="#8B9D00"
          >
            vetd
          </text>
          <circle cx="72" cy="16" r="11" fill="#8B9D00"/>
          <text x="67" y="21" fontFamily="sans-serif" fontSize="12" fill="white">⚕</text>
          <text
            x="84" y="26"
            fontFamily="'Plus Jakarta Sans', sans-serif"
            fontWeight="700"
            fontSize="26"
            fill="#8B9D00"
          >
            ze
          </text>
        </svg>
      </Link>

      {/* Nav links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {navLink('/calculator', 'Calculator')}
        {navLink('/drugs', 'Drug Info')}
        {user?.role === 'vet'     && navLink('/treatment', 'Treatment Plans')}
        {user?.role === 'student' && navLink('/student',   'Practice Mode')}
        {user?.role === 'owner'   && navLink('/owner',     "My Pet's Plan")}
      </div>

      {/* Auth area */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {user ? (
          <>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '13px', fontWeight: '600', color: '#1A1A2E', margin: 0 }}>
                {user.name}
              </p>
              <p style={{ fontSize: '11px', color: '#8B9D00', margin: 0, textTransform: 'capitalize' }}>
                {user.role}
              </p>
            </div>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: '#F4F6DC', border: '2px solid #8B9D00',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '13px', fontWeight: '700', color: '#6B7A00'
            }}>
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <button onClick={logout} style={{
              background: 'transparent', border: '1.5px solid #E2E4D0',
              borderRadius: '8px', padding: '7px 16px',
              fontSize: '13px', fontWeight: '600', color: '#6B6B80',
              cursor: 'pointer', transition: 'all 0.2s'
            }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{
              fontSize: '14px', fontWeight: '600', color: '#4A4A5A',
              textDecoration: 'none', padding: '8px 16px',
            }}>
              Login
            </Link>
            <Link to="/register" style={{
              background: '#8B9D00', color: 'white', textDecoration: 'none',
              padding: '8px 18px', borderRadius: '8px',
              fontSize: '14px', fontWeight: '600', transition: 'background 0.2s'
            }}>
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}