"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TemplateId } from "@/types/biodata";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface TemplateSelectorProps {
  selected: TemplateId;
  onSelect: (template: TemplateId) => void;
}

const templates: {
  id: TemplateId;
  name: string;
  description: string;
  preview: string;
}[] = [
  {
    id: "simple-classic",
    name: "Simple Classic",
    description: "Clean and straightforward layout with clear sections. Best for general use.",
    preview: "📄",
  },
  {
    id: "modern-clean",
    name: "Modern Clean",
    description: "Contemporary design with blue accents and two-column layout.",
    preview: "🎨",
  },
  {
    id: "marriage-biodata",
    name: "Marriage Biodata",
    description: "Traditional marriage biodata style with decorative elements and warm colors.",
    preview: "💍",
  },
];

export function TemplateSelector({ selected, onSelect }: TemplateSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {templates.map((template) => (
        <Card
          key={template.id}
          className={cn(
            "cursor-pointer transition-all hover:shadow-md relative",
            selected === template.id
              ? "ring-2 ring-blue-500 border-blue-500"
              : "hover:border-gray-400"
          )}
          onClick={() => onSelect(template.id)}
        >
          {selected === template.id && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-blue-500">
                <Check className="h-3 w-3 mr-1" />
                Selected
              </Badge>
            </div>
          )}
          <CardContent className="p-6">
            <div className="text-4xl mb-3">{template.preview}</div>
            <h4 className="font-semibold text-gray-900">{template.name}</h4>
            <p className="text-sm text-gray-500 mt-1">{template.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
