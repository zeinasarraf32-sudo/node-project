'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Calendar, Save, Loader2, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

export default function ProfilePage() {
  const router = useRouter();
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    gender: 'male',
  });

  // جلب البيانات عبر GET عند تحميل الصفحة
  useEffect(() => {
  const userName = localStorage.getItem('userName') || '';
  const userEmail = localStorage.getItem('userEmail') || '';
  const userPhone = localStorage.getItem('userPhone') || '';
  const userDob = localStorage.getItem('userDob') || '';
  const userGender = localStorage.getItem('userGender') || 'male';

  setFormData({
    fullName: userName,
    email: userEmail,
    phone: userPhone,
    dob: userDob,
    gender: userGender,
  });

  setFetching(false);
}, []);

  // حفظ وحفظ تعديلات البروفايل عبر POST
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  setSaving(true);
  setSuccessMsg('');
  setErrorMsg('');

  try {
    const email = localStorage.getItem('userEmail');

    if (!email) {
      setErrorMsg('User email not found. Please sign up again.');
      return;
    }

    await axios.put(
      '/api/patient/profile',
      {
        fullName: formData.fullName,
        phone: formData.phone,
      },
      {
        headers: {
          'x-user-email': email,
        },
      }
    );

    // حفظ المعلومات الإضافية مؤقتًا في LocalStorage
    localStorage.setItem('userName', formData.fullName);
    localStorage.setItem('userEmail', formData.email);
    localStorage.setItem('userPhone', formData.phone);
    localStorage.setItem('userDob', formData.dob);
    localStorage.setItem('userGender', formData.gender);

    setSuccessMsg('Profile saved successfully!');

    setTimeout(() => {
      router.push('/doctors');
    }, 1000);
  } catch (error: any) {
    console.error('Profile update error:', error);

    setErrorMsg(
      error.response?.data?.message ||
        'Failed to save profile. Please try again.'
    );
  } finally {
    setSaving(false);
  }
};

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-gray-100 p-6 sm:p-10">
        <div className="mb-8 border-b border-gray-100 pb-5">
          <h1 className="text-2xl font-bold text-gray-900">Complete Profile Details</h1>
          <p className="text-sm text-gray-500 mt-1">
            Please fill in your medical and contact details to complete your account setup.
          </p>
        </div>

        {successMsg && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-700 text-sm">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <User className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Ali Hassan"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Phone Number
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Phone className="h-5 w-5" />
                </div>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+961 70 123 456"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Date of Birth
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Calendar className="h-5 w-5" />
                </div>
                <input
                  type="date"
                  required
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                />
              </div>
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Gender
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label
                className={`flex items-center justify-center py-2.5 px-4 border rounded-xl text-sm font-semibold cursor-pointer transition ${
                  formData.gender === 'male'
                    ? 'border-blue-600 bg-blue-50 text-blue-600'
                    : 'border-gray-200 text-gray-600 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={formData.gender === 'male'}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="sr-only"
                />
                Male
              </label>

              <label
                className={`flex items-center justify-center py-2.5 px-4 border rounded-xl text-sm font-semibold cursor-pointer transition ${
                  formData.gender === 'female'
                    ? 'border-blue-600 bg-blue-50 text-blue-600'
                    : 'border-gray-200 text-gray-600 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={formData.gender === 'female'}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="sr-only"
                />
                Female
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={saving}
            className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition disabled:opacity-50 mt-8"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving Profile...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save & Continue
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}