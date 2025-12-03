/**
 * Map utility functions for bounds calculation and map operations
 * Validates: Requirements 12.1
 * 
 * NOTE: This module is SSR-safe. Functions that need Leaflet use async imports.
 */

import type { LatLngBounds } from 'leaflet';

/**
 * Raw bounds data that can be used without Leaflet
 */
export interface RawBounds {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

/**
 * Calculates raw bounding box from an array of coordinates (SSR-safe)
 * @param coordinates - Array of [latitude, longitude] tuples
 * @returns Raw bounds object or null if array is empty
 */
export function calculateRawBounds(
  coordinates: [number, number][]
): RawBounds | null {
  if (coordinates.length === 0) {
    return null;
  }
  
  if (coordinates.length === 1) {
    const [lat, lng] = coordinates[0];
    const offset = 0.001;
    return {
      minLat: lat - offset,
      maxLat: lat + offset,
      minLng: lng - offset,
      maxLng: lng + offset,
    };
  }
  
  let minLat = coordinates[0][0];
  let maxLat = coordinates[0][0];
  let minLng = coordinates[0][1];
  let maxLng = coordinates[0][1];
  
  for (const [lat, lng] of coordinates) {
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
    if (lng < minLng) minLng = lng;
    if (lng > maxLng) maxLng = lng;
  }
  
  return { minLat, maxLat, minLng, maxLng };
}

/**
 * Calculates bounding box from an array of coordinates (async, client-only)
 * @param coordinates - Array of [latitude, longitude] tuples
 * @returns Promise of Leaflet LatLngBounds object or null if array is empty
 */
export async function calculateBounds(
  coordinates: [number, number][]
): Promise<LatLngBounds | null> {
  const rawBounds = calculateRawBounds(coordinates);
  if (!rawBounds) return null;
  
  const L = await import('leaflet');
  return L.latLngBounds(
    [rawBounds.minLat, rawBounds.minLng],
    [rawBounds.maxLat, rawBounds.maxLng]
  );
}

/**
 * Expands bounds by a percentage (async, client-only)
 * @param bounds - Original bounds
 * @param percentage - Percentage to expand (e.g., 0.1 for 10%)
 * @returns Promise of expanded bounds
 */
export async function expandBounds(
  bounds: LatLngBounds,
  percentage: number = 0.1
): Promise<LatLngBounds> {
  const L = await import('leaflet');
  const sw = bounds.getSouthWest();
  const ne = bounds.getNorthEast();
  
  const latDiff = (ne.lat - sw.lat) * percentage;
  const lngDiff = (ne.lng - sw.lng) * percentage;
  
  return L.latLngBounds(
    [sw.lat - latDiff, sw.lng - lngDiff],
    [ne.lat + latDiff, ne.lng + lngDiff]
  );
}

/**
 * Checks if a coordinate is within bounds
 * @param coord - [latitude, longitude] tuple
 * @param bounds - Leaflet LatLngBounds object
 * @returns True if coordinate is within bounds
 */
export function isCoordinateInBounds(
  coord: [number, number],
  bounds: LatLngBounds
): boolean {
  const [lat, lng] = coord;
  return bounds.contains([lat, lng]);
}

/**
 * Gets the center point of bounds
 * @param bounds - Leaflet LatLngBounds object
 * @returns Center coordinate as [latitude, longitude]
 */
export function getBoundsCenter(bounds: LatLngBounds): [number, number] {
  const center = bounds.getCenter();
  return [center.lat, center.lng];
}

/**
 * Calculates the area of bounds in square meters (async, client-only)
 * @param bounds - Leaflet LatLngBounds object
 * @returns Promise of area in square meters (approximate)
 */
export async function calculateBoundsArea(bounds: LatLngBounds): Promise<number> {
  const L = await import('leaflet');
  const sw = bounds.getSouthWest();
  const ne = bounds.getNorthEast();
  const nw = L.latLng(ne.lat, sw.lng);
  const se = L.latLng(sw.lat, ne.lng);
  
  // Calculate width and height using Haversine formula
  const width = sw.distanceTo(se);
  const height = sw.distanceTo(nw);
  
  return width * height;
}

/**
 * Safe Leaflet access helpers
 * Validates: Requirements 12.4
 */

import type { Map as LeafletMap, Marker, TileLayer } from 'leaflet';

/**
 * Safely gets the current zoom level from a map instance
 * @param map - Leaflet map instance
 * @param defaultZoom - Default value if map is null/undefined
 * @returns Current zoom level or default
 */
export function safeGetZoom(map: LeafletMap | null | undefined, defaultZoom: number = 13): number {
  try {
    return map?.getZoom() ?? defaultZoom;
  } catch {
    return defaultZoom;
  }
}

/**
 * Safely gets the current center from a map instance
 * @param map - Leaflet map instance
 * @param defaultCenter - Default value if map is null/undefined
 * @returns Current center as [lat, lng] or default
 */
export function safeGetCenter(
  map: LeafletMap | null | undefined,
  defaultCenter: [number, number] = [51.505, -0.09]
): [number, number] {
  try {
    const center = map?.getCenter();
    if (center) {
      return [center.lat, center.lng];
    }
    return defaultCenter;
  } catch {
    return defaultCenter;
  }
}

/**
 * Safely gets the current bounds from a map instance
 * @param map - Leaflet map instance
 * @returns Current bounds or null
 */
export function safeGetBounds(map: LeafletMap | null | undefined) {
  try {
    return map?.getBounds() ?? null;
  } catch {
    return null;
  }
}

/**
 * Safely sets the view on a map instance
 * @param map - Leaflet map instance
 * @param center - Center coordinate
 * @param zoom - Zoom level
 * @returns True if successful
 */
export function safeSetView(
  map: LeafletMap | null | undefined,
  center: [number, number],
  zoom: number
): boolean {
  try {
    if (!map) return false;
    map.setView(center, zoom);
    return true;
  } catch {
    return false;
  }
}

/**
 * Safely flies to a location on a map instance
 * @param map - Leaflet map instance
 * @param center - Center coordinate
 * @param zoom - Zoom level
 * @returns True if successful
 */
export function safeFlyTo(
  map: LeafletMap | null | undefined,
  center: [number, number],
  zoom: number
): boolean {
  try {
    if (!map) return false;
    map.flyTo(center, zoom);
    return true;
  } catch {
    return false;
  }
}

/**
 * Safely zooms in on a map instance
 * @param map - Leaflet map instance
 * @param delta - Zoom delta (default: 1)
 * @returns True if successful
 */
export function safeZoomIn(
  map: LeafletMap | null | undefined,
  delta: number = 1
): boolean {
  try {
    if (!map) return false;
    map.zoomIn(delta);
    return true;
  } catch {
    return false;
  }
}

/**
 * Safely zooms out on a map instance
 * @param map - Leaflet map instance
 * @param delta - Zoom delta (default: 1)
 * @returns True if successful
 */
export function safeZoomOut(
  map: LeafletMap | null | undefined,
  delta: number = 1
): boolean {
  try {
    if (!map) return false;
    map.zoomOut(delta);
    return true;
  } catch {
    return false;
  }
}

/**
 * Safely gets the position of a marker
 * @param marker - Leaflet marker instance
 * @param defaultPosition - Default position if marker is null/undefined
 * @returns Marker position as [lat, lng] or default
 */
export function safeGetMarkerPosition(
  marker: Marker | null | undefined,
  defaultPosition: [number, number] = [0, 0]
): [number, number] {
  try {
    const latLng = marker?.getLatLng();
    if (latLng) {
      return [latLng.lat, latLng.lng];
    }
    return defaultPosition;
  } catch {
    return defaultPosition;
  }
}

/**
 * Safely sets the position of a marker
 * @param marker - Leaflet marker instance
 * @param position - New position
 * @returns True if successful
 */
export function safeSetMarkerPosition(
  marker: Marker | null | undefined,
  position: [number, number]
): boolean {
  try {
    if (!marker) return false;
    marker.setLatLng(position);
    return true;
  } catch {
    return false;
  }
}

/**
 * Safely removes a layer from a map
 * @param map - Leaflet map instance
 * @param layer - Layer to remove
 * @returns True if successful
 */
export function safeRemoveLayer(
  map: LeafletMap | null | undefined,
  layer: TileLayer | Marker | null | undefined
): boolean {
  try {
    if (!map || !layer) return false;
    map.removeLayer(layer);
    return true;
  } catch {
    return false;
  }
}

/**
 * Safely adds a layer to a map
 * @param map - Leaflet map instance
 * @param layer - Layer to add
 * @returns True if successful
 */
export function safeAddLayer(
  map: LeafletMap | null | undefined,
  layer: TileLayer | Marker | null | undefined
): boolean {
  try {
    if (!map || !layer) return false;
    map.addLayer(layer);
    return true;
  } catch {
    return false;
  }
}

/**
 * Safely checks if a map has a specific layer
 * @param map - Leaflet map instance
 * @param layer - Layer to check
 * @returns True if map has the layer
 */
export function safeHasLayer(
  map: LeafletMap | null | undefined,
  layer: TileLayer | Marker | null | undefined
): boolean {
  try {
    if (!map || !layer) return false;
    return map.hasLayer(layer);
  } catch {
    return false;
  }
}

/**
 * Safely invalidates the map size (useful after container resize)
 * @param map - Leaflet map instance
 * @returns True if successful
 */
export function safeInvalidateSize(map: LeafletMap | null | undefined): boolean {
  try {
    if (!map) return false;
    map.invalidateSize();
    return true;
  } catch {
    return false;
  }
}

/**
 * Safely fits the map to bounds
 * @param map - Leaflet map instance
 * @param bounds - Bounds to fit
 * @returns True if successful
 */
export function safeFitBounds(
  map: LeafletMap | null | undefined,
  bounds: L.LatLngBounds | null | undefined
): boolean {
  try {
    if (!map || !bounds) return false;
    map.fitBounds(bounds);
    return true;
  } catch {
    return false;
  }
}
