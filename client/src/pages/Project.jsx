import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from '../lib/axios.js'
import '../styles/Project.css'

const INTERVALS = [
  { value: '15min', label: '15 min', ms: 15 * 60 * 1000 },
  { value: '30min', label: '30 min', ms: 30 * 60 * 1000 },
  { value: '1hr', label: '1 hr', ms: 60 * 60 * 1000 },
  { value: '5hr', label: '5 hr', ms: 5 * 60 * 60 * 1000 },
  { value: '10hr', label: '10 hr', ms: 10 * 60 * 60 * 1000 },
  { value: '24hr', label: '24 hr', ms: 24 * 60 * 60 * 1000 },
  { value: '7days', label: '7 days', ms: 7 * 24 * 60 * 60 * 1000 }
]

export default function Project({ user }) {
  const { projectname } = useParams()
  const navigate = useNavigate()

  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [deploying, setDeploying] = useState(false)
  const [timeUntilRefresh, setTimeUntilRefresh] = useState('')

  useEffect(() => {
    axios.get(`/api/projects/${projectname}`)
      .then(res => setProject(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [projectname])

  // Timer countdown
  useEffect(() => {
    if (!project?.deployment?.lastDeployed) return

    const interval = setInterval(() => {
      const intervalConfig = INTERVALS.find(i => i.value === project.deployment.interval) || INTERVALS[1]
      const nextRefresh = new Date(project.deployment.lastDeployed).getTime() + intervalConfig.ms
      const now = Date.now()
      const diff = nextRefresh - now

      if (diff <= 0) {
        setTimeUntilRefresh('ready to refresh')
      } else {
        const hrs = Math.floor(diff / (60 * 60 * 1000))
        const mins = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000))
        const secs = Math.floor((diff % (60 * 1000)) / 1000)
        setTimeUntilRefresh(`${hrs}h ${mins}m ${secs}s`)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [project])

  const handleDeploy = async () => {
    setDeploying(true)
    try {
      const res = await axios.post(`/api/projects/${project._id}/deploy`)
      setProject({
        ...project,
        deployment: {
          ...project.deployment,
          changelogHtml: res.data.html,
          lastDeployed: new Date().toISOString()
        }
      })
    } catch (err) {
      console.log(err)
    } finally {
      setDeploying(false)
    }
  }

  const handleIntervalChange = async (interval) => {
    try {
      await axios.put(`/api/projects/${project._id}/deploy-settings`, { interval })
      setProject({ ...project, deployment: { ...project.deployment, interval } })
      setSettingsOpen(false)
    } catch (err) {
      console.log(err)
    }
  }

  if (loading) return <div className="project-page-loading">Loading...</div>
  if (error || !project) return <div className="project-page-loading">Project not found</div>

  const currentInterval = INTERVALS.find(i => i.value === project.deployment?.interval) || INTERVALS[1]

  return (
    <div className="project-page">
      <nav className="project-nav">
        <button className="project-nav-back" onClick={() => navigate(`/${user.username}`)}>
          ←
        </button>
        <div className="project-nav-logo">vessel</div>
        <div className="project-nav-spacer" />
        <div className="project-nav-settings">
          <button className="project-settings-btn" onClick={() => setSettingsOpen(!settingsOpen)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24"/>
            </svg>
          </button>

          {settingsOpen && (
            <div className="project-settings-panel">
              <div className="settings-label">Refresh interval</div>
              {INTERVALS.map(i => (
                <button
                  key={i.value}
                  className={`settings-option ${project.deployment?.interval === i.value ? 'active' : ''}`}
                  onClick={() => handleIntervalChange(i.value)}
                >
                  {i.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      <div className="project-container">
        <div className="project-header">
          <h1>{project.name}</h1>
          <a className="project-repo-link" href={`https://github.com/${project.githubRepo}`} target="_blank" rel="noreferrer">
            github.com/{project.githubRepo}
          </a>
          {project.description && <p className="project-desc">{project.description}</p>}
        </div>

        <div className="changelog-preview">
          <div className="changelog-header">
            <div className="changelog-title">
              <span className="changelog-dot" />
              {project.name}
            </div>
            <div className="changelog-status">
              {project.deployment?.changelogHtml ? (
                <>
                  <span className="status-live">● live</span>
                  <span className="status-timer">next in {timeUntilRefresh}</span>
                </>
              ) : (
                <span className="status-idle">not deployed</span>
              )}
            </div>
          </div>

          <div className="changelog-body">
            {project.deployment?.changelogHtml ? (
              <iframe
                srcDoc={project.deployment.changelogHtml}
                title="changelog"
                className="changelog-iframe"
              />
            ) : (
              <div className="changelog-empty">
                <p>No changelog yet</p>
                <p>Deploy to generate from your commits</p>
              </div>
            )}
          </div>
        </div>

        <div className="project-actions">
          <button className="btn-deploy" onClick={handleDeploy} disabled={deploying}>
            {deploying ? 'deploying...' : 'Deploy changelog'}
          </button>
        </div>
      </div>
    </div>
  )
}