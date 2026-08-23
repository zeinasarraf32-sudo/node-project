import { Heart } from 'lucide-react';

export default function AssistantHeader() {
  return (
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
  );
}