'use client';

import React, { useRef, useState } from 'react';
import {
  X,
  Upload,
  Trash2,
  CheckCircle2,
  User,
} from 'lucide-react';

export interface IPatientFormData {
  fullName: string;
  condition: string;
  lastVisit?: string;
  avatarUrl?: string;
}

interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPatient: (patient: IPatientFormData) => void;
}

const initialFormData: IPatientFormData = {
  fullName: '',
  condition: '',
  avatarUrl: '',
};

export default function AddPatientModal({
  isOpen,
  onClose,
  onAddPatient,
}: AddPatientModalProps) {
  const [formData, setFormData] =
    useState<IPatientFormData>(initialFormData);

  const [selectedFileName, setSelectedFileName] =
    useState('');

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  if (!isOpen) {
    return null;
  }

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setSelectedFileName(file.name);

    const reader = new FileReader();

    reader.onloadend = () => {
      const result = reader.result;

      if (typeof result !== 'string') {
        return;
      }

      setFormData((previous) => ({
        ...previous,
        avatarUrl: result,
      }));
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setSelectedFileName('');

    setFormData((previous) => ({
      ...previous,
      avatarUrl: '',
    }));

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setSelectedFileName('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const fullName = formData.fullName.trim();
    const condition = formData.condition.trim();

    if (!fullName || !condition) {
      return;
    }

    setIsSubmitting(true);

    const payload: IPatientFormData = {
      fullName,
      condition,
      avatarUrl: formData.avatarUrl || undefined,
    };

    try {
      onAddPatient(payload);
      resetForm();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-sm font-bold text-slate-800">
            Add New Patient
          </h3>

          <button
            type="button"
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4"
        >
          {/* Patient Photo */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">
              Patient Photo
            </label>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                {formData.avatarUrl ? (
                  <img
                    src={formData.avatarUrl}
                    alt="Patient preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 text-slate-400" />
                )}
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                id="patient-avatar"
              />

              <div className="flex items-center gap-2">
                <label
                  htmlFor="patient-avatar"
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer flex items-center gap-1.5 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5 text-slate-500" />
                  <span>Upload</span>
                </label>

                {selectedFileName && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    aria-label="Remove image"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">
              Full Name
            </label>

            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              placeholder="e.g. Sami Ahmed"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Condition */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">
              Medical Condition
            </label>

            <input
              type="text"
              name="condition"
              required
              value={formData.condition}
              onChange={handleChange}
              placeholder="e.g. Hypertension"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs disabled:opacity-50 transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />

              <span>
                {isSubmitting
                  ? 'Saving...'
                  : 'Save Patient'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}