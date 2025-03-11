import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import '../css/Sidebar.css';

const Sidebar = () => {
  const { auth } = useAuth();

  return (
    <aside className="sidebar-container">
      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          {(auth.role === 'ADMIN' || auth.role === 'PROFESOR') && (
            <li>
              <Link to="/students">Manage Students</Link>
            </li>
          )}
          {auth.role === 'ADMIN' && (
            <li>
              <Link to="/professors">Manage Professors</Link>
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