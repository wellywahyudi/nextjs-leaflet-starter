"use client";

import { useState } from "react";
import { LeafletMap } from "./LeafletMap";
import { LeafletTileLayer } from "./LeafletTileLayer";
import { LeafletGeoJSON } from "./LeafletGeoJSON";
import { MapSearchBar } from "./MapSearchBar";
import { MapTopBar } from "./MapTopBar";
import { MapLayersPanel } from "./MapLayersPanel";
import { MapControls } from "./MapControls";
import { getDefaultTileProvider } from "@/constants/tile-providers";

/**
 * MapMain - Main map component
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

      {/* Search Bar */}
      <MapSearchBar onCountrySelect={handleCountrySelect} />

      {/* Top Bar */}
      <MapTopBar />

      {/* Layers Panel */}
      <MapLayersPanel />

      {/* Map Controls */}
      <MapControls />
    </div>
  );
}
