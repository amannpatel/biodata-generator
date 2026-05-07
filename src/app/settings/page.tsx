"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Save, Store } from "lucide-react";

export default function SettingsPage() {
  const [shopName, setShopName] = useState("");
  const [shopPhone, setShopPhone] = useState("");
  const [shopAddress, setShopAddress] = useState("");
  const [defaultTemplate, setDefaultTemplate] = useState("simple-classic");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // In production: save to database via API
    localStorage.setItem(
      "shop-settings",
      JSON.stringify({ shopName, shopPhone, shopAddress, defaultTemplate })
    );
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <AppShell breadcrumbs={[{ label: "Settings" }]}>
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 text-sm mt-1">
            Configure your shop details and default preferences.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              Shop Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="shopName">Shop Name</Label>
              <Input
                id="shopName"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder="Your shop name (appears on biodata footer)"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="shopPhone">Shop Phone</Label>
              <Input
                id="shopPhone"
                value={shopPhone}
                onChange={(e) => setShopPhone(e.target.value)}
                placeholder="Contact number"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="shopAddress">Shop Address</Label>
              <Input
                id="shopAddress"
                value={shopAddress}
                onChange={(e) => setShopAddress(e.target.value)}
                placeholder="Shop address"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="defaultTemplate">Default Template</Label>
              <Select value={defaultTemplate} onValueChange={(val: string | null) => setDefaultTemplate(val || "simple-classic")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simple-classic">Simple Classic</SelectItem>
                  <SelectItem value="modern-clean">Modern Clean</SelectItem>
                  <SelectItem value="marriage-biodata">Marriage Biodata</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                This template will be pre-selected when creating new biodatas.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-3">
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
          {saved && (
            <span className="text-sm text-green-600 font-medium">
              Settings saved!
            </span>
          )}
        </div>
      </div>
    </AppShell>
  );
}
