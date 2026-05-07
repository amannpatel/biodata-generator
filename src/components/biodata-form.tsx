"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { BiodataSchema } from "@/types/biodata";
import { Save } from "lucide-react";

interface BiodataFormProps {
  data: Partial<BiodataSchema>;
  onChange: (field: keyof BiodataSchema, value: string) => void;
  onSubmit: () => void;
  submitLabel?: string;
}

export function BiodataForm({ data, onChange, onSubmit, submitLabel = "Save & Continue" }: BiodataFormProps) {
  return (
    <div className="space-y-8">
      {/* Personal Information */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="fullName">
              Full Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="fullName"
              value={data.fullName || ""}
              onChange={(e) => onChange("fullName", e.target.value)}
              placeholder="Enter full name"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input
              id="dateOfBirth"
              value={data.dateOfBirth || ""}
              onChange={(e) => onChange("dateOfBirth", e.target.value)}
              placeholder="DD/MM/YYYY"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              value={data.age || ""}
              onChange={(e) => onChange("age", e.target.value)}
              placeholder="Age"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="gender">Gender</Label>
            <Select value={data.gender || ""} onValueChange={(val: string | null) => onChange("gender", val || "")}>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="height">Height</Label>
            <Input
              id="height"
              value={data.height || ""}
              onChange={(e) => onChange("height", e.target.value)}
              placeholder="e.g., 5'8&quot;"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="maritalStatus">Marital Status</Label>
            <Select value={data.maritalStatus || ""} onValueChange={(val: string | null) => onChange("maritalStatus", val || "")}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Single">Single</SelectItem>
                <SelectItem value="Married">Married</SelectItem>
                <SelectItem value="Divorced">Divorced</SelectItem>
                <SelectItem value="Widowed">Widowed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="religion">Religion</Label>
            <Input
              id="religion"
              value={data.religion || ""}
              onChange={(e) => onChange("religion", e.target.value)}
              placeholder="Religion"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="caste">Caste</Label>
            <Input
              id="caste"
              value={data.caste || ""}
              onChange={(e) => onChange("caste", e.target.value)}
              placeholder="Caste"
            />
          </div>
        </div>
      </section>

      {/* Family Information */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Family Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="fatherName">Father&apos;s Name</Label>
            <Input
              id="fatherName"
              value={data.fatherName || ""}
              onChange={(e) => onChange("fatherName", e.target.value)}
              placeholder="Father's name"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="motherName">Mother&apos;s Name</Label>
            <Input
              id="motherName"
              value={data.motherName || ""}
              onChange={(e) => onChange("motherName", e.target.value)}
              placeholder="Mother's name"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="familyDetails">Family Details</Label>
          <Textarea
            id="familyDetails"
            value={data.familyDetails || ""}
            onChange={(e) => onChange("familyDetails", e.target.value)}
            placeholder="Brothers, sisters, family occupation, etc."
            rows={3}
          />
        </div>
      </section>

      {/* Contact Information */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Contact Information</h3>
        <div className="space-y-1.5">
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            value={data.address || ""}
            onChange={(e) => onChange("address", e.target.value)}
            placeholder="Full address"
            rows={2}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={data.city || ""}
              onChange={(e) => onChange("city", e.target.value)}
              placeholder="City"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              value={data.state || ""}
              onChange={(e) => onChange("state", e.target.value)}
              placeholder="State"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pincode">Pincode</Label>
            <Input
              id="pincode"
              value={data.pincode || ""}
              onChange={(e) => onChange("pincode", e.target.value)}
              placeholder="6-digit pincode"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={data.phone || ""}
              onChange={(e) => onChange("phone", e.target.value)}
              placeholder="10-digit mobile number"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={data.email || ""}
              onChange={(e) => onChange("email", e.target.value)}
              placeholder="Email address"
            />
          </div>
        </div>
      </section>

      {/* Education & Occupation */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Education & Occupation</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="education">Education</Label>
            <Input
              id="education"
              value={data.education || ""}
              onChange={(e) => onChange("education", e.target.value)}
              placeholder="Highest qualification"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="occupation">Occupation</Label>
            <Input
              id="occupation"
              value={data.occupation || ""}
              onChange={(e) => onChange("occupation", e.target.value)}
              placeholder="Current occupation"
            />
          </div>
        </div>
      </section>

      {/* Other */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Other Information</h3>
        <div className="space-y-1.5">
          <Label htmlFor="hobbies">Hobbies</Label>
          <Input
            id="hobbies"
            value={data.hobbies || ""}
            onChange={(e) => onChange("hobbies", e.target.value)}
            placeholder="Hobbies and interests"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="additionalNotes">Additional Notes</Label>
          <Textarea
            id="additionalNotes"
            value={data.additionalNotes || ""}
            onChange={(e) => onChange("additionalNotes", e.target.value)}
            placeholder="Any additional information"
            rows={3}
          />
        </div>
      </section>

      <Button onClick={onSubmit} className="w-full" size="lg" disabled={!data.fullName?.trim()}>
        <Save className="h-4 w-4 mr-2" />
        {submitLabel}
      </Button>
    </div>
  );
}
