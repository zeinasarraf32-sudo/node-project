import React from "react";

interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  isPositive: boolean;
  icon: React.ReactNode;
}

export default function StatCard({ title, value, trend, isPositive, icon }: StatCardProps) {
  return (
    <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2.5 rounded-xl bg-slate-50 text-slate-600">
          {icon}
        </div>
        <span
          className={`text-xs font-semibold px-2 py-1 rounded-full ${
            isPositive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
          }`}
        >
          {trend}
        </span>
      </div>
      <div>
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        <p className="text-xs text-slate-400 mt-1">{title}</p>
      </div>
    </div>
  );
}