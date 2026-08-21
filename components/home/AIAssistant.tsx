'use client';

const suggestions = [
  'I have chest pain',
  'Severe headache for 3 days',
  'My knee is swollen',
  'I have a skin rash',
];

export default function AIAssistant() {
  return (
    <div className="ai-card flex flex-col justify-between min-h-[360px]">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <div className="ai-badge-icon">
          🧠
        </div>
        <div>
          <h2 className="font-semibold text-white">
            QuickCare Assistant
          </h2>
          <p className="text-sm text-white/60">
            ● Online • Ready to help
          </p>
        </div>
      </div>

      {/* Greeting Bubble with Icon */}
      {/* Greeting Bubble with Icon */}
<div className="flex items-center gap-3 mt-4 mb-12">
  <div className="w-8 h-8 bg-blue-500/80 border border-white/20 rounded-xl flex items-center justify-center text-sm shrink-0 shadow-sm">
    🧠
  </div>
  <div className="ai-message-bubble text-xs leading-relaxed">
    Hi! Describe your symptoms and I'll find <br />
    the right doctor for you in Tripoli. 🩺
  </div>
</div>

      {/* Bottom Section (Pushed Down) */}
      <div className="mt-auto space-y-4">
        {/* Suggestion Chips - Single Line */}
        <div className="flex flex-nowrap gap-2 overflow-x-auto no-scrollbar">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              className="ai-chip whitespace-nowrap text-xs px-3 py-1.5 shrink-0"
            >
              {suggestion}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="ai-input-wrapper">
          <input
            type="text"
            placeholder="Describe your symptoms..."
            className="ai-input text-xs"
          />
          <button
            type="button"
            className="ai-send-btn"
            aria-label="Send query"
          >
            →
          </button>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-[10px] text-white/50">
          QuickCare provides recommendations, not medical diagnoses.
        </p>
      </div>
    </div>
  );
}