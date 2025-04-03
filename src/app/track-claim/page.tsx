'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import FormField from '@/components/FormField';

// Form schema with Zod validation
const schema = z
  .object({
    claimNumber: z.string().optional(),
    email: z.string().email('Invalid email format').optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
  })
  .refine(
    (data) => {
      const filledFields = [
        data.claimNumber,
        data.email,
        data.firstName,
        data.lastName,
      ].filter(Boolean).length;
      return filledFields >= 2;
    },
    { message: 'Please provide at least two fields.' }
  );

type FormData = z.infer<typeof schema>;

export default function TrackClaim() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setStatus(null);

    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      if (data.claimNumber) queryParams.append('claimNumber', data.claimNumber);
      if (data.email) queryParams.append('email', data.email);
      if (data.firstName) queryParams.append('firstName', data.firstName);
      if (data.lastName) queryParams.append('lastName', data.lastName);

      // Fetch claim status from backend
      const response = await fetch(
        `http://localhost:8080/api/claims/status?${queryParams.toString()}`
      );
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText);
      }
      const result = await response.text();
      setStatus(`Claim Status: ${result}`);
    } catch (error: any) {
      setStatus(error.message || 'Failed to fetch claim status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Track Your Claim</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Enter Your Details</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Please provide at least two of the following fields to track your
              claim.
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <FormField
                label="Claim Number"
                error={errors.claimNumber?.message}
              >
                <input
                  {...register('claimNumber')}
                  placeholder="Claim Number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </FormField>
              <FormField label="Email" error={errors.email?.message}>
                <input
                  type="email"
                  {...register('email')}
                  placeholder="Email"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </FormField>
              <FormField label="First Name" error={errors.firstName?.message}>
                <input
                  {...register('firstName')}
                  placeholder="First Name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </FormField>
              <FormField label="Last Name" error={errors.lastName?.message}>
                <input
                  {...register('lastName')}
                  placeholder="Last Name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </FormField>
            </div>
          </section>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors duration-200 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Checking...' : 'Check Status'}
            </button>
          </div>
        </form>

        {/* Status Display */}
        {status && (
          <div className="mt-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Result</h3>
            <p className="text-gray-700 dark:text-gray-300">{status}</p>
          </div>
        )}
      </div>
    </div>
  );
}