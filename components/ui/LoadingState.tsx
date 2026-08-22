import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingState({ message = "Loading data..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-slate-400 space-y-3">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      <p className="text-xs font-medium">{message}</p>
    </div>
  );
}