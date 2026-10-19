import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { auth, googleProvider } from "../../utils/firebase";
import { signInWithPopup } from "firebase/auth";
import { toast } from "react-hot-toast";
import { useLogin } from "../features/auth/hooks/useLogin";
import { useCurrentUser } from "../features/auth/hooks/useCurrentUser";
import { getApiErrorMessage } from "../lib/api-client";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";

function LoginPage() {
  const [view, setView] = useState("login");
  const [notice, setNotice] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const currentUser = useCurrentUser();

  useEffect(() => {
    if (currentUser.data) navigate("/", { replace: true });
  }, [currentUser.data, navigate]);

  const handleGoogleLogin = async () => {
    setIsSigningIn(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      await loginMutation.mutateAsync(token);
      toast.success("Login successful!");
      navigate("/", { replace: true });
    } catch (error) {
      const message = error.response
        ? getApiErrorMessage(error)
        : "Unable to sign in. Please try again.";
      setNotice(message);
      toast.error(message);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setNotice(
      "Email sign-in and registration are not available yet. Continue with Google.",
    );
  };

  const switchView = (nextView) => {
    setNotice("");
    setView(nextView);
  };

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
            <span className="brand-mark" aria-hidden="true">
              🌲
            </span>
            <span>forest</span>
          </div>

          {view === "login" ? (
            <LoginForm
              onGoogleLogin={handleGoogleLogin}
              isSigningIn={isSigningIn || loginMutation.isPending}
              notice={notice}
              onSubmit={handleSubmit}
              onShowRegister={() => switchView("register")}
            />
          ) : (
            <RegisterForm
              notice={notice}
              onGoogleLogin={handleGoogleLogin}
              isSigningIn={isSigningIn || loginMutation.isPending}
              onSubmit={handleSubmit}
              onShowLogin={() => switchView("login")}
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
  );
}

export default LoginPage;
