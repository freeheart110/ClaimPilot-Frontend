'use client';

import { useState, useEffect } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";
// import StatusIndicator from "@/components/StatusIndicator";

export default function AllClaims() {
    const [claims, setClaims] = useState([]);
    const [selectedClaim, setSelectedClaim] = useState<any>(null);

    useEffect(() => {
        const fetchClaims = async () => {
            const res = await fetch("/api/claims");
            const data = await res.json();
            setClaims(data);
        };
        fetchClaims();
    }, []);

    const handleUpdateStatus = async () => {
        if (!selectedClaim) return;
        const res = await fetch(`/api/claims/${selectedClaim.claimNumber}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: selectedClaim.status }),
        });
        if (res.ok) alert("Status updated!");
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <Card>
                <div className="flex justify-between">
                    <h2 className="text-gray-500 text-sm mb-2">Admin - All Claims</h2>
                    <button className="text-gray-500 text-sm">Log out</button>
                </div>
                <h1 className="text-2xl font-bold text-center">ClaimPilot</h1>
                <p className="text-center text-xl mt-2">All Claims</p>
                <div className="mt-4">
                    <table className="w-full border-collapse">
                        <thead>
                        <tr className="bg-gray-200">
                            <th className="p-2">Claim Number</th>
                            <th className="p-2">Policy Holder</th>
                            <th className="p-2">Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {claims.map((claim: any) => (
                            <tr
                                key={claim.claimNumber}
                                className="cursor-pointer hover:bg-gray-100"
                                onClick={() => setSelectedClaim(claim)}
                            >
                                <td className="p-2">{claim.claimNumber}</td>
                                <td className="p-2">{claim.policyHolder}</td>
                                <td className="p-2">{claim.status}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                {selectedClaim && (
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold">Claim {selectedClaim.claimNumber}</h3>
                        <StatusIndicator status={selectedClaim.status} />
                        <div className="mt-2">
                            <label className="block text-gray-700">Adjuster Comments</label>
                            <textarea
                                className="w-full p-2 border rounded"
                                defaultValue={selectedClaim.comments || "Need additional information."}
                            />
                        </div>
                        <div className="mt-2">
                            <label className="block text-gray-700">Update Status</label>
                            <select
                                className="w-full p-2 border rounded"
                                value={selectedClaim.status}
                                onChange={(e) => setSelectedClaim({ ...selectedClaim, status: e.target.value })}
                            >
                                <option>Submitted</option>
                                <option>Under Review</option>
                                <option>Approved</option>
                            </select>
                        </div>
                        <div className="mt-4 text-center">
                            <Button onClick={handleUpdateStatus}>Save Changes</Button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}