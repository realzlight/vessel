import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../lib/axios.js'
import '../styles/Dashboard.css'

const PALETTE = [
  { name: 'yellow', hue: 48 },
  { name: 'red', hue: 0 },
  { name: 'blue', hue: 215 },
  { name: 'navy', hue: 230 },
  { name: 'green', hue: 145 },
  { name: 'lime', hue: 95 },
  { name: 'purple', hue: 275 },
  { name: 'violet', hue: 265 },
  { name: 'orange', hue: 28 }
]

function hashStr(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

function PixelAvatar({ seed, size = 32 }) {
  const grid = 8
  const cells = useMemo(() => {
    const h = hashStr(seed)
    const base = PALETTE[h % PALETTE.length].hue
    const out = []
    for (let i = 0; i < grid * grid; i++) {
      const noise = (h * (i + 11) * 2654435761) % 1000
      const lightness = 25 + (noise % 55)
      const sat = 65 + (noise % 20)
      out.push(`hsl(${base}, ${sat}%, ${lightness}%)`)
    }
    return out
  }, [seed])

  return (
    <div
      className="pixel-avatar"
      style={{ width: size, height: size, gridTemplateColumns: `repeat(${grid}, 1fr)` }}
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
  const [newRepo, setNewRepo] = useState('')
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [createError, setCreateError] = useState('')

  // First project is free. Every project after that costs $5.
  const hasFreeSlotLeft = projects.length === 0

  useEffect(() => {
    axios.get('/api/projects')
      .then(res => setProjects(res.data))
      .catch(err => console.log(err))
      .finally(() => setLoading(false))
  }, [])

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout')
      navigate('/')
    } catch (err) {
      console.log(err)
    }
  }

  const handleCreate = async () => {
    setCreateError('')
    if (!newName.trim()) return
    if (!newRepo.trim()) {
      setCreateError('add your github repo, fam')
      return
    }

    try {
      const res = await axios.post('/api/projects', {
        name: newName.trim(),
        description: newDesc.trim(),
        githubRepo: newRepo.trim()
      })
      setProjects([res.data, ...projects])
      setNewName('')
      setNewDesc('')
      setNewRepo('')
      setShowCreate(false)
    } catch (err) {
      setCreateError(err.response?.data?.message || 'something broke, try again')
    }
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/projects/${id}`)
      setProjects(projects.filter(p => p._id !== id))
    } catch (err) {
      console.log(err)
    }
    setActiveMenu(null)
  }

  const filtered = projects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="dashboard">
      <div className="dash-topbar">
        <div className="dash-logo" onClick={() => navigate('/')}>vessel</div>

        <div className="dash-profile-wrap">
          <div className="dash-profile" onClick={() => setProfileOpen(!profileOpen)}>
            <span className="dash-username">@{user.username}</span>
            <PixelAvatar seed={user.username} size={28} />
          </div>

          {profileOpen && (
            <div className="profile-dropdown">
              <div className="profile-dropdown-top">
                <PixelAvatar seed={user.username} size={44} />
              </div>
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
              <button className="dashboard-logout" onClick={handleLogout}>Log out</button>
            </div>
          )}
        </div>
      </div>

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
        {!loading && filtered.length === 0 && (
          <div className="empty-state">
            <p>No projects yet</p>
            <p>Your first one's free — create it to get started.</p>
          </div>
        )}

        {filtered.map((p) => (
          <div
            className="project-card"
            key={p._id}
            onClick={() => navigate(`/${user.username}/${p.name.toLowerCase()}`)}
          >
            <div className="project-card-top">
              <div className="project-title-group">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
                <p className="project-name">{p.name}</p>
              </div>

              <div className="project-menu-wrap">
                <button
                  className="project-dots"
                  onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === p._id ? null : p._id) }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="5" cy="12" r="1.8"/>
                    <circle cx="12" cy="12" r="1.8"/>
                    <circle cx="19" cy="12" r="1.8"/>
                  </svg>
                </button>
                {activeMenu === p._id && (
                  <div className="project-dropdown" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => setActiveMenu(null)}>Edit</button>
                    <button onClick={() => handleDelete(p._id)}>Delete</button>
                  </div>
                )}
              </div>
            </div>

            <span className="project-link">github.com/{p.githubRepo}</span>
            <p className="project-description">{p.description}</p>
            <p className="project-date">{new Date(p.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>

      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>New project</h2>
              <button className="modal-close" onClick={() => setShowCreate(false)}>×</button>
            </div>

            {!hasFreeSlotLeft && (
              <div className="paywall-notice">
                Your free project is already in use. Additional projects are <strong>₹500</strong>each.
              </div>
            )}

            <div className="form-group">
              <label>Name</label>
              <input value={newName} onChange={(e) => setNewName(e.target.value)} />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea rows={3} value={newDesc} onChange={(e) => setNewDesc(e.target.value)} />
            </div>

            <div className="form-group">
              <label>GitHub repo</label>
              <div className="github-input">
                <span className="github-prefix">github.com/</span>
                <input
                  type="text"
                  placeholder="realzlight/veiled"
                  value={newRepo}
                  onChange={(e) => setNewRepo(e.target.value)}
                />
              </div>
            </div>

            {createError && <span className="error-text">{createError}</span>}

            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowCreate(false)}>Cancel</button>
            <button className="btn-submit" onClick={handleCreate}>
  {hasFreeSlotLeft ? 'Create' : 'Pay ₹500 & Create'}
</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
