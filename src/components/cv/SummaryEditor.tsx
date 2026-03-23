"use client";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function SummaryEditor({ value, onChange }: Props) {
  return (
    <div>
      <label className="label">Professional Summary</label>
      <textarea
        className="textarea"
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="A brief summary highlighting your key qualifications..."
      />
    </div>
  );
}
