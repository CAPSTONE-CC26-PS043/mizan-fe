import { useState } from 'react';
import {
  Plus, Wallet, ShoppingCart, Heart, Home, Car, BookOpen,
  Utensils, Plane, Smartphone, Gift, Briefcase, Shield,
  Check, ArrowDownCircle, ArrowRightLeft, Trash2,
  ChevronRight, Activity, TrendingUp, TrendingDown,
} from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/shadcn/dialog';
import { Button } from '@/components/ui/shadcn/button';


// TYPES

type MutationType = 'top-up' | 'transfer-in' | 'transfer-out' | 'expense';

type Mutation = {
  id: number;
  type: MutationType;
  amount: number;
  note: string;
  date: string;
  relatedEnvelope?: string;
};

type Envelope = {
  id: number;
  name: string;
  icon: string;
  targetBalance: number;
  currentBalance: number;
  description: string;
  color: string;
  isDefault?: boolean;
  mutations: Mutation[];
};


// CONSTANTS

const ICON_OPTIONS = [
  { label: 'Wallet',     icon: Wallet },
  { label: 'Shopping',   icon: ShoppingCart },
  { label: 'Charity',    icon: Heart },
  { label: 'Home',       icon: Home },
  { label: 'Transport',  icon: Car },
  { label: 'Education',  icon: BookOpen },
  { label: 'Food',       icon: Utensils },
  { label: 'Travel',     icon: Plane },
  { label: 'Tech',       icon: Smartphone },
  { label: 'Gift',       icon: Gift },
  { label: 'Work',       icon: Briefcase },
  { label: 'Emergency',  icon: Shield },
];

const COLOR_OPTIONS = [
  '#059669', '#047857', '#065f46',
  '#0284c7', '#1d4ed8', '#7c3aed',
  '#db2777', '#dc2626', '#d97706',
  '#64748b',
];

//  3 default Sharia envelopes on onboarding
const DEFAULT_ENVELOPES: Envelope[] = [
  {
    id: 1,
    name: 'Basic Needs',
    icon: 'Home',
    targetBalance: 3000000,
    currentBalance: 1500000,
    description: 'Daily necessities such as food, transport, and bills.',
    color: '#059669',
    isDefault: true,
    mutations: [
      { id: 1, type: 'top-up', amount: 1500000, note: 'Initial deposit', date: '2026-03-01' },
    ],
  },
  {
    id: 2,
    name: 'Zakat & Sadaqah',
    icon: 'Charity',
    targetBalance: 500000,
    currentBalance: 200000,
    description: 'Obligatory zakat and voluntary charity.',
    color: '#047857',
    isDefault: true,
    mutations: [
      { id: 2, type: 'top-up', amount: 200000, note: 'Monthly allocation', date: '2026-03-01' },
    ],
  },
  {
    id: 3,
    name: 'Savings',
    icon: 'Wallet',
    targetBalance: 2000000,
    currentBalance: 800000,
    description: 'Long-term savings fund.',
    color: '#065f46',
    isDefault: true,
    mutations: [
      { id: 3, type: 'top-up', amount: 800000, note: 'Initial deposit', date: '2026-03-01' },
    ],
  },
];


// HELPERS

function formatRupiah(value: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
}

