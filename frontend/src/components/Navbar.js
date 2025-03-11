import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useAuth from '../hooks/useAuth';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import '../css/Navbar.css';

// Importa la imagen (ajusta la ruta según donde la coloques)
import universityIcon from '../assets/images/immune_logo.png';

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
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <img src={universityIcon} alt="UniversityApp Logo" className="navbar-logo" />
        </Link>
        <div className="navbar-menu">
          {auth.accessToken ? (
            <div className="navbar-user-menu">
              <span className="navbar-user-info">
                {auth.email.split('@')[0]} ({auth.role})
              </span>
              <button className="navbar-hamburger-btn" onClick={toggleDropdown}>
                ☰
              </button>
              {isDropdownOpen && (
                <ul className="navbar-dropdown-menu">
                  <li>
                    <Link to="/profile" onClick={toggleDropdown}>Profile</Link>
                  </li>
                  <li>
                    <button
                      className="navbar-logout-btn"
                      onClick={() => { handleLogout(); toggleDropdown(); }}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              )}
            </div>
          ) : (
            <Link to="/login" className="navbar-login-link">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;