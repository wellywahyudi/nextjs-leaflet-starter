# Next.js Leaflet Starter

A production-ready Next.js 16 starter template with vanilla Leaflet integration. Build modern, interactive map applications with a Google Maps-inspired UI.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?logo=leaflet)](https://leafletjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![GitHub Template](https://img.shields.io/badge/Template-Use%20this%20template-brightgreen?logo=github)](https://github.com/wellywahyudi/nextjs-leaflet-starter/generate)

![Demo Screenshot](screenshot.png)

📖 **Read the full story:** [I Built a Google Maps Clone Using Next.js 16 + Leaflet](https://dev.to/wellywahyudi/i-built-a-google-maps-clone-using-nextjs-16-leaflet-now-its-an-open-source-starter-kit-9n5)

## ✨ Features

- **Modern Map Interface** — Google Maps-inspired UI with smooth animations
- **Multiple Tile Providers** — OpenStreetMap, Satellite (Esri), and Dark mode (CARTO)
- **Theme-Aware Basemaps** — Auto-switches map style based on light/dark theme
- **GeoJSON Support** — Render and style geographic features with fly-to animations
- **Country Search** — Debounced search with keyboard navigation (↑↓ Enter Esc)
- **Map Controls** — Zoom, fullscreen, geolocation, and reset view
- **Responsive Design** — Mobile-first approach with adaptive layouts
- **Server Components** — Next.js 16 App Router with optimized client boundaries

## 🛠 Tech Stack

| Category  | Technology                          |
| --------- | ----------------------------------- |
| Framework | Next.js 16 (App Router)             |
| UI        | React 19, Tailwind CSS 4, shadcn/ui |
| Maps      | Leaflet 1.9 (vanilla, no wrapper)   |
| Icons     | Lucide React                        |
| Theming   | next-themes                         |
| Language  | TypeScript 5                        |

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/wellywahyudi/nextjs-leaflet-starter.git
cd nextjs-leaflet-starter

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the landing page, then navigate to `/map` for the interactive map.

## 📁 Project Structure

```
├── app/
│   ├── api/countries/     # Country search API
│   ├── map/               # Map page (Server Component)
│   └── page.tsx           # Landing page
├── components/
│   ├── landing/           # Hero, navigation, tech stack
│   ├── map/               # Map components (controls, layers, search)
│   └── ui/                # shadcn/ui components
├── contexts/              # MapContext, ThemeContext
├── hooks/                 # useLeafletMap, useMapControls, useMapTileProvider
├── constants/             # Map config, tile providers
└── types/                 # TypeScript definitions
```

## 🗺 Map Components

| Component          | Description                            |
| ------------------ | -------------------------------------- |
| `LeafletMap`       | Core map container with initialization |
| `LeafletTileLayer` | Dynamic tile layer switching           |
| `LeafletGeoJSON`   | GeoJSON rendering with styling         |
| `LeafletMarker`    | Custom markers                         |
| `MapControls`      | Zoom, fullscreen, location, reset      |
| `MapTileSwitcher`  | Tile provider switcher with previews   |
| `MapSearchBar`     | Country search with autocomplete       |

## 🎨 Customization

### Default Map View

Edit `constants/map-config.ts`:

```typescript
export const DEFAULT_MAP_CONFIG: MapConfig = {
  defaultCenter: [-2.911154, 120.074263], // Indonesia
  defaultZoom: 5,
  minZoom: 3,
  maxZoom: 18,
};
```

### Add Tile Providers

Edit `constants/tile-providers.ts`:

```typescript
export const TILE_PROVIDERS: TileProvider[] = [
  {
    id: "custom",
    name: "Custom Map",
    url: "https://your-tile-server/{z}/{x}/{y}.png",
    attribution: "© Your Attribution",
    maxZoom: 19,
    category: "standard",
  },
  // ...existing providers
];
```

## 📜 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🚢 Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/wellywahyudi/nextjs-leaflet-starter)

### Manual Deployment

1. Install Vercel CLI:

```bash
npm i -g vercel
```

2. Deploy:

```bash
vercel
```

3. Follow the prompts to link your project

### Environment Variables

No environment variables required for basic deployment. The app uses public GeoJSON data from the `/public/data` directory.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License — feel free to use this starter for personal or commercial projects.
