import { NextRequest, NextResponse } from "next/server";
import { BiodataSchema } from "@/types/biodata";
import { sanitizeBiodataFields } from "@/lib/privacy";

// In-memory store for MVP (replace with Prisma in production)
const biodataStore = new Map<string, any>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { biodataData, templateId, status } = body as {
      biodataData: Partial<BiodataSchema>;
      templateId: string;
      status?: string;
    };

    if (!biodataData || !biodataData.fullName?.trim()) {
      return NextResponse.json(
        { error: "Full name is required" },
        { status: 400 }
      );
    }

    // Sanitize all fields to remove any leaked sensitive data
    const sanitized = sanitizeBiodataFields(
      biodataData as Record<string, string | undefined>
    );

    const id = crypto.randomUUID();
    const record = {
      id,
      status: status || "confirmed",
      templateId: templateId || "simple-classic",
      biodataJson: sanitized,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    biodataStore.set(id, record);

    return NextResponse.json({ success: true, biodata: record });
  } catch (error) {
    console.error("Biodata save error:", error);
    return NextResponse.json(
      { error: "Failed to save biodata" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const all = Array.from(biodataStore.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return NextResponse.json({ biodatas: all });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch biodatas" },
      { status: 500 }
    );
  }
}
