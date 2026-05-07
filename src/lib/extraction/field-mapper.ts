/**
 * Field mapper: Maps OCR results to biodata schema fields.
 * Handles different document types and field naming conventions.
 */

import { BiodataSchema, DocumentType } from "@/types/biodata";
import { OCRResult, FieldMapper } from "./types";
import { sanitizeExtractedText } from "@/lib/privacy";

export class BiodataFieldMapper implements FieldMapper {
  mapToSchema(
    ocrResult: OCRResult,
    documentType: DocumentType
  ): {
    data: Partial<BiodataSchema>;
    confidences: Record<string, number>;
  } {
    const data: Partial<BiodataSchema> = {};
    const confidences: Record<string, number> = {};
    const fields = ocrResult.fields || {};

    // Map common fields from OCR results
    if (fields.FirstName || fields.LastName) {
      const firstName = fields.FirstName?.value || "";
      const lastName = fields.LastName?.value || "";
      data.fullName = sanitizeExtractedText(`${firstName} ${lastName}`.trim());
      confidences.fullName = Math.min(
        fields.FirstName?.confidence || 0,
        fields.LastName?.confidence || 0
      );
    }

    if (fields.DateOfBirth) {
      data.dateOfBirth = fields.DateOfBirth.value;
      confidences.dateOfBirth = fields.DateOfBirth.confidence;
      // Calculate age from DOB
      const dob = new Date(fields.DateOfBirth.value);
      if (!isNaN(dob.getTime())) {
        const age = Math.floor(
          (Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
        );
        data.age = age.toString();
        confidences.age = fields.DateOfBirth.confidence;
      }
    }

    if (fields.Gender) {
      data.gender = fields.Gender.value;
      confidences.gender = fields.Gender.confidence;
    }

    if (fields.FatherName) {
      data.fatherName = sanitizeExtractedText(fields.FatherName.value);
      confidences.fatherName = fields.FatherName.confidence;
    }

    if (fields.Address) {
      const address = sanitizeExtractedText(fields.Address.value);
      data.address = address;
      confidences.address = fields.Address.confidence;

      // Try to extract city, state, pincode from address
      const pincodeMatch = address.match(/\b\d{6}\b/);
      if (pincodeMatch) {
        data.pincode = pincodeMatch[0];
        confidences.pincode = fields.Address.confidence * 0.8;
      }

      // Common Indian states
      const states = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
        "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh",
        "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
        "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha",
        "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
        "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
        "Delhi", "Jammu and Kashmir", "Ladakh",
      ];

      for (const state of states) {
        if (address.toLowerCase().includes(state.toLowerCase())) {
          data.state = state;
          confidences.state = fields.Address.confidence * 0.7;
          break;
        }
      }
    }

    if (fields.Phone) {
      data.phone = fields.Phone.value;
      confidences.phone = fields.Phone.confidence;
    }

    // Try to extract phone from raw text if not in fields
    if (!data.phone && ocrResult.text) {
      const phoneMatch = ocrResult.text.match(/\b[6-9]\d{9}\b/);
      if (phoneMatch) {
        data.phone = phoneMatch[0];
        confidences.phone = 0.6;
      }
    }

    return { data, confidences };
  }
}
