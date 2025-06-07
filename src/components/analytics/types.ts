export interface CountryPerformance {
  country: string;
  totalShipments: number;
  avgDelayDays?: number;
  totalCost?: number;
  onTimePercentage?: number;
  issues?: string[];
}
