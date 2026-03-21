import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Shield, Eye, EyeOff, Lock, CheckCircle, Check } from 'lucide-react';

export function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  const rules = [
    { label: 'Minimal 8 karakter', pass: password.length >= 8 },
    { label: 'Mengandung huruf besar', pass: /[A-Z]/.test(password) },
    { label: 'Mengandung angka', pass: /[0-9]/.test(password) },
  ];
  const allPass = rules.every((r) => r.pass) && password === confirm && confirm.length > 0;

  return (
    <>
      {/* MOBILE */}
      <div className="md:hidden min-h-screen bg-background flex flex-col justify-center px-6 max-w-sm mx-auto py-10">
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#065f46] to-[#047857] flex items-center justify-center shadow-lg shadow-emerald-900/20">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-semibold text-foreground">Mizan Finance</h1>
            <p className="text-xs text-muted-foreground">Syariah Budgeting</p>
          </div>
        </div>

        {!done ? (
          <>
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mb-4 mx-auto">
              <Lock className="w-7 h-7 text-[#047857]" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground mb-2 text-center">Buat Password Baru</h2>
            <p className="text-sm text-muted-foreground mb-8 text-center">Password baru harus berbeda dari sebelumnya.</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Password Baru</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 8 karakter"
                    className="w-full px-4 py-3.5 pr-12 rounded-2xl border border-border bg-muted/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#047857] text-sm"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {password.length > 0 && (
                <div className="space-y-1.5">
                  {rules.map((r) => (
                    <div key={r.label} className={`flex items-center gap-2 text-xs transition-colors ${r.pass ? 'text-[#047857]' : 'text-muted-foreground'}`}>
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${r.pass ? 'bg-[#047857]' : 'border border-border'}`}>
                        {r.pass && <Check className="w-2.5 h-2.5 text-white" />}
                      </div>
                      {r.label}
                    </div>
                  ))}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Konfirmasi Password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Ulangi password baru"
                    className={`w-full px-4 py-3.5 pr-12 rounded-2xl border bg-muted/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 text-sm transition-colors ${
                      confirm.length > 0 && confirm !== password
                        ? 'border-red-400 focus:ring-red-400'
                        : 'border-border focus:ring-[#047857]'
                    }`}
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {confirm.length > 0 && confirm !== password && (
                  <p className="text-xs text-red-500 mt-1.5">Password tidak cocok</p>
                )}
              </div>

              <button
                onClick={() => allPass && setDone(true)}
                disabled={!allPass}
                className={`w-full py-4 rounded-2xl font-semibold transition-all text-sm ${
                  allPass
                    ? 'bg-gradient-to-r from-[#065f46] to-[#047857] text-white hover:shadow-lg'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                }`}
              >
                Simpan Password
              </button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-8 h-8 text-[#047857]" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">Password Berhasil Diubah!</h2>
            <p className="text-sm text-muted-foreground mb-8">Gunakan password baru Anda untuk masuk ke akun.</p>
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-gradient-to-r from-[#065f46] to-[#047857] text-white py-4 rounded-2xl font-semibold hover:shadow-lg transition-all text-sm"
            >
              Masuk Sekarang
            </button>
          </div>
        )}
      </div>

      {/* DESKTOP */}
      <div className="hidden md:flex w-full max-w-4xl bg-card rounded-3xl shadow-2xl border border-border overflow-hidden min-h-[560px]">

        {/* Kiri */}
        <div className="w-1/2 bg-gradient-to-br from-[#065f46] via-[#047857] to-[#059669] p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>

          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">Mizan Finance</h1>
              <p className="text-xs text-white/70">Syariah Budgeting</p>
            </div>
          </div>

          <div className="relative z-10 flex flex-col items-center text-center py-6">
            <div className="w-24 h-24 rounded-3xl bg-white/15 border border-white/20 flex items-center justify-center mb-6">
              <Lock className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-white text-xl font-semibold mb-3">Password Aman</h3>
            <p className="text-white/70 text-sm leading-relaxed max-w-[220px] mb-6">
              Buat password yang kuat untuk menjaga keamanan akun Anda.
            </p>

            <div className="w-full space-y-2">
              {['Minimal 8 karakter', 'Kombinasi huruf & angka', 'Tidak sama dengan sebelumnya'].map((tip) => (
                <div key={tip} className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2.5 border border-white/10">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-300 flex-shrink-0"></div>
                  <span className="text-white/80 text-xs">{tip}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10">
            <p className="text-white/90 text-sm font-medium leading-relaxed">
              "Keamanan akun Anda adalah prioritas kami."
            </p>
          </div>
        </div>

        {/* Kanan */}
        <div className="w-1/2 p-8 flex flex-col justify-center">
          {!done ? (
            <>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mb-5">
                <Lock className="w-6 h-6 text-[#047857]" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-1">Buat Password Baru</h2>
              <p className="text-sm text-muted-foreground mb-6">Password baru harus berbeda dari sebelumnya.</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Password Baru</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 8 karakter"
                      className="w-full px-4 py-3 pr-12 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#047857]"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  {password.length > 0 && (
                    <div className="flex gap-4 mt-2">
                      {rules.map((r) => (
                        <div key={r.label} className={`flex items-center gap-1.5 text-xs transition-colors ${r.pass ? 'text-[#047857]' : 'text-muted-foreground'}`}>
                          <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${r.pass ? 'bg-[#047857]' : 'border border-border'}`}>
                            {r.pass && <Check className="w-2 h-2 text-white" />}
                          </div>
                          {r.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Konfirmasi Password</label>
                  <div className="relative">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="Ulangi password baru"
                      className={`w-full px-4 py-3 pr-12 rounded-xl border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-colors ${
                        confirm.length > 0 && confirm !== password
                          ? 'border-red-400 focus:ring-red-400'
                          : 'border-border focus:ring-[#047857]'
                      }`}
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {confirm.length > 0 && confirm !== password && (
                    <p className="text-xs text-red-500 mt-1.5">Password tidak cocok</p>
                  )}
                </div>

                <button
                  onClick={() => allPass && setDone(true)}
                  disabled={!allPass}
                  className={`w-full py-3.5 rounded-xl font-medium transition-all ${
                    allPass
                      ? 'bg-gradient-to-r from-[#065f46] to-[#047857] text-white hover:shadow-lg hover:shadow-emerald-900/30'
                      : 'bg-muted text-muted-foreground cursor-not-allowed'
                  }`}
                >
                  Simpan Password
                </button>
              </div>

              <Link to="/login" className="text-center text-sm text-muted-foreground mt-6 hover:text-foreground transition-colors block">
                Kembali ke Login
              </Link>
            </>
          ) : (
            <div>
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-5">
                <CheckCircle className="w-7 h-7 text-[#047857]" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">Password Berhasil Diubah!</h2>
              <p className="text-sm text-muted-foreground mb-6">Gunakan password baru Anda untuk masuk ke akun.</p>
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-gradient-to-r from-[#065f46] to-[#047857] text-white py-3.5 rounded-xl font-medium hover:shadow-lg hover:shadow-emerald-900/30 transition-all"
              >
                Masuk Sekarang
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}