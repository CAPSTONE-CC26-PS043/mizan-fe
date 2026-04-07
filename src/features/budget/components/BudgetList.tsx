import {
  Pencil, Trash2, ToggleLeft, ToggleRight,
  AlertCircle, CheckCircle2, Zap,
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Budget, BudgetIcon } from '@/types/budget.types';


interface BudgetListProps {
  budgets: Budget[];
  onEdit: (budget: Budget) => void;
  onDelete: (budget: Budget) => void;
  onToggleCarryOver: (budgetId: number) => void;
}


function formatRupiah(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
}


function getIconComponent(label: BudgetIcon): React.ElementType {
  return (LucideIcons as unknown as Record<string, React.ElementType>)[label] ?? LucideIcons.Wallet;
}


function getProgressColor(percentage: number): string {
  if (percentage >= 100) return 'bg-gradient-to-r from-[#dc2626] to-[#ef4444]';
  if (percentage >= 80)  return 'bg-gradient-to-r from-[#d97706] to-[#f59e0b]';
  return 'bg-gradient-to-r from-[#047857] to-[#059669]';
}


function getPercentageColor(percentage: number): string {
  if (percentage >= 100) return 'text-red-500';
  if (percentage >= 80)  return 'text-[#d97706]';
  return 'text-[#047857]';
}


export function BudgetList({ budgets, onEdit, onDelete, onToggleCarryOver }: BudgetListProps) {


  if (budgets.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <LucideIcons.Wallet className="w-12 h-12 mx-auto mb-3 opacity-30" />
        <p className="text-sm">No budgets yet. Create one to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {budgets.map((budget) => {
        const IconComp = getIconComponent(budget.icon);

        // Calculate effective allocated amount (including carry over)
        const effectiveAllocated = budget.allocated + budget.carryOverAmount;
        const percentage = effectiveAllocated > 0
          ? (budget.spent / effectiveAllocated) * 100
          : 0;
        const remaining = effectiveAllocated - budget.spent;
        const isOverBudget = percentage >= 100;
        const isWarning = percentage >= 80 && percentage < 100;

        return (
          <div
            key={budget.id}
            className="p-4 rounded-xl border border-border hover:shadow-md transition-all duration-200 bg-card group"
          >
            <div className="flex items-start justify-between mb-3">

              {/* Left: icon + name + badges */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${budget.color}20`, color: budget.color }}
                >
                  <IconComp className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-medium text-foreground">{budget.name}</h4>

                    {/* Zakat badge (FR-BDG-05) */}
                    {budget.isZakat && (
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                        <Zap className="w-3 h-3" /> Auto Zakat
                      </span>
                    )}

                    {/* Sedekah badge (FR-BDG-06) */}
                    {budget.isSedekah && !budget.isZakat && (
                      <span className="text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full font-medium">
                        Sedekah
                      </span>
                    )}

                    {/* Carry over badge (FR-BDG-07) */}
                    {budget.carryOver && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                        Carry Over
                      </span>
                    )}
                  </div>

                  {/* Spent / Allocated */}
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {formatRupiah(budget.spent)} of {formatRupiah(effectiveAllocated)}
                    {/* Show carry over amount if applicable */}
                    {budget.carryOverAmount > 0 && (
                      <span className="text-xs text-blue-500 ml-1">
                        (+{formatRupiah(budget.carryOverAmount)} carried)
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Right: percentage + actions */}
              <div className="flex items-center gap-2">
                <span className={`text-sm font-semibold ${getPercentageColor(percentage)}`}>
                  {percentage.toFixed(0)}%
                </span>

                {/* Action buttons — visible on hover */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">

                  {/* Toggle carry over (FR-BDG-07) — hide for zakat */}
                  {!budget.isZakat && (
                    <button
                      onClick={() => onToggleCarryOver(budget.id)}
                      className="p-1.5 rounded-lg hover:bg-blue-50 text-muted-foreground hover:text-blue-500 transition-colors"
                      title={budget.carryOver ? 'Disable carry over' : 'Enable carry over'}
                    >
                      {budget.carryOver
                        ? <ToggleRight className="w-4 h-4 text-blue-500" />
                        : <ToggleLeft className="w-4 h-4" />
                      }
                    </button>
                  )}

                  {/* Edit button */}
                  <button
                    onClick={() => onEdit(budget)}
                    className="p-1.5 rounded-lg hover:bg-emerald-50 text-muted-foreground hover:text-[#059669] transition-colors"
                    title="Edit budget"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>

                  {/* Delete button — hide for default budgets */}
                  {!budget.isDefault && (
                    <button
                      onClick={() => onDelete(budget)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors"
                      title="Delete budget"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-2.5 rounded-full transition-all duration-500 ${getProgressColor(percentage)}`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>

            {/* Status indicators */}
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-1.5">
                {/* Over budget alert */}
                {isOverBudget && (
                  <div className="flex items-center gap-1 text-xs text-red-500">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Over budget</span>
                  </div>
                )}
                {/* Warning alert */}
                {isWarning && (
                  <div className="flex items-center gap-1 text-xs text-[#d97706]">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Near limit</span>
                  </div>
                )}
                {/* On track */}
                {!isOverBudget && !isWarning && (
                  <div className="flex items-center gap-1 text-xs text-[#047857]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>On track</span>
                  </div>
                )}
              </div>

              {/* Remaining */}
              <p className="text-xs text-muted-foreground">
                {remaining >= 0
                  ? `${formatRupiah(remaining)} left`
                  : `${formatRupiah(Math.abs(remaining))} over`}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}