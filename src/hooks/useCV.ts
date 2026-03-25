"use client";

import { useState, useEffect, useCallback } from "react";
import type { CV } from "@/lib/types/cv";

export function useCV() {
  const [cvList, setCvList] = useState<{ id: string; name: string; created_at: string; updated_at: string }[]>([]);
  const [currentCV, setCurrentCV] = useState<CV | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchList = useCallback(async () => {
    const res = await fetch("/api/cv");
    const data = await res.json();
    setCvList(data);
  }, []);

  const fetchCV = useCallback(async (id: string) => {
    setLoading(true);
    const res = await fetch(`/api/cv?id=${encodeURIComponent(id)}`);
    const data = await res.json();
    setCurrentCV(data);
    setLoading(false);
  }, []);

  const createCV = useCallback(async (cv: Partial<CV>) => {
    const res = await fetch("/api/cv", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cv),
    });
    const data = await res.json();
    await fetchList();
    return data;
  }, [fetchList]);

  const updateCV = useCallback(async (cv: CV) => {
    await fetch("/api/cv", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cv),
    });
    setCurrentCV(cv);
    await fetchList();
  }, [fetchList]);

  const deleteCV = useCallback(async (id: string) => {
    await fetch(`/api/cv?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    if (currentCV?.id === id) setCurrentCV(null);
    await fetchList();
  }, [currentCV, fetchList]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return { cvList, currentCV, loading, fetchList, fetchCV, createCV, updateCV, deleteCV, setCurrentCV };
}
