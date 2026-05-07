/**
 * Azure AI Document Intelligence adapter.
 * Connects to Azure's prebuilt ID document model for Aadhaar, PAN, DL extraction.
 * 
 * Set these environment variables:
 * - AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT
 * - AZURE_DOCUMENT_INTELLIGENCE_KEY
 */

import { ExtractionAdapter, OCRResult } from "./types";
import { DocumentType } from "@/types/biodata";

export class AzureDocumentIntelligenceAdapter implements ExtractionAdapter {
  name = "azure-document-intelligence";
  supportedDocumentTypes: DocumentType[] = ["aadhaar", "pan", "driving_licence"];

  private endpoint: string;
  private apiKey: string;

  constructor() {
    this.endpoint = process.env.AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT || "";
    this.apiKey = process.env.AZURE_DOCUMENT_INTELLIGENCE_KEY || "";
  }

  isConfigured(): boolean {
    return !!(this.endpoint && this.apiKey);
  }

  async extract(filePath: string, documentType: DocumentType): Promise<OCRResult> {
    if (!this.isConfigured()) {
      throw new Error(
        "Azure Document Intelligence is not configured. Set AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT and AZURE_DOCUMENT_INTELLIGENCE_KEY."
      );
    }

    // TODO: Implement actual Azure API call
    // The implementation should:
    // 1. Read the file from filePath
    // 2. Send to Azure Document Intelligence prebuilt-idDocument model
    // 3. Parse the response into OCRResult format
    // 
    // Example API call pattern:
    // POST {endpoint}/documentintelligence/documentModels/prebuilt-idDocument:analyze?api-version=2024-11-30
    // Headers: Ocp-Apim-Subscription-Key: {apiKey}
    // Body: file content
    //
    // Response contains fields like:
    // - FirstName, LastName, DateOfBirth, Address, etc.

    const fs = await import("fs");
    const fileBuffer = fs.readFileSync(filePath);

    const response = await fetch(
      `${this.endpoint}/documentintelligence/documentModels/prebuilt-idDocument:analyze?api-version=2024-11-30`,
      {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": this.apiKey,
          "Content-Type": "application/octet-stream",
        },
        body: fileBuffer,
      }
    );

    if (!response.ok) {
      throw new Error(`Azure API error: ${response.status} ${response.statusText}`);
    }

    // Azure returns operation-location for async processing
    const operationLocation = response.headers.get("operation-location");
    if (!operationLocation) {
      throw new Error("No operation-location header in Azure response");
    }

    // Poll for result
    let result;
    for (let i = 0; i < 30; i++) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const pollResponse = await fetch(operationLocation, {
        headers: { "Ocp-Apim-Subscription-Key": this.apiKey },
      });
      result = await pollResponse.json();
      if (result.status === "succeeded") break;
      if (result.status === "failed") {
        throw new Error("Azure document analysis failed");
      }
    }

    if (!result || result.status !== "succeeded") {
      throw new Error("Azure document analysis timed out");
    }

    // Parse Azure response into our format
    const document = result.analyzeResult?.documents?.[0];
    const fields: Record<string, { value: string; confidence: number }> = {};

    if (document?.fields) {
      for (const [key, field] of Object.entries(document.fields) as [string, any][]) {
        if (field.valueString || field.content) {
          fields[key] = {
            value: field.valueString || field.content || "",
            confidence: field.confidence || 0,
          };
        }
      }
    }

    return {
      text: result.analyzeResult?.content || "",
      confidence: document?.confidence || 0,
      fields,
    };
  }
}
