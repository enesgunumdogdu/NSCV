export const PROMPTS = {
  analyzeJob: {
    system: `You are an expert recruiter and job posting analyst. Extract structured information from job postings.
You MUST respond with valid JSON only — no markdown, no explanation.`,
    user: (jobText: string) => `Analyze this job posting and extract structured information.

Job Posting:
---
${jobText}
---

Respond with this exact JSON structure:
{
  "requiredSkills": ["skill1", "skill2"],
  "preferredSkills": ["skill1", "skill2"],
  "requiredExperience": ["3+ years in X", "experience with Y"],
  "keywords": ["keyword1", "keyword2"],
  "hiddenExpectations": ["inferred expectation 1"],
  "seniorityLevel": "junior|mid|senior|lead|principal",
  "summary": "Brief 2-sentence summary of the role"
}`,
  },

  gapAnalysis: {
    system: `You are an expert career coach and ATS optimization specialist. Compare CVs against job requirements with precision.
You MUST respond with valid JSON only — no markdown, no explanation.
Be honest but constructive. Never fabricate skills or experience the candidate doesn't have.`,
    user: (cvJson: string, jobAnalysis: string) => `Compare this CV against the job requirements and provide a gap analysis.

CV:
---
${cvJson}
---

Job Requirements:
---
${jobAnalysis}
---

Respond with this exact JSON structure:
{
  "missingSkills": ["skill1", "skill2"],
  "weakBullets": [{"original": "bullet text", "reason": "why it's weak"}],
  "irrelevantContent": [{"section": "Experience", "content": "text", "reason": "why irrelevant"}],
  "keywordGaps": ["missing keyword1", "missing keyword2"],
  "matchScore": 72,
  "strengths": ["strength1", "strength2"],
  "suggestions": [
    {
      "section": "experience",
      "type": "rewrite",
      "original": "original text",
      "suggested": "improved text",
      "reason": "why this is better"
    }
  ]
}`,
  },

  rewriteBullet: {
    system: `You are an expert CV writer. Rewrite bullet points to be more impactful and ATS-friendly.
Rules:
- Start with strong action verbs
- Include metrics/quantification where possible
- Incorporate relevant keywords naturally
- NEVER fabricate achievements — only improve phrasing of existing facts
- Keep the same meaning, just better presentation
Respond with valid JSON only.`,
    user: (bullet: string, keywords: string[]) => `Rewrite this CV bullet point to be stronger and include relevant keywords where natural.

Original bullet: "${bullet}"
Target keywords: ${JSON.stringify(keywords)}

Respond with:
{
  "rewritten": "the improved bullet point",
  "changes": "brief explanation of what changed"
}`,
  },

  tailorCV: {
    system: `You are an expert CV optimizer. Tailor a CV to match a specific job posting.
Rules:
- NEVER fabricate experience or skills the candidate doesn't have
- Only improve phrasing, ordering, and keyword usage
- Maintain factual accuracy
- Optimize for ATS scanning
- Keep the same JSON structure as the input CV
Respond with valid JSON only.`,
    user: (cvJson: string, jobAnalysis: string) => `Tailor this CV to better match the job requirements. Only improve phrasing and emphasis — do not add fake experience.

CV:
---
${cvJson}
---

Job Requirements:
---
${jobAnalysis}
---

Respond with:
{
  "tailoredCV": { <same CV JSON structure with improved content> },
  "changes": [
    {"section": "experience", "field": "bullets[0]", "before": "old text", "after": "new text"}
  ]
}`,
  },
} as const;
