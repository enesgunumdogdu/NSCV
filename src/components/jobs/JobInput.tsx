"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

interface Props {
  onSubmit: (job: { title: string; company: string; rawText: string }) => void;
  loading?: boolean;
}

export default function JobInput({ onSubmit, loading }: Props) {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [rawText, setRawText] = useState("");

  const handleSubmit = () => {
    if (!rawText.trim()) return;
    onSubmit({ title: title || "Untitled", company, rawText });
    setTitle("");
    setCompany("");
    setRawText("");
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Job Title</label>
          <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Senior Frontend Engineer" />
        </div>
        <div>
          <label className="label">Company</label>
          <input className="input" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g., Acme Corp" />
        </div>
      </div>
      <div>
        <label className="label">Job Posting (paste full text)</label>
        <textarea
          className="textarea"
          rows={12}
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder="Paste the entire job posting here..."
        />
      </div>
      <Button onClick={handleSubmit} disabled={!rawText.trim() || loading}>
        {loading ? "Saving..." : "Save Job Posting"}
      </Button>
    </div>
  );
}
