/**
 * Generic OCR fallback adapter.
 * Used for unsupported document types or when Azure is not available.
 * This is a placeholder that should be connected to any generic OCR service.
 */

import { ExtractionAdapter, OCRResult } from "./types";
import { DocumentType } from "@/types/biodata";

export class GenericOCRAdapter implements ExtractionAdapter {
  name = "generic-ocr";
  supportedDocumentTypes: DocumentType[] = [
    "word_document",
    "generic_pdf",
    "image",
    "unknown",
  ];

  async extract(filePath: string, documentType: DocumentType): Promise<OCRResult> {
    // TODO: Connect to a generic OCR service
    // Options include:
    // - Tesseract.js (local, free)
    // - Google Cloud Vision
    // - AWS Textract
    // - Azure Computer Vision (Read API)
    //
    // For Word documents (.docx), use a library like mammoth.js to extract text directly.
    // For PDFs, use pdf-parse or similar.

    const extension = filePath.split(".").pop()?.toLowerCase();

    if (extension === "docx" || extension === "doc") {
      return this.extractFromWord(filePath);
    }

    if (extension === "pdf") {
      return this.extractFromPdf(filePath);
    }

    // For images, would use OCR service
    return {
      text: "",
      confidence: 0,
      fields: {},
    };
  }

  private async extractFromWord(filePath: string): Promise<OCRResult> {
    // TODO: Use mammoth.js to extract text from Word documents
    // import mammoth from 'mammoth';
    // const result = await mammoth.extractRawText({ path: filePath });
    // return { text: result.value, confidence: 0.9, fields: {} };
    
    return {
      text: "",
      confidence: 0,
      fields: {},
    };
  }

  private async extractFromPdf(filePath: string): Promise<OCRResult> {
    // TODO: Use pdf-parse to extract text from PDFs
    // import pdf from 'pdf-parse';
    // const dataBuffer = fs.readFileSync(filePath);
    // const data = await pdf(dataBuffer);
    // return { text: data.text, confidence: 0.8, fields: {} };

    return {
      text: "",
      confidence: 0,
      fields: {},
    };
  }
}
