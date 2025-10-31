"use client";
import { useState } from "react";

interface RideDocumentationFormProps {
  bookingId: string;
  onSubmit: (data: RideDocumentation) => Promise<void>;
  onCancel: () => void;
}

export interface RideDocumentation {
  rideQuality: "excellent" | "good" | "fair" | "poor";
  clientComfort:
    | "very_comfortable"
    | "comfortable"
    | "neutral"
    | "uncomfortable";
  accessibilityNotes: string;
  issuesReported: string;
}

export default function RideDocumentationForm({
  bookingId,
  onSubmit,
  onCancel,
}: RideDocumentationFormProps) {
  const [formData, setFormData] = useState<RideDocumentation>({
    rideQuality: "good",
    clientComfort: "comfortable",
    accessibilityNotes: "",
    issuesReported: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Failed to submit documentation:", error);
      alert("Failed to submit documentation. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Document Ride Completion</h2>
        <p className="text-gray-600 mb-6">
          Please provide feedback about this ride to ensure quality service.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Ride Quality */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Overall Ride Quality <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "excellent", label: "Excellent", emoji: "🌟" },
                { value: "good", label: "Good", emoji: "👍" },
                { value: "fair", label: "Fair", emoji: "👌" },
                { value: "poor", label: "Poor", emoji: "👎" },
              ].map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                    formData.rideQuality === option.value
                      ? "bg-blue-50 border-blue-500"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="rideQuality"
                    value={option.value}
                    checked={formData.rideQuality === option.value}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        rideQuality: e.target.value as any,
                      })
                    }
                    className="w-4 h-4"
                  />
                  <span className="text-xl">{option.emoji}</span>
                  <span className="font-medium">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Client Comfort */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Client Comfort Level <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  value: "very_comfortable",
                  label: "Very Comfortable",
                  emoji: "😊",
                },
                { value: "comfortable", label: "Comfortable", emoji: "🙂" },
                { value: "neutral", label: "Neutral", emoji: "😐" },
                { value: "uncomfortable", label: "Uncomfortable", emoji: "😟" },
              ].map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                    formData.clientComfort === option.value
                      ? "bg-green-50 border-green-500"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="clientComfort"
                    value={option.value}
                    checked={formData.clientComfort === option.value}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        clientComfort: e.target.value as any,
                      })
                    }
                    className="w-4 h-4"
                  />
                  <span className="text-xl">{option.emoji}</span>
                  <span className="font-medium">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Accessibility Notes */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Accessibility Notes
            </label>
            <textarea
              value={formData.accessibilityNotes}
              onChange={(e) =>
                setFormData({ ...formData, accessibilityNotes: e.target.value })
              }
              placeholder="Any notes about wheelchair access, mobility assistance, or other accessibility considerations..."
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          {/* Issues Reported */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Issues or Concerns
            </label>
            <textarea
              value={formData.issuesReported}
              onChange={(e) =>
                setFormData({ ...formData, issuesReported: e.target.value })
              }
              placeholder="Report any issues, concerns, or incidents during the ride (leave empty if none)..."
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
            <p className="text-xs text-gray-500 mt-1">
              This helps us maintain high quality service and address any
              problems.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onCancel}
              disabled={submitting}
              className="flex-1 px-4 py-3 border rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Complete Ride"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
