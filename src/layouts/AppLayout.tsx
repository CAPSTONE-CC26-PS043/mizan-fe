import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router';
import {
  LayoutDashboard, Heart, Wallet,
  TrendingUp, Shield,
  LogOut, User, ChevronUp, Bell, Menu, X
} from 'lucide-react';
import { useAuth } from '../features/auth/hooks/useAuth';
import { useAuthStore } from '../features/auth/store/auth.store';

export default function AppLayout() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const { logout } = useAuth();
  const { user } = useAuthStore();

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'MF';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const getUserDisplayName = () => {
    return user?.name || user?.email || 'User';
  };

  // Bottom nav mobile
  const bottomNavItems = [
    { to: '/',              icon: LayoutDashboard, label: 'Dashboard'  },
    { to: '/transactions', icon: TrendingUp,      label: 'Transaction'  },
    { to: '/wallets',      icon: Wallet,          label: 'Wallet'     },
    { to: '/budgets',      icon: Wallet,          label: 'Budget'     },
    // { to: '/zakat',        icon: Heart,           label: 'Zakat'      },
  ];

  // Sidebar navigation items
  const sidebarNavItems = [
    { to: '/',             icon: LayoutDashboard, label: 'Dashboard'        },
    { to: '/transactions', icon: TrendingUp,      label: 'Transaction Tracking' },
    { to: '/wallets',      icon: Wallet,          label: 'Wallet'     },
    { to: '/budgets',      icon: Wallet,          label: 'Budget Planning'  },
    // { to: '/zakat',        icon: Heart,           label: 'Zakat & Charity'  },
  ];

  const handleLogoutClick = () => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    setLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = () => {
    setLogoutDialogOpen(false);
    logout();
  };

  return (
    <div className="flex h-screen bg-background">

      {/* ── SIDEBAR DESKTOP ─────────────────────────────── */}
      <aside className="hidden md:flex w-72 bg-card border-r border-border flex-col shadow-lg">

        {/* Logo */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#065f46] to-[#047857] flex items-center justify-center shadow-lg shadow-emerald-900/20">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Mizan Finance</h1>
              <p className="text-xs text-muted-foreground">Syariah Budgeting</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {sidebarNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#065f46] to-[#047857] text-white shadow-lg shadow-emerald-900/20'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User profile + dropdown */}
        <div className="p-4 border-t border-border relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d97706] to-[#f59e0b] flex items-center justify-center flex-shrink-0">
              <span className="text-white font-semibold text-sm">{getInitials(user?.name)}</span>
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-foreground text-sm">{getUserDisplayName()}</p>
              <p className="text-xs text-muted-foreground">Member</p>
            </div>
            <ChevronUp className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {dropdownOpen && (
            <div className="absolute bottom-full left-4 right-4 mb-1 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50">
              <button
                onClick={() => { setDropdownOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors text-left"
              >
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">My Profile</span>
              </button>
              <div className="h-px bg-border mx-3"></div>
              <button
                onClick={handleLogoutClick}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-left"
              >
                <LogOut className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-500 font-medium">Logout</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ── MOBILE DRAWER (slide in dari kiri) ──────────── */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 bg-black/40 z-40"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Drawer */}
          <div className="md:hidden fixed top-0 left-0 bottom-0 w-72 bg-card z-50 flex flex-col shadow-2xl">

            {/* Header drawer */}
            <div className="p-5 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#065f46] to-[#047857] flex items-center justify-center shadow-lg shadow-emerald-900/20">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-base font-semibold text-foreground">Mizan Finance</h1>
                  <p className="text-xs text-muted-foreground">Syariah Budgeting</p>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* User info di drawer */}
            <div className="px-4 py-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#d97706] to-[#f59e0b] flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-sm">{getInitials(user?.name)}</span>
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">{getUserDisplayName()}</p>
                  <p className="text-xs text-muted-foreground">Member</p>
                </div>
              </div>
            </div>

            {/* Nav drawer */}
            <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
              {sidebarNavItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-[#065f46] to-[#047857] text-white shadow-lg shadow-emerald-900/20'
                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{item.label}</span>
                </NavLink>
              ))}
            </nav>

            {/* Logout di drawer */}
            <div className="p-4 border-t border-border">
              <button
                onClick={handleLogoutClick}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-500 font-medium">Logout</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── MAIN AREA ────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Mobile top header */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-card border-b border-border z-30 sticky top-0">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-muted transition-colors"
          >
            <Menu className="w-5 h-5 text-foreground" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#065f46] to-[#047857] flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-foreground">Mizan Finance</span>
          </div>

          <button className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-muted transition-colors relative">
            <Bell className="w-5 h-5 text-foreground" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto pb-20 md:pb-0">
          <div className="p-4 md:p-8 max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>

        {/* ── MOBILE BOTTOM NAV ─────────────────────────── */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-30">
          <div className="flex items-center justify-around px-1 py-1.5">
            {bottomNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all duration-200 min-w-[56px] ${
                    isActive ? 'text-[#065f46]' : 'text-muted-foreground'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className={`p-1.5 rounded-xl transition-all duration-200 ${
                      isActive ? 'bg-[#065f46]/10' : ''
                    }`}>
                      <item.icon className={`w-5 h-5 transition-colors ${
                        isActive ? 'text-[#065f46]' : 'text-muted-foreground'
                      }`} />
                    </div>
                    <span className={`text-[10px] font-medium transition-colors ${
                      isActive ? 'text-[#065f46]' : 'text-muted-foreground'
                    }`}>
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

      </div>

      {/* ── LOGOUT CONFIRMATION DIALOG ───────────────────── */}
      {logoutDialogOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-4"
            onClick={() => setLogoutDialogOpen(false)}
          >
            {/* Dialog card */}
            <div
              className="bg-card rounded-3xl w-full max-w-sm p-6 shadow-2xl border border-border"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
                  <LogOut className="w-7 h-7 text-red-500" />
                </div>
              </div>

              {/* Text */}
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">Keluar dari Akun?</h3>
                <p className="text-sm text-muted-foreground">
                  Kamu akan keluar dari Mizan Finance. Pastikan semua data sudah tersimpan.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-2.5">
                <button
                  onClick={handleLogoutConfirm}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-3.5 rounded-2xl font-semibold text-sm transition-colors"
                >
                  Ya, Keluar
                </button>
                <button
                  onClick={() => setLogoutDialogOpen(false)}
                  className="w-full bg-muted hover:bg-secondary text-foreground py-3.5 rounded-2xl font-medium text-sm transition-colors"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
}