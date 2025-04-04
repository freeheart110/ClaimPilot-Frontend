'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import FormField from '@/components/FormField';

// Define enums based on backend models
enum ClaimType {
  COLLISION = 'COLLISION',
  THEFT = 'THEFT',
  VANDALISM = 'VANDALISM',
  DISASTER = 'DISASTER'
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

  const onSubmit = async (data: FormData) => {  //try user action later
    console.log("Form submitted:", data);
    const payload = {
      claimType: data.claimType,
      claimDate: new Date().toISOString().split("T")[0],
      dateOfAccident: data.dateOfAccident,
      status: "SUBMITTED",
      accidentDescription: data.accidentDescription,
      policeReportNumber: data.policeReportNumber,
      locationOfAccident: data.locationOfAccident,
      damageDescription: data.damageDescription,
      policyHolder: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        province: data.province,
        postalCode: data.postalCode,
        driverLicenseNumber: data.driverLicenseNumber,
        vehicleVIN: data.vehicleVIN,
      },
    };
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/claims`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Server error: ${errText}`);
      }
  
      const result = await response.json();
      console.log("Claim submitted successfully:", result);
      alert("Claim submitted successfully!");
  
      // Optionally reset form or redirect
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to submit claim.");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Submit a New Claim
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Policyholder Information */}
          <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">
              Policyholder Information
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <FormField label="First Name" error={errors.firstName?.message}>
                <input {...register('firstName')} placeholder="First Name" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </FormField>
              <FormField label="Last Name" error={errors.lastName?.message}>
                <input {...register('lastName')} placeholder="Last Name" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </FormField>
              <FormField label="Email (Optional)" error={errors.email?.message}>
                <input type="email" {...register('email')} placeholder="Email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </FormField>
              <FormField label="Phone (Optional)" error={errors.phone?.message}>
                <input {...register('phone')} placeholder="Phone" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </FormField>
              <div className="sm:col-span-2">
                <FormField label="Address" error={errors.address?.message}>
                  <input {...register('address')} placeholder="Address" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </FormField>
              </div>
              <FormField label="City" error={errors.city?.message}>
                <input {...register('city')} placeholder="City" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </FormField>
              <FormField label="Province" error={errors.province?.message}>
                <input {...register('province')} placeholder="Province" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </FormField>
              <FormField label="Postal Code" error={errors.postalCode?.message}>
                <input {...register('postalCode')} placeholder="Postal Code" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </FormField>
              <FormField label="Driver License Number" error={errors.driverLicenseNumber?.message}>
                <input {...register('driverLicenseNumber')} placeholder="Driver License Number" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </FormField>
              <FormField label="Vehicle VIN (Optional)">
                <input {...register('vehicleVIN')} placeholder="Vehicle VIN" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </FormField>
            </div>
          </section>

          {/* Claim Information */}
          <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">
              Claim Information
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <FormField label="Claim Type" error={errors.claimType?.message}>
                <select {...register('claimType')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="">Select Claim Type</option>
                  <option value={ClaimType.COLLISION}>Collision</option>
                  <option value={ClaimType.THEFT}>Theft</option>
                  <option value={ClaimType.VANDALISM}>Vandalism</option>
                  <option value={ClaimType.DISASTER}>Disaster</option>
                </select>
              </FormField>
              <FormField label="Date of Accident" error={errors.dateOfAccident?.message}>
                <input type="date" {...register('dateOfAccident')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </FormField>
              <div className="sm:col-span-2">
                <FormField label="Accident Description" error={errors.accidentDescription?.message}>
                  <textarea rows={4} {...register('accidentDescription')} placeholder="Describe the accident" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </FormField>
              </div>
              <FormField label="Police Report Number">
                <input {...register('policeReportNumber')} placeholder="Police Report Number" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </FormField>
              <FormField label="Location of Accident">
                <input {...register('locationOfAccident')} placeholder="Location of Accident" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </FormField>
              <div className="sm:col-span-2">
                <FormField label="Damage Description">
                  <textarea rows={4} {...register('damageDescription')} placeholder="Describe the damage" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </FormField>
              </div>
            </div>
          </section>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors duration-200"
            >
              Submit Claim
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
