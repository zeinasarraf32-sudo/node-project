'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Heart,
  Bot,
  Paperclip,
  Mic,
  Send,
  Star,
  Calendar,
  ChevronRight,
} from 'lucide-react';

interface DoctorRecommendation {
  name: string;
  specialty: string;
  rating: number;
  avatar: string;
  nextAvailable: string;
  bookingUrl: string;
}

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  doctorCard?: DoctorRecommendation;
}

const PRESET_QUESTIONS = [
  'I have chest pain and shortness of breath',
  "I've had a severe headache for 3 days",
  'My knee has been swollen and painful',
  "I have a rash that won't go away",
];

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: "Hello! I'm your QuickCare health assistant. Please describe your symptoms and I'll help you find the right medical specialist and book an appointment. How are you feeling today?",
    },
  ]);
  const [inputText, setInputText] = useState('');

  const handleSendMessage = (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: queryText,
    };

    let botReply: Message = {
      id: (Date.now() + 1).toString(),
      sender: 'bot',
      text: "Thank you for sharing. Based on your symptoms, I recommend scheduling a consultation with a general practitioner for further evaluation.",
    };

    if (queryText.toLowerCase().includes('headache')) {
      botReply = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: 'A persistent severe headache for multiple days warrants evaluation by a Neurologist. This could be related to migraines, tension headaches, or other neurological conditions. I recommend seeing:',
        doctorCard: {
          name: 'د. جمال عيسى',
          specialty: 'Neurology',
          rating: 4.8,
          avatar:
            'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
          nextAvailable: 'Tomorrow, 2:00 PM',
          bookingUrl: '/book',
        },
      };
    } else if (queryText.toLowerCase().includes('chest pain')) {
      botReply = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: 'Chest pain and shortness of breath require immediate medical attention from a Cardiologist:',
        doctorCard: {
          name: 'Dr. Sara Al-Halabi',
          specialty: 'Cardiologist',
          rating: 4.9,
          avatar:
            'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
          nextAvailable: 'Today, 4:00 PM',
          bookingUrl: '/booking',
        },
      };
    }

    setMessages((prev) => [...prev, userMsg, botReply]);
    setInputText('');
  };

  return (
    <div className="min-h-[85vh] bg-slate-50/60 py-6 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="max-w-3xl w-full flex flex-col justify-start gap-3">
        {/* Assistant Header Card */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-sm">
            <Heart className="w-5 h-5 fill-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900 text-base">QuickCare Assistant</h1>
            <p className="text-xs text-gray-500 flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              Online · Powered by AI
            </p>
          </div>
        </div>

        {/* Chat Messages Stream (Compact spacing with auto scroll) */}
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
          {messages.map((msg) => (
            <div key={msg.id} className="space-y-3">
              <div
                className={`flex gap-3 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-xl rounded-2xl p-4 text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white font-medium rounded-br-none'
                      : 'bg-white border border-gray-100 text-gray-800 shadow-sm rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>

              {/* Doctor Card */}
              {msg.doctorCard && (
                <div className="pl-11 max-w-sm">
                  <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image
                          src={msg.doctorCard.avatar}
                          alt={msg.doctorCard.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="space-y-0.5">
                        <h3 className="font-bold text-gray-900 text-sm">
                          {msg.doctorCard.name}
                        </h3>
                        <p className="text-xs text-blue-600 font-semibold">
                          {msg.doctorCard.specialty}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-gray-500 font-semibold pt-0.5">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{msg.doctorCard.rating}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-emerald-50/80 border border-emerald-100 rounded-xl px-3 py-2 flex items-center gap-2 text-emerald-700 text-xs font-semibold">
                      <Calendar className="w-4 h-4 text-emerald-600" />
                      <span>Next available: {msg.doctorCard.nextAvailable}</span>
                    </div>

                    <Link
                      href={msg.doctorCard.bookingUrl}
                      className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition flex items-center justify-center gap-1 shadow-sm"
                    >
                      <span>Book Appointment</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Preset Question Pills */}
        {messages.length <= 1 && (
          <div className="flex flex-wrap gap-2">
            {PRESET_QUESTIONS.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => handleSendMessage(q)}
                className="px-4 py-2 bg-blue-50/70 hover:bg-blue-100/70 text-blue-600 border border-blue-100/80 rounded-full text-xs font-semibold transition text-left"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
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
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
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
              onClick={() => handleSendMessage(inputText)}
              className="w-9 h-9 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center transition shadow-sm flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          <p className="text-center text-[11px] text-gray-400 font-medium">
            QuickCare provides recommendations, not medical diagnoses. Always consult a licensed physician.
          </p>
        </div>
      </div>
    </div>
  );
}