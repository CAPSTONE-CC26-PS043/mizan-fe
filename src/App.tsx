import { createBrowserRouter, RouterProvider, Navigate } from 'react-router';
import AppLayout from './layouts/AppLayout';
import AuthLayout from './layouts/AuthLayout';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import WalletPage from './pages/WalletPage';
import BudgetPage from './pages/BudgetPage';
import ZakatPage from './pages/ZakatPage';
import InsightsPage from './pages/InsightsPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { ForgotPasswordForm } from './features/auth/components/ForgotPasswordForm';
import { ResetPasswordForm } from './features/auth/components/ResetPasswordForm';
import { VerifyEmailPage } from './features/auth/components/VerifyEmailConfirmPage';

const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/" replace /> },
  {
    path: '/',
    Component: AuthLayout,
    children: [
      { path: 'login',    Component: LoginPage    },
      { path: 'register', Component: RegisterPage },
      { path: 'forgot-password', Component: ForgotPasswordForm },
      { path: 'reset-password',  Component: ResetPasswordForm  },
      { path: 'verify-email',    Component: VerifyEmailPage },
    ],
  },
  {
    path: '/',
    Component: AppLayout,
    children: [
      { index: true,               Component: DashboardPage    },
      { path: 'transactions',      Component: TransactionsPage },
      { path: 'wallets',           Component: WalletPage       },
      { path: 'budget',            Component: BudgetPage       },
      { path: 'zakat',             Component: ZakatPage        },
      { path: 'insights',          Component: InsightsPage     },
      { path: 'settings',          Component: SettingsPage     },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
