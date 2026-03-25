import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { v4 as uuid } from "uuid";

// GET /api/cv/versions?cvId=&jobId=
export async function GET(req: NextRequest) {
  const db = getDb();
  const cvId = req.nextUrl.searchParams.get("cvId");
  const jobId = req.nextUrl.searchParams.get("jobId");

  let rows: { id: string; cv_id: string; job_id: string | null; label: string; data: string; created_at: string }[];

  if (cvId && jobId) {
    rows = db.prepare(
      "SELECT * FROM cv_versions WHERE cv_id = ? AND job_id = ? ORDER BY created_at DESC"
    ).all(cvId, jobId) as typeof rows;
  } else if (cvId) {
    rows = db.prepare(
      "SELECT * FROM cv_versions WHERE cv_id = ? ORDER BY created_at DESC"
    ).all(cvId) as typeof rows;
  } else if (jobId) {
    rows = db.prepare(
      "SELECT * FROM cv_versions WHERE job_id = ? ORDER BY created_at DESC"
    ).all(jobId) as typeof rows;
  } else {
    rows = db.prepare(
      "SELECT * FROM cv_versions ORDER BY created_at DESC"
    ).all() as typeof rows;
  }

  return NextResponse.json(
    rows.map((r) => ({
      id: r.id,
      cvId: r.cv_id,
      jobId: r.job_id,
      label: r.label,
      data: JSON.parse(r.data),
      createdAt: r.created_at,
    }))
  );
}

// POST /api/cv/versions — save a new version
export async function POST(req: NextRequest) {
  const db = getDb();
  const body = await req.json();

  if (!body.cvId || !body.label || !body.data) {
    return NextResponse.json({ error: "cvId, label, and data are required" }, { status: 400 });
  }

  const id = uuid();

  db.prepare(
    "INSERT INTO cv_versions (id, cv_id, job_id, label, data) VALUES (?, ?, ?, ?, ?)"
  ).run(id, body.cvId, body.jobId || null, body.label, JSON.stringify(body.data));

  return NextResponse.json({ id, ...body }, { status: 201 });
}
