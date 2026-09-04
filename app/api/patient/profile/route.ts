import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: NextRequest) {
  try {
    const email = request.headers.get('x-user-email');

    if (!email) {
      return NextResponse.json(
        { message: 'User email is required' },
        { status: 401 }
      );
    }

    const body = await request.json();

    const { fullName, phone } = body;

    if (!fullName || !phone) {
      return NextResponse.json(
        { message: 'Full name and phone are required' },
        { status: 400 }
      );
    }

    const patient = await prisma.patient.update({
      where: {
        email,
      },
      data: {
        fullName: fullName.trim(),
        phone: phone.trim(),
      },
    });

    return NextResponse.json({
      status: 200,
      message: 'Profile updated successfully',
      data: {
        id: patient.id,
        fullName: patient.fullName,
        email: patient.email,
        phone: patient.phone,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);

    return NextResponse.json(
      { message: 'Failed to update profile' },
      { status: 500 }
    );
  }
}