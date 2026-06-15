import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function ProtectedRoute({ children }) {
  const [isAuth, setIsAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('🔍 Checking auth...');
        const res = await fetch('http://localhost:5000/api/auth/me', {
          method: 'GET',
          credentials: 'include',
        });

        console.log('📡 Response status:', res.status);

        if (res.ok) {
          const data = await res.json();
          console.log('✅ Auth success:', data);
          setIsAuth(true);
        } else {
          console.log('❌ Auth failed - status:', res.status);
          const errorData = await res.json();
          console.log('Error data:', errorData);
          setIsAuth(false);
        }
      } catch (error) {
        console.error('❌ Auth error:', error);
        setIsAuth(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
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
        loading...
      </div>
    );
  }

  if (!isAuth) {
    console.log('🚫 Not authenticated - redirecting to login');
    return <Navigate to="/login" replace />;
  }

  console.log('✅ Authenticated - showing dashboard');
  return children;
}