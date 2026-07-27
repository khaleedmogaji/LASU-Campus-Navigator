import "../styles/admin-login.css";
import { useState, FormEvent } from "react";
import { MapPin } from "lucide-react";
import { signInWithEmailAndPassword, AuthError } from "firebase/auth";
import { auth } from "@/src/firebase";

interface LoginPageProps {
  onSuccess: () => void;
}

function friendlyError(error: AuthError): string {
  switch (error.code) {
    case "auth/invalid-email":
      return "That email address doesn't look right.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Email or password is incorrect.";
    case "auth/too-many-requests":
      return "Too many attempts. Wait a moment and try again.";
    case "auth/network-request-failed":
      return "Network error. Check your connection and try again.";
    default:
      return "Couldn't sign in. Please try again.";
  }
}

export default function LoginPage({ onSuccess }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      onSuccess();
    } catch (err) {
      setError(friendlyError(err as AuthError));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="admin-login-logo">
            <MapPin size={18} />
          </div>
          <div>
            <div className="admin-login-title">LASU Navigator</div>
            <div className="admin-login-sub">Admin sign in</div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="admin-login-field">
            <span>Email</span>
            <input
              type="email"
              required
              autoFocus
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@lasu.edu.ng"
            />
          </label>

          <label className="admin-login-field">
            <span>Password</span>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </label>

          {error && <div className="admin-login-error">{error}</div>}

          <button
            type="submit"
            className="admin-login-submit"
            disabled={submitting}
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="admin-login-footnote">
          Access is limited to the LASU Navigator team.
        </p>
      </div>
    </div>
  );
}
