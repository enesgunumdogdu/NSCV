"use client";

import { useState } from "react";
import type { CV } from "@/lib/types/cv";
import PersonalInfoForm from "./PersonalInfoForm";
import SummaryEditor from "./SummaryEditor";
import ExperienceEditor from "./ExperienceEditor";
import EducationEditor from "./EducationEditor";
import ProjectsEditor from "./ProjectsEditor";
import SkillsEditor from "./SkillsEditor";
import Button from "@/components/ui/Button";

const SECTIONS = [
  "Personal Info",
  "Summary",
  "Experience",
  "Education",
  "Projects",
  "Skills",
] as const;

interface Props {
  cv: CV;
  onSave: (cv: CV) => void;
  saving?: boolean;
}

export default function CVEditor({ cv, onSave, saving }: Props) {
  const [data, setData] = useState<CV>(cv);
  const [activeSection, setActiveSection] = useState<string>("Personal Info");
  const [dirty, setDirty] = useState(false);

  const update = (partial: Partial<CV>) => {
    setData((prev) => ({ ...prev, ...partial }));
    setDirty(true);
  };

  const handleSave = () => {
    onSave(data);
    setDirty(false);
  };

  return (
    <div className="flex gap-6">
      {/* Section tabs */}
      <div className="w-48 space-y-1 shrink-0">
        {SECTIONS.map((section) => (
          <button
            key={section}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              activeSection === section
                ? "bg-brand-50 text-brand-700 font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setActiveSection(section)}
          >
            {section}
          </button>
        ))}
      </div>

      {/* Editor area */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-6">
          <div>
            <input
              className="text-xl font-bold bg-transparent border-none outline-none focus:ring-0 p-0"
              value={data.name}
              onChange={(e) => update({ name: e.target.value })}
              placeholder="CV Name"
            />
          </div>
          <Button onClick={handleSave} disabled={!dirty || saving}>
            {saving ? "Saving..." : dirty ? "Save Changes" : "Saved"}
          </Button>
        </div>

        {activeSection === "Personal Info" && (
          <PersonalInfoForm data={data.personalInfo} onChange={(personalInfo) => update({ personalInfo })} />
        )}
        {activeSection === "Summary" && (
          <SummaryEditor value={data.summary} onChange={(summary) => update({ summary })} />
        )}
        {activeSection === "Experience" && (
          <ExperienceEditor items={data.experience} onChange={(experience) => update({ experience })} />
        )}
        {activeSection === "Education" && (
          <EducationEditor items={data.education} onChange={(education) => update({ education })} />
        )}
        {activeSection === "Projects" && (
          <ProjectsEditor items={data.projects} onChange={(projects) => update({ projects })} />
        )}
        {activeSection === "Skills" && (
          <SkillsEditor skills={data.skills} onChange={(skills) => update({ skills })} />
        )}
      </div>
    </div>
  );
}
