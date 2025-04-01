'use client';

import React, { useState } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import TextInput from "@/components/TextInput";
import Dropdown from "@/components/Dropdown";
import DatePickerWrapper from "@/components/DatePickerWrapper";
import DragDropUpload from "@/components/DragDropUpload";

export default function SubmitClaim() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [policyNumber, setPolicyNumber] = useState("");
    const [claimType, setClaimType] = useState("");
    const [dateOfIncident, setDateOfIncident] = useState<Date | null>(null);
    const [file, setFile] = useState<File | null>(null);

    const claimTypes = ["Auto", "Commercial", "Injury"]; // Static options, adjust as needed

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("fullName", fullName);
        formData.append("email", email);
        formData.append("policyNumber", policyNumber);
        formData.append("claimType", claimType);
        formData.append("dateOfIncident", dateOfIncident?.toISOString() || "");
        if (file) formData.append("file", file);

        const res = await fetch("/api/claims", {
            method: "POST",
            body: formData,
        });
        if (res.ok) {
            alert("Claim submitted successfully!");
            // Reset form or redirect
        } else {
            alert("Error submitting claim.");
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <Card>
                <h2 className="text-gray-500 text-sm mb-2">Submit Claim</h2>
                <h1 className="text-2xl font-bold text-center">ClaimPilot</h1>
                <p className="text-center text-xl mt-2">Submit a New Claim</p>
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <TextInput label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                    <TextInput label="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <TextInput label="Policy Number" value={policyNumber} onChange={(e) => setPolicyNumber(e.target.value)} />
                    <Dropdown label="Type of Claim" value={claimType} onChange={(e) => setClaimType(e.target.value)} options={claimTypes} />
                    <DatePickerWrapper label="Date of Incident" selected={dateOfIncident} onChangeAction={setDateOfIncident} />
                    <DragDropUpload label="Description" onDropAction={(files) => setFile(files[0])} />
                    <div className="text-center">
                        <Button>Submit Claim</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}