import { Shield } from "lucide-react";

export function PrivacyNotice() {
  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
      <div className="flex items-start gap-3">
        <Shield className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
        <div className="text-sm text-blue-800 space-y-1">
          <p className="font-medium">Privacy Notice</p>
          <ul className="list-disc list-inside space-y-0.5 text-blue-700">
            <li>Uploaded files are processed temporarily and deleted after biodata generation.</li>
            <li>Aadhaar numbers, PAN numbers, and licence numbers are never stored or included in the final biodata.</li>
            <li>Only extracted name, address, and other non-sensitive details are used.</li>
            <li>No document content is logged or shared with third parties.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
