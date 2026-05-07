import { NextRequest, NextResponse } from "next/server";
import { getExtractionService } from "@/lib/extraction";
import { DocumentType } from "@/types/biodata";
import { existsSync } from "fs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { filePath, documentType } = body as {
      filePath: string;
      documentType: DocumentType;
    };

    if (!filePath) {
      return NextResponse.json({ error: "File path is required" }, { status: 400 });
    }

    if (!documentType) {
      return NextResponse.json({ error: "Document type is required" }, { status: 400 });
    }

    // Validate that the file exists and is within the upload directory
    const path = await import("path");
    const uploadDir = path.join(process.cwd(), "tmp", "uploads");
    const resolvedPath = path.resolve(filePath);

    if (!resolvedPath.startsWith(uploadDir)) {
      return NextResponse.json(
        { error: "Invalid file path" },
        { status: 400 }
      );
    }

    if (!existsSync(resolvedPath)) {
      return NextResponse.json(
        { error: "File not found. It may have expired." },
        { status: 404 }
      );
    }

    // Extract data from the document
    const extractionService = getExtractionService();
    const result = await extractionService.extract(resolvedPath, documentType);

    return NextResponse.json({
      success: true,
      extraction: result,
      mockMode: extractionService.isMockMode(),
    });
  } catch (error) {
    console.error("Extraction error:", error);
    return NextResponse.json(
      { error: "Failed to extract data from document. Please try again." },
      { status: 500 }
    );
  }
}
