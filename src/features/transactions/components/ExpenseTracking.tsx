//  IMPORTS 
import { useState } from 'react';
import { Filter, Search, Download, Plus, TrendingUp, TrendingDown, Trash2, X } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TransactionForm } from '@/TransactionForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/shadcn/dialog';
import { Button } from '@/components/ui/shadcn/button';

//  DATA 
const weeklyExpenses = [
  { day: 'Mon', amount: 45 },
  { day: 'Tue', amount: 120 },
  { day: 'Wed', amount: 85 },
  { day: 'Thu', amount: 200 },
  { day: 'Fri', amount: 150 },
  { day: 'Sat', amount: 95 },
  { day: 'Sun', amount: 70 },
];

const categoryExpenses = [
  { category: 'Food', amount: 620 },
  { category: 'Housing', amount: 1500 },
  { category: 'Transport', amount: 285 },
  { category: 'Education', amount: 150 },
  { category: 'Charity', amount: 200 },
  { category: 'Shopping', amount: 95 },
];

const initialExpenses = [
  { id: 1, name: 'Grocery Shopping', category: 'Food', amount: 85.50, date: '2026-03-06', status: 'completed' },
  { id: 2, name: 'Monthly Rent', category: 'Housing', amount: 1200.00, date: '2026-03-05', status: 'completed' },
  { id: 3, name: 'Fuel', category: 'Transport', amount: 45.00, date: '2026-03-04', status: 'completed' },
  { id: 4, name: 'Online Course', category: 'Education', amount: 150.00, date: '2026-03-03', status: 'completed' },
  { id: 5, name: 'Zakat Payment', category: 'Charity', amount: 200.00, date: '2026-03-03', status: 'completed' },
  { id: 6, name: 'Restaurant', category: 'Food', amount: 42.00, date: '2026-03-02', status: 'completed' },
  { id: 7, name: 'Clothing', category: 'Shopping', amount: 95.00, date: '2026-03-01', status: 'completed' },
  { id: 8, name: 'Electricity Bill', category: 'Housing', amount: 120.00, date: '2026-02-28', status: 'completed' },
];

const allCategories = ['Food', 'Housing', 'Transport', 'Education', 'Charity', 'Shopping'];

//  COMPONENT 
export function ExpenseTracking() {
  //  STATE 
  const [isOpen, setIsOpen] = useState(false);
  const [expenses, setExpenses] = useState(initialExpenses);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showFilter, setShowFilter] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  //  DERIVED DATA 
  const filtered = expenses.filter((e) => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.category.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filterCategory === 'all' || e.category === filterCategory;
    return matchSearch && matchCategory;
  });

  const totalExpenses = filtered.reduce((sum, exp) => sum + exp.amount, 0);
  const avgDailyExpense = weeklyExpenses.reduce((sum, day) => sum + day.amount, 0) / 7;
  const largestExpense = filtered.reduce((max, exp) => exp.amount > max.amount ? exp : max, filtered[0]);
  const txToDelete = expenses.find((e) => e.id === deleteId);
  const hasFilter = search !== '' || filterCategory !== 'all';

  //  HANDLERS 
  const handleDelete = () => {
    if (deleteId === null) return;
    setExpenses((prev) => prev.filter((e) => e.id !== deleteId));
    setDeleteId(null);
  };

  const clearFilter = () => {
    setSearch('');
    setFilterCategory('all');
    setShowFilter(false);
  };

  return (
    <div className="space-y-6">
      {/*  HEADER  */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-foreground mb-1">Expense Tracking</h1>
          <p className="text-muted-foreground">Monitor and analyze your daily expenses.</p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-[#059669] to-[#10b981] text-white px-4 py-2.5 rounded-xl hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-200">
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">Add Transaction</span>
        </button>
      </div>
      <TransactionForm isOpen={isOpen} onOpenChange={setIsOpen} />

      {/*  STATS  */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
          <p className="text-sm text-muted-foreground mb-1">Total Expenses</p>
          <h3 className="text-2xl font-semibold text-foreground">${totalExpenses.toFixed(2)}</h3>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="w-4 h-4 text-destructive" />
            <span className="text-xs text-destructive">+8.5% from last month</span>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
          <p className="text-sm text-muted-foreground mb-1">Avg. Daily Expense</p>
          <h3 className="text-2xl font-semibold text-foreground">${avgDailyExpense.toFixed(2)}</h3>
          <div className="flex items-center gap-1 mt-2">
            <TrendingDown className="w-4 h-4 text-[#059669]" />
            <span className="text-xs text-[#059669]">-3.2% from last week</span>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
          <p className="text-sm text-muted-foreground mb-1">Largest Expense</p>
          <h3 className="text-2xl font-semibold text-foreground">${largestExpense?.amount.toFixed(2) ?? '0.00'}</h3>
          <p className="text-xs text-muted-foreground mt-2">{largestExpense?.name ?? '-'}</p>
        </div>

        <div className="bg-gradient-to-br from-[#059669] to-[#10b981] rounded-2xl p-6 shadow-lg text-white">
          <p className="text-sm opacity-90 mb-1">Total Transactions</p>
          <h3 className="text-2xl font-semibold">{filtered.length}</h3>
          <p className="text-xs opacity-75 mt-2">This month</p>
        </div>
      </div>

      {/*  CHARTS  */}
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
            <BarChart data={categoryExpenses}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="category" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '8px 12px' }} />
              <Bar dataKey="amount" fill="#047857" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/*  TRANSACTION LIST  */}
      <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
        {/* List Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h3 className="font-semibold text-foreground mb-1">All Transactions</h3>
            <p className="text-sm text-muted-foreground">Showing {filtered.length} of {expenses.length} transactions</p>
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
                className="pl-10 pr-4 py-2 bg-input-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]"
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <button
                onClick={() => setShowFilter(!showFilter)}
                className={`flex items-center gap-2 px-4 py-2 border rounded-xl transition-colors duration-200 ${showFilter ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'border-border hover:bg-muted'}`}>
                <Filter className="w-4 h-4" />
                <span className="text-sm">Filter</span>
              </button>
              {showFilter && (
                <div className="absolute right-0 top-11 bg-white border border-border rounded-xl shadow-lg z-10 p-3 w-48">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Category</p>
                  {['all', ...allCategories].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => { setFilterCategory(cat); setShowFilter(false); }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${filterCategory === cat ? 'bg-emerald-500 text-white' : 'hover:bg-muted'}`}>
                      {cat === 'all' ? 'All Categories' : cat}
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
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground text-sm">No transactions found</td>
                </tr>
              ) : (
                filtered.map((expense) => (
                  <tr key={expense.id} className="border-b border-border hover:bg-muted/50 transition-colors duration-200 group">
                    <td className="py-4 px-4">
                      <p className="font-medium text-foreground">{expense.name}</p>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-secondary text-secondary-foreground">
                        {expense.category}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-muted-foreground">
                      {new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="py-4 px-4 text-right font-semibold text-foreground">
                      ${expense.amount.toFixed(2)}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-[#f0fdf4] text-[#059669]">
                        {expense.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => setDeleteId(expense.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 text-muted-foreground">
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

      {/*  DELETE CONFIRMATION  */}
      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Transaction?</DialogTitle>
            <DialogDescription>
              {txToDelete && <>Transaction <strong>"{txToDelete.name}"</strong> of <strong>${txToDelete.amount.toFixed(2)}</strong> will be permanently deleted.</>}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteId(null)} className="flex-1">Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} className="flex-1">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}