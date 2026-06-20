import { useState, useMemo } from 'react'
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
      style={{
        width: size,
        height: size,
        gridTemplateColumns: `repeat(${grid}, 1fr)`
      }}
    >
      {cells.map((c, i) => (
        <div key={i} style={{ background: c }} />
      ))}
    </div>
  )
}

function PlanSelect({ value, onChange, locked }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="plan-select-wrap">
      <button type="button" className="plan-select-trigger" onClick={() => setOpen(!open)}>
        <span className={`plan-select-value ${value === 'Pro' ? 'is-pro' : ''}`}>{value}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>

      {open && (
        <div className="plan-select-menu">
          <button
            type="button"
            className={`plan-option ${value === 'Free' ? 'active' : ''}`}
            onClick={() => { onChange('Free'); setOpen(false) }}
          >
            <span>Free</span>
          </button>

          <button
            type="button"
            className={`plan-option plan-option-pro ${value === 'Pro' ? 'active' : ''} ${locked ? 'locked' : ''}`}
            onClick={() => {
              if (locked) return
              onChange('Pro')
              setOpen(false)
            }}
            disabled={locked}
          >
            <span>Pro</span>
            {locked && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="plan-lock-icon">
                <rect x="5" y="11" width="14" height="9" rx="2"/>
                <path d="M8 11V7a4 4 0 0 1 8 0v4"/>
              </svg>
            )}
          </button>
        </div>
      )}
    </div>
  )
}

export default function Dashboard({ user }) {
  const navigate = useNavigate()

  // Account-level tier — wire this up to real billing data later.
  // 'free' | 'pro'
  const [tier, setTier] = useState('free')

  const [profileOpen, setProfileOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [activeMenu, setActiveMenu] = useState(null)
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newPlan, setNewPlan] = useState('Pro')

  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'vaultex-auth',
      description: 'JWT auth middleware for Express, published as an npm package.',
      plan: 'Pro',
      createdAt: '2026-06-10'
    },
    {
      id: 2,
      name: 'embed-widget',
      description: 'Lightweight embeddable changelog widget for any frontend.',
      plan: 'Free',
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
    setProjects([
      {
        id: Date.now(),
        name: newName.trim(),
        description: newDesc.trim(),
        plan: newPlan,
        createdAt: new Date().toISOString().slice(0, 10)
      },
      ...projects
    ])
    setNewName('')
    setNewDesc('')
    setNewPlan('Free')
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
      <div className="dash-topbar">
        <div className="dash-logo">
          
          vessel
        </div>

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

              <div className="profile-tier-row">
                <span className="profile-label">Plan</span>
                <div className={`tier-badge ${tier === 'pro' ? 'tier-pro' : 'tier-free'}`}>
                  {tier === 'free' && (
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="5" y="11" width="14" height="9" rx="2"/>
                      <path d="M8 11V7a4 4 0 0 1 8 0v4"/>
                    </svg>
                  )}
                  {tier === 'pro' ? 'PRO' : 'FREE'}
                </div>
              </div>

              <button className="dashboard-logout" onClick={handleLogout}>
                Log out
              </button>
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
        {filtered.length === 0 && (
          <div className="empty-state">
            <p>No projects yet</p>
            <p>Create your first project to get started.</p>
          </div>
        )}

        {filtered.map((p) => (
          <div className="project-card" key={p.id}>
            <div className="project-card-top">
              <div className="project-title-group">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
                <p className="project-name">{p.name}</p>
              </div>

              <div className="project-top-right">
                <span className={`project-plan ${p.plan === 'Pro' ? 'plan-pro' : 'plan-free'}`}>
                  {p.plan}
                </span>

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
            </div>

            <span className="project-link">{user.username}/{p.name.toLowerCase()}</span>
            <p className="project-description">{p.description}</p>
            <p className="project-date">{p.createdAt}</p>
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
            <div className="form-group">
              <label>Name</label>
              <input value={newName} onChange={(e) => setNewName(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea rows={3} value={newDesc} onChange={(e) => setNewDesc(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Plan</label>
              <PlanSelect
                value={newPlan}
                onChange={setNewPlan}
                locked={tier === 'free'}
              />
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