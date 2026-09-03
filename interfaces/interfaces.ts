/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-explicit-any */

export interface IResponse<T = undefined> {
  data?: T;
  message?: string;
  status?: number;
}

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
  status?: "ACTIVE" | "ON_LEAVE" | "INACTIVE";
}

export interface IPatient {
  name: string;
  age: string;
  email: string;
  phone: string;
}

export interface IChatMessage {
  role: "user" | "assistant";
  content: string;
}
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
  status?: "ACTIVE" | "ON_LEAVE" | "INACTIVE";
}