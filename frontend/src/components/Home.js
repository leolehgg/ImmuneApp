import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import '../css/Home.css';

const Home = () => {
  const { auth, setAuth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const [lastLogin, setLastLogin] = useState(null);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const storedLastLogin = localStorage.getItem('lastLogin');
    if (!storedLastLogin) {
      const now = new Date().toLocaleString();
      localStorage.setItem('lastLogin', now);
      setLastLogin(now);
    } else {
      setLastLogin(storedLastLogin);
    }
    fetchClasses();
  }, [axiosPrivate]);

  const fetchClasses = async () => {
    try {
      const response = await axiosPrivate.get('/classes');
      setClasses(response.data);
    } catch (err) {
      console.error('Failed to fetch classes:', err);
    }
  };

  const logout = async () => {
    try {
      await axiosPrivate.post('/auth/logout', {}, {
        headers: { 'Authorization': `Bearer ${auth.accessToken}` }
      });
    } catch (err) {
      console.error('Logout request failed:', err);
    }
    setAuth({ email: '', accessToken: '', refreshToken: '', role: '' });
    localStorage.removeItem('auth');
    navigate('/login');
  };

  return (
    <section className="home-container">
      <div className="main-column">
        <div className="welcome-card">
          <h1>Welcome, {auth.email.split('@')[0]}!</h1>
          <p className="role">Role: {auth.role}</p>
        </div>

        <div className="actions-card">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <Link to="/profile" className="action-link">
              <button>My Profile</button>
            </Link>
            {auth.role === 'ADMIN' && (
              <Link to="/users" className="action-link">
                <button>Manage Users</button>
              </Link>
            )}
            {(auth.role === 'ADMIN' || auth.role === 'PROFESOR') && (
              <Link to="/classes" className="action-link">
                <button>Manage Classes</button>
              </Link>
            )}
            <button onClick={logout} className="logout-btn">Logout</button>
          </div>
        </div>

        {(auth.role === 'PROFESOR' || auth.role === 'ALUMNO') && classes.length > 0 && (
          <div className="classes-card">
            <h2>Your Classes</h2>
            <ul>
              {classes.map(cls => (
                <li key={cls.id}>{cls.name} ({cls.code})</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="side-column">
        <div className="info-card">
          <h3>Account Info</h3>
          <p>Email: {auth.email}</p>
          <p>Last Login: {lastLogin || 'Loading...'}</p>
        </div>
      </div>
    </section>
  );
};

export default Home;