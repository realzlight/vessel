import { useState } from 'react'
import '../styles/auth.css'
import { Link, useNavigate } from 'react-router-dom'
import axios from '../lib/axios.js'
import { useUser } from '../context/UserContext.jsx'



export default function Signup() {
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showName, setShowName] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { setUser } = useUser()

  const handleEmailPassword = (e) => {
    e.preventDefault()
    setErrors({})

    if (!email.trim()) {
      setErrors({ email: 'email field is ghosting us rn' })
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors({ email: 'that email looks sus fr' })
      return
    }
    if (!password) {
      setErrors({ password: 'password? yeah we need that too' })
      return
    }
    if (password.length < 6) {
      setErrors({ password: 'password too weak, make it 6+ chars' })
      return
    }

    setShowName(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)

    if (!name.trim()) {
      setErrors({ name: 'bro name cant be empty 💀' })
      setLoading(false)
      return
    }

    if (!username.trim()) {
      setErrors({ username: 'pick a username fam' })
      setLoading(false)
      return
    }

    try {
      const res = await axios.post('/api/auth/signup', { email, password, name, username })
      setUser(res.data)
      navigate(`/${res.data.username}`)
    } catch (error) {
      const msg = error.response?.data?.message || 'server is napping bud'
      if (msg.toLowerCase().includes('email')) {
        setErrors({ email: msg })
      } else if (msg.toLowerCase().includes('username')) {
        setErrors({ username: msg })
      } else {
        setErrors({ general: msg })
      }
      setLoading(false)
    }
  }

  const clearError = (field) => {
    if (errors[field]) setErrors({ ...errors, [field]: '' })
  }
  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-logo" onClick={() => navigate('/')}>
          <span className="auth-logo-dot" />
          vessel
        </div>

        <div className="auth-header">
          <h1 className="auth-title">The Awakening!</h1>
          <p className="auth-sub">Create your vessel</p>
        </div>

        <div className="social-group">
  <button className="social-btn" onClick={() => window.location.href = 'http://localhost:5000/api/auth/google'}>
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
    Continue with Google
  </button>
  <button className="social-btn">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
    Continue with Apple
  </button>
  <button className="social-btn">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
    </svg>
    Continue with GitHub
  </button>
</div>
        <div className="auth-divider">
          <span />
          <p>or</p>
          <span />
        </div>

        <form className="auth-form" onSubmit={showName ? handleSubmit : handleEmailPassword}>
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); clearError('email') }}
              disabled={showName}
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="field">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••"
              value={password}
              onChange={(e) => { setPassword(e.target.value); clearError('password') }}
              disabled={showName}
              className={errors.password ? 'input-error' : ''}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          {showName && (
            <>
              <div className="field field-reveal">
                <label>What do we call you?</label>
                <input
                  type="text"
                  placeholder="your name"
                  value={name}
                  onChange={(e) => { setName(e.target.value); clearError('name') }}
                  autoFocus
                  className={errors.name ? 'input-error' : ''}
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>

              <div className="field field-reveal">
                <label>Username</label>
                <input
                  type="text"
                  placeholder="@yourhandle"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value.toLowerCase()); clearError('username') }}
                  className={errors.username ? 'input-error' : ''}
                />
                {errors.username && <span className="error-text">{errors.username}</span>}
              </div>
            </>
          )}

          {errors.general && <span className="error-text center">{errors.general}</span>}

          <button type="submit" disabled={loading} className="auth-submit">
            {loading ? 'creating...' : showName ? 'Create account' : 'Continue'}
          </button>
        </form>

        <p className="auth-switch">
          Already in? <Link to="/login">Sign in</Link>
        </p>

      </div>
    </div>
  )
}