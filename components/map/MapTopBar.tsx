"use client";

import { Utensils, Hotel, Compass, Bus } from "lucide-react";

const categories = [
  { icon: Utensils, label: "Restaurants" },
  { icon: Hotel, label: "Hotels" },
  { icon: Compass, label: "Attractions" },
  { icon: Bus, label: "Transit" },
];

/**
 * MapTopBar - Top navigation bar with category pills and user menu
 */
export function MapTopBar() {
  return (
    <div className="absolute left-4 right-4 top-4 flex items-center gap-2 z-[1000]">
      {/* Spacer for search bar */}
      <div className="w-[360px]" />

      {/* Category Pills */}
      <div className="hidden lg:flex items-center gap-2 overflow-x-auto pointer-events-auto">
        {categories.map((category, index) => (
          <button
            key={index}
            className="flex items-center gap-2 whitespace-nowrap rounded-full bg-white/70 backdrop-blur-sm px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <category.icon className="h-4 w-4" />
            {category.label}
          </button>
        ))}
      </div>

      {/* Right side icons */}
      <div className="hidden sm:flex ml-auto items-center gap-2 pointer-events-auto">
        <button className="rounded-full bg-white p-2 shadow-lg hover:bg-gray-50">
          <svg
            className="h-5 w-5 text-gray-600"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <circle cx="5" cy="5" r="2" />
            <circle cx="12" cy="5" r="2" />
            <circle cx="19" cy="5" r="2" />
            <circle cx="5" cy="12" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="19" cy="12" r="2" />
            <circle cx="5" cy="19" r="2" />
            <circle cx="12" cy="19" r="2" />
            <circle cx="19" cy="19" r="2" />
          </svg>
        </button>
        <button className="rounded-full bg-white p-1 shadow-lg hover:bg-gray-50">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-green-400" />
        </button>
      </div>
    </div>
  );
}
