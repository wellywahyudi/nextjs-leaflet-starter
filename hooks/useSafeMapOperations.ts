'use client';

import { useCallback } from 'react';
import { useLeafletMap } from './useLeafletMap';
import type { LatLngBounds } from 'leaflet';

/**
 * Hook providing safe map operations with null checks and error handling
 * 
 * All operations are wrapped in try-catch and return success/failure status.
 * This prevents crashes from map operations when the map is not ready.
 * 
 * @returns Object with safe map operation functions
 */
export function useSafeMapOperations() {
  const map = useLeafletMap();

  /**
   * Safely get current zoom level
   */
  const getZoom = useCallback((defaultZoom: number = 13): number => {
    try {
      return map?.getZoom() ?? defaultZoom;
    } catch {
      return defaultZoom;
    }
  }, [map]);

  /**
   * Safely get current center
   */
  const getCenter = useCallback((defaultCenter: [number, number] = [0, 0]): [number, number] => {
    try {
      const center = map?.getCenter();
      if (center) {
        return [center.lat, center.lng];
      }
      return defaultCenter;
    } catch {
      return defaultCenter;
    }
  }, [map]);

  /**
   * Safely get current bounds
   */
  const getBounds = useCallback((): LatLngBounds | null => {
    try {
      return map?.getBounds() ?? null;
    } catch {
      return null;
    }
  }, [map]);

  /**
   * Safely set view
   */
  const setView = useCallback((center: [number, number], zoom: number): boolean => {
    try {
      if (!map) return false;
      map.setView(center, zoom);
      return true;
    } catch {
      return false;
    }
  }, [map]);

  /**
   * Safely fly to location
   */
  const flyTo = useCallback((center: [number, number], zoom: number): boolean => {
    try {
      if (!map) return false;
      map.flyTo(center, zoom);
      return true;
    } catch {
      return false;
    }
  }, [map]);

  /**
   * Safely fit bounds
   */
  const fitBounds = useCallback((bounds: LatLngBounds, options?: L.FitBoundsOptions): boolean => {
    try {
      if (!map || !bounds) return false;
      map.fitBounds(bounds, options);
      return true;
    } catch {
      return false;
    }
  }, [map]);

  /**
   * Safely zoom in
   */
  const zoomIn = useCallback((delta: number = 1): boolean => {
    try {
      if (!map) return false;
      map.zoomIn(delta);
      return true;
    } catch {
      return false;
    }
  }, [map]);

  /**
   * Safely zoom out
   */
  const zoomOut = useCallback((delta: number = 1): boolean => {
    try {
      if (!map) return false;
      map.zoomOut(delta);
      return true;
    } catch {
      return false;
    }
  }, [map]);

  /**
   * Safely invalidate size (useful after container resize)
   */
  const invalidateSize = useCallback((): boolean => {
    try {
      if (!map) return false;
      map.invalidateSize();
      return true;
    } catch {
      return false;
    }
  }, [map]);

  /**
   * Safely pan to location
   */
  const panTo = useCallback((center: [number, number]): boolean => {
    try {
      if (!map) return false;
      map.panTo(center);
      return true;
    } catch {
      return false;
    }
  }, [map]);

  return {
    map,
    isReady: !!map,
    getZoom,
    getCenter,
    getBounds,
    setView,
    flyTo,
    fitBounds,
    zoomIn,
    zoomOut,
    invalidateSize,
    panTo,
  };
}
