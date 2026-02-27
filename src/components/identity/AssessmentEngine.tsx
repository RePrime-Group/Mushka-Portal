import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAppStore } from "../../store/useAppStore";
import { ALL_ITEMS } from "../../data/items";
import { ROTATION_ORDER } from "../../data/rotationOrder";
import type { AssessmentItem, ItemResponse } from "../../store/types";
import LikertCard from "./LikertCard";
import KnowledgeCard from "./KnowledgeCard";
import ProgressBar from "./ProgressBar";
import confetti from "canvas-confetti";

const TOTAL_ITEMS = ROTATION_ORDER.length; // 41
const MIDPOINT = 21; // Show celebration after item 21

// Build item lookup map
const itemMap = new Map<string, AssessmentItem>();
for (const item of ALL_ITEMS) {
  itemMap.set(item.id, item);
}

interface AssessmentEngineProps {
  onComplete: () => void;
}

export default function AssessmentEngine({ onComplete }: AssessmentEngineProps) {
  const currentItemIndex = useAppStore((s) => s.assessmentState.currentItemIndex);
  const recordResponse = useAppStore((s) => s.recordResponse);

  const [selected, setSelected] = useState<number | string | null>(null);
  const [showMidpoint, setShowMidpoint] = useState(false);
  const itemStartTime = useRef<number>(performance.now());
  const advanceTimeout = useRef<ReturnType<typeof setTimeout>>();

  // Current item from rotation order
  const currentItemId = ROTATION_ORDER[currentItemIndex];
  const currentItem = currentItemId ? itemMap.get(currentItemId) : undefined;

  // Reset timer when item changes
  useEffect(() => {
    itemStartTime.current = performance.now();
    setSelected(null);
    return () => {
      if (advanceTimeout.current) clearTimeout(advanceTimeout.current);
    };
  }, [currentItemIndex]);

  const handleSelect = useCallback((value: number | string) => {
    if (selected !== null) return; // Prevent double-selection
    setSelected(value);

    const responseTimeMs = Math.round(performance.now() - itemStartTime.current);

    const response: ItemResponse = {
      itemId: currentItemId,
      instrumentId: currentItem!.instrumentId,
      value,
      responseTimeMs,
      timestamp: new Date().toISOString(),
      rotationIndex: currentItemIndex,
    };

    const delay = currentItem!.type === 'knowledge' ? 600 : 400;

    advanceTimeout.current = setTimeout(() => {
      recordResponse(response);

      // Check if we just hit midpoint
      if (currentItemIndex === MIDPOINT - 1) {
        setShowMidpoint(true);
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ["#BC9C45", "#0E3470"],
        });
        setTimeout(() => {
          setShowMidpoint(false);
          if (currentItemIndex + 1 >= TOTAL_ITEMS) {
            onComplete();
          }
        }, 2500);
      } else if (currentItemIndex + 1 >= TOTAL_ITEMS) {
        onComplete();
      }
    }, delay);
  }, [selected, currentItemId, currentItem, currentItemIndex, recordResponse, onComplete]);

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

  if (!currentItem) return null;

  const isKnowledge = currentItem.type === 'knowledge';

  return (
    <div className="min-h-dvh bg-cream flex flex-col app-shell">
      <div className="px-4 pt-4 pb-3 sm:px-6">
        <ProgressBar current={currentItemIndex + 1} total={TOTAL_ITEMS} />
      </div>

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentItemId}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.2 }}
            className="max-w-md w-full"
          >
            {isKnowledge ? (
              <>
                <div className="bg-stone-50 rounded-xl p-4 mb-5">
                  <p className="text-sm text-stone-700 leading-relaxed">
                    {currentItem.text}
                  </p>
                </div>
                <div className="space-y-2.5">
                  {currentItem.options.map((option) => (
                    <KnowledgeCard
                      key={String(option.value)}
                      option={option}
                      selected={selected === option.value}
                      hasSelection={selected !== null}
                      onSelect={() => handleSelect(option.value)}
                    />
                  ))}
                </div>
              </>
            ) : (
              <>
                <p className="text-lg text-navy font-medium text-center leading-relaxed mb-8 px-2">
                  {currentItem.text}
                </p>
                <div className="space-y-2.5">
                  {currentItem.options.map((option) => (
                    <LikertCard
                      key={String(option.value)}
                      option={option}
                      selected={selected === option.value}
                      hasSelection={selected !== null}
                      onSelect={() => handleSelect(option.value)}
                    />
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
