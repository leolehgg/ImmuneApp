// src/components/Sidebar.js
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import '../css/Sidebar.css';

const Sidebar = () => {
    const { auth } = useAuth();

    return (
        <aside className="sidebar">
            <nav className="sidebar-nav">
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    {auth.role === 'ADMIN' && (
                        <li>
                            <Link to="/users">Manage Users</Link>
                        </li>
                    )}
                    {(auth.role === 'ADMIN' || auth.role === 'PROFESOR') && (
                        <li>
                            <Link to="/classes">Manage Classes</Link>
                        </li>
                    )}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;