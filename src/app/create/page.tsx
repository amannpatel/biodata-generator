"use client";

import { useState, useCallback } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UploadDropzone } from "@/components/upload-dropzone";
import { ConsentCheckbox } from "@/components/consent-checkbox";
import { PrivacyNotice } from "@/components/privacy-notice";
import { ProcessingStatus } from "@/components/processing-status";
import { ExtractedFieldReview } from "@/components/extracted-field-review";
import { BiodataForm } from "@/components/biodata-form";
import { TemplateSelector } from "@/components/template-selector";
import { BiodataPreview } from "@/components/biodata-preview";
import { DownloadButton } from "@/components/download-button";
import { BiodataSchema, DocumentType, TemplateId, ExtractionResult } from "@/types/biodata";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

type Step = "upload" | "processing" | "review" | "form" | "template" | "preview";

const steps: { id: Step; label: string; number: number }[] = [
  { id: "upload", label: "Upload", number: 1 },
  { id: "review", label: "Review", number: 2 },
  { id: "form", label: "Edit", number: 3 },
  { id: "template", label: "Template", number: 4 },
  { id: "preview", label: "Preview", number: 5 },
];

export default function CreateBiodataPage() {
  const [currentStep, setCurrentStep] = useState<Step>("upload");
  const [consent, setConsent] = useState(false);
  const [documentType, setDocumentType] = useState<DocumentType>("aadhaar");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processingState, setProcessingState] = useState<"uploading" | "processing" | "extracting" | "completed" | "error">("uploading");
  const [processingProgress, setProcessingProgress] = useState(0);
  const [extractionResult, setExtractionResult] = useState<ExtractionResult | null>(null);
  const [biodataData, setBiodataData] = useState<Partial<BiodataSchema>>({});
  const [confidences, setConfidences] = useState<Record<string, number>>({});
  const [templateId, setTemplateId] = useState<TemplateId>("simple-classic");
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [biodataId, setBiodataId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleFileAccepted = useCallback((file: File) => {
    setSelectedFile(file);
  }, []);

  const handleUploadAndExtract = async () => {
    if (!selectedFile || !consent) return;

    setCurrentStep("processing");
    setProcessingState("uploading");
    setProcessingProgress(20);

    try {
      // Step 1: Upload the file
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("documentType", documentType);
      formData.append("consent", "true");

      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        throw new Error(uploadData.error || "Upload failed");
      }

      setProcessingState("processing");
      setProcessingProgress(50);

      // Step 2: Extract data
      setProcessingState("extracting");
      setProcessingProgress(70);

      const extractRes = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filePath: uploadData.filePath,
          documentType,
        }),
      });
      const extractData = await extractRes.json();

      if (!extractRes.ok) {
        throw new Error(extractData.error || "Extraction failed");
      }

      setProcessingProgress(100);
      setProcessingState("completed");
      setExtractionResult(extractData.extraction);
      setBiodataData(extractData.extraction.data);
      setConfidences(extractData.extraction.rawFieldConfidences);

      // Clean up uploaded file
      if (uploadData.uploadId) {
        fetch(`/api/uploads/${uploadData.uploadId}`, { method: "DELETE" }).catch(() => {});
      }

      // Move to review step after a brief pause
      setTimeout(() => setCurrentStep("review"), 1000);
    } catch (error) {
      setProcessingState("error");
      setErrorMessage(error instanceof Error ? error.message : "An error occurred");
    }
  };

  const handleFieldChange = (field: keyof BiodataSchema, value: string) => {
    setBiodataData((prev) => ({ ...prev, [field]: value }));
  };

  const handleConfirmExtraction = () => {
    setCurrentStep("form");
  };

  const handleFormSubmit = () => {
    setCurrentStep("template");
  };

  const handleTemplateSelect = (template: TemplateId) => {
    setTemplateId(template);
  };

  const handleGoToPreview = () => {
    setCurrentStep("preview");
  };

  const handleGeneratePdf = async () => {
    setPdfGenerating(true);
    try {
      // Save biodata first
      const saveRes = await fetch("/api/biodata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          biodataData,
          templateId,
          status: "confirmed",
        }),
      });
      const saveData = await saveRes.json();

      if (!saveRes.ok) throw new Error(saveData.error);

      const id = saveData.biodata.id;
      setBiodataId(id);

      // Generate PDF
      const pdfRes = await fetch(`/api/biodata/${id}/generate-pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          biodataData,
          templateId,
        }),
      });
      const pdfData = await pdfRes.json();

      if (!pdfRes.ok) throw new Error(pdfData.error);

      setPdfUrl(pdfData.pdfUrl);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "PDF generation failed");
    } finally {
      setPdfGenerating(false);
    }
  };

  const getCurrentStepNumber = () => {
    const step = steps.find((s) => s.id === currentStep);
    return step?.number || 1;
  };

  return (
    <AppShell
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Create Biodata" },
      ]}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Step Indicator */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Create Biodata</h1>
          {currentStep !== "processing" && (
            <Badge variant="secondary" className="text-sm">
              Step {getCurrentStepNumber()} of 5
            </Badge>
          )}
        </div>

        {/* Progress Steps */}
        {currentStep !== "processing" && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
                  currentStep === step.id
                    ? "bg-blue-100 text-blue-700"
                    : getCurrentStepNumber() > step.number
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {getCurrentStepNumber() > step.number ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <span>{step.number}</span>
                )}
                {step.label}
              </div>
            ))}
          </div>
        )}

        {/* Step Content */}
        {currentStep === "upload" && (
          <Card>
            <CardHeader>
              <CardTitle>Upload Document</CardTitle>
              <p className="text-sm text-gray-500">
                Upload an identity document to extract biodata information automatically.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <PrivacyNotice />

              <div className="space-y-2">
                <label className="text-sm font-medium">Document Type</label>
                <Select value={documentType} onValueChange={(val: string | null) => setDocumentType((val || "aadhaar") as DocumentType)}>
                  <SelectTrigger className="w-full sm:w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aadhaar">Aadhaar Card</SelectItem>
                    <SelectItem value="pan">PAN Card</SelectItem>
                    <SelectItem value="driving_licence">Driving Licence</SelectItem>
                    <SelectItem value="word_document">Word Document</SelectItem>
                    <SelectItem value="generic_pdf">Generic PDF</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <UploadDropzone onFileAccepted={handleFileAccepted} disabled={!consent} />

              <ConsentCheckbox checked={consent} onCheckedChange={setConsent} />

              <Button
                onClick={handleUploadAndExtract}
                disabled={!selectedFile || !consent}
                size="lg"
                className="w-full"
              >
                Upload & Extract Data
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}

        {currentStep === "processing" && (
          <ProcessingStatus
            state={processingState}
            progress={processingProgress}
            errorMessage={errorMessage}
          />
        )}

        {currentStep === "review" && (
          <Card>
            <CardHeader>
              <CardTitle>Review Extracted Data</CardTitle>
              <p className="text-sm text-gray-500">
                Verify the data extracted from the document. Correct any errors before proceeding.
              </p>
              {extractionResult?.extractedFrom === "mock-extraction" && (
                <Badge variant="secondary" className="w-fit bg-yellow-100 text-yellow-800">
                  Demo Mode — Using sample data
                </Badge>
              )}
            </CardHeader>
            <CardContent>
              <ExtractedFieldReview
                data={biodataData}
                confidences={confidences}
                onChange={handleFieldChange}
                onConfirm={handleConfirmExtraction}
              />
            </CardContent>
          </Card>
        )}

        {currentStep === "form" && (
          <Card>
            <CardHeader>
              <CardTitle>Complete Biodata Details</CardTitle>
              <p className="text-sm text-gray-500">
                Fill in any missing fields or make corrections. Only Full Name is required.
              </p>
            </CardHeader>
            <CardContent>
              <BiodataForm
                data={biodataData}
                onChange={handleFieldChange}
                onSubmit={handleFormSubmit}
                submitLabel="Continue to Template Selection"
              />
            </CardContent>
          </Card>
        )}

        {currentStep === "template" && (
          <Card>
            <CardHeader>
              <CardTitle>Select Template</CardTitle>
              <p className="text-sm text-gray-500">
                Choose a template for the final biodata PDF.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <TemplateSelector selected={templateId} onSelect={handleTemplateSelect} />
              <Button onClick={handleGoToPreview} size="lg" className="w-full">
                Preview Biodata
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}

        {currentStep === "preview" && (
          <div className="space-y-6">
            <BiodataPreview data={biodataData} templateId={templateId} />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white rounded-lg border">
              <Button
                variant="outline"
                onClick={() => setCurrentStep("form")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Edit
              </Button>
              <DownloadButton
                biodataId={biodataId || "new"}
                loading={pdfGenerating}
                onGenerate={handleGeneratePdf}
              />
            </div>

            {pdfUrl && (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4 text-center">
                  <p className="font-medium text-green-800">PDF Generated Successfully!</p>
                  <a
                    href={pdfUrl}
                    download
                    className="text-sm text-blue-600 hover:underline mt-1 inline-block"
                  >
                    Click here to download if it doesn&apos;t start automatically
                  </a>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Navigation Buttons for non-first steps */}
        {currentStep !== "upload" && currentStep !== "processing" && currentStep !== "preview" && (
          <div className="flex justify-start">
            <Button
              variant="ghost"
              onClick={() => {
                const currentIndex = steps.findIndex((s) => s.id === currentStep);
                if (currentIndex > 0) {
                  setCurrentStep(steps[currentIndex - 1].id);
                }
              }}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
