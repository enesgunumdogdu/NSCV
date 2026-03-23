"use client";

import { useState } from "react";
import { useJobs } from "@/hooks/useJobs";
import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import JobInput from "@/components/jobs/JobInput";
import JobAnalysisView from "@/components/jobs/JobAnalysis";
import type { JobAnalysis } from "@/lib/types/job";

export default function JobsPage() {
  const { jobs, currentJob, loading, fetchJob, createJob, deleteJob } = useJobs();
  const [showInput, setShowInput] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const handleCreateJob = async (job: { title: string; company: string; rawText: string; isOutsource: boolean }) => {
    const created = await createJob(job);
    setShowInput(false);
    fetchJob(created.id);
  };

  const handleAnalyze = async () => {
    if (!currentJob) return;
    setAnalyzing(true);
    try {
      await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "job",
          jobText: currentJob.rawText,
          jobId: currentJob.id,
          isOutsource: currentJob.isOutsource,
        }),
      });
      fetchJob(currentJob.id);
    } catch (err) {
      console.error("Analysis failed:", err);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div>
      <Header title="Is Ilanlari" subtitle="Ilan ekle, analiz et" />

      <div className="flex gap-6">
        {/* Job List */}
        <div className="w-64 shrink-0 space-y-2">
          <Button onClick={() => setShowInput(!showInput)} className="w-full">
            {showInput ? "Iptal" : "+ Yeni Ilan"}
          </Button>
          {jobs.map((job: { id: string; title: string; company: string; isOutsource?: boolean; is_outsource?: number }) => {
            const outsource = job.isOutsource || job.is_outsource === 1;
            return (
              <Card
                key={job.id}
                className={`cursor-pointer transition-colors ${
                  currentJob?.id === job.id ? "ring-2 ring-brand-500" : "hover:bg-gray-50"
                }`}
                onClick={() => fetchJob(job.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium">{job.title}</p>
                    <p className="text-xs text-gray-500">{job.company}</p>
                    {outsource && (
                      <Badge variant="warning" className="mt-1">Outsource</Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteJob(job.id);
                    }}
                  >
                    &times;
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Main content */}
        <div className="flex-1">
          {showInput && (
            <Card className="mb-6">
              <h2 className="text-lg font-semibold mb-4">Yeni Is Ilani Ekle</h2>
              <JobInput onSubmit={handleCreateJob} />
            </Card>
          )}

          {loading && <p className="text-sm text-gray-500">Yukleniyor...</p>}

          {!loading && currentJob && (
            <div className="space-y-6">
              <Card>
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-semibold">{currentJob.title}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm text-gray-500">{currentJob.company}</p>
                      {currentJob.isOutsource && (
                        <Badge variant="warning">Outsource / IK Ajansi</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {currentJob.analysis ? (
                      <Badge variant="success">Analiz Edildi</Badge>
                    ) : (
                      <Button onClick={handleAnalyze} disabled={analyzing} size="sm">
                        {analyzing ? "Analiz ediliyor..." : "AI ile Analiz Et"}
                      </Button>
                    )}
                  </div>
                </div>
                <details className="mt-4">
                  <summary className="text-sm text-gray-500 cursor-pointer">Ham ilan metnini gor</summary>
                  <pre className="mt-2 text-xs text-gray-600 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto">
                    {currentJob.rawText}
                  </pre>
                </details>
              </Card>

              {currentJob.analysis && <JobAnalysisView analysis={currentJob.analysis} />}
            </div>
          )}

          {!loading && !currentJob && !showInput && (
            <Card className="text-center py-16">
              <p className="text-gray-400">Bir ilan secin veya yeni ekleyin</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
