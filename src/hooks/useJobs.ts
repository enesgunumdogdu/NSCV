"use client";

import { useState, useEffect, useCallback } from "react";
import type { JobPosting } from "@/lib/types/job";

export function useJobs() {
  const [jobs, setJobs] = useState<{ id: string; title: string; company: string; created_at: string }[]>([]);
  const [currentJob, setCurrentJob] = useState<JobPosting | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchList = useCallback(async () => {
    const res = await fetch("/api/jobs");
    setJobs(await res.json());
  }, []);

  const fetchJob = useCallback(async (id: string) => {
    setLoading(true);
    const res = await fetch(`/api/jobs?id=${id}`);
    const data = await res.json();
    setCurrentJob(data);
    setLoading(false);
  }, []);

  const createJob = useCallback(async (job: { title: string; company: string; rawText: string }) => {
    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(job),
    });
    const data = await res.json();
    await fetchList();
    return data;
  }, [fetchList]);

  const deleteJob = useCallback(async (id: string) => {
    await fetch(`/api/jobs?id=${id}`, { method: "DELETE" });
    if (currentJob?.id === id) setCurrentJob(null);
    await fetchList();
  }, [currentJob, fetchList]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return { jobs, currentJob, loading, fetchList, fetchJob, createJob, deleteJob, setCurrentJob };
}
