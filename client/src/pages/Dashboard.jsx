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
  const [logs, setLogs] = useState([])

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

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, { message, type, timestamp }])
  }

  const handleDeploy = async () => {
    setDeploying(true)
    setLogs([])
    addLog('Starting deployment...', 'info')
    
    try {
      addLog(`Fetching commits from ${project.githubRepo}...`, 'info')
      const res = await axios.post(`/api/projects/${project._id}/deploy`)
      
      addLog('Processing commits with AI...', 'info')
      addLog('Generating changelog HTML...', 'info')
      addLog('✓ Deployment successful', 'success')
      
      setProject({
        ...project,
        deployment: {
          ...project.deployment,
          changelogHtml: res.data.html,
          lastDeployed: new Date().toISOString(),
          status: 'deployed'
        }
      })
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message
      addLog(`✗ ${errorMsg}`, 'error')
    } finally {
      setDeploying(false)
    }
  }

  const handleStop = async () => {
    try {
      addLog('Stopping auto-deploy...', 'info')
      await axios.post(`/api/projects/${project._id}/stop-deploy`)
      setProject({
        ...project,
        deployment: { ...project.deployment, isAutoDeployEnabled: false }
      })
      addLog('✓ Auto-deploy stopped', 'success')
    } catch (err) {
      addLog('✗ Failed to stop deploy', 'error')
    }
  }

  const handleIntervalChange = async (interval) => {
    try {
      addLog(`Changing refresh interval to ${INTERVALS.find(i => i.value === interval)?.label}...`, 'info')
      await axios.put(`/api/projects/${project._id}/deploy-settings`, { interval })
      setProject({ ...project, deployment: { ...project.deployment, interval } })
      addLog('✓ Interval updated', 'success')
      setSettingsOpen(false)
    } catch (err) {
      addLog('✗ Failed to update interval', 'error')
    }
  }

  if (loading) return <div className="project-loading">Loading...</div>
  if (error || !project) return <div className="project-loading">Project not found</div>

  const isDeployed = project.deployment?.changelogHtml
  const currentInterval = INTERVALS.find(i => i.value === project.deployment?.interval) || INTERVALS[1]

  return (
    <div className="project-page">
      {/* Nav */}
      <div className="project-nav">
        <button className="project-back" onClick={() => navigate(`/${user.username}`)}>
          ←
        </button>
        <div className="project-logo">vessel</div>
        <div className="project-nav-spacer" />
        
        <div className="project-settings-wrap">
          <button className="project-settings-btn" onClick={() => setSettingsOpen(!settingsOpen)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24"/>
            </svg>
          </button>

          {settingsOpen && (
            <div className="project-settings-menu">
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
      </div>

      {/* Content */}
      <div className="project-container">
        <div className="project-header">
          <h1>{project.name}</h1>
          <a className="project-repo" href={`https://github.com/${project.githubRepo}`} target="_blank" rel="noreferrer">
            github.com/{project.githubRepo}
          </a>
          {project.description && <p className="project-desc">{project.description}</p>}
        </div>

        {/* Changelog Preview */}
        <div className="changelog-window">
          <div className="changelog-top">
            <span className="changelog-label">{project.name}</span>
            <div className="changelog-status">
              {isDeployed && <span className="status-dot" />}
              <span>{isDeployed ? 'live' : 'not deployed'}</span>
              {isDeployed && <span className="status-timer">{timeUntilRefresh}</span>}
            </div>
          </div>
          <div className="changelog-frame">
            {isDeployed ? (
              <iframe srcDoc={project.deployment.changelogHtml} title="changelog" />
            ) : (
              <div className="changelog-empty">
                <p>No changelog deployed</p>
                <p>Hit deploy to generate from your commits</p>
              </div>
            )}
          </div>
        </div>

        {/* Terminal Log */}
        <div className="terminal-log">
          <div className="terminal-header">deploy log</div>
          <div className="terminal-body">
            {logs.length === 0 ? (
              <div className="terminal-empty">Ready to deploy</div>
            ) : (
              logs.map((log, i) => (
                <div key={i} className={`terminal-line ${log.type}`}>
                  <span className="terminal-time">{log.timestamp}</span>
                  <span className="terminal-msg">{log.message}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="project-actions">
          {isDeployed ? (
            <button className="btn-stop" onClick={handleStop}>Stop deploy</button>
          ) : (
            <button className="btn-deploy" onClick={handleDeploy} disabled={deploying}>
              {deploying ? 'Deploying...' : 'Deploy changelog'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}