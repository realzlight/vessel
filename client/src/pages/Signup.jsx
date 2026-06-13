import '../styles/auth.css'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Signup() {
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showName, setShowName] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

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
      const res = await axios.post('/api/auth/signup', { name, username, email, password })
      navigate(`/${res.data.username}`)
    } catch (error) {
      if (error.response?.data?.field) {
        setErrors({ [error.response.data.field]: error.response.data.message })
      } else {
        setErrors({ general: 'server went brrr, try again' })
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

        <div className="auth-logo">
          <span className="auth-logo-dot" />
          vessel
        </div>

        <div className="auth-header">
          <h1 className="auth-title">The Awakening.</h1>
          <p className="auth-sub">Create your vessel</p>
        </div>

        <div className="social-group">
          <button className="social-btn">Continue with Google</button>
          <button className="social-btn">Continue with Apple</button>
          <button className="social-btn">Continue with GitHub</button>
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