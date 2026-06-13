import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    fetchUserAndProjects();
  }, [username, navigate]);

  const fetchUserAndProjects = async () => {
    try {
      // Get user data
      const userRes = await fetch(
        `http://localhost:5000/api/users/${username}`,
        { credentials: 'include' }
      );

      if (!userRes.ok) {
        navigate('/login');
        return;
      }

      const user = await userRes.json();
      setUserData(user);

      // Get user's projects
      const projectRes = await fetch(
        `http://localhost:5000/api/projects/${username}`,
        { credentials: 'include' }
      );

      if (projectRes.ok) {
        const data = await projectRes.json();
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();

    // Check project limit
    if (userData.plan === 'free' && projects.length >= 3) {
      alert('Free plan limited to 3 projects');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/projects/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          plan: 'free'
        })
      });

      if (res.ok) {
        const newProject = await res.json();
        setProjects([...projects, newProject.project]);
        setFormData({ name: '', description: '' });
        setShowCreateModal(false);
      }
    } catch (error) {
      console.error('Failed to create project:', error);
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
      <div className="dashboard-loading">
        <p>loading...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">@{username}</h1>
          <p className="dashboard-plan">
            {userData?.plan} plan • {projects.length}/
            {userData?.plan === 'free' ? '3' : '∞'} projects
          </p>
        </div>
        <button className="dashboard-logout" onClick={handleLogout}>
          logout
        </button>
      </div>

      <div className="dashboard-actions">
        <button 
          className="btn-create"
          onClick={() => setShowCreateModal(true)}
        >
          + new project
        </button>
      </div>

      {/* Projects Grid */}
      <div className="projects-grid">
        {projects.length === 0 ? (
          <div className="empty-state">
            <p>no projects yet</p>
            <p style={{ fontSize: '12px', color: 'var(--subtle)' }}>
              create your first project to get started
            </p>
          </div>
        ) : (
          projects.map((project) => (
            <div key={project._id} className="project-card">
              <div className="project-header">
                <h3 className="project-name">{project.name}</h3>
                <span className="project-plan">{project.plan}</span>
              </div>
              <p className="project-description">{project.description}</p>
              <p className="project-id">ID: {project.projectId}</p>
              <p className="project-date">
                {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>new project</h2>
              <button
                className="modal-close"
                onClick={() => setShowCreateModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProject}>
              <div className="form-group">
                <label>project name</label>
                <input
                  type="text"
                  placeholder="my awesome project"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>description</label>
                <textarea
                  placeholder="what's this project about?"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows="4"
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowCreateModal(false)}
                >
                  cancel
                </button>
                <button type="submit" className="btn-submit">
                  create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}