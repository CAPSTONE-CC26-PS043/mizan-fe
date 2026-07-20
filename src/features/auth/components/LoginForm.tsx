import { useState } from 'react';
import { Link } from 'react-router';
import { Shield, Eye, EyeOff, TrendingUp, PiggyBank, Heart } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'sonner';

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login, isLoggingIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    try {
      const response = await login({ email, password });
      if (!response.success) {
        setError(response.message || 'Login failed. Please check your email and password.');
      }
    } catch (error: unknown) {
      const err = error as Error;
      setError(err.message || 'Login failed. Please check your email and password.');
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError(null);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError(null);
  };

  return (
    <>
      {/* ── MOBILE ──────────────────────────────── */}
      <div className="md:hidden min-h-screen bg-background flex flex-col justify-center px-6 max-w-sm mx-auto">
        <div className="flex flex-col items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#065f46] to-[#047857] flex items-center justify-center shadow-lg shadow-emerald-900/20">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-semibold text-foreground">Mizan Finance</h1>
            <p className="text-xs text-muted-foreground">Syariah Budgeting</p>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-foreground mb-1 text-center">Welcome</h2>
        <p className="text-sm text-muted-foreground mb-4 text-center">Enter your account</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Email</label>
            <input 
              type="email" 
              placeholder="nama@email.com"
              value={email}
              onChange={handleEmailChange}
              disabled={isLoggingIn}
              className="w-full px-4 py-3.5 rounded-2xl border border-border bg-muted/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#047857] text-sm disabled:opacity-50" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="••••••••"
                value={password}
                onChange={handlePasswordChange}
                disabled={isLoggingIn}
                className={`w-full px-4 py-3.5 pr-12 rounded-2xl border bg-muted/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#047857] text-sm disabled:opacity-50 ${error ? 'border-red-500' : 'border-border'}`}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-500">{error}</p>
            )}
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
              <input type="checkbox" className="rounded border-border w-4 h-4" />
              Remember Me
            </label>
            <Link to="/forgot-password" className="text-sm text-[#047857] hover:underline font-medium">Forgot password?</Link>
          </div>
          <button 
            type="submit" 
            disabled={isLoggingIn}
            className="w-full bg-gradient-to-r from-[#065f46] to-[#047857] text-white py-4 rounded-2xl font-semibold hover:shadow-lg transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed">
            {isLoggingIn ? 'Loading...' : 'Login'}
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-border"></div>
          <span className="text-xs text-muted-foreground">or continue with</span>
          <div className="flex-1 h-px bg-border"></div>
        </div>

        <button onClick={() => alert('Google OAuth')}
          className="w-full flex items-center justify-center gap-3 border border-border bg-background hover:bg-muted py-4 rounded-2xl transition-all">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span className="text-sm font-semibold text-foreground">Google</span>
        </button>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#047857] font-semibold hover:underline">Sign up now</Link>
        </p>
      </div>

      {/* ── DESKTOP */}
      <div className="hidden md:flex w-full max-w-4xl bg-card rounded-3xl shadow-2xl border border-border overflow-hidden min-h-[560px]">

        {/* Left column — illustration */}
        <div className="w-1/2 bg-gradient-to-br from-[#065f46] via-[#047857] to-[#059669] p-10 flex flex-col justify-between relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>

          {/* Logo */}
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">Mizan Finance</h1>
              <p className="text-xs text-white/70">Syariah Budgeting</p>
            </div>
          </div>

          {/* Center illustration */}
          <div className="relative z-10 flex flex-col items-center text-center py-6">
            {/* Dashboard mockup */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-6 w-full border border-white/20">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white/80 text-xs font-medium">Total</span>
                <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">+12.5%</span>
              </div>
              <p className="text-white text-2xl font-bold mb-4">Rp 7.500.000</p>
              {/* Mini bar chart */}
              <div className="flex items-end gap-1.5 h-12">
                {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                  <div key={i} className="flex-1 bg-white/30 rounded-sm" style={{ height: `${h}%` }}></div>
                ))}
              </div>
              <div className="flex justify-between mt-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                  <span key={d} className="text-white/50 text-[10px]">{d}</span>
                ))}
              </div>
            </div>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2 justify-center">
              <div className="flex items-center gap-1.5 bg-white/15 text-white text-xs px-3 py-1.5 rounded-full border border-white/20">
                <TrendingUp className="w-3 h-3" />
                Monitor Expense
              </div>
              {/* <div className="flex items-center gap-1.5 bg-white/15 text-white text-xs px-3 py-1.5 rounded-full border border-white/20">
                <Heart className="w-3 h-3" />
                Hitung Zakat
              </div> */}
              <div className="flex items-center gap-1.5 bg-white/15 text-white text-xs px-3 py-1.5 rounded-full border border-white/20">
                <PiggyBank className="w-3 h-3" />
                Manage Budget
              </div>
            </div>
          </div>

          {/* Bottom quote */}
          <div className="relative z-10">
            <p className="text-white/90 text-sm font-medium leading-relaxed">
              "Manage your financial lifestyle, achieve serenity in every transaction."
            </p>
          </div>
        </div>

        {/* Right column — form */}
        <div className="w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold text-foreground mt-4 mb-1 text-center">Welcome</h2>
          <p className="text-sm text-muted-foreground mb-6 text-center">Enter your account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
              <input 
                type="email" 
                placeholder="nama@email.com"
                value={email}
                onChange={handleEmailChange}
                disabled={isLoggingIn}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#047857] disabled:opacity-50" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="••••••••"
                  value={password}
                  onChange={handlePasswordChange}
                  disabled={isLoggingIn}
                  className={`w-full px-4 py-3 pr-12 rounded-xl border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#047857] disabled:opacity-50 ${error ? 'border-red-500' : 'border-border'}`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-500">{error}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                <input type="checkbox" className="rounded border-border" />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-sm text-[#047857] hover:underline">Forget password?</Link>
            </div>

            <button 
              type="submit" 
              disabled={isLoggingIn}
              className="w-full bg-gradient-to-r from-[#065f46] to-[#047857] text-white py-3.5 rounded-xl font-medium hover:shadow-lg hover:shadow-emerald-900/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoggingIn ? 'Loading...' : 'Login'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-border"></div>
            <span className="text-xs text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border"></div>
          </div>

          <button onClick={() => alert('Google OAuth')}
            className="w-full flex items-center justify-center gap-3 border border-border bg-background hover:bg-muted py-3 rounded-xl transition-all">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="text-sm font-medium text-foreground">Login with Google</span>
          </button>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have account yet?{' '}
            <Link to="/register" className="text-[#047857] font-medium hover:underline">Register now</Link>
          </p>
        </div>
      </div>
    </>
  );
}
