"use client";

interface DiffViewProps {
  changes: { section: string; field: string; before: string; after: string }[];
}

export default function DiffView({ changes }: DiffViewProps) {
  if (!changes.length) {
    return <p className="text-sm text-gray-500">No changes</p>;
  }

  return (
    <div className="space-y-4">
      {changes.map((change, i) => (
        <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 text-xs font-medium text-gray-600">
            {change.section} &rarr; {change.field}
          </div>
          <div className="p-4 space-y-2">
            <div className="bg-red-50 border-l-4 border-red-300 p-3 text-sm">
              <span className="font-mono text-red-700">- </span>
              {change.before}
            </div>
            <div className="bg-green-50 border-l-4 border-green-300 p-3 text-sm">
              <span className="font-mono text-green-700">+ </span>
              {change.after}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
