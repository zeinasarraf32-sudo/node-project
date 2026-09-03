import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    if (!email || !password) {
      return NextResponse.json(
        {
          message: 'Email and password are required',
        },
        { status: 400 }
      );
    }

    const patient = await prisma.patient.findUnique({
      where: {
        email,
      },
    });

    if (!patient) {
      return NextResponse.json(
        {
          message: 'Invalid email or password',
        },
        { status: 401 }
      );
    }

    if (patient.password !== password) {
      return NextResponse.json(
        {
          message: 'Invalid email or password',
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      message: 'Login successful',
      token: 'authenticated',
      patient: {
        id: patient.id,
        fullName: patient.fullName,
        email: patient.email,
        phone: patient.phone,
      },
    });
  } catch (error) {
    console.error('Login error:', error);

    return NextResponse.json(
      {
        message: 'Failed to login',
      },
      { status: 500 }
    );
  }
}