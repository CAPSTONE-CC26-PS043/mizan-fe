import { useState } from 'react';
import { Link } from 'react-router';
import { Shield, Mail, ArrowLeft, CheckCircle } from 'lucide-react';

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState('');

  return (
    <>
      {/* MOBILE */}
      <div className="md:hidden min-h-screen bg-background flex flex-col justify-center px-6 max-w-sm mx-auto">
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#065f46] to-[#047857] flex items-center justify-center shadow-lg shadow-emerald-900/20">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-semibold text-foreground">Mizan Finance</h1>
            <p className="text-xs text-muted-foreground">Syariah Budgeting</p>
          </div>
        </div>

        {!sent ? (
          <>
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mb-4 mx-auto">
              <Mail className="w-7 h-7 text-[#047857]" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground mb-2 text-center">Lupa Password?</h2>
            <p className="text-sm text-muted-foreground mb-8 text-center">
              Masukkan email Anda. Kami kirimkan link untuk reset password.
            </p>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full px-4 py-3.5 rounded-2xl border border-border bg-muted/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#047857] text-sm"
                />
              </div>
              <button
                onClick={() => setSent(true)}
                className="w-full bg-gradient-to-r from-[#065f46] to-[#047857] text-white py-4 rounded-2xl font-semibold hover:shadow-lg transition-all text-sm"
              >
                Kirim Link Reset
              </button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-8 h-8 text-[#047857]" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">Email Terkirim!</h2>
            <p className="text-sm text-muted-foreground mb-2">
              Link reset password dikirim ke
            </p>
            <p className="text-sm font-semibold text-foreground mb-6">{email}</p>
            <p className="text-xs text-muted-foreground mb-8">
              Link berlaku 24 jam. Cek folder spam jika tidak muncul di inbox.
            </p>
            <button
              onClick={() => setSent(false)}
              className="text-sm text-[#047857] font-medium hover:underline"
            >
              Kirim ulang email
            </button>
          </div>
        )}

        <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-8 hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Login
        </Link>
      </div>

      {/* DESKTOP */}
      <div className="hidden md:flex w-full max-w-4xl bg-card rounded-3xl shadow-2xl border border-border overflow-hidden min-h-[520px]">

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

          <div className="relative z-10 flex flex-col items-center text-center py-8">
            {/* Ilustrasi email */}
            <div className="w-24 h-24 rounded-3xl bg-white/15 border border-white/20 flex items-center justify-center mb-6">
              <Mail className="w-12 h-12 text-white" />
            </div>

            <h3 className="text-white text-xl font-semibold mb-3">Reset via Email</h3>
            <p className="text-white/70 text-sm leading-relaxed max-w-[220px]">
              Kami kirimkan link aman ke email Anda untuk membuat password baru.
            </p>

            <div className="mt-6 w-full space-y-2">
              {['Link dikirim dalam hitungan detik', 'Berlaku selama 24 jam', 'Aman & terenkripsi'].map((item) => (
                <div key={item} className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2.5 border border-white/10">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-300 flex-shrink-0"></div>
                  <span className="text-white/80 text-xs">{item}</span>
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
          {!sent ? (
            <>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mb-5">
                <Mail className="w-6 h-6 text-[#047857]" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-1">Lupa Password?</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Masukkan email Anda. Kami kirimkan link reset password.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#047857]"
                  />
                </div>
                <button
                  onClick={() => setSent(true)}
                  className="w-full bg-gradient-to-r from-[#065f46] to-[#047857] text-white py-3.5 rounded-xl font-medium hover:shadow-lg hover:shadow-emerald-900/30 transition-all"
                >
                  Kirim Link Reset
                </button>
              </div>
            </>
          ) : (
            <div>
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-5">
                <CheckCircle className="w-7 h-7 text-[#047857]" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">Email Terkirim!</h2>
              <p className="text-sm text-muted-foreground mb-1">Link dikirim ke</p>
              <p className="text-sm font-semibold text-foreground mb-4">{email}</p>
              <div className="bg-muted/40 rounded-xl p-4 mb-6">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Link berlaku 24 jam. Jika tidak muncul di inbox, cek folder spam atau klik kirim ulang di bawah.
                </p>
              </div>
              <button
                onClick={() => setSent(false)}
                className="text-sm text-[#047857] font-medium hover:underline"
              >
                Kirim ulang email
              </button>
            </div>
          )}

          <Link to="/login" className="flex items-center gap-2 text-sm text-muted-foreground mt-8 hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Login
          </Link>
        </div>
      </div>
    </>
  );
}