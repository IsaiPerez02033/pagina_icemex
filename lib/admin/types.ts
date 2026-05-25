export interface MetricCardData {
  label: string;
  value: string;
  change: number;
  icon: string;
}

export interface TrafficPoint {
  date: string;
  visitors: number;
  pageViews: number;
}

export interface DeviceData {
  name: string;
  value: number;
}

export interface TopPage {
  page: string;
  views: number;
  avgTime: string;
  bounceRate: string;
}

export interface CountryData {
  country: string;
  flag: string;
  visitors: number;
}

export interface KeywordData {
  query: string;
  impressions: number;
  clicks: number;
  ctr: number;
  position: number;
}

export interface EventData {
  name: string;
  count: number;
  trend: number;
}

export type DateRange = "today" | "7d" | "30d" | "90d";
