"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Button from "@/components/Button";
import FormField from "@/components/FormField";

// Define ClaimStatus enum to match typical backend values
type ClaimStatus =
  | "SUBMITTED"
  | "IN_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "PENDING_INFO"
  | "UNDER_INVESTIGATION"
  | "PAID"
  | "CLOSED"
  | "CANCELLED";

// Define ClaimType enum to match backend (as provided in the query)
type ClaimType = "COLLISION" | "THEFT" | "VANDALISM" | "DISASTER";

// Define the Claim interface based on typical backend ClaimDTO
interface Claim {
  id: number;
  claimNumber: string;
  claimType: ClaimType;
  status: ClaimStatus;
  claimDate: string; // ISO date string (e.g., "2023-10-15")
  dateOfAccident: string; // ISO date string
  accidentDescription: string;
  policeReportNumber: string | null;
  locationOfAccident: string | null;
  damageDescription: string | null;
  estimatedRepairCost: number | null; // Using number for simplicity in frontend
  finalSettlementAmount: number | null; // Using number for simplicity
  policyHolder: {
    id: number;
    firstName: string;
    lastName: string;
    email: string | null;
    phone: string | null;
    address: string;
    city: string;
    province: string;
    postalCode: string;
    driverLicenseNumber: string;
    vehicleVIN: string | null;
  };
}

// Define the validation schema for editable claim fields
const claimSchema = z.object({
  claimNumber: z.string(),
  claimType: z.enum(["COLLISION", "THEFT", "VANDALISM", "DISASTER"]),
  status: z.enum([
    "SUBMITTED",
    "IN_REVIEW",
    "APPROVED",
    "REJECTED",
    "PENDING_INFO",
    "UNDER_INVESTIGATION",
    "PAID",
    "CLOSED",
    "CANCELLED",
  ]),
  claimDate: z.string().min(1, "Claim date is required"),
  dateOfAccident: z.string().min(1, "Date of accident is required"),
  accidentDescription: z.string().min(1, "Accident description is required"),
  policeReportNumber: z.string().nullable().optional(), // Allows null or undefined
  locationOfAccident: z.string().nullable().optional(), // Allows null or undefined
  damageDescription: z.string().nullable().optional(), // Allows null or undefined
  estimatedRepairCost: z.number().min(0).nullable().optional(),
  finalSettlementAmount: z.number().min(0).nullable().optional(),
});

// Infer the form data type from the schema
type ClaimFormData = z.infer<typeof claimSchema>;

