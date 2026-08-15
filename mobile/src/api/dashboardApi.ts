import api from './api';

export interface DashboardData {
  projects: number;
  items: number;
  suppliers: number;
  customers: number;
  purchasers: number;
  cheques: number;
}

function extractCount(data: any): number {
  if (!data) {
    return 0;
  }

  if (typeof data === 'number') {
    return data;
  }

  const possibleKeys = [
    'total',
    'count',
    'total_count',
    'total_records',
    'total_projects',
    'total_items',
    'total_suppliers',
    'total_customers',
    'total_purchasers',
    'total_cheques',
  ];

  for (const key of possibleKeys) {
    if (
      data[key] !== undefined &&
      !Number.isNaN(Number(data[key]))
    ) {
      return Number(data[key]);
    }
  }

  if (data.data) {
    return extractCount(data.data);
  }

  return 0;
}

async function safeStatistic(
  url: string
): Promise<number> {
  try {
    const response = await api.get(url);

    return extractCount(response.data);
  } catch (error) {
    console.log(
      `Dashboard statistic failed: ${url}`,
      error
    );

    return 0;
  }
}

export const dashboardApi = {
  async getDashboard():
    Promise<DashboardData> {

    const [
      projects,
      items,
      suppliers,
      customers,
      purchasers,
      cheques,
    ] = await Promise.all([
      safeStatistic(
        '/admin/projects/statistics'
      ),

      safeStatistic(
        '/admin/items/statistics'
      ),

      safeStatistic(
        '/admin/suppliers/statistics'
      ),

      safeStatistic(
        '/admin/customers/statistics'
      ),

      safeStatistic(
        '/admin/sales/purchasers/statistics'
      ),

      safeStatistic(
        '/admin/finance/cheques/statistics'
      ),
    ]);

    return {
      projects,
      items,
      suppliers,
      customers,
      purchasers,
      cheques,
    };
  },
};