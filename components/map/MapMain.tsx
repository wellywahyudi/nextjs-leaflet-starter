"use client";

import {
  Utensils,
  Hotel,
  Compass,
  Bus,
  Layers,
  Navigation,
  Plus,
  Minus,
  Maximize2,
} from "lucide-react";
import { useState } from "react";
import { LeafletMap } from "./LeafletMap";
import { LeafletTileLayer } from "./LeafletTileLayer";
import { LeafletGeoJSON } from "./LeafletGeoJSON";
import { MapSearchBar } from "./MapSearchBar";
import { getDefaultTileProvider } from "@/constants/tile-providers";

const categories = [
  { icon: Utensils, label: "Restaurants" },
  { icon: Hotel, label: "Hotels" },
  { icon: Compass, label: "Attractions" },
  { icon: Bus, label: "Transit" },
];

/**
 * MapMain - Main map component with integrated search and controls
 */
export function MapMain() {
  const [selectedCountry, setSelectedCountry] =
    useState<GeoJSON.Feature | null>(null);
  const defaultProvider = getDefaultTileProvider();

  const handleCountrySelect = async (countryId: string) => {
    try {
      const response = await fetch(
        `/api/countries/${encodeURIComponent(countryId)}`
      );
      const feature = await response.json();
      setSelectedCountry(feature);
    } catch (error) {
      console.error("Error loading country GeoJSON:", error);
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Map */}
      <LeafletMap className="w-full h-full">
        <LeafletTileLayer
          url={defaultProvider.url}
          attribution={defaultProvider.attribution}
          maxZoom={defaultProvider.maxZoom}
        />
        <LeafletGeoJSON
          data={selectedCountry}
          style={{
            fillColor: "#3b82f6",
            fillOpacity: 0.2,
            color: "#2563eb",
            weight: 2,
          }}
        />
      </LeafletMap>

      {/* Search Bar - Always visible, handles own expand/collapse */}
      <MapSearchBar onCountrySelect={handleCountrySelect} />

      {/* Top Bar - Always visible */}
      <div className="absolute left-4 right-4 top-4 flex items-center gap-2 z-[1000] pointer-events-none">
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
        <div className="ml-auto flex items-center gap-2 pointer-events-auto">
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

      {/* Layers Panel - Bottom Left */}
      <div className="absolute bottom-8 left-4 flex flex-col items-center gap-1 z-[1000]">
        <button className="overflow-hidden rounded-lg bg-white shadow-lg hover:opacity-90 transition-opacity">
          <div className="h-12 w-14 bg-gradient-to-br from-green-600 to-green-800" />
        </button>
        <span className="rounded bg-white px-2 py-0.5 text-xs font-medium text-gray-700 shadow">
          <Layers className="inline h-3 w-3" />
        </span>
      </div>

      {/* Map Controls - Bottom Right */}
      <div className="absolute bottom-8 right-4 flex flex-col gap-2 z-[1000]">
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-50">
          <Plus className="h-5 w-5 text-gray-700" />
        </button>
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-50">
          <Minus className="h-5 w-5 text-gray-700" />
        </button>
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-50">
          <Navigation className="h-5 w-5 text-gray-700" />
        </button>
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-50">
          <Maximize2 className="h-5 w-5 text-gray-700" />
        </button>
      </div>
    </div>
  );
}
