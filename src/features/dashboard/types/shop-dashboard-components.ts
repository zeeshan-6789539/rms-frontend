export interface IDailyRevenuePoint {
  day: number;
  revenue: number;
}

export interface IRevenueTrendChartProps {
  points: readonly IDailyRevenuePoint[];
  ariaLabel: string;
  formatTooltip: (point: IDailyRevenuePoint) => string;
}
