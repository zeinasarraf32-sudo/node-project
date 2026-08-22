import React from 'react';
import { Inbox } from 'lucide-react';

interface Props {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export default function EmptyState({
  title = "No data found",
  description = "There are no records matching your request.",
  actionText,
  onAction,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center space-y-3 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
        <Inbox className="w-5 h-5" />
      </div>
      <div>
        <h4 className="text-sm font-bold text-slate-700">{title}</h4>
        <p className="text-xs text-slate-400 mt-1 max-w-xs">{description}</p>
      </div>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-2 px-4 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}