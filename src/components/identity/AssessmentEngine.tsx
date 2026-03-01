import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAppStore } from "../../store/useAppStore";
import { ALL_ITEMS } from "../../data/items";
import { ROTATION_ORDER } from "../../data/rotationOrder";
import type { AssessmentItem, AssessmentOption, ItemResponse } from "../../store/types";
import ProgressBar from "./ProgressBar";
import confetti from "canvas-confetti";

// ─── Item lookup ─────────────────────────────────────────────────────────────

const itemMap = new Map<string, AssessmentItem>();
for (const item of ALL_ITEMS) itemMap.set(item.id, item);

const TOTAL_ITEMS = ROTATION_ORDER.length;
const MIDPOINT = 21;

// ─── Option button ────────────────────────────────────────────────────────────

interface OptionButtonProps {
  option: AssessmentOption;
  selected: boolean;
  anySelected: boolean;
  onSelect: () => void;
}

function OptionButton({ option, selected, anySelected, onSelect }: OptionButtonProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={anySelected}
      className={[
        "w-full text-left rounded-2xl border-2 px-4 py-4 transition-all duration-150 cursor-pointer",
        selected
          ? "border-[#BC9C45] bg-[#FBF5E6]"
          : anySelected
          ? "border-stone-200 bg-white opacity-40 cursor-default"
          : "border-stone-200 bg-white hover:border-[#d4c8a8] hover:bg-stone-50 active:scale-[0.99]",
      ].join(" ")}
    >
      <div className="flex items-center gap-3">
        {/* Letter badge for knowledge (A/B/C/D) items */}
        {option.prefix && (
          <span
            className={[
              "shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors",
              selected
                ? "bg-[#BC9C45] text-white border-[#BC9C45]"
                : "border-stone-300 text-stone-500",
            ].join(" ")}
          >
            {option.prefix}
          </span>
        )}

        <span
          className={[
            "text-[15px] leading-snug flex-1",
            selected ? "text-navy font-semibold" : "text-stone-700",
          ].join(" ")}
        >
          {option.label}
        </span>

        {/* Checkmark on selected */}
        {selected && (
          <svg
            className="shrink-0 w-5 h-5 text-[#BC9C45]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface AssessmentEngineProps {
  onComplete: () => void;
}

export default function AssessmentEngine({ onComplete }: AssessmentEngineProps) {
  const currentItemIndex = useAppStore((s) => s.assessmentState.currentItemIndex);
  const recordResponse = useAppStore((s) => s.recordResponse);

  const [showMidpoint, setShowMidpoint] = useState(false);
  // localIndex drives which item is displayed; starts at the store's persisted position
  const [localIndex, setLocalIndex] = useState(currentItemIndex);
  const [selected, setSelected] = useState<number | string | null>(null);

  const itemStartTime = useRef<number>(performance.now());
  const advanceTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const currentItem = itemMap.get(ROTATION_ORDER[localIndex])!;

  // Reset selection state each time we move to a new item
  useEffect(() => {
    setSelected(null);
    itemStartTime.current = performance.now();
  }, [localIndex]);

  const handleSelect = useCallback(
    (value: number | string) => {
      if (selected !== null) return; // guard against double-tap
      setSelected(value);

      const responseTimeMs = Math.round(performance.now() - itemStartTime.current);
      const response: ItemResponse = {
        itemId: currentItem.id,
        instrumentId: currentItem.instrumentId,
        value,
        responseTimeMs,
        timestamp: new Date().toISOString(),
        rotationIndex: localIndex,
      };

      // Knowledge items auto-advance slightly slower so the selection registers visually
      const delay = currentItem.type === "knowledge" ? 600 : 400;
      if (advanceTimeout.current) clearTimeout(advanceTimeout.current);

      advanceTimeout.current = setTimeout(() => {
        recordResponse(response);

        if (localIndex === MIDPOINT - 1) {
          // Midpoint celebration
          setShowMidpoint(true);
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 },
            colors: ["#BC9C45", "#0E3470"],
          });
          setTimeout(() => {
            setShowMidpoint(false);
            if (localIndex + 1 >= TOTAL_ITEMS) {
              onComplete();
            } else {
              setLocalIndex(localIndex + 1);
            }
          }, 2500);
        } else if (localIndex + 1 >= TOTAL_ITEMS) {
          onComplete();
        } else {
          setLocalIndex(localIndex + 1);
        }
      }, delay);
    },
    [selected, currentItem, localIndex, recordResponse, onComplete]
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (advanceTimeout.current) clearTimeout(advanceTimeout.current);
    };
  }, []);

  // ── Midpoint celebration screen ───────────────────────────────────────────

  if (showMidpoint) {
    return (
      <div className="min-h-dvh bg-cream flex items-center justify-center px-6 app-shell">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-xs"
        >
          <div className="text-4xl mb-4">🎯</div>
          <p className="text-xl font-semibold text-navy leading-relaxed mb-2">
            Halfway there.
          </p>
          <p className="text-base text-stone-600 leading-relaxed">
            You're doing something most people never bother to do.
          </p>
        </motion.div>
      </div>
    );
  }

  // ── Main assessment render ────────────────────────────────────────────────

  return (
    <div className="min-h-dvh bg-cream flex flex-col app-shell">
      {/* Progress bar */}
      <div className="px-3 pt-4 pb-3 sm:px-6 max-w-lg mx-auto w-full">
        <ProgressBar current={localIndex + 1} total={TOTAL_ITEMS} />
      </div>

      {/* Question area */}
      <div className="flex-1 flex items-center justify-center px-3 sm:px-5 pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={localIndex}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full max-w-lg"
          >
            {/* Question text */}
            <p className="text-lg sm:text-xl font-semibold text-navy text-center leading-relaxed mb-7 px-1">
              {currentItem.text}
            </p>

            {/* Answer options */}
            <div className="space-y-2.5">
              {currentItem.options.map((opt) => (
                <OptionButton
                  key={opt.value}
                  option={opt}
                  selected={selected === opt.value}
                  anySelected={selected !== null}
                  onSelect={() => handleSelect(opt.value)}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
