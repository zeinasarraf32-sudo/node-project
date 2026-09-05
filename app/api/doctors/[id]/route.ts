import {
  NextRequest,
  NextResponse,
} from 'next/server';

import { prisma } from '@/lib/prisma';

import {
  DoctorStatus,
} from '@prisma/client';

interface UpdateDoctorBody {
  fullName?: string;
  specialty?: string;
  consultationFee?: number | string;
  status?: DoctorStatus;
  location?: string | null;
}

export async function PUT(
  request: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await context.params;

    const doctorId = Number(id);

    if (
      !Number.isInteger(doctorId) ||
      doctorId <= 0
    ) {
      return NextResponse.json(
        {
          status: 400,
          message: 'Invalid doctor ID',
        },
        {
          status: 400,
        }
      );
    }

    const body =
      (await request.json()) as UpdateDoctorBody;

    const {
      fullName,
      specialty,
      consultationFee,
      status,
      location,
    } = body;

    if (
      status &&
      !Object.values(
        DoctorStatus
      ).includes(status)
    ) {
      return NextResponse.json(
        {
          status: 400,
          message:
            'Invalid doctor status',
        },
        {
          status: 400,
        }
      );
    }

    const doctor =
      await prisma.doctor.update({
        where: {
          id: doctorId,
        },

        data: {
          ...(fullName !== undefined && {
            fullName:
              fullName.trim(),
          }),

          ...(specialty !== undefined && {
            specialty:
              specialty.trim(),
          }),

          ...(consultationFee !== undefined && {
            consultationFee:
              Number(
                consultationFee
              ) || 0,
          }),

          ...(status !== undefined && {
            status,
          }),

          ...(location !== undefined && {
            location:
              location?.trim() ||
              null,
          }),
        },
      });

    return NextResponse.json(
      {
        status: 200,
        data: doctor,
        message:
          'Doctor updated successfully',
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      'Error updating doctor:',
      error
    );

    return NextResponse.json(
      {
        status: 500,
        message:
          'Failed to update doctor',
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

    const doctorId = Number(id);

    if (
      !Number.isInteger(doctorId) ||
      doctorId <= 0
    ) {
      return NextResponse.json(
        {
          status: 400,
          message: 'Invalid doctor ID',
        },
        {
          status: 400,
        }
      );
    }

    const doctor =
      await prisma.doctor.delete({
        where: {
          id: doctorId,
        },
      });

    return NextResponse.json(
      {
        status: 200,
        data: doctor,
        message:
          'Doctor deleted successfully',
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      'Error deleting doctor:',
      error
    );

    return NextResponse.json(
      {
        status: 500,
        message:
          'Failed to delete doctor',
      },
      {
        status: 500,
      }
    );
  }
}