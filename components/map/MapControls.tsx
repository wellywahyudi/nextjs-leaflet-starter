"use client";

import { Plus, Minus, Maximize2 } from "lucide-react";

/**
 * MapControls - Map control buttons at bottom right
 * Includes: Location, Zoom In/Out, Fullscreen
 */
export function MapControls() {
  return (
    <div className="absolute bottom-8 right-4 flex flex-col items-center gap-2 z-[1000]">
      {/* Location Button */}
      <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-50">
        <svg
          className="h-5 w-5 text-gray-600"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v4m0 12v4m10-10h-4M6 12H2" />
        </svg>
      </button>

      {/* Zoom Controls */}
      <div className="flex flex-col overflow-hidden rounded-lg bg-white shadow-lg">
        <button className="flex h-8 w-8 items-center justify-center border-b border-gray-200 hover:bg-gray-50">
          <Plus className="h-4 w-4 text-gray-600" />
        </button>
        <button className="flex h-8 w-8 items-center justify-center hover:bg-gray-50">
          <Minus className="h-4 w-4 text-gray-600" />
        </button>
      </div>

      {/* Fullscreen Button */}
      <button className="flex h-8 w-8 items-center justify-center rounded bg-white shadow-lg hover:bg-gray-50">
        <Maximize2 className="h-4 w-4 text-gray-600" />
      </button>
    </div>
  );
}
