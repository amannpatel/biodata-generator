import { NextRequest, NextResponse } from "next/server";

// In-memory store reference (shared with parent route in production via DB)
const biodataStore = new Map<string, any>();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const biodata = biodataStore.get(id);
  if (!biodata) {
    return NextResponse.json({ error: "Biodata not found" }, { status: 404 });
  }

  return NextResponse.json({ biodata });
}
