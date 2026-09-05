'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

const suggestions = [
  'I have chest pain',
  'Severe headache for 3 days',
  'My knee is swollen',
  'I have a skin rash',
];

export default function AIAssistant() {
  const router = useRouter();
  const [inputText, setInputText] = useState('');

  const openAssistant = (message?: string) => {
    const trimmedMessage = message?.trim();

    if (trimmedMessage) {
      router.push(
        `/AIassistant?q=${encodeURIComponent(trimmedMessage)}`
      );
      return;
    }

    router.push('/AIassistant');
  };

  const handleSuggestionClick = (
    suggestion: string
  ) => {
    setInputText(suggestion);
  };

  const handleSubmit = (
    event?: FormEvent<HTMLFormElement>
  ) => {
    event?.preventDefault();

    openAssistant(inputText);
  };

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

      {/* Greeting */}
      <div className="flex items-center gap-3 mt-4 mb-12">
        <div className="w-8 h-8 bg-blue-500/80 border border-white/20 rounded-xl flex items-center justify-center text-sm shrink-0 shadow-sm">
          🧠
        </div>

        <div className="ai-message-bubble text-xs leading-relaxed">
          Hi! Describe your symptoms and I&apos;ll help
          guide you to the appropriate type of doctor. 🩺
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-auto space-y-4">
        {/* Suggestions */}
        <div className="flex flex-nowrap gap-2 overflow-x-auto no-scrollbar">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() =>
                handleSuggestionClick(suggestion)
              }
              className="ai-chip whitespace-nowrap text-xs px-3 py-1.5 shrink-0"
            >
              {suggestion}
            </button>
          ))}
        </div>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="ai-input-wrapper"
        >
          <input
            type="text"
            value={inputText}
            onChange={(event) =>
              setInputText(event.target.value)
            }
            placeholder="Describe your symptoms..."
            className="ai-input text-xs"
          />

          <button
            type="submit"
            className="ai-send-btn"
            aria-label="Open QuickCare AI Assistant"
          >
            →
          </button>
        </form>

        {/* Disclaimer */}
        <p className="text-center text-[10px] text-white/50">
          QuickCare provides guidance, not medical diagnoses.
        </p>
      </div>
    </div>
  );
}