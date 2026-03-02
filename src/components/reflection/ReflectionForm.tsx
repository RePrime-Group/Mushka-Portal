import { useState } from "react";
import { motion } from "motion/react";

interface ReflectionFormProps {
  stageId: number;
  prompt: string;
  onSubmit: (reflection: string) => void;
  isSubmitting: boolean;
}

export default function ReflectionForm({
  stageId,
  prompt,
  onSubmit,
  isSubmitting,
}: ReflectionFormProps) {
  const [text, setText] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (text.trim().length < 20) return;
    onSubmit(text.trim());
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm"
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">{"\u{1F4DD}"}</span>
        <h3 className="font-semibold text-navy">Stage {stageId} Reflection</h3>
      </div>

      <p className="text-sm text-stone-600 leading-relaxed mb-4 italic">"{prompt}"</p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write your reflection here... (minimum 20 characters)"
        className="w-full h-40 px-4 py-3 rounded-xl border border-stone-200 bg-cream text-navy placeholder-warm-gray/50 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all resize-none text-sm"
      />

      <div className="flex items-center justify-between mt-3">
        <span className="text-xs text-warm-gray">
          {text.length} characters{text.length < 20 ? " (minimum 20)" : ""}
        </span>
        <button
          type="submit"
          disabled={text.trim().length < 20 || isSubmitting}
          className="px-6 py-2.5 bg-navy text-white rounded-xl font-medium hover:bg-navy-light active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer min-h-11"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Submitting...
            </span>
          ) : (
            "Submit Reflection"
          )}
        </button>
      </div>
    </motion.form>
  );
}
