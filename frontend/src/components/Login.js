import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import axios from '../api/axios';
import '../css/Login.css';

// Importa la imagen (ajusta la ruta según donde la coloques)
import universityIcon from '../assets/images/immune_logo.png';

const Login = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const emailRef = useRef();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg('');
  }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/auth/login',
        { email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );
      const accessToken = response.data.access_token;
      const refreshToken = response.data.refresh_token;
      const role = response.data.role;
      setAuth({ email, accessToken, refreshToken, role });
      setEmail('');
      setPassword('');
      navigate('/');
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized');
      } else {
        setErrMsg('Login Failed');
      }
    }
  };

  return (
    <div className="login-wrapper">
      <section className="login-card">
        <div className="login-header">
          <img src={universityIcon} alt="University Icon" className="login-icon" />
        </div>
        {errMsg && <p className="login-error">{errMsg}</p>}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-form-group">
            <label htmlFor="login-email">Email Address</label>
            <input
              type="email"
              id="login-email"
              ref={emailRef}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="login-form-group">
            <label htmlFor="login-password">Password</label>
            <input
              type="password"
              id="login-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="login-button">Sign In</button>
        </form>
      </section>
    </div>
  );
};

export default Login;