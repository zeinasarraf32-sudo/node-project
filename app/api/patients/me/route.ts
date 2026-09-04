import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const email = req.headers.get('x-user-email');

    if (!email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // البحث في جدول Patient مباشرة بفضل وجود email وحقل فريد
    const patient = await prisma.patient.findUnique({
      where: { email },
    });

    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    return NextResponse.json({
      fullName: patient.fullName || patient.email.split('@')[0],
      patientId: `#MG-${String(patient.id).padStart(3, '0')}`,
      email: patient.email,
      dob: 'Not set',
      phone: patient.phone || 'Not set',
      gender: 'Not set',
      bloodType: 'O+',
      address: 'Not set',
      avatarUrl:
        patient.imageUrl ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300',
      insurance: {
        provider: 'None',
        memberId: 'N/A',
        isActive: false,
      },
    });
  } catch (error) {
    console.error('Error fetching patient profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}