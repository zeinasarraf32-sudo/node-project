import {
  NextRequest,
  NextResponse,
} from 'next/server';

import { prisma } from '@/lib/prisma';

import {
  AppointmentStatus,
} from '@prisma/client';

import { z } from 'zod';

const createAppointmentSchema = z.object({
  doctorId: z.number().int().positive(),
  patientId: z.number().int().positive(),
  date: z.string().min(
    1,
    'Date is required'
  ),
  time: z
    .string()
    .trim()
    .min(1, 'Time is required'),
  reason: z
    .string()
    .trim()
    .optional(),
  status: z
    .nativeEnum(AppointmentStatus)
    .optional(),
});

export async function GET(
  request: NextRequest
) {
  try {
    const { searchParams } =
      new URL(request.url);

    const patientIdParam =
      searchParams.get('patientId');

    const doctorIdParam =
      searchParams.get('doctorId');

    const dateParam =
      searchParams.get('date');

    const where: {
      patientId?: number;
      doctorId?: number;
      date?: Date;
    } = {};

    /*
     * Optional Patient Filter
     */
    if (patientIdParam) {
      const patientId =
        Number(patientIdParam);

      if (
        !Number.isInteger(patientId) ||
        patientId <= 0
      ) {
        return NextResponse.json(
          {
            status: 400,
            message:
              'Invalid patient id',
          },
          {
            status: 400,
          }
        );
      }

      where.patientId = patientId;
    }

    /*
     * Optional Doctor Filter
     */
    if (doctorIdParam) {
      const doctorId =
        Number(doctorIdParam);

      if (
        !Number.isInteger(doctorId) ||
        doctorId <= 0
      ) {
        return NextResponse.json(
          {
            status: 400,
            message:
              'Invalid doctor id',
          },
          {
            status: 400,
          }
        );
      }

      where.doctorId = doctorId;
    }

    /*
     * Optional Date Filter
     */
    if (dateParam) {
      const parsedDate =
        new Date(dateParam);

      if (
        Number.isNaN(
          parsedDate.getTime()
        )
      ) {
        return NextResponse.json(
          {
            status: 400,
            message:
              'Invalid date format',
          },
          {
            status: 400,
          }
        );
      }

      where.date = parsedDate;
    }

    const appointments =
      await prisma.appointment.findMany({
        where,

        include: {
          doctor: {
            select: {
              id: true,
              fullName: true,
              specialty: true,
              imageUrl: true,
              location: true,
            },
          },

          patient: {
            select: {
              id: true,
              fullName: true,
              email: true,
              phone: true,
              imageUrl: true,
            },
          },
        },

        orderBy: [
          {
            date: 'asc',
          },
          {
            time: 'asc',
          },
        ],
      });

    return NextResponse.json(
      {
        status: 200,
        data: appointments,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      'Failed to fetch appointments:',
      error
    );

    return NextResponse.json(
      {
        status: 500,
        message:
          'Failed to fetch appointments',
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(
  request: NextRequest
) {
  try {
    const body =
      await request.json();

    const validation =
      createAppointmentSchema.safeParse(
        body
      );

    if (!validation.success) {
      return NextResponse.json(
        {
          status: 400,
          message:
            'Invalid appointment data',
          data:
            validation.error.flatten()
              .fieldErrors,
        },
        {
          status: 400,
        }
      );
    }

    const {
      doctorId,
      patientId,
      date,
      time,
      reason,
      status,
    } = validation.data;

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return NextResponse.json(
        {
          status: 400,
          message:
            'Invalid date format',
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Reject past dates.
     *
     * Compare calendar dates without
     * comparing the appointment's
     * artificial noon time.
     */
    const selectedDay = Date.UTC(
      parsedDate.getUTCFullYear(),
      parsedDate.getUTCMonth(),
      parsedDate.getUTCDate()
    );

    const now = new Date();

    const today = Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate()
    );

    if (selectedDay < today) {
      return NextResponse.json(
        {
          status: 400,
          message:
            'Appointments cannot be booked in the past.',
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Check the time slot before create.
     */
    // الآن نصل إلى أهم جزء: هل الـTime Slot محجوز؟
    const existingAppointment =
      await prisma.appointment.findFirst({
        where: {
          doctorId,
          date: parsedDate,
          time,
        },

        select: {
          id: true,
        },
      });

    if (existingAppointment) {
      return NextResponse.json(
        {
          status: 409,
          message:
            'This time slot is already booked for this doctor.',
        },
        {
          status: 409,
        }
      );
    }

    /*
     * Create Appointment
     */
    const newAppointment =
      await prisma.appointment.create({
        data: {
          doctorId,
          patientId,
          date: parsedDate,
          time,
          reason: reason || '',

          ...(status !== undefined && {
            status,
          }),
        },

        include: {
          doctor: {
            select: {
              id: true,
              fullName: true,
              specialty: true,
              imageUrl: true,
              location: true,
            },
          },

          patient: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
        },
      });

    return NextResponse.json(
      {
        status: 201,
        data: newAppointment,
        message:
          'Appointment created successfully',
      },
      {
        status: 201,
      }
    );
  } catch (error: unknown) {
    console.error(
      'Failed to create appointment:',
      error
    );

    /*
     * Database final protection against
     * duplicate doctor/date/time.
     */
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error
    ) {
      const prismaError =
        error as {
          code: string;
        };

      if (
        prismaError.code === 'P2002'
      ) {
        return NextResponse.json(
          {
            status: 409,
            message:
              'This time slot is already booked for this doctor.',
          },
          {
            status: 409,
          }
        );
      }
    }

    return NextResponse.json(
      {
        status: 500,
        message:
          'Failed to create appointment',
      },
      {
        status: 500,
      }
    );
  }
}