"use client";

import { Layers } from "lucide-react";

/**
 * MapLayersPanel - Layer switcher panel at bottom left
 */
export function MapLayersPanel() {
  return (
    <div className="absolute bottom-8 left-4 flex flex-col items-center gap-1 z-[1000]">
      <button className="overflow-hidden rounded-lg bg-white shadow-lg hover:opacity-90 transition-opacity">
        <div className="h-12 w-14 bg-gradient-to-br from-green-600 to-green-800" />
      </button>
      <span className="rounded bg-white px-2 py-0.5 text-xs font-medium text-gray-700 shadow">
        <Layers className="inline h-3 w-3" />
      </span>
    </div>
  );
}
