/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { AppointmentStatus } from '@prisma/client';

export interface IResponse<T = undefined> {
  data?: T;
  message?: string;
  status?: number;
}

/*
 * Doctor data used by Admin / API
 */
export interface IDoctor {
  id?: number;
  fullName: string;
  email: string;
  password?: string;
  phone?: string;
  specialty: string;
  experienceYrs?: number | string;
  consultationFee?: number | string;
  location?: string;
  imageUrl?: string;
  status?: 'ACTIVE' | 'ON_LEAVE' | 'INACTIVE';
}

/*
 * Doctor data returned from API.
 *
 * Some fields are optional because different UI pages
 * only need part of the Doctor object.
 */
export interface IBackendDoctor {
  id: string | number;

  fullName?: string | null;
  name?: string | null;

  email?: string | null;
  phone?: string | null;

  specialty?: string | null;

  experienceYrs?: number | string | null;

  consultationFee?: number | string | null;

  location?: string | null;

  imageUrl?: string | null;

  status?: 'ACTIVE' | 'ON_LEAVE' | 'INACTIVE';

  /*
   * These fields are kept because some existing UI
   * mappings already support them.
   */
  price?: number | null;
  fee?: number | null;
  image?: string | null;

  rating?: number | null;
  reviewsCount?: number | null;
}

/*
 * Doctor shape used by Booking UI.
 */
export interface IBookingDoctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviewsCount: number;
  avatar: string;
  fee: number;
  location: string;
}

export interface IPatient {
  name: string;
  age: string;
  email: string;
  phone: string;
}

export interface IChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

/*
 * POST /api/doctors
 */
export interface CreateDoctorBody {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  specialty: string;
  experienceYrs?: number;
  consultationFee?: number;
  location?: string | null;
  imageUrl?: string;
  status?: 'ACTIVE' | 'ON_LEAVE' | 'INACTIVE';
}

/*
 * POST /api/appointments
 */
export interface CreateAppointmentBody {
  doctorId: number;
  patientId: number;
  date: string;
  time: string;
  reason?: string;
  status?: AppointmentStatus;
}

/*
 * PUT /api/appointments/[id]
 */
export interface UpdateAppointmentBody {
  date?: string;
  time?: string;
  reason?: string;
  status?: AppointmentStatus;
}

/*
 * Appointment returned from API.
 */
export interface Appointment {
  id: number;
  date: string;
  time: string;
  reason?: string;

  status:
    | 'PENDING'
    | 'CONFIRMED'
    | 'COMPLETED'
    | 'CANCELLED';

  doctor: {
    id: number;
    fullName: string;
    specialty: string;
    imageUrl: string | null;
    location: string | null;
  };
}