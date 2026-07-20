import React from 'react';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  RefreshCw,
  ShoppingCart,
  Truck,
  Home,
  CreditCard,
  Heart
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useDashboard } from '../hooks/useDashboard';
import { useAuthStore } from '@/features/auth/store/auth.store';
import type { MonthlyData, CategorySpending, RecentTransaction } from '../types/dashboard.types';

function formatRupiah(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
}

interface CategoryIconProps {
  category: string;
  className?: string;
}

function CategoryIcon({ category, className }: CategoryIconProps) {
  const icons: Record<string, React.ComponentType<any>> = {
    'Food': ShoppingCart,
    'Income': TrendingUp,
    'Charity': Heart,
    'Bills': CreditCard,
    'Shopping': ShoppingCart,
    'Transportation': Truck,
    'Housing': Home,
    'Salary': TrendingUp,
    'Food & Drinks': ShoppingCart,
    'Transport': Truck,
    'House': Home,
    'Health': Heart,
    'Education': TrendingUp,
    // 'Zakat': Heart,
    'Savings': PiggyBank,
    'Other': DollarSign
  };
  
  const lowerCategory = category?.toLowerCase() || '';
  for (const [key, IconComponent] of Object.entries(icons)) {
    if (lowerCategory.includes(key.toLowerCase())) {
      return <IconComponent className={className} />;
    }
  }
  return <DollarSign className={className} />;
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    day: 'numeric', 
    month: 'short',
    hour: 'numeric',
    minute: '2-digit'
  });
}

