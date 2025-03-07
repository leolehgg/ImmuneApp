import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import axios from '../api/axios';

const Home = () => {
    const { auth, setAuth } = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();


    const logout = async () => {
        try {
            await axios.post('/auth/logout', {}, {
                headers: { 'Authorization': `Bearer ${auth.accessToken}` }
            });
        } catch (err) {
            console.error('Logout request failed, but proceeding with client-side cleanup:', err);
        }
        setAuth({ email: '', accessToken: '', refreshToken: '', role: '' });
        localStorage.removeItem('auth'); // Limpiar localStorage
        navigate('/login');
    };

    return (
        <section>
            <h1>Home</h1>
            <p>Welcome, {auth.email}! (Role: {auth.role})</p>
            <Link to="/users">Manage users</Link>
            <br />
            <button onClick={logout}>Logout</button>
        </section>
    );
};

export default Home;