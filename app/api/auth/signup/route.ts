import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      fullName,
      email,
      password,
    } = body;

    // التحقق من البيانات المطلوبة
    if (!fullName || !email || !password) {
      return NextResponse.json(
        {
          message: 'Full name, email, and password are required',
        },
        { status: 400 }
      );
    }

    // التأكد أن الإيميل غير مستخدم
    const existingPatient = await prisma.patient.findUnique({
      where: { email },
    });

    if (existingPatient) {
      return NextResponse.json(
        {
          message: 'An account with this email already exists',
        },
        { status: 409 }
      );
    }

    // إنشاء Patient
    const patient = await prisma.patient.create({
  data: {
    fullName: fullName.trim(),
    email: email.trim().toLowerCase(),
    password,
  },
});

    return NextResponse.json(
      {
        message: 'Account created successfully',
        patient: {
          id: patient.id,
          fullName: patient.fullName,
          email: patient.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);

    return NextResponse.json(
      {
        message: 'Failed to create account',
      },
      { status: 500 }
    );
  }
}