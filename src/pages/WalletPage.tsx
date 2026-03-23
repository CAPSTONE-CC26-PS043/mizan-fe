//  IMPORTS 
import { useState } from 'react';
import { Wallet, Plus, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/shadcn/dialog';
import { Button } from '@/components/ui/shadcn/button';
import { Input } from '@/components/ui/shadcn/input';

//  TYPES 
interface Kantong {
  id: string;
  name: string;
  icon: string;
  balance: number;
  color: string;
}

//  DATA 
const initialKantong: Kantong[] = [
  { id: 'dompet', name: 'Daily Wallet', icon: '👛', balance: 500000, color: '#047857' },
  { id: 'tabungan', name: 'Savings', icon: '🏦', balance: 2000000, color: '#0891b2' },
  { id: 'darurat', name: 'Emergency Fund', icon: '🛡️', balance: 1000000, color: '#d97706' },
];

const ICON_OPTIONS = ['👛', '🏦', '🛡️', '🎓', '✈️', '🏠', '💊', '🎁'];
const COLOR_OPTIONS = ['#047857', '#0891b2', '#d97706', '#7c3aed', '#db2777', '#dc2626'];

//  COMPONENT 
export default function WalletPage() {
  //  STATE 
  const [kantongs, setKantongs] = useState<Kantong[]>(initialKantong);
  const [isOpen, setIsOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', balance: '', icon: '👛', color: '#047857' });

  //  DERIVED DATA 
  const totalBalance = kantongs.reduce((s, k) => s + k.balance, 0);
  const formatRupiah = (n: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
  const kantongToDelete = kantongs.find((k) => k.id === deleteId);

  //  HANDLERS 
  const handleAdd = () => {
    if (!form.name || !form.balance) return;
    const newKantong: Kantong = {
      id: `kantong_${Date.now()}`,
      name: form.name,
      icon: form.icon,
      balance: parseInt(form.balance.replace(/\./g, '')),
      color: form.color,
    };
    setKantongs((prev) => [...prev, newKantong]);
    setForm({ name: '', balance: '', icon: '👛', color: '#047857' });
    setIsOpen(false);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    setKantongs((prev) => prev.filter((k) => k.id !== deleteId));
    setDeleteId(null);
  };

  const formatInput = (value: string) =>
    value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return (
    <div className="space-y-6">
      {/*  HEADER  */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-foreground mb-1">Wallets</h1>
          <p className="text-muted-foreground">Manage your fund allocations.</p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-[#059669] to-[#10b981] text-white px-4 py-2.5 rounded-xl hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-200">
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">Add Wallet</span>
        </button>
      </div>

      {/*  TOTAL BALANCE  */}
      <div className="bg-gradient-to-br from-[#065f46] to-[#047857] rounded-2xl p-4 md:p-6 text-white shadow-lg shadow-emerald-900/20">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Wallet className="w-5 h-5" />
          </div>
          <p className="text-sm opacity-90">Total Balance</p>
        </div>
        <p className="text-3xl font-bold">{formatRupiah(totalBalance)}</p>
        <p className="text-xs opacity-70 mt-1">{kantongs.length} wallets</p>
      </div>

      {/*  WALLET CARDS  */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {kantongs.map((k) => {
          const pct = totalBalance > 0 ? (k.balance / totalBalance) * 100 : 0;
          return (
            <div key={k.id} className="bg-card rounded-2xl p-5 border border-border shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{k.icon}</span>
                  <div>
                    <p className="font-medium text-foreground">{k.name}</p>
                    <p className="text-xs text-muted-foreground">{pct.toFixed(0)}% of total</p>
                  </div>
                </div>
                <button
                  onClick={() => setDeleteId(k.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 text-muted-foreground">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-2xl font-bold mb-3" style={{ color: k.color }}>
                {formatRupiah(k.balance)}
              </p>
              <div className="w-full bg-muted rounded-full h-1.5">
                <div className="h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, backgroundColor: k.color }} />
              </div>
            </div>
          );
        })}
      </div>

      {/*  ADD WALLET DIALOG  */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Add Wallet</DialogTitle>
            <DialogDescription className="sr-only">Create a new wallet</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Wallet Name <span className="text-destructive">*</span></label>
              <Input placeholder="e.g. Daily Wallet" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Initial Balance <span className="text-destructive">*</span></label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">Rp</span>
                <Input placeholder="0" value={form.balance} className="pl-9"
                  onChange={(e) => setForm({ ...form, balance: formatInput(e.target.value) })} />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Icon</label>
              <div className="flex gap-2 flex-wrap max-w-full:">
                {ICON_OPTIONS.map((icon) => (
                  <button key={icon} onClick={() => setForm({ ...form, icon })}
                    className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center border-2 transition-all ${form.icon === icon ? 'border-emerald-500 bg-emerald-50' : 'border-border hover:border-emerald-300'}`}>
                    {icon}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Color</label>
              <div className="flex gap-2">
                {COLOR_OPTIONS.map((color) => (
                  <button key={color} onClick={() => setForm({ ...form, color })}
                    className={`w-7 h-7 rounded-full border-2 transition-all ${form.color === color ? 'border-foreground scale-110' : 'border-transparent'}`}
                    style={{ backgroundColor: color }} />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">Cancel</Button>
            <Button onClick={handleAdd} disabled={!form.name || !form.balance}
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
            <DialogTitle>Delete Wallet?</DialogTitle>
            <DialogDescription>
              {kantongToDelete && <>Wallet <strong>"{kantongToDelete.name}"</strong> with balance <strong>{formatRupiah(kantongToDelete.balance)}</strong> will be deleted.</>}
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