'use client';

import { useCallback } from 'react';
import { useLeafletMap } from './useLeafletMap';

/**
 * Hook for controlling map zoom and fullscreen
 */
export function useMapControls() {
    const map = useLeafletMap();

    const zoomIn = useCallback(() => {
        if (map) {
            map.zoomIn();
        }
    }, [map]);

    const zoomOut = useCallback(() => {
        if (map) {
            map.zoomOut();
        }
    }, [map]);

    const toggleFullscreen = useCallback(() => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }, []);

    const resetView = useCallback(() => {
        if (map) {
            // Reset to default view
            map.setView([-2.911154, 120.074263], 5);
        }
    }, [map]);

    return {
        zoomIn,
        zoomOut,
        toggleFullscreen,
        resetView,
        map,
    };
}
