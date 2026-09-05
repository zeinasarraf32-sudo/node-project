import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AppointmentStatus } from '@prisma/client';
import { z } from 'zod';

const updateAppointmentSchema = z.object({
  date: z.string().min(1).optional(),
  time: z.string().trim().min(1).optional(),
  reason: z.string().trim().optional(),
  status: z.nativeEnum(AppointmentStatus).optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const appointmentId = Number(id);

    if (
      !Number.isInteger(appointmentId) ||
      appointmentId <= 0
    ) {
      return NextResponse.json(
        {
          status: 400,
          message: 'Invalid appointment ID',
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    const validation =
      updateAppointmentSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          status: 400,
          message: 'Invalid appointment data',
          data: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const {
      date,
      time,
      reason,
      status,
    } = validation.data;

    const updatedAppointment =
      await prisma.appointment.update({
        where: {
          id: appointmentId,
        },
        data: {
          ...(date !== undefined && {
            date: new Date(date),
          }),

          ...(time !== undefined && {
            time: time.trim(),
          }),

          ...(reason !== undefined && {
            reason: reason.trim(),
          }),

          ...(status !== undefined && {
            status,
          }),
        },
      });

    return NextResponse.json(
      {
        status: 200,
        data: updatedAppointment,
        message: 'Appointment updated successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      'Failed to update appointment:',
      error
    );

    return NextResponse.json(
      {
        status: 500,
        message: 'Failed to update appointment',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const appointmentId = Number(id);

    if (
      !Number.isInteger(appointmentId) ||
      appointmentId <= 0
    ) {
      return NextResponse.json(
        {
          status: 400,
          message: 'Invalid appointment ID',
        },
        { status: 400 }
      );
    }

    const deletedAppointment =
      await prisma.appointment.delete({
        where: {
          id: appointmentId,
        },
      });

    return NextResponse.json(
      {
        status: 200,
        data: deletedAppointment,
        message: 'Appointment deleted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      'Failed to delete appointment:',
      error
    );

    return NextResponse.json(
      {
        status: 500,
        message: 'Failed to delete appointment',
      },
      { status: 500 }
    );
  }
}