function getIconComponent(iconLabel: string) {
  const found = ICON_OPTIONS.find((i) => i.label === iconLabel);
  return found ? found.icon : Wallet;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

// EMPTY FORMS

const EMPTY_CREATE_FORM = {
  name: '', icon: 'Wallet', targetBalance: '', description: '', color: '#059669',
};

const EMPTY_TOPUP_FORM = {
  amount: '', note: '',
};

const EMPTY_TRANSFER_FORM = {
  toEnvelopeId: '', amount: '', note: '',
};


// MAIN COMPONENT

export function WalletPage() {
  // ── State ────────────────────────────────────────────────
  const [envelopes, setEnvelopes] = useState<Envelope[]>(DEFAULT_ENVELOPES);

  // Dialog visibility
  const [isCreateOpen,   setIsCreateOpen]   = useState(false);
  const [isTopUpOpen,    setIsTopUpOpen]     = useState(false);
  const [isTransferOpen, setIsTransferOpen]  = useState(false);
  const [isDeleteOpen,   setIsDeleteOpen]    = useState(false);
  const [isDetailOpen,   setIsDetailOpen]    = useState(false);

  // Active envelope for actions
  const [activeEnvelope, setActiveEnvelope] = useState<Envelope | null>(null);

  // Transfer destination for delete with balance
  const [deleteTransferTo, setDeleteTransferTo] = useState('');

  // Forms
  const [createForm,   setCreateForm]   = useState(EMPTY_CREATE_FORM);
  const [topUpForm,    setTopUpForm]    = useState(EMPTY_TOPUP_FORM);
  const [transferForm, setTransferForm] = useState(EMPTY_TRANSFER_FORM);

  // Errors
  const [createErrors,   setCreateErrors]   = useState<Partial<typeof EMPTY_CREATE_FORM>>({});
  const [topUpErrors,    setTopUpErrors]    = useState<Partial<typeof EMPTY_TOPUP_FORM>>({});
  const [transferErrors, setTransferErrors] = useState<Partial<typeof EMPTY_TRANSFER_FORM>>({});

  // ── Derived 
  const totalBalance = envelopes.reduce((sum, e) => sum + e.currentBalance, 0);
  const totalTarget  = envelopes.reduce((sum, e) => sum + e.targetBalance, 0);
  const totalUsagePercent = totalTarget > 0 ? (totalBalance / totalTarget) * 100 : 0;

  // Create Envelope 
  function handleOpenCreate() {
    setCreateForm(EMPTY_CREATE_FORM);
    setCreateErrors({});
    setIsCreateOpen(true);
  }

  function validateCreate() {
    const errors: Partial<typeof EMPTY_CREATE_FORM> = {};
    if (!createForm.name.trim())
      errors.name = 'Envelope name is required.';
    if (!createForm.targetBalance || Number(createForm.targetBalance) <= 0)
      errors.targetBalance = 'Target balance must be greater than 0.';
    return errors;
  }

  function handleSubmitCreate() {
    const errors = validateCreate();
    if (Object.keys(errors).length > 0) { setCreateErrors(errors); return; }

    const newEnvelope: Envelope = {
      id: Date.now(),
      name: createForm.name.trim(),
      icon: createForm.icon,
      targetBalance: Number(createForm.targetBalance),
      currentBalance: 0,
      description: createForm.description.trim(),
      color: createForm.color,
      isDefault: false,
      mutations: [],
    };

    setEnvelopes((prev) => [...prev, newEnvelope]);
    setIsCreateOpen(false);
  }

  //  Top Up (Add Funds) 
  function handleOpenTopUp(env: Envelope) {
    setActiveEnvelope(env);
    setTopUpForm(EMPTY_TOPUP_FORM);
    setTopUpErrors({});
    setIsTopUpOpen(true);
  }

  function validateTopUp() {
    const errors: Partial<typeof EMPTY_TOPUP_FORM> = {};
    if (!topUpForm.amount || Number(topUpForm.amount) <= 0)
      errors.amount = 'Amount must be greater than 0.';
    return errors;
  }

  function handleSubmitTopUp() {
    const errors = validateTopUp();
    if (Object.keys(errors).length > 0) { setTopUpErrors(errors); return; }
    if (!activeEnvelope) return;

    const amount = Number(topUpForm.amount);
    const mutation: Mutation = {
      id: Date.now(),
      type: 'top-up',
      amount,
      note: topUpForm.note || 'Top up',
      date: new Date().toISOString().split('T')[0],
    };

    setEnvelopes((prev) =>
      prev.map((e) =>
        e.id === activeEnvelope.id
          ? { ...e, currentBalance: e.currentBalance + amount, mutations: [mutation, ...e.mutations] }
          : e
      )
    );
    setIsTopUpOpen(false);
  }

  // Transfer Funds Between Envelopes 
  function handleOpenTransfer(env: Envelope) {
    setActiveEnvelope(env);
    setTransferForm(EMPTY_TRANSFER_FORM);
    setTransferErrors({});
    setIsTransferOpen(true);
  }

  function validateTransfer() {
    const errors: Partial<typeof EMPTY_TRANSFER_FORM> = {};
    if (!transferForm.toEnvelopeId)
      errors.toEnvelopeId = 'Please select a destination envelope.';
    if (!transferForm.amount || Number(transferForm.amount) <= 0)
      errors.amount = 'Amount must be greater than 0.';
    if (activeEnvelope && Number(transferForm.amount) > activeEnvelope.currentBalance)
      errors.amount = 'Insufficient balance.';
    return errors;
  }

  function handleSubmitTransfer() {
    const errors = validateTransfer();
    if (Object.keys(errors).length > 0) { setTransferErrors(errors); return; }
    if (!activeEnvelope) return;

    const amount     = Number(transferForm.amount);
    const toId       = Number(transferForm.toEnvelopeId);
    const toEnvelope = envelopes.find((e) => e.id === toId);
    if (!toEnvelope) return;

    const outMutation: Mutation = {
      id: Date.now(),
      type: 'transfer-out',
      amount,
      note: transferForm.note || `Transfer to ${toEnvelope.name}`,
      date: new Date().toISOString().split('T')[0],
      relatedEnvelope: toEnvelope.name,
    };

    const inMutation: Mutation = {
      id: Date.now() + 1,
      type: 'transfer-in',
      amount,
      note: transferForm.note || `Transfer from ${activeEnvelope.name}`,
      date: new Date().toISOString().split('T')[0],
      relatedEnvelope: activeEnvelope.name,
    };

    setEnvelopes((prev) =>
      prev.map((e) => {
        if (e.id === activeEnvelope.id)
          return { ...e, currentBalance: e.currentBalance - amount, mutations: [outMutation, ...e.mutations] };
        if (e.id === toId)
          return { ...e, currentBalance: e.currentBalance + amount, mutations: [inMutation, ...e.mutations] };
        return e;
      })
    );
    setIsTransferOpen(false);
  }

  // Delete Envelope 
  function handleOpenDelete(env: Envelope) {
    setActiveEnvelope(env);
    setDeleteTransferTo('');
    setIsDeleteOpen(true);
  }

  function handleConfirmDelete() {
    if (!activeEnvelope) return;

    if (activeEnvelope.currentBalance > 0) {
      if (!deleteTransferTo) return;
      const toId = Number(deleteTransferTo);

      const inMutation: Mutation = {
        id: Date.now(),
        type: 'transfer-in',
        amount: activeEnvelope.currentBalance,
        note: `Transferred from deleted envelope: ${activeEnvelope.name}`,
        date: new Date().toISOString().split('T')[0],
        relatedEnvelope: activeEnvelope.name,
      };

      setEnvelopes((prev) =>
        prev
          .filter((e) => e.id !== activeEnvelope.id)
          .map((e) =>
            e.id === toId
              ? { ...e, currentBalance: e.currentBalance + activeEnvelope.currentBalance, mutations: [inMutation, ...e.mutations] }
              : e
          )
      );
    } else {
      setEnvelopes((prev) => prev.filter((e) => e.id !== activeEnvelope.id));
    }

    setIsDeleteOpen(false);
    setActiveEnvelope(null);
  }

  // Overview / Detail 
  function handleOpenDetail(env: Envelope) {
    setActiveEnvelope(env);
    setIsDetailOpen(true);
  }


  // RENDER

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground mb-1">Envelope Wallets</h1>
          <p className="text-muted-foreground">Manage your fund envelopes and track your spending goals.</p>
        </div>
        <Button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-[#059669] hover:bg-[#047857] text-white rounded-xl px-4 py-2"
        >
          <Plus className="w-4 h-4" />
          New Envelope
        </Button>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-[#059669] to-[#10b981] rounded-2xl p-5 text-white shadow-md">
          <p className="text-sm opacity-80 mb-1">Total Balance</p>
          <h2 className="text-2xl font-semibold">{formatRupiah(totalBalance)}</h2>
          <p className="text-xs opacity-70 mt-1">across {envelopes.length} envelopes</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
          <p className="text-sm text-muted-foreground mb-1">Total Target</p>
          <h2 className="text-2xl font-semibold text-foreground">{formatRupiah(totalTarget)}</h2>
          <div className="w-full bg-muted rounded-full h-1.5 mt-2">
            <div className="h-1.5 rounded-full bg-[#059669]" style={{ width: `${Math.min(totalUsagePercent, 100)}%` }} />
          </div>
          <p className="text-xs text-muted-foreground mt-1">{totalUsagePercent.toFixed(1)}% funded</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
          <p className="text-sm text-muted-foreground mb-1">Envelopes</p>
          <h2 className="text-2xl font-semibold text-foreground">{envelopes.length}</h2>
          <p className="text-xs text-muted-foreground mt-1">{envelopes.filter(e => e.isDefault).length} default · {envelopes.filter(e => !e.isDefault).length} custom</p>
        </div>
      </div>

      {/* ── Envelope Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {envelopes.map((env) => {
          const IconComp  = getIconComponent(env.icon);
          const pct       = env.targetBalance > 0 ? Math.min((env.currentBalance / env.targetBalance) * 100, 100) : 0;
          const isOver    = env.currentBalance > env.targetBalance;

          return (
            <div key={env.id} className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3">

              {/* Card Header */}
              <div className="flex items-start justify-between">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${env.color}20` }}>
                  <IconComp className="w-5 h-5" style={{ color: env.color }} />
                </div>
                <div className="flex items-center gap-1">
                  {env.isDefault && (
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">Default</span>
                  )}
                  <button onClick={() => handleOpenDelete(env)} className="p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Name & Description */}
              <div>
                <h3 className="font-semibold text-foreground">{env.name}</h3>
                {env.description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{env.description}</p>}
              </div>

              {/* Balance */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Current</span>
                  <span className="font-semibold text-foreground">{formatRupiah(env.currentBalance)}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Target</span>
                  <span className="text-muted-foreground">{formatRupiah(env.targetBalance)}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="h-2 rounded-full transition-all duration-300" style={{ width: `${pct}%`, backgroundColor: isOver ? '#d97706' : env.color }} />
                </div>
                <p className="text-xs text-muted-foreground mt-1 text-right">{pct.toFixed(1)}% of target</p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-auto pt-1">
                {/* Top Up (Add Funds) */}
                <button
                  onClick={() => handleOpenTopUp(env)}
                  className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-2 rounded-xl border border-border hover:bg-emerald-50 hover:border-[#059669] hover:text-[#059669] transition-colors"
                >
                  <ArrowDownCircle className="w-3.5 h-3.5" /> Add Funds
                </button>
                {/* Transfer Funds Between Envelopes */}
                <button
                  onClick={() => handleOpenTransfer(env)}
                  className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-2 rounded-xl border border-border hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600 transition-colors"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" /> Transfer
                </button>
                {/* Summary Cards*/}
                <button
                  onClick={() => handleOpenDetail(env)}
                  className="flex items-center justify-center p-2 rounded-xl border border-border hover:bg-muted transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>
          );
        })}

        {/* Add New Envelope Shortcut */}
        <button
          onClick={handleOpenCreate}
          className="border-2 border-dashed border-border rounded-2xl p-5 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-[#059669] hover:text-[#059669] transition-colors min-h-[200px]"
        >
          <Plus className="w-8 h-8" />
          <span className="text-sm font-medium">New Envelope</span>
        </button>
      </div>

      {/* ── Create Envelope Dialog ── */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Create New Envelope</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium mb-1 block">Envelope Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="e.g. Groceries, Emergency Fund"
                value={createForm.name}
                onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-[#059669]"
              />
              {createErrors.name && <p className="text-xs text-red-500 mt-1">{createErrors.name}</p>}
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Target Balance (IDR) <span className="text-red-500">*</span></label>
              <input
                type="number"
                placeholder="e.g. 1000000"
                value={createForm.targetBalance}
                onChange={(e) => setCreateForm({ ...createForm, targetBalance: e.target.value })}
                className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-[#059669]"
              />
              {createErrors.targetBalance && <p className="text-xs text-red-500 mt-1">{createErrors.targetBalance}</p>}
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Description <span className="text-muted-foreground text-xs">(optional)</span></label>
              <textarea
                placeholder="What is this envelope for?"
                value={createForm.description}
                onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                rows={2}
                className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-[#059669] resize-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Icon</label>
              <div className="grid grid-cols-6 gap-2">
                {ICON_OPTIONS.map(({ label, icon: IconComp }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setCreateForm({ ...createForm, icon: label })}
                    className={`w-full aspect-square rounded-xl flex items-center justify-center border-2 transition-colors ${
                      createForm.icon === label ? 'border-[#059669] bg-emerald-50' : 'border-border hover:border-[#059669]/50'
                    }`}
                    title={label}
                  >
                    <IconComp className={`w-4 h-4 ${createForm.icon === label ? 'text-[#059669]' : 'text-muted-foreground'}`} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Color</label>
              <div className="flex gap-2 flex-wrap">
                {COLOR_OPTIONS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setCreateForm({ ...createForm, color })}
                    className="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 flex items-center justify-center"
                    style={{ backgroundColor: color, borderColor: createForm.color === color ? '#000' : 'transparent' }}
                  >
                    {createForm.color === color && <Check className="w-3 h-3 text-white" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsCreateOpen(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={handleSubmitCreate} className="bg-[#059669] hover:bg-[#047857] text-white rounded-xl">Create Envelope</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Top Up Dialog ── */}
      <Dialog open={isTopUpOpen} onOpenChange={setIsTopUpOpen}>
        <DialogContent className="sm:max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Add Funds</DialogTitle>
            <DialogDescription>Adding funds to <span className="font-medium text-foreground">{activeEnvelope?.name}</span></DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium mb-1 block">Amount (IDR) <span className="text-red-500">*</span></label>
              <input
                type="number"
                placeholder="e.g. 500000"
                value={topUpForm.amount}
                onChange={(e) => setTopUpForm({ ...topUpForm, amount: e.target.value })}
                className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-[#059669]"
              />
              {topUpErrors.amount && <p className="text-xs text-red-500 mt-1">{topUpErrors.amount}</p>}
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Note <span className="text-muted-foreground text-xs">(optional)</span></label>
              <input
                type="text"
                placeholder="e.g. Monthly salary allocation"
                value={topUpForm.note}
                onChange={(e) => setTopUpForm({ ...topUpForm, note: e.target.value })}
                className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-[#059669]"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsTopUpOpen(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={handleSubmitTopUp} className="bg-[#059669] hover:bg-[#047857] text-white rounded-xl">Add Funds</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Transfer Dialog ── */}
      <Dialog open={isTransferOpen} onOpenChange={setIsTransferOpen}>
        <DialogContent className="sm:max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Transfer Funds</DialogTitle>
            <DialogDescription>
              Available: <span className="font-medium text-foreground">{formatRupiah(activeEnvelope?.currentBalance ?? 0)}</span> in <span className="font-medium text-foreground">{activeEnvelope?.name}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium mb-1 block">To Envelope <span className="text-red-500">*</span></label>
              <select
                value={transferForm.toEnvelopeId}
                onChange={(e) => setTransferForm({ ...transferForm, toEnvelopeId: e.target.value })}
                className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-[#059669]"
              >
                <option value="">Select destination...</option>
                {envelopes.filter((e) => e.id !== activeEnvelope?.id).map((e) => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </select>
              {transferErrors.toEnvelopeId && <p className="text-xs text-red-500 mt-1">{transferErrors.toEnvelopeId}</p>}
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Amount (IDR) <span className="text-red-500">*</span></label>
              <input
                type="number"
                placeholder="e.g. 200000"
                value={transferForm.amount}
                onChange={(e) => setTransferForm({ ...transferForm, amount: e.target.value })}
                className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-[#059669]"
              />
              {transferErrors.amount && <p className="text-xs text-red-500 mt-1">{transferErrors.amount}</p>}
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Reason <span className="text-muted-foreground text-xs">(optional)</span></label>
              <input
                type="text"
                placeholder="e.g. Reallocating unused budget"
                value={transferForm.note}
                onChange={(e) => setTransferForm({ ...transferForm, note: e.target.value })}
                className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-[#059669]"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsTransferOpen(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={handleSubmitTransfer} className="bg-[#0284c7] hover:bg-[#0369a1] text-white rounded-xl">Transfer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete Dialog ── */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Delete Envelope</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <span className="font-medium text-foreground">{activeEnvelope?.name}</span>?
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            {activeEnvelope && activeEnvelope.currentBalance > 0 ? (
              <div className="space-y-3">
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl text-sm text-orange-700">
                  This envelope has <span className="font-semibold">{formatRupiah(activeEnvelope.currentBalance)}</span> remaining. Please transfer it to another envelope before deleting.
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Transfer balance to <span className="text-red-500">*</span></label>
                  <select
                    value={deleteTransferTo}
                    onChange={(e) => setDeleteTransferTo(e.target.value)}
                    className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-[#059669]"
                  >
                    <option value="">Select envelope...</option>
                    {envelopes.filter((e) => e.id !== activeEnvelope?.id).map((e) => (
                      <option key={e.id} value={e.id}>{e.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)} className="rounded-xl">Cancel</Button>
            <Button
              onClick={handleConfirmDelete}
              disabled={activeEnvelope !== null && activeEnvelope.currentBalance > 0 && !deleteTransferTo}
              className="bg-red-500 hover:bg-red-600 text-white rounded-xl disabled:opacity-50"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Detail / Mutation History Dialog ── */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              {activeEnvelope && (() => {
                const IconComp = getIconComponent(activeEnvelope.icon);
                return <IconComp className="w-5 h-5" style={{ color: activeEnvelope.color }} />;
              })()}
              {activeEnvelope?.name}
            </DialogTitle>
            <DialogDescription>{activeEnvelope?.description || 'No description.'}</DialogDescription>
          </DialogHeader>
          {activeEnvelope && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted rounded-xl p-3">
                  <p className="text-xs text-muted-foreground mb-1">Current Balance</p>
                  <p className="font-semibold text-foreground">{formatRupiah(activeEnvelope.currentBalance)}</p>
                </div>
                <div className="bg-muted rounded-xl p-3">
                  <p className="text-xs text-muted-foreground mb-1">Target Balance</p>
                  <p className="font-semibold text-foreground">{formatRupiah(activeEnvelope.targetBalance)}</p>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Progress</span>
                  <span>{Math.min((activeEnvelope.currentBalance / activeEnvelope.targetBalance) * 100, 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div
                    className="h-2.5 rounded-full"
                    style={{
                      width: `${Math.min((activeEnvelope.currentBalance / activeEnvelope.targetBalance) * 100, 100)}%`,
                      backgroundColor: activeEnvelope.color,
                    }}
                  />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5">
                  <Activity className="w-4 h-4" /> Mutation History
                </h4>
                {activeEnvelope.mutations.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No transactions yet.</p>
                ) : (
                  <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                    {activeEnvelope.mutations.map((m) => (
                      <div key={m.id} className="flex items-center justify-between p-3 bg-muted rounded-xl text-sm">
                        <div className="flex items-center gap-2">
                          {m.type === 'top-up' || m.type === 'transfer-in' ? (
                            <TrendingUp className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-500" />
                          )}
                          <div>
                            <p className="font-medium text-foreground">{m.note}</p>
                            <p className="text-xs text-muted-foreground">{formatDate(m.date)}{m.relatedEnvelope ? ` · ${m.relatedEnvelope}` : ''}</p>
                          </div>
                        </div>
                        <span className={`font-semibold ${m.type === 'top-up' || m.type === 'transfer-in' ? 'text-emerald-600' : 'text-red-500'}`}>
                          {m.type === 'top-up' || m.type === 'transfer-in' ? '+' : '-'}{formatRupiah(m.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailOpen(false)} className="rounded-xl">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}