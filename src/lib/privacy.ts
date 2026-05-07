/**
 * Privacy and sanitization utilities.
 * Ensures sensitive data like Aadhaar numbers, PAN numbers, and licence numbers
 * are never stored, logged, or displayed in full.
 */

// Regex patterns for Indian ID documents
const AADHAAR_PATTERN = /\b\d{4}\s?\d{4}\s?\d{4}\b/g;
const PAN_PATTERN = /\b[A-Z]{5}\d{4}[A-Z]\b/g;
const DL_PATTERN = /\b[A-Z]{2}\d{2}\s?\d{4}\s?\d{7}\b/g;

/**
 * Masks an Aadhaar number, keeping only last 4 digits.
 * Input: "1234 5678 9012" → "XXXX XXXX 9012"
 */
export function maskAadhaar(aadhaar: string): string {
  const digits = aadhaar.replace(/\s/g, "");
  if (digits.length !== 12) return "XXXX XXXX XXXX";
  return `XXXX XXXX ${digits.slice(-4)}`;
}

/**
 * Masks a PAN number completely.
 */
export function maskPan(pan: string): string {
  return "XXXXXXXXXX";
}

/**
 * Masks a driving licence number.
 */
export function maskDrivingLicence(dl: string): string {
  return "XX** **** *******";
}

/**
 * Removes all sensitive ID numbers from text.
 * Used before storing or displaying extracted text.
 */
export function sanitizeExtractedText(text: string): string {
  let sanitized = text;
  sanitized = sanitized.replace(AADHAAR_PATTERN, "[AADHAAR REDACTED]");
  sanitized = sanitized.replace(PAN_PATTERN, "[PAN REDACTED]");
  sanitized = sanitized.replace(DL_PATTERN, "[DL REDACTED]");
  return sanitized;
}

/**
 * Checks if text contains an Aadhaar number.
 */
export function containsAadhaar(text: string): boolean {
  return AADHAAR_PATTERN.test(text);
}

/**
 * Checks if text contains a PAN number.
 */
export function containsPan(text: string): boolean {
  return PAN_PATTERN.test(text);
}

/**
 * Sanitizes biodata fields to ensure no ID numbers leak into the final document.
 */
export function sanitizeBiodataFields(
  data: Record<string, string | undefined>
): Record<string, string | undefined> {
  const sanitized: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value) {
      sanitized[key] = sanitizeExtractedText(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

/**
 * Creates a safe audit log entry without sensitive data.
 */
export function createAuditMetadata(params: {
  documentType: string;
  fileName: string;
  action: string;
}): Record<string, string> {
  return {
    documentType: params.documentType,
    // Only log file extension, not the full name
    fileExtension: params.fileName.split(".").pop() || "unknown",
    action: params.action,
    timestamp: new Date().toISOString(),
  };
}
