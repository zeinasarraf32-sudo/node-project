'use client';

import {
  useEffect,
  useRef,
} from 'react';

import { Bot } from 'lucide-react';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
}

interface ChatMessageListProps {
  messages: Message[];
  loading: boolean;
}

export default function ChatMessageList({
  messages,
  loading,
}: ChatMessageListProps) {
  const bottomRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [messages, loading]);

  return (
    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex gap-3 ${
            message.sender === 'user'
              ? 'justify-end'
              : 'justify-start'
          }`}
        >
          {message.sender === 'bot' && (
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
              <Bot className="w-4 h-4" />
            </div>
          )}

          <div
            className={`max-w-xl rounded-2xl p-4 text-sm leading-relaxed whitespace-pre-wrap ${
              message.sender === 'user'
                ? 'bg-blue-600 text-white font-medium rounded-br-none'
                : 'bg-white border border-gray-100 text-gray-800 shadow-sm rounded-bl-none'
            }`}
          >
            {message.text}
          </div>
        </div>
      ))}

      {loading && (
        <div className="flex gap-3 justify-start">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
            <Bot className="w-4 h-4" />
          </div>

          <div className="bg-white border border-gray-100 text-gray-500 shadow-sm rounded-2xl rounded-bl-none px-4 py-3 text-sm">
            Thinking...
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}