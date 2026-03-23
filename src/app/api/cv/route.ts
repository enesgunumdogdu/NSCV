import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { v4 as uuid } from "uuid";
import type { CV } from "@/lib/types/cv";

// GET /api/cv — list all CVs or get one by ?id=
export async function GET(req: NextRequest) {
  const db = getDb();
  const id = req.nextUrl.searchParams.get("id");

  if (id) {
    const row = db.prepare("SELECT * FROM cvs WHERE id = ?").get(id) as
      | { id: string; name: string; data: string }
      | undefined;
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ...JSON.parse(row.data), id: row.id, name: row.name });
  }

  const rows = db.prepare("SELECT id, name, created_at, updated_at FROM cvs ORDER BY updated_at DESC").all();
  return NextResponse.json(rows);
}

// POST /api/cv — create new CV
export async function POST(req: NextRequest) {
  const db = getDb();
  const body = await req.json();
  const id = uuid();
  const now = new Date().toISOString();

  const cv: CV = {
    id,
    name: body.name || "Untitled CV",
    personalInfo: body.personalInfo || {
      fullName: "",
      email: "",
      phone: "",
      location: "",
    },
    summary: body.summary || "",
    experience: body.experience || [],
    education: body.education || [],
    projects: body.projects || [],
    skills: body.skills || {},
    createdAt: now,
    updatedAt: now,
  };

  db.prepare("INSERT INTO cvs (id, name, data) VALUES (?, ?, ?)").run(
    id,
    cv.name,
    JSON.stringify(cv)
  );

  return NextResponse.json(cv, { status: 201 });
}

// PUT /api/cv — update existing CV
export async function PUT(req: NextRequest) {
  const db = getDb();
  const body = await req.json();

  if (!body.id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const now = new Date().toISOString();
  body.updatedAt = now;

  db.prepare("UPDATE cvs SET name = ?, data = ?, updated_at = ? WHERE id = ?").run(
    body.name,
    JSON.stringify(body),
    now,
    body.id
  );

  return NextResponse.json(body);
}

// DELETE /api/cv?id=
export async function DELETE(req: NextRequest) {
  const db = getDb();
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  db.prepare("DELETE FROM cvs WHERE id = ?").run(id);
  return NextResponse.json({ success: true });
}
