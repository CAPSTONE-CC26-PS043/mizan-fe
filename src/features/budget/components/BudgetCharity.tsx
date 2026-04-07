
import { useState } from 'react';
import { Heart, TrendingUp, Edit2, Check, X } from 'lucide-react';
import { Budget } from '@/types/budget.types';


interface BudgetSedekahProps {
  sedekahBudgets: Budget[];
  onUpdateTarget: (amount: number) => void;
}


function formatRupiah(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
}


function formatRupiahInput(value: string): string {
  return value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}


export function BudgetSedekah({ sedekahBudgets, onUpdateTarget }: BudgetSedekahProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');


  const totalAllocated = sedekahBudgets.reduce((sum, b) => sum + b.allocated, 0);
  const totalSpent = sedekahBudgets.reduce((sum, b) => sum + b.spent, 0);
  const percentage = totalAllocated > 0 ? (totalSpent / totalAllocated) * 100 : 0;
  const remaining = totalAllocated - totalSpent;


  function handleEditStart() {

    setInputValue(String(totalAllocated));
    setIsEditing(true);
  }

  function handleEditConfirm() {
    const amount = Number(inputValue.replace(/\./g, ''));
    if (amount > 0) {
      onUpdateTarget(amount);
    }
    setIsEditing(false);
  }

  function handleEditCancel() {
    setIsEditing(false);
    setInputValue('');
  }


  if (sedekahBudgets.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-[#f0fdf4] to-[#d1fae5] rounded-2xl p-6 border border-[#059669]/20">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#059669] flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Sedekah Budget</h3>
            <p className="text-xs text-muted-foreground">Monthly charitable giving target</p>
          </div>
        </div>

        {/* Edit target button */}
        {!isEditing && (
          <button
            onClick={handleEditStart}
            className="flex items-center gap-1.5 text-xs text-[#059669] hover:text-[#047857] font-medium"
          >
            <Edit2 className="w-3.5 h-3.5" />
            Edit Target
          </button>
        )}
      </div>

      {/* Target amount — editable */}
      <div className="mb-4">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">Rp</span>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(formatRupiahInput(e.target.value))}
                className="w-full border border-[#059669] rounded-xl pl-9 pr-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#059669]"
                autoFocus
              />
            </div>
            {/* Confirm */}
            <button
              onClick={handleEditConfirm}
              className="p-2 rounded-xl bg-[#059669] text-white hover:bg-[#047857] transition-colors"
            >
              <Check className="w-4 h-4" />
            </button>
            {/* Cancel */}
            <button
              onClick={handleEditCancel}
              className="p-2 rounded-xl border border-border hover:bg-muted transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Target</p>
              <p className="text-2xl font-semibold text-foreground">{formatRupiah(totalAllocated)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground mb-0.5">Realized</p>
              <p className="text-lg font-semibold text-[#059669]">{formatRupiah(totalSpent)}</p>
            </div>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
          <span>{percentage.toFixed(0)}% of target reached</span>
          <span>{formatRupiah(remaining)} remaining</span>
        </div>
        <div className="w-full bg-white/60 rounded-full h-3 overflow-hidden">
          <div
            className="h-3 rounded-full transition-all duration-500 bg-gradient-to-r from-[#047857] to-[#059669]"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Motivational note */}
      <div className="flex items-center gap-2 mt-4">
        <TrendingUp className="w-4 h-4 text-[#059669]" />
        <p className="text-xs text-muted-foreground">
          {percentage >= 100
            ? 'MashaAllah! You have reached your sedekah target this month.'
            : `Keep giving! You need ${formatRupiah(remaining)} more to reach your target.`}
        </p>
      </div>
    </div>
  );
}