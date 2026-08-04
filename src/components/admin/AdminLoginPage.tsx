import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Eye, EyeOff, ShieldAlert } from "lucide-react";
import { auth, db } from "@/src/firebase";
import { useAdminStore } from "@/store/useAdminStore";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const setUser = useAdminStore((s) => s.setUser);
  const setIsAdmin = useAdminStore((s) => s.setIsAdmin);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Step 1: authenticate
      const credential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const uid = credential.user.uid;
      const userEmail = credential.user.email;

      console.log("[AdminLogin] Authenticated:", { uid, email: userEmail });

      const isHardcodedAdmin =
        userEmail === "khaleedmogaji@gmail.com" &&
        credential.user.emailVerified;

      if (isHardcodedAdmin) {
        console.log("[AdminLogin] Matched hardcoded admin allowlist.");
        setUser(credential.user);
        setIsAdmin(true);
        navigate("/admin");
        return;
      }

      // Step 2: check this UID is provisioned as an admin in `users`
      const userDoc = await getDoc(doc(db, "users", uid));
      const role = userDoc.exists() ? userDoc.data().role : null;

      console.log("[AdminLogin] Role check:", {
        uid,
        docExists: userDoc.exists(),
        role,
      });

      if (role !== "admin") {
        console.warn(
          `[AdminLogin] Access denied — uid ${uid} has role "${role ?? "none"}", not "admin".`,
        );
        await signOut(auth);
        setError("You don't have admin access on this account.");
        setIsSubmitting(false);
        return;
      }

      setUser(credential.user);
      setIsAdmin(true);
      navigate("/admin");
    } catch (err: any) {
      const code = err?.code as string | undefined;
      console.error("[AdminLogin] Sign-in error:", {
        code,
        message: err?.message,
        raw: err,
      });

      if (
        code === "auth/invalid-credential" ||
        code === "auth/wrong-password"
      ) {
        setError("Incorrect email or password.");
      } else if (code === "auth/user-not-found") {
        setError("No account found with that email.");
      } else if (code === "auth/too-many-requests") {
        setError("Too many attempts. Please wait a moment and try again.");
      } else if (code === "auth/invalid-email") {
        setError("That doesn't look like a valid email address.");
      } else if (code === "auth/network-request-failed") {
        setError("Network error — check your connection and try again.");
      } else {
        setError(
          `Something went wrong (${code ?? "unknown error"}). Please try again.`,
        );
      }
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          {/* Swap for your actual LASU crest asset */}
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <ShieldAlert className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-xl font-bold text-foreground font-heading">
            Admin Access
          </h1>
          <p className="text-sm text-foreground-muted mt-1">
            Sign in to manage campus data
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-4 shadow-sm"
        >
          {error && (
            <div className="text-xs text-destructive-foreground bg-destructive/10 border border-destructive/20 rounded-xl px-3 py-2.5 leading-relaxed">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-xs font-bold text-foreground uppercase tracking-wide"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-input-focus transition-shadow"
              placeholder="you@lasu.edu.ng"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-xs font-bold text-foreground uppercase tracking-wide"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 pr-10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-input-focus transition-shadow"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:bg-primary-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <button
          onClick={() => navigate("/")}
          className="w-full text-center text-xs text-muted-foreground hover:text-foreground mt-6 transition-colors"
        >
          ← Back to LASU Navigator
        </button>
      </div>
    </div>
  );
}
