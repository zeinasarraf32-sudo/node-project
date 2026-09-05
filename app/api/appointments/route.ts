import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AppointmentStatus } from '@prisma/client';
import { z } from 'zod';

const createAppointmentSchema = z.object({
  doctorId: z.number().int().positive(),
  patientId: z.number().int().positive(),
  date: z.string().min(1, 'Date is required'),
  time: z.string().trim().min(1, 'Time is required'),
  reason: z.string().trim().optional(),
  status: z.nativeEnum(AppointmentStatus).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const patientId = searchParams.get('patientId');

    const appointments = await prisma.appointment.findMany({
      where: patientId
        ? {
            patientId: Number(patientId),
          }
        : undefined,

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
        message: 'Failed to fetch appointments',
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validation =
      createAppointmentSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          status: 400,
          message: 'Invalid appointment data',
          data: validation.error.flatten().fieldErrors,
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

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return NextResponse.json(
        {
          status: 400,
          message: 'Invalid date format',
        },
        {
          status: 400,
        }
      );
    }

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
        message: 'Appointment created successfully',
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

    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error
    ) {
      const prismaError = error as {
        code: string;
      };

      if (prismaError.code === 'P2002') {
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
        message: 'Failed to create appointment',
      },
      {
        status: 500,
      }
    );
  }
}