'use client';

import {
  useState,
  useSyncExternalStore,
} from 'react';

import { useRouter } from 'next/navigation';

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  User,
  Mail,
  Phone,
  CalendarDays,
  Loader2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  UserRound,
} from 'lucide-react';

import { axiosPut } from '@/lib/axios';

const emptySubscribe = () => () => {};

/*
 * Data sent from Frontend
 * to PUT /api/patients/[id]
 */
type UpdatePatientBody = {
  fullName: string;
  phone: string;
};

/*
 * Patient data returned
 * from the Backend.
 */
type UpdatedPatient = {
  id: number;
  fullName: string;
  email: string;
  phone: string | null;
  imageUrl: string | null;
  condition: string | null;
  createdAt: string;
  updatedAt: string;
};

export default function ProfilePage() {
  const router = useRouter();

  const queryClient =
    useQueryClient();

  /*
   * Check if we are in Browser.
   *
   * localStorage exists only
   * on the client side.
   */
  const isClient =
    useSyncExternalStore(
      emptySubscribe,
      () => true,
      () => false
    );

  /*
   * Read saved patient information
   * from localStorage.
   */
  const initialFullName = isClient
    ? localStorage.getItem(
        'userName'
      ) || ''
    : '';

  const initialEmail = isClient
    ? localStorage.getItem(
        'userEmail'
      ) || ''
    : '';

  const initialPhone = isClient
    ? localStorage.getItem(
        'userPhone'
      ) || ''
    : '';

  const initialDob = isClient
    ? localStorage.getItem(
        'userDob'
      ) || ''
    : '';

  const initialGender = isClient
    ? localStorage.getItem(
        'userGender'
      ) || ''
    : '';

  /*
   * Maximum Date of Birth
   * is today.
   *
   * This prevents selecting
   * a future date.
   */
  const today = new Date();

  const maxDob = [
    today.getFullYear(),

    String(
      today.getMonth() + 1
    ).padStart(2, '0'),

    String(
      today.getDate()
    ).padStart(2, '0'),
  ].join('-');

  const [
    successMsg,
    setSuccessMsg,
  ] = useState('');

  const [
    errorMsg,
    setErrorMsg,
  ] = useState('');

  /*
   * Form State
   */
  const [
    formData,
    setFormData,
  ] = useState({
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
  });

  /*
   * Check if the user
   * has started changing
   * any field.
   */
  const hasFormStarted =
    formData.fullName !== '' ||
    formData.email !== '' ||
    formData.phone !== '' ||
    formData.dob !== '' ||
    formData.gender !== '';

  /*
   * Before editing:
   * show saved localStorage data.
   *
   * After editing:
   * use formData.
   */
  const currentFormData =
    hasFormStarted
      ? formData
      : {
          fullName:
            initialFullName,

          email:
            initialEmail,

          phone:
            initialPhone,

          dob:
            initialDob,

          gender:
            initialGender,
        };

  /*
   * Update a field
   * inside formData.
   */
  const updateField = (
    field:
      keyof typeof formData,
    value: string
  ) => {
    setFormData({
      ...currentFormData,
      [field]: value,
    });
  };

  /*
   * =================================
   * UPDATE PATIENT MUTATION
   * =================================
   */
  const updateProfileMutation =
    useMutation({
      mutationFn: async ({
        patientId,
        values,
      }: {
        patientId: number;
        values: UpdatePatientBody;
      }) => {
        return axiosPut<
          UpdatePatientBody,
          UpdatedPatient
        >(
          `patients/${patientId}`,
          values
        );
      },

      /*
       * Runs automatically
       * when PUT succeeds.
       */
      onSuccess: async () => {
        setErrorMsg('');

        /*
         * Patient data may have changed,
         * so refresh patients query.
         */
        await queryClient.invalidateQueries({
          queryKey: [
            'patients',
          ],
        });

        /*
         * Save Frontend profile
         * information.
         *
         * DOB and Gender are currently
         * stored in localStorage because
         * they are not fields in the
         * Patient database model.
         */
        localStorage.setItem(
          'userName',
          currentFormData.fullName
        );

        localStorage.setItem(
          'userEmail',
          currentFormData.email
        );

        localStorage.setItem(
          'userPhone',
          currentFormData.phone
        );

        localStorage.setItem(
          'userDob',
          currentFormData.dob
        );

        localStorage.setItem(
          'userGender',
          currentFormData.gender
        );

        setSuccessMsg(
          'Profile completed successfully!'
        );

        setTimeout(() => {
          router.push(
            '/doctors'
          );
        }, 800);
      },

      /*
       * Runs automatically
       * when PUT fails.
       */
      onError: (
        updateError
      ) => {
        console.error(
          'Profile update error:',
          updateError
        );

        setSuccessMsg('');

        setErrorMsg(
          updateError instanceof Error
            ? updateError.message
            : 'Failed to save profile. Please try again.'
        );
      },
    });

  /*
   * =================================
   * FORM SUBMIT
   * =================================
   */
  const handleSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setSuccessMsg('');
    setErrorMsg('');

    /*
     * Get logged-in Patient ID.
     */
    const storedPatientId =
      localStorage.getItem(
        'patientId'
      );

    if (!storedPatientId) {
      setErrorMsg(
        'Patient information not found. Please log in again.'
      );

      return;
    }

    const patientId =
      Number(storedPatientId);

    /*
     * Validate Patient ID.
     */
    if (
      !Number.isInteger(
        patientId
      ) ||
      patientId <= 0
    ) {
      setErrorMsg(
        'Invalid patient information. Please log in again.'
      );

      return;
    }

    /*
     * Validate DOB.
     */
    if (
      !currentFormData.dob
    ) {
      setErrorMsg(
        'Please select your date of birth.'
      );

      return;
    }

    /*
     * Validate Gender.
     */
    if (
      !currentFormData.gender
    ) {
      setErrorMsg(
        'Please select your gender.'
      );

      return;
    }

    /*
     * Build the payload
     * that will be sent
     * to the Backend.
     *
     * Patient API currently
     * updates fullName + phone.
     */
    const values:
      UpdatePatientBody = {
        fullName:
          currentFormData.fullName.trim(),

        phone:
          currentFormData.phone.trim(),
      };

    /*
     * Start the Mutation.
     *
     * values will go to
     * mutationFn.
     */
    updateProfileMutation.mutate({
      patientId,
      values,
    });
  };

  /*
   * Wait until Browser
   * is available.
   */
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/70 via-slate-50 to-white px-4 py-10 sm:px-6">
      <div className="max-w-4xl mx-auto">

        {/* Page Header */}
        <div className="text-center mb-8">

          <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
            <UserRound className="w-7 h-7 text-white" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Complete Your Profile
          </h1>

          <p className="mt-3 text-sm text-slate-500 max-w-xl mx-auto leading-6">
            Just a few more details before
            you start finding and booking
            the right doctor.
          </p>

          <div className="flex items-center justify-center gap-2 mt-4">

            <div className="w-10 h-1.5 rounded-full bg-blue-600" />

            <div className="w-10 h-1.5 rounded-full bg-blue-600" />

            <span className="ml-1 text-xs font-semibold text-slate-400">
              Step 2 of 2
            </span>

          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">

          {/* Card Header */}
          <div className="px-6 sm:px-10 py-6 border-b border-slate-100 bg-white">

            <div className="flex items-center gap-4">

              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>

              <div>

                <h2 className="text-lg font-bold text-slate-900">
                  Personal Information
                </h2>

                <p className="text-sm text-slate-400 mt-0.5">
                  Fill in the information
                  below to complete your
                  profile.
                </p>

              </div>
            </div>
          </div>

          <div className="px-6 sm:px-10 py-8">

            {/* Success Message */}
            {successMsg && (
              <div className="mb-7 flex items-center gap-3 p-4 rounded-xl border border-emerald-200 bg-emerald-50 text-sm text-emerald-700">

                <CheckCircle2 className="w-5 h-5 shrink-0" />

                <span>
                  {successMsg}
                </span>

              </div>
            )}

            {/* Error Message */}
            {errorMsg && (
              <div className="mb-7 p-4 rounded-xl border border-red-200 bg-red-50 text-sm text-red-600">
                {errorMsg}
              </div>
            )}

            <form
              onSubmit={
                handleSubmit
              }
              className="space-y-7"
            >

              {/* Full Name + Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Full Name */}
                <div>

                  <label className="block mb-2 text-sm font-semibold text-slate-700">
                    Full Name

                    <span className="text-red-500 ml-1">
                      *
                    </span>
                  </label>

                  <div className="relative">

                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />

                    <input
                      type="text"
                      required
                      value={
                        currentFormData.fullName
                      }
                      onChange={(e) =>
                        updateField(
                          'fullName',
                          e.target.value
                        )
                      }
                      placeholder="Enter your full name"
                      className="w-full h-13 pl-11 pr-4 rounded-xl border border-slate-200 bg-slate-50/70 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all hover:border-slate-300 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />

                  </div>
                </div>

                {/* Email */}
                <div>

                  <label className="block mb-2 text-sm font-semibold text-slate-700">
                    Email Address
                  </label>

                  <div className="relative">

                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />

                    <input
                      type="email"
                      value={
                        currentFormData.email
                      }
                      disabled
                      className="w-full h-13 pl-11 pr-4 rounded-xl border border-slate-200 bg-slate-100 text-sm text-slate-500 cursor-not-allowed"
                    />

                  </div>

                  <p className="mt-1.5 text-xs text-slate-400">
                    Your account email cannot
                    be changed here.
                  </p>

                </div>

              </div>

              {/* Phone + DOB */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Phone */}
                <div>

                  <label className="block mb-2 text-sm font-semibold text-slate-700">
                    Phone Number

                    <span className="text-red-500 ml-1">
                      *
                    </span>
                  </label>

                  <div className="relative">

                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />

                    <input
                      type="tel"
                      required
                      value={
                        currentFormData.phone
                      }
                      onChange={(e) =>
                        updateField(
                          'phone',
                          e.target.value
                        )
                      }
                      placeholder="+961 70 123 456"
                      className="w-full h-13 pl-11 pr-4 rounded-xl border border-slate-200 bg-slate-50/70 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all hover:border-slate-300 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />

                  </div>
                </div>

                {/* Date of Birth */}
                <div>

                  <label className="block mb-2 text-sm font-semibold text-slate-700">
                    Date of Birth

                    <span className="text-red-500 ml-1">
                      *
                    </span>
                  </label>

                  <div className="relative">

                    <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 pointer-events-none" />

                    <input
                      type="date"
                      required
                      min="1900-01-01"
                      max={maxDob}
                      value={
                        currentFormData.dob
                      }
                      onChange={(e) =>
                        updateField(
                          'dob',
                          e.target.value
                        )
                      }
                      className="w-full h-13 pl-11 pr-4 rounded-xl border border-slate-200 bg-slate-50/70 text-sm text-slate-700 outline-none transition-all hover:border-slate-300 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />

                  </div>

                  <p className="mt-1.5 text-xs text-slate-400">
                    Select your date of birth.
                  </p>

                </div>

              </div>

              {/* Gender */}
              <div>

                <label className="block mb-3 text-sm font-semibold text-slate-700">
                  Gender

                  <span className="text-red-500 ml-1">
                    *
                  </span>
                </label>

                <div className="grid grid-cols-2 gap-4">

                  {/* Male */}
                  <label
                    className={`relative h-14 flex items-center justify-center rounded-xl border-2 text-sm font-semibold cursor-pointer transition-all ${
                      currentFormData.gender ===
                      'male'
                        ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50/30'
                    }`}
                  >

                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={
                        currentFormData.gender ===
                        'male'
                      }
                      onChange={(e) =>
                        updateField(
                          'gender',
                          e.target.value
                        )
                      }
                      className="sr-only"
                    />

                    <span
                      className={`mr-2 w-4 h-4 rounded-full border flex items-center justify-center ${
                        currentFormData.gender ===
                        'male'
                          ? 'border-blue-600'
                          : 'border-slate-300'
                      }`}
                    >

                      {currentFormData.gender ===
                        'male' && (
                        <span className="w-2 h-2 rounded-full bg-blue-600" />
                      )}

                    </span>

                    Male

                  </label>

                  {/* Female */}
                  <label
                    className={`relative h-14 flex items-center justify-center rounded-xl border-2 text-sm font-semibold cursor-pointer transition-all ${
                      currentFormData.gender ===
                      'female'
                        ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50/30'
                    }`}
                  >

                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={
                        currentFormData.gender ===
                        'female'
                      }
                      onChange={(e) =>
                        updateField(
                          'gender',
                          e.target.value
                        )
                      }
                      className="sr-only"
                    />

                    <span
                      className={`mr-2 w-4 h-4 rounded-full border flex items-center justify-center ${
                        currentFormData.gender ===
                        'female'
                          ? 'border-blue-600'
                          : 'border-slate-300'
                      }`}
                    >

                      {currentFormData.gender ===
                        'female' && (
                        <span className="w-2 h-2 rounded-full bg-blue-600" />
                      )}

                    </span>

                    Female

                  </label>

                </div>
              </div>

              {/* Bottom */}
              <div className="pt-7 border-t border-slate-100">

                <button
                  type="submit"
                  disabled={
                    updateProfileMutation.isPending
                  }
                  className="w-full h-13 flex items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >

                  {updateProfileMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />

                      Saving Profile...
                    </>
                  ) : (
                    <>
                      Save & Continue

                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}

                </button>

                <div className="flex items-center justify-center gap-2 mt-4 text-xs text-slate-400">

                  <ShieldCheck className="w-4 h-4" />

                  Your information is kept
                  private and secure.

                </div>

              </div>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
}