import { z } from "zod";

export const JobAnalysisSchema = z.object({
  requiredSkills: z.array(z.string()),
  preferredSkills: z.array(z.string()),
  requiredExperience: z.array(z.string()),
  keywords: z.array(z.string()),
  hiddenExpectations: z.array(z.string()),
  seniorityLevel: z.string(),
  summary: z.string(),
});

export const GapAnalysisSchema = z.object({
  missingSkills: z.array(z.string()),
  weakBullets: z.array(
    z.object({ original: z.string(), reason: z.string() })
  ),
  irrelevantContent: z.array(
    z.object({ section: z.string(), content: z.string(), reason: z.string() })
  ),
  keywordGaps: z.array(z.string()),
  matchScore: z.number().min(0).max(100),
  strengths: z.array(z.string()),
  suggestions: z.array(
    z.object({
      section: z.string(),
      type: z.enum(["rewrite", "add", "remove", "reorder"]),
      original: z.string().optional(),
      suggested: z.string(),
      reason: z.string(),
    })
  ),
});

export const RewriteResultSchema = z.object({
  rewritten: z.string(),
  changes: z.string(),
});

export const TailorResultSchema = z.object({
  tailoredCV: z.any(), // CV structure validated separately
  changes: z.array(
    z.object({
      section: z.string(),
      field: z.string(),
      before: z.string(),
      after: z.string(),
    })
  ),
});
