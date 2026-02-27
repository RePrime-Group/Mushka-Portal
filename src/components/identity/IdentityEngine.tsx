import { useState, useEffect } from "react";
import { useAppStore } from "../../store/useAppStore";
import { computeAllScores } from "../../engine/scorer";
import { runValidityChecks } from "../../engine/validator";
import { computeDomainScores } from "../../engine/aggregator";
import WelcomeScreen from "./WelcomeScreen";
import AssessmentEngine from "./AssessmentEngine";
import ScoringScreen from "./ScoringScreen";
import ResultsView from "./ResultsView";

type Phase = "welcome" | "assessment" | "scoring" | "results";

interface IdentityEngineProps {
  onComplete: () => void;
}

export default function IdentityEngine({ onComplete }: IdentityEngineProps) {
  const assessmentState = useAppStore((s) => s.assessmentState);
  const startAssessment = useAppStore((s) => s.startAssessment);
  const setAssessmentScores = useAppStore((s) => s.setAssessmentScores);
  const setPlaybook = useAppStore((s) => s.setPlaybook);
  const setPlaybookLoading = useAppStore((s) => s.setPlaybookLoading);
  const setPlaybookError = useAppStore((s) => s.setPlaybookError);
  const markAssessmentEmailsSent = useAppStore((s) => s.markAssessmentEmailsSent);

  // Determine initial phase from persisted state
  const getInitialPhase = (): Phase => {
    if (assessmentState.completed && assessmentState.playbook) return "results";
    if (assessmentState.completed) return "scoring";
    if (assessmentState.started && assessmentState.currentItemIndex > 0) return "assessment";
    if (assessmentState.started) return "assessment";
    return "welcome";
  };

  const [phase, setPhase] = useState<Phase>(getInitialPhase);

  function handleStart() {
    if (!assessmentState.started) {
      startAssessment();
    }
    setPhase("assessment");
  }

  async function handleAssessmentComplete() {
    setPhase("scoring");

    // Run scoring client-side
    const responses = useAppStore.getState().assessmentState.responses;
    const scores = computeAllScores(responses);
    const validity = runValidityChecks(responses);
    const domainScores = computeDomainScores(scores);

    setAssessmentScores(scores, domainScores, validity);

    // Call playbook API in parallel
    setPlaybookLoading(true);
    try {
      const res = await fetch("/api/playbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scores,
          domainScores,
          validity: { status: validity.status },
          responses: responses.map((r) => ({
            itemId: r.itemId,
            instrumentId: r.instrumentId,
            value: r.value,
            responseTimeMs: r.responseTimeMs,
          })),
        }),
      });

      if (!res.ok) throw new Error("Playbook API error");

      const data = await res.json();
      const sections = data.sections || [];
      setPlaybook(sections);

      // Send results emails
      const state = useAppStore.getState();
      if (!state.assessmentState.emailsSent) {
        sendResultsEmail(scores, domainScores, validity, sections, responses);
        markAssessmentEmailsSent();
      }
    } catch (err) {
      setPlaybookError("Playbook generation failed. Your scores have been saved.");
      // Still show results even without playbook
    }

    setPhase("results");
  }

  async function sendResultsEmail(
    scores: Record<string, any>,
    domainScores: any,
    validity: any,
    playbook: any[],
    responses: any[]
  ) {
    try {
      await fetch("/api/send-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scores, domainScores, validity, playbook, responses }),
      });
    } catch {
      console.error("Results email failed");
    }
  }

  // If we're in scoring phase but already have scores, check for playbook
  useEffect(() => {
    if (phase === "scoring" && assessmentState.completed && assessmentState.playbook) {
      setPhase("results");
    }
  }, [phase, assessmentState.completed, assessmentState.playbook]);

  switch (phase) {
    case "welcome":
      return <WelcomeScreen onStart={handleStart} />;
    case "assessment":
      return <AssessmentEngine onComplete={handleAssessmentComplete} />;
    case "scoring":
      return <ScoringScreen />;
    case "results":
      return <ResultsView onBackToDashboard={onComplete} />;
  }
}
