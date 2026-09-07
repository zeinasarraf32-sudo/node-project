import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const patients =
      await prisma.patient.findMany({
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

        orderBy: {
          createdAt: 'desc',
        },
      });

    return NextResponse.json(
      {
        status: 200,
        data: patients,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      'Failed to fetch patients:',
      error
    );

    return NextResponse.json(
      {
        status: 500,
        message:
          'Failed to fetch patients',
      },
      {
        status: 500,
      }
    );
  }
}