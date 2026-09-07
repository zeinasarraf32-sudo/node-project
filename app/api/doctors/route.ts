import {
  NextRequest,
  NextResponse,
} from 'next/server';

import {
  prisma,
} from '@/lib/prisma';

import {
  DoctorStatus,
} from '@prisma/client';

import {
  CreateDoctorBody,
} from '@/interfaces/interfaces';

export async function GET() {
  try {
    const doctors =
      await prisma.doctor.findMany(
        {
          orderBy: {
            createdAt:
              'desc',
          },
        }
      );

    return NextResponse.json(
      {
        status: 200,
        data: doctors,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      'Prisma Get Doctors Error:',
      error
    );

    return NextResponse.json(
      {
        status: 500,
        message:
          'Failed to fetch doctors',
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

    // يعني بدل ما أكتب كل مرة body.fullName وbody.email، أستخرج الـfields وأضع كل واحدة في variable مستقل.
    const {
      fullName,
      email,
      password,
      phone,
      specialty,
      experienceYrs = 0,
      consultationFee = 0,
      location = null,
      imageUrl = '',
      status =
        DoctorStatus.ACTIVE,
    } =
      body as CreateDoctorBody;

    if (
      !fullName ||
      !email ||
      !password ||
      !specialty
    ) {
      return NextResponse.json(
        {
          status: 400,
          message:
            'Full Name, email, password, and specialty are required',
        },
        {
          status: 400,
        }
      );
    }

    if (
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
      await prisma.doctor.create(
        {
          data: {
            fullName:
              fullName.trim(),

            email:
              email.trim(),

            password,

            phone:
              phone?.trim() ||
              null,

            specialty:
              specialty.trim(),

            experienceYrs:
              Number(
                experienceYrs
              ) || 0,

            consultationFee:
              Number(
                consultationFee
              ) || 0,

            location:
              location?.trim() ||
              null,

            imageUrl:
              typeof imageUrl ===
                'string' &&
              imageUrl !== ''
                ? imageUrl
                : '',

            status,
          },
        }
      );

    return NextResponse.json(
      {
        status: 201,
        data: doctor,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      'Prisma Create Doctor Error:',
      error
    );

    return NextResponse.json(
      {
        status: 500,
        message:
          'Failed to create doctor',
      },
      {
        status: 500,
      }
    );
  }
}