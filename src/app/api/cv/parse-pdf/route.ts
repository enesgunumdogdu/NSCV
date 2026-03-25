import { NextRequest, NextResponse } from "next/server";
import { callAI, extractJSON } from "@/lib/ai/client";

const PARSE_CV_PROMPT = {
  system: `You are an expert CV/resume parser. Extract structured information from CV text.
You MUST respond with valid JSON only — no markdown, no explanation.
If a field is not found, use empty string "" or empty array [].
For skills, group them into logical categories like "Programming Languages", "Frameworks", "Tools", "Soft Skills" etc.
For dates, use YYYY-MM format where possible.`,
  user: (text: string) => `Parse this CV/resume text and extract all information into structured JSON.

CV Text:
---
${text}
---

Respond with this exact JSON structure:
{
  "personalInfo": {
    "fullName": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "github": "",
    "website": ""
  },
  "summary": "",
  "experience": [
    {
      "company": "",
      "title": "",
      "location": "",
      "startDate": "",
      "endDate": "",
      "bullets": [""]
    }
  ],
  "education": [
    {
      "institution": "",
      "degree": "",
      "field": "",
      "startDate": "",
      "endDate": "",
      "gpa": ""
    }
  ],
  "projects": [
    {
      "name": "",
      "description": "",
      "technologies": [""],
      "url": "",
      "bullets": [""]
    }
  ],
  "skills": {
    "Category Name": ["skill1", "skill2"]
  }
}`,
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("pdf") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No PDF file provided" }, { status: 400 });
    }

    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File too large. Maximum size is 10MB" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are accepted" }, { status: 400 });
    }

    // Dynamic import for pdf-parse (CommonJS module)
    const pdfParse = (await import("pdf-parse")).default;
    const buffer = Buffer.from(await file.arrayBuffer());
    const pdfData = await pdfParse(buffer);
    const text = pdfData.text;

    if (!text.trim()) {
      return NextResponse.json({ error: "Could not extract text from PDF" }, { status: 400 });
    }

    // Use AI to parse the extracted text into structured CV data
    const raw = await callAI(PARSE_CV_PROMPT.system, PARSE_CV_PROMPT.user(text));
    const parsed = JSON.parse(extractJSON(raw));

    return NextResponse.json({
      extractedText: text,
      parsedCV: parsed,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "PDF parsing failed";
    console.error("PDF parse error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
