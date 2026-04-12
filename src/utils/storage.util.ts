import type { Transaction } from '@/types/transaction.types';

// Storage key
const STORAGE_KEY = 'mizan-transactions';

// Initialize with sample data if empty
const getInitialData = (): Transaction[] => [
  { id: 1, name: 'Belanja Kebutuhan', category: 'Makanan', amount: 150000, date: new Date().toISOString().split('T')[0], type: 'expense', status: 'completed' },
  { id: 2, name: 'Gaji Bulanan', category: 'Pemasukan', amount: 4500000, date: new Date(Date.now() - 86400000).toISOString().split('T')[0], type: 'income', status: 'completed' },
  { id: 3, name: 'Pembayaran Zakat', category: 'Sedekah', amount: 200000, date: new Date(Date.now() - 2*86400000).toISOString().split('T')[0], type: 'expense', status: 'completed' },
  { id: 4, name: 'Tagihan Utilitas', category: 'Tagihan', amount: 120000, date: new Date(Date.now() - 3*86400000).toISOString().split('T')[0], type: 'expense', status: 'pending' },
  { id: 5, name: 'Belanja Online', category: 'Belanja', amount: 350000, date: new Date(Date.now() - 4*86400000).toISOString().split('T')[0], type: 'expense', status: 'completed' },
  { id: 6, name: 'Transportasi', category: 'Transportasi', amount: 85000, date: new Date(Date.now() - 5*86400000).toISOString().split('T')[0], type: 'expense', status: 'completed' },
];

export function getTransactions(): Transaction[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const transactions: Transaction[] = stored ? JSON.parse(stored) : [];
    return transactions.length === 0 ? getInitialData() : transactions;
  } catch {
    return getInitialData();
  }
}

export function saveTransactions(transactions: Transaction[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch (error) {
    console.error('Failed to save transactions:', error);
  }
}

export function addTransaction(transaction: Omit<Transaction, 'id'>): Transaction {
  const transactions = getTransactions();
  const newId = Math.max(...transactions.map(t => t.id), 0) + 1;
  const newTransaction: Transaction = { ...transaction, id: newId };
  const updated = [newTransaction, ...transactions];
  saveTransactions(updated);
  return newTransaction;
}

export function deleteTransaction(id: number): void {
  const transactions = getTransactions();
  const updated = transactions.filter(t => t.id !== id);
  saveTransactions(updated);
}

export function getRecentTransactions(limit: number = 5): Transaction[] {
  return getTransactions()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}

const ACCESS_TOKEN_KEY = 'mizan_access_token';
const REFRESH_TOKEN_KEY = 'mizan_refresh_token';

export const storage = {
  getAccessToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),
  setAccessToken: (token: string) => localStorage.setItem(ACCESS_TOKEN_KEY, token),
  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  setRefreshToken: (token: string) => localStorage.setItem(REFRESH_TOKEN_KEY, token),
  clearTokens: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
  setTokens: (accessToken: string, refreshToken: string) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },
};

