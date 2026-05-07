"use client";

import { Progress } from "@/components/ui/progress";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

type ProcessingState = "uploading" | "processing" | "extracting" | "completed" | "error";

interface ProcessingStatusProps {
  state: ProcessingState;
  progress?: number;
  errorMessage?: string;
}

const stateLabels: Record<ProcessingState, string> = {
  uploading: "Uploading document...",
  processing: "Processing document...",
  extracting: "Extracting information...",
  completed: "Extraction complete!",
  error: "Processing failed",
};

export function ProcessingStatus({ state, progress, errorMessage }: ProcessingStatusProps) {
  return (
    <div className="rounded-lg border bg-white p-6 space-y-4">
      <div className="flex items-center gap-3">
        {state === "error" ? (
          <AlertCircle className="h-5 w-5 text-red-500" />
        ) : state === "completed" ? (
          <CheckCircle className="h-5 w-5 text-green-500" />
        ) : (
          <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
        )}
        <span
          className={`font-medium ${
            state === "error"
              ? "text-red-700"
              : state === "completed"
              ? "text-green-700"
              : "text-gray-700"
          }`}
        >
          {stateLabels[state]}
        </span>
      </div>

      {state !== "completed" && state !== "error" && (
        <Progress value={progress || 0} className="h-2" />
      )}

      {state === "error" && errorMessage && (
        <p className="text-sm text-red-600">{errorMessage}</p>
      )}

      {state !== "error" && state !== "completed" && (
        <p className="text-xs text-gray-500">
          This may take a few seconds depending on the document.
        </p>
      )}
    </div>
  );
}
