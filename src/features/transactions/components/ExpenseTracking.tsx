import { useState } from 'react';
import { Filter, Search, Download, Plus, TrendingUp, TrendingDown, Trash2, X, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TransactionForm } from '@/TransactionForm';
import { CategoryTable } from '@/features/categories/components/CategoryTable';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription
} from '@/components/ui/shadcn/dialog';
import { Button } from '@/components/ui/shadcn/button';
import { useTransactions, useDeleteTransaction } from '@/features/transactions/hooks/useTransactions';
import { useCategories } from '@/features/categories/hooks/useCategories';
import { useAuthStore } from '@/features/auth/store/auth.store';
import type { Transaction } from '@/features/transactions/types/transaction.types';
import { toast } from 'sonner';

const weeklyExpenses = [
  { day: 'Mon', amount: 45000 },
  { day: 'Tue', amount: 120000 },
  { day: 'Wed', amount: 85000 },
  { day: 'Thu', amount: 200000 },
  { day: 'Fri', amount: 150000 },
  { day: 'Sat', amount: 95000 },
  { day: 'Sun', amount: 70000 },
];

export function ExpenseTracking() {
  const { user } = useAuthStore();
  const { data: transactionsData, isLoading, refetch, isFetching, error: transactionsError } = useTransactions();
  const { data: categoriesData, error: categoriesError } = useCategories();
  const deleteTransaction = useDeleteTransaction();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showFilter, setShowFilter] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showCategorySection, setShowCategorySection] = useState(false);

  const transactions: Transaction[] = transactionsData?.success && Array.isArray(transactionsData.data)
    ? transactionsData.data
    : [];

  const categories = categoriesData?.success && Array.isArray(categoriesData.data)
    ? categoriesData.data
    : [];

  const categoryMap = new Map(categories.map((c: { id: number; name: string }) => [c.id, c.name]));

  const filtered = transactions.filter((t: Transaction) => {
    const matchSearch = t.description?.toLowerCase().includes(search.toLowerCase()) ||
      categoryMap.get(t.category_id || 0)?.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filterCategory === 'all' || String(t.category_id) === filterCategory;
    return matchSearch && matchCategory;
  });

  const totalExpenses = filtered
    .filter((t: Transaction) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalIncome = filtered
    .filter((t: Transaction) => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);

  const avgDailyExpense = weeklyExpenses.reduce((sum, day) => sum + day.amount, 0) / 7;
  const largestExpense = filtered
    .filter((t: Transaction) => t.type === 'EXPENSE')
    .reduce((max, t) => t.amount > (max?.amount || 0) ? t : max, filtered[0] as Transaction | undefined);

  const txToDelete = transactions.find((t: Transaction) => t.id === deleteId);
  const hasFilter = search !== '' || filterCategory !== 'all';

  const handleDelete = async () => {
    if (deleteId === null || !user?.id) return;

    try {
      const result = await deleteTransaction.mutateAsync({
        id: deleteId,
        userId: user.id,
      });
      if (result.success) {
        toast.success('Transaction deleted successfully');
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error('Failed to delete transaction');
    }
    setDeleteId(null);
  };

  const clearFilter = () => {
    setSearch('');
    setFilterCategory('all');
    setShowFilter(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const categoryExpenses = categories
    .map((cat: { id: number; name: string }) => ({
      category: cat.name,
      amount: filtered
        .filter((t: Transaction) => t.category_id === cat.id && t.type === 'EXPENSE')
        .reduce((sum, t) => sum + t.amount, 0),
    }))
    .filter((c) => c.amount > 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 mx-auto mb-2 animate-spin text-emerald-600" />
          <p className="text-muted-foreground">Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-foreground mb-1">Transaction Tracking</h1>
          <p className="text-muted-foreground">Monitor and analyze your daily transactions.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowCategorySection(!showCategorySection)}
            className="flex items-center gap-2"
          >
            {showCategorySection ? 'Hide Categories' : 'Manage Categories'}
          </Button>
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-[#059669] to-[#10b981] text-white px-4 py-2.5 rounded-xl hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Add Transaction</span>
          </button>
        </div>
      </div>
      <TransactionForm isOpen={isFormOpen} onOpenChange={setIsFormOpen} onSuccess={refetch} />

      {/* Category Section */}
      {showCategorySection && (
        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
          <CategoryTable />
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
          <p className="text-sm text-muted-foreground mb-1">Total Expenses</p>
          <h3 className="text-2xl font-semibold text-destructive">{formatCurrency(totalExpenses)}</h3>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="w-4 h-4 text-destructive" />
            <span className="text-xs text-destructive">This month</span>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
          <p className="text-sm text-muted-foreground mb-1">Total Income</p>
          <h3 className="text-2xl font-semibold text-emerald-600">{formatCurrency(totalIncome)}</h3>
          <div className="flex items-center gap-1 mt-2">
            <TrendingDown className="w-4 h-4 text-emerald-600" />
            <span className="text-xs text-emerald-600">This month</span>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
          <p className="text-sm text-muted-foreground mb-1">Avg. Daily Expense</p>
          <h3 className="text-2xl font-semibold text-foreground">{formatCurrency(avgDailyExpense)}</h3>
          <div className="flex items-center gap-1 mt-2">
            <TrendingDown className="w-4 h-4 text-[#059669]" />
            <span className="text-xs text-[#059669]">Weekly average</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#059669] to-[#10b981] rounded-2xl p-6 shadow-lg text-white">
          <p className="text-sm opacity-90 mb-1">Total Transactions</p>
          <h3 className="text-2xl font-semibold">{filtered.length}</h3>
          <p className="text-xs opacity-75 mt-2">This month</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
          <div className="mb-6">
            <h3 className="font-semibold text-foreground mb-1">Weekly Expense Trend</h3>
            <p className="text-sm text-muted-foreground">Daily spending over the last 7 days</p>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={weeklyExpenses}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '8px 12px' }} />
              <Line type="monotone" dataKey="amount" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
          <div className="mb-6">
            <h3 className="font-semibold text-foreground mb-1">Expense by Category</h3>
            <p className="text-sm text-muted-foreground">Spending breakdown across categories</p>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={categoryExpenses.length > 0 ? categoryExpenses : [{ category: 'No Data', amount: 0 }]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="category" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '8px 12px' }} />
              <Bar dataKey="amount" fill="#047857" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
        {/* List Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h3 className="font-semibold text-foreground mb-1">All Transactions</h3>
            <p className="text-sm text-muted-foreground">Showing {filtered.length} of {transactions.length} transactions</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 bg-input border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]"
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <button
                onClick={() => setShowFilter(!showFilter)}
                className={`flex items-center gap-2 px-4 py-2 border rounded-xl transition-colors duration-200 ${showFilter ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'border-border hover:bg-muted'}`}
              >
                <Filter className="w-4 h-4" />
                <span className="text-sm">Filter</span>
              </button>
              {showFilter && (
                <div className="absolute right-0 top-11 bg-white border border-border rounded-xl shadow-lg z-10 p-3 w-48">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Category</p>
                  {['all', ...categories.map((c: { id: number; name: string }) => ({ id: String(c.id), name: c.name }))].map((cat) => (
                    <button
                      key={String(cat.id)}
                      onClick={() => { setFilterCategory(String(cat.id)); setShowFilter(false); }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${filterCategory === String(cat.id) ? 'bg-emerald-500 text-white' : 'hover:bg-muted'}`}
                    >
                      {cat.name === 'all' ? 'All Categories' : cat.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Clear Filter */}
            {hasFilter && (
              <button onClick={clearFilter} className="p-2 border border-border rounded-xl hover:bg-muted transition-colors">
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Refresh */}
            <button
              onClick={() => refetch()}
              className="p-2 border border-border rounded-xl hover:bg-muted transition-colors"
              disabled={isFetching}
            >
              <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
            </button>

            {/* Export */}
            <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-xl hover:bg-muted transition-colors duration-200">
              <Download className="w-4 h-4" />
              <span className="text-sm">Export</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Description</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Category</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Type</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground text-sm">
                    No transactions found
                  </td>
                </tr>
              ) : (
                filtered.map((transaction: Transaction) => (
                  <tr key={transaction.id} className="border-b border-border hover:bg-muted/50 transition-colors duration-200 group">
                    <td className="py-4 px-4">
                      <p className="font-medium text-foreground">{transaction.description || '-'}</p>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-secondary text-secondary-foreground">
                        {categoryMap.get(transaction.category_id || 0) || '-'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        transaction.type === 'INCOME'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {transaction.type === 'INCOME' ? 'Income' : 'Expense'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-muted-foreground">
                      {new Date(transaction.transaction_date).toLocaleDateString('id-ID', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                    <td className={`py-4 px-4 text-right font-semibold ${
                      transaction.type === 'INCOME' ? 'text-emerald-600' : 'text-foreground'
                    }`}>
                      {transaction.type === 'INCOME' ? '+' : '-'}
                      {formatCurrency(Math.abs(transaction.amount))}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-emerald-100 text-emerald-700">
                        {transaction.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => setDeleteId(transaction.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 text-muted-foreground"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation */}
      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Transaction?</DialogTitle>
            <DialogDescription>
              {txToDelete && <>Transaction <strong>"{txToDelete.description || 'N/A'}"</strong> will be deleted permanently.</>}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteId(null)} className="flex-1">Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} className="flex-1" disabled={deleteTransaction.isPending}>
              {deleteTransaction.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
