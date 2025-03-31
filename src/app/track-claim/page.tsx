'use client';

import { useState } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import TextInput from "@/components/TextInput";

export default function TrackClaim() {
    const [claimNumber, setClaimNumber] = useState("");
    const [policyNumber, setPolicyNumber] = useState("");
    const [claimStatus, setClaimStatus] = useState<string | null>(null);

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch(`/api/claims?claimNumber=${claimNumber}&policyNumber=${policyNumber}`);
        if (res.ok) {
            const data = await res.json();
            setClaimStatus(data.status); // Adjust based on your API response
        } else {
            setClaimStatus("Claim not found.");
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <Card>
                <h2 className="text-gray-500 text-sm mb-2">Track Claim</h2>
                <h1 className="text-2xl font-bold text-center">ClaimPilot</h1>
                <p className="text-center text-xl mt-2">Track My Claim</p>
                <form onSubmit={handleTrack} className="mt-4 space-y-4">
                    <TextInput label="Claim Number" value={claimNumber} onChange={(e) => setClaimNumber(e.target.value)} />
                    <TextInput label="Policy Number" value={policyNumber} onChange={(e) => setPolicyNumber(e.target.value)} />
                    <div className="text-center">
                        <Button>Track Claim</Button>
                    </div>
                </form>
                {claimStatus && (
                    <div className="mt-4 text-center">
                        <p>Status: {claimStatus}</p>
                    </div>
                )}
            </Card>
        </div>
    );
}