import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

import { IDoctor } from '@/interfaces/interfaces';
import {CreateDoctorBody} from '@/interfaces/interfaces';

export async funhttps://github.com/zeinasarraf32-sudo/node-project/pull/5ction PUT(
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

    const body: CreateDoctorBody = await request.json();

    const {
      fullName,
      email,
      phone,
      specialty,
      experienceYrs,
      consultationFee,
      location,
      imageUrl,
      status,
    } = body as CreateDoctorBody;

    const updatedDoctor = await prisma.doctor.update({
      where: {
        id: doctorId,
      },
      data: {
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone?.trim() || null,
        specialty: specialty.trim(),
        experienceYrs: Number(experienceYrs) || 0,
        consultationFee: Number(consultationFee) || 0,
        location: location?.trim() || null,
        imageUrl:
          typeof imageUrl === 'string' && imageUrl !== ''
            ? imageUrl
            : '',
        status,
      },
    });

    return NextResponse.json(
      {
        data: updatedDoctor,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error updating doctor:', error);

    return NextResponse.json(
      {
        message: 'Failed to update doctor',
      },
      {
        status: 500,
      }
    );
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

    return NextResponse.json(
      {
        status: 200,
        message: 'Doctor deleted successfully',
      },
      {
        status: 200,
      }
    );
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