import React from 'react';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  ShoppingCart,
  Truck,
  Home,
  CreditCard,
  Heart
} from 'lucide-react';
import { getRecentTransactions } from '@/utils/storage.util';
import type { Transaction } from '@/types/transaction.types';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const balanceData = [
  { month: 'Jan', balance: 5000, income: 4500, expenses: 2900 },
  { month: 'Feb', balance: 5800, income: 4500, expenses: 2800 },
  { month: 'Mar', balance: 6200, income: 4800, expenses: 3100 },
  { month: 'Apr', balance: 5900, income: 4500, expenses: 3200 },
  { month: 'May', balance: 6800, income: 5200, expenses: 2800 },
  { month: 'Jun', balance: 7500, income: 4500, expenses: 2850 },
];

const categorySpending = [
  { category: 'Tempat Tinggal', spent: 1500, budget: 1500, percentage: 100 },
  { category: 'Makanan', spent: 620, budget: 800, percentage: 77.5 },
  { category: 'Transportasi', spent: 285, budget: 400, percentage: 71.25 },
  { category: 'Sedekah', spent: 200, budget: 250, percentage: 80 },
];

interface CategoryIconProps {
  category: string;
  className?: string;
}

function CategoryIcon({ category, className }: CategoryIconProps) {
  const icons: Record<string, React.ComponentType<any>> = {
    'Makanan': ShoppingCart,
    'Pemasukan': TrendingUp,
    'Sedekah': Heart,
    'Tagihan': CreditCard,
    'Belanja': ShoppingCart,
    'Transportasi': Truck,
    'Tempat Tinggal': Home,
    'Salary': TrendingUp,
    'Food & Drinks': ShoppingCart,
    'Transportation': Truck,
    'Bills': CreditCard,
    'Shopping': ShoppingCart,
    'Health': Heart,
    'Education': TrendingUp,
    'Zakat/Charity': Heart,
    'Other': DollarSign
  };
  
  const IconComponent = icons[category] || DollarSign;
  return <IconComponent className={className} />;
}

const recentTransactions: Transaction[] = getRecentTransactions(5).map(t => ({
  ...t,
  date: new Date(t.date).toLocaleDateString('id-ID', { 
    weekday: 'short', 
    day: 'numeric', 
    month: 'short', 
    hour: 'numeric', 
    minute: '2-digit' 
  })
}));

