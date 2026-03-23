"use client";

import type { GapAnalysisResult } from "@/lib/types/job";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";

interface Props {
  data: GapAnalysisResult;
}

export default function GapAnalysis({ data }: Props) {
  const scoreColor = data.matchScore >= 70 ? "success" : data.matchScore >= 40 ? "warning" : "danger";

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700">Match Score</h3>
          <div className="text-3xl font-bold">
            <Badge variant={scoreColor} className="text-lg px-4 py-2">
              {data.matchScore}%
            </Badge>
          </div>
        </div>
      </Card>

      {data.strengths.length > 0 && (
        <Card>
          <h3 className="text-sm font-semibold text-green-700 mb-3">Strengths</h3>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            {data.strengths.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </Card>
      )}

      {data.missingSkills.length > 0 && (
        <Card>
          <h3 className="text-sm font-semibold text-red-700 mb-3">Missing Skills</h3>
          <div className="flex flex-wrap gap-2">
            {data.missingSkills.map((skill, i) => (
              <Badge key={i} variant="danger">{skill}</Badge>
            ))}
          </div>
        </Card>
      )}

      {data.keywordGaps.length > 0 && (
        <Card>
          <h3 className="text-sm font-semibold text-yellow-700 mb-3">Keyword Gaps</h3>
          <div className="flex flex-wrap gap-2">
            {data.keywordGaps.map((kw, i) => (
              <Badge key={i} variant="warning">{kw}</Badge>
            ))}
          </div>
        </Card>
      )}

      {data.weakBullets.length > 0 && (
        <Card>
          <h3 className="text-sm font-semibold text-orange-700 mb-3">Weak Bullet Points</h3>
          <div className="space-y-3">
            {data.weakBullets.map((b, i) => (
              <div key={i} className="border-l-4 border-orange-300 pl-3">
                <p className="text-sm text-gray-800">&ldquo;{b.original}&rdquo;</p>
                <p className="text-xs text-gray-500 mt-1">{b.reason}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {data.suggestions.length > 0 && (
        <Card>
          <h3 className="text-sm font-semibold text-brand-700 mb-3">Suggestions</h3>
          <div className="space-y-3">
            {data.suggestions.map((s, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="info">{s.type}</Badge>
                  <span className="text-xs text-gray-500">{s.section}</span>
                </div>
                {s.original && (
                  <p className="text-sm text-red-600 line-through mb-1">{s.original}</p>
                )}
                <p className="text-sm text-green-700">{s.suggested}</p>
                <p className="text-xs text-gray-500 mt-1">{s.reason}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
