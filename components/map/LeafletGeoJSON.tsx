'use client';

import { useEffect, useRef } from 'react';
import { useLeafletMap } from '@/hooks/useLeafletMap';

interface LeafletGeoJSONProps {
    data: GeoJSON.Feature | null;
    style?: {
        fillColor?: string;
        fillOpacity?: number;
        color?: string;
        weight?: number;
    };
}

/**
 * LeafletGeoJSON component - Renders GeoJSON features on the map
 * 
 * Features:
 * - Renders GeoJSON polygons/multipolygons
 * - Customizable styling
 * - Automatic cleanup on unmount
 * - Fits bounds to feature
 */
export function LeafletGeoJSON({ data, style }: LeafletGeoJSONProps) {
    const map = useLeafletMap();
    const layerRef = useRef<any>(null);

    useEffect(() => {
        if (!map || !data) return;

        // Dynamically import Leaflet
        import('leaflet').then((L) => {
            // Remove existing layer
            if (layerRef.current) {
                layerRef.current.remove();
                layerRef.current = null;
            }

            // Create GeoJSON layer
            const geoJSONLayer = L.geoJSON(data, {
                style: {
                    fillColor: style?.fillColor || '#3b82f6',
                    fillOpacity: style?.fillOpacity || 0.2,
                    color: style?.color || '#2563eb',
                    weight: style?.weight || 2,
                },
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
        });

        // Cleanup
        return () => {
            if (layerRef.current) {
                layerRef.current.remove();
                layerRef.current = null;
            }
        };
    }, [map, data, style]);

    return null;
}
