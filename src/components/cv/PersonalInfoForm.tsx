"use client";

import type { PersonalInfo } from "@/lib/types/cv";

interface Props {
  data: PersonalInfo;
  onChange: (data: PersonalInfo) => void;
}

export default function PersonalInfoForm({ data, onChange }: Props) {
  const update = (field: keyof PersonalInfo, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2">
        <label className="label">Full Name</label>
        <input className="input" value={data.fullName} onChange={(e) => update("fullName", e.target.value)} />
      </div>
      <div>
        <label className="label">Email</label>
        <input className="input" type="email" value={data.email} onChange={(e) => update("email", e.target.value)} />
      </div>
      <div>
        <label className="label">Phone</label>
        <input className="input" value={data.phone} onChange={(e) => update("phone", e.target.value)} />
      </div>
      <div>
        <label className="label">Location</label>
        <input className="input" value={data.location} onChange={(e) => update("location", e.target.value)} />
      </div>
      <div>
        <label className="label">LinkedIn</label>
        <input className="input" value={data.linkedin || ""} onChange={(e) => update("linkedin", e.target.value)} />
      </div>
      <div>
        <label className="label">GitHub</label>
        <input className="input" value={data.github || ""} onChange={(e) => update("github", e.target.value)} />
      </div>
      <div>
        <label className="label">Website</label>
        <input className="input" value={data.website || ""} onChange={(e) => update("website", e.target.value)} />
      </div>
    </div>
  );
}
