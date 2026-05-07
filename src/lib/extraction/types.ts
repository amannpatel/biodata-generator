import { BiodataSchema, DocumentType } from "@/types/biodata";

export interface OCRResult {
  text: string;
  confidence: number;
  fields?: Record<string, { value: string; confidence: number }>;
}

export interface ExtractionAdapter {
  name: string;
  supportedDocumentTypes: DocumentType[];
  extract(filePath: string, documentType: DocumentType): Promise<OCRResult>;
}

export interface FieldMapper {
  mapToSchema(
    ocrResult: OCRResult,
    documentType: DocumentType
  ): {
    data: Partial<BiodataSchema>;
    confidences: Record<string, number>;
  };
}
