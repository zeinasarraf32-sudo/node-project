import { Stethoscope, Brain } from 'lucide-react';

export default function AIRecommendation() {
  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-center gap-3 z-50">
      <button className="w-12 h-12 bg-white text-blue-600 rounded-2xl shadow-md border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition">
        <Stethoscope className="w-6 h-6" />
      </button>
      <button className="relative w-12 h-12 bg-emerald-500 text-white rounded-2xl shadow-lg flex items-center justify-center hover:bg-emerald-600 transition">
        <Brain className="w-6 h-6" />
        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-blue-500 rounded-full border-2 border-white" />
      </button>
    </div>
  );
}