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
        <span className="text-sm font-medium text-gray-700">Başvuru Tipi:</span>
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
            Dogrudan Sirket
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
            Outsource / IK Ajansi
          </button>
        </div>
      </div>

      {isOutsource && (
        <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg text-sm text-orange-700">
          Bu ilan bir IK ajansi / outsource firma uzerinden. CV tailoring sirasinda
          sektore ve pozisyona odaklanilacak, spesifik sirket adi yerine genel
          anahtar kelimeler on plana cikarilacak.
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Pozisyon</label>
          <input
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="ör. Senior Frontend Engineer"
          />
        </div>
        <div>
          <label className="label">{isOutsource ? "IK Ajansi / Firma Adi" : "Sirket"}</label>
          <input
            className="input"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder={isOutsource ? "ör. Randstad, Adecco, ManpowerGroup" : "ör. Acme Corp"}
          />
        </div>
      </div>
      <div>
        <label className="label">Ilan Metni (tamamini yapistir)</label>
        <textarea
          className="textarea"
          rows={12}
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder="Is ilaninin tum metnini buraya yapistirin..."
        />
      </div>
      <Button onClick={handleSubmit} disabled={!rawText.trim() || loading}>
        {loading ? "Kaydediliyor..." : "Ilani Kaydet"}
      </Button>
    </div>
  );
}
