import { ShoppingCart, Home, GraduationCap, Heart, Utensils, Car, Plus, TrendingUp, AlertCircle, Settings } from 'lucide-react';

const budgetCategories = [
  { id: 1, name: 'Food & Groceries', icon: Utensils, allocated: 800, spent: 620, color: '#047857', alert: false },
  { id: 2, name: 'Housing & Utilities', icon: Home, allocated: 1500, spent: 1500, color: '#d97706', alert: true },
  { id: 3, name: 'Transportation', icon: Car, allocated: 400, spent: 380, color: '#0891b2', alert: true },
  { id: 4, name: 'Education', icon: GraduationCap, allocated: 300, spent: 150, color: '#7c3aed', alert: false },
  { id: 5, name: 'Charity & Zakat', icon: Heart, allocated: 250, spent: 200, color: '#065f46', alert: false },
  { id: 6, name: 'Shopping', icon: ShoppingCart, allocated: 200, spent: 95, color: '#db2777', alert: false },
];

export function BudgetPlanning() {
  const totalAllocated = budgetCategories.reduce((sum, cat) => sum + cat.allocated, 0);
  const totalSpent = budgetCategories.reduce((sum, cat) => sum + cat.spent, 0);
  const remaining = totalAllocated - totalSpent;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground mb-1">Budget Planning</h1>
        <p className="text-muted-foreground">Manage your halal spending categories and track your monthly budget.</p>
      </div>

      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#059669] to-[#10b981] flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Budget</p>
            <h3 className="text-2xl font-semibold text-foreground">${totalAllocated.toFixed(2)}</h3>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#f59e0b] to-[#fbbf24] flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Spent</p>
            <h3 className="text-2xl font-semibold text-foreground">${totalSpent.toFixed(2)}</h3>
            <div className="mt-2">
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-[#f59e0b] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(totalSpent / totalAllocated) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#059669] to-[#10b981] rounded-2xl p-6 shadow-lg text-white">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <div>
            <p className="text-sm opacity-90 mb-1">Remaining Budget</p>
            <h3 className="text-2xl font-semibold">${remaining.toFixed(2)}</h3>
            <p className="text-xs opacity-75 mt-2">{((remaining / totalAllocated) * 100).toFixed(1)}% available</p>
          </div>
        </div>
      </div>

      {/* Budget Categories */}
      <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold text-foreground mb-1">Budget Categories</h3>
            <p className="text-sm text-muted-foreground">Track spending across halal categories</p>
          </div>
          <button className="flex items-center gap-2 bg-[#059669] text-white px-4 py-2 rounded-xl hover:bg-[#047857] transition-colors duration-200">
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Add Category</span>
          </button>
        </div>

        <div className="space-y-4">
          {budgetCategories.map((category) => {
            const IconComponent = category.icon;
            const percentage = (category.spent / category.allocated) * 100;
            const isOverBudget = percentage > 100;
            
            return (
              <div key={category.id} className="p-4 rounded-xl border border-border hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${category.color}20`, color: category.color }}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{category.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        ${category.spent.toFixed(2)} of ${category.allocated.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${isOverBudget ? 'text-destructive' : 'text-muted-foreground'}`}>
                      {percentage.toFixed(0)}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ${(category.allocated - category.spent).toFixed(2)} left
                    </p>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div 
                    className="h-2.5 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.min(percentage, 100)}%`,
                      backgroundColor: isOverBudget ? '#dc2626' : category.color
                    }}
                  ></div>
                </div>
                {category.alert && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-red-500">
                    <AlertCircle className="w-4 h-4" />
                    <span>Alert: Over budget</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Budget Tips */}
      <div className="bg-gradient-to-br from-[#f0fdf4] to-[#d1fae5] rounded-2xl p-6 border border-[#059669]/20">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
            <Heart className="w-6 h-6 text-[#059669]" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-foreground mb-1">Halal Budget Planning Tips</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Allocate 2.5% of savings for Zakat annually</li>
              <li>• Set aside funds for regular Sadaqah to help those in need</li>
              <li>• Prioritize essential needs (food, shelter, education) before wants</li>
              <li>• Avoid interest-based transactions and maintain ethical spending</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}