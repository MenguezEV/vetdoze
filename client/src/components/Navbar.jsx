import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('vetdoze_user') || 'null');

  const logout = () => {
    localStorage.removeItem('vetdoze_token');
    localStorage.removeItem('vetdoze_user');
    navigate('/login');
  };

  return (
    <nav className="bg-teal-700 text-white px-6 py-3 flex items-center justify-between shadow">
      <Link to="/" className="text-xl font-bold tracking-wide">🐾 VetDoze</Link>
      <div className="flex gap-4 text-sm font-medium items-center">
        <Link to="/calculator" className="hover:text-teal-200">Calculator</Link>
        <Link to="/drugs" className="hover:text-teal-200">Drug Info</Link>

        {/* Vet only */}
        {user?.role === 'vet' && (
          <Link to="/treatment" className="hover:text-teal-200">Treatment Plans</Link>
        )}

        {/* Student only */}
        {user?.role === 'student' && (
          <Link to="/student" className="hover:text-teal-200">Practice Mode</Link>
        )}

        {/* Owner only */}
        {user?.role === 'owner' && (
          <Link to="/owner" className="hover:text-teal-200">My Pet's Plan</Link>
        )}

        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-teal-200 text-xs bg-teal-800 px-2 py-1 rounded-full capitalize">
              {user.role}
            </span>
            <span className="text-teal-100">{user.name}</span>
            <button onClick={logout}
              className="bg-teal-800 hover:bg-teal-900 px-3 py-1 rounded-lg text-xs transition">
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" className="bg-white text-teal-700 px-3 py-1 rounded-lg font-semibold hover:bg-teal-50">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}