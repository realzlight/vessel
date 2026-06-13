import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Auth.css';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Important: send cookies
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'login failed');
        setLoading(false);
        return;
      }

      const data = await res.json();
      
      // Wait a bit for cookie to be set, then verify
      await new Promise(resolve => setTimeout(resolve, 100));

      // Verify user is logged in before navigating
      const verifyRes = await fetch('http://localhost:5000/api/auth/me', {
        method: 'GET',
        credentials: 'include'
      });

      if (verifyRes.ok) {
        const userData = await verifyRes.json();
        navigate(`/${userData.user.username}`);
      } else {
        setError('verification failed');
        setLoading(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('something went wrong');
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">vessel</div>

        <div className="auth-header">
          <h1 className="auth-title">welcome back</h1>
          <p className="auth-sub">sign in to your account</p>
        </div>

        {error && (
          <div style={{
            padding: '10px 12px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius)',
            fontSize: '12px',
            color: '#fca5a5'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field">
            <label>email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          <div className="field">
            <label>password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'signing in...' : 'sign in'}
          </button>
        </form>

        <div className="auth-switch">
          don't have an account?{' '}
          <a href="/signup">create one</a>
        </div>
      </div>
    </div>
  );
}