import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../App.css'
import { auth, googleProvider } from '../../utils/firebase'
import { signInWithPopup } from 'firebase/auth'
import api from '../../utils/axios'
import { toast } from 'react-hot-toast'
import LoginForm from '../components/auth/LoginForm'
import RegisterForm from '../components/auth/RegisterForm'

function LoginPage() {
  const [view, setView] = useState('login')
  const [notice, setNotice] = useState('')
  const [isSigningIn, setIsSigningIn] = useState(false)
  const navigate = useNavigate()

  const handleGoogleLogin = async () => {
    setIsSigningIn(true)

    try {
      const result = await signInWithPopup(auth, googleProvider)
      const token = await result.user.getIdToken()

      await api.post('/auth/login', { token })
      toast.success('Login successful!')
      navigate('/', { replace: true })
    } catch (error) {
      console.error('Google sign-in failed:', error)
      setNotice('Unable to sign in. Please try again.')
      toast.error('Unable to sign in. Please try again.')
    } finally {
      setIsSigningIn(false)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setNotice('Email registration and sign-in are not connected yet.')
  }

  const switchView = (nextView) => {
    setNotice('')
    setView(nextView)
  }

  return (
    <main className="login-page">
<section className="story-panel" aria-label="Forest workspace">
        <div className="story-shade" />
        <header className="brand-lockup">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 36 36" fill="none">
              <path d="M18 4 7 19h7l-3 7h14l-3-7h7L18 4Z" fill="currentColor" />
              <path
                d="M18 22v10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <span>forest</span>
        </header>

        <div className="story-copy">
          <span className="eyebrow">
            <span /> YOUR WORKSPACE, IN SYNC
          </span>
          <h1>
            Good work
            <br />
            grows here.
          </h1>
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
            <span className="brand-mark" aria-hidden="true">🌲</span>
            <span>forest</span>
          </div>

          {view === 'login' ? (
            <LoginForm
              onGoogleLogin={handleGoogleLogin}
              isSigningIn={isSigningIn}
              notice={notice}
              onSubmit={handleSubmit}
              onShowRegister={() => switchView('register')}
            />
          ) : (
            <RegisterForm
              notice={notice}
              onGoogleLogin={handleGoogleLogin}
              isSigningIn={isSigningIn}
              onSubmit={handleSubmit}
              onShowLogin={() => switchView('login')}
            />
          )}
        </div>

        <footer className="form-footer">
          <span>© 2026 Forest</span>
          <div>
            <a href="mailto:privacy@forest.example">Privacy</a>
            <a href="mailto:help@forest.example">Help</a>
          </div>
        </footer>
      </section>
    </main>
  )
}

export default LoginPage