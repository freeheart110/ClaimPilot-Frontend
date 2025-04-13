"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Button from "@/components/Button";
import FormField from "@/components/FormField"

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

type ClaimType = "COLLISION" | "THEFT" | "VANDALISM" | "DISASTER";

interface Claim {
  id: number;
  claimNumber: string;
  claimType: ClaimType;
  status: ClaimStatus;
  claimDate: string;
  dateOfAccident: string;
  accidentDescription: string;
  policeReportNumber: string | null;
  locationOfAccident: string | null;
  damageDescription: string | null;
  estimatedRepairCost: number | null;
  finalSettlementAmount: number | null;
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
  policeReportNumber: z.string().nullable().optional(),
  locationOfAccident: z.string().nullable().optional(),
  damageDescription: z.string().nullable().optional(),
  estimatedRepairCost: z.number().min(0).nullable().optional(),
  finalSettlementAmount: z.number().min(0).nullable().optional(),
});

type ClaimFormData = z.infer<typeof claimSchema>;

const FieldDisplay = ({ label, value }: { label: string; value: string | number | null }) => (
  <div className="mb-4">
    <span className="block text-sm font-semibold text-gray-600">{label}</span>
    <span className="text-gray-800">{value ?? "N/A"}</span>
  </div>
);

export default function ClaimDetailsPage() {
  const { id } = useParams();
  const [claim, setClaim] = useState<Claim | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"view" | "edit">("view");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClaimFormData>({
    resolver: zodResolver(claimSchema),
  });

  useEffect(() => {
    const fetchClaim = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/claims/${id}`, {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to fetch claim");
        const data: Claim = await response.json();
        setClaim(data);
        reset({
          claimNumber: data.claimNumber,
          claimType: data.claimType,
          status: data.status,
          claimDate: data.claimDate,
          dateOfAccident: data.dateOfAccident,
          accidentDescription: data.accidentDescription,
          policeReportNumber: data.policeReportNumber ?? undefined,
          locationOfAccident: data.locationOfAccident ?? undefined,
          damageDescription: data.damageDescription ?? undefined,
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

  const onSubmit = async (data: ClaimFormData) => {
    try {
      const payload = {
        id: Number(id),
        ...data,
        policeReportNumber: data.policeReportNumber ?? null,
        locationOfAccident: data.locationOfAccident ?? null,
        damageDescription: data.damageDescription ?? null,
        estimatedRepairCost: data.estimatedRepairCost ?? null,
        finalSettlementAmount: data.finalSettlementAmount ?? null,
      };
      const response = await fetch(`http://localhost:8080/api/claims/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update claim: ${errorText}`);
      }

      const updatedClaim: Claim = await response.json();
      setClaim(updatedClaim);
      setMode("view");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  if (loading) return <p className="text-center py-20">Loading claim details...</p>;
  if (error) return <p className="text-center text-red-500 py-20">Error: {error}</p>;
  if (!claim) return <p className="text-center py-20">No claim data available.</p>;

  return (
    <main className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Claim Number: {claim.claimNumber}
        </h1>

        {mode === "view" ? (
          <div className="space-y-6">
            {/* Policyholder Details */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Policyholder Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3  gap-4">
                <FieldDisplay label="First Name" value={claim.policyHolder.firstName} />
                <FieldDisplay label="Last Name" value={claim.policyHolder.lastName} />
                <FieldDisplay label="Email" value={claim.policyHolder.email} />
                <FieldDisplay label="Phone" value={claim.policyHolder.phone} />
                <FieldDisplay label="Address" value={claim.policyHolder.address} />
                <FieldDisplay label="City" value={claim.policyHolder.city} />
                <FieldDisplay label="Province" value={claim.policyHolder.province} />
                <FieldDisplay label="Postal Code" value={claim.policyHolder.postalCode} />
                <FieldDisplay label="Driver License Number" value={claim.policyHolder.driverLicenseNumber} />
                <FieldDisplay label="Vehicle VIN" value={claim.policyHolder.vehicleVIN} />
              </div>
            </div>

            {/* Combined Claim Details */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Claim Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3  gap-4">
                <FieldDisplay label="Claim Type" value={claim.claimType} />
                <FieldDisplay label="Status" value={claim.status} />
                <FieldDisplay label="Claim Date" value={claim.claimDate} />
                <FieldDisplay label="Date of Accident" value={claim.dateOfAccident} />
                <FieldDisplay label="Location of Accident" value={claim.locationOfAccident} />
                <FieldDisplay label="Police Report Number" value={claim.policeReportNumber} />
                <FieldDisplay label="Accident Description" value={claim.accidentDescription} />
              </div>
            </div>

            {/* Damage and Costs */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Damage and Costs</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-3">
                  <FieldDisplay label="Damage Description" value={claim.damageDescription} />
                </div>
                <FieldDisplay label="Estimated Repair Cost" value={claim.estimatedRepairCost} />
                <FieldDisplay label="Final Settlement Amount" value={claim.finalSettlementAmount} />
              </div>
            </div>

            {/* Button */}
            <div className="text-center mt-6">
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
                  <select {...register("claimType")} className="w-full p-2 border rounded">
                    <option value="COLLISION">Collision</option>
                    <option value="THEFT">Theft</option>
                    <option value="VANDALISM">Vandalism</option>
                    <option value="DISASTER">Disaster</option>
                  </select>
                </FormField>
                <FormField label="Status" error={errors.status?.message}>
                  <select {...register("status")} className="w-full p-2 border rounded">
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
                    <textarea {...register("accidentDescription")} className="w-full p-2 border rounded" rows={3} />
                  </FormField>
                </div>
                <FormField label="Police Report Number" error={errors.policeReportNumber?.message}>
                  <input {...register("policeReportNumber")} className="w-full p-2 border rounded" />
                </FormField>
                <FormField label="Location of Accident" error={errors.locationOfAccident?.message}>
                  <input {...register("locationOfAccident")} className="w-full p-2 border rounded" />
                </FormField>
                <div className="md:col-span-2">
                  <FormField label="Damage Description" error={errors.damageDescription?.message}>
                    <textarea {...register("damageDescription")} className="w-full p-2 border rounded" rows={3} />
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
                  if (claim) {
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
                  }
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