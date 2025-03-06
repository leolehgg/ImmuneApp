import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import axios from '../api/axios';

const Home = () => {
    const { auth, setAuth } = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const [protectedData, setProtectedData] = useState('');

    const fetchProtectedData = async () => {
        try {
            const response = await axiosPrivate.get('/api/protected');
            setProtectedData(response.data);
        } catch (err) {
            console.error(err);
            setProtectedData('Failed to fetch protected data');
        }
    };

    const logout = async () => {
        try {
            await axios.post('/auth/logout', {}, {
                headers: { 'Authorization': `Bearer ${auth.accessToken}` }
            });
        } catch (err) {
            console.error(err);
        }
        setAuth({ email: '', accessToken: '', refreshToken: '', role: '' });
        navigate('/login');
    };

    return (
        <section>
            <h1>Home</h1>
            <p>Welcome, {auth.email}! (Role: {auth.role})</p>
            <button onClick={fetchProtectedData}>Get Protected Data</button>
            {protectedData && <p>{protectedData}</p>}
            <Link to="/users">View Users</Link>
            <br />
            <button onClick={logout}>Logout</button>
        </section>
    );
};

export default Home;