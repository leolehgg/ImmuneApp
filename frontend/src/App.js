import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import Home from './components/Home';
import Profile from './components/Profile';
import UserManagement from './components/UserManagement';
import ClassManagement from './components/ClassManagement';
import Unauthorized from './components/Unauthorized';
import RequireAuth from './components/RequireAuth';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import './css/Global.css';

function App() {
  return (
    <AuthProvider>
      <div className="app-container">
        <Navbar />
        <div className="main-layout">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<RequireAuth allowedRoles={['ADMIN', 'PROFESOR', 'ALUMNO']} />}>
              <Route
                path="*"
                element={
                  <>
                    <Sidebar />
                    <main className="main-content">
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route element={<RequireAuth allowedRoles={['ADMIN']} />}>
                          <Route path="/users" element={<UserManagement />} />
                        </Route>
                        <Route element={<RequireAuth allowedRoles={['ADMIN', 'PROFESOR']} />}>
                          <Route path="/classes" element={<ClassManagement />} />
                        </Route>
                        <Route path="/unauthorized" element={<Unauthorized />} />
                      </Routes>
                    </main>
                  </>
                }
              />
            </Route>
          </Routes>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;