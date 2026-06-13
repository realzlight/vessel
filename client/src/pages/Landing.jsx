import '../styles/Landing.css'
import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className="land">
      <div className="land-inner">

        <nav className="land-nav">
          <div className="land-logo">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
            vessel
          </div>
          <Link to="/signup" className="land-nav-cta">Get started</Link>
        </nav>

        <section className="land-hero">
          <h1 className="land-title">VESSEL</h1>
          <p className="land-sub">
            Your product ships fast. Your users deserve to know what changed.<br />
            Vessel turns your commits into <strong class="land-sub-h">clean, readable changelogs</strong>  without you writing a single word.
          </p>
          <div className="land-actions">
            <Link to="/signup" className="land-btn-primary">
              Start building
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <Link to="/login" className="land-btn-ghost">Sign in</Link>
          </div>
        </section>

        <div className="land-section-label">How it works</div>

        <div className="land-grid">
          <div className="land-card">
            <div className="land-card-top">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polyline points="16 18 22 12 16 6"/>
                <polyline points="8 6 2 12 8 18"/>
              </svg>
              Commit-driven
            </div>
            <p>Your Git history is the source of truth. Push a commit and Vessel reads it, formats it, and publishes it.</p>
          </div>

          <div className="land-card">
            <div className="land-card-top">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              Smart intervals
            </div>
            <p>Vessel watches your repo on a schedule. Updates roll out at the right cadence — never too early, never too late.</p>
          </div>

          <div className="land-card">
            <div className="land-card-top">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
              Instant updates
            </div>
            <p>Critical fix shipped? Flag it. Vessel pushes it to the top immediately without waiting for the next cycle.</p>
          </div>

          <div className="land-card">
            <div className="land-card-top">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              User-facing
            </div>
            <p>A public changelog page your users can actually read. Clean, minimal, always in sync with your latest build.</p>
          </div>

          <div className="land-card">
            <div className="land-card-top">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <path d="M3 9h18M9 21V9"/>
              </svg>
              One dashboard
            </div>
            <p>All your changelogs, repos, and update history in a single clean interface. No clutter, no configuration hell.</p>
          </div>

          <div className="land-card">
            <div className="land-card-top">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
              Always in sync
            </div>
            <p>No more outdated docs or forgotten release notes. Vessel keeps your changelog perfectly aligned with your code.</p>
          </div>
        </div>

        <footer className="land-footer">
          <div className="land-footer-left">
            made with
            <svg width="11" height="11" viewBox="0 0 24 24" fill="#ef4444" style={{margin: '0 4px', flexShrink: 0}}>
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            by <a href="https://linkedin.com/in/zlight-dev" target="_blank">realzlight</a>
          </div>
          <div className="land-footer-links">
            <a href="https://github.com/realzlight" target="_blank">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              realzlight
            </a>
            <a href="https://linkedin.com/in/zlight-dev" target="_blank">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
              zlight-dev
            </a>
          </div>
        </footer>

      </div>
    </div>
  )
}
