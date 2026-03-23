"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";

export default function Dashboard() {
  const [stats, setStats] = useState({ cvs: 0, jobs: 0 });

  useEffect(() => {
    Promise.all([fetch("/api/cv"), fetch("/api/jobs")])
      .then(([cvRes, jobRes]) => Promise.all([cvRes.json(), jobRes.json()]))
      .then(([cvs, jobs]) => setStats({ cvs: cvs.length, jobs: jobs.length }));
  }, []);

  return (
    <div>
      <Header title="Dashboard" subtitle="Welcome to NSCV — your AI-powered CV optimizer" />

      <div className="grid grid-cols-3 gap-6 mb-8">
        <Card>
          <p className="text-sm text-gray-500">My CVs</p>
          <p className="text-3xl font-bold mt-1">{stats.cvs}</p>
          <Link href="/cv" className="text-sm text-brand-600 hover:underline mt-2 inline-block">
            Manage CVs &rarr;
          </Link>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Job Postings</p>
          <p className="text-3xl font-bold mt-1">{stats.jobs}</p>
          <Link href="/jobs" className="text-sm text-brand-600 hover:underline mt-2 inline-block">
            View Jobs &rarr;
          </Link>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Quick Action</p>
          <p className="text-lg font-semibold mt-2">Tailor CV</p>
          <Link href="/tailor" className="text-sm text-brand-600 hover:underline mt-2 inline-block">
            Start tailoring &rarr;
          </Link>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold mb-4">How It Works</h2>
        <div className="grid grid-cols-4 gap-4">
          {[
            { step: "1", title: "Create CV", desc: "Build your base CV with modular sections" },
            { step: "2", title: "Add Job", desc: "Paste a job posting you want to apply for" },
            { step: "3", title: "Analyze", desc: "AI analyzes gaps between your CV and the job" },
            { step: "4", title: "Tailor", desc: "Get AI-powered suggestions and rewrite your CV" },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-10 h-10 rounded-full bg-brand-50 text-brand-700 font-bold flex items-center justify-center mx-auto mb-2">
                {item.step}
              </div>
              <p className="text-sm font-medium">{item.title}</p>
              <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
