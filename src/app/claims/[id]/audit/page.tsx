'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface ClaimSimple {
  id: number;
  claimNumber: string;
}

interface AuditTrail {
  id: number;
  action: string;
  details: string;
  timestamp: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  claim: ClaimSimple;
}

export default function AuditTrailPage() {
  const { id } = useParams();
  const [logs, setLogs] = useState<AuditTrail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/claims/${id}/audit`, {
          credentials: 'include'
        });
        if (!res.ok) throw new Error('Failed to fetch audit logs');
        const data = await res.json();
        setLogs(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchAuditLogs();
  }, [id]);

  return (
    <div className="max-w-5xl mx-auto py-20 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Audit Trail for Claim #{logs[0]?.claim?.claimNumber || id}
      </h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && logs.length === 0 && <p>No audit logs found.</p>}

      <table className="w-full bg-white dark:bg-gray-800 rounded shadow-md">
        <thead>
          <tr className="text-left text-gray-600 dark:text-gray-300">
            <th className="p-3">Action</th>
            <th className="p-3">Details</th>
            <th className="p-3">User</th>
            <th className="p-3">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log.id} className="border-t border-gray-300 dark:border-gray-700">
              <td className="p-3">{log.action}</td>
              <td className="p-3 whitespace-pre-line">{log.details}</td>
              <td className="p-3">{log.user.firstName} {log.user.lastName} ({log.user.email})</td>
              <td className="p-3">{new Date(log.timestamp).toLocaleString()}</td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}