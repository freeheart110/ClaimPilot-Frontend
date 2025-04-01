'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Define enums based on backend models
enum ClaimType {
  AUTO = 'AUTO',
  COMMERCIAL = 'COMMERCIAL',
  INJURY = 'INJURY',
}

// Form schema with Zod validation
const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email format').optional(),
  phone: z.string().regex(/^[0-9\-\+\(\) ]{7,20}$/, 'Invalid phone number format').optional(),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  province: z.string().min(1, 'Province is required'),
  postalCode: z.string().regex(/^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/, 'Invalid Canadian postal code'),
  driverLicenseNumber: z.string().min(1, 'Driver license number is required'),
  vehicleVIN: z.string().optional(),
  claimType: z.nativeEnum(ClaimType, { errorMap: () => ({ message: 'Claim type is required' }) }),
  dateOfAccident: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date' }),
  accidentDescription: z.string().min(1, 'Accident description is required').max(5000, 'Description too long'),
  policeReportNumber: z.string().optional(),
  locationOfAccident: z.string().optional(),
  damageDescription: z.string().optional(),
  estimatedRepairCost: z.number().min(0, 'Cost must be positive').optional().or(z.literal('')),
});

type FormData = z.infer<typeof schema>;

export default function SubmitClaim() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    // Add claimDate (today) before sending to backend
    const submissionData = {
      ...data,
      claimDate: new Date().toISOString().split('T')[0], // Today's date
      status: 'SUBMITTED', // Default status
    };
    console.log(submissionData); // Replace with API call to backend
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 font-[var(--font-geist-sans)]">
          Submit a New Claim
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Policyholder Information */}
          <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 font-[var(--font-geist-sans)]">
              Policyholder Information
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  First Name
                </label>
                <input
                  {...register('firstName')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="First Name"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-500">{errors.firstName.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Last Name
                </label>
                <input
                  {...register('lastName')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Last Name"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-500">{errors.lastName.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email (Optional)
                </label>
                <input
                  {...register('email')}
                  type="email"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phone (Optional)
                </label>
                <input
                  {...register('phone')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Phone"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Address
                </label>
                <input
                  {...register('address')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Address"
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-500">{errors.address.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  City
                </label>
                <input
                  {...register('city')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="City"
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-500">{errors.city.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Province
                </label>
                <input
                  {...register('province')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Province"
                />
                {errors.province && (
                  <p className="mt-1 text-sm text-red-500">{errors.province.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Postal Code
                </label>
                <input
                  {...register('postalCode')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Postal Code"
                />
                {errors.postalCode && (
                  <p className="mt-1 text-sm text-red-500">{errors.postalCode.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Driver License Number
                </label>
                <input
                  {...register('driverLicenseNumber')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Driver License Number"
                />
                {errors.driverLicenseNumber && (
                  <p className="mt-1 text-sm text-red-500">{errors.driverLicenseNumber.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Vehicle VIN (Optional)
                </label>
                <input
                  {...register('vehicleVIN')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Vehicle VIN"
                />
              </div>
            </div>
          </section>

          {/* Claim Information */}
          <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 font-[var(--font-geist-sans)]">
              Claim Information
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Claim Type
                </label>
                <select
                  {...register('claimType')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Select Claim Type</option>
                  <option value={ClaimType.AUTO}>Auto</option>
                  <option value={ClaimType.COMMERCIAL}>Commercial</option>
                  <option value={ClaimType.INJURY}>Injury</option>
                </select>
                {errors.claimType && (
                  <p className="mt-1 text-sm text-red-500">{errors.claimType.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Date of Accident
                </label>
                <input
                  type="date"
                  {...register('dateOfAccident')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                {errors.dateOfAccident && (
                  <p className="mt-1 text-sm text-red-500">{errors.dateOfAccident.message}</p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Accident Description
                </label>
                <textarea
                  {...register('accidentDescription')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Describe the accident"
                  rows={4}
                />
                {errors.accidentDescription && (
                  <p className="mt-1 text-sm text-red-500">{errors.accidentDescription.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Police Report Number (Optional)
                </label>
                <input
                  {...register('policeReportNumber')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Police Report Number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Location of Accident (Optional)
                </label>
                <input
                  {...register('locationOfAccident')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Location of Accident"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Damage Description (Optional)
                </label>
                <textarea
                  {...register('damageDescription')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Describe the damage"
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Estimated Repair Cost (Optional)
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register('estimatedRepairCost', { valueAsNumber: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Estimated Repair Cost"
                />
                {errors.estimatedRepairCost && (
                  <p className="mt-1 text-sm text-red-500">{errors.estimatedRepairCost.message}</p>
                )}
              </div>
            </div>
          </section>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors duration-200 font-[var(--font-geist-sans)]"
            >
              Submit Claim
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}