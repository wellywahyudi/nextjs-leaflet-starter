'use client';

import { useState, useCallback, useRef } from 'react';
import { useLeafletMap } from './useLeafletMap';
import type { LatLng } from 'leaflet';

export type MeasurementMode = 'distance' | 'area' | null;

interface MeasurementPoint {
  latlng: LatLng;
  marker?: L.CircleMarker;
}

type L = typeof import('leaflet');

/**
 * Hook for map measurement functionality
 * Supports distance and area measurements
 * 
 * @returns Object with measurement functions and state
 */
export function useMeasurement() {
  const map = useLeafletMap();
  const [mode, setMode] = useState<MeasurementMode>(null);
  const [points, setPoints] = useState<MeasurementPoint[]>([]);
  const [distance, setDistance] = useState<number>(0);
  const [area, setArea] = useState<number>(0);
  const polylineRef = useRef<L.Polyline | null>(null);
  const polygonRef = useRef<L.Polygon | null>(null);
  const markersRef = useRef<L.CircleMarker[]>([]);

  /**
   * Calculate distance between two points using Haversine formula
   */
  const calculateDistance = useCallback((latlng1: LatLng, latlng2: LatLng): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (latlng1.lat * Math.PI) / 180;
    const φ2 = (latlng2.lat * Math.PI) / 180;
    const Δφ = ((latlng2.lat - latlng1.lat) * Math.PI) / 180;
    const Δλ = ((latlng2.lng - latlng1.lng) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }, []);

  /**
   * Calculate total distance for all points
   */
  const calculateTotalDistance = useCallback((pts: MeasurementPoint[]): number => {
    let total = 0;
    for (let i = 0; i < pts.length - 1; i++) {
      total += calculateDistance(pts[i].latlng, pts[i + 1].latlng);
    }
    return total;
  }, [calculateDistance]);

  /**
   * Calculate area using Shoelace formula
   */
  const calculateArea = useCallback((pts: MeasurementPoint[]): number => {
    if (pts.length < 3) return 0;

    const R = 6371e3; // Earth's radius in meters
    let area = 0;

    for (let i = 0; i < pts.length; i++) {
      const j = (i + 1) % pts.length;
      const xi = pts[i].latlng.lng * Math.PI / 180;
      const yi = pts[i].latlng.lat * Math.PI / 180;
      const xj = pts[j].latlng.lng * Math.PI / 180;
      const yj = pts[j].latlng.lat * Math.PI / 180;

      area += xi * Math.sin(yj) - xj * Math.sin(yi);
    }

    area = Math.abs(area * R * R / 2);
    return area;
  }, []);

  /**
   * Start measurement mode
   */
  const startMeasurement = useCallback(async (measurementMode: MeasurementMode) => {
    if (!map || !measurementMode) return;

    // Clear previous measurement
    clearMeasurement();

    setMode(measurementMode);

    const L = await import('leaflet');

    // Add click handler
    const handleMapClick = (e: L.LeafletMouseEvent) => {
      const newPoint: MeasurementPoint = {
        latlng: e.latlng,
      };

      // Add marker
      const marker = L.circleMarker(e.latlng, {
        radius: 6,
        fillColor: '#3b82f6',
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8,
      }).addTo(map);

      newPoint.marker = marker;
      markersRef.current.push(marker);

      setPoints((prev) => {
        const updated = [...prev, newPoint];

        // Update distance
        if (measurementMode === 'distance' && updated.length > 1) {
          const dist = calculateTotalDistance(updated);
          setDistance(dist);

          // Draw/update polyline
          const latlngs = updated.map((p) => p.latlng);
          if (polylineRef.current) {
            polylineRef.current.setLatLngs(latlngs);
          } else {
            polylineRef.current = L.polyline(latlngs, {
              color: '#3b82f6',
              weight: 3,
              opacity: 0.7,
              dashArray: '10, 10',
            }).addTo(map);
          }
        }

        // Update area
        if (measurementMode === 'area' && updated.length > 2) {
          const calculatedArea = calculateArea(updated);
          setArea(calculatedArea);

          // Draw/update polygon
          const latlngs = updated.map((p) => p.latlng);
          if (polygonRef.current) {
            polygonRef.current.setLatLngs(latlngs);
          } else {
            polygonRef.current = L.polygon(latlngs, {
              color: '#3b82f6',
              weight: 2,
              opacity: 0.7,
              fillColor: '#3b82f6',
              fillOpacity: 0.2,
            }).addTo(map);
          }
        }

        return updated;
      });
    };

    map.on('click', handleMapClick);
    map.getContainer().style.cursor = 'crosshair';
  }, [map, calculateTotalDistance, calculateArea]);

  /**
   * Clear measurement
   */
  const clearMeasurement = useCallback(() => {
    if (!map) return;

    // Remove all markers
    markersRef.current.forEach((marker) => {
      if (marker && map.hasLayer(marker)) {
        map.removeLayer(marker);
      }
    });
    markersRef.current = [];

    // Remove polyline
    if (polylineRef.current && map.hasLayer(polylineRef.current)) {
      map.removeLayer(polylineRef.current);
      polylineRef.current = null;
    }

    // Remove polygon
    if (polygonRef.current && map.hasLayer(polygonRef.current)) {
      map.removeLayer(polygonRef.current);
      polygonRef.current = null;
    }

    // Remove click handler
    map.off('click');
    map.getContainer().style.cursor = '';

    setPoints([]);
    setDistance(0);
    setArea(0);
    setMode(null);
  }, [map]);

  /**
   * Undo last point
   */
  const undoLastPoint = useCallback(() => {
    if (points.length === 0) return;

    setPoints((prev) => {
      const updated = [...prev];
      const removed = updated.pop();

      // Remove marker
      if (removed?.marker && map?.hasLayer(removed.marker)) {
        map.removeLayer(removed.marker);
      }
      markersRef.current.pop();

      // Update measurements
      if (mode === 'distance' && updated.length > 1) {
        const dist = calculateTotalDistance(updated);
        setDistance(dist);

        // Update polyline
        if (polylineRef.current) {
          const latlngs = updated.map((p) => p.latlng);
          polylineRef.current.setLatLngs(latlngs);
        }
      } else if (mode === 'distance' && updated.length <= 1) {
        setDistance(0);
        if (polylineRef.current && map?.hasLayer(polylineRef.current)) {
          map.removeLayer(polylineRef.current);
          polylineRef.current = null;
        }
      }

      if (mode === 'area' && updated.length > 2) {
        const calculatedArea = calculateArea(updated);
        setArea(calculatedArea);

        // Update polygon
        if (polygonRef.current) {
          const latlngs = updated.map((p) => p.latlng);
          polygonRef.current.setLatLngs(latlngs);
        }
      } else if (mode === 'area' && updated.length <= 2) {
        setArea(0);
        if (polygonRef.current && map?.hasLayer(polygonRef.current)) {
          map.removeLayer(polygonRef.current);
          polygonRef.current = null;
        }
      }

      return updated;
    });
  }, [points, map, mode, calculateTotalDistance, calculateArea]);

  /**
   * Finish measurement (close polygon for area)
   */
  const finishMeasurement = useCallback(() => {
    if (!map) return;

    map.off('click');
    map.getContainer().style.cursor = '';
    setMode(null);
  }, [map]);

  return {
    mode,
    points,
    distance,
    area,
    startMeasurement,
    clearMeasurement,
    undoLastPoint,
    finishMeasurement,
    isActive: mode !== null,
    pointCount: points.length,
  };
}
