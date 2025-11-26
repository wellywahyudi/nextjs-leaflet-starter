"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Briefcase, Car, ChevronRight, MapPin } from "lucide-react";

interface Country {
  id: string;
  name: string;
  nameLong: string;
}

interface MapSearchBarProps {
  onCountrySelect: (countryId: string) => void;
}

/**
 * MapSearchBar - Google Maps-style expandable search bar with keyboard navigation
 *
 * Features:
 * - Expandable search with smooth animations
 * - Debounced search (150ms)
 * - Keyboard navigation support:
 *   - Arrow Up/Down: Navigate through results
 *   - Enter: Select highlighted country
 *   - Escape: Close dropdown
 * - Visual feedback for selected item
 * - Accessibility support with ARIA attributes
 * - Auto-scroll selected item into view
 */
export function MapSearchBar({ onCountrySelect }: MapSearchBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Fetch countries when expanded or search query changes
  useEffect(() => {
    if (!isExpanded) return;

    const fetchCountries = async () => {
      setLoading(true);
      try {
        const query = searchQuery.trim();
        const url = query
          ? `/api/countries/search?q=${encodeURIComponent(query)}`
          : "/api/countries/search";

        const response = await fetch(url);
        const data = await response.json();
        setCountries(data);
      } catch (error) {
        setCountries([]);
      } finally {
        setLoading(false);
      }
    };

    // Fetch immediately when first expanded
    if (searchQuery === "") {
      fetchCountries();
    } else {
      // Debounce when searching
      const timer = setTimeout(fetchCountries, 150);
      return () => clearTimeout(timer);
    }
  }, [searchQuery, isExpanded]);

  // Handle country selection
  const handleCountrySelect = useCallback(
    (countryId: string) => {
      onCountrySelect(countryId);
      setIsExpanded(false);
      setSearchQuery("");
      setSelectedIndex(-1);
    },
    [onCountrySelect]
  );

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isExpanded || countries.length === 0) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < countries.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case "Enter":
          e.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < countries.length) {
            handleCountrySelect(countries[selectedIndex].id);
          }
          break;
        case "Escape":
          e.preventDefault();
          setIsExpanded(false);
          setSelectedIndex(-1);
          searchInputRef.current?.blur();
          break;
      }
    },
    [isExpanded, countries, selectedIndex, handleCountrySelect]
  );

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex]?.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [selectedIndex]);

  // Reset selected index when search query changes
  useEffect(() => {
    setSelectedIndex(-1);
  }, [searchQuery]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isExpanded && !target.closest(".search-container")) {
        setIsExpanded(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isExpanded]);

  return (
    <div className="search-container absolute left-4 top-3 z-[1001]">
      {/* Search Box - always visible */}
      <div
        className={`flex items-center gap-2 bg-white px-4 py-3.5 shadow-lg transition-all duration-100 ${
          isExpanded ? "rounded-t-lg" : "rounded-full"
        }`}
        style={{ width: isExpanded ? "360px" : "auto" }}
      >
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search on maps"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          onKeyDown={handleKeyDown}
          className="border-none bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-500 transition-all duration-300 w-full"
          aria-label="Search countries"
          aria-expanded={isExpanded}
          aria-controls="search-results"
          aria-activedescendant={
            selectedIndex >= 0 ? `country-${selectedIndex}` : undefined
          }
          autoComplete="off"
        />
        <Search
          className="h-5 w-5 flex-shrink-0 text-gray-400"
          aria-hidden="true"
        />
        <div className="ml-2 flex items-center gap-2 border-l border-gray-200 pl-3">
          <button
            className="text-blue-500 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded transition-all"
            aria-label="Show current location"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Dropdown Panel */}
      <div
        ref={resultsRef}
        id="search-results"
        role="listbox"
        className={`overflow-hidden bg-white shadow-lg transition-all duration-300 ease-out ${
          isExpanded
            ? "max-h-[500px] opacity-100 rounded-b-lg"
            : "max-h-0 opacity-0"
        }`}
        style={{ width: "360px" }}
        aria-label="Search results"
      >
        <div className="overflow-y-auto max-h-[450px]">
          {loading && (
            <div
              className="px-4 py-8 text-center text-sm text-gray-500"
              role="status"
              aria-live="polite"
            >
              Searching...
            </div>
          )}

          {!loading && countries.length === 0 && searchQuery && (
            <div
              className="px-4 py-8 text-center text-sm text-gray-500"
              role="status"
              aria-live="polite"
            >
              No results found for &quot;{searchQuery}&quot;
            </div>
          )}

          {/* Search Results / Countries */}
          {!loading && countries.length > 0 && (
            <>
              {countries.map((country, index) => (
                <button
                  key={country.id}
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  id={`country-${index}`}
                  role="option"
                  aria-selected={selectedIndex === index}
                  onClick={() => handleCountrySelect(country.id)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex w-full items-start gap-4 px-4 py-3 text-left transition-colors ${
                    selectedIndex === index
                      ? "bg-blue-50 border-l-2 border-blue-500"
                      : "hover:bg-gray-50 border-l-2 border-transparent"
                  }`}
                >
                  <MapPin
                    className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400"
                    aria-hidden="true"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900">
                      {country.name}
                    </div>
                    {country.nameLong !== country.name && (
                      <div className="text-sm text-gray-500 truncate">
                        {country.nameLong}
                      </div>
                    )}
                  </div>
                  {selectedIndex === index && (
                    <ChevronRight
                      className="h-5 w-5 text-blue-500 flex-shrink-0"
                      aria-hidden="true"
                    />
                  )}
                </button>
              ))}
            </>
          )}

          {/* Work Location & Additional Info - Original UI */}
          {!searchQuery && (
            <>
              <button className="flex w-full items-center gap-4 px-4 py-3 text-left hover:bg-gray-50">
                <Briefcase className="h-5 w-5 flex-shrink-0 text-gray-400" />
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-900">
                    Work
                  </span>
                </div>
                <span className="text-sm text-blue-600">Set location</span>
              </button>

              {/* More from recent history link */}
              <button className="w-full px-4 py-3 text-left">
                <span className="text-sm text-blue-600">
                  More from recent history
                </span>
              </button>

              {/* Location & Traffic Info */}
              <div className="border-t border-gray-200">
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="font-medium text-gray-900">Bali</span>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-700">26°</span>
                    <svg
                      className="h-5 w-5 text-yellow-500"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95z" />
                    </svg>
                  </div>
                </div>
                <button className="flex w-full items-center gap-3 px-4 py-3 hover:bg-gray-50">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                    <Car className="h-4 w-4 text-green-700" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium text-gray-900">
                      Light traffic in this area
                    </div>
                    <div className="text-xs text-gray-500">
                      Typical conditions
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
