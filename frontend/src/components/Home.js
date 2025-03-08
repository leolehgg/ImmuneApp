import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import axios from '../api/axios';
import '../css/Home.css'; // Nueva ruta del CSS

const Home = () => {
    const { auth, setAuth } = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const [lastLogin, setLastLogin] = useState(null);

    useEffect(() => {
        const storedLastLogin = localStorage.getItem('lastLogin');
        if (!storedLastLogin) {
            const now = new Date().toLocaleString();
            localStorage.setItem('lastLogin', now);
            setLastLogin(now);
        } else {
            setLastLogin(storedLastLogin);
        }
    }, []);

    const logout = async () => {
        try {
            await axios.post('/auth/logout', {}, {
                headers: { 'Authorization': `Bearer ${auth.accessToken}` }
            });
        } catch (err) {
            console.error('Logout request failed, but proceeding with client-side cleanup:', err);
        }
        setAuth({ email: '', accessToken: '', refreshToken: '', role: '' });
        localStorage.removeItem('auth');
        navigate('/login');
    };

    return (
        <section className="home-section">
            <div className="welcome-card">
                <h1>Welcome, {auth.email}!</h1>
                <p className="role">Your role: <span>{auth.role}</span></p>
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
                    <button onClick={logout} className="logout-btn">Logout</button>
                </div>
            </div>

            <div className="info-card">
                <h2>Account Info</h2>
                <p>Email: {auth.email}</p>
                <p>Last Login: {lastLogin || 'Loading...'}</p>
            </div>
        </section>
    );
};

export default Home;