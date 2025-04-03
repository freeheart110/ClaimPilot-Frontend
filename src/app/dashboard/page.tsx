'use client';

import React, { useEffect, useState } from 'react';
import Button from '@/components/Button';

interface Claim {
  id: number;
  claimNumber: string;
  claimType: string;
  status: string;
  claimDate: string;
  estimatedRepairCost?: number;
  finalSettlementAmount?: number;
}

const statusOptions = ['SUBMITTED', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'CLOSED'];

export default function AdminDashboard() {
  const [claims, setClaims] = useState<Claim[]>([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/claims')
      .then(res => res.json())
      .then(data => setClaims(data))
      .catch(err => console.error('Failed to fetch claims:', err));
  }, []);

  const handleInputChange = (id: number, field: keyof Claim, value: string | number) => {
    setClaims(prev =>
      prev.map(claim =>
        claim.id === id ? { ...claim, [field]: value } : claim
      )
    );
  };

  const handleUpdate = async (claim: Claim) => {
    try {
      const response = await fetch(`http://localhost:8080/api/claims/${claim.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(claim),
      });
      if (!response.ok) throw new Error('Update failed');
      alert('Claim updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Error updating claim.');
    }
  };

  return (
    <div className="min-h-screen px-6 py-10 bg-background text-foreground">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 rounded shadow">
          <thead>
            <tr className="text-left border-b">
              <th className="p-4">Claim #</th>
              <th className="p-4">Type</th>
              <th className="p-4">Status</th>
              <th className="p-4">Claim Date</th>
              <th className="p-4">Est. Amount</th>
              <th className="p-4">Final Amount</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {claims.map(claim => (
              <tr key={claim.id} className="border-b">
                <td className="p-4">{claim.claimNumber}</td>
                <td className="p-4">{claim.claimType}</td>
                <td className="p-4">
                  <select
                    value={claim.status}
                    onChange={(e) => handleInputChange(claim.id, 'status', e.target.value)}
                    className="rounded border border-gray-300 px-2 py-1 dark:bg-gray-700 dark:text-white"
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </td>
                <td className="p-4">{claim.claimDate}</td>
                <td className="p-4">
                  <input
                    type="number"
                    value={claim.estimatedRepairCost || ''}
                    onChange={(e) => handleInputChange(claim.id, 'estimatedRepairCost', parseFloat(e.target.value))}
                    className="w-28 rounded border border-gray-300 px-2 py-1 dark:bg-gray-700 dark:text-white"
                  />
                </td>
                <td className="p-4">
                  <input
                    type="number"
                    value={claim.finalSettlementAmount || ''}
                    onChange={(e) => handleInputChange(claim.id, 'finalSettlementAmount', parseFloat(e.target.value))}
                    className="w-28 rounded border border-gray-300 px-2 py-1 dark:bg-gray-700 dark:text-white"
                  />
                </td>
                <td className="p-4">
                  <Button onClick={() => handleUpdate(claim)}>Update</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
