export interface JobPosting {
  id: string;
  title: string;
  company: string;
  rawText: string;
  analysis: JobAnalysis | null;
  createdAt: string;
}

export interface JobAnalysis {
  requiredSkills: string[];
  preferredSkills: string[];
  requiredExperience: string[];
  keywords: string[];
  hiddenExpectations: string[];
  seniorityLevel: string;
  summary: string;
}

export interface GapAnalysisResult {
  missingSkills: string[];
  weakBullets: { original: string; reason: string }[];
  irrelevantContent: { section: string; content: string; reason: string }[];
  keywordGaps: string[];
  matchScore: number; // 0-100
  strengths: string[];
  suggestions: Suggestion[];
}

export interface Suggestion {
  section: string;
  type: 'rewrite' | 'add' | 'remove' | 'reorder';
  original?: string;
  suggested: string;
  reason: string;
}

export interface TailorResult {
  tailoredCV: import('./cv').CV;
  changes: {
    section: string;
    field: string;
    before: string;
    after: string;
  }[];
}
