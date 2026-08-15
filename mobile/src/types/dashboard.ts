export interface DashboardStat {
  key: string;
  title: string;
  value: number | string;
  icon: string;
}

export interface DashboardData {
  projects: number;
  items: number;
  suppliers: number;
  customers: number;
  purchasers: number;
  cheques: number;
}