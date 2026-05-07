export interface BiodataSchema {
  fullName: string;
  dateOfBirth?: string;
  age?: string;
  gender?: string;
  fatherName?: string;
  motherName?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  phone?: string;
  email?: string;
  occupation?: string;
  education?: string;
  height?: string;
  maritalStatus?: string;
  religion?: string;
  caste?: string;
  familyDetails?: string;
  hobbies?: string;
  additionalNotes?: string;
  photoUrl?: string;
}

export interface ExtractionResult {
  data: Partial<BiodataSchema>;
  documentType: DocumentType;
  extractedFrom: string;
  extractionConfidence: number;
  rawFieldConfidences: Record<string, number>;
}

export type DocumentType =
  | "aadhaar"
  | "pan"
  | "driving_licence"
  | "word_document"
  | "generic_pdf"
  | "image"
  | "unknown";

export type BiodataStatus = "draft" | "review" | "confirmed" | "generated";

export type TemplateId = "simple-classic" | "modern-clean" | "marriage-biodata";

export interface BiodataRecord {
  id: string;
  shopId: string;
  createdById: string;
  status: BiodataStatus;
  templateId: TemplateId;
  biodataJson: BiodataSchema;
  generatedPdfUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UploadSessionRecord {
  id: string;
  shopId: string;
  uploadedById: string;
  documentType: DocumentType;
  temporaryFilePath: string;
  status: "pending" | "processing" | "completed" | "failed" | "expired";
  expiresAt: string;
  deletedAt?: string;
}
