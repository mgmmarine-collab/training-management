import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [registerData, setRegisterData] = useState({
    username: '',
    password: '',
    email: '',
    confirmPassword: ''
  });

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/auth/login', credentials);
      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('admin', JSON.stringify(response.data.admin));
      
      setMessage('✅ Login successful! Redirecting...');
      setTimeout(() => navigate('/admin'), 1500);
    } catch (error) {
      setMessage('❌ ' + (error.response?.data?.error || 'Login failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (registerData.password !== registerData.confirmPassword) {
      setMessage('❌ Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/register', {
        username: registerData.username,
        password: registerData.password,
        email: registerData.email
      });
      
      setMessage('✅ Registration successful! Please login.');
      setShowRegister(false);
      setRegisterData({ username: '', password: '', email: '', confirmPassword: '' });
      setCredentials({ username: registerData.username, password: registerData.password });
    } catch (error) {
      setMessage('❌ ' + (error.response?.data?.error || 'Registration failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>🔐 TrainHub Admin</h1>
          <p>Training Tracker Management System</p>
        </div>

        {message && (
          <div className={`login-message ${message.includes('✅') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        {!showRegister ? (
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                className="form-input"
                placeholder="Enter your username"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="form-input"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="login-button"
            >
              {loading ? '🔄 Logging in...' : '🔓 Login'}
            </button>

            <div className="login-footer">
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setShowRegister(true)}
                  className="toggle-button"
                >
                  Register here
                </button>
              </p>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="login-form">
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                type="text"
                value={registerData.username}
                onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                className="form-input"
                placeholder="Choose a username"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                className="form-input"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                value={registerData.password}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                className="form-input"
                placeholder="Create a password"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                value={registerData.confirmPassword}
                onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                className="form-input"
                placeholder="Confirm your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="login-button"
            >
              {loading ? '🔄 Creating account...' : '✅ Register'}
            </button>

            <div className="login-footer">
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setShowRegister(false)}
                  className="toggle-button"
                >
                  Login here
                </button>
              </p>
            </div>
          </form>
        )}

        <div className="login-info">
          <p><strong>Demo Credentials (if set up):</strong></p>
          <p>Username: admin</p>
          <p>Password: admin123</p>
        </div>
      </div>
    </div>
  );
}
