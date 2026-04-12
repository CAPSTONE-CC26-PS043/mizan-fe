export interface MonthlyData {
  month: string;
  balance: number;
  income: number;
  expenses: number;
}

export interface CategorySpending {
  categoryId: number;
  categoryName: string;
  spent: number;
  budget: number;
  percentage: number;
}

export interface RecentTransaction {
  id: number;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  description: string | null;
  categoryName: string | null;
  walletName: string | null;
  status: string;
  transactionDate: string;
}

export interface DashboardData {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  netSaving: number;
  thisMonthIncome: number;
  thisMonthExpense: number;
  thisMonthNetSaving: number;
  incomePercentage: number;
  recentTransactions: RecentTransaction[];
  monthlyData: MonthlyData[];
  categorySpending: CategorySpending[];
}

export interface DashboardResponse {
  success: boolean;
  data: DashboardData;
  message: string;
}
