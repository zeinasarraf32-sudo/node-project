import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { UpdateAppointmentBody } from '@/interfaces/interfaces';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const appointmentId = Number(id);

    if (Number.isNaN(appointmentId)) {
      return NextResponse.json(
        { message: 'Invalid appointment ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { date, time, reason, status } = body as UpdateAppointmentBody;

    const updatedAppointment = await prisma.appointment.update({
      where: {
        id: appointmentId,
      },
      data: {
        ...(date && { date: new Date(date) }),
        ...(time && { time: time.trim() }),
        ...(reason !== undefined && { reason: reason.trim() }),
        ...(status && { status }),
      },
    });

    return NextResponse.json(
      {
        data: updatedAppointment,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating appointment:', error);

    return NextResponse.json(
      { message: 'Failed to update appointment' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const appointmentId = Number(id);

    if (Number.isNaN(appointmentId)) {
      return NextResponse.json(
        { message: 'Invalid appointment ID' },
        { status: 400 }
      );
    }

    await prisma.appointment.delete({
      where: {
        id: appointmentId,
      },
    });

    return NextResponse.json(
      {
        status: 200,
        message: 'Appointment deleted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting appointment:', error);

    return NextResponse.json(
      { message: 'Failed to delete appointment' },
      { status: 500 }
    );
  }
}