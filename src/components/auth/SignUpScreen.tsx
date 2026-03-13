import { useState } from "react";
import { motion } from "motion/react";
import { setToken } from "../../lib/auth";
import { useAppStore } from "../../store/useAppStore";

interface Props {
  onSignIn: () => void;
}

export default function SignUpScreen({ onSignIn }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const login = useAppStore((s) => s.login);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.toLowerCase().trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Sign up failed. Please try again.");
        return;
      }

      setToken(data.token);
      setShowWelcome(true);
      setTimeout(() => {
        login(data.email);
      }, 1500);
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (showWelcome) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-navy">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-gold mb-2">Welcome!</h1>
          <p className="text-white/60 text-lg">Let's begin your AI journey</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex items-center justify-center bg-navy px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-navy rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-gold text-2xl font-bold">M</span>
            </div>
            <h1 className="text-2xl font-bold text-navy">Create Account</h1>
            <p className="text-warm-gray text-sm mt-1">Mushka AI Portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-navy mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-cream text-navy placeholder-warm-gray/50 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
                placeholder="your@email.com"
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-cream text-navy placeholder-warm-gray/50 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
                placeholder="At least 8 characters"
                autoComplete="new-password"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy mb-1.5">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-cream text-navy placeholder-warm-gray/50 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
                placeholder="Repeat your password"
                autoComplete="new-password"
                required
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm text-center"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-navy text-white rounded-xl font-medium hover:bg-navy-light active:scale-[0.98] transition-all min-h-[44px] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-warm-gray mt-6">
            Already have an account?{" "}
            <button
              onClick={onSignIn}
              className="text-navy font-medium hover:underline cursor-pointer"
            >
              Sign in
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
