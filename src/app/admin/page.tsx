'use client';

import React, { useState, useEffect } from 'react';
import Button from '@/components/Button';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';

// Zod validation schema
const updateSchema = z.object({
  status: z.string().optional(),
  estimatedAmount: z.number().min(0, 'Amount must be non-negative').optional(),
  finalAmount: z.number().min(0, 'Amount must be non-negative').optional(),
});

interface Claim {
  id: number;
  claimNumber: string;
  status: string;
  claimDate: string;
  estimatedRepairCost: number;
  finalSettlementAmount: number;
}

export default function AdminDashboard() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/claims`);
        if (!response.ok) throw new Error('Failed to fetch claims');
        const data: Claim[] = await response.json();
        setClaims(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, []);

  const handleUpdate = async (
    id: number,
    data: { status?: string; estimatedRepairCost?: number; finalSettlementAmount?: number }
  ) => {
    if (!id) {
      alert('Invalid claim ID');
      return;
    }

    try {
      setUpdating(true);
      const response = await fetch(`http://localhost:8080/api/claims/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to update claim');
      }

      const updatedClaim: Claim = await response.json();
      setClaims((prev) =>
        prev.map((claim) => (claim.id === id ? updatedClaim : claim))
      );

      setSuccessMessage(`Claim ${updatedClaim.claimNumber} updated successfully.`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      alert(`Error: ${(err as Error).message}`);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  const filteredClaims = claims
    .filter((claim) => filterStatus === 'ALL' || claim.status === filterStatus)
    .sort((a, b) => new Date(b.claimDate).getTime() - new Date(a.claimDate).getTime());

  return (
    <div className="min-h-screen bg-background text-foreground py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Admin Dashboard</h1>

        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <label className="text-sm font-medium mr-2">Filter by Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="ALL">All</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="IN_REVIEW">In Review</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="PENDING_INFO">Pending Info</option>
              <option value="UNDER_INVESTIGATION">Under Investigation</option>
              <option value="PAID">Paid</option>
              <option value="CLOSED">Closed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        {successMessage && (
          <div className="mb-6 text-green-700 bg-green-100 border border-green-400 px-4 py-3 rounded">
            {successMessage}
          </div>
        )}

        <table className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <thead>
            <tr className="text-left text-gray-500 dark:text-gray-400">
              <th className="p-4">Claim Number</th>
              <th className="p-4">Claim Date</th>
              <th className="p-4">Status</th>
              <th className="p-4">Estimated Amount</th>
              <th className="p-4">Final Amount</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClaims.map((claim) => (
              <ClaimRow
                key={claim.id}
                claim={claim}
                onUpdate={handleUpdate}
                updating={updating}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface ClaimRowProps {
  claim: Claim;
  updating: boolean;
  onUpdate: (
    id: number,
    data: { status?: string; estimatedRepairCost?: number; finalSettlementAmount?: number }
  ) => void;
}

function ClaimRow({ claim, onUpdate, updating }: ClaimRowProps) {
  const { register, handleSubmit, reset } = useForm({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      status: claim.status,
      estimatedAmount: claim.estimatedRepairCost,
      finalAmount: claim.finalSettlementAmount,
    },
  });

  const onSubmit = (data: z.infer<typeof updateSchema>) => {
    const updateData = {
      status: data.status,
      estimatedRepairCost: data.estimatedAmount,
      finalSettlementAmount: data.finalAmount,
    };

    onUpdate(claim.id, updateData);
    reset(data);
  };

  return (
    <tr className="border-t border-gray-200 dark:border-gray-700">
      <td className="p-4 font-medium text-primary underline">
        <Link href={`/admin/claims/${claim.id}`}>
          {claim.claimNumber}
        </Link>
      </td>
      <td className="p-4">{new Date(claim.claimDate).toLocaleDateString()}</td>
      <td className="p-4">
        <select
          {...register('status')}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="SUBMITTED">Submitted</option>
          <option value="IN_REVIEW">In Review</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="PENDING_INFO">Pending Info</option>
          <option value="UNDER_INVESTIGATION">Under Investigation</option>
          <option value="PAID">Paid</option>
          <option value="CLOSED">Closed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </td>
      <td className="p-4">
        <input
          type="number"
          step="0.01"
          {...register('estimatedAmount', { valueAsNumber: true })}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </td>
      <td className="p-4">
        <input
          type="number"
          step="0.01"
          {...register('finalAmount', { valueAsNumber: true })}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </td>
      <td className="p-4">
        <Button onClick={handleSubmit(onSubmit)} disabled={updating}>
          {updating ? 'Updating...' : 'Update'}
        </Button>
      </td>
    </tr>
  );
}