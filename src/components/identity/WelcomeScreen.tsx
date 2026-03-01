import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface WelcomeScreenProps {
  onStart: () => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-cream flex flex-col app-shell">
      <div className="px-4 pt-4 sm:px-6 md:px-8">
        <span className="text-sm font-semibold text-navy">RePrime Group</span>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full text-center"
        >
          <div className="mb-8">
            <h1 className="text-[28px] md:text-[32px] font-bold text-navy leading-tight mb-3">
              Discover Your Operating Style
            </h1>
            <p className="text-stone-600 text-base md:text-lg leading-relaxed">
              This 12-minute assessment maps how you think, learn, and work — so your AI training adapts to you.
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-10">
            <span className="ie-feature-pill">40 Questions</span>
            <span className="ie-feature-pill">12 Minutes</span>
            <span className="ie-feature-pill">Personalized Playbook</span>
          </div>

          <button
            onClick={onStart}
            className="ie-gold-btn min-h-[52px] mb-6"
          >
            Start My Assessment
          </button>

          <div>
            <button
              onClick={() => setDisclaimerOpen(!disclaimerOpen)}
              className="text-xs text-warm-gray hover:text-stone-600 transition-colors flex items-center gap-1 mx-auto min-h-[44px]"
            >
              <svg
                className={`w-3 h-3 transition-transform ${disclaimerOpen ? "rotate-180" : ""}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
              About this assessment
            </button>

            <AnimatePresence>
              {disclaimerOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="text-left text-[11px] text-warm-gray leading-relaxed bg-white rounded-xl p-4 mt-2 space-y-2">
                    <p>
                      This assessment uses validated psychometric instruments adapted for educational purposes.
                      It is not a clinical diagnostic tool and does not measure intelligence, aptitude, or personality disorders.
                    </p>
                    <p>
                      Your responses are used solely to personalize your AI training experience within the Mushka Portal.
                      Results are shared only with your designated training team at RePrime Group.
                    </p>
                    <p>
                      You may skip any question or stop the assessment at any time. Your participation is voluntary.
                      There are no right or wrong answers on the self-report items.
                    </p>
                    <p>
                      The knowledge-based questions assess prior familiarity, not ability. Your score reflects current
                      exposure, not potential.
                    </p>
                    <p>
                      All data is stored locally on your device and transmitted securely to Vercel-hosted serverless functions.
                      No data is sold or shared with third parties.
                    </p>
                    <p>
                      Assessment instruments include the New General Self-Efficacy Scale (Chen, Gully & Eden, 2001),
                      MSLQ Self-Efficacy subscale (Pintrich et al., 1991), Short Grit Scale (Duckworth & Quinn, 2009),
                      and MSLQ Metacognitive Self-Regulation items (Pintrich et al., 1991), adapted for this training context.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