export function Dashboard() {
  const { user } = useAuthStore();
  const { data, isLoading, refetch, isFetching, error } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 mx-auto mb-2 animate-spin text-emerald-600" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-500 mb-2">Failed to load dashboard</p>
          <button 
            onClick={() => refetch()}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const dashboardData = data?.success ? data.data : null;

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground">No data available</p>
        </div>
      </div>
    );
  }

  const {
    totalBalance,
    thisMonthIncome,
    thisMonthExpense,
    thisMonthNetSaving,
    incomePercentage,
    recentTransactions,
    monthlyData,
    categorySpending,
  } = dashboardData;

  const incomeChangePercent = monthlyData.length > 1 
    ? ((monthlyData[monthlyData.length - 1]?.income - monthlyData[monthlyData.length - 2]?.income) / monthlyData[monthlyData.length - 2]?.income * 100).toFixed(1)
    : '0';

  const netSavingPercent = thisMonthIncome > 0 ? (thisMonthNetSaving / thisMonthIncome * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground mb-1">Financial Summary</h1>
          <p className="text-muted-foreground">Welcome back! Here is your financial overview</p>
        </div>
        <button 
          onClick={() => refetch()} 
          disabled={isFetching}
          className="flex items-center gap-2 px-3 py-2 text-sm border border-border rounded-lg hover:bg-muted/50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Balance Card */}
        <div className="bg-gradient-to-br from-[#065f46] to-[#047857] rounded-2xl p-6 shadow-xl shadow-emerald-900/20 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
          <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Wallet className="w-6 h-6" />
              </div>
              <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full">Total</span>
            </div>
            <div>
              <p className="text-sm opacity-90 mb-1">Total Balance</p>
              <h3 className="text-3xl font-semibold">{formatRupiah(totalBalance)}</h3>
            </div>
          </div>
        </div>

        {/* This Month Income Card */}
        <div className="bg-card rounded-2xl p-6 shadow-md border border-border">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#047857] to-[#059669] flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <ArrowUpRight className="w-5 h-5 text-[#047857]" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">This Month Income</p>
            <h3 className="text-2xl font-semibold text-foreground">{formatRupiah(thisMonthIncome)}</h3>
            <p className="text-xs text-muted-foreground mt-2">
              {monthlyData.length > 1 ? `${incomeChangePercent}% from last month` : 'No previous data'}
            </p>
          </div>
        </div>

        {/* This Month Expense Card */}
        <div className="bg-card rounded-2xl p-6 shadow-md border border-border">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#d97706] to-[#f59e0b] flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-white" />
            </div>
            <ArrowDownRight className="w-5 h-5 text-[#d97706]" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">This Month Expense</p>
            <h3 className="text-2xl font-semibold text-foreground">{formatRupiah(thisMonthExpense)}</h3>
            <p className="text-xs text-muted-foreground mt-2">{incomePercentage.toFixed(0)}% of Income</p>
          </div>
        </div>

        {/* Net Saving Card */}
        <div className="bg-card rounded-2xl p-6 shadow-md border border-border">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] flex items-center justify-center">
              <PiggyBank className="w-6 h-6 text-white" />
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full ${
              thisMonthNetSaving >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
            }`}>
              {thisMonthNetSaving >= 0 ? 'Positive' : 'Negative'}
            </span>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Net Saving</p>
            <h3 className={`text-2xl font-semibold ${thisMonthNetSaving >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {thisMonthNetSaving >= 0 ? '' : '- '}{formatRupiah(Math.abs(thisMonthNetSaving))}
            </h3>
            <p className="text-xs text-muted-foreground mt-2">{netSavingPercent}% savings rate</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Balance Trend Chart */}
        <div className="lg:col-span-2 bg-card rounded-2xl p-6 shadow-md border border-border">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-foreground">Financial Performance</h3>
              <div className="flex items-center gap-2">
                <button className="text-xs px-3 py-1.5 bg-muted rounded-lg">6M</button>
                <button className="text-xs px-3 py-1.5 bg-[#065f46] text-white rounded-lg">1Y</button>
                <button className="text-xs px-3 py-1.5 bg-muted rounded-lg">ALL</button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Income, expense, and balance trends</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#047857" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#047857" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis dataKey="month" stroke="#737373" fontSize={12} />
              <YAxis stroke="#737373" fontSize={12} tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e5e5e5', 
                  borderRadius: '12px',
                  padding: '8px 12px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
                formatter={(value: number) => [formatRupiah(value), '']}
              />
              <Line type="monotone" dataKey="income" stroke="#047857" strokeWidth={2} dot={{ fill: '#047857', r: 4 }} name="Income" />
              <Line type="monotone" dataKey="expenses" stroke="#d97706" strokeWidth={2} dot={{ fill: '#d97706', r: 4 }} name="Expenses" />
              <Area 
                type="monotone" 
                dataKey="balance" 
                stroke="#065f46" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorBalance)"
                name="Balance"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Spending */}
        <div className="bg-card rounded-2xl p-6 shadow-md border border-border">
          <h3 className="font-semibold text-foreground mb-1">Budget Status</h3>
          <p className="text-sm text-muted-foreground mb-6">Spending per category vs budget</p>
          {categorySpending.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">No active budgets</p>
              <p className="text-xs mt-1">Create a budget to track spending</p>
            </div>
          ) : (
            <div className="space-y-5">
              {categorySpending.map((cat, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">{cat.categoryName}</span>
                    <span className={`text-xs font-semibold ${
                      cat.percentage >= 100 ? 'text-destructive' : cat.percentage >= 80 ? 'text-[#d97706]' : 'text-[#047857]'
                    }`}>
                      {cat.percentage.toFixed(0)}%
                    </span>
                  </div>
                  <div className="relative">
                    <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                      <div 
                        className={`h-2.5 rounded-full transition-all duration-500 ${
                          cat.percentage >= 100 
                            ? 'bg-destructive' 
                            : cat.percentage >= 80 
                            ? 'bg-orange-500' 
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(cat.percentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatRupiah(cat.spent)} of {formatRupiah(cat.budget)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-card rounded-2xl p-6 shadow-md border border-border">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold text-foreground mb-1">Recent Transactions</h3>
            <p className="text-sm text-muted-foreground">Your latest financial activity</p>
          </div>
        </div>
        {recentTransactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No transactions yet</p>
            <p className="text-xs mt-1">Start tracking your income and expenses</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/50 transition-all duration-200 border border-transparent hover:border-border">
                <div className="flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                    transaction.type === 'INCOME' 
                      ? 'bg-emerald-50 text-[#047857]' 
                      : 'bg-orange-50 text-[#d97706]'
                  }`}>
                    <CategoryIcon category={transaction.categoryName || 'Other'} className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{transaction.description || transaction.categoryName || 'Transaction'}</p>
                    <p className="text-sm text-muted-foreground">{transaction.categoryName || 'Uncategorized'} • {formatDate(transaction.transactionDate)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    transaction.type === 'INCOME' ? 'text-[#047857]' : 'text-destructive'
                  }`}>
                    {transaction.type === 'INCOME' ? '+' : '- '}{formatRupiah(Math.abs(transaction.amount))}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    transaction.status === 'COMPLETED' 
                      ? 'bg-emerald-50 text-[#047857]' 
                      : 'bg-orange-50 text-[#d97706]'
                  }`}>
                    {transaction.status === 'COMPLETED' ? 'Completed' : 'Pending'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
