import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const UPLOAD_DIR = path.join(process.cwd(), "tmp", "uploads");

// Maximum file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const documentType = formData.get("documentType") as string | null;
    const consent = formData.get("consent") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (consent !== "true") {
      return NextResponse.json(
        { error: "Customer consent is required before upload" },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Unsupported file type. Please upload PDF, image, or Word document." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10MB." },
        { status: 400 }
      );
    }

    // Create upload directory if it doesn't exist
    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true });
    }

    // Generate unique filename to prevent path traversal
    const fileExtension = path.extname(file.name).toLowerCase();
    const safeExtensions = [".pdf", ".jpg", ".jpeg", ".png", ".docx", ".doc"];
    if (!safeExtensions.includes(fileExtension)) {
      return NextResponse.json(
        { error: "Invalid file extension" },
        { status: 400 }
      );
    }

    const uniqueId = uuidv4();
    const safeFileName = `${uniqueId}${fileExtension}`;
    const filePath = path.join(UPLOAD_DIR, safeFileName);

    // Write file to disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Set expiry (1 hour from now)
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    return NextResponse.json({
      uploadId: uniqueId,
      fileName: safeFileName,
      filePath: filePath,
      documentType: documentType || "unknown",
      expiresAt: expiresAt.toISOString(),
      status: "uploaded",
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file. Please try again." },
      { status: 500 }
    );
  }
}
