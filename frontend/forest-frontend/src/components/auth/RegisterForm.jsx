function RegisterForm({
  notice,
  onSubmit,
  onShowLogin,
  onGoogleLogin,
  isSigningIn,
}) {
  return (
    <>
      <div className="form-heading">
        <span className="form-kicker">GET STARTED</span>
        <h2 id="welcome-title">Create your Forest account</h2>
        <p>Set up your workspace and grow together.</p>
      </div>
      <button
        className="google-button"
        type="button"
        onClick={onGoogleLogin}
        disabled={isSigningIn}
      >
        <svg className="google-mark" viewBox="0 0 48 48" aria-hidden="true">
          <path
            fill="#4285F4"
            d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.7c3.9-3.6 6-8.8 6-15Z"
          />
          <path
            fill="#34A853"
            d="M24 44c5.5 0 10.1-1.8 13.5-4.8l-6.7-5.1c-1.8 1.2-4 1.9-6.8 1.9-5.2 0-9.7-3.5-11.3-8.2H5.8v5.2A20 20 0 0 0 24 44Z"
          />
          <path
            fill="#FBBC05"
            d="M12.7 27.8a12 12 0 0 1 0-7.6V15H5.8a20 20 0 0 0 0 18l6.9-5.2Z"
          />
          <path
            fill="#EA4335"
            d="M24 12c3 0 5.6 1 7.7 3l5.8-5.8C34 5.9 29.5 4 24 4A20 20 0 0 0 5.8 15l6.9 5.2C14.3 15.5 18.8 12 24 12Z"
          />
        </svg>
        <span>{isSigningIn ? "Signing in…" : "Continue with Google"}</span>
      </button>
      <div className="divider">
        <span>OR REGISTER WITH EMAIL</span>
      </div>

      <form className="login-form" onSubmit={onSubmit}>
        <label htmlFor="register-name">Name</label>
        <input
          autoComplete="name"
          id="register-name"
          name="name"
          placeholder="Your name"
          required
        />

        <label htmlFor="register-email">Work email</label>
        <input
          autoComplete="email"
          id="register-email"
          name="email"
          placeholder="you@company.com"
          type="email"
          required
        />

        <label htmlFor="register-password">Password</label>
        <input
          autoComplete="new-password"
          id="register-password"
          name="password"
          placeholder="Create a password"
          type="password"
          minLength={8}
          required
        />

        <button className="submit-button" type="submit">
          <span>Create account</span>
        </button>

        {notice && (
          <p className="form-notice" role="status">
            {notice}
          </p>
        )}
      </form>

      <p className="signup-prompt">
        Already have an account?{" "}
        <button
          className="text-button signup-button"
          type="button"
          onClick={onShowLogin}
        >
          Sign in
        </button>
      </p>
    </>
  );
}

export default RegisterForm;
