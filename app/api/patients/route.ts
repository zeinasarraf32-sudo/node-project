import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (email) {
      const patient = await prisma.patient.findUnique({
        where: {
          email,
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

      if (!patient) {
        return NextResponse.json(
          {
            status: 404,
            message: 'Patient not found',
          },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          status: 200,
          data: patient,
        },
        { status: 200 }
      );
    }

    const patients = await prisma.patient.findMany({
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
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to fetch patients:', error);

    return NextResponse.json(
      {
        status: 500,
        message: 'Failed to fetch patients',
      },
      { status: 500 }
    );
  }
}