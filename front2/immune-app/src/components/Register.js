import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import axios from '../api/axios';

const Register = () => {
    const { setAuth } = useAuth();
    const navigate = useNavigate();
    const nameRef = useRef();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        nameRef.current.focus();
    }, []);

    useEffect(() => {
        setErrMsg('');
    }, [name, email, password]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/auth/register',
                { name, email, password },
                { headers: { 'Content-Type': 'application/json' } }
            );
            const accessToken = response.data.access_token;
            const refreshToken = response.data.refresh_token;
            const role = response.data.role;
            setAuth({ email, accessToken, refreshToken, role });
            setName('');
            setEmail('');
            setPassword('');
            navigate('/');
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Invalid Data');
            } else {
                setErrMsg('Registration Failed');
            }
        }
    };

    return (
        <section>
            <h1>Register</h1>
            {errMsg && <p className="error">{errMsg}</p>}
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Name:</label>
                <input
                    type="text"
                    id="name"
                    ref={nameRef}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Register</button>
            </form>
            <p>
                Already have an account? <Link to="/login">Login</Link>
            </p>
        </section>
    );
};

export default Register;