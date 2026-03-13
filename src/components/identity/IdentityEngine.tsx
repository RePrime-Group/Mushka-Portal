import { useState, useEffect, useCallback } from "react";
import { useAppStore } from "../../store/useAppStore";
import { computeAllScores } from "../../engine/scorer";
import { runValidityChecks } from "../../engine/validator";
import { computeDomainScores } from "../../engine/aggregator";
import type { PlaybookSection } from "../../store/types";
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

  // Restore the correct phase from persisted state on mount.
  // If completed with a playbookError, go straight to results so the retry
  // button is visible rather than showing the scoring spinner indefinitely.
  const getInitialPhase = (): Phase => {
    if (assessmentState.completed && (assessmentState.playbook || assessmentState.playbookError)) {
      return "results";
    }
    if (assessmentState.completed) return "scoring";
    if (assessmentState.started) return "assessment";
    return "welcome";
  };

  const [phase, setPhase] = useState<Phase>(getInitialPhase);

  // ── Playbook fetch (shared by initial completion and retry) ───────────────

  const fetchPlaybook = useCallback(
    async (
      scores: Record<string, any>,
      domainScores: any,
      validity: any,
      responses: any[]
    ) => {
      setPlaybookLoading(true);

      // Hard timeout — give the LLM up to 2 minutes
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 120000);

      try {
        const res = await fetch("/api/playbook", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            scores,
            domainScores,
            validity: { status: validity.status },
            responses: responses.map((r: any) => ({
              itemId: r.itemId,
              instrumentId: r.instrumentId,
              value: r.value,
              responseTimeMs: r.responseTimeMs,
            })),
          }),
        });

        if (!res.ok) throw new Error(`Playbook API ${res.status}`);

        const data = await res.json();
        const sections: PlaybookSection[] = data.sections ?? [];
        if (sections.length === 0) throw new Error("Empty playbook response");

        setPlaybook(sections);

        // Fire-and-forget results email (non-blocking — failure is acceptable)
        const state = useAppStore.getState();
        if (!state.assessmentState.emailsSent) {
          sendResultsEmail(scores, domainScores, validity, sections, responses);
          markAssessmentEmailsSent();
        }
      } catch (err: any) {
        const isTimeout = err.name === "AbortError";
        setPlaybookError(
          isTimeout
            ? "Playbook timed out. Your scores are saved — tap Retry to try again."
            : "Playbook generation failed. Your scores are saved — tap Retry to try again."
        );
      } finally {
        clearTimeout(timeout);
      }
    },
    [setPlaybook, setPlaybookLoading, setPlaybookError, markAssessmentEmailsSent]
  );

  // ── Handlers ──────────────────────────────────────────────────────────────

  function handleStart() {
    if (!assessmentState.started) startAssessment();
    setPhase("assessment");
  }

  async function handleAssessmentComplete() {
    setPhase("scoring");

    const responses = useAppStore.getState().assessmentState.responses;
    const scores = computeAllScores(responses);
    const validity = runValidityChecks(responses);
    const domainScores = computeDomainScores(scores);

    setAssessmentScores(scores, domainScores, validity);
    await fetchPlaybook(scores, domainScores, validity, responses);
    setPhase("results");
  }

  const handleRetryPlaybook = useCallback(async () => {
    const { scores, domainScores, validity, responses } =
      useAppStore.getState().assessmentState;
    if (!domainScores || !validity) return;
    await fetchPlaybook(scores, domainScores, validity, responses);
  }, [fetchPlaybook]);

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
        body: JSON.stringify({ scores, domainScores, validity, playbook, responses, userEmail: useAppStore.getState().email }),
      });
    } catch {
      console.error("Results email failed — non-blocking");
    }
  }

  // ── Side-effects ──────────────────────────────────────────────────────────

  // Transition scoring → results once the playbook or an error arrives.
  useEffect(() => {
    if (
      phase === "scoring" &&
      assessmentState.completed &&
      (assessmentState.playbook || assessmentState.playbookError)
    ) {
      setPhase("results");
    }
  }, [phase, assessmentState.completed, assessmentState.playbook, assessmentState.playbookError]);

  // Auto-resume: if the app was closed mid-scoring (rehydrated from localStorage
  // with completed=true but no playbook and no active fetch), retry automatically.
  useEffect(() => {
    if (phase !== "scoring") return;
    const { completed, playbook, playbookLoading, playbookError } =
      useAppStore.getState().assessmentState;
    if (completed && !playbook && !playbookError && !playbookLoading) {
      handleRetryPlaybook().then(() => setPhase("results"));
    }
  }, [phase, handleRetryPlaybook]);

  // ── Render ────────────────────────────────────────────────────────────────

  switch (phase) {
    case "welcome":
      return <WelcomeScreen onStart={handleStart} />;
    case "assessment":
      return <AssessmentEngine onComplete={handleAssessmentComplete} />;
    case "scoring":
      return <ScoringScreen />;
    case "results":
      return (
        <ResultsView
          onBackToDashboard={onComplete}
          onRetryPlaybook={handleRetryPlaybook}
        />
      );
  }
}
