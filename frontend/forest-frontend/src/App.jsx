import { useState } from 'react'
import './App.css'
import { auth, googleProvider } from '../utils/firebase'
import { signInWithPopup } from 'firebase/auth'

function App() {
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [notice, setNotice] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    setNotice('Sign-in is not connected yet. Contact your workspace administrator.')
  }
  const handleLoginWithGoogle = async () =>{
    const data = await signInWithPopup(auth, googleProvider);
    console.log(data)

  }

  return (
    <main className="login-page">
      <section className="story-panel" aria-label="Forest workspace">
        <div className="story-shade" />
        <header className="brand-lockup">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 36 36" fill="none">
              <path d="M18 4 7 19h7l-3 7h14l-3-7h7L18 4Z" fill="currentColor" />
              <path d="M18 22v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          <span>forest</span>
        </header>

        <div className="story-copy">
          <span className="eyebrow"><span /> YOUR WORKSPACE, IN SYNC</span>
          <h1>Good work<br />grows here.</h1>
          <p>A calmer place to plan, build, and grow together.</p>
        </div>

        <footer className="story-footer">
          <span className="footer-rule" />
          <span>Make room for what matters.</span>
        </footer>
      </section>

      <section className="form-panel" aria-labelledby="welcome-title">
        <div className="form-wrap">
          <div className="mobile-brand brand-lockup">
            <span className="brand-mark" aria-hidden="true">
              <svg viewBox="0 0 36 36" fill="none">
                <path d="M18 4 7 19h7l-3 7h14l-3-7h7L18 4Z" fill="currentColor" />
                <path d="M18 22v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
            <span>forest</span>
          </div>

          <div className="form-heading">
            <span className="form-kicker">WELCOME BACK</span>
            <h2 id="welcome-title">Sign in to Forest</h2>
            <p>Pick up where your team left off.</p>
          </div>

          <button
            className="google-button"
            type="button"
            onClick={handleLoginWithGoogle}
          >
            <svg className="google-mark" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#4285F4" d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.7c3.9-3.6 6-8.8 6-15Z" />
              <path fill="#34A853" d="M24 44c5.5 0 10.1-1.8 13.5-4.8l-6.7-5.1c-1.8 1.2-4 1.9-6.8 1.9-5.2 0-9.7-3.5-11.3-8.2H5.8v5.2A20 20 0 0 0 24 44Z" />
              <path fill="#FBBC05" d="M12.7 27.8a12 12 0 0 1 0-7.6V15H5.8a20 20 0 0 0 0 18l6.9-5.2Z" />
              <path fill="#EA4335" d="M24 12c3 0 5.6 1 7.7 3l5.8-5.8C34 5.9 29.5 4 24 4A20 20 0 0 0 5.8 15l6.9 5.2C14.3 15.5 18.8 12 24 12Z" />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="divider"><span>OR CONTINUE WITH EMAIL</span></div>

          <form className="login-form" onSubmit={handleSubmit}>
            <label htmlFor="email">Work email</label>
            <input
              autoComplete="email"
              id="email"
              name="email"
              placeholder="you@company.com"
              type="email"
              required
            />

            <div className="password-label-row">
              <label htmlFor="password">Password</label>
              <button className="text-button" type="button" onClick={() => setNotice('Password reset is not configured yet.')}>
                Forgot password?
              </button>
            </div>
            <div className="password-field">
              <input
                autoComplete="current-password"
                id="password"
                name="password"
                placeholder="Enter your password"
                type={passwordVisible ? 'text' : 'password'}
                required
              />
              <button
                aria-label={passwordVisible ? 'Hide password' : 'Show password'}
                className="visibility-button"
                onClick={() => setPasswordVisible((visible) => !visible)}
                type="button"
              >
                {passwordVisible ? (
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 3 21 21M10.6 10.7a2 2 0 0 0 2.7 2.7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/><path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c5.2 0 8.7 4.8 9.5 6-.3.5-1.2 1.7-2.6 2.9M6.2 6.3C3.9 7.8 2.8 9.7 2.5 11c.8 1.2 4.3 6 9.5 6 1 0 2-.2 2.8-.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M2.5 12S6 6 12 6s9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/><circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.7"/></svg>
                )}
              </button>
            </div>

            <label className="remember-row">
              <input type="checkbox" name="remember" />
              <span>Keep me signed in</span>
            </label>

            <button className="submit-button" type="submit">
              <span>Sign in</span>
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 10h11m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            {notice && <p className="form-notice" role="status">{notice}</p>}
          </form>

          <p className="signup-prompt">New to Forest? <button className="text-button signup-button" type="button" onClick={() => setNotice('Ask your workspace administrator for an invite to Forest.')}>Request an invite</button></p>
        </div>

        <footer className="form-footer">
          <span>© 2026 Forest</span>
          <div><a href="mailto:privacy@forest.example">Privacy</a><a href="mailto:help@forest.example">Help</a></div>
        </footer>
      </section>
    </main>
  )
}

export default App
