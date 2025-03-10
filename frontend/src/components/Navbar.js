import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useAuth from '../hooks/useAuth';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import '../css/Navbar.css';

const Navbar = () => {
  const { auth, setAuth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await axiosPrivate.post('/auth/logout', {}, {
        headers: { 'Authorization': `Bearer ${auth.accessToken}` }
      });
    } catch (err) {
      console.error('Logout failed on server:', err);
    }
    setAuth({ email: '', accessToken: '', refreshToken: '', role: '' });
    localStorage.removeItem('auth');
    navigate('/login');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="navbar-header">
      <div className="container">
        <Link to="/" className="navbar-brand">ImmuneApp</Link>
        <div className="navbar-menu">
          {auth.accessToken ? (
            <div className="user-menu">
              <span className="user-info">
                {auth.email.split('@')[0]} ({auth.role})
              </span>
              <button className="hamburger-btn" onClick={toggleDropdown}>
                ☰
              </button>
              {isDropdownOpen && (
                <ul className="dropdown-menu">
                  <li>
                    <Link to="/profile" onClick={toggleDropdown}>Profile</Link>
                  </li>
                  <li>
                    <button
                      className="logout-btn"
                      onClick={() => { handleLogout(); toggleDropdown(); }}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              )}
            </div>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;