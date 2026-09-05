'use client';

import { Appointment } from '@/interfaces/interfaces';

interface NotificationsListProps {
  appointments?: Appointment[];
}

export default function NotificationsList({
  appointments = [],
}: NotificationsListProps) {
  const recentAppointments = appointments
    .filter(
      (appointment) =>
        appointment.status === 'CONFIRMED' ||
        appointment.status === 'CANCELLED' ||
        appointment.status === 'COMPLETED'
    )
    .slice(0, 3);

  const getNotification = (
    appointment: Appointment
  ) => {
    const doctorName =
      appointment.doctor?.fullName ||
      'Doctor';

    if (
      appointment.status === 'CONFIRMED'
    ) {
      return {
        text: `Appointment confirmed with ${doctorName}`,
        color: 'bg-blue-500',
      };
    }

    if (
      appointment.status === 'COMPLETED'
    ) {
      return {
        text: `Appointment completed with ${doctorName}`,
        color: 'bg-emerald-500',
      };
    }

    return {
      text: `Appointment cancelled with ${doctorName}`,
      color: 'bg-red-500',
    };
  };

  const formatDate = (date: string) => {
    return new Date(
      date
    ).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm h-full flex flex-col">

      {/* Header */}
      <h2 className="text-base font-semibold text-gray-900">
        Notifications
      </h2>

      {/* Notifications */}
      <div className="flex-1 flex flex-col justify-center mt-4">
        {recentAppointments.length === 0 ? (
          <div className="text-center">
            <p className="text-xs text-gray-400">
              No notifications yet.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {recentAppointments.map(
              (appointment) => {
                const notification =
                  getNotification(
                    appointment
                  );

                return (
                  <div
                    key={appointment.id}
                    className="flex items-start gap-3"
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${notification.color} mt-1.5 shrink-0`}
                    />

                    <div>
                      <p className="text-xs font-medium text-gray-800">
                        {
                          notification.text
                        }
                      </p>

                      <p className="text-[11px] text-gray-400 mt-1">
                        {formatDate(
                          appointment.date
                        )}
                        {' · '}
                        {appointment.time}
                      </p>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        )}
      </div>
    </div>
  );
}