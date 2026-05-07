import { NextRequest, NextResponse } from "next/server";
import { generateBiodataPdf, getPdfUrl } from "@/lib/pdf/generator";
import { BiodataSchema, TemplateId } from "@/types/biodata";
import { sanitizeBiodataFields } from "@/lib/privacy";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { biodataData, templateId, shopName, shopLogoUrl } = body as {
      biodataData: Partial<BiodataSchema>;
      templateId: TemplateId;
      shopName?: string;
      shopLogoUrl?: string;
    };

    if (!biodataData || !biodataData.fullName?.trim()) {
      return NextResponse.json(
        { error: "Biodata data with full name is required" },
        { status: 400 }
      );
    }

    // Final sanitization before PDF generation
    const sanitized = sanitizeBiodataFields(
      biodataData as Record<string, string | undefined>
    ) as Partial<BiodataSchema>;

    const pdfPath = await generateBiodataPdf(
      sanitized as BiodataSchema,
      templateId || "simple-classic",
      { shopName, shopLogoUrl }
    );

    const pdfUrl = getPdfUrl(pdfPath);

    return NextResponse.json({
      success: true,
      pdfUrl,
      biodataId: id,
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF. Please try again." },
      { status: 500 }
    );
  }
}
