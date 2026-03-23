"use client";

import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

export default function Card({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("bg-white rounded-xl border border-gray-200 p-6 shadow-sm", className)}
      {...props}
    >
      {children}
    </div>
  );
}
