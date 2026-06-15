export default function ProtectedRoute({ children }) {
  const [isAuth, setIsAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        alert('🔍 Checking auth...');
        const res = await fetch('http://localhost:5000/api/auth/me', {
          method: 'GET',
          credentials: 'include',
        });

        alert('📡 /me status: ' + res.status);

        if (res.ok) {
          const data = await res.json();
          alert('✅ Auth success! User: ' + data.user.username);
          setIsAuth(true);
        } else {
          alert('❌ Auth failed: ' + res.status);
          setIsAuth(false);
        }
      } catch (error) {
        alert('❌ Fetch error: ' + error.message);
        setIsAuth(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div style={{minHeight: '100dvh', background: '#000'}} />;
  }

  if (!isAuth) {
    alert('🚫 Not authenticated - redirecting to login');
    return <Navigate to="/login" replace />;
  }

  alert('✅ Showing dashboard');
  return children;
}