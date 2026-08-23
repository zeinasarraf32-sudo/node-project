import Link from 'next/link';
import Image from 'next/image';
import { Bot, Star, Calendar, ChevronRight } from 'lucide-react';

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

interface ChatMessageListProps {
  messages: Message[];
}

export default function ChatMessageList({ messages }: ChatMessageListProps) {
  return (
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
  );
}