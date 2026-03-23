export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  website?: string;
}

export interface Experience {
  id: string;
  company: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string | null; // null = present
  bullets: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  bullets?: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  bullets: string[];
}

export interface CV {
  id: string;
  name: string;
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  projects: Project[];
  skills: Record<string, string[]>; // category -> skills list
  createdAt: string;
  updatedAt: string;
}

export interface CVVersion {
  id: string;
  cvId: string;
  jobId: string | null;
  label: string;
  data: CV;
  createdAt: string;
}
