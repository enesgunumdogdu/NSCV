"use client";

import type { JobAnalysis as JobAnalysisType } from "@/lib/types/job";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";

interface Props {
  analysis: JobAnalysisType;
}

export default function JobAnalysis({ analysis }: Props) {
  return (
    <div className="space-y-6">
      <Card>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Summary</h3>
        <p className="text-sm text-gray-600">{analysis.summary}</p>
        <div className="mt-2">
          <Badge variant="info">{analysis.seniorityLevel}</Badge>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Required Skills</h3>
          <div className="flex flex-wrap gap-2">
            {analysis.requiredSkills.map((skill, i) => (
              <Badge key={i} variant="danger">{skill}</Badge>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Preferred Skills</h3>
          <div className="flex flex-wrap gap-2">
            {analysis.preferredSkills.map((skill, i) => (
              <Badge key={i} variant="warning">{skill}</Badge>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">ATS Keywords</h3>
        <div className="flex flex-wrap gap-2">
          {analysis.keywords.map((kw, i) => (
            <Badge key={i} variant="info">{kw}</Badge>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Required Experience</h3>
        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
          {analysis.requiredExperience.map((exp, i) => (
            <li key={i}>{exp}</li>
          ))}
        </ul>
      </Card>

      {analysis.hiddenExpectations.length > 0 && (
        <Card>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Hidden Expectations (Inferred)</h3>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            {analysis.hiddenExpectations.map((exp, i) => (
              <li key={i}>{exp}</li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
