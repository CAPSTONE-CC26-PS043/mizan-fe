import { useState, useMemo } from 'react';
import { Budget, BudgetFormState, BudgetSummary } from '../types/budget.types';
import { Carrot, icons, InfoIcon } from 'lucide-react';


// Dummy Income
const DUMMY_MONTHLY_INCOME = 5000000;

//Zakat Rate
const ZAKAT_RATE = 0.025;     //2.5%

// Default Categories
const DEFAULT_BUDGETS: Budget [] = [
      {
            id: 1,
            name: 'Food & Groceries',
            icon: 'Utensils',
            color: '#047857',
            allocated: 1500000,
            spent: 930000,
            carryOver: false,
            carryOverAmount: 0,
            isSedekah: false,
            isZakat: false,
            isDefault: true,
      },
      {
            id: 2,
            name: 'Housing & Utilities',
            icon: 'Home',
            color: '#d97706',
            allocated: 200000,
            spent: 2000000,
            carryOver: false,
            carryOverAmount: 0,
            isSedekah: false,
            isZakat: false,
            isDefault: true
      },
      {
            id: 3,
            name: 'Transportation',
            icon: 'Car',
            color: '#0891b2',
            allocated: 6000000,
            spent: 570000,
            carryOver: false,
            carryOverAmount: 0,
            isSedekah: false,
            isZakat: false,
            isDefault: true
      },
      {
            id: 4,
            name: 'Education',
            icon: 'GraduationCap',
            color: '#065f46',
            allocated: 500000,
            spent: 150000,
            carryOver: false,
            carryOverAmount: 0,
            isSedekah: false,
            isZakat: false,
            isDefault: true
      },
      {
            id: 5,
            name: 'Charity',
            icon: 'Heart',
            color: '#065f46',
            allocated: 500000,
            spent: 200000,
            carryOver: false,
            carryOverAmount: 0,
            isSedekah: true,
            isZakat: false,
            isDefault: true
      },
      {
            id: 6,
            name: 'Zakat',
            icon: 'Heart',
            color: '#065f46',
            allocated: DUMMY_MONTHLY_INCOME * ZAKAT_RATE,
            spent: 0,
            carryOver: false,
            carryOverAmount: 0,
            isSedekah: false,
            isZakat: true,
            isDefault: true
      },
];


// State Empty Form
const EMPTY_FORM: BudgetFormState = {
      name: ' ',
      icon: 'Wallet',
      color: '#059669',
      allocated: ' ',
      carryOver: false,
      isSedekah: false
};


// useBudget Hook
export function useBudget() {
      //State
      const [budgets, setBudgets] = useState<Budget[]>(DEFAULT_BUDGETS);
      const [form, setForm] = useState<BudgetFormState>(EMPTY_FORM);
      const [formErrors, setFormErrors] = useState<Partial<BudgetFormState>>({});

      //Diaalog
      const [isFormOpen, setIsFormOpen] = useState(false);
      const [isDeleteOpen, setIsDeleteOpen] = useState(false);

      //Selected Budget (edit or delete)
      const [activeBudget, setActiveBudget] = useState<Budget | null>(null);

      //Summary Stats
      const summary: BudgetSummary = useMemo(() => {
            const totalAllocated = budgets.reduce((sum, b) => sum + b.allocated + b.carryOverAmount, 0);
            const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
            const totalRemaining = totalAllocated - totalSpent;
            const totalCarryOver = budgets
                  .filter((b) => b.carryOver)
                  .reduce((sum, b) => sum + Math.max(b.allocated + b.carryOverAmount - b.spent, 0), 0);

                  return { totalAllocated, totalSpent, totalRemaining, totalCarryOver };
      }, [budgets]);


      // Form Validation
      function validateForm(): boolean {
            const errors: Partial<BudgetFormState> = {};

            if (!form.name.trim()) errors.name = 'Budget name is required.';
            if (!form.allocated || Number(form.allocated) <= 0)
                  errors.allocated = 'Allocated amount must be greater than 0.';

            setFormErrors(errors);
            return Object.keys(errors).length === 0;
      }


      // Form for creating a new budget
      function handleOpenCreate() {
            setActiveBudget(null);
            setForm(EMPTY_FORM);
            setFormErrors({});
            setIsFormOpen(true);
      } 

      
      //  Form for edit Budget
      function handleOpenEdit(budget: Budget) {
            setActiveBudget(budget);
            setForm({
                  name: budget.name,
                  icon: budget.icon,
                  color: budget.color,
                  allocated: String(budget.allocated),
                  carryOver: budget.carryOver,
                  isSedekah: budget.isSedekah
            });
            setFormErrors({});
            setIsFormOpen(true)
      }

      
      // Submit Form
      function handleSubmitForm() {
            if (!validateForm()) return;

            if (activeBudget) {
                  // Edit Budget
                  setBudgets((prev) =>
                  prev.map((b) => 
                  b.id === activeBudget.id
                        ? {
                              ...b,
                              name: form.name.trim(),
                              icon: form.icon,
                              color: form.color,
                              allocated: Number(form.allocated),
                              carryOver: form.carryOver,
                              isSedekah: form.isSedekah,
                        }
                        : b
                  )
            );
            } else {
                  //Create New Budget
                  const newBudget: Budget = {
                        id:Date.now(),
                        name: form.name.trim(),
                        icon: form.icon,
                        color: form.color,
                        allocated: Number(form.allocated),
                        spent: 0,
                        carryOver: form.carryOver,
                        carryOverAmount: 0,
                        isSedekah: form.isSedekah,
                        isZakat: false,
                        isDefault: false
                  };
                  setBudgets((prev) => [...prev, newBudget]);
            }

            setIsFormOpen(false);
      }


      //Delete Confirmation
      function handleOpenDelete(budget: Budget) {
            setActiveBudget(budget);
            setIsDeleteOpen(true);
      }

      // Confirm Delete
      function handleConfirmDelete() {
            if (!activeBudget) return;

            setBudgets((prev) => prev.filter((b) => b.id != activeBudget.id));
            setIsDeleteOpen(false)
            setActiveBudget(null);
      }

      //Toggle Carry Over
      function handleToggleCarryOver(budgetId: number) {
            setBudgets((prev) =>
            prev.map((b) => {
                  if (b.id !== budgetId) return b;

                  const turningOn  = !b.carryOver;
                  return {
                        ...b,
                        carryOver: turningOn,
                        //Calculate when turning on
                        carryOverAmount: turningOn
                        ? Math.max(b.allocated - b.spent, 0)
                        : 0
                  };
            })
      );
      }


      //Update Charity
      function handleUpdateCharityTarget(amount: number) {
            setBudgets((prev) =>
            prev.map((b) => 
            b.isSedekah ? {...b, allocated: amount} : b
      )
      );
      }


      //Recalculate Zakat
      function recalculateZakat (income: number) {
            setBudgets((prev) => 
            prev.map((b) =>
            b.isZakat ? {...b, allocated: income * ZAKAT_RATE} : b
      )
      );
      }

      return {
            budgets,
            form,
            setForm,
            formErrors,
            isFormOpen,
            setIsFormOpen,
            isDeleteOpen,
            setIsDeleteOpen,
            activeBudget,
            summary,
            handleOpenCreate,
            handleConfirmDelete,
            handleOpenEdit,
            handleSubmitForm,
            handleOpenDelete,
            handleToggleCarryOver,
            handleUpdateCharityTarget,
            recalculateZakat,

            DUMMY_MONTHLY_INCOME,
            ZAKAT_RATE,
      };
}


