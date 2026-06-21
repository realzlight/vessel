import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from '../lib/axios.js'
import '../styles/Project.css'

export default function Project({ user }) {
  const { projectname } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    axios.get(`/api/projects/${projectname}`)
      .then(res => setProject(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [projectname])

  if (loading) return <div className="project-page-loading">Loading...</div>
  if (error || !project) return <div className="project-page-loading">Project not found</div>

  return (
    <div className="project-page">
      <button className="project-back" onClick={() => navigate(`/${user.username}`)}>
        ← back to dashboard
      </button>

      <div className="project-page-header">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5"/>
          <path d="M2 12l10 5 10-5"/>
        </svg>
        <h1>{project.name}</h1>
      </div>

      <a
        className="project-page-repo"
        href={`https://github.com/${project.githubRepo}`}
        target="_blank"
        rel="noreferrer"
      >
        github.com/{project.githubRepo}
      </a>

      <p className="project-page-desc">{project.description}</p>
      <p className="project-page-date">Created {new Date(project.createdAt).toLocaleDateString()}</p>
    </div>
  )
}
