import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Navbar = () => {
    const { auth, setAuth } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        setAuth({ email: '', accessToken: '', refreshToken: '', role: '' });
        localStorage.removeItem('auth');
        navigate('/login');
    };

    return (
        <nav>
            <div className="container">
                <Link to="/">ImmuneApp</Link>
                <div>
                    {auth.accessToken ? (
                        <>
                            <Link to="/">Home</Link>
                            <Link to="/profile">Profile</Link> {/* Nuevo enlace */}
                            {auth.role === 'ADMIN' && (
                                <Link to="/users">Users</Link>
                            )}
                            <button onClick={handleLogout}>Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/register">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;