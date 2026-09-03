'use client';

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  User,
  Mail,
  Lock,
  Phone,
  Stethoscope,
  Briefcase,
  DollarSign,
  MapPin,
  CheckCircle2,
  Activity,
  Upload,
  X,
  Eye,
  EyeOff,
} from 'lucide-react';

import { axiosPost } from '@/lib/axios';
import { IDoctor } from '@/interfaces/interfaces';

function errorMessage(error: unknown): string | null {
  return error instanceof Error ? error.message : null;
}

export default function AddDoctorPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [selectedFileName, setSelectedFileName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<IDoctor>({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    specialty: '',
    experienceYrs: '',
    consultationFee: '',
    location: '',
    imageUrl: '',
    status: 'ACTIVE',
  });

  const createMutation = useMutation({
    mutationFn: (values: IDoctor) =>
      axiosPost<IDoctor, IDoctor>('doctors', values),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['doctors'],
      });

      router.push('/admin');
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setSelectedFileName(file.name);

    const reader = new FileReader();

    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        imageUrl: reader.result as string,
      }));
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setSelectedFileName('');

    setFormData((prev) => ({
      ...prev,
      imageUrl: '',
    }));

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: IDoctor = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      password: formData.password?.trim(),
      phone: formData.phone?.trim(),
      specialty: formData.specialty.trim(),
      experienceYrs: formData.experienceYrs
        ? Number(formData.experienceYrs)
        : 0,
      consultationFee: formData.consultationFee
        ? Number(formData.consultationFee)
        : 0,
      location: formData.location?.trim(),
      imageUrl: formData.imageUrl || undefined,
      status: formData.status || 'ACTIVE',
    };

    createMutation.mutate(payload);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-100 transition-all shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Add New Doctor
            </h1>

            <p className="text-xs text-slate-500 mt-0.5">
              Create a new doctor profile
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <form
            onSubmit={handleSubmit}
            className="p-8 space-y-6"
          >
            <div>
              <h2 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                <User className="w-4 h-4" />
                Account Credentials
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Full Name *
                  </label>

                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />

                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Dr. Sara Al-Halabi"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Email Address *
                  </label>

                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />

                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="sara@quickcare.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Password *
                  </label>

                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />

                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Phone Number
                  </label>

                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />

                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+961 70 123 456"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    />
                  </div>
                </div>

              </div>
            </div>

            <hr className="border-slate-100" />

            <div>
              <h2 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Stethoscope className="w-4 h-4" />
                Doctor Profile Attributes
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Specialty *
                  </label>

                  <div className="relative">
                    <Stethoscope className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />

                    <input
                      type="text"
                      name="specialty"
                      required
                      value={formData.specialty}
                      onChange={handleChange}
                      placeholder="Cardiologist"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Status
                  </label>

                  <div className="relative">
                    <Activity className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 z-10" />

                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none cursor-pointer"
                    >
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="INACTIVE">INACTIVE</option>
                      <option value="ON_LEAVE">ON_LEAVE</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Experience (Years)
                  </label>

                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />

                    <input
                      type="number"
                      min="0"
                      name="experienceYrs"
                      value={formData.experienceYrs}
                      onChange={handleChange}
                      placeholder="10"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Consultation Fee ($)
                  </label>

                  <div className="relative">
                    <DollarSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />

                    <input
                      type="number"
                      min="0"
                      name="consultationFee"
                      value={formData.consultationFee}
                      onChange={handleChange}
                      placeholder="35"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    />
                  </div>
                </div>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Location / Clinic
                  </label>

                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />

                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Tripoli, Lebanon"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Profile Image
                  </label>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />

                  <div className="flex items-center gap-3 py-1">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-xs font-semibold hover:bg-blue-100 transition-all cursor-pointer border border-blue-200/60 shadow-sm active:scale-95 shrink-0"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Choose File</span>
                    </button>

                    <div className="flex items-center gap-2 text-xs text-slate-500 truncate select-none">
                      <span className="truncate max-w-[180px]">
                        {selectedFileName || 'No file chosen'}
                      </span>

                      {selectedFileName && (
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-rose-500 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Error */}
            {createMutation.error && (
              <p className="text-xs text-rose-500">
                {errorMessage(createMutation.error)}
              </p>
            )}

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={createMutation.isPending}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-md disabled:opacity-50 cursor-pointer"
              >
                {createMutation.isPending ? (
                  <span>Saving...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Create Doctor Profile</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}