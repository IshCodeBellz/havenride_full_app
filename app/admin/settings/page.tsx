"use client";
import { useEffect, useState } from "react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    baseFare: 6.0,
    perKm: 1.8,
    wheelchairMult: 1.15,
    requirePickupPin: true,
    sendReceipts: true,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // In a real app, fetch settings from API
    // For now, use defaults
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      // In a real app, save to API
      alert("Settings saved! (UI only - API integration needed)");
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-600">Configure system parameters</p>
      </div>

      <div className="border rounded-lg p-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Fare Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Base Fare (£)
              </label>
              <input
                type="number"
                step="0.01"
                value={settings.baseFare}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    baseFare: parseFloat(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Price Per KM (£)
              </label>
              <input
                type="number"
                step="0.01"
                value={settings.perKm}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    perKm: parseFloat(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Wheelchair Multiplier
              </label>
              <input
                type="number"
                step="0.01"
                value={settings.wheelchairMult}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    wheelchairMult: parseFloat(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border rounded"
              />
              <p className="text-xs text-gray-500 mt-1">
                Current: {settings.baseFare} + {settings.perKm}/km ×{" "}
                {settings.wheelchairMult}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Feature Flags</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.requirePickupPin}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    requirePickupPin: e.target.checked,
                  })
                }
                className="w-4 h-4"
              />
              <span>Require pickup PIN verification</span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.sendReceipts}
                onChange={(e) =>
                  setSettings({ ...settings, sendReceipts: e.target.checked })
                }
                className="w-4 h-4"
              />
              <span>Send receipt emails automatically</span>
            </label>
          </div>
        </div>

        <div className="pt-4 border-t">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 btn-primary rounded disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}
