"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BiodataSchema } from "@/types/biodata";
import { AlertTriangle, Check } from "lucide-react";

interface ExtractedFieldReviewProps {
  data: Partial<BiodataSchema>;
  confidences: Record<string, number>;
  onChange: (field: keyof BiodataSchema, value: string) => void;
  onConfirm: () => void;
}

const fieldLabels: Record<keyof BiodataSchema, string> = {
  fullName: "Full Name",
  dateOfBirth: "Date of Birth",
  age: "Age",
  gender: "Gender",
  fatherName: "Father's Name",
  motherName: "Mother's Name",
  address: "Address",
  city: "City",
  state: "State",
  pincode: "Pincode",
  phone: "Phone",
  email: "Email",
  occupation: "Occupation",
  education: "Education",
  height: "Height",
  maritalStatus: "Marital Status",
  religion: "Religion",
  caste: "Caste",
  familyDetails: "Family Details",
  hobbies: "Hobbies",
  additionalNotes: "Additional Notes",
  photoUrl: "Photo",
};

function ConfidenceBadge({ confidence }: { confidence: number }) {
  if (confidence >= 0.8) {
    return (
      <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
        High confidence
      </Badge>
    );
  }
  if (confidence >= 0.6) {
    return (
      <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 text-xs">
        Medium — please verify
      </Badge>
    );
  }
  return (
    <Badge variant="secondary" className="bg-red-100 text-red-700 text-xs flex items-center gap-1">
      <AlertTriangle className="h-3 w-3" />
      Low — needs verification
    </Badge>
  );
}

export function ExtractedFieldReview({
  data,
  confidences,
  onChange,
  onConfirm,
}: ExtractedFieldReviewProps) {
  const extractedFields = Object.entries(data).filter(
    ([, value]) => value !== undefined && value !== ""
  );

  if (extractedFields.length === 0) {
    return (
      <div className="rounded-lg border bg-yellow-50 p-6 text-center">
        <AlertTriangle className="mx-auto h-8 w-8 text-yellow-500 mb-2" />
        <p className="font-medium text-yellow-800">No data could be extracted</p>
        <p className="text-sm text-yellow-600 mt-1">
          Please fill in the biodata details manually in the next step.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-blue-50 p-4">
        <p className="text-sm text-blue-800">
          <strong>Review extracted data:</strong> Please verify each field below. Fields with
          low confidence are highlighted — correct them if needed before proceeding.
        </p>
      </div>

      <div className="space-y-4">
        {extractedFields.map(([field, value]) => (
          <div key={field} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor={field} className="text-sm font-medium">
                {fieldLabels[field as keyof BiodataSchema] || field}
              </Label>
              {confidences[field] !== undefined && (
                <ConfidenceBadge confidence={confidences[field]} />
              )}
            </div>
            <Input
              id={field}
              value={value || ""}
              onChange={(e) => onChange(field as keyof BiodataSchema, e.target.value)}
              className={
                confidences[field] !== undefined && confidences[field] < 0.6
                  ? "border-red-300 bg-red-50"
                  : ""
              }
            />
          </div>
        ))}
      </div>

      <Button onClick={onConfirm} className="w-full" size="lg">
        <Check className="h-4 w-4 mr-2" />
        Confirm Extracted Data
      </Button>
    </div>
  );
}
