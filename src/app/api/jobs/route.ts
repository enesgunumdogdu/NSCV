import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { v4 as uuid } from "uuid";

// GET /api/jobs — list all or get one
export async function GET(req: NextRequest) {
  const db = getDb();
  const id = req.nextUrl.searchParams.get("id");

  if (id) {
    const row = db.prepare("SELECT * FROM jobs WHERE id = ?").get(id) as
      | { id: string; title: string; company: string; raw_text: string; analysis: string | null; created_at: string }
      | undefined;
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({
      id: row.id,
      title: row.title,
      company: row.company,
      rawText: row.raw_text,
      analysis: row.analysis ? JSON.parse(row.analysis) : null,
      createdAt: row.created_at,
    });
  }

  const rows = db.prepare("SELECT id, title, company, created_at FROM jobs ORDER BY created_at DESC").all();
  return NextResponse.json(rows);
}

// POST /api/jobs — create a new job posting
export async function POST(req: NextRequest) {
  const db = getDb();
  const body = await req.json();
  const id = uuid();

  db.prepare("INSERT INTO jobs (id, title, company, raw_text) VALUES (?, ?, ?, ?)").run(
    id,
    body.title || "Untitled Job",
    body.company || "",
    body.rawText
  );

  return NextResponse.json({ id, title: body.title, company: body.company }, { status: 201 });
}

// PUT /api/jobs — update (mainly to save analysis)
export async function PUT(req: NextRequest) {
  const db = getDb();
  const body = await req.json();

  if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const updates: string[] = [];
  const params: (string | null)[] = [];

  if (body.title) { updates.push("title = ?"); params.push(body.title); }
  if (body.company) { updates.push("company = ?"); params.push(body.company); }
  if (body.analysis) { updates.push("analysis = ?"); params.push(JSON.stringify(body.analysis)); }

  params.push(body.id);
  db.prepare(`UPDATE jobs SET ${updates.join(", ")} WHERE id = ?`).run(...params);

  return NextResponse.json({ success: true });
}

// DELETE /api/jobs?id=
export async function DELETE(req: NextRequest) {
  const db = getDb();
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  db.prepare("DELETE FROM jobs WHERE id = ?").run(id);
  return NextResponse.json({ success: true });
}
