// Types
import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/shadcn/dialog";
import { Input } from "@/components/ui/shadcn/input";
import { Button } from "@/components/ui/shadcn/button";

// Constants
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/shadcn/select";
import type { Transaction } from '@/types/transaction.types';
import { addTransaction } from '@/utils/storage.util';

type TransactionType = "income" | "expense";

interface FormState {
  name: string;
  amount: string;
  category: string;
  type: TransactionType;
  date: string;
  description: string;
}

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const incomeCategories = [
  "Salary",
  "Savings", 
  "Investment", 
  "Other"];
const expenseCategories = [
  "Food & Drinks", 
  "Transportation", 
  "Bills", 
  "Shopping",
  "Health", 
  "Education", 
  "Zakat/Charity", 
  "Other",
];

export function TransactionForm({ isOpen, onOpenChange }: Props) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [successType, setSuccessType] = useState<TransactionType>("income");
  const [form, setForm] = useState<FormState>({
    name: "", amount: "", category: "", type: "income",
    date: new Date().toISOString().split("T")[0], description: "",
  });

  const categories = form.type === "income" ? incomeCategories : expenseCategories;

  const formatRupiah = (value: string) =>
    value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  const handleSubmit = () => {
    if (!form.name || !form.amount || !form.category || !form.date) return;
    
    const amountNum = parseInt(form.amount.replace(/\./g, ""));
    const newTx: Omit<Transaction, 'id'> = {
      name: form.name,
      amount: form.type === 'income' ? amountNum : -amountNum,
      category: form.category,
      date: form.date,
      type: form.type,
      status: 'completed' as const,
      description: form.description || undefined
    };
    
    addTransaction(newTx);
    
    setSuccessType(form.type);
    setForm({ name: "", amount: "", category: "", type: "income", date: new Date().toISOString().split("T")[0], description: "" });
    onOpenChange(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const isFormValid = form.name && form.amount && form.category && form.date;

  return (
    <>
      {showSuccess && (
        <div className={`fixed top-6 right-6 z-[9999] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl text-white animate-in fade-in slide-in-from-top-4 ${
          successType === "income"
            ? "bg-gradient-to-r from-emerald-700 to-emerald-500"
            : "bg-gradient-to-r from-amber-600 to-amber-500"
        }`}>
          <span className="text-xl">{successType === "income" ? "💰" : "💸"}</span>
          <div>
            <p className="font-semibold text-sm">Success!</p>
            <p className="text-xs opacity-90">
              {successType === "income" ? "Income added successfully" : "Expense added successfully"}
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
                form.type === "income"
                  ? "left-0 bg-gradient-to-r from-emerald-700 to-emerald-500"
                  : "left-1/2 bg-gradient-to-r from-amber-600 to-amber-500"
              }`} />
              <button onClick={() => setForm({ ...form, type: "income", category: "" })}
                className={`relative z-10 flex-1 py-2.5 text-sm font-medium ${form.type === "income" ? "text-white" : "text-muted-foreground"}`}>
                ✦ Income
              </button>
              <button onClick={() => setForm({ ...form, type: "expense", category: "" })}
                className={`relative z-10 flex-1 py-2.5 text-sm font-medium ${form.type === "expense" ? "text-white" : "text-muted-foreground"}`}>
                ✦ Expense
              </button>
            </div>

            {/* Transaction Name*/}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Transaction Name <span className="text-destructive">*</span></label>
              <Input placeholder="e.g. Monthly Salary" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>

            {/* Amount*/}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Amount <span className="text-destructive">*</span></label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">Rp</span>
                <Input placeholder="0" value={form.amount} className="pl-9"
                  onChange={(e) => setForm({ ...form, amount: formatRupiah(e.target.value) })} />
              </div>
            </div>

            {/* Category*/}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Category <span className="text-destructive">*</span></label>
              <Select value={form.category} onValueChange={(val) => setForm({ ...form, category: val })}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Select category..." /></SelectTrigger>
                <SelectContent position="popper" className="bg-white w-[var(--radix-select-trigger-width)]">
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}
                      className="hover:bg-emerald-500 hover:text-white focus:bg-emerald-500 focus:text-white cursor-pointer">
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

              {/* Date*/}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Date <span className="text-destructive">*</span></label>
              <Input type="date" value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>

            {/* Description*/}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Description</label>
              <Input placeholder="Optional..." value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">Cancel</Button>
            <Button onClick={handleSubmit} disabled={!isFormValid}
              className="flex-1 bg-gradient-to-r from-emerald-700 to-emerald-500 text-white">
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}