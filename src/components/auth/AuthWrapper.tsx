import { useState } from "react";
import LoginScreen from "./LoginScreen";
import SignUpScreen from "./SignUpScreen";
import ForgotPasswordScreen from "./ForgotPasswordScreen";
import ResetPasswordScreen from "./ResetPasswordScreen";

type AuthMode = "signin" | "signup" | "forgot" | "reset";

function getInitialMode(): { mode: AuthMode; resetToken: string } {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  if (window.location.pathname === "/reset-password" && token) {
    return { mode: "reset", resetToken: token };
  }
  return { mode: "signin", resetToken: "" };
}

export default function AuthWrapper() {
  const initial = getInitialMode();
  const [mode, setMode] = useState<AuthMode>(initial.mode);
  const [resetToken] = useState(initial.resetToken);

  if (mode === "signup") {
    return <SignUpScreen onSignIn={() => setMode("signin")} />;
  }

  if (mode === "forgot") {
    return <ForgotPasswordScreen onSignIn={() => setMode("signin")} />;
  }

  if (mode === "reset") {
    return (
      <ResetPasswordScreen
        token={resetToken}
        onSignIn={() => setMode("signin")}
      />
    );
  }

  return (
    <LoginScreen
      onForgot={() => setMode("forgot")}
      onSignUp={() => setMode("signup")}
    />
  );
}
