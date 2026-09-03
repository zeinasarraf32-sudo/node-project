import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { DoctorStatus } from '@prisma/client';
import { IDoctor } from '@/interfaces/interfaces';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const doctorId = Number(id);

    const body = await request.json();

    const { fullName, email, phone, specialty, experienceYrs, consultationFee, location, imageUrl, status, } = body ;

    const updatedDoctor = await prisma.doctor.update({
      where: { id: doctorId },
      data: { fullName, email, phone, specialty, experienceYrs, consultationFee, location, imageUrl, status },
    });

    return NextResponse.json({ data: updatedDoctor }, { status: 200 });
  } catch (error) {
    console.error('Error updating doctor:', error);
    return NextResponse.json({ message: 'Failed to update doctor' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const doctorId = Number(id);

    if (Number.isNaN(doctorId)) {
      return NextResponse.json(
        {
          message: 'Invalid doctor ID',
        },
        {
          status: 400,
        }
      );
    }

    await prisma.doctor.delete({
      where: {
        id: doctorId,
      },
    });

    return NextResponse.json({
      status: 200,
      message: 'Doctor deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting doctor:', error);

    return NextResponse.json(
      {
        message: 'Failed to delete doctor',
      },
      {
        status: 500,
      }
    );
  }
}