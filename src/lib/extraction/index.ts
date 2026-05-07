/**
 * Extraction service: Orchestrates document processing.
 * Selects the appropriate adapter based on document type and configuration.
 */

import { DocumentType, ExtractionResult } from "@/types/biodata";
import { ExtractionAdapter } from "./types";
import { AzureDocumentIntelligenceAdapter } from "./azure-adapter";
import { MockExtractionAdapter } from "./mock-adapter";
import { GenericOCRAdapter } from "./generic-adapter";
import { BiodataFieldMapper } from "./field-mapper";
import { sanitizeExtractedText } from "@/lib/privacy";

export class ExtractionService {
  private adapters: ExtractionAdapter[];
  private fieldMapper: BiodataFieldMapper;
  private useMock: boolean;

  constructor() {
    this.fieldMapper = new BiodataFieldMapper();
    this.useMock = !process.env.AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT;

    if (this.useMock) {
      this.adapters = [new MockExtractionAdapter()];
    } else {
      this.adapters = [
        new AzureDocumentIntelligenceAdapter(),
        new GenericOCRAdapter(),
      ];
    }
  }

  async extract(filePath: string, documentType: DocumentType): Promise<ExtractionResult> {
    const adapter = this.selectAdapter(documentType);

    if (!adapter) {
      throw new Error(`No adapter available for document type: ${documentType}`);
    }

    const ocrResult = await adapter.extract(filePath, documentType);

    // Sanitize raw text to remove sensitive IDs
    ocrResult.text = sanitizeExtractedText(ocrResult.text);

    // Map OCR fields to biodata schema
    const { data, confidences } = this.fieldMapper.mapToSchema(ocrResult, documentType);

    return {
      data,
      documentType,
      extractedFrom: adapter.name,
      extractionConfidence: ocrResult.confidence,
      rawFieldConfidences: confidences,
    };
  }

  private selectAdapter(documentType: DocumentType): ExtractionAdapter | undefined {
    return this.adapters.find((adapter) =>
      adapter.supportedDocumentTypes.includes(documentType)
    );
  }

  isMockMode(): boolean {
    return this.useMock;
  }
}

// Singleton instance
let extractionService: ExtractionService | null = null;

export function getExtractionService(): ExtractionService {
  if (!extractionService) {
    extractionService = new ExtractionService();
  }
  return extractionService;
}
