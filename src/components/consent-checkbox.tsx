"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface ConsentCheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function ConsentCheckbox({ checked, onCheckedChange }: ConsentCheckboxProps) {
  return (
    <div className="flex items-start space-x-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
      <Checkbox
        id="consent"
        checked={checked}
        onCheckedChange={(val: boolean) => onCheckedChange(val === true)}
        className="mt-0.5"
      />
      <Label htmlFor="consent" className="text-sm leading-relaxed text-amber-900 cursor-pointer">
        I confirm that the customer has given permission to use this document only
        for generating biodata. The uploaded file will be processed temporarily and
        deleted after biodata generation.
      </Label>
    </div>
  );
}
