'use client';

import {
  Suspense,
  useState,
} from 'react';

import { useSearchParams } from 'next/navigation';

import AssistantHeader from '@/components/assistant/AssistantHeader';
import ChatMessageList from '@/components/assistant/ChatMessageList';
import PresetQuestions from '@/components/assistant/PresetQuestions';
import ChatInputBar from '@/components/assistant/ChatInputBar';

import { axiosPost } from '@/lib/axios';
import { IChatMessage } from '@/interfaces/interfaces';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
}

const PRESET_QUESTIONS = [
  'I have chest pain and shortness of breath',
  "I've had a severe headache for 3 days",
  'My knee has been swollen and painful',
  "I have a rash that won't go away",
];

const WELCOME_MESSAGE: Message = {
  id: 'welcome-message',
  sender: 'bot',
  text:
    "Hello! I'm your QuickCare health assistant. " +
    "Please describe your symptoms and I'll help you understand " +
    'which type of medical specialist may be appropriate. ' +
    'How are you feeling today?',
};

function AIAssistantContent() {
  const searchParams = useSearchParams();

  const initialQuery =
    searchParams.get('q')?.trim() || '';

  const [messages, setMessages] =
    useState<Message[]>([WELCOME_MESSAGE]);

  const [inputText, setInputText] =
    useState(initialQuery);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  async function handleSendMessage(
    queryText: string
  ) {
    const trimmed = queryText.trim();

    if (!trimmed || loading) {
      return;
    }

    const userMessage: Message = {
      id: `${Date.now()}-user`,
      sender: 'user',
      text: trimmed,
    };

    const nextMessages = [
      ...messages,
      userMessage,
    ];

    setMessages(nextMessages);
    setInputText('');
    setError(null);
    setLoading(true);

    const apiMessages: IChatMessage[] =
      nextMessages
        .filter(
          (message) =>
            message.id !== 'welcome-message'
        )
        .map((message) => ({
          role:
            message.sender === 'user'
              ? 'user'
              : 'assistant',
          content: message.text,
        }));

    try {
      const response = await axiosPost<
        {
          messages: IChatMessage[];
        },
        {
          reply: string;
        }
      >(
        'chat',
        {
          messages: apiMessages,
        }
      );

      const reply =
        response.data?.reply?.trim();

      const assistantMessage: Message = {
        id: `${Date.now()}-assistant`,
        sender: 'bot',
        text:
          reply ||
          'Sorry, I could not generate a response. Please try again.',
      };

      setMessages((previousMessages) => [
        ...previousMessages,
        assistantMessage,
      ]);
    } catch {
      setError(
        "Couldn't reach the assistant. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[85vh] bg-slate-50/60 py-6 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="max-w-3xl w-full flex flex-col justify-start gap-3">
        {/* Assistant Header */}
        <AssistantHeader />

        {/* Messages */}
        <ChatMessageList
          messages={messages}
          loading={loading}
        />

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            <p className="text-sm text-red-600">
              {error}
            </p>
          </div>
        )}

        {/* Preset Questions */}
        {messages.length === 1 && (
          <PresetQuestions
            questions={PRESET_QUESTIONS}
            onSelectQuestion={
              handleSendMessage
            }
          />
        )}

        {/* Input */}
        <ChatInputBar
          inputText={inputText}
          setInputText={setInputText}
          onSendMessage={
            handleSendMessage
          }
          loading={loading}
        />
      </div>
    </div>
  );
}

export default function AIAssistantPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[85vh] bg-slate-50/60 flex items-center justify-center">
          <p className="text-sm text-slate-500">
            Loading assistant...
          </p>
        </div>
      }
    >
      <AIAssistantContent />
    </Suspense>
  );
}