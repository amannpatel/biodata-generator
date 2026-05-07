import { NextRequest, NextResponse } from "next/server";
import { unlink } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate ID format (UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json({ error: "Invalid upload ID" }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "tmp", "uploads");

    // Find and delete the file with this ID prefix
    const fs = await import("fs");
    const files = fs.readdirSync(uploadDir).filter((f: string) => f.startsWith(id));

    if (files.length === 0) {
      return NextResponse.json({ error: "Upload not found" }, { status: 404 });
    }

    for (const file of files) {
      const filePath = path.join(uploadDir, file);
      if (existsSync(filePath)) {
        await unlink(filePath);
      }
    }

    return NextResponse.json({
      success: true,
      deletedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Delete upload error:", error);
    return NextResponse.json(
      { error: "Failed to delete upload" },
      { status: 500 }
    );
  }
}
