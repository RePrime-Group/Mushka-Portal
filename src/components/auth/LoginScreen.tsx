import { useState } from "react";
import { motion } from "motion/react";
import { useAppStore } from "../../store/useAppStore";

const VALID_EMAIL = "test@gmail.com";
const VALID_PASSWORD = "Test123!";
// const VALID_EMAIL = "mushka@gratsiani.com";
// const VALID_PASSWORD = "Shely770";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showWelcome, setShowWelcome] = useState(false);
  const login = useAppStore((s) => s.login);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (
      email.toLowerCase().trim() !== VALID_EMAIL ||
      password !== VALID_PASSWORD
    ) {
      setError("Invalid email or password");
      return;
    }

    setShowWelcome(true);
    setTimeout(() => {
      login(email.toLowerCase().trim());
    }, 1500);
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
          <h1 className="text-4xl font-bold text-gold mb-2">Welcome, Mushka</h1>
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
            <h1 className="text-2xl font-bold text-navy">Mushka AI Portal</h1>
            <p className="text-warm-gray text-sm mt-1">RePrime Group</p>
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
                placeholder="Enter password"
                autoComplete="current-password"
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
              className="w-full py-3 bg-navy text-white rounded-xl font-medium hover:bg-navy-light active:scale-[0.98] transition-all min-h-[44px] cursor-pointer"
            >
              Sign In
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
