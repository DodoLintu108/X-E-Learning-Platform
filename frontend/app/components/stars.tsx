"use client";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { Star } from "lucide-react";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export default function Stars({
  rating,
  size = 25,
}: {
  rating: number;

  size?: number;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "3",
      }}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          size={size}
          key={star}
          className={cn(
            "text-amber-500 bg-transparent transition-all duration-300 ease-in-out",
            rating >= star ? "fill-amber-500" : "fill-transparent"
          )}
        ></Star>
      ))}
    </div>
  );
}


