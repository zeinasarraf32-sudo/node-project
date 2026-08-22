import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function SuccessState({ message = "Operation completed successfully!" }: { message?: string }) {
  return (
    <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-medium">
      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
      <span>{message}</span>
    </div>
  );
}