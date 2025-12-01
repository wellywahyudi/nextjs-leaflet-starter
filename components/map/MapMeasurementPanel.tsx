"use client";

import { Ruler, X, Undo, Check, MapPin } from "lucide-react";
import { useMeasurement } from "@/hooks/useMeasurement";
import type { MeasurementMode } from "@/hooks/useMeasurement";
import { useState } from "react";

interface MapMeasurementPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * MapMeasurementPanel - Measurement panel UI
 */
export function MapMeasurementPanel({
  isOpen,
  onClose,
}: MapMeasurementPanelProps) {
  const {
    mode,
    distance,
    area,
    pointCount,
    startMeasurement,
    clearMeasurement,
    undoLastPoint,
    finishMeasurement,
  } = useMeasurement();

  const [lastMeasurement, setLastMeasurement] = useState<{
    type: "distance" | "area";
    value: number;
  } | null>(null);

  const handleModeSelect = (selectedMode: MeasurementMode) => {
    if (mode === selectedMode) {
      clearMeasurement();
    } else {
      startMeasurement(selectedMode);
    }
  };

  const handleClose = () => {
    clearMeasurement();
    setLastMeasurement(null);
    onClose();
  };

  const handleClear = () => {
    clearMeasurement();
    setLastMeasurement(null);
  };

  const handleFinish = () => {
    // Save the last measurement before finishing
    if (mode === "distance" && pointCount > 1) {
      setLastMeasurement({ type: "distance", value: distance });
    } else if (mode === "area" && pointCount > 2) {
      setLastMeasurement({ type: "area", value: area });
    }
    finishMeasurement();
  };

  const formatDistance = (meters: number): string => {
    if (meters < 1000) {
      return `${meters.toFixed(2)} m`;
    }
    return `${(meters / 1000).toFixed(2)} km`;
  };

  const formatArea = (squareMeters: number): string => {
    if (squareMeters < 10000) {
      return `${squareMeters.toFixed(2)} m²`;
    } else if (squareMeters < 1000000) {
      return `${(squareMeters / 10000).toFixed(2)} ha`;
    }
    return `${(squareMeters / 1000000).toFixed(2)} km²`;
  };

  if (!isOpen) return null;

  return (
    <div className="absolute bottom-20 sm:bottom-6 left-0 right-0 z-[1000] pointer-events-none">
      <div className="flex justify-center pb-4 px-4">
        <div className="flex flex-col gap-1 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 pointer-events-auto">
          {/* Top: Mode Tabs */}
          <div className="flex items-center gap-1 p-1 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => handleModeSelect("distance")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                mode === "distance"
                  ? "bg-blue-50 dark:bg-blue-900/30 ring-2 ring-blue-500 dark:ring-blue-400"
                  : "hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
              title="Distance"
            >
              <Ruler
                className={`h-4 w-4 ${
                  mode === "distance"
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              />
              <span
                className={`text-xs font-medium ${
                  mode === "distance"
                    ? "text-blue-700 dark:text-blue-300"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                Distance
              </span>
            </button>

            <button
              onClick={() => handleModeSelect("area")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                mode === "area"
                  ? "bg-green-50 dark:bg-green-900/30 ring-2 ring-green-500 dark:ring-green-400"
                  : "hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
              title="Area"
            >
              <MapPin
                className={`h-4 w-4 ${
                  mode === "area"
                    ? "text-green-600 dark:text-green-400"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              />
              <span
                className={`text-xs font-medium ${
                  mode === "area"
                    ? "text-green-700 dark:text-green-300"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                Area
              </span>
            </button>

            <div className="flex-1" />

            {/* Close button */}
            <button
              onClick={handleClose}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Close measurement tools"
            >
              <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Bottom: Content */}
          <div className="flex items-center gap-2 px-3 py-2">
            {!mode ? (
              /* No mode selected - show last measurement or prompt */
              <>
                {lastMeasurement ? (
                  <div
                    className={`flex items-center gap-2 ${
                      lastMeasurement.type === "distance"
                        ? "text-blue-700 dark:text-blue-300"
                        : "text-green-700 dark:text-green-300"
                    }`}
                  >
                    <span className="text-xs font-medium">
                      {lastMeasurement.type === "distance"
                        ? "Distance:"
                        : "Area:"}
                    </span>
                    <span className="text-sm font-semibold">
                      {lastMeasurement.type === "distance"
                        ? formatDistance(lastMeasurement.value)
                        : formatArea(lastMeasurement.value)}
                    </span>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Select a measurement mode
                  </p>
                )}
              </>
            ) : (
              /* Active Measurement */
              <>
                {/* Results */}
                <div className="flex items-center gap-2">
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg px-2 py-1.5 min-w-[50px]">
                    <p className="text-[9px] text-gray-500 dark:text-gray-400">
                      Points
                    </p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {pointCount}
                    </p>
                  </div>

                  {mode === "distance" && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg px-2 py-1.5 min-w-[70px]">
                      <p className="text-[9px] text-blue-600 dark:text-blue-400">
                        Distance
                      </p>
                      <p className="text-sm font-bold text-blue-900 dark:text-blue-100">
                        {pointCount > 1 ? formatDistance(distance) : "—"}
                      </p>
                    </div>
                  )}

                  {mode === "area" && (
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg px-2 py-1.5 min-w-[70px]">
                      <p className="text-[9px] text-green-600 dark:text-green-400">
                        Area
                      </p>
                      <p className="text-sm font-bold text-green-900 dark:text-green-100">
                        {pointCount > 2 ? formatArea(area) : "—"}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex-1" />

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleClear}
                    className="p-1.5 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 rounded-lg transition-colors"
                    title="Clear"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>

                  <button
                    onClick={undoLastPoint}
                    disabled={pointCount === 0}
                    className="p-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Undo"
                  >
                    <Undo className="h-3.5 w-3.5" />
                  </button>

                  <button
                    onClick={handleFinish}
                    disabled={
                      (mode === "distance" && pointCount < 2) ||
                      (mode === "area" && pointCount < 3)
                    }
                    className="p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Done"
                  >
                    <Check className="h-3.5 w-3.5" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
