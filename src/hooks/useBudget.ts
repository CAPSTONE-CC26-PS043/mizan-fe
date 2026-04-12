import { useState, useMemo } from 'react';
import { useBudgets, useCreateBudget, useUpdateBudget, useDeleteBudget } from '@/features/budgets/hooks/useBudgets';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { BudgetFormState, BudgetSummary } from '../types/budget.types';

const EMPTY_FORM: BudgetFormState = {
  name: '',
  icon: 'Wallet',
  color: '#059669',
  allocated: '',
  carryOver: false,
  isSedekah: false
};

function parseAmount(value: string): number {
  return parseInt(value.replace(/\./g, ''), 10) || 0;
}

export function useBudget() {
  const { user } = useAuthStore();
  const { data: budgetsData, isLoading, refetch } = useBudgets();
  const createBudget = useCreateBudget();
  const updateBudget = useUpdateBudget();
  const deleteBudget = useDeleteBudget();

  const [form, setForm] = useState<BudgetFormState>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<Partial<BudgetFormState>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [activeBudget, setActiveBudget] = useState<any | null>(null);

  const budgets = budgetsData?.success && Array.isArray(budgetsData.data) 
    ? budgetsData.data.map((b: any) => ({
      id: b.id,
      name: b.name,
      icon: 'Wallet' as const,
      color: '#059669',
      allocated: b.amount,
      spent: 0,
      carryOver: false,
      carryOverAmount: 0,
      isSedekah: false,
      isZakat: false,
      isDefault: false,
    }))
    : [];

  const summary: BudgetSummary = useMemo(() => {
    const totalAllocated = budgets.reduce((sum: number, b: any) => sum + b.allocated + b.carryOverAmount, 0);
    const totalSpent = budgets.reduce((sum: number, b: any) => sum + b.spent, 0);
    const totalRemaining = totalAllocated - totalSpent;
    const totalCarryOver = budgets
      .filter((b: any) => b.carryOver)
      .reduce((sum: number, b: any) => sum + Math.max(b.allocated + b.carryOverAmount - b.spent, 0), 0);

    return { totalAllocated, totalSpent, totalRemaining, totalCarryOver };
  }, [budgets]);

  function validateForm(): boolean {
    const errors: Partial<BudgetFormState> = {};

    if (!form.name.trim()) errors.name = 'Budget name is required.';
    const amount = parseAmount(form.allocated);
    if (!form.allocated || amount <= 0)
      errors.allocated = 'Allocated amount must be greater than 0.';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleOpenCreate() {
    setActiveBudget(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
    setApiError(null);
    setIsFormOpen(true);
  }

  function handleOpenEdit(budget: any) {
    setActiveBudget(budget);
    setForm({
      name: budget.name,
      icon: budget.icon || 'Wallet',
      color: budget.color || '#059669',
      allocated: budget.allocated?.toString() || '0',
      carryOver: budget.carryOver || false,
      isSedekah: budget.isSedekah || false
    });
    setFormErrors({});
    setApiError(null);
    setIsFormOpen(true);
  }

  async function handleSubmitForm() {
    setApiError(null);
    if (!validateForm()) return;
    if (!user?.id) return;

    const amount = parseAmount(form.allocated);

    try {
      if (activeBudget) {
        const result = await updateBudget.mutateAsync({
          id: activeBudget.id,
          userId: user.id,
          data: {
            name: form.name.trim(),
            amount: amount,
          },
        });
        if (!result.success) {
          setApiError(result.message);
          return;
        }
      } else {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

        const result = await createBudget.mutateAsync({
          name: form.name.trim(),
          amount: amount,
          user_id: user.id,
          start_date: startOfMonth.toISOString(),
          end_date: endOfMonth.toISOString(),
        });
        if (!result.success) {
          setApiError(result.message);
          return;
        }
      }
      setIsFormOpen(false);
      refetch();
    } catch (error: any) {
      setApiError(error?.message || 'Failed to save budget. Please try again.');
    }
  }

  function handleOpenDelete(budget: any) {
    setActiveBudget(budget);
    setIsDeleteOpen(true);
  }

  async function handleConfirmDelete() {
    if (!activeBudget || !user?.id) return;

    try {
      await deleteBudget.mutateAsync({
        id: activeBudget.id,
        user_id: user.id,
      });
      setIsDeleteOpen(false);
      setActiveBudget(null);
      refetch();
    } catch (error) {
      console.error('Failed to delete budget:', error);
    }
  }

  function handleToggleCarryOver(budgetId: number) {
    console.log('Toggle carry over for budget:', budgetId);
  }

  function handleUpdateCharityTarget(amount: number) {
    console.log('Update charity target:', amount);
  }

  return {
    budgets,
    isLoading,
    form,
    setForm,
    formErrors,
    apiError,
    setApiError,
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
    refetch,
  };
}
