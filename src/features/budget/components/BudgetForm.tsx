import { Check } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/shadcn/dialog';
import { Button } from '@/components/ui/shadcn/button';
import { Budget, BudgetFormState, BudgetIcon } from '@/types/budget.types';

// Icon Options
const ICON_OPTIONS: { label: BudgetIcon; icon: React.ElementType }[] = [
  { label: 'Utensils',     icon: LucideIcons.Utensils     },
  { label: 'Home',         icon: LucideIcons.Home         },
  { label: 'Car',          icon: LucideIcons.Car          },
  { label: 'GraduationCap',icon: LucideIcons.GraduationCap},
  { label: 'Heart',        icon: LucideIcons.Heart        },
  { label: 'ShoppingCart', icon: LucideIcons.ShoppingCart },
  { label: 'Smartphone',   icon: LucideIcons.Smartphone   },
  { label: 'Plane',        icon: LucideIcons.Plane        },
  { label: 'Briefcase',    icon: LucideIcons.Briefcase    },
  { label: 'Shield',       icon: LucideIcons.Shield       },
  { label: 'Gift',         icon: LucideIcons.Gift         },
  { label: 'Wallet',       icon: LucideIcons.Wallet       },
];

//  Color Options
const COLOR_OPTIONS = [
  '#059669', '#047857', '#065f46',
  '#0284c7', '#1d4ed8', '#7c3aed',
  '#db2777', '#dc2626', '#d97706',
  '#64748b',
];

// Prop
interface BudgetFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  form: BudgetFormState;
  setForm: (form: BudgetFormState) => void;
  formErrors: Partial<BudgetFormState>;
  apiError: string | null;
  activeBudget: Budget | null; 
  onSubmit: () => void;
}

// Format Rupiah
function formatRupiah(value: string): string {
  return value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// Components
export function BudgetForm({
  isOpen,
  onOpenChange,
  form,
  setForm,
  formErrors,
  apiError,
  activeBudget,
  onSubmit,
}: BudgetFormProps) {
  const isEditMode = activeBudget !== null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {isEditMode ? 'Edit Budget' : 'Create New Budget'}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {isEditMode ? 'Edit your budget category' : 'Create a new budget category'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">

          {/* Budget Name */}
          <div>
            <label className="text-sm font-medium mb-1 block">
              Budget Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Food & Groceries"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-[#059669]"
            />
            {formErrors.name && (
              <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>
            )}
          </div>

          {/* Allocated Amount */}
          <div>
            <label className="text-sm font-medium mb-1 block">
              Allocated Amount (IDR) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">Rp</span>
              <input
                type="text"
                placeholder="0"
                value={form.allocated}
                onChange={(e) => setForm({ ...form, allocated: formatRupiah(e.target.value) })}
                className="w-full border border-border rounded-xl pl-9 pr-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-[#059669]"
              />
            </div>
            {formErrors.allocated && (
              <p className="text-xs text-red-500 mt-1">{formErrors.allocated}</p>
            )}
          </div>

          {/* Icon Picker */}
          <div>
            <label className="text-sm font-medium mb-2 block">Icon</label>
            <div className="grid grid-cols-6 gap-2">
              {ICON_OPTIONS.map(({ label, icon: IconComp }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setForm({ ...form, icon: label })}
                  className={`w-full aspect-square rounded-xl flex items-center justify-center border-2 transition-colors ${
                    form.icon === label
                      ? 'border-[#059669] bg-emerald-50'
                      : 'border-border hover:border-[#059669]/50'
                  }`}
                  title={label}
                >
                  <IconComp className={`w-4 h-4 ${form.icon === label ? 'text-[#059669]' : 'text-muted-foreground'}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Color Picker */}
          <div>
            <label className="text-sm font-medium mb-2 block">Color</label>
            <div className="flex gap-2 flex-wrap">
              {COLOR_OPTIONS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setForm({ ...form, color })}
                  className="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 flex items-center justify-center"
                  style={{
                    backgroundColor: color,
                    borderColor: form.color === color ? '#000' : 'transparent',
                  }}
                >
                  {form.color === color && <Check className="w-3 h-3 text-white" />}
                </button>
              ))}
            </div>
          </div>

          {/* Carry Over Toggll*/}
          <div className="flex items-center justify-between p-3 rounded-xl border border-border">
            <div>
              <p className="text-sm font-medium">Carry Over</p>
              <p className="text-xs text-muted-foreground">Leftover balance moves to next month</p>
            </div>
            <button
              type="button"
              onClick={() => setForm({ ...form, carryOver: !form.carryOver })}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                form.carryOver ? 'bg-[#059669]' : 'bg-muted'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                  form.carryOver ? 'translate-x-1' : 'right-7'
                }`}
              />
            </button>
          </div>

          {/* Sedekah Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-border">
            <div>
              <p className="text-sm font-medium">Mark as Sedekah</p>
              <p className="text-xs text-muted-foreground">This budget is for charitable giving</p>
            </div>
            <button
              type="button"
              onClick={() => setForm({ ...form, isSedekah: !form.isSedekah })}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                form.isSedekah ? 'bg-[#059669]' : 'bg-muted'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                  form.isSedekah ? 'translate-x-1' : 'right-7'
                }`}
              />
            </button>
          </div>

          {/* API Error Message */}
          {apiError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600">{apiError}</p>
            </div>
          )}

        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            className="bg-[#059669] hover:bg-[#047857] text-white rounded-xl"
          >
            {isEditMode ? 'Save Changes' : 'Create Budget'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}