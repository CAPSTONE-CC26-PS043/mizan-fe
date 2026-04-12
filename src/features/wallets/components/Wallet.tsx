import { useState } from 'react';
import { Wallet as WalletIcon, Plus, Trash2, RefreshCw, Pencil } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/shadcn/dialog';
import { Button } from '@/components/ui/shadcn/button';
import { Input } from '@/components/ui/shadcn/input';
import { useWallets, useCreateWallet, useUpdateWallet, useDeleteWallet } from '@/features/wallets/hooks/useWallets';
import { useAuthStore } from '@/features/auth/store/auth.store';
import type { Wallet } from '@/features/wallets/types/wallet.types';
import { toast } from 'sonner';

const ICON_OPTIONS = ['👛', '🏦', '🛡️', '🎓', '✈️', '🏠', '💊', '🎁'];
const COLOR_OPTIONS = ['#047857', '#0891b2', '#d97706', '#7c3aed', '#db2777', '#dc2626'];

function formatRupiah(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
}

function formatInput(value: string) {
  return value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export default function Wallet() {
  const { user } = useAuthStore();
  const { data, isLoading, refetch, isFetching, error } = useWallets();
  const createWallet = useCreateWallet();
  const updateWallet = useUpdateWallet();
  const deleteWallet = useDeleteWallet();

  const [isOpen, setIsOpen] = useState(false);
  const [editWallet, setEditWallet] = useState<Wallet | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '', balance: '', icon: '👛', color: '#047857' });
  const [formError, setFormError] = useState<string | null>(null);

  const wallets: Wallet[] = data?.success && Array.isArray(data.data) ? data.data : [];
  const totalBalance = wallets.reduce((s, w) => s + w.current_balance, 0);
  const walletToDelete = wallets.find((w) => w.id === deleteId);

  const handleAdd = async () => {
    if (!form.name) {
      setFormError('Wallet name is required');
      return;
    }

    if (!user?.id) {
      setFormError('User not authenticated');
      return;
    }

    try {
      const current_balance = form.balance ? parseInt(form.balance.replace(/\./g, '')) : 0;
      const result = await createWallet.mutateAsync({
        name: form.name,
        current_balance,
        user_id: user.id,
      });

      if (result.success) {
        toast.success('Wallet created successfully');
        setForm({ name: '', balance: '', icon: '👛', color: '#047857' });
        setIsOpen(false);
      } else {
        setFormError(result.message);
      }
    } catch {
      setFormError('Failed to create wallet');
    }
  };

  const handleEditOpen = (wallet: Wallet) => {
    setEditWallet(wallet);
    setForm({
      name: wallet.name,
      balance: wallet.current_balance.toString(),
      icon: wallet.icon || '👛',
      color: wallet.color || '#047857',
    });
    setFormError(null);
  };

  const handleEdit = async () => {
    if (!editWallet || !form.name || !user?.id) return;

    try {
      const current_balance = form.balance ? parseInt(form.balance.replace(/\./g, '')) : 0;
      const result = await updateWallet.mutateAsync({
        id: editWallet.id,
        userId: user.id,
        data: {
          name: form.name,
          current_balance,
        },
      });

      if (result.success) {
        toast.success('Wallet updated successfully');
        setEditWallet(null);
        setForm({ name: '', balance: '', icon: '👛', color: '#047857' });
      } else {
        setFormError(result.message);
      }
    } catch {
      setFormError('Failed to update wallet');
    }
  };

  const handleDelete = async () => {
    if (!deleteId || !user?.id) return;

    try {
      const result = await deleteWallet.mutateAsync({ id: deleteId, userId: user.id });
      if (result.success) {
        toast.success('Wallet deleted successfully');
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error('Failed to delete wallet');
    }
    setDeleteId(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 mx-auto mb-2 animate-spin text-emerald-600" />
          <p className="text-muted-foreground">Loading wallets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-500 mb-2">Failed to load wallets</p>
          <Button variant="outline" onClick={() => refetch()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-foreground mb-1">Wallets</h1>
          <p className="text-muted-foreground">Manage your fund allocations.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className={`w-4 h-4 mr-1 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <button
            onClick={() => { setFormError(null); setIsOpen(true); }}
            className="flex items-center gap-2 bg-gradient-to-r from-[#059669] to-[#10b981] text-white px-4 py-2.5 rounded-xl hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-200">
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Add Wallet</span>
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#065f46] to-[#047857] rounded-2xl p-4 md:p-6 text-white shadow-lg shadow-emerald-900/20">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <WalletIcon className="w-5 h-5" />
          </div>
          <p className="text-sm opacity-90">Total Balance</p>
        </div>
        <p className="text-3xl font-bold">{formatRupiah(totalBalance)}</p>
        <p className="text-xs opacity-70 mt-1">{wallets.length} wallets</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {wallets.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            <WalletIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No wallets yet. Create your first wallet!</p>
          </div>
        ) : (
          wallets.map((w) => {
            const pct = totalBalance > 0 ? (w.current_balance / totalBalance) * 100 : 0;
            return (
              <div key={w.id} className="bg-card rounded-2xl p-5 border border-border shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">👛</span>
                    <div>
                      <p className="font-medium text-foreground">{w.name}</p>
                      <p className="text-xs text-muted-foreground">{pct.toFixed(0)}% of total</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEditOpen(w)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-emerald-50 hover:text-emerald-600 text-muted-foreground">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(w.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 text-muted-foreground">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-2xl font-bold mb-3" style={{ color: '#047857' }}>
                  {formatRupiah(w.current_balance)}
                </p>
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div className="h-1.5 rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: '#047857' }} />
                </div>
              </div>
            );
          })
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Add Wallet</DialogTitle>
            <DialogDescription className="sr-only">Create a new wallet</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Wallet Name <span className="text-destructive">*</span></label>
              <Input 
                placeholder="e.g. Daily Wallet" 
                value={form.name}
                onChange={(e) => { setForm({ ...form, name: e.target.value }); setFormError(null); }} 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Initial Balance</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">Rp</span>
                <Input 
                  placeholder="0" 
                  value={form.balance} 
                  className="pl-9"
                  onChange={(e) => setForm({ ...form, balance: formatInput(e.target.value) })} 
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Icon</label>
              <div className="flex gap-2 flex-wrap">
                {ICON_OPTIONS.map((icon) => (
                  <button 
                    key={icon} 
                    onClick={() => setForm({ ...form, icon })}
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
                  <button 
                    key={color} 
                    onClick={() => setForm({ ...form, color })}
                    className={`w-7 h-7 rounded-full border-2 transition-all ${form.color === color ? 'border-foreground scale-110' : 'border-transparent'}`}
                    style={{ backgroundColor: color }} />
                ))}
              </div>
            </div>
            {formError && <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{formError}</p>}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">Cancel</Button>
            <Button 
              onClick={handleAdd} 
              disabled={!form.name || createWallet.isPending}
              className="flex-1 bg-gradient-to-r from-emerald-700 to-emerald-500 text-white">
              {createWallet.isPending ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editWallet !== null} onOpenChange={() => setEditWallet(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit Wallet</DialogTitle>
            <DialogDescription className="sr-only">Edit wallet details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Wallet Name <span className="text-destructive">*</span></label>
              <Input 
                placeholder="e.g. Daily Wallet" 
                value={form.name}
                onChange={(e) => { setForm({ ...form, name: e.target.value }); setFormError(null); }} 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Balance</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">Rp</span>
                <Input 
                  placeholder="0" 
                  value={form.balance} 
                  className="pl-9"
                  onChange={(e) => setForm({ ...form, balance: formatInput(e.target.value) })} 
                />
              </div>
            </div>
            {formError && <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{formError}</p>}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setEditWallet(null)} className="flex-1">Cancel</Button>
            <Button 
              onClick={handleEdit} 
              disabled={!form.name || updateWallet.isPending}
              className="flex-1 bg-gradient-to-r from-emerald-700 to-emerald-500 text-white">
              {updateWallet.isPending ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Wallet?</DialogTitle>
            <DialogDescription>
              {walletToDelete && <>Wallet <strong>"{walletToDelete.name}"</strong> with balance <strong>{formatRupiah(walletToDelete.current_balance)}</strong> will be deleted.</>}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteId(null)} className="flex-1">Cancel</Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete} 
              disabled={deleteWallet.isPending}
              className="flex-1">
              {deleteWallet.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
