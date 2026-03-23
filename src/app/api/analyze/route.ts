import { NextRequest, NextResponse } from "next/server";
import { callAI, extractJSON } from "@/lib/ai/client";
import { PROMPTS } from "@/lib/ai/prompts";
import { JobAnalysisSchema, GapAnalysisSchema } from "@/lib/ai/schemas";
import { getDb } from "@/lib/db";

// POST /api/analyze — analyze job posting or perform gap analysis
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { type } = body;

  try {
    if (type === "job") {
      const { jobText, jobId, isOutsource } = body;
      if (!jobText) {
        return NextResponse.json({ error: "jobText is required" }, { status: 400 });
      }

      const raw = await callAI(
        PROMPTS.analyzeJob.system,
        PROMPTS.analyzeJob.user(jobText, isOutsource)
      );

      const parsed = JSON.parse(extractJSON(raw));
      const analysis = JobAnalysisSchema.parse(parsed);

      // Save analysis to job if jobId provided
      if (jobId) {
        const db = getDb();
        db.prepare("UPDATE jobs SET analysis = ? WHERE id = ?").run(
          JSON.stringify(analysis),
          jobId
        );
      }

      return NextResponse.json(analysis);
    }

    if (type === "gap") {
      const { cvData, jobAnalysis, isOutsource } = body;
      if (!cvData || !jobAnalysis) {
        return NextResponse.json(
          { error: "cvData and jobAnalysis are required" },
          { status: 400 }
        );
      }

      const raw = await callAI(
        PROMPTS.gapAnalysis.system,
        PROMPTS.gapAnalysis.user(JSON.stringify(cvData), JSON.stringify(jobAnalysis), isOutsource)
      );

      const parsed = JSON.parse(extractJSON(raw));
      const gapAnalysis = GapAnalysisSchema.parse(parsed);

      return NextResponse.json(gapAnalysis);
    }

    return NextResponse.json({ error: "Unknown type" }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "AI analysis failed";
    console.error("Analysis error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
