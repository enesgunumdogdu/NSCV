"use client";

import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import GapAnalysis from "@/components/tailor/GapAnalysis";
import TailoredPreview from "@/components/tailor/TailoredPreview";
import DiffView from "@/components/ui/DiffView";
import type { CV } from "@/lib/types/cv";
import type { JobPosting, GapAnalysisResult } from "@/lib/types/job";

export default function TailorPage() {
  const [cvList, setCvList] = useState<{ id: string; name: string }[]>([]);
  const [jobList, setJobList] = useState<{ id: string; title: string; company: string }[]>([]);
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
      fetch(`/api/cv?id=${selectedCvId}`).then((r) => r.json()).then(setCv);
    }
  }, [selectedCvId]);

  useEffect(() => {
    if (selectedJobId) {
      fetch(`/api/jobs?id=${selectedJobId}`).then((r) => r.json()).then(setJob);
    }
  }, [selectedJobId]);

  const handleGapAnalysis = async () => {
    if (!cv || !job?.analysis) return;
    setLoading("gap");
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "gap", cvData: cv, jobAnalysis: job.analysis }),
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
        body: JSON.stringify({ type: "full", cvData: cv, jobAnalysis: job.analysis }),
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
    await fetch("/api/cv/versions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cvId: cv.id,
        jobId: job.id,
        label: `Tailored for ${job.title} at ${job.company}`,
        data: tailorResult.tailoredCV,
      }),
    });
    alert("Version saved!");
  };

  const ready = cv && job?.analysis;

  return (
    <div>
      <Header title="Tailor & Analyze" subtitle="Compare your CV against a job and get AI-powered improvements" />

      <Card className="mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Select CV</label>
            <select className="input" value={selectedCvId} onChange={(e) => setSelectedCvId(e.target.value)}>
              <option value="">-- Choose a CV --</option>
              {cvList.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Select Job Posting</label>
            <select className="input" value={selectedJobId} onChange={(e) => setSelectedJobId(e.target.value)}>
              <option value="">-- Choose a Job --</option>
              {jobList.map((j) => (
                <option key={j.id} value={j.id}>{j.title} — {j.company}</option>
              ))}
            </select>
          </div>
        </div>

        {job && !job.analysis && (
          <p className="text-sm text-yellow-600 mt-3">
            This job hasn&apos;t been analyzed yet. Go to Job Postings and analyze it first.
          </p>
        )}

        <div className="flex gap-3 mt-4">
          <Button onClick={handleGapAnalysis} disabled={!ready || loading === "gap"}>
            {loading === "gap" ? "Analyzing..." : "Run Gap Analysis"}
          </Button>
          <Button variant="secondary" onClick={handleTailor} disabled={!ready || loading === "tailor"}>
            {loading === "tailor" ? "Tailoring..." : "Auto-Tailor CV"}
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
