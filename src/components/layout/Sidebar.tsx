"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: "+" },
  { href: "/cv", label: "My CV", icon: "D" },
  { href: "/jobs", label: "Job Postings", icon: "B" },
  { href: "/tailor", label: "Tailor & Analyze", icon: "A" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-brand-700">NSCV</h1>
        <p className="text-xs text-gray-500 mt-1">JobTailor AI</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              pathname === item.href
                ? "bg-brand-50 text-brand-700"
                : "text-gray-600 hover:bg-gray-100"
            )}
          >
            <span className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center text-xs font-bold">
              {item.icon}
            </span>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-200 text-xs text-gray-400">
        Local-first. Private. AI-powered.
      </div>
    </aside>
  );
}
