"use client";

import { useEffect, useRef, useMemo } from "react";
import { useLeafletMap } from "@/hooks/useLeafletMap";
import type { GeoJSON as GeoJSONType } from "leaflet";

interface GeoJSONStyle {
  fillColor?: string;
  fillOpacity?: number;
  color?: string;
  weight?: number;
}

interface LeafletGeoJSONProps {
  data: GeoJSON.Feature | null;
  style?: GeoJSONStyle;
}

// Default style values
const DEFAULT_STYLE: Required<GeoJSONStyle> = {
  fillColor: "#3b82f6",
  fillOpacity: 0.2,
  color: "#2563eb",
  weight: 2,
};

/**
 * LeafletGeoJSON component - Renders GeoJSON features on the map
 *
 * Features:
 * - Renders GeoJSON polygons/multipolygons
 * - Customizable styling with memoized style object
 * - Automatic cleanup on unmount
 * - Fits bounds to feature
 * - Safe async pattern with mount check
 */
export function LeafletGeoJSON({ data, style }: LeafletGeoJSONProps) {
  const map = useLeafletMap();
  const layerRef = useRef<GeoJSONType | null>(null);

  // Memoize style to prevent unnecessary effect triggers
  // Only re-compute when actual style values change
  const memoizedStyle = useMemo(
    () => ({
      fillColor: style?.fillColor ?? DEFAULT_STYLE.fillColor,
      fillOpacity: style?.fillOpacity ?? DEFAULT_STYLE.fillOpacity,
      color: style?.color ?? DEFAULT_STYLE.color,
      weight: style?.weight ?? DEFAULT_STYLE.weight,
    }),
    [style?.fillColor, style?.fillOpacity, style?.color, style?.weight]
  );

  useEffect(() => {
    if (!map) return;

    // If no data, just clean up existing layer
    if (!data) {
      if (layerRef.current) {
        layerRef.current.remove();
        layerRef.current = null;
      }
      return;
    }

    let isMounted = true;

    const setupGeoJSON = async () => {
      try {
        // Dynamically import Leaflet
        const L = await import("leaflet");

        if (!isMounted || !map) return;

        // Remove existing layer
        if (layerRef.current) {
          layerRef.current.remove();
          layerRef.current = null;
        }

        // Create GeoJSON layer with memoized style
        const geoJSONLayer = L.geoJSON(data, {
          style: memoizedStyle,
        });

        // Add to map
        geoJSONLayer.addTo(map);
        layerRef.current = geoJSONLayer;

        // Fit bounds to feature with padding
        const bounds = geoJSONLayer.getBounds();
        if (bounds.isValid()) {
          map.flyToBounds(bounds, {
            padding: [50, 50],
            duration: 1.5,
            easeLinearity: 0.25,
          });
        }
      } catch (error) {
        if (isMounted) {
          console.error("Failed to render GeoJSON:", error);
        }
      }
    };

    setupGeoJSON();

    // Cleanup
    return () => {
      isMounted = false;
      if (layerRef.current) {
        try {
          layerRef.current.remove();
        } catch {
          // Ignore cleanup errors
        }
        layerRef.current = null;
      }
    };
  }, [map, data, memoizedStyle]);

  return null;
}
