import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  message = "Something went wrong while fetching data.",
  onRetry,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center space-y-3 bg-rose-50/30 rounded-2xl border border-rose-100">
      <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-500">
        <AlertTriangle className="w-5 h-5" />
      </div>
      <div>
        <h4 className="text-sm font-bold text-slate-800">Error Occurred</h4>
        <p className="text-xs text-rose-500 mt-1">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-1.5 px-4 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 shadow-2xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
}