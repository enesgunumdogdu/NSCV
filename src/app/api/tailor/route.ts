import { NextRequest, NextResponse } from "next/server";
import { callAI, extractJSON } from "@/lib/ai/client";
import { PROMPTS } from "@/lib/ai/prompts";
import { TailorResultSchema, RewriteResultSchema } from "@/lib/ai/schemas";

// POST /api/tailor — tailor CV or rewrite bullet
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { type } = body;

  try {
    if (type === "full") {
      const { cvData, jobAnalysis, isOutsource } = body;
      if (!cvData || !jobAnalysis) {
        return NextResponse.json(
          { error: "cvData and jobAnalysis are required" },
          { status: 400 }
        );
      }

      const raw = await callAI(
        PROMPTS.tailorCV.system,
        PROMPTS.tailorCV.user(JSON.stringify(cvData), JSON.stringify(jobAnalysis), isOutsource)
      );

      const parsed = JSON.parse(extractJSON(raw));
      const result = TailorResultSchema.parse(parsed);

      return NextResponse.json(result);
    }

    if (type === "bullet") {
      const { bullet, keywords } = body;
      if (!bullet) {
        return NextResponse.json({ error: "bullet is required" }, { status: 400 });
      }

      const raw = await callAI(
        PROMPTS.rewriteBullet.system,
        PROMPTS.rewriteBullet.user(bullet, keywords || [])
      );

      const parsed = JSON.parse(extractJSON(raw));
      const result = RewriteResultSchema.parse(parsed);

      return NextResponse.json(result);
    }

    return NextResponse.json({ error: "Unknown type" }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Tailoring failed";
    console.error("Tailor error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
