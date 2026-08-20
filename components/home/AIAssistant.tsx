'use client';

const suggestions = [
  'I have chest pain',
  'Severe headache for 3 days',
  'My knee is swollen',
  'I have a skin rash',
];

export default function AIAssistant() {
  return (
    <div className="ai-card">
      {/* Header */}
      <div className="flex items-center gap-3">
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

      {/* Greeting Bubble */}
      <div className="ai-message-bubble">
        Hi! Describe your symptoms and I'll find the right doctor for you in Tripoli.
      </div>

      {/* Suggestion Chips */}
      <div className="mt-4 flex flex-wrap gap-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            className="ai-chip"
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
          className="ai-input"
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
      <p className="mt-4 text-center text-xs text-white/50">
        QuickCare provides recommendations, not medical diagnoses.
      </p>
    </div>
  );
}