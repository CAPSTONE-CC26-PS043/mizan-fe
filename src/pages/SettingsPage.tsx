//  IMPORTS 
import { useState } from 'react';
import { Tag, Plus, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/shadcn/dialog';
import { Button } from '@/components/ui/shadcn/button';
import { Input } from '@/components/ui/shadcn/input';

//  TYPES 
type CategoryType = 'income' | 'expense';

interface Category {
  id: string;
  name: string;
  type: CategoryType;
  isCustom: boolean;
}

//  DATA 
const initialCategories: Category[] = [
  { id: 'salary', name: 'Salary', type: 'income', isCustom: false },
  { id: 'savings', name: 'Savings', type: 'income', isCustom: false },
  { id: 'investment', name: 'Investment', type: 'income', isCustom: false },
  { id: 'other-in', name: 'Other', type: 'income', isCustom: false },
  { id: 'food', name: 'Food & Drinks', type: 'expense', isCustom: false },
  { id: 'transport', name: 'Transportation', type: 'expense', isCustom: false },
  { id: 'bills', name: 'Bills', type: 'expense', isCustom: false },
  { id: 'shopping', name: 'Shopping', type: 'expense', isCustom: false },
  { id: 'health', name: 'Health', type: 'expense', isCustom: false },
  { id: 'education', name: 'Education', type: 'expense', isCustom: false },
  { id: 'zakat', name: 'Zakat/Charity', type: 'expense', isCustom: false },
  { id: 'other-out', name: 'Other', type: 'expense', isCustom: false },
];

//  COMPONENT 
export default function SettingsPage() {
  //  STATE 
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isOpen, setIsOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', type: 'expense' as CategoryType });

  //  DERIVED DATA 
  const incomeCategories = categories.filter((c) => c.type === 'income');
  const expenseCategories = categories.filter((c) => c.type === 'expense');
  const categoryToDelete = categories.find((c) => c.id === deleteId);

  //  HANDLERS 
  const handleAdd = () => {
    if (!form.name.trim()) return;
    const newCategory: Category = {
      id: `custom_${Date.now()}`,
      name: form.name.trim(),
      type: form.type,
      isCustom: true,
    };
    setCategories((prev) => [...prev, newCategory]);
    setForm({ name: '', type: 'expense' });
    setIsOpen(false);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    setCategories((prev) => prev.filter((c) => c.id !== deleteId));
    setDeleteId(null);
  };

  const CategoryPill = ({ cat }: { cat: Category }) => (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card text-sm group">
      <span>{cat.name}</span>
      {cat.isCustom && (
        <button
          onClick={() => setDeleteId(cat.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive ml-1">
          <Trash2 className="w-3 h-3" />
        </button>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/*  HEADER  */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-foreground mb-1">Settings</h1>
          <p className="text-muted-foreground">Manage your transaction categories.</p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-[#059669] to-[#10b981] text-white px-4 py-2.5 rounded-xl hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-200">
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">Add Category</span>
        </button>
      </div>

      {/*  CATEGORY CARDS  */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Income */}
        <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Tag className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="font-medium">Income</p>
            <span className="ml-auto text-xs text-muted-foreground">{incomeCategories.length} categories</span>
          </div>
          <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
            {incomeCategories.map((cat) => <CategoryPill key={cat.id} cat={cat} />)}
          </div>
        </div>

        {/* Expense */}
        <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
              <Tag className="w-4 h-4 text-amber-600" />
            </div>
            <p className="font-medium">Expense</p>
            <span className="ml-auto text-xs text-muted-foreground">{expenseCategories.length} categories</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {expenseCategories.map((cat) => <CategoryPill key={cat.id} cat={cat} />)}
          </div>
        </div>
      </div>

      {/*  ADD CATEGORY DIALOG  */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
            <DialogDescription className="sr-only">Create a new category</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="relative flex rounded-xl overflow-hidden border border-border">
              <div className={`absolute top-0 h-full w-1/2 transition-all duration-300 ${
                form.type === 'income'
                  ? 'left-0 bg-gradient-to-r from-emerald-700 to-emerald-500'
                  : 'left-1/2 bg-gradient-to-r from-amber-600 to-amber-500'
              }`} />
              <button onClick={() => setForm({ ...form, type: 'income' })}
                className={`relative z-10 flex-1 py-2.5 text-sm font-medium ${form.type === 'income' ? 'text-white' : 'text-muted-foreground'}`}>
                Income
              </button>
              <button onClick={() => setForm({ ...form, type: 'expense' })}
                className={`relative z-10 flex-1 py-2.5 text-sm font-medium ${form.type === 'expense' ? 'text-white' : 'text-muted-foreground'}`}>
                Expense
              </button>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Category Name <span className="text-destructive">*</span></label>
              <Input placeholder="e.g. Investment" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()} />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">Cancel</Button>
            <Button onClick={handleAdd} disabled={!form.name.trim()}
              className="flex-1 bg-gradient-to-r from-emerald-700 to-emerald-500 text-white">
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/*  DELETE CONFIRMATION  */}
      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Category?</DialogTitle>
            <DialogDescription>
              {categoryToDelete && <>Category <strong>"{categoryToDelete.name}"</strong> will be permanently deleted.</>}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteId(null)} className="flex-1">Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} className="flex-1">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}