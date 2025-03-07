import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import UserManagement from './components/UserManagement';
import Unauthorized from './components/Unauthorized';
import RequireAuth from './components/RequireAuth';
import Navbar from './components/Navbar';
import './styles.css';

function App() {
    return (
        <AuthProvider>
            <Navbar />
            <main>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route element={<RequireAuth allowedRoles={['USER', 'ADMIN']} />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/users" element={<UserManagement />} />
                        <Route path="/unauthorized" element={<Unauthorized />} />
                    </Route>
                </Routes>
            </main>
        </AuthProvider>
    );
}

export default App;