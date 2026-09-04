'use client';

import React, { useState } from 'react';
import {
  Search,
  Pencil,
  Trash2,
  Star,
  Loader2,
  X,
} from 'lucide-react';

import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  axiosGet,
  axiosDelete,
  axiosPut,
} from '@/lib/axios';

import { IDoctor } from '@/interfaces/interfaces';

function errorMessage(error: unknown): string | null {
  return error instanceof Error ? error.message : null;
}

type EditDoctorData = {
  fullName: string;
  specialty: string;
  consultationFee: number;
  status: 'ACTIVE' | 'ON_LEAVE' | 'INACTIVE';
  location: string;
};

export default function DoctorsTable() {
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedDoctor, setSelectedDoctor] =
    useState<IDoctor | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] =
    useState(false);

  const [editFormData, setEditFormData] =
    useState<EditDoctorData>({
      fullName: '',
      specialty: '',
      consultationFee: 0,
      status: 'ACTIVE',
      location: '',
    });

  const queryClient = useQueryClient();

  const {
    data: responseData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['doctors'],

    queryFn: () =>
      axiosGet<IDoctor[]>('doctors'),
  });

  const doctorsList = responseData?.data ?? [];

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      axiosDelete(`doctors/${id}`),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['doctors'],
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<IDoctor>;
    }) =>
      axiosPut<Partial<IDoctor>, IDoctor>(
        `doctors/${id}`,
        data
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['doctors'],
      });

      setIsEditModalOpen(false);
      setSelectedDoctor(null);
    },
  });

  // ==========================================
  // DELETE HANDLER
  // ==========================================

  const handleDelete = (
    id: number | undefined,
    name: string
  ) => {
    if (!id) return;

    const confirmed = confirm(
      `Are you sure you want to delete ${name}?`
    );

    if (!confirmed) return;

    deleteMutation.mutate(id);
  };

  // ==========================================
  // OPEN EDIT
  // ==========================================

  const handleOpenEdit = (doctor: IDoctor) => {
    if (!doctor.id) return;

    setSelectedDoctor(doctor);

    setEditFormData({
      fullName: doctor.fullName || '',
      specialty: doctor.specialty || '',
      consultationFee:
        Number(doctor.consultationFee) || 0,
      status:
        doctor.status === 'ON_LEAVE'
          ? 'ON_LEAVE'
          : doctor.status === 'INACTIVE'
            ? 'INACTIVE'
            : 'ACTIVE',
      location: doctor.location || '',
    });

    setIsEditModalOpen(true);
  };

  // ==========================================
  // SAVE EDIT
  // ==========================================

  const handleSaveEdit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!selectedDoctor?.id) return;

    const payload: Partial<IDoctor> = {
      fullName: editFormData.fullName.trim(),
      specialty: editFormData.specialty.trim(),
      consultationFee:
        Number(editFormData.consultationFee),
      status: editFormData.status,
      location: editFormData.location.trim(),
    };

    updateMutation.mutate({
      id: selectedDoctor.id,
      data: payload,
    });
  };

  // ==========================================
  // FILTER
  // ==========================================

  const filteredDoctors = doctorsList.filter(
    (doctor) => {
      const name =
        doctor.fullName?.toLowerCase() || '';

      const specialty =
        doctor.specialty?.toLowerCase() || '';

      const search =
        searchTerm.toLowerCase();

      return (
        name.includes(search) ||
        specialty.includes(search)
      );
    }
  );

  return (
    <div className="space-y-4">

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />

        <input
          type="text"
          placeholder="Search doctors..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
          className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs"
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">

          <table className="w-full text-left border-collapse">

            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 tracking-wider">

                <th className="py-4 px-6">
                  Doctor
                </th>

                <th className="py-4 px-6">
                  Specialty
                </th>

                <th className="py-4 px-6">
                  Patients
                </th>

                <th className="py-4 px-6">
                  Rating
                </th>

                <th className="py-4 px-6">
                  Status
                </th>

                <th className="py-4 px-6 text-right">
                  Actions
                </th>

              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50 text-xs">

              {/* Loading */}
              {isLoading && (
                <tr>
                  <td
                    colSpan={6}
                    className="py-8 text-center text-slate-400"
                  >
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
                    Loading doctors data...
                  </td>
                </tr>
              )}

              {isError && (
                <tr>
                  <td
                    colSpan={6}
                    className="py-8 text-center text-rose-500"
                  >
                    Failed to load doctors list.
                  </td>
                </tr>
              )}

              {/* Empty */}
              {!isLoading &&
                filteredDoctors.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-8 text-center text-slate-400"
                    >
                      No doctors found.
                    </td>
                  </tr>
                )}

              {/* Doctors */}
              {filteredDoctors.map((doctor) => {

                const doctorName =
                  doctor.fullName ||
                  'Dr. Unknown';

                const isActive =
                  doctor.status === 'ACTIVE';

                return (
                  <tr
                    key={doctor.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >

                    {/* Doctor */}
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">

                        <img
                          src={
                            doctor.imageUrl ||
                            'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150'
                          }
                          alt={doctorName}
                          className="w-9 h-9 rounded-full object-cover border border-slate-100"
                        />

                        <span className="font-semibold text-slate-800">
                          {doctorName}
                        </span>

                      </div>
                    </td>

                    {/* Specialty */}
                    <td className="py-3.5 px-6 text-slate-500 font-medium">
                      {doctor.specialty}
                    </td>

                    {/* Patients */}
                    <td className="py-3.5 px-6 font-bold text-slate-800">
                      150
                    </td>

                    {/* Rating */}
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-1 font-semibold text-slate-700">

                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />

                        <span>
                          4.9
                        </span>

                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-6">

                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium ${
                          isActive
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                            : doctor.status ===
                              'ON_LEAVE'
                              ? 'bg-amber-50 text-amber-600 border border-amber-100'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {doctor.status}
                      </span>

                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-6 text-right">

                      <div className="flex items-center justify-end gap-2 text-slate-400">

                        <button
                          type="button"
                          onClick={() =>
                            handleOpenEdit(
                              doctor
                            )
                          }
                          className="p-1 hover:text-blue-600 transition-colors cursor-pointer"
                          title="Edit Doctor"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              doctor.id,
                              doctorName
                            )
                          }
                          className="p-1 hover:text-rose-500 transition-colors cursor-pointer"
                          title="Delete Doctor"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                      </div>

                    </td>

                  </tr>
                );
              })}

            </tbody>

          </table>

        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen &&
        selectedDoctor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">

            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl relative">

              {/* Close */}
              <button
                type="button"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setSelectedDoctor(null);
                }}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-base font-bold text-slate-900 mb-4">
                Edit Doctor Details
              </h3>

              <form
                onSubmit={handleSaveEdit}
                className="space-y-3 text-xs"
              >

                {/* Full Name */}
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">
                    Full Name
                  </label>

                  <input
                    type="text"
                    required
                    value={
                      editFormData.fullName
                    }
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        fullName:
                          e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                  />
                </div>

                {/* Specialty */}
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">
                    Specialty
                  </label>

                  <input
                    type="text"
                    required
                    value={
                      editFormData.specialty
                    }
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        specialty:
                          e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                  />
                </div>

                {/* Fee + Status */}
                <div className="grid grid-cols-2 gap-3">

                  <div>
                    <label className="font-semibold text-slate-600 block mb-1">
                      Fee ($)
                    </label>

                    <input
                      type="number"
                      min="0"
                      value={
                        editFormData.consultationFee
                      }
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          consultationFee:
                            Number(
                              e.target.value
                            ),
                        })
                      }
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-600 block mb-1">
                      Status
                    </label>

                    <select
                      value={
                        editFormData.status
                      }
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          status:
                            e.target
                              .value as EditDoctorData['status'],
                        })
                      }
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-500 bg-white"
                    >
                      <option value="ACTIVE">
                        Active
                      </option>

                      <option value="ON_LEAVE">
                        On Leave
                      </option>

                      <option value="INACTIVE">
                        Inactive
                      </option>
                    </select>
                  </div>

                </div>

                {/* Location */}
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">
                    Location
                  </label>

                  <input
                    type="text"
                    value={
                      editFormData.location
                    }
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        location:
                          e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                  />
                </div>

                {/* Error */}
                {updateMutation.error && (
                  <p className="text-xs text-rose-500">
                    {errorMessage(
                      updateMutation.error
                    )}
                  </p>
                )}

                {/* Save */}
                <button
                  type="submit"
                  disabled={
                    updateMutation.isPending
                  }
                  className="w-full mt-3 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
                >
                  {updateMutation.isPending && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}

                  Save Changes
                </button>

              </form>
            </div>
          </div>
        )}

    </div>
  );
}