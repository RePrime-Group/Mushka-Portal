import { useEffect } from "react";
import { useAppStore } from "./store/useAppStore";
import LoginScreen from "./components/auth/LoginScreen";
import AppShell from "./components/layout/AppShell";
import Dashboard from "./components/dashboard/Dashboard";
import StageView from "./components/stages/StageView";

export default function App() {
  const isLoggedIn = useAppStore((s) => s.isLoggedIn);
  const currentStage = useAppStore((s) => s.currentStage);
  const updateStreak = useAppStore((s) => s.updateStreak);

  useEffect(() => {
    if (isLoggedIn) {
      updateStreak();
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return <LoginScreen />;
  }

  return (
    <AppShell>
      {currentStage === 0 ? <Dashboard /> : <StageView stageId={currentStage} />}
    </AppShell>
  );
}
