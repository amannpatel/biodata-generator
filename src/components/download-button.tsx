"use client";

import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";

interface DownloadButtonProps {
  biodataId: string;
  disabled?: boolean;
  loading?: boolean;
  onGenerate: () => void;
}

export function DownloadButton({ biodataId, disabled, loading, onGenerate }: DownloadButtonProps) {
  return (
    <Button
      size="lg"
      onClick={onGenerate}
      disabled={disabled || loading}
      className="w-full sm:w-auto"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <Download className="h-4 w-4 mr-2" />
      )}
      {loading ? "Generating PDF..." : "Download as PDF"}
    </Button>
  );
}
