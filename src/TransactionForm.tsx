import { useState } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/shadcn/dialog';
import { Input } from '@/components/ui/shadcn/input';
import { Button } from '@/components/ui/shadcn/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/shadcn/select';
import { useCreateTransaction } from '@/features/transactions/hooks/useTransactions';
import { useCategories } from '@/features/categories/hooks/useCategories';
import { useWallets } from '@/features/wallets/hooks/useWallets';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { toast } from 'sonner';
import type { TransactionType } from '@/features/transactions/types/transaction.types';
import type { Category } from '@/features/categories/types/category.types';
import type { Wallet } from '@/features/wallets/types/wallet.types';

type FormState = {
  description: string;
  amount: string;
  category_id: string;
  wallet_id: string;
  type: TransactionType;
  transaction_date: string;
};

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function TransactionForm({ isOpen, onOpenChange, onSuccess }: Props) {
  const { user } = useAuthStore();
  const { data: categoriesData } = useCategories();
  const { data: walletsData } = useWallets();
  const createTransaction = useCreateTransaction();

  const [showSuccess, setShowSuccess] = useState(false);
  const [successType, setSuccessType] = useState<TransactionType>('INCOME');
  const [form, setForm] = useState<FormState>({
    description: '',
    amount: '',
    category_id: '',
    wallet_id: '',
    type: 'INCOME',
    transaction_date: new Date().toISOString().split('T')[0],
  });
  const [formError, setFormError] = useState<string | null>(null);

  const categories = categoriesData?.success && Array.isArray(categoriesData.data)
    ? categoriesData.data as Category[]
    : [];

  const wallets = walletsData?.success && Array.isArray(walletsData.data)
    ? walletsData.data as Wallet[]
    : [];

  const filteredCategories = categories.filter((c: Category) => c.is_default || c.user_id === user?.id);

  const formatRupiah = (value: string) =>
    value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  const handleSubmit = async () => {
    setFormError(null);

    if (!form.description || !form.amount || !form.category_id || !form.wallet_id || !form.transaction_date) {
      setFormError('Please fill in all required fields');
      return;
    }

    if (!user?.id) {
      setFormError('User not authenticated');
      return;
    }

    const amountNum = parseInt(form.amount.replace(/\./g, ''));

    const payload = {
      description: form.description,
      amount: amountNum,
      category_id: parseInt(form.category_id),
      type: form.type,
      transaction_date: form.transaction_date,
      user_id: user.id,
      source: 'MANUAL',
      status: 'COMPLETED',
      wallet_id: parseInt(form.wallet_id),
    };

    try {
      const result = await createTransaction.mutateAsync(payload);

      if (result.success) {
        setSuccessType(form.type);
        setForm({
          description: '',
          amount: '',
          category_id: '',
          wallet_id: '',
          type: 'INCOME',
          transaction_date: new Date().toISOString().split('T')[0],
        });
        onOpenChange(false);
        setShowSuccess(true);
        onSuccess?.();
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        setFormError(result.message);
      }
    } catch {
      setFormError('Failed to create transaction. Please try again.');
    }
  };

  const isFormValid = form.description && form.amount && form.category_id && form.wallet_id && form.transaction_date;

  return (
    <>
      {showSuccess && (
        <div className={`fixed top-6 right-6 z-[9999] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl text-white animate-in fade-in slide-in-from-top-4 ${
          successType === 'INCOME'
            ? 'bg-gradient-to-r from-emerald-700 to-emerald-500'
            : 'bg-gradient-to-r from-amber-600 to-amber-500'
        }`}>
          <span className="text-xl">{successType === 'INCOME' ? '💰' : '💸'}</span>
          <div>
            <p className="font-semibold text-sm">Success!</p>
            <p className="text-xs opacity-90">
              {successType === 'INCOME' ? 'Income added successfully' : 'Expense added successfully'}
            </p>
          </div>
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Transaction</DialogTitle>
            <DialogDescription className="sr-only">Form to add a new transaction</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Toggle */}
            <div className="relative flex rounded-xl overflow-hidden border border-border">
              <div className={`absolute top-0 h-full w-1/2 transition-all duration-300 ${
                form.type === 'INCOME'
                  ? 'left-0 bg-gradient-to-r from-emerald-700 to-emerald-500'
                  : 'left-1/2 bg-gradient-to-r from-amber-600 to-amber-500'
              }`} />
              <button
                onClick={() => setForm({ ...form, type: 'INCOME', category_id: '' })}
                className={`relative z-10 flex-1 py-2.5 text-sm font-medium ${form.type === 'INCOME' ? 'text-white' : 'text-muted-foreground'}`}
              >
                ✦ Income
              </button>
              <button
                onClick={() => setForm({ ...form, type: 'EXPENSE', category_id: '' })}
                className={`relative z-10 flex-1 py-2.5 text-sm font-medium ${form.type === 'EXPENSE' ? 'text-white' : 'text-muted-foreground'}`}
              >
                ✦ Expense
              </button>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                Description <span className="text-destructive">*</span>
              </label>
              <Input
                placeholder="e.g., Monthly Salary, Grocery Shopping"
                value={form.description}
                onChange={(e) => {
                  setForm({ ...form, description: e.target.value });
                  setFormError(null);
                }}
              />
            </div>

            {/* Amount */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                Amount <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">Rp</span>
                <Input
                  placeholder="0"
                  value={form.amount}
                  className="pl-9"
                  onChange={(e) => setForm({ ...form, amount: formatRupiah(e.target.value) })}
                />
              </div>
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                Category <span className="text-destructive">*</span>
              </label>
              <Select value={form.category_id} onValueChange={(val) => {
                setForm({ ...form, category_id: val });
                setFormError(null);
              }}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category..." />
                </SelectTrigger>
                <SelectContent position="popper" className="bg-white w-[var(--radix-select-trigger-width)]">
                  {filteredCategories.length === 0 ? (
                    <div className="px-4 py-2 text-sm text-muted-foreground">
                      No categories available. Create one first.
                    </div>
                  ) : (
                    filteredCategories.map((cat: Category) => (
                      <SelectItem
                        key={cat.id}
                        value={String(cat.id)}
                        className="hover:bg-emerald-500 hover:text-white focus:bg-emerald-500 focus:text-white cursor-pointer"
                      >
                        {cat.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Wallet */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                Wallet <span className="text-destructive">*</span>
              </label>
              <Select 
                value={form.wallet_id} 
                onValueChange={(val) => {
                  setForm({ ...form, wallet_id: val });
                  setFormError(null);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select wallet..." />
                </SelectTrigger>
                <SelectContent position="popper" className="bg-white w-[var(--radix-select-trigger-width)]">
                  {wallets.length === 0 ? (
                    <div className="px-4 py-2 text-sm text-muted-foreground">
                      No wallets available. Create one first.
                    </div>
                  ) : (
                    wallets.map((wallet: Wallet) => (
                      <SelectItem
                        key={wallet.id}
                        value={String(wallet.id)}
                        className="hover:bg-emerald-500 hover:text-white focus:bg-emerald-500 focus:text-white cursor-pointer"
                      >
                        {wallet.name} (Rp {wallet.current_balance.toLocaleString('id-ID')})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Date */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                Date <span className="text-destructive">*</span>
              </label>
              <Input
                type="date"
                value={form.transaction_date}
                onChange={(e) => setForm({ ...form, transaction_date: e.target.value })}
              />
            </div>

            {/* Error Message */}
            {formError && (
              <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{formError}</p>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">Cancel</Button>
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid || createTransaction.isPending}
              className="flex-1 bg-gradient-to-r from-emerald-700 to-emerald-500 text-white"
            >
              {createTransaction.isPending ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
