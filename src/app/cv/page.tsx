"use client";

import { useCV } from "@/hooks/useCV";
import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import CVEditor from "@/components/cv/CVEditor";

export default function CVPage() {
  const { cvList, currentCV, loading, fetchCV, createCV, updateCV, deleteCV } = useCV();

  const handleCreate = async () => {
    const cv = await createCV({ name: "New CV" });
    fetchCV(cv.id);
  };

  return (
    <div>
      <Header title="My CVs" subtitle="Create and manage your curriculum vitae" />

      <div className="flex gap-6">
        {/* CV List */}
        <div className="w-64 shrink-0 space-y-2">
          <Button onClick={handleCreate} className="w-full">+ New CV</Button>
          {cvList.map((cv) => (
            <Card
              key={cv.id}
              className={`cursor-pointer transition-colors ${
                currentCV?.id === cv.id ? "ring-2 ring-brand-500" : "hover:bg-gray-50"
              }`}
              onClick={() => fetchCV(cv.id)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium">{cv.name}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(cv.updated_at).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteCV(cv.id);
                  }}
                >
                  &times;
                </Button>
              </div>
            </Card>
          ))}
          {cvList.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-8">
              No CVs yet. Create one to get started.
            </p>
          )}
        </div>

        {/* Editor */}
        <div className="flex-1">
          {loading && <p className="text-sm text-gray-500">Loading...</p>}
          {!loading && currentCV && (
            <Card>
              <CVEditor cv={currentCV} onSave={updateCV} />
            </Card>
          )}
          {!loading && !currentCV && (
            <Card className="text-center py-16">
              <p className="text-gray-400">Select a CV or create a new one</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
