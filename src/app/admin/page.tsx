'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@/components/Button';
import Link from 'next/link';

interface Claim {
  id: number;
  claimNumber: string;
  status: string;
  claimDate: string;
  assignedAdjuster: { id: number; firstName: string; lastName: string } | null;
}

interface Adjuster {
  id: number;
  firstName: string;
  lastName: string;
}

const assignSchema = z.object({
  adjusterId: z.number().min(1, 'Please select an adjuster'),
});

export default function AdminClaimsPage() {
  const router = useRouter();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [adjusters, setAdjusters] = useState<Adjuster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/me`, { credentials: 'include' });
        if (!authRes.ok) return router.push('/login');

        const [claimsRes, adjustersRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/claims`, { credentials: 'include' }),
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/adjusters`, { credentials: 'include' }),
        ]);
        if (!claimsRes.ok) throw new Error('Failed to fetch claims');
        if (!adjustersRes.ok) throw new Error('Failed to fetch adjusters');

        const claimsData: Claim[] = await claimsRes.json();
        const adjustersData: Adjuster[] = await adjustersRes.json();
        setClaims(claimsData);
        setAdjusters(adjustersData);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  const handleAssign = async (id: number, adjusterId: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/claims/${id}/assign`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adjusterId }),
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to assign adjuster');

      const updatedClaim: Claim = await response.json();
      setClaims((prev) => prev.map((claim) => (claim.id === id ? updatedClaim : claim)));
      alert('Adjuster assigned successfully!');
    } catch (err) {
      alert(`Error: ${(err as Error).message}`);
    }
  };

  const statuses = [
    'SUBMITTED', 'IN_REVIEW', 'APPROVED', 'REJECTED',
    'PENDING_INFO', 'UNDER_INVESTIGATION', 'PAID', 'CLOSED', 'CANCELLED',
  ];

  const filteredClaims = claims
    .filter((c) => filterStatus === 'ALL' || c.status === filterStatus)
    .sort((a, b) => new Date(b.claimDate).getTime() - new Date(a.claimDate).getTime());

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-background text-foreground py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-4">Admin Page</h1>
        <h2 className="text-2xl text-center mb-4">Claims</h2>

        <div className="mb-6 flex flex-col sm:flex-row items-center gap-4">
          <label className="text-sm font-medium mr-2">Filter by Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="ALL">All</option>
            {statuses.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <table className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <thead>
            <tr className="text-left text-gray-500 dark:text-gray-400">
              <th className="p-4">Claim Number</th>
              <th className="p-4">Adjuster</th>
              <th className="p-4">Status</th>
              <th className="p-4">Submit Date</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClaims.map((claim) => (
              <ClaimRow
                key={claim.id}
                claim={claim}
                adjusters={adjusters}
                onAssign={handleAssign}
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
  adjusters: Adjuster[];
  onAssign: (claimId: number, adjusterId: number) => void;
}

function ClaimRow({ claim, adjusters, onAssign }: ClaimRowProps) {
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(assignSchema),
    defaultValues: { adjusterId: claim.assignedAdjuster?.id || 0},
  });

  const [mode, setMode] = useState<'none' | 'assignAdjuster'>('none');

  const onSubmit = (data: z.infer<typeof assignSchema>) => {
    onAssign(claim.id, data.adjusterId);
    setMode('none');
  };

  return (
    <tr className="border-t border-gray-200 dark:border-gray-700">
      <td className="p-4 font-medium text-primary underline">
        <Link href={`/claims/${claim.id}`}>{claim.claimNumber}</Link>
      </td>
      <td className="p-4">
        {mode === 'assignAdjuster' ? (
          <select
            {...register('adjusterId', { valueAsNumber: true })}
            className="w-full p-1 border rounded"
          >
            <option value={0}>Unassigned</option>
            {adjusters.map((adjuster) => (
              <option key={adjuster.id} value={adjuster.id}>
                {adjuster.firstName} {adjuster.lastName}
              </option>
            ))}
          </select>
        ) : (
          claim.assignedAdjuster
            ? `${claim.assignedAdjuster.firstName} ${claim.assignedAdjuster.lastName}`
            : 'Unassigned'
        )}
      </td>
      <td className="p-4">{claim.status}</td>
      <td className="p-4">{new Date(claim.claimDate).toLocaleDateString()}</td>
      <td className="p-4 space-y-2">
        {mode === 'none' ? (
          <select
            defaultValue=""
            className="w-40 border rounded px-2 py-1 text-sm"
            onChange={(e) => {
              if (e.target.value === 'assign') setMode('assignAdjuster');
              else if (e.target.value === 'view') window.location.href = `/claims/${claim.id}`;
              else if (e.target.value === 'audit') window.location.href = `/claims/${claim.id}/audit`;
            }}
          >
            <option value="" disabled>Choose an action</option>
            <option value="assign">Assign Adjuster</option>
            <option value="view">View Details</option>
            <option value="audit">Audit Trail</option>
          </select>
        ) : (
          <Button type="submit" onClick={handleSubmit(onSubmit)}>Save</Button>
        )}
      </td>
    </tr>
  );
}