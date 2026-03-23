"use client";

import { v4 as uuid } from "uuid";
import type { Experience } from "@/lib/types/cv";
import Button from "@/components/ui/Button";

interface Props {
  items: Experience[];
  onChange: (items: Experience[]) => void;
}

export default function ExperienceEditor({ items, onChange }: Props) {
  const addItem = () => {
    onChange([
      ...items,
      {
        id: uuid(),
        company: "",
        title: "",
        location: "",
        startDate: "",
        endDate: null,
        bullets: [""],
      },
    ]);
  };

  const updateItem = (index: number, updates: Partial<Experience>) => {
    const updated = items.map((item, i) => (i === index ? { ...item, ...updates } : item));
    onChange(updated);
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
    <div className="space-y-6">
      {items.map((item, index) => (
        <div key={item.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-start">
            <span className="text-xs font-medium text-gray-400">Experience #{index + 1}</span>
            <Button variant="ghost" size="sm" onClick={() => removeItem(index)}>
              Remove
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Job Title</label>
              <input className="input" value={item.title} onChange={(e) => updateItem(index, { title: e.target.value })} />
            </div>
            <div>
              <label className="label">Company</label>
              <input className="input" value={item.company} onChange={(e) => updateItem(index, { company: e.target.value })} />
            </div>
            <div>
              <label className="label">Location</label>
              <input className="input" value={item.location} onChange={(e) => updateItem(index, { location: e.target.value })} />
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="label">Start</label>
                <input className="input" type="month" value={item.startDate} onChange={(e) => updateItem(index, { startDate: e.target.value })} />
              </div>
              <div className="flex-1">
                <label className="label">End</label>
                <input
                  className="input"
                  type="month"
                  value={item.endDate || ""}
                  onChange={(e) => updateItem(index, { endDate: e.target.value || null })}
                  placeholder="Present"
                />
              </div>
            </div>
          </div>
          <div>
            <label className="label">Bullet Points</label>
            <div className="space-y-2">
              {item.bullets.map((bullet, bi) => (
                <div key={bi} className="flex gap-2">
                  <span className="text-gray-400 mt-2 text-sm">&bull;</span>
                  <input
                    className="input flex-1"
                    value={bullet}
                    onChange={(e) => updateBullet(index, bi, e.target.value)}
                    placeholder="Describe an achievement or responsibility..."
                  />
                  <Button variant="ghost" size="sm" onClick={() => removeBullet(index, bi)}>
                    &times;
                  </Button>
                </div>
              ))}
              <Button variant="ghost" size="sm" onClick={() => addBullet(index)}>
                + Add bullet
              </Button>
            </div>
          </div>
        </div>
      ))}
      <Button variant="secondary" onClick={addItem}>
        + Add Experience
      </Button>
    </div>
  );
}
