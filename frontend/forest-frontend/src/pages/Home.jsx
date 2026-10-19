import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../utils/firebase";
import { useCurrentUser } from "../features/auth/hooks/useCurrentUser";
import { useLogout } from "../features/auth/hooks/useLogout";
import { getApiErrorMessage } from "../lib/api-client";

export default function Home() {
  const navigate = useNavigate();
  const [logoutError, setLogoutError] = useState("");
  const currentUser = useCurrentUser();
  const logoutMutation = useLogout();

  useEffect(() => {
    if (
      currentUser.error?.response?.status === 401 ||
      (!currentUser.isPending && !currentUser.data && !currentUser.error)
    ) {
      navigate("/login", { replace: true });
    }
  }, [currentUser.data, currentUser.error, currentUser.isPending, navigate]);

  const handleLogout = async () => {
    setLogoutError("");
    try {
      await logoutMutation.mutateAsync();
      await signOut(auth);
      navigate("/login", { replace: true });
    } catch (error) {
      setLogoutError(getApiErrorMessage(error));
    }
  };

  if (currentUser.isError) {
    return (
      <main role="alert">
        Unable to load your session.{" "}
        <button onClick={() => currentUser.refetch()}>Try again</button>
      </main>
    );
  }
  if (currentUser.isPending || !currentUser.data)
    return <main aria-live="polite">Checking your session…</main>;

  return (
    <main>
      <h1>
        Welcome{currentUser.data.name ? `, ${currentUser.data.name}` : ""}
      </h1>
      <p>{currentUser.data.email}</p>
      <button
        type="button"
        onClick={handleLogout}
        disabled={logoutMutation.isPending}
      >
        {logoutMutation.isPending ? "Signing out…" : "Sign out"}
      </button>
      {logoutError && <p role="alert">{logoutError}</p>}
    </main>
  );
}
