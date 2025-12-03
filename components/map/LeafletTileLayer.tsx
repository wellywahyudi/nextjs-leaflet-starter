"use client";

import { useEffect, useRef, useMemo } from "react";
import type { TileLayer } from "leaflet";
import { useLeafletMap } from "@/hooks/useLeafletMap";
import type { LeafletTileLayerProps } from "@/types/components";

// Default subdomains - defined outside component to maintain referential stability
const DEFAULT_SUBDOMAINS = ["a", "b", "c"];

/**
 * LeafletTileLayer component - Manages tile layer rendering
 *
 * This component adds a tile layer to the Leaflet map. It handles
 * tile layer updates when the URL changes and cleanup on unmount.
 *
 * Features:
 * - Adds tile layer to map on mount
 * - Updates tile layer when URL changes
 * - Removes tile layer on unmount
 * - Supports custom attribution and zoom levels
 * - Handles subdomains for load balancing
 * - Prevents infinite loops from array prop changes
 * - Uses AbortController pattern for safe async cleanup
 *
 * @example
 * ```tsx
 * <LeafletTileLayer
 *   url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
 *   attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
 *   maxZoom={19}
 * />
 * ```
 */
export function LeafletTileLayer({
  url,
  attribution = "",
  maxZoom = 19,
  subdomains = DEFAULT_SUBDOMAINS,
}: LeafletTileLayerProps) {
  const map = useLeafletMap();
  const tileLayerRef = useRef<TileLayer | null>(null);

  // Memoize subdomains to prevent infinite loops from array reference changes
  const subdomainsKey = useMemo(() => subdomains.join(","), [subdomains]);

  useEffect(() => {
    // Wait for map to be ready
    if (!map) {
      return;
    }

    // Validate tile URL
    if (!url || typeof url !== "string") {
      console.error("Invalid tile layer URL:", url);
      return;
    }

    let isMounted = true;

    const setupTileLayer = async () => {
      try {
        // Dynamically import Leaflet
        const L = await import("leaflet");

        if (!isMounted || !map) {
          return;
        }

        // Remove existing tile layer if it exists
        if (tileLayerRef.current) {
          try {
            tileLayerRef.current.remove();
          } catch {
            // Ignore removal errors
          }
          tileLayerRef.current = null;
        }

        // Parse subdomains from memoized key
        const subdomainsList = subdomainsKey.split(",");

        // Create and add new tile layer
        const tileLayer = L.tileLayer(url, {
          attribution,
          maxZoom,
          subdomains: subdomainsList,
        });

        // Add error handling for tile loading
        tileLayer.on("tileerror", (error) => {
          console.error("Tile loading error:", error);
        });

        tileLayer.addTo(map);
        tileLayerRef.current = tileLayer;
      } catch (error) {
        if (isMounted) {
          console.error("Failed to add tile layer:", error);
        }
      }
    };

    setupTileLayer();

    // Cleanup function
    return () => {
      isMounted = false;
      if (tileLayerRef.current) {
        try {
          tileLayerRef.current.remove();
          tileLayerRef.current = null;
        } catch (error) {
          console.error("Error removing tile layer:", error);
        }
      }
    };
  }, [map, url, attribution, maxZoom, subdomainsKey]);

  // This component doesn't render anything visible
  return null;
}
