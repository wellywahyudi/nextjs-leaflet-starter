import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Cache for the GeoJSON data (in-memory)
let countriesCache: any = null;

interface Country {
    id: string;
    name: string;
    nameLong: string;
}

/**
 * Load world.geojson and cache it in memory
 * Only extracts essential data (name, nameLong, id) for search
 */
function loadCountries(): Country[] {
    if (countriesCache) {
        return countriesCache;
    }

    try {
        const filePath = path.join(process.cwd(), 'public', 'data', 'world.geojson');
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const geoJSON = JSON.parse(fileContents);

        // Extract only essential data for search
        countriesCache = geoJSON.features.map((feature: any, index: number) => ({
            id: feature.properties.NAME || `country-${index}`,
            name: feature.properties.NAME || 'Unknown',
            nameLong: feature.properties.NAME_LONG || feature.properties.NAME || 'Unknown',
        })).filter((c: Country) => c.name !== 'Unknown'); // Filter out unknown countries

        return countriesCache;
    } catch (error) {
        return [];
    }
}

/**
 * GET /api/countries/search?q=query
 * Search countries by name
 */
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';

    const countries = loadCountries();

    if (!query) {
        // Return top 5 popular countries by default
        const defaultCountries = ['Indonesia', 'India', 'United Kingdom', 'Japan', 'Australia'];
        const filtered = countries
            .filter(c => defaultCountries.includes(c.name))
            .slice(0, 5);

        return NextResponse.json(filtered);
    }

    // Search countries by name (case-insensitive)
    const lowerQuery = query.toLowerCase();
    const filtered = countries
        .filter(country =>
            country.name.toLowerCase().includes(lowerQuery) ||
            country.nameLong.toLowerCase().includes(lowerQuery)
        )
        .slice(0, 5); // Limit to 10 results

    return NextResponse.json(filtered);
}
