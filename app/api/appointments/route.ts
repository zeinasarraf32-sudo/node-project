import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AppointmentStatus } from '@prisma/client';
import { CreateAppointmentBody } from '@/interfaces/interfaces';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');

    const appointments = await prisma.appointment.findMany({
      where: patientId ? { patientId: Number(patientId) } : undefined,
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
      },
      orderBy: {
        date: 'asc',
      },
    });

    return NextResponse.json(
      {
        status: 200,
        data: appointments,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { message: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      doctorId,
      patientId,
      date,
      time,
      reason,
      status = AppointmentStatus.CONFIRMED,
    } = body as CreateAppointmentBody;

    if (!doctorId || !patientId || !date || !time) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json(
        { message: 'Invalid date format' },
        { status: 400 }
      );
    }

    const newAppointment = await prisma.appointment.create({
      data: {
        doctorId: Number(doctorId),
        patientId: Number(patientId),
        date: parsedDate,
        time: String(time).trim(),
        reason: reason?.trim() || '',
        status,
      },
      include: {
        doctor: {
          select: { fullName: true, specialty: true, imageUrl: true },
        },
        patient: {
          select: { fullName: true, email: true },
        },
      },
    });

    return NextResponse.json(
      {
        status: 201,
        data: newAppointment,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Error creating appointment:', error);

    if (typeof error === 'object' && error !== null && 'code' in error) {
      const prismaError = error as { code: string };
      if (prismaError.code === 'P2002') {
        return NextResponse.json(
          { message: 'This time slot is already booked for this doctor.' },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { message: 'Failed to create appointment' },
      { status: 500 }
    );
  }
}