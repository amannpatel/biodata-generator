"use client";

import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { FileText, Download, Eye } from "lucide-react";
import { useEffect, useState } from "react";

interface BiodataRecord {
  id: string;
  status: string;
  templateId: string;
  biodataJson: Record<string, string>;
  createdAt: string;
}

export default function HistoryPage() {
  const [biodatas, setBiodatas] = useState<BiodataRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/biodata")
      .then((res) => res.json())
      .then((data) => {
        setBiodatas(data.biodatas || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppShell breadcrumbs={[{ label: "History" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Biodata History</h1>
            <p className="text-gray-500 text-sm mt-1">
              View and manage previously created biodatas.
            </p>
          </div>
          <Button>
            <a href="/create">Create New</a>
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        ) : biodatas.length === 0 ? (
          <EmptyState
            title="No biodatas yet"
            description="Biodatas you create will appear here. Start by creating your first biodata."
            actionLabel="Create Biodata"
            actionHref="/create"
          />
        ) : (
          <div className="grid gap-4">
            {biodatas.map((biodata) => (
              <Card key={biodata.id} className="hover:shadow-sm transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-gray-100 p-2">
                        <FileText className="h-5 w-5 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {biodata.biodataJson?.fullName || "Unnamed Biodata"}
                        </p>
                        <p className="text-xs text-gray-500">
                          Created {new Date(biodata.createdAt).toLocaleDateString("en-IN")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="capitalize">
                        {biodata.templateId.replace("-", " ")}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className={
                          biodata.status === "generated"
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        }
                      >
                        {biodata.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
