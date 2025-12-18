import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { login } from '../services/authService';
import '../styles/theme.css';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login: loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await login({ email, password });
      loginUser(response);
      
      // Redirect based on user role
      if (response.user && response.user.role === 'student') {
        navigate('/student/dashboard');
      } else if (response.user && response.user.role === 'manager') {
        navigate('/manager/dashboard');
      } else if (response.user && response.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        // Default redirect if role is not specified
        navigate('/student/dashboard');
      }
    } catch (err) {
      // Handle error properly
      if (err && typeof err === 'object' && err.message) {
        setError(err.message);
      } else if (typeof err === 'string') {
        setError(err);
      } else {
        setError('Failed to login. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="text-center mb-4">
          <div className="mx-auto" style={{ width: '80px', height: '80px' }}>
            <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              {/* Building base */}
              <rect x="20" y="40" width="60" height="50" fill="var(--primary-color)" rx="2" />
              
              {/* Building windows */}
              <rect x="25" y="45" width="15" height="15" fill="white" rx="1" />
              <rect x="45" y="45" width="15" height="15" fill="white" rx="1" />
              <rect x="65" y="45" width="15" height="15" fill="white" rx="1" />
              
              <rect x="25" y="65" width="15" height="15" fill="white" rx="1" />
              <rect x="45" y="65" width="15" height="15" fill="white" rx="1" />
              <rect x="65" y="65" width="15" height="15" fill="white" rx="1" />
              
              {/* Building roof */}
              <polygon points="15,40 85,40 50,15" fill="var(--secondary-color)" />
              
              {/* Exclamation mark */}
              <rect x="48" y="30" width="4" height="15" fill="var(--accent-color)" rx="2" />
              <circle cx="50" cy="50" r="3" fill="var(--accent-color)" />
            </svg>
          </div>
          <h1 className="mt-3" style={{ color: 'var(--primary-color)', fontWeight: '600' }}>Campus Care</h1>
        </div>
        <h2 className="text-center">Welcome Back</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary w-100">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-center mt-3">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;