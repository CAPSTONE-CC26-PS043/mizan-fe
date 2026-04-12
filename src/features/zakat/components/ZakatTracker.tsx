import { Heart, TrendingUp, Calendar, DollarSign, Sparkles } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

function formatRupiah(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
}

export function ZakatTracker() {
  const zakatData = [
    { name: 'Zakat (Obligatory)', value: 0, color: '#065f46' },
    { name: 'Sadaqah (Voluntary)', value: 0, color: '#047857' },
    { name: 'Infaq (Spending)', value: 0, color: '#059669' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground mb-1">Zakat & Charity Tracker</h1>
        <p className="text-muted-foreground">Track your Islamic charitable contributions and fulfill your obligations.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Zakat Card */}
        <div className="bg-gradient-to-br from-[#059669] to-[#10b981] rounded-2xl p-6 shadow-lg text-white">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Heart className="w-6 h-6" />
            </div>
            <Sparkles className="w-5 h-5 opacity-80" />
          </div>
          <div>
            <p className="text-sm opacity-90 mb-1">Zakat Paid (This Year)</p>
            <h3 className="text-3xl font-semibold">{formatRupiah(0)}</h3>
            <p className="text-xs opacity-75 mt-2">2.5% of eligible wealth</p>
          </div>
        </div>

        {/* Sadaqah Card */}
        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#10b981] to-[#34d399] flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-[#10b981] bg-[#f0fdf4] px-2 py-1 rounded-full">Voluntary</span>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Sadaqah Given</p>
            <h3 className="text-2xl font-semibold text-foreground">{formatRupiah(0)}</h3>
          </div>
        </div>

        {/* Infaq Card */}
        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#34d399] to-[#6ee7b7] flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-[#059669] bg-[#f0fdf4] px-2 py-1 rounded-full">Regular</span>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Infaq Contributions</p>
            <h3 className="text-2xl font-semibold text-foreground">{formatRupiah(0)}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribution Chart */}
        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
          <div className="mb-6">
            <h3 className="font-semibold text-foreground mb-1">Charity Distribution</h3>
            <p className="text-sm text-muted-foreground">Breakdown of your charitable giving</p>
          </div>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Heart className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No charity data yet</p>
            </div>
          </div>
        </div>

        {/* Zakat Calculator */}
        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
          <div className="mb-6">
            <h3 className="font-semibold text-foreground mb-1">Zakat Calculator</h3>
            <p className="text-sm text-muted-foreground">Calculate your obligatory Zakat payment</p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Total Eligible Wealth</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input 
                  type="number" 
                  placeholder="0"
                  className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669]"
                />
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#f0fdf4] to-[#d1fae5] rounded-xl p-4 border border-[#059669]/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Zakat Due (2.5%)</span>
                <Heart className="w-4 h-4 text-[#059669]" />
              </div>
              <p className="text-2xl font-semibold text-[#059669]">{formatRupiah(0)}</p>
            </div>
            <button className="w-full bg-gradient-to-r from-[#059669] to-[#10b981] text-white py-3 px-4 rounded-xl hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-200">
              <span className="text-sm font-medium">Record Zakat Payment</span>
            </button>
          </div>
        </div>
      </div>

      {/* Charity History */}
      <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold text-foreground mb-1">Charity History</h3>
            <p className="text-sm text-muted-foreground">Your recent charitable contributions</p>
          </div>
        </div>
        <div className="text-center py-12 text-muted-foreground">
          <Heart className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No charity records yet</p>
          <p className="text-xs mt-1">Start tracking your charitable giving</p>
        </div>
      </div>

      {/* Nisab Threshold Info */}
      <div className="bg-gradient-to-br from-[#fef3c7] to-[#fde68a] rounded-2xl p-6 border border-[#d4af37]/20">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/80 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-[#d4af37]" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-foreground mb-1">Nisab Threshold Information</h4>
            <p className="text-sm text-muted-foreground mb-3">
              The current Nisab threshold is approximately Rp 85,000,000 (based on 85g of gold). 
              Zakat is obligatory on wealth that has been held for one lunar year and exceeds this threshold.
            </p>
            <p className="text-xs text-muted-foreground">
              Zakat rate: 2.5% of eligible wealth per year
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
