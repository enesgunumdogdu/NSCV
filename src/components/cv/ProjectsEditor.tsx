"use client";

import { v4 as uuid } from "uuid";
import type { Project } from "@/lib/types/cv";
import Button from "@/components/ui/Button";

interface Props {
  items: Project[];
  onChange: (items: Project[]) => void;
}

export default function ProjectsEditor({ items, onChange }: Props) {
  const addItem = () => {
    onChange([
      ...items,
      { id: uuid(), name: "", description: "", technologies: [], url: "", bullets: [""] },
    ]);
  };

  const updateItem = (index: number, updates: Partial<Project>) => {
    onChange(items.map((item, i) => (i === index ? { ...item, ...updates } : item)));
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const addBullet = (index: number) => {
    const updated = [...items];
    updated[index].bullets.push("");
    onChange(updated);
  };

  const updateBullet = (itemIndex: number, bulletIndex: number, value: string) => {
    const updated = [...items];
    updated[itemIndex].bullets[bulletIndex] = value;
    onChange(updated);
  };

  const removeBullet = (itemIndex: number, bulletIndex: number) => {
    const updated = [...items];
    updated[itemIndex].bullets.splice(bulletIndex, 1);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={item.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-start">
            <span className="text-xs font-medium text-gray-400">Project #{index + 1}</span>
            <Button variant="ghost" size="sm" onClick={() => removeItem(index)}>Remove</Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Project Name</label>
              <input className="input" value={item.name} onChange={(e) => updateItem(index, { name: e.target.value })} />
            </div>
            <div>
              <label className="label">URL (optional)</label>
              <input className="input" value={item.url || ""} onChange={(e) => updateItem(index, { url: e.target.value })} />
            </div>
            <div className="col-span-2">
              <label className="label">Description</label>
              <textarea className="textarea" rows={2} value={item.description} onChange={(e) => updateItem(index, { description: e.target.value })} />
            </div>
            <div className="col-span-2">
              <label className="label">Technologies (comma-separated)</label>
              <input
                className="input"
                value={item.technologies.join(", ")}
                onChange={(e) => updateItem(index, { technologies: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })}
              />
            </div>
          </div>
          <div>
            <label className="label">Bullet Points</label>
            <div className="space-y-2">
              {item.bullets.map((bullet, bi) => (
                <div key={bi} className="flex gap-2">
                  <span className="text-gray-400 mt-2 text-sm">&bull;</span>
                  <input className="input flex-1" value={bullet} onChange={(e) => updateBullet(index, bi, e.target.value)} />
                  <Button variant="ghost" size="sm" onClick={() => removeBullet(index, bi)}>&times;</Button>
                </div>
              ))}
              <Button variant="ghost" size="sm" onClick={() => addBullet(index)}>+ Add bullet</Button>
            </div>
          </div>
        </div>
      ))}
      <Button variant="secondary" onClick={addItem}>+ Add Project</Button>
    </div>
  );
}
