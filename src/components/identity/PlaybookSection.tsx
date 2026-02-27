import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { PlaybookSection as PlaybookSectionType } from "../../store/types";

interface PlaybookSectionProps {
  section: PlaybookSectionType;
  defaultOpen?: boolean;
}

export default function PlaybookSection({ section, defaultOpen = true }: PlaybookSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="ie-playbook-section">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-2 text-left min-h-[44px]"
      >
        <h3 className="font-semibold text-navy text-base">{section.title}</h3>
        <svg
          className={`w-4 h-4 text-warm-gray transition-transform shrink-0 ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pb-4 text-sm text-stone-700 leading-relaxed whitespace-pre-wrap">
              {section.content.split(/\*\*(.*?)\*\*/g).map((part, i) =>
                i % 2 === 1 ? <strong key={i}>{part}</strong> : part
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
