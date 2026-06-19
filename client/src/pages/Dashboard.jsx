import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../lib/axios.js'
import '../styles/Dashboard.css'

function PixelAvatar({ seed, size = 32 }) {
  const cells = useMemo(() => {
    let hash = 0
    for (let i = 0; i < seed.length; i++) {
      hash = (hash << 5) - hash + seed.charCodeAt(i)
      hash |= 0
    }
    const grid = 5
    const out = []
    for (let i = 0; i < grid * grid; i++) {
      const v = Math.abs((hash * (i + 7) * 2654435761) % 360)
      const skip = (Math.abs(hash + i * 13) % 5) === 0
      out.push(skip ? 'transparent' : `hsl(${v}, 65%, 55%)`)
    }
    return out
  }, [seed])

  return (
    <div
      style={{
        width: size,
        height: size,
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: 1,
        background: '#111',
        borderRadius: 6,
        overflow: 'hidden',
        flexShrink: 0,
        cursor: 'pointer'
      }}
    >
      {cells.map((c, i) => (
        <div key={i} style={{ background: c }} />
      ))}
    </div>
  )
}

export default function Dashboard({ user }) {
  const navigate = useNavigate()
  const [profileOpen, setProfileOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [activeMenu, setActiveMenu] = useState(null)
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')

  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'vaultex-auth',
      projectId: 'vlx_8f3k2a',
      description: 'JWT auth middleware for Express, published as an npm package.',
      createdAt: '2026-06-10'
    },
    {
      id: 2,
      name: 'embed-widget',
      projectId: 'emb_9d2j1c',
      description: 'Lightweight embeddable changelog widget for any frontend.',
      createdAt: '2026-06-08'
    }
  ])

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout')
      navigate('/')
    } catch (err) {
      console.log(err)
    }
  }

  const handleCreate = () => {
    if (!newName.trim()) return
    const newProject = {
      id: Date.now(),
      name: newName.trim(),
      projectId: 'prj_' + Math.random().toString(36).slice(2, 8),
      description: newDesc.trim(),
      createdAt: new Date().toISOString().slice(0, 10)
    }
    setProjects([newProject, ...projects])
    setNewName('')
    setNewDesc('')
    setShowCreate(false)
  }

  const handleDelete = (id) => {
    setProjects(projects.filter(p => p.id !== id))
    setActiveMenu(null)
  }

  const filtered = projects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="dashboard">
      {/* Top bar */}
      <div className="dash-topbar">
        <div className="dash-logo">vessel</div>
        <div className="dash-profile" onClick={() => setProfileOpen(true)}>
          <span className="dash-username">{user.username}</span>
          <PixelAvatar seed={user.username} size={30} />
        </div>
      </div>

      {/* Search row */}
      <div className="dash-searchrow">
        <div className="dash-search">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="dash-iconbtn" title="Filter">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="6" x2="20" y2="6"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
            <line x1="11" y1="18" x2="13" y2="18"/>
          </svg>
        </button>
        <button className="dash-iconbtn dash-add" onClick={() => setShowCreate(true)} title="New project">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14"/>
          </svg>
        </button>
      </div>

      <div className="dashboard-section-label">Projects</div>

      <div className="projects-grid">
        {filtered.length === 0 && (
          <div className="empty-state">
            <p>No projects yet</p>
            <p>Create your first project to get started.</p>
          </div>
        )}

        {filtered.map((p) => (
          <div className="project-card" key={p.id}>
            <div className="project-header">
              <div className="project-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
              </div>
              <div className="project-menu-wrap">
                <button
                  className="project-dots"
                  onClick={() => setActiveMenu(activeMenu === p.id ? null : p.id)}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="5" cy="12" r="1.8"/>
                    <circle cx="12" cy="12" r="1.8"/>
                    <circle cx="19" cy="12" r="1.8"/>
                  </svg>
                </button>
                {activeMenu === p.id && (
                  <div className="project-dropdown">
                    <button onClick={() => setActiveMenu(null)}>Edit</button>
                    <button onClick={() => handleDelete(p.id)}>Delete</button>
                  </div>
                )}
              </div>
            </div>

            <p className="project-name">{p.name}</p>
            <p className="project-link">/dashboard/{p.name}</p>
            <p className="project-description">{p.description}</p>
            <p className="project-date">{p.createdAt}</p>
          </div>
        ))}
      </div>

      {/* Profile popup */}
      {profileOpen && (
        <div className="modal-overlay" onClick={() => setProfileOpen(false)}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <PixelAvatar seed={user.username} size={56} />
            <div className="profile-field">
              <span className="profile-label">Name</span>
              <span className="profile-value">{user.name || user.username}</span>
            </div>
            <div className="profile-field">
              <span className="profile-label">Username</span>
              <span className="profile-value">{user.username}</span>
            </div>
            <div className="profile-field">
              <span className="profile-label">Email</span>
              <span className="profile-value">{user.email}</span>
            </div>
            <button className="dashboard-logout" onClick={handleLogout}>
              Log out
            </button>
          </div>
        </div>
      )}

      {/* Create project modal */}
      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>New project</h2>
              <button className="modal-close" onClick={() => setShowCreate(false)}>×</button>
            </div>
            <div className="form-group">
              <label>Name</label>
              <input value={newName} onChange={(e) => setNewName(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea rows={3} value={newDesc} onChange={(e) => setNewDesc(e.target.value)} />
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowCreate(false)}>Cancel</button>
              <button className="btn-submit" onClick={handleCreate}>Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}