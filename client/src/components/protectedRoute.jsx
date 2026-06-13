import { Navigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function protectedRoute({ children }) {
  const { username } = useParams();
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get logged-in user
    const verifyAuth = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/auth/me', {
          method: 'GET',
          credentials: 'include',
        });

        if (res.ok) {
          const data = await res.json();
          setAuthUser(data.user);
        } else {
          setAuthUser(null);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setAuthUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  if (loading) {
    return (
      <div style={{
        minHeight: '100dvh',
        background: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#e5e5e5',
        fontFamily: "'Geist Mono', monospace"
      }}>
        verifying...
      </div>
    );
  }

  // Not logged in
  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but trying to access different user's page
  if (authUser.username !== username) {
    return (
      <div style={{
        minHeight: '100dvh',
        background: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#e5e5e5',
        fontFamily: "'Geist Mono', monospace",
        textAlign: 'center'
      }}>
        <div>
          <p style={{ marginBottom: '16px' }}>unauthorized access</p>
          <a
            href={`/${authUser.username}`}
            style={{
              color: '#fafafa',
              textDecoration: 'underline',
              fontSize: '12px'
            }}
          >
            go to your dashboard
          </a>
        </div>
      </div>
    );
  }

  // Logged in as correct user - show dashboard
  return children;
}