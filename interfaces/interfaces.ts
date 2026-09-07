import { AppointmentStatus } from '@prisma/client';

export interface IResponse<T = undefined> {
  data?: T;
  message?: string;
  status?: number;
}

/*
 * Doctor data used by Admin / API.
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
  location?: string | null;
  imageUrl?: string | null;
  status?: 'ACTIVE' | 'ON_LEAVE' | 'INACTIVE';
}

/*
 * Doctor data returned from API.
 *
 * Some fields remain optional because different
 * pages use different parts of the Doctor object.
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
   * Temporary aliases supported by older UI mappings.
   * They do not contain fake fallback values.
   */
  price?: number | null;
  fee?: number | null;
  image?: string | null;
}

/*
 * Doctor shape used by Booking UI.
 */
export interface IBookingDoctor {
  id: string;
  name: string;
  specialty: string;
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

export  interface SignupBody {
  fullName: string;
  email: string;
  password: string;
}