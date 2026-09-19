import type { IRevenueTrendChartProps } from "@/features/dashboard/types/shop-dashboard-components";

const CHART_WIDTH = 480;
const CHART_HEIGHT = 160;
const GRIDLINE_FRACTIONS = [0.25, 0.5, 0.75];

// A single-series area/line chart — one hue (--chart-1), no legend needed since
// the card title already names the series (dataviz skill: single-series rule)
export const RevenueTrendChart = ({
  points,
  ariaLabel,
  formatTooltip,
}: IRevenueTrendChartProps) => {
  const maxRevenue = Math.max(...points.map((point) => point.revenue), 1);
  const stepX = points.length > 1 ? CHART_WIDTH / (points.length - 1) : CHART_WIDTH;

  const coordinates = points.map((point, index) => ({
    x: index * stepX,
    y: CHART_HEIGHT - (point.revenue / maxRevenue) * CHART_HEIGHT,
    point,
  }));

  const linePath = coordinates
    .map(
      (coordinate, index) =>
        `${index === 0 ? "M" : "L"}${coordinate.x.toFixed(1)},${coordinate.y.toFixed(1)}`,
    )
    .join(" ");

  const areaPath = linePath
    ? `${linePath} L${CHART_WIDTH},${CHART_HEIGHT} L0,${CHART_HEIGHT} Z`
    : "";

  return (
    <svg
      viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
      className="h-40 w-full"
      role="img"
      aria-label={ariaLabel}
    >
      <defs>
        <linearGradient id="revenue-trend-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
          <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
        </linearGradient>
      </defs>

      {GRIDLINE_FRACTIONS.map((fraction) => (
        <line
          key={fraction}
          x1={0}
          x2={CHART_WIDTH}
          y1={CHART_HEIGHT * fraction}
          y2={CHART_HEIGHT * fraction}
          stroke="var(--border)"
          strokeWidth={1}
        />
      ))}

      {areaPath ? <path d={areaPath} fill="url(#revenue-trend-fill)" /> : null}

      {linePath ? (
        <path
          d={linePath}
          fill="none"
          stroke="var(--chart-1)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : null}

      {coordinates.map(({ x, y, point }) => (
        <circle key={point.day} cx={x} cy={y} r={3} fill="var(--chart-1)">
          <title>{formatTooltip(point)}</title>
        </circle>
      ))}
    </svg>
  );
};
