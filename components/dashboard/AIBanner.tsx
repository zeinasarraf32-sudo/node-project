import { Brain } from 'lucide-react';

export default function AIBanner() {
  return (
    <div className="bg-emerald-600 rounded-3xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-emerald-500/80 rounded-2xl shrink-0">
          <Brain className="w-7 h-7 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-lg">Not sure which doctor you need?</h3>
          <p className="text-emerald-100 text-sm mt-0.5">
            Describe your symptoms and let AI find the right specialist.
          </p>
        </div>
      </div>
      <button className="bg-white hover:bg-emerald-50 text-emerald-700 font-bold px-6 py-2.5 rounded-xl text-sm shrink-0 transition">
        Ask AI
      </button>
    </div>
  );
}