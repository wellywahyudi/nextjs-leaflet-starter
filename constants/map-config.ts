/**
 * Default map configuration constants
 */

import type { MapConfig } from '@/types';

/**
 * Default map configuration
 * Center: Indonesia coordinates
 */
export const DEFAULT_MAP_CONFIG: MapConfig = {
  defaultCenter: [-2.911154, 120.074263],
  defaultZoom: 5,
  minZoom: 3,
  maxZoom: 18,
  zoomControl: false, // Using custom controls in dock
  attributionControl: true,
};

/**
 * Map animation duration in milliseconds
 */
export const MAP_ANIMATION_DURATION = 500;

/**
 * Default map container height
 */
export const DEFAULT_MAP_HEIGHT = '100vh';
