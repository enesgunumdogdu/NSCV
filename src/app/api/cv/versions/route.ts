import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { v4 as uuid } from "uuid";

// GET /api/cv/versions?cvId=&jobId=
export async function GET(req: NextRequest) {
  const db = getDb();
  const cvId = req.nextUrl.searchParams.get("cvId");
  const jobId = req.nextUrl.searchParams.get("jobId");

  let query = "SELECT * FROM cv_versions WHERE 1=1";
  const params: string[] = [];

  if (cvId) {
    query += " AND cv_id = ?";
    params.push(cvId);
  }
  if (jobId) {
    query += " AND job_id = ?";
    params.push(jobId);
  }

  query += " ORDER BY created_at DESC";
  const rows = db.prepare(query).all(...params) as {
    id: string;
    cv_id: string;
    job_id: string | null;
    label: string;
    data: string;
    created_at: string;
  }[];

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
  const id = uuid();

  db.prepare(
    "INSERT INTO cv_versions (id, cv_id, job_id, label, data) VALUES (?, ?, ?, ?, ?)"
  ).run(id, body.cvId, body.jobId || null, body.label, JSON.stringify(body.data));

  return NextResponse.json({ id, ...body }, { status: 201 });
}
