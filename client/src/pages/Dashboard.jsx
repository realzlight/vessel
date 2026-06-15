import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [username]);

  const fetchData = async () => {
    try {
      // Fetch user data
      const userRes = await fetch(
        `http://localhost:5000/api/users/${username}`,
        { credentials: 'include' }
      );
      
      if (userRes.ok) {
        const user = await userRes.json();
        setUserData(user);
      }

      // Fetch projects
      const projectRes = await fetch(
        `http://localhost:5000/api/projects/${username}`,
        { credentials: 'include' }
      );
      
      if (projectRes.ok) {
        const data = await projectRes.json();
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error('Failed to fetch:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('http://localhost:5000/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    navigate('/login');
  };

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

  const firstLetter = username?.[0]?.toUpperCase() || 'U';
  const avatarColors = ['#3b82f6', '#2563eb', '#1d4ed8', '#1e40af'];
  const colorIndex = username?.charCodeAt(0) % avatarColors.length;
  const avatarColor = avatarColors[colorIndex];

  return (
    <div style={{
      minHeight: '100dvh',
      background: '#000',
      color: '#e5e5e5',
      fontFamily: "'Geist', sans-serif"
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '24px',
        borderBottom: '1px solid #1a1a1a',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <h1 style={{
          fontFamily: "'Geist Mono', monospace",
          fontSize: '20px',
          fontWeight: 600,
          margin: 0
        }}>
          vessel
        </h1>

        {/* Profile Icon */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowProfile(!showProfile)}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '6px',
              background: avatarColor,
              border: 'none',
              color: '#fff',
              fontSize: '18px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: "'Geist Mono', monospace",
              transition: 'opacity 0.15s'
            }}
            onMouseEnter={(e) => e.target.style.opacity = '0.85'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
          >
            {firstLetter}
          </button>

          {/* Profile Popup */}
          {showProfile && (
            <div
              style={{
                position: 'absolute',
                top: '50px',
                right: '0',
                background: '#0a0a0a',
                border: '1px solid #262626',
                borderRadius: '6px',
                padding: '16px',
                minWidth: '220px',
                zIndex: 100,
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.4)',
                animation: 'slideDown 0.2s ease-out'
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '6px',
                  background: avatarColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  color: '#fff',
                  fontWeight: 600,
                  marginBottom: '12px',
                  fontFamily: "'Geist Mono', monospace"
                }}
              >
                {firstLetter}
              </div>

              <div style={{ marginBottom: '12px' }}>
                <p style={{
                  fontFamily: "'Geist Mono', monospace",
                  fontSize: '10px',
                  color: '#737373',
                  margin: '0 0 4px 0',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase'
                }}>
                  username
                </p>
                <p style={{
                  fontSize: '14px',
                  color: '#e5e5e5',
                  margin: '0 0 8px 0',
                  fontWeight: 500
                }}>
                  @{username}
                </p>

                {userData && (
                  <>
                    <p style={{
                      fontFamily: "'Geist Mono', monospace",
                      fontSize: '10px',
                      color: '#737373',
                      margin: '8px 0 4px 0',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase'
                    }}>
                      email
                    </p>
                    <p style={{
                      fontSize: '12px',
                      color: '#b4b4b4',
                      margin: 0,
                      wordBreak: 'break-all'
                    }}>
                      {userData.email}
                    </p>
                  </>
                )}
              </div>

              <button
                onClick={() => {
                  handleLogout();
                  setShowProfile(false);
                }}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: '#e5e5e5',
                  color: '#000',
                  border: 'none',
                  borderRadius: '6px',
                  fontFamily: "'Geist Mono', monospace",
                  fontSize: '11px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  transition: 'opacity 0.15s'
                }}
                onMouseEnter={(e) => e.target.style.opacity = '0.85'}
                onMouseLeave={(e) => e.target.style.opacity = '1'}
              >
                logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 24px',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <h2 style={{
          fontFamily: "'Geist Mono', monospace",
          fontSize: '18px',
          marginBottom: '24px',
          fontWeight: 600
        }}>
          your projects
        </h2>

        {/* Projects Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '16px'
        }}>
          {projects.length === 0 ? (
            <div style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              padding: '60px 20px',
              color: '#737373'
            }}>
              <p style={{
                fontFamily: "'Geist Mono', monospace",
                fontSize: '14px',
                margin: '0 0 8px 0'
              }}>
                no projects yet
              </p>
              <p style={{
                fontSize: '12px',
                margin: 0,
                color: '#404040'
              }}>
                create your first project to get started
              </p>
            </div>
          ) : (
            projects.map((project) => (
              <div
                key={project._id}
                style={{
                  background: '#0a0a0a',
                  border: '1px solid #262626',
                  borderRadius: '6px',
                  padding: '20px',
                  transition: 'all 0.15s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#404040';
                  e.currentTarget.style.background = '#0d0d0d';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#262626';
                  e.currentTarget.style.background = '#0a0a0a';
                }}
              >
                <div style={{ marginBottom: '12px' }}>
                  <h3 style={{
                    fontFamily: "'Geist Mono', monospace",
                    fontSize: '14px',
                    fontWeight: 600,
                    margin: '0 0 4px 0',
                    color: '#e5e5e5'
                  }}>
                    {project.name}
                  </h3>
                  <p style={{
                    fontFamily: "'Geist Mono', monospace",
                    fontSize: '10px',
                    color: '#737373',
                    margin: 0,
                    letterSpacing: '0.05em'
                  }}>
                    ID: {project.projectId}
                  </p>
                </div>

                {project.description && (
                  <p style={{
                    fontSize: '13px',
                    color: '#b4b4b4',
                    margin: '8px 0',
                    lineHeight: '1.5'
                  }}>
                    {project.description}
                  </p>
                )}

                <p style={{
                  fontFamily: "'Geist Mono', monospace",
                  fontSize: '10px',
                  color: '#404040',
                  margin: '8px 0 0 0'
                }}>
                  {new Date(project.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}