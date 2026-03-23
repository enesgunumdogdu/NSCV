"use client";

import type { CV } from "@/lib/types/cv";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

interface Props {
  cv: CV;
}

export default function TailoredPreview({ cv }: Props) {
  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-xl font-bold">{cv.personalInfo.fullName}</h2>
        <p className="text-sm text-gray-500">
          {[cv.personalInfo.email, cv.personalInfo.phone, cv.personalInfo.location]
            .filter(Boolean)
            .join(" | ")}
        </p>
        {cv.personalInfo.linkedin && (
          <p className="text-sm text-gray-500">{cv.personalInfo.linkedin}</p>
        )}
      </Card>

      {cv.summary && (
        <Card>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Summary</h3>
          <p className="text-sm text-gray-600">{cv.summary}</p>
        </Card>
      )}

      {cv.experience.length > 0 && (
        <Card>
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Experience</h3>
          <div className="space-y-4">
            {cv.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium text-sm">{exp.title}</p>
                    <p className="text-sm text-gray-500">{exp.company} — {exp.location}</p>
                  </div>
                  <p className="text-xs text-gray-400">
                    {exp.startDate} — {exp.endDate || "Present"}
                  </p>
                </div>
                <ul className="mt-2 space-y-1">
                  {exp.bullets.map((b, i) => (
                    <li key={i} className="text-sm text-gray-600 pl-4 relative before:content-['•'] before:absolute before:left-0">
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Card>
      )}

      {Object.keys(cv.skills).length > 0 && (
        <Card>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Skills</h3>
          <div className="space-y-2">
            {Object.entries(cv.skills).map(([cat, skills]) => (
              <div key={cat}>
                <span className="text-xs font-medium text-gray-500">{cat}: </span>
                {skills.map((s, i) => (
                  <Badge key={i} className="mr-1 mb-1">{s}</Badge>
                ))}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
