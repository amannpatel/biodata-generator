"use client";

import { BiodataSchema, TemplateId } from "@/types/biodata";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BiodataPreviewProps {
  data: Partial<BiodataSchema>;
  templateId: TemplateId;
}

const templateNames: Record<TemplateId, string> = {
  "simple-classic": "Simple Classic",
  "modern-clean": "Modern Clean",
  "marriage-biodata": "Marriage Biodata",
};

function PreviewField({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex gap-2 text-sm">
      <span className="font-medium text-gray-600 min-w-[120px]">{label}:</span>
      <span className="text-gray-900">{value}</span>
    </div>
  );
}

export function BiodataPreview({ data, templateId }: BiodataPreviewProps) {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center border-b">
        <CardTitle className="text-xl">Biodata Preview</CardTitle>
        <p className="text-sm text-gray-500">Template: {templateNames[templateId]}</p>
        {data.fullName && (
          <p className="text-lg font-semibold text-gray-800 mt-1">{data.fullName}</p>
        )}
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Personal */}
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-800 border-b pb-1">Personal Information</h4>
          <PreviewField label="Full Name" value={data.fullName} />
          <PreviewField label="Date of Birth" value={data.dateOfBirth} />
          <PreviewField label="Age" value={data.age} />
          <PreviewField label="Gender" value={data.gender} />
          <PreviewField label="Height" value={data.height} />
          <PreviewField label="Marital Status" value={data.maritalStatus} />
          <PreviewField label="Religion" value={data.religion} />
          <PreviewField label="Caste" value={data.caste} />
        </div>

        {/* Family */}
        {(data.fatherName || data.motherName || data.familyDetails) && (
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-800 border-b pb-1">Family Information</h4>
            <PreviewField label="Father's Name" value={data.fatherName} />
            <PreviewField label="Mother's Name" value={data.motherName} />
            <PreviewField label="Family Details" value={data.familyDetails} />
          </div>
        )}

        {/* Contact */}
        {(data.address || data.phone || data.email) && (
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-800 border-b pb-1">Contact</h4>
            <PreviewField label="Address" value={data.address} />
            <PreviewField label="City" value={data.city} />
            <PreviewField label="State" value={data.state} />
            <PreviewField label="Pincode" value={data.pincode} />
            <PreviewField label="Phone" value={data.phone} />
            <PreviewField label="Email" value={data.email} />
          </div>
        )}

        {/* Education */}
        {(data.education || data.occupation) && (
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-800 border-b pb-1">Education & Occupation</h4>
            <PreviewField label="Education" value={data.education} />
            <PreviewField label="Occupation" value={data.occupation} />
          </div>
        )}

        {/* Other */}
        {(data.hobbies || data.additionalNotes) && (
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-800 border-b pb-1">Other</h4>
            <PreviewField label="Hobbies" value={data.hobbies} />
            <PreviewField label="Notes" value={data.additionalNotes} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
