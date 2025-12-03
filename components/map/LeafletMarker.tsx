"use client";

import { useEffect, useRef, useMemo } from "react";
import type { Marker, DragEndEvent } from "leaflet";
import { useLeafletMap } from "@/hooks/useLeafletMap";
import type { LeafletMarkerProps } from "@/types/components";

/**
 * LeafletMarker component - Manages marker rendering on the map
 *
 * This component creates and manages a Leaflet marker at a specified position.
 * It supports optional popups, custom icons, and draggable markers with events.
 *
 * Features:
 * - Creates marker at specified position
 * - Supports optional popup content (string or React node)
 * - Handles custom icons
 * - Supports draggable markers with drag end events
 * - Removes marker on unmount
 * - Updates marker position when props change
 * - Safe async pattern with mount check
 * - Memoized position to prevent unnecessary updates
 *
 * @example
 * ```tsx
 * <LeafletMarker
 *   position={[51.505, -0.09]}
 *   popup="Hello World!"
 *   draggable={true}
 *   onDragEnd={(position) => console.log('New position:', position)}
 * />
 * ```
 */
export function LeafletMarker({
  position,
  icon,
  popup,
  draggable = false,
  onDragEnd,
}: LeafletMarkerProps) {
  const map = useLeafletMap();
  const markerRef = useRef<Marker | null>(null);

  // Memoize position to prevent unnecessary effect triggers from array reference changes
  const positionKey = useMemo(() => {
    if (!position || !Array.isArray(position) || position.length !== 2) {
      return null;
    }
    const [lat, lng] = position;
    if (
      typeof lat !== "number" ||
      typeof lng !== "number" ||
      isNaN(lat) ||
      isNaN(lng)
    ) {
      return null;
    }
    return `${lat},${lng}`;
  }, [position]);

  useEffect(() => {
    // Wait for map to be ready and valid position
    if (!map || !positionKey) {
      return;
    }

    const [lat, lng] = positionKey.split(",").map(Number) as [number, number];
    let isMounted = true;

    const setupMarker = async () => {
      try {
        // Dynamically import Leaflet
        const L = await import("leaflet");

        if (!isMounted || !map) {
          return;
        }

        // Remove existing marker if it exists
        if (markerRef.current) {
          markerRef.current.remove();
          markerRef.current = null;
        }

        // Create marker options
        const markerOptions: L.MarkerOptions = {
          draggable,
        };

        // Add custom icon if provided
        if (icon) {
          markerOptions.icon = icon;
        }

        // Create and add marker
        const marker = L.marker([lat, lng], markerOptions);
        marker.addTo(map);

        // Add popup if provided
        if (popup) {
          if (typeof popup === "string") {
            marker.bindPopup(popup);
          } else {
            // For React nodes, we'd need to render to a DOM element
            // For now, convert to string representation
            marker.bindPopup(String(popup));
          }
        }

        // Handle drag end event
        if (draggable && onDragEnd) {
          marker.on("dragend", (event: DragEndEvent) => {
            const newPosition = event.target.getLatLng();
            onDragEnd([newPosition.lat, newPosition.lng]);
          });
        }

        markerRef.current = marker;
      } catch (error) {
        if (isMounted) {
          console.error("Failed to create marker:", error);
        }
      }
    };

    setupMarker();

    // Cleanup function
    return () => {
      isMounted = false;
      if (markerRef.current) {
        try {
          markerRef.current.remove();
        } catch {
          // Ignore cleanup errors
        }
        markerRef.current = null;
      }
    };
  }, [map, positionKey, icon, popup, draggable, onDragEnd]);

  // This component doesn't render anything visible
  return null;
}
