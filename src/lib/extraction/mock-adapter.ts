/**
 * Mock extraction adapter for development/testing.
 * Used when OCR API keys are not configured.
 */

import { ExtractionAdapter, OCRResult } from "./types";
import { DocumentType } from "@/types/biodata";

export class MockExtractionAdapter implements ExtractionAdapter {
  name = "mock-extraction";
  supportedDocumentTypes: DocumentType[] = [
    "aadhaar",
    "pan",
    "driving_licence",
    "word_document",
    "generic_pdf",
    "image",
  ];

  async extract(filePath: string, documentType: DocumentType): Promise<OCRResult> {
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    switch (documentType) {
      case "aadhaar":
        return this.mockAadhaarExtraction();
      case "pan":
        return this.mockPanExtraction();
      case "driving_licence":
        return this.mockDrivingLicenceExtraction();
      default:
        return this.mockGenericExtraction();
    }
  }

  private mockAadhaarExtraction(): OCRResult {
    return {
      text: "Government of India\nName: [AADHAAR REDACTED]\nDOB: 15/08/1990\nGender: Male\nAddress: 123 Main Street, Mumbai, Maharashtra 400001",
      confidence: 0.85,
      fields: {
        FirstName: { value: "Rajesh", confidence: 0.9 },
        LastName: { value: "Kumar", confidence: 0.88 },
        DateOfBirth: { value: "1990-08-15", confidence: 0.92 },
        Gender: { value: "Male", confidence: 0.95 },
        Address: {
          value: "123 Main Street, Mumbai, Maharashtra 400001",
          confidence: 0.78,
        },
      },
    };
  }

  private mockPanExtraction(): OCRResult {
    return {
      text: "INCOME TAX DEPARTMENT\nName: [PAN REDACTED]\nFather's Name: Mohan Kumar\nDOB: 15/08/1990",
      confidence: 0.82,
      fields: {
        FirstName: { value: "Rajesh", confidence: 0.88 },
        LastName: { value: "Kumar", confidence: 0.85 },
        FatherName: { value: "Mohan Kumar", confidence: 0.82 },
        DateOfBirth: { value: "1990-08-15", confidence: 0.9 },
      },
    };
  }

  private mockDrivingLicenceExtraction(): OCRResult {
    return {
      text: "Driving Licence\nName: [DL REDACTED]\nS/W/D of: Mohan Kumar\nDOB: 15-08-1990\nAddress: 123 Main Street, Mumbai MH 400001",
      confidence: 0.8,
      fields: {
        FirstName: { value: "Rajesh", confidence: 0.85 },
        LastName: { value: "Kumar", confidence: 0.83 },
        FatherName: { value: "Mohan Kumar", confidence: 0.8 },
        DateOfBirth: { value: "1990-08-15", confidence: 0.88 },
        Address: {
          value: "123 Main Street, Mumbai, Maharashtra 400001",
          confidence: 0.75,
        },
      },
    };
  }

  private mockGenericExtraction(): OCRResult {
    return {
      text: "Document content extracted.\nName: Rajesh Kumar\nContact: 9876543210",
      confidence: 0.6,
      fields: {
        FirstName: { value: "Rajesh", confidence: 0.7 },
        LastName: { value: "Kumar", confidence: 0.65 },
        Phone: { value: "9876543210", confidence: 0.75 },
      },
    };
  }
}
