"use client";

import { memo, useMemo } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { FIPS_TO_STATE } from "@/lib/states";
import { formatCurrency } from "@/lib/format";

const GEO_URL = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

interface StateData {
  code: string;
  value: number;
}

interface USChoroplethMapProps {
  data: StateData[];
  onStateClick?: (code: string) => void;
  valueLabel?: string;
  formatValue?: (value: number) => string;
}

function USChoroplethMapInner({
  data,
  onStateClick,
  valueLabel = "Total Spending",
  formatValue = (v) => formatCurrency(v, true),
}: USChoroplethMapProps) {
  const dataMap = useMemo(() => {
    const m = new Map<string, number>();
    for (const d of data) m.set(d.code, d.value);
    return m;
  }, [data]);

  const maxVal = useMemo(
    () => Math.max(...data.map((d) => d.value), 1),
    [data],
  );

  function getColor(value: number | undefined) {
    if (value === undefined) return "#e5e7eb";
    const t = Math.pow(value / maxVal, 0.4); // sqrt scale for better distribution
    const r = Math.round(219 - t * (219 - 37));
    const g = Math.round(234 - t * (234 - 99));
    const b = Math.round(254 - t * (254 - 235));
    return `rgb(${r}, ${g}, ${b})`;
  }

  return (
    <ComposableMap projection="geoAlbersUsa" width={800} height={500}>
      <Geographies geography={GEO_URL}>
        {({ geographies }) =>
          geographies.map((geo) => {
            const fips = geo.id;
            const stateCode = FIPS_TO_STATE[fips];
            const value = stateCode ? dataMap.get(stateCode) : undefined;

            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill={getColor(value)}
                stroke="#fff"
                strokeWidth={0.5}
                style={{
                  default: { outline: "none" },
                  hover: {
                    outline: "none",
                    fill: "#93c5fd",
                    cursor: "pointer",
                  },
                  pressed: { outline: "none" },
                }}
                onClick={() => stateCode && onStateClick?.(stateCode)}
              />
            );
          })
        }
      </Geographies>
    </ComposableMap>
  );
}

export const USChoroplethMap = memo(USChoroplethMapInner);
