import { Plus, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { useBudget } from '@/hooks/useBudget';
import { BudgetList } from './BudgetList';
import { BudgetForm } from './BudgetForm';
import { BudgetDeleteDialog } from './BudgetDeleteDialog';

// ── Format rupiah display ─────────────────────────────────────
function formatRupiah(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
}

// ── Component ─────────────────────────────────────────────────
export function BudgetPlanning() {
  const {
    budgets,
    form,
    setForm,
    formErrors,
    apiError,
    isFormOpen,
    setIsFormOpen,
    isDeleteOpen,
    setIsDeleteOpen,
    activeBudget,
    summary,

    handleOpenCreate,
    handleOpenEdit,
    handleSubmitForm,
    handleOpenDelete,
    handleConfirmDelete,
    handleToggleCarryOver,
    handleUpdateCharityTarget,
  } = useBudget();

  // ── Derived lists ────────────────────────────────────────────
  // All budgets
  const allBudgets = budgets;

  // Overall spending percentage
  const overallPercentage = summary.totalAllocated > 0
    ? (summary.totalSpent / summary.totalAllocated) * 100
    : 0;

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-foreground mb-1">Budget Planning</h1>
          <p className="text-muted-foreground">
            Manage your halal spending categories and track your monthly budget.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-gradient-to-r from-[#059669] to-[#10b981] text-white px-4 py-2.5 rounded-xl hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">Add Budget</span>
        </button>
      </div>

      {/* ── Zakat Info Banner (FR-BDG-05) ── */}
      {/* <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
        <Info className="w-5 h-5 text-[#059669] mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-foreground">Auto Zakat Budget</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Based on your monthly income of{' '}
            <span className="font-medium text-foreground">{formatRupiah(DUMMY_MONTHLY_INCOME)}</span>,
            your zakat budget is automatically set to{' '}
            <span className="font-medium text-[#059669]">
              {formatRupiah(DUMMY_MONTHLY_INCOME * ZAKAT_RATE)}
            </span>{' '}
            ({(ZAKAT_RATE * 100).toFixed(1)}% of income).
          </p>
        </div>
      </div> */}

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Total Budget */}
        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#059669] to-[#10b981] flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Budget</p>
            <h3 className="text-2xl font-semibold text-foreground">
              {formatRupiah(summary.totalAllocated)}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Across {budgets.length} categories
            </p>
          </div>
        </div>

        {/* Total Spent */}
        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#f59e0b] to-[#fbbf24] flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Spent</p>
            <h3 className="text-2xl font-semibold text-foreground">
              {formatRupiah(summary.totalSpent)}
            </h3>
            {/* Overall progress bar */}
            <div className="mt-2">
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    overallPercentage >= 100
                      ? 'bg-red-500'
                      : overallPercentage >= 80
                      ? 'bg-[#f59e0b]'
                      : 'bg-[#059669]'
                  }`}
                  style={{ width: `${Math.min(overallPercentage, 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {overallPercentage.toFixed(1)}% of total budget used
              </p>
            </div>
          </div>
        </div>

        {/* Remaining */}
        <div className="bg-gradient-to-br from-[#059669] to-[#10b981] rounded-2xl p-6 shadow-lg text-white">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <div>
            <p className="text-sm opacity-90 mb-1">Remaining Budget</p>
            <h3 className="text-2xl font-semibold">
              {formatRupiah(summary.totalRemaining)}
            </h3>
            <p className="text-xs opacity-75 mt-1">
              {(100 - overallPercentage).toFixed(1)}% available
            </p>
          </div>
        </div>
      </div>

      {/* ── Sedekah Section  ── */}
      {/* {sedekahBudgets.length > 0 && (
        <BudgetSedekah
          sedekahBudgets={sedekahBudgets}
          onUpdateTarget={handleUpdateCharityTarget}
        />
      )} */}

      {/* ── Budget List (FR-BDG-04) ── */}
      <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold text-foreground mb-1">Budget Plannings</h3>
            <p className="text-sm text-muted-foreground">
              See your budget progress.
            </p>
          </div>
          {/* <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 text-sm text-[#059669] hover:text-[#047857] font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </button> */}
        </div>

        <BudgetList
          budgets={allBudgets}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
          onToggleCarryOver={handleToggleCarryOver}
        />
      </div>

      {/* ── Dialogs ── */}

      {/* Create / Edit form (FR-BDG-01, FR-BDG-02) */}
      <BudgetForm
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        form={form}
        setForm={setForm}
        formErrors={formErrors}
        apiError={apiError}
        activeBudget={activeBudget}
        onSubmit={handleSubmitForm}
      />

      {/* Delete confirmation (FR-BDG-03) */}
      <BudgetDeleteDialog
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        activeBudget={activeBudget}
        onConfirm={handleConfirmDelete}
      />

    </div>
  );
}