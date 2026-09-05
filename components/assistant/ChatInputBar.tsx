'use client';

import { KeyboardEvent } from 'react';
import { Send } from 'lucide-react';

interface ChatInputBarProps {
  inputText: string;
  setInputText: (value: string) => void;
  onSendMessage: (value: string) => void;
  loading: boolean;
}

export default function ChatInputBar({
  inputText,
  setInputText,
  onSendMessage,
  loading,
}: ChatInputBarProps) {
  const handleKeyDown = (
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (
      event.key === 'Enter' &&
      !loading &&
      inputText.trim()
    ) {
      event.preventDefault();
      onSendMessage(inputText);
    }
  };

  return (
    <div className="space-y-2">
      <div className="bg-white rounded-2xl border border-gray-200/80 p-2 pl-4 flex items-center gap-3 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition">
        <input
          type="text"
          value={inputText}
          onChange={(event) =>
            setInputText(event.target.value)
          }
          onKeyDown={handleKeyDown}
          placeholder="Describe your symptoms..."
          disabled={loading}
          className="w-full text-sm text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent disabled:opacity-60"
        />

        <button
          type="button"
          onClick={() =>
            onSendMessage(inputText)
          }
          disabled={
            loading || !inputText.trim()
          }
          className="w-9 h-9 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center transition shadow-sm flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      <p className="text-center text-[11px] text-gray-400 font-medium">
        QuickCare provides recommendations, not medical diagnoses.
        Always consult a licensed physician.
      </p>
    </div>
  );
}