"use client";

import type { Suggestion } from "@/lib/types/job";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

interface Props {
  suggestions: Suggestion[];
  onApply?: (suggestion: Suggestion) => void;
}

export default function Suggestions({ suggestions, onApply }: Props) {
  if (!suggestions.length) {
    return <p className="text-sm text-gray-500">No suggestions available.</p>;
  }

  return (
    <div className="space-y-3">
      {suggestions.map((s, i) => (
        <div key={i} className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Badge variant="info">{s.type}</Badge>
              <span className="text-xs text-gray-500">{s.section}</span>
            </div>
            {onApply && (
              <Button variant="ghost" size="sm" onClick={() => onApply(s)}>
                Apply
              </Button>
            )}
          </div>
          {s.original && (
            <div className="bg-red-50 p-2 rounded text-sm text-red-700 mb-2">
              {s.original}
            </div>
          )}
          <div className="bg-green-50 p-2 rounded text-sm text-green-700">
            {s.suggested}
          </div>
          <p className="text-xs text-gray-500 mt-2">{s.reason}</p>
        </div>
      ))}
    </div>
  );
}