const alerts = [
  { id: 1, type: 'warning', title: 'Anggaran Tempat Tinggal Tercapai', message: 'Kamu sudah mencapai 100% anggaran tempat tinggal', category: 'Housing' },
  { id: 2, type: 'success', title: 'Target Tabungan di Jalur yang Tepat', message: 'Bagus! Kamu sudah memenuhi target tabungan 35%', category: 'Savings' },
];

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground mb-1">Ringkasan Keuangan</h1>
          <p className="text-muted-foreground">Selamat Datang Kembali, Ini ringkasan keuangan kamu hari ini</p>
        </div>
      </div>
      {/* Alerts Section */}
      {alerts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alerts.map((alert) => (
            <div 
              key={alert.id}
              className={`p-4 rounded-2xl border-2 ${
                alert.type === 'warning' 
                  ? 'bg-orange-50 border-[#d97706]' 
                  : 'bg-emerald-50 border-[#047857]'
              }`}
            >
              <div className="flex items-start gap-3">
                {alert.type === 'warning' ? (
                  <AlertTriangle className="w-5 h-5 text-[#d97706] mt-0.5 flex-shrink-0" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-[#047857] mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">{alert.title}</h4>
                  <p className="text-sm text-muted-foreground">{alert.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Balance Card */}
        <div className="bg-gradient-to-br from-[#065f46] to-[#047857] rounded-2xl p-6 shadow-xl shadow-emerald-900/20 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
          <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Wallet className="w-6 h-6" />
              </div>
              <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full">+12.5%</span>
            </div>
            <div>
              <p className="text-sm opacity-90 mb-1">Total Saldo</p>
              <h3 className="text-3xl font-semibold">Rp 10.000</h3>
            </div>
          </div>
        </div>

        {/* Income Card */}
        <div className="bg-card rounded-2xl p-6 shadow-md border border-border">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#047857] to-[#059669] flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <ArrowUpRight className="w-5 h-5 text-[#047857]" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Pemasukan Bulan Ini</p>
            <h3 className="text-2xl font-semibold text-foreground">Rp 150.000</h3>
            <p className="text-xs text-muted-foreground mt-2">Dari 3 Sumber</p>
          </div>
        </div>

        {/* Expenses Card */}
        <div className="bg-card rounded-2xl p-6 shadow-md border border-border">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#d97706] to-[#f59e0b] flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-white" />
            </div>
            <ArrowDownRight className="w-5 h-5 text-[#d97706]" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Pengeluaran Bulan Ini</p>
            <h3 className="text-2xl font-semibold text-foreground">Rp 2.000.000</h3>
            <p className="text-xs text-muted-foreground mt-2">63% Dari Pemasukan</p>
          </div>
        </div>

        {/* Savings Card */}
        <div className="bg-card rounded-2xl p-6 shadow-md border border-border">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] flex items-center justify-center">
              <PiggyBank className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-[#7c3aed] bg-purple-50 px-2.5 py-1 rounded-full">36.7%</span>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Tabungan Bersih</p>
            <h3 className="text-2xl font-semibold text-foreground">- Rp 2.150.000</h3>
            <p className="text-xs text-muted-foreground mt-2">Di atas target</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Balance Trend Chart */}
        <div className="lg:col-span-2 bg-card rounded-2xl p-6 shadow-md border border-border">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-foreground">Performa Keuangan</h3>
              <div className="flex items-center gap-2">
                <button className="text-xs px-3 py-1.5 bg-muted rounded-lg">6M</button>
                <button className="text-xs px-3 py-1.5 bg-[#065f46] text-white rounded-lg">1Y</button>
                <button className="text-xs px-3 py-1.5 bg-muted rounded-lg">ALL</button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Tren pemasukan, pengeluaran, dan saldo</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={balanceData}>
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#047857" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#047857" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis dataKey="month" stroke="#737373" fontSize={12} />
              <YAxis stroke="#737373" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e5e5e5', 
                  borderRadius: '12px',
                  padding: '8px 12px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }} 
              />
              <Line type="monotone" dataKey="income" stroke="#047857" strokeWidth={2} dot={{ fill: '#047857', r: 4 }} />
              <Line type="monotone" dataKey="expenses" stroke="#d97706" strokeWidth={2} dot={{ fill: '#d97706', r: 4 }} />
              <Area 
                type="monotone" 
                dataKey="balance" 
                stroke="#065f46" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorBalance)" 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Spending */}
        <div className="bg-card rounded-2xl p-6 shadow-md border border-border">
          <h3 className="font-semibold text-foreground mb-1">Status Anggaran</h3>
          <p className="text-sm text-muted-foreground mb-6">Pengeluaran per kategori vs batas</p>
          <div className="space-y-5">
            {categorySpending.map((cat, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">{cat.category}</span>
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
                  Rp {cat.spent.toLocaleString('id-ID')} of Rp {cat.budget.toLocaleString('id-ID')}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-card rounded-2xl p-6 shadow-md border border-border">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-foreground mb-1">Transaksi Terbaru</h3>
              <p className="text-sm text-muted-foreground">Aktivitas keuangan terbaru kamu</p>
            </div>
            <button className="text-sm text-[#065f46] hover:text-[#047857] font-medium">
              Lihat Semua
            </button>
          </div>
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/50 transition-all duration-200 border border-transparent hover:border-border">
                <div className="flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                    transaction.type === 'income' 
                      ? 'bg-emerald-50 text-[#047857]' 
                      : 'bg-orange-50 text-[#d97706]'
                  }`}>
                    <CategoryIcon category={transaction.category} className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{transaction.name}</p>
                    <p className="text-sm text-muted-foreground">{transaction.category} • {transaction.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    transaction.type === 'income' ? 'text-[#047857]' : 'text-destructive'
                  }`}>
                    {transaction.type === 'income' ? '+' : ''}Rp {Math.abs(transaction.amount).toLocaleString('id-ID')}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    transaction.status === 'completed' 
                      ? 'bg-emerald-50 text-[#047857]' 
                      : 'bg-orange-50 text-[#d97706]'
                  }`}>
                    {transaction.status === 'completed' ? 'Selesai' : 'Tertunda'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

