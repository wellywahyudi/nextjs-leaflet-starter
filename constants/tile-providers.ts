/**
 * Tile provider configurations
 */

import type { TileProvider } from '@/types';

/**
 * Available tile providers
 */
export const TILE_PROVIDERS: TileProvider[] = [
  {
    id: 'osm',
    name: 'OpenStreetMap',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
    category: 'standard',
  },
  {
    id: 'satellite',
    name: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; <a href="https://www.esri.com/">Esri World Imagery </a>',
    maxZoom: 18,
    category: 'satellite',
  },
  {
    id: 'dark',
    name: 'Dark Mode',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 19,
    category: 'dark',
  },
];

/**
 * Default tile provider ID
 */
export const DEFAULT_TILE_PROVIDER_ID = 'osm';

/**
 * Get tile provider by ID
 */
export function getTileProviderById(id: string): TileProvider | undefined {
  return TILE_PROVIDERS.find(provider => provider.id === id);
}

/**
 * Get default tile provider
 */
export function getDefaultTileProvider(): TileProvider {
  return TILE_PROVIDERS.find(provider => provider.id === DEFAULT_TILE_PROVIDER_ID) || TILE_PROVIDERS[0];
}
