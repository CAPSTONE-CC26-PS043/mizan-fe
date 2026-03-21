import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/shadcn/dialog";
import { Input } from "@/components/ui/shadcn/input";
import { Button } from "@/components/ui/shadcn/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/select";

type TransactionType = "income" | "expense";

interface TransactionFormData {
  name: string;
  amount: string;
  category: string;
  type: TransactionType;
  date: string;
  description: string;
}

interface TransactionFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const incomeCategories = ["Income", "Savings", "etc."];

const expenseCategories = [
  "Food & Drinks",
  "Transportation",
  "Bill",
  "Shopping",
  "Health",
  "Education",
  "Zakat/alms",
  "etc.",
];

export function TransactionForm({ isOpen, onOpenChange }: TransactionFormProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [successType, setSuccessType] = useState<TransactionType>("income");
  const [form, setForm] = useState<TransactionFormData>({
    name: "",
    amount: "",
    category: "",
    type: "income",
    date: new Date().toISOString().split("T")[0],
    description: "",
  });

  const categories =
    form.type === "income" ? incomeCategories : expenseCategories;

  const formatRupiah = (value: string) => {
    const number = value.replace(/\D/g, "");
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatRupiah(e.target.value);
    setForm({ ...form, amount: formatted });
  };

  const handleSubmit = () => {
    if (!form.name || !form.amount || !form.category || !form.date) return;

    const newTransaction = {
      ...form,
      amount: parseInt(form.amount.replace(/\./g, "")),
      id: Date.now(),
    };

    console.log("Transaksi baru:", newTransaction);

    setSuccessType(form.type);
    setForm({
      name: "",
      amount: "",
      category: "",
      type: "income",
      date: new Date().toISOString().split("T")[0],
      description: "",
    });
    onOpenChange(false);

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const isFormValid = form.name && form.amount && form.category && form.date;

  return (
    <>
      {/* Notifikasi Sukses */}
      {showSuccess && (
        <div className={`fixed top-4 right-4 left-4 sm:left-auto sm:right-6 sm:top-6 sm:w-auto z-[9999] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl text-white transition-all duration-500 animate-in fade-in slide-in-from-top-4 ${
          successType === "income"
            ? "bg-gradient-to-r from-emerald-600 to-emerald-500"
            : "bg-gradient-to-r from-amber-600 to-amber-500"
        }`}>
          <span className="text-xl">
            {successType === "income" ? "💰" : "💸"}
          </span>
          <div>
            <p className="font-semibold text-sm">Berhasil!</p>
            <p className="text-xs opacity-90">
              {successType === "income"
                ? "Income added successfully"
                : "Expense added successfully"}
            </p>
          </div>
        </div>
      )}

      {/* Dialog */}
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="w-[95vw] max-w-md rounded-2xl p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg">Add Transaction</DialogTitle>
            <DialogDescription className="sr-only">
              Form to add a new transaction
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Toggle Tipe */}
            <div className="relative flex rounded-xl overflow-hidden border border-border">
              <div
                className={`absolute top-0 h-full w-1/2 transition-all duration-300 ease-in-out ${
                  form.type === "income"
                    ? "left-0 bg-gradient-to-r from-emerald-600 to-emerald-500"
                    : "left-1/2 bg-gradient-to-r from-amber-600 to-amber-500"
                }`}
              />
              <button
                onClick={() => setForm({ ...form, type: "income", category: "" })}
                className={`relative z-10 flex-1 py-2.5 text-sm font-medium transition-colors duration-300 ${
                  form.type === "income"
                    ? "text-white"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                ✦ Income
              </button>
              <button
                onClick={() => setForm({ ...form, type: "expense", category: "" })}
                className={`relative z-10 flex-1 py-2.5 text-sm font-medium transition-colors duration-300 ${
                  form.type === "expense"
                    ? "text-white"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                ✦ Expense
              </button>
            </div>

            {/* Transaction Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Transaction Name <span className="text-destructive">*</span>
              </label>
              <Input
                placeholder="Example: Monthly Salary"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            {/* Amount */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Amount <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                  Rp
                </span>
                <Input
                  placeholder="0"
                  value={form.amount}
                  onChange={handleAmountChange}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Category <span className="text-destructive">*</span>
              </label>
              <Select
                value={form.category}
                onValueChange={(val) => setForm({ ...form, category: val })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  className="bg-white w-[var(--radix-select-trigger-width)]"
                >
                  {categories.map((cat) => (
                    <SelectItem
                      key={cat}
                      value={cat}
                      className="hover:bg-emerald-500 hover:text-white focus:bg-emerald-500 focus:text-white cursor-pointer"
                    >
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Date <span className="text-destructive">*</span>
              </label>
              <Input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Description
              </label>
              <Input
                placeholder="Add Description (Optional)"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter className="flex-col-reverse sm:flex-row gap-2 mt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid}
              className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:shadow-lg hover:shadow-emerald-500/20"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}