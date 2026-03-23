"use client";

import { useState, useRef } from "react";
import { useCV } from "@/hooks/useCV";
import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import CVEditor from "@/components/cv/CVEditor";

export default function CVPage() {
  const { cvList, currentCV, loading, fetchCV, createCV, updateCV, deleteCV } = useCV();
  const [uploading, setUploading] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreate = async () => {
    const cv = await createCV({ name: "Yeni CV" });
    fetchCV(cv.id);
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // PDF preview URL
    const url = URL.createObjectURL(file);
    setPdfPreviewUrl(url);

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("pdf", file);

      const res = await fetch("/api/cv/parse-pdf", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        alert(`PDF parse hatasi: ${err.error}`);
        return;
      }

      const { parsedCV } = await res.json();

      // Create a new CV with parsed data
      const cv = await createCV({
        name: file.name.replace(/\.pdf$/i, ""),
        personalInfo: parsedCV.personalInfo,
        summary: parsedCV.summary,
        experience: parsedCV.experience?.map((exp: { company: string; title: string; location: string; startDate: string; endDate: string; bullets: string[] }, i: number) => ({
          ...exp,
          id: `exp-${i}-${Date.now()}`,
        })) || [],
        education: parsedCV.education?.map((edu: { institution: string; degree: string; field: string; startDate: string; endDate: string; gpa: string }, i: number) => ({
          ...edu,
          id: `edu-${i}-${Date.now()}`,
        })) || [],
        projects: parsedCV.projects?.map((proj: { name: string; description: string; technologies: string[]; url: string; bullets: string[] }, i: number) => ({
          ...proj,
          id: `proj-${i}-${Date.now()}`,
        })) || [],
        skills: parsedCV.skills || {},
      });

      fetchCV(cv.id);
    } catch (err) {
      console.error("PDF upload failed:", err);
      alert("PDF yuklenirken bir hata olustu");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      <Header title="CV'lerim" subtitle="CV olustur, duzenle veya PDF yukle" />

      <div className="flex gap-6">
        {/* CV List */}
        <div className="w-64 shrink-0 space-y-2">
          <Button onClick={handleCreate} className="w-full">+ Yeni CV</Button>

          {/* PDF Upload */}
          <div className="relative">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handlePdfUpload}
              className="hidden"
              id="pdf-upload"
            />
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? "PDF isleniyor..." : "PDF Yukle"}
            </Button>
          </div>

          {cvList.map((cv) => (
            <Card
              key={cv.id}
              className={`cursor-pointer transition-colors ${
                currentCV?.id === cv.id ? "ring-2 ring-brand-500" : "hover:bg-gray-50"
              }`}
              onClick={() => { fetchCV(cv.id); setPdfPreviewUrl(null); }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium">{cv.name}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(cv.updated_at).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteCV(cv.id);
                  }}
                >
                  &times;
                </Button>
              </div>
            </Card>
          ))}
          {cvList.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-8">
              Henuz CV yok. Olusturun veya PDF yukleyin.
            </p>
          )}
        </div>

        {/* Editor + Preview */}
        <div className="flex-1">
          {loading && <p className="text-sm text-gray-500">Yukleniyor...</p>}
          {uploading && (
            <Card className="text-center py-16">
              <div className="animate-pulse">
                <p className="text-gray-500 text-lg font-medium">PDF isleniyor...</p>
                <p className="text-gray-400 text-sm mt-2">AI ozgecmisinizi analiz ediyor</p>
              </div>
            </Card>
          )}
          {!loading && !uploading && currentCV && (
            <div className="space-y-6">
              <Card>
                <CVEditor cv={currentCV} onSave={updateCV} />
              </Card>

              {/* PDF Preview */}
              {pdfPreviewUrl && (
                <Card>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-semibold text-gray-700">PDF Onizleme</h3>
                    <Button variant="ghost" size="sm" onClick={() => setPdfPreviewUrl(null)}>
                      Kapat
                    </Button>
                  </div>
                  <iframe
                    src={pdfPreviewUrl}
                    className="w-full h-[600px] rounded-lg border border-gray-200"
                    title="PDF Preview"
                  />
                </Card>
              )}
            </div>
          )}
          {!loading && !uploading && !currentCV && (
            <Card className="text-center py-16">
              <p className="text-gray-400">CV secin, olusturun veya PDF yukleyin</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
