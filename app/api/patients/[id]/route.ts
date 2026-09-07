import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updatePatientSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, 'Full name is required'),

  phone: z
    .string()
    .trim()
    .min(1, 'Phone is required'),
});

export async function PUT(
  request: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await context.params;
    const patientId = Number(id);

    if (
      !Number.isInteger(patientId) ||
      patientId <= 0
    ) {
      return NextResponse.json(
        {
          status: 400,
          message: 'Invalid patient ID',
        },
        {
          status: 400,
        }
      );
    }

    const body = await request.json();

    const validation =
      updatePatientSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          status: 400,
          message: 'Invalid patient data',
          data:
            validation.error.flatten()
              .fieldErrors,
        },
        {
          status: 400,
        }
      );
    }

    const patient =
      await prisma.patient.update({
        where: {
          id: patientId,
        },

        data: {
          fullName:
            validation.data.fullName,
          phone:
            validation.data.phone,
        },

        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          imageUrl: true,
          condition: true,
          createdAt: true,
          updatedAt: true,
        },
      });

    return NextResponse.json(
      {
        status: 200,
        message:
          'Patient updated successfully',
        data: patient,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      'Failed to update patient:',
      error
    );

    return NextResponse.json(
      {
        status: 500,
        message:
          'Failed to update patient',
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await context.params;
    const patientId = Number(id);

    if (
      !Number.isInteger(patientId) ||
      patientId <= 0
    ) {
      return NextResponse.json(
        {
          status: 400,
          message: 'Invalid patient ID',
        },
        {
          status: 400,
        }
      );
    }

    // عم اتأكد اذا المريض موجود قبل ما احاول احذفه
    const patient =
      await prisma.patient.findUnique({
        where: {
          id: patientId,
        },

        select: {
          id: true,
          fullName: true,
        },
      });

    if (!patient) {
      return NextResponse.json(
        {
          status: 404,
          message: 'Patient not found',
        },
        {
          status: 404,
        }
      );
    }

    //أستخدم Database Transaction لأن عندي عمليتين مرتبطتين وأريد أن تنجحا معًا أو تفشلا معًا. 
    await prisma.$transaction(
      async (tx) => {
        await tx.appointment.deleteMany({
          where: {
            patientId,
          },
        });

        await tx.patient.delete({
          where: {
            id: patientId,
          },
        });
      }
    );

    return NextResponse.json(
      {
        status: 200,
        message:
          'Patient and related appointments deleted successfully',
        data: {
          id: patient.id,
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      'Failed to delete patient:',
      error
    );

    return NextResponse.json(
      {
        status: 500,
        message:
          'Failed to delete patient',
      },
      {
        status: 500,
      }
    );
  }
}