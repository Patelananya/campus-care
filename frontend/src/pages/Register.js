import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerStudent } from '../services/authService';
import '../styles/theme.css';
import './Register.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await registerStudent({ name, email, password });
      setSuccess(true);
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-form">
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
        <h2 className="text-center">Student Registration</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">Registration successful! Redirecting to login...</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name:</label>
            <input
              type="text"
              id="name"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary w-100">
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="text-center mt-3">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;