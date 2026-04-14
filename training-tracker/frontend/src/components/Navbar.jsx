import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const adminData = localStorage.getItem('admin');
    if (adminData) {
      setAdmin(JSON.parse(adminData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    setAdmin(null);
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.5 1.5H3a1.5 1.5 0 00-1.5 1.5v12a1.5 1.5 0 001.5 1.5h14a1.5 1.5 0 001.5-1.5V8.5m-6-7v7m0 0l-3-3m3 3l3-3M4.5 11.5h11" />
              </svg>
            </div>
            <Link to="/" className="text-2xl font-bold text-white">
              TrainHub
            </Link>
          </div>
          <div className="flex space-x-1">
            <NavLink to="/" label="Dashboard" />
            <NavLink to="/placed" label="Placements" />
            <NavLink to="/certificates" label="Certificates" />
            {admin && (
              <NavLink to="/admin" label="🔧 Admin" />
            )}
          </div>
          <div className="flex items-center space-x-4">
            {admin ? (
              <div className="flex items-center space-x-3">
                <span className="text-white text-sm">👤 {admin.username}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-all"
                >
                  🚪 Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-all"
              >
                🔓 Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ to, label }) {
  return (
    <Link
      to={to}
      className="text-white hover:bg-blue-500 px-4 py-2 rounded-lg transition-all duration-200 font-medium"
    >
      {label}
    </Link>
  );
}