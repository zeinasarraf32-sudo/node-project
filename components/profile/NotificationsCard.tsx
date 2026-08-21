'use client';

import { useState } from 'react';
import { Bell } from 'lucide-react';

export default function NotificationsCard() {
  const [settings, setSettings] = useState({
    appointmentReminders: true,
    prescriptionRefills: true,
    labResults: false,
    promotions: false,
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const items = [
    { key: 'appointmentReminders', label: 'Appointment Reminders' },
    { key: 'prescriptionRefills', label: 'Prescription Refills' },
    { key: 'labResults', label: 'Lab Results' },
    { key: 'promotions', label: 'Promotions' },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
      <div className="flex items-center gap-2.5 text-gray-900">
        <Bell className="w-5 h-5 text-blue-600" />
        <h3 className="font-bold text-base">Notifications</h3>
      </div>

      <div className="space-y-4 pt-1">
        {items.map((item) => {
          const active = settings[item.key as keyof typeof settings];
          return (
            <div
              key={item.key}
              className="flex items-center justify-between text-sm font-medium text-gray-700"
            >
              <span>{item.label}</span>
              <button
                type="button"
                onClick={() => toggle(item.key as keyof typeof settings)}
                className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                  active ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform ${
                    active ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}