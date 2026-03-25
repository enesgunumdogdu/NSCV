"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

interface Props {
  onSubmit: (job: { title: string; company: string; rawText: string; isOutsource: boolean }) => void;
  loading?: boolean;
}

export default function JobInput({ onSubmit, loading }: Props) {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [rawText, setRawText] = useState("");
  const [isOutsource, setIsOutsource] = useState(false);

  const handleSubmit = () => {
    if (!rawText.trim()) return;
    onSubmit({ title: title || "Untitled", company, rawText, isOutsource });
    setTitle("");
    setCompany("");
    setRawText("");
    setIsOutsource(false);
  };

  return (
    <div className="space-y-4">
      {/* Outsource toggle */}
      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <span className="text-sm font-medium text-gray-700">Application Type:</span>
        <div className="flex gap-2">
          <button
            type="button"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              !isOutsource
                ? "bg-brand-600 text-white"
                : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
            }`}
            onClick={() => setIsOutsource(false)}
          >
            Direct Company
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isOutsource
                ? "bg-orange-500 text-white"
                : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
            }`}
            onClick={() => setIsOutsource(true)}
          >
            Outsource / Agency
          </button>
        </div>
      </div>

      {isOutsource && (
        <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg text-sm text-orange-700">
          This posting is via a recruitment agency / outsource firm. CV tailoring will
          focus on industry and role keywords rather than company-specific details.
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Position</label>
          <input
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Senior Frontend Engineer"
          />
        </div>
        <div>
          <label className="label">{isOutsource ? "Agency / Firm Name" : "Company"}</label>
          <input
            className="input"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder={isOutsource ? "e.g. Randstad, Adecco, ManpowerGroup" : "e.g. Acme Corp"}
          />
        </div>
      </div>
      <div>
        <label className="label">Posting Text (paste the full content)</label>
        <textarea
          className="textarea"
          rows={12}
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder="Paste the entire job posting text here..."
        />
      </div>
      <Button onClick={handleSubmit} disabled={!rawText.trim() || loading}>
        {loading ? "Saving..." : "Save Posting"}
      </Button>
    </div>
  );
}
