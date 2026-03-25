"use client";

import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import GapAnalysis from "@/components/tailor/GapAnalysis";
import TailoredPreview from "@/components/tailor/TailoredPreview";
import DiffView from "@/components/ui/DiffView";
import type { CV } from "@/lib/types/cv";
import type { JobPosting, GapAnalysisResult } from "@/lib/types/job";

export default function TailorPage() {
  const [cvList, setCvList] = useState<{ id: string; name: string }[]>([]);
  const [jobList, setJobList] = useState<{ id: string; title: string; company: string; isOutsource?: boolean; is_outsource?: number }[]>([]);
  const [selectedCvId, setSelectedCvId] = useState("");
  const [selectedJobId, setSelectedJobId] = useState("");
  const [cv, setCv] = useState<CV | null>(null);
  const [job, setJob] = useState<JobPosting | null>(null);
  const [gapResult, setGapResult] = useState<GapAnalysisResult | null>(null);
  const [tailorResult, setTailorResult] = useState<{ tailoredCV: CV; changes: { section: string; field: string; before: string; after: string }[] } | null>(null);
  const [loading, setLoading] = useState("");
  const [activeTab, setActiveTab] = useState<"gap" | "tailored" | "diff">("gap");

  useEffect(() => {
    fetch("/api/cv").then((r) => r.json()).then(setCvList);
    fetch("/api/jobs").then((r) => r.json()).then(setJobList);
  }, []);

  useEffect(() => {
    if (selectedCvId) {
      fetch(`/api/cv?id=${encodeURIComponent(selectedCvId)}`).then((r) => r.json()).then(setCv);
    }
  }, [selectedCvId]);

  useEffect(() => {
    if (selectedJobId) {
      fetch(`/api/jobs?id=${encodeURIComponent(selectedJobId)}`).then((r) => r.json()).then(setJob);
    }
  }, [selectedJobId]);

  const handleGapAnalysis = async () => {
    if (!cv || !job?.analysis) return;
    setLoading("gap");
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "gap",
          cvData: cv,
          jobAnalysis: job.analysis,
          isOutsource: job.isOutsource,
        }),
      });
      setGapResult(await res.json());
      setActiveTab("gap");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading("");
    }
  };

  const handleTailor = async () => {
    if (!cv || !job?.analysis) return;
    setLoading("tailor");
    try {
      const res = await fetch("/api/tailor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "full",
          cvData: cv,
          jobAnalysis: job.analysis,
          isOutsource: job.isOutsource,
        }),
      });
      setTailorResult(await res.json());
      setActiveTab("tailored");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading("");
    }
  };

  const handleSaveVersion = async () => {
    if (!tailorResult || !cv || !job) return;
    const label = job.isOutsource
      ? `${job.title} - Outsource (${job.company})`
      : `${job.title} - ${job.company}`;
    await fetch("/api/cv/versions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cvId: cv.id,
        jobId: job.id,
        label,
        data: tailorResult.tailoredCV,
      }),
    });
    alert("Version saved!");
  };

  const ready = cv && job?.analysis;

  return (
    <div>
      <Header title="Tailor & Analyze" subtitle="Compare your CV against a job posting and improve it with AI" />

      <Card className="mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Select CV</label>
            <select className="input" value={selectedCvId} onChange={(e) => setSelectedCvId(e.target.value)}>
              <option value="">-- Select a CV --</option>
              {cvList.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Select Job Posting</label>
            <select className="input" value={selectedJobId} onChange={(e) => setSelectedJobId(e.target.value)}>
              <option value="">-- Select a posting --</option>
              {jobList.map((j) => {
                const outsource = j.isOutsource || j.is_outsource === 1;
                return (
                  <option key={j.id} value={j.id}>
                    {j.title} — {j.company} {outsource ? "(Outsource)" : ""}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {job?.isOutsource && (
          <div className="mt-3 flex items-center gap-2">
            <Badge variant="warning">Outsource</Badge>
            <span className="text-sm text-gray-500">
              Via recruitment agency — tailoring will focus on industry and role keywords
            </span>
          </div>
        )}

        {job && !job.analysis && (
          <p className="text-sm text-yellow-600 mt-3">
            This posting has not been analyzed yet. Please analyze it first from the Job Postings page.
          </p>
        )}

        <div className="flex gap-3 mt-4">
          <Button onClick={handleGapAnalysis} disabled={!ready || loading === "gap"}>
            {loading === "gap" ? "Analyzing..." : "Gap Analysis"}
          </Button>
          <Button variant="secondary" onClick={handleTailor} disabled={!ready || loading === "tailor"}>
            {loading === "tailor" ? "Tailoring..." : "Auto Tailor"}
          </Button>
        </div>
      </Card>

      {(gapResult || tailorResult) && (
        <>
          <div className="flex gap-2 mb-4">
            {gapResult && (
              <Button
                variant={activeTab === "gap" ? "primary" : "secondary"}
                size="sm"
                onClick={() => setActiveTab("gap")}
              >
                Gap Analysis
              </Button>
            )}
            {tailorResult && (
              <>
                <Button
                  variant={activeTab === "tailored" ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => setActiveTab("tailored")}
                >
                  Tailored CV
                </Button>
                <Button
                  variant={activeTab === "diff" ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => setActiveTab("diff")}
                >
                  View Changes
                </Button>
              </>
            )}
          </div>

          {activeTab === "gap" && gapResult && <GapAnalysis data={gapResult} />}

          {activeTab === "tailored" && tailorResult && (
            <div>
              <div className="flex justify-end mb-4">
                <Button onClick={handleSaveVersion} size="sm">Save as Version</Button>
              </div>
              <TailoredPreview cv={tailorResult.tailoredCV} />
            </div>
          )}

          {activeTab === "diff" && tailorResult && (
            <Card>
              <h3 className="text-lg font-semibold mb-4">Changes Made</h3>
              <DiffView changes={tailorResult.changes} />
            </Card>
          )}
        </>
      )}
    </div>
  );
}
