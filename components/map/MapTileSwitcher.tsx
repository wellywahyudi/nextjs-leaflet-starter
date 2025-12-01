"use client";

import { useState } from "react";
import Image from "next/image";
import { TILE_PROVIDERS } from "@/constants/tile-providers";

interface MapTileSwitcherProps {
  selectedProviderId: string;
  onProviderChange: (providerId: string) => void;
}

/**
 * MapTileSwitcher - Tile layer switcher UI
 */
export function MapTileSwitcher({
  selectedProviderId,
  onProviderChange,
}: MapTileSwitcherProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Map tile providers to display options with PNG previews
  const layerOptions = [
    {
      id: "osm",
      label: "Basic",
      image: "/map-basic.png",
      provider: TILE_PROVIDERS.find((p) => p.id === "osm"),
    },
    {
      id: "satellite",
      label: "Satellite",
      image: "/map-satellite.png",
      provider: TILE_PROVIDERS.find((p) => p.id === "satellite"),
    },
    {
      id: "dark",
      label: "Dark",
      image: "/map-dark.png",
      provider: TILE_PROVIDERS.find((p) => p.id === "dark"),
    },
  ];

  const selectedLayer =
    layerOptions.find((layer) => layer.id === selectedProviderId) ||
    layerOptions[0];

  return (
    <div
      className="absolute bottom-24 sm:bottom-8 left-4 flex flex-col sm:flex-row items-start sm:items-center gap-2 z-[1000]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slide-out Panel - Above on mobile, Right on desktop */}
      <div
        className={`order-first sm:order-last flex items-center gap-2 transition-all duration-300 ease-out ${
          isHovered
            ? "opacity-100 translate-y-0 sm:translate-y-0 sm:translate-x-0"
            : "opacity-0 translate-y-4 sm:translate-y-0 sm:-translate-x-4 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-1 border border-gray-200 dark:border-gray-700">
          {layerOptions.map((layer) => (
            <button
              key={layer.id}
              onClick={() => layer.provider && onProviderChange(layer.id)}
              disabled={!layer.provider}
              className={`flex flex-col items-center gap-1.5 px-2 sm:px-3 py-2 rounded-xl transition-all ${
                selectedProviderId === layer.id
                  ? "bg-blue-50 dark:bg-blue-900/30 ring-2 ring-blue-500 dark:ring-blue-400"
                  : "hover:bg-gray-50 dark:hover:bg-gray-700"
              } ${!layer.provider ? "opacity-50 cursor-not-allowed" : ""}`}
              title={layer.label}
            >
              <div className="relative h-10 w-10 sm:h-12 sm:w-12 rounded-lg overflow-hidden shadow-sm">
                <Image
                  src={layer.image}
                  alt={`${layer.label} map preview`}
                  fill
                  sizes="(max-width: 640px) 40px, 48px"
                  className="object-cover"
                />
              </div>
              <span className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">
                {layer.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Tile Button */}
      <div className="flex flex-col items-center gap-1">
        <button
          className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all"
          aria-label="Tile layer options"
        >
          <div className="relative h-16 w-16 sm:h-18 sm:w-20">
            <Image
              src={selectedLayer.image}
              alt={`${selectedLayer.label} map preview`}
              fill
              sizes="(max-width: 640px) 64px, 80px"
              className="object-cover"
            />
          </div>
          <span className="block bg-white dark:bg-gray-800 px-2 py-1 text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">
            {selectedLayer.label}
          </span>
        </button>
      </div>
    </div>
  );
}
