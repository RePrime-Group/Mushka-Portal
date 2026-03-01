import { useMemo, useEffect, useRef, useState } from "react";
import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import { motion } from "motion/react";
import { useAppStore } from "../../store/useAppStore";
import { ALL_ITEMS } from "../../data/items";
import { ROTATION_ORDER } from "../../data/rotationOrder";
import type { AssessmentItem, ItemResponse } from "../../store/types";
import ProgressBar from "./ProgressBar";
import confetti from "canvas-confetti";

// ─── Item lookup ─────────────────────────────────────────────────────────────

const itemMap = new Map<string, AssessmentItem>();
for (const item of ALL_ITEMS) itemMap.set(item.id, item);

const TOTAL_ITEMS = ROTATION_ORDER.length;
const MIDPOINT = 21;

// ─── Build SurveyJS JSON model ───────────────────────────────────────────────
// One page per item. SurveyJS handles the page-by-page presentation.
// Navigation buttons, progress bar, and title are all suppressed —
// we provide our own custom progress bar and auto-advance logic.

function buildSurveyJson() {
  return {
    showNavigationButtons: "none",
    showProgressBar: "off",
    showTitle: false,
    showCompletedPage: false,
    questionErrorLocation: "bottom",
    pages: ROTATION_ORDER.map((itemId, index) => {
      const item = itemMap.get(itemId)!;
      const choices = item.options.map((opt) => ({
        value: opt.value,
        text: opt.prefix ? `${opt.prefix}   ${opt.label}` : opt.label,
      }));
      return {
        name: `page_${index}`,
        elements: [
          {
            type: "radiogroup",
            name: itemId,
            title: item.text,
            titleLocation: "top",
            choices,
            isRequired: false,
            colCount: 1,
          },
        ],
      };
    }),
  };
}

// ─── Component ───────────────────────────────────────────────────────────────

interface AssessmentEngineProps {
  onComplete: () => void;
}

export default function AssessmentEngine({ onComplete }: AssessmentEngineProps) {
  const currentItemIndex = useAppStore((s) => s.assessmentState.currentItemIndex);
  const recordResponse = useAppStore((s) => s.recordResponse);

  const [showMidpoint, setShowMidpoint] = useState(false);
  // pageNo drives the ProgressBar; updated whenever the survey advances
  const [pageNo, setPageNo] = useState(currentItemIndex);

  const itemStartTime = useRef<number>(performance.now());
  const advanceTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Create the model once. Resume at the correct page if mid-assessment.
  const survey = useMemo(() => {
    const model = new Model(buildSurveyJson());
    model.currentPageNo = currentItemIndex;
    return model;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onValueChanged = (sender: Model, options: { name: string; value: number | string }) => {
      const pageIndex = sender.currentPageNo;
      const itemId = ROTATION_ORDER[pageIndex];
      const item = itemMap.get(itemId)!;
      const responseTimeMs = Math.round(performance.now() - itemStartTime.current);

      const response: ItemResponse = {
        itemId,
        instrumentId: item.instrumentId,
        value: options.value,
        responseTimeMs,
        timestamp: new Date().toISOString(),
        rotationIndex: pageIndex,
      };

      const delay = item.type === "knowledge" ? 600 : 400;

      if (advanceTimeout.current) clearTimeout(advanceTimeout.current);

      advanceTimeout.current = setTimeout(() => {
        recordResponse(response);

        if (pageIndex === MIDPOINT - 1) {
          setShowMidpoint(true);
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 },
            colors: ["#BC9C45", "#0E3470"],
          });
          setTimeout(() => {
            setShowMidpoint(false);
            if (pageIndex + 1 >= TOTAL_ITEMS) {
              onComplete();
            } else {
              sender.nextPage();
              itemStartTime.current = performance.now();
              setPageNo(sender.currentPageNo);
            }
          }, 2500);
        } else if (pageIndex + 1 >= TOTAL_ITEMS) {
          onComplete();
        } else {
          sender.nextPage();
          itemStartTime.current = performance.now();
          setPageNo(sender.currentPageNo);
        }
      }, delay);
    };

    survey.onValueChanged.add(onValueChanged);
    return () => {
      survey.onValueChanged.remove(onValueChanged);
      if (advanceTimeout.current) clearTimeout(advanceTimeout.current);
    };
  }, [survey, recordResponse, onComplete]);

  // ── Midpoint celebration ──────────────────────────────────────────────────

  if (showMidpoint) {
    return (
      <div className="min-h-dvh bg-cream flex items-center justify-center px-4 app-shell">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-sm"
        >
          <p className="text-lg text-navy font-medium leading-relaxed">
            Halfway there. You're doing something most people never bother to do.
          </p>
        </motion.div>
      </div>
    );
  }

  // ── Main render ───────────────────────────────────────────────────────────

  return (
    <div className="min-h-dvh bg-cream flex flex-col app-shell survey-host">
      {/* Custom progress bar — SurveyJS built-in is suppressed */}
      <div className="px-4 pt-4 pb-3 sm:px-6 md:px-8 max-w-2xl mx-auto w-full">
        <ProgressBar current={pageNo + 1} total={TOTAL_ITEMS} />
      </div>

      {/* SurveyJS renders one page (one item) at a time */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 md:px-8 pb-8">
        <div className="w-full max-w-md md:max-w-xl lg:max-w-2xl">
          <Survey model={survey} />
        </div>
      </div>
    </div>
  );
}
