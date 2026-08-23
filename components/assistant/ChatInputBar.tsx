import { Paperclip, Mic, Send } from 'lucide-react';

interface ChatInputBarProps {
  inputText: string;
  setInputText: (val: string) => void;
  onSendMessage: (val: string) => void;
}

export default function ChatInputBar({
  inputText,
  setInputText,
  onSendMessage,
}: ChatInputBarProps) {
  return (
    <div className="space-y-2">
      <div className="bg-white rounded-2xl border border-gray-200/80 p-2 pl-4 flex items-center gap-3 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition">
        <button
          type="button"
          className="text-gray-400 hover:text-gray-600 transition"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSendMessage(inputText)}
          placeholder="Describe your symptoms..."
          className="w-full text-sm text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent"
        />

        <button
          type="button"
          className="text-gray-400 hover:text-gray-600 transition"
        >
          <Mic className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={() => onSendMessage(inputText)}
          className="w-9 h-9 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center transition shadow-sm flex-shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      <p className="text-center text-[11px] text-gray-400 font-medium">
        QuickCare provides recommendations, not medical diagnoses. Always consult a licensed physician.
      </p>
    </div>
  );
}