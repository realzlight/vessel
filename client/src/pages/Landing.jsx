import '../styles/Landing.css'
import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className="landing">

      {/* Nav */}
      <nav className="l-nav">
        <div className="l-logo">
          <span className="l-dot" />
          vessel
        </div>
        <div className="l-nav-links">
          <Link to="/login" className="l-link">sign in</Link>
          <Link to="/signup" className="l-btn">get started</Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="l-hero">
        <div className="l-badge">changelog infrastructure</div>
        <h1 className="l-title">
          Ship updates.<br />
          <span className="l-dim">Not excuses.</span>
        </h1>
        <p className="l-desc">
          Vessel auto-generates changelogs from your commits.<br />
          Your users always know what changed — without you lifting a finger.
        </p>
        <div className="l-cta">
          <Link to="/signup" className="l-cta-primary">
            start for free
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
          <span className="l-cta-hint">no credit card required</span>
        </div>
      </main>

      {/* Features grid */}
      <div className="l-grid">
        <div className="l-card">
          <span className="l-card-icon">⚡</span>
          <h3>Auto Updates</h3>
          <p>Commits detected every 15 min on Pro. Your changelog stays fresh without manual posts.</p>
        </div>
        <div className="l-card">
          <span className="l-card-icon">🚩</span>
          <h3>Flag Detection</h3>
          <p>Use <code>[major]</code> in commits to trigger instant priority updates to your users.</p>
        </div>
        <div className="l-card">
          <span className="l-card-icon">💎</span>
          <h3>Pro — $9/mo</h3>
          <p>15-min smart intervals, 5 instant updates/day, and dash-major flag prioritization.</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="l-footer">
        <span>vessel · built by <a href="https://linkedin.com/in/zlight-dev" target="_blank">zlight</a></span>
        <span>realzlight © 2026</span>
      </footer>

    </div>
  )
}