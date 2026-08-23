'use client';

import { useState } from 'react';
import AssistantHeader from '@/components/assistant/AssistantHeader';
import ChatMessageList from '@/components/assistant/ChatMessageList';
import PresetQuestions from '@/components/assistant/PresetQuestions';
import ChatInputBar from '@/components/assistant/ChatInputBar';

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
          bookingUrl: '/booking/2', 
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
          nextAvailable: 'Today, 4:00 PM',//
          bookingUrl: '/booking/1', 
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
        <AssistantHeader />

        <ChatMessageList messages={messages} />

        {messages.length <= 1 && (
          <PresetQuestions
            questions={PRESET_QUESTIONS}
            onSelectQuestion={handleSendMessage}
          />
        )}

        <ChatInputBar
          inputText={inputText}
          setInputText={setInputText}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
}