/**
 * PDF Generation Service
 * Generates A4 biodata PDFs from HTML templates using Puppeteer.
 */

import puppeteer from "puppeteer";
import { BiodataSchema, TemplateId } from "@/types/biodata";
import { getTemplateHtml } from "./templates";
import path from "path";
import fs from "fs";

const PDF_OUTPUT_DIR = path.join(process.cwd(), "tmp", "pdfs");

export async function generateBiodataPdf(
  biodataData: BiodataSchema,
  templateId: TemplateId,
  options?: {
    shopName?: string;
    shopLogoUrl?: string;
  }
): Promise<string> {
  // Ensure output directory exists
  if (!fs.existsSync(PDF_OUTPUT_DIR)) {
    fs.mkdirSync(PDF_OUTPUT_DIR, { recursive: true });
  }

  const html = getTemplateHtml(biodataData, templateId, options);
  const outputFileName = `biodata-${Date.now()}.pdf`;
  const outputPath = path.join(PDF_OUTPUT_DIR, outputFileName);

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    await page.pdf({
      path: outputPath,
      format: "A4",
      printBackground: true,
      margin: {
        top: "15mm",
        right: "15mm",
        bottom: "15mm",
        left: "15mm",
      },
    });

    return outputPath;
  } finally {
    await browser.close();
  }
}

/**
 * Returns the relative URL path for a generated PDF.
 */
export function getPdfUrl(pdfPath: string): string {
  const fileName = path.basename(pdfPath);
  return `/api/pdf/${fileName}`;
}
