import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Cache for full GeoJSON data
let fullGeoJSONCache: any = null;

/**
 * GET /api/countries/[id]
 * Returns full GeoJSON feature for a specific country
 */
export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    // Await params in Next.js 15+
    const params = await context.params;
    // Decode the URL parameter (handles spaces and special characters)
    const decodedId = decodeURIComponent(params.id);

    try {
        // Load full GeoJSON if not cached
        if (!fullGeoJSONCache) {
            const filePath = path.join(process.cwd(), 'public', 'data', 'world.geojson');
            const fileContents = fs.readFileSync(filePath, 'utf8');
            fullGeoJSONCache = JSON.parse(fileContents);
        }

        // Find country by ID (matches NAME or NAME_LONG)
        const feature = fullGeoJSONCache.features.find((f: any) => {
            const name = f.properties.NAME;
            const nameLong = f.properties.NAME_LONG;
            return name === decodedId || nameLong === decodedId;
        });

        if (!feature) {
            return NextResponse.json(
                { error: 'Country not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(feature);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to load country data' },
            { status: 500 }
        );
    }
}
