"use client";

import Button from "@/components/ui/Button";
import { useState } from "react";

interface Props {
  skills: Record<string, string[]>;
  onChange: (skills: Record<string, string[]>) => void;
}

export default function SkillsEditor({ skills, onChange }: Props) {
  const [newCategory, setNewCategory] = useState("");

  const addCategory = () => {
    if (!newCategory.trim()) return;
    onChange({ ...skills, [newCategory.trim()]: [] });
    setNewCategory("");
  };

  const removeCategory = (category: string) => {
    const updated = { ...skills };
    delete updated[category];
    onChange(updated);
  };

  const updateSkills = (category: string, value: string) => {
    onChange({
      ...skills,
      [category]: value.split(",").map((s) => s.trim()).filter(Boolean),
    });
  };

  return (
    <div className="space-y-4">
      {Object.entries(skills).map(([category, skillList]) => (
        <div key={category} className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <label className="label mb-0">{category}</label>
            <Button variant="ghost" size="sm" onClick={() => removeCategory(category)}>
              Remove
            </Button>
          </div>
          <input
            className="input"
            value={skillList.join(", ")}
            onChange={(e) => updateSkills(category, e.target.value)}
            placeholder="Skill 1, Skill 2, Skill 3..."
          />
        </div>
      ))}
      <div className="flex gap-2">
        <input
          className="input flex-1"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New category name (e.g., Programming Languages)"
          onKeyDown={(e) => e.key === "Enter" && addCategory()}
        />
        <Button variant="secondary" onClick={addCategory}>
          Add Category
        </Button>
      </div>
    </div>
  );
}
