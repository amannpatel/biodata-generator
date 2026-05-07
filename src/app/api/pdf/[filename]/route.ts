import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  // Validate filename format (only allow alphanumeric, hyphens, dots)
  if (!/^[a-zA-Z0-9\-]+\.pdf$/.test(filename)) {
    return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
  }

  const pdfDir = path.join(process.cwd(), "tmp", "pdfs");
  const filePath = path.join(pdfDir, filename);

  // Ensure path doesn't escape the pdf directory
  const resolvedPath = path.resolve(filePath);
  if (!resolvedPath.startsWith(path.resolve(pdfDir))) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  if (!existsSync(resolvedPath)) {
    return NextResponse.json({ error: "PDF not found" }, { status: 404 });
  }

  const fileBuffer = await readFile(resolvedPath);

  return new NextResponse(fileBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
