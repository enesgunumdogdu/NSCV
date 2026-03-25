import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { v4 as uuid } from "uuid";

// GET /api/jobs — list all or get one
export async function GET(req: NextRequest) {
  const db = getDb();
  const id = req.nextUrl.searchParams.get("id");

  if (id) {
    const row = db.prepare("SELECT * FROM jobs WHERE id = ?").get(id) as
      | { id: string; title: string; company: string; raw_text: string; is_outsource: number; analysis: string | null; created_at: string }
      | undefined;
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({
      id: row.id,
      title: row.title,
      company: row.company,
      rawText: row.raw_text,
      isOutsource: row.is_outsource === 1,
      analysis: row.analysis ? JSON.parse(row.analysis) : null,
      createdAt: row.created_at,
    });
  }

  const rows = db.prepare(
    "SELECT id, title, company, is_outsource, created_at FROM jobs ORDER BY created_at DESC"
  ).all() as { id: string; title: string; company: string; is_outsource: number; created_at: string }[];

  return NextResponse.json(
    rows.map((r) => ({ ...r, isOutsource: r.is_outsource === 1 }))
  );
}

// POST /api/jobs — create a new job posting
export async function POST(req: NextRequest) {
  const db = getDb();
  const body = await req.json();

  if (!body.rawText || typeof body.rawText !== "string") {
    return NextResponse.json({ error: "rawText is required" }, { status: 400 });
  }

  const id = uuid();

  db.prepare(
    "INSERT INTO jobs (id, title, company, raw_text, is_outsource) VALUES (?, ?, ?, ?, ?)"
  ).run(
    id,
    String(body.title || "Untitled Job"),
    String(body.company || ""),
    body.rawText,
    body.isOutsource ? 1 : 0
  );

  return NextResponse.json(
    { id, title: body.title, company: body.company, isOutsource: !!body.isOutsource },
    { status: 201 }
  );
}

// PUT /api/jobs — update (mainly to save analysis)
export async function PUT(req: NextRequest) {
  const db = getDb();
  const body = await req.json();

  if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const updates: string[] = [];
  const params: (string | number | null)[] = [];

  if (body.title) { updates.push("title = ?"); params.push(body.title); }
  if (body.company !== undefined) { updates.push("company = ?"); params.push(body.company); }
  if (body.isOutsource !== undefined) { updates.push("is_outsource = ?"); params.push(body.isOutsource ? 1 : 0); }
  if (body.analysis) { updates.push("analysis = ?"); params.push(JSON.stringify(body.analysis)); }

  if (updates.length === 0) return NextResponse.json({ success: true });

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
