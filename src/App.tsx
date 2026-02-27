import { useEffect, useState } from "react";
import { useAppStore } from "./store/useAppStore";
import LoginScreen from "./components/auth/LoginScreen";
import AppShell from "./components/layout/AppShell";
import Dashboard from "./components/dashboard/Dashboard";
import StageView from "./components/stages/StageView";
import IdentityEngine from "./components/identity/IdentityEngine";

export default function App() {
  const isLoggedIn = useAppStore((s) => s.isLoggedIn);
  const currentStage = useAppStore((s) => s.currentStage);
  const updateStreak = useAppStore((s) => s.updateStreak);
  const [showIdentity, setShowIdentity] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      updateStreak();
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return <LoginScreen />;
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
        <StageView stageId={currentStage} />
      )}
    </AppShell>
  );
}
