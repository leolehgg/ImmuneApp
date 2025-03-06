import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Users from './components/Users';
import Unauthorized from './components/Unauthorized';
import RequireAuth from './components/RequireAuth';

function App() {
    return (
        <AuthProvider>
            <Routes>
                {/* Rutas públicas */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                {/* Rutas protegidas */}
                <Route element={<RequireAuth allowedRoles={['USER', 'ADMIN']} />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/unauthorized" element={<Unauthorized />} />
                </Route>
            </Routes>
        </AuthProvider>
    );
}

export default App;