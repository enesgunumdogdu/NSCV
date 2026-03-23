"use client";

import { v4 as uuid } from "uuid";
import type { Education } from "@/lib/types/cv";
import Button from "@/components/ui/Button";

interface Props {
  items: Education[];
  onChange: (items: Education[]) => void;
}

export default function EducationEditor({ items, onChange }: Props) {
  const addItem = () => {
    onChange([
      ...items,
      { id: uuid(), institution: "", degree: "", field: "", startDate: "", endDate: "" },
    ]);
  };

  const updateItem = (index: number, updates: Partial<Education>) => {
    onChange(items.map((item, i) => (i === index ? { ...item, ...updates } : item)));
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={item.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-start">
            <span className="text-xs font-medium text-gray-400">Education #{index + 1}</span>
            <Button variant="ghost" size="sm" onClick={() => removeItem(index)}>Remove</Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="label">Institution</label>
              <input className="input" value={item.institution} onChange={(e) => updateItem(index, { institution: e.target.value })} />
            </div>
            <div>
              <label className="label">Degree</label>
              <input className="input" value={item.degree} onChange={(e) => updateItem(index, { degree: e.target.value })} />
            </div>
            <div>
              <label className="label">Field of Study</label>
              <input className="input" value={item.field} onChange={(e) => updateItem(index, { field: e.target.value })} />
            </div>
            <div>
              <label className="label">Start</label>
              <input className="input" type="month" value={item.startDate} onChange={(e) => updateItem(index, { startDate: e.target.value })} />
            </div>
            <div>
              <label className="label">End</label>
              <input className="input" type="month" value={item.endDate} onChange={(e) => updateItem(index, { endDate: e.target.value })} />
            </div>
            <div>
              <label className="label">GPA (optional)</label>
              <input className="input" value={item.gpa || ""} onChange={(e) => updateItem(index, { gpa: e.target.value })} />
            </div>
          </div>
        </div>
      ))}
      <Button variant="secondary" onClick={addItem}>+ Add Education</Button>
    </div>
  );
}
