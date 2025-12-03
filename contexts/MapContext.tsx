"use client";

import {
  createContext,
  ReactNode,
  useState,
  useCallback,
  useMemo,
} from "react";
import type { Map as LeafletMap } from "leaflet";
import { MapContextValue } from "@/types/map";

/**
 * Map context for managing Leaflet map instance
 */
export const MapContext = createContext<MapContextValue | undefined>(undefined);

interface MapProviderProps {
  children: ReactNode;
}

/**
 * MapProvider component that manages map instance state
 *
 * Features:
 * - Manages Leaflet map instance state
 * - Provides setMap function for registering map instance
 * - Tracks map initialization status with isReady flag
 * - Tracks initialization and error states
 * - Shares map instance across all child components
 * - Memoized context value to prevent unnecessary re-renders
 *
 * @example
 * ```tsx
 * <MapProvider>
 *   <LeafletMap />
 *   <MapControls />
 * </MapProvider>
 * ```
 */
export function MapProvider({ children }: MapProviderProps) {
  const [map, setMapState] = useState<LeafletMap | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  // Memoized setMap to prevent unnecessary re-renders
  const setMap = useCallback((newMap: LeafletMap | null) => {
    setMapState(newMap);
    if (newMap) {
      setIsInitializing(false);
      setError(null);
    }
  }, []);

  // Set error state
  const setMapError = useCallback((err: Error | null) => {
    setError(err);
    setIsInitializing(false);
  }, []);

  // Start initialization
  const startInitializing = useCallback(() => {
    setIsInitializing(true);
    setError(null);
  }, []);

  // Map is ready when instance is not null and no error
  const isReady = map !== null && error === null;

  // Memoize context value to prevent unnecessary re-renders of consumers
  const value: MapContextValue = useMemo(
    () => ({
      map,
      setMap,
      isReady,
      error,
      isInitializing,
      setMapError,
      startInitializing,
    }),
    [
      map,
      setMap,
      isReady,
      error,
      isInitializing,
      setMapError,
      startInitializing,
    ]
  );

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
}