export default function ClaimDetailsPage() {
  const { id } = useParams();
  const [claim, setClaim] = useState<Claim | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"view" | "edit">("view");

  // Set up React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClaimFormData>({
    resolver: zodResolver(claimSchema),
  });

  // Fetch claim data when component mounts
  useEffect(() => {
    const fetchClaim = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/claims/${id}`);
        if (!response.ok) throw new Error("Failed to fetch claim");
        const data: Claim = await response.json();
        setClaim(data);
        // Reset form with claim data, handling null to undefined for form fields
        reset({
          claimNumber: data.claimNumber,
          claimType: data.claimType,
          status: data.status,
          claimDate: data.claimDate,
          dateOfAccident: data.dateOfAccident,
          accidentDescription: data.accidentDescription,
          policeReportNumber: data.policeReportNumber ?? undefined, // Convert null to undefined
          locationOfAccident: data.locationOfAccident ?? undefined, // Convert null to undefined
          damageDescription: data.damageDescription ?? undefined, // Convert null to undefined
          estimatedRepairCost: data.estimatedRepairCost ?? undefined,
          finalSettlementAmount: data.finalSettlementAmount ?? undefined,
        });
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchClaim();
  }, [id, reset]);

  // Handle form submission
  const onSubmit = async (data: ClaimFormData) => {
    try {
      // Create payload with updated fields, excluding policyHolder
      const payload = {
        id: Number(id), // Ensure ID is included
        ...data,
        // Convert undefined back to null for backend
        policeReportNumber: data.policeReportNumber ?? null,
        locationOfAccident: data.locationOfAccident ?? null,
        damageDescription: data.damageDescription ?? null,
        estimatedRepairCost: data.estimatedRepairCost ?? null,
        finalSettlementAmount: data.finalSettlementAmount ?? null,
      };
      console.log("Data to submit:", payload);

      const response = await fetch(`http://localhost:8080/api/claims/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error:", response.status, errorText);
        throw new Error(`Failed to update claim: ${errorText}`);
      }

      const updatedClaim: Claim = await response.json();
      console.log("Updated claim:", updatedClaim);
      setClaim(updatedClaim);
      setMode("view");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  // Render loading or error states
  if (loading) return <p className="text-center py-20">Loading claim details...</p>;
  if (error) return <p className="text-center text-red-500 py-20">Error: {error}</p>;
  if (!claim) return <p className="text-center py-20">No claim data available.</p>;

  return (
    <main className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center">Claim Details</h1>

        {mode === "view" ? (
          <div className="space-y-8">
            {/* Claim Details Section */}
            <section className="bg-white shadow-sm rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Claim Information</h2>
              <div className="space-y-2">
                <div className="flex">
                  <span className="w-1/3 font-semibold">Claim Number:</span>
                  <span className="w-2/3">{claim.claimNumber}</span>
                </div>
                <div className="flex">
                  <span className="w-1/3 font-semibold">Claim Type:</span>
                  <span className="w-2/3">{claim.claimType}</span>
                </div>
                <div className="flex">
                  <span className="w-1/3 font-semibold">Status:</span>
                  <span className="w-2/3">{claim.status}</span>
                </div>
                <div className="flex">
                  <span className="w-1/3 font-semibold">Claim Date:</span>
                  <span className="w-2/3">{claim.claimDate}</span>
                </div>
                <div className="flex">
                  <span className="w-1/3 font-semibold">Date of Accident:</span>
                  <span className="w-2/3">{claim.dateOfAccident}</span>
                </div>
                <div className="flex">
                  <span className="w-1/3 font-semibold">Accident Description:</span>
                  <span className="w-2/3">{claim.accidentDescription}</span>
                </div>
                <div className="flex">
                  <span className="w-1/3 font-semibold">Police Report Number:</span>
                  <span className="w-2/3">{claim.policeReportNumber || "N/A"}</span>
                </div>
                <div className="flex">
                  <span className="w-1/3 font-semibold">Location of Accident:</span>
                  <span className="w-2/3">{claim.locationOfAccident || "N/A"}</span>
                </div>
                <div className="flex">
                  <span className="w-1/3 font-semibold">Damage Description:</span>
                  <span className="w-2/3">{claim.damageDescription || "N/A"}</span>
                </div>
                <div className="flex">
                  <span className="w-1/3 font-semibold">Estimated Repair Cost:</span>
                  <span className="w-2/3">
                    {claim.estimatedRepairCost != null ? claim.estimatedRepairCost : "N/A"}
                  </span>
                </div>
                <div className="flex">
                  <span className="w-1/3 font-semibold">Final Settlement Amount:</span>
                  <span className="w-2/3">
                    {claim.finalSettlementAmount != null ? claim.finalSettlementAmount : "N/A"}
                  </span>
                </div>
              </div>
            </section>

            {/* Policyholder Details Section */}
            <section className="bg-white shadow-sm rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Policyholder Information</h2>
              <div className="space-y-2">
                <div className="flex">
                  <span className="w-1/3 font-semibold">First Name:</span>
                  <span className="w-2/3">{claim.policyHolder.firstName}</span>
                </div>
                <div className="flex">
                  <span className="w-1/3 font-semibold">Last Name:</span>
                  <span className="w-2/3">{claim.policyHolder.lastName}</span>
                </div>
                <div className="flex">
                  <span className="w-1/3 font-semibold">Email:</span>
                  <span className="w-2/3">{claim.policyHolder.email || "N/A"}</span>
                </div>
                <div className="flex">
                  <span className="w-1/3 font-semibold">Phone:</span>
                  <span className="w-2/3">{claim.policyHolder.phone || "N/A"}</span>
                </div>
                <div className="flex">
                  <span className="w-1/3 font-semibold">Address:</span>
                  <span className="w-2/3">{claim.policyHolder.address}</span>
                </div>
                <div className="flex">
                  <span className="w-1/3 font-semibold">City:</span>
                  <span className="w-2/3">{claim.policyHolder.city}</span>
                </div>
                <div className="flex">
                  <span className="w-1/3 font-semibold">Province:</span>
                  <span className="w-2/3">{claim.policyHolder.province}</span>
                </div>
                <div className="flex">
                  <span className="w-1/3 font-semibold">Postal Code:</span>
                  <span className="w-2/3">{claim.policyHolder.postalCode}</span>
                </div>
                <div className="flex">
                  <span className="w-1/3 font-semibold">Driver License Number:</span>
                  <span className="w-2/3">{claim.policyHolder.driverLicenseNumber}</span>
                </div>
                <div className="flex">
                  <span className="w-1/3 font-semibold">Vehicle VIN:</span>
                  <span className="w-2/3">{claim.policyHolder.vehicleVIN || "N/A"}</span>
                </div>
              </div>
            </section>

            <div className="text-center">
              <Button onClick={() => setMode("edit")} variant="primary">
                Edit Claim
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Claim Details Section */}
            <section className="bg-white shadow-sm rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Claim Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Claim Number" error={errors.claimNumber?.message}>
                  <input
                    {...register("claimNumber")}
                    readOnly
                    className="w-full p-2 border rounded bg-gray-100"
                  />
                </FormField>
                <FormField label="Claim Type" error={errors.claimType?.message}>
                  <select
                    {...register("claimType")}
                    className="w-full p-2 border rounded"
                  >
                    <option value="COLLISION">Collision</option>
                    <option value="THEFT">Theft</option>
                    <option value="VANDALISM">Vandalism</option>
                    <option value="DISASTER">Disaster</option>
                  </select>
                </FormField>
                <FormField label="Status" error={errors.status?.message}>
                  <select
                    {...register("status")}
                    className="w-full p-2 border rounded"
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
                </FormField>
                <FormField label="Claim Date" error={errors.claimDate?.message}>
                  <input
                    type="date"
                    {...register("claimDate")}
                    className="w-full p-2 border rounded"
                  />
                </FormField>
                <FormField label="Date of Accident" error={errors.dateOfAccident?.message}>
                  <input
                    type="date"
                    {...register("dateOfAccident")}
                    className="w-full p-2 border rounded"
                  />
                </FormField>
                <div className="md:col-span-2">
                  <FormField label="Accident Description" error={errors.accidentDescription?.message}>
                    <textarea
                      {...register("accidentDescription")}
                      className="w-full p-2 border rounded"
                      rows={3}
                    />
                  </FormField>
                </div>
                <FormField label="Police Report Number" error={errors.policeReportNumber?.message}>
                  <input
                    {...register("policeReportNumber")}
                    className="w-full p-2 border rounded"
                  />
                </FormField>
                <FormField label="Location of Accident" error={errors.locationOfAccident?.message}>
                  <input
                    {...register("locationOfAccident")}
                    className="w-full p-2 border rounded"
                  />
                </FormField>
                <div className="md:col-span-2">
                  <FormField label="Damage Description" error={errors.damageDescription?.message}>
                    <textarea
                      {...register("damageDescription")}
                      className="w-full p-2 border rounded"
                      rows={3}
                    />
                  </FormField>
                </div>
                <FormField label="Estimated Repair Cost" error={errors.estimatedRepairCost?.message}>
                  <input
                    type="number"
                    step="0.01"
                    {...register("estimatedRepairCost", { valueAsNumber: true })}
                    className="w-full p-2 border rounded"
                  />
                </FormField>
                <FormField label="Final Settlement Amount" error={errors.finalSettlementAmount?.message}>
                  <input
                    type="number"
                    step="0.01"
                    {...register("finalSettlementAmount", { valueAsNumber: true })}
                    className="w-full p-2 border rounded"
                  />
                </FormField>
              </div>
            </section>

            {/* Form Buttons */}
            <div className="flex justify-center space-x-4">
              <Button type="submit" variant="primary">
                Save
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  reset({
                    claimNumber: claim.claimNumber,
                    claimType: claim.claimType,
                    status: claim.status,
                    claimDate: claim.claimDate,
                    dateOfAccident: claim.dateOfAccident,
                    accidentDescription: claim.accidentDescription,
                    policeReportNumber: claim.policeReportNumber ?? undefined,
                    locationOfAccident: claim.locationOfAccident ?? undefined,
                    damageDescription: claim.damageDescription ?? undefined,
                    estimatedRepairCost: claim.estimatedRepairCost ?? undefined,
                    finalSettlementAmount: claim.finalSettlementAmount ?? undefined,
                  });
                  setMode("view");
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}