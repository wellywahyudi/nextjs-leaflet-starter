import { MapProvider } from '@/contexts/MapContext';
import { MapMain, MapErrorBoundary, MapLoadingSpinner } from '@/components/map';

/**
 * Map page component (Server Component)
 * 
 * Following Next.js 16 best practices:
 * - Server Component by default for better performance and SEO
 * - Child components (MapMain, MapProvider, etc.) are Client Components
 * 
 * Features:
 * - Modern Google Maps-style interface
 * - Full-screen map layout with Leaflet integration
 * - Search functionality
 * - Category filters
 * - Layer controls and zoom controls
 * - Navigation controls
 * - Error boundary for graceful error handling
 * - Loading spinner during initialization
 * - Responsive design
 * 
 * This page demonstrates the MapMain component which combines Leaflet
 * functionality with a modern, polished UI similar to Google Maps.
 */
export default function MapPage() {
    return (
        <div className="relative w-full h-screen">
            <MapErrorBoundary>
                <MapProvider>
                    <MapMain />
                    <MapLoadingSpinner />
                </MapProvider>
            </MapErrorBoundary>
        </div>
    );
}
