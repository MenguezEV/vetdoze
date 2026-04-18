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
      <div className="flex gap-4 text-sm font-medium">
        <Link to="/calculator" className="hover:text-teal-200">Calculator</Link>
        <Link to="/drugs" className="hover:text-teal-200">Drug Info</Link>
        {user?.role === 'student' && <Link to="/student" className="hover:text-teal-200">Practice</Link>}
        {user?.role === 'owner'   && <Link to="/owner"   className="hover:text-teal-200">My Pet's Plan</Link>}
        {user
          ? <button onClick={logout} className="hover:text-teal-200">Logout ({user.name})</button>
          : <Link to="/login" className="hover:text-teal-200">Login</Link>
        }
      </div>
    </nav>
  );
}