import { useEffect, useState } from "react";
import { useAppStore } from "./store/useAppStore";
import AuthWrapper from "./components/auth/AuthWrapper";
import AppShell from "./components/layout/AppShell";
import Dashboard from "./components/dashboard/Dashboard";
import StageView from "./components/stages/StageView";
import IdentityEngine from "./components/identity/IdentityEngine";
import { getSession } from "./lib/auth";

export default function App() {
  const isLoggedIn = useAppStore((s) => s.isLoggedIn);
  const currentStage = useAppStore((s) => s.currentStage);
  const updateStreak = useAppStore((s) => s.updateStreak);
  const login = useAppStore((s) => s.login);
  const logout = useAppStore((s) => s.logout);
  const [showIdentity, setShowIdentity] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  // Validate the stored JWT on mount and sync with Zustand state
  useEffect(() => {
    const session = getSession();
    if (session && !isLoggedIn) {
      login(session.email);
    } else if (!session && isLoggedIn) {
      logout();
    }
    setAuthChecking(false);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      updateStreak();
    }
  }, [isLoggedIn]);

  // Show nothing while checking auth to avoid a flash of wrong content
  if (authChecking) {
    return <div className="min-h-dvh bg-navy" />;
  }

  if (!isLoggedIn) {
    return <AuthWrapper />;
  }

  if (showIdentity) {
    return (
      <IdentityEngine
        onComplete={() => setShowIdentity(false)}
      />
    );
  }

  return (
    <AppShell>
      {currentStage === 0 ? (
        <Dashboard onOpenIdentity={() => setShowIdentity(true)} />
      ) : (
        <StageView stageId={currentStage} key={currentStage} />
      )}
    </AppShell>
  );
}
