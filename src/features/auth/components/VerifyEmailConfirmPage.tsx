import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Shield, Mail, RefreshCw, CheckCircle } from 'lucide-react';

export function VerifyEmailPage() {
  const [resent, setResent] = useState(false);
  const [verified, setVerified] = useState(false);
  const navigate = useNavigate();

  const handleResend = () => {
    setResent(true);
    setTimeout(() => setResent(false), 5000);
  };

  // Email from registration process, ideally from state/store
  const email = 'nama@email.com';

  return (
    <>
      {/* MOBILE */}
      <div className="md:hidden min-h-screen bg-background flex flex-col justify-center px-6 max-w-sm mx-auto">
        {!verified ? (
          <div className="text-center">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#065f46] to-[#047857] flex items-center justify-center shadow-lg shadow-emerald-900/20 mx-auto mb-6">
              <Shield className="w-6 h-6 text-white" />
            </div>

            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto">
                <Mail className="w-10 h-10 text-[#047857]" />
              </div>
              <div className="absolute bottom-0 right-1/2 translate-x-8 translate-y-1 w-6 h-6 bg-[#047857] rounded-full flex items-center justify-center border-2 border-background">
                <span className="text-white text-xs font-bold">1</span>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-foreground mb-2">Check Your Email</h2>
            <p className="text-sm text-muted-foreground mb-1">We sent a verification link to</p>
            <p className="text-sm font-semibold text-foreground mb-6">{email}</p>

            <div className="bg-muted/40 rounded-2xl p-4 mb-8 text-left space-y-3">
              {[
                'Open the email from Mizan Finance',
                'Click the "Verify Email" button',
                'You will be automatically logged into the app',
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#047857]/10 text-[#047857] flex items-center justify-center flex-shrink-0 text-xs font-semibold mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-sm text-foreground">{step}</p>
                </div>
              ))}
            </div>

            {resent && (
              <div className="flex items-center justify-center gap-2 text-xs text-[#047857] mb-4">
                <CheckCircle className="w-4 h-4" />
                Verification email resent successfully
              </div>
            )}

            <button
              onClick={handleResend}
              disabled={resent}
              className="flex items-center justify-center gap-2 text-sm text-[#047857] font-medium mx-auto hover:underline disabled:opacity-50 mb-6"
            >
              <RefreshCw className={`w-4 h-4 ${resent ? 'animate-spin' : ''}`} />
              {resent ? 'Sending...' : 'Resend email'}
            </button>

            {/* This button is for demo/testing only, not needed in production */}
            <button
              onClick={() => setVerified(true)}
              className="w-full border border-border py-3.5 rounded-2xl text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
            >
              I have verified
            </button>

            <p className="text-xs text-muted-foreground mt-6">
              Wrong email?{' '}
              <button onClick={() => navigate('/register')} className="text-[#047857] font-medium hover:underline">
                Register again
              </button>
            </p>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-10 h-10 text-[#047857]" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">Email Verified!</h2>
            <p className="text-sm text-muted-foreground mb-8">Your account is active. Welcome to Mizan Finance.</p>
            <button
              onClick={() => navigate('/app')}
              className="w-full bg-gradient-to-r from-[#065f46] to-[#047857] text-white py-4 rounded-2xl font-semibold hover:shadow-lg transition-all text-sm"
            >
              Get Started
            </button>
          </div>
        )}
      </div>

      {/* DESKTOP */}
      <div className="hidden md:flex w-full max-w-4xl bg-card rounded-3xl shadow-2xl border border-border overflow-hidden min-h-[520px]">

        {/* Left */}
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
            {/* Envelope animation */}
            <div className="relative mb-6">
              <div className="w-28 h-28 rounded-3xl bg-white/15 border border-white/20 flex items-center justify-center">
                <Mail className="w-14 h-14 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-400 rounded-full flex items-center justify-center border-2 border-[#065f46]">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
            </div>

            <h3 className="text-white text-xl font-semibold mb-2">Almost Done!</h3>
            <p className="text-white/70 text-sm leading-relaxed max-w-[220px] mb-6">
              One more step to activate your Mizan Finance account.
            </p>

            <div className="w-full space-y-2">
              {[
                { num: '1', text: 'Open the email from Mizan Finance' },
                { num: '2', text: 'Click "Verify Email"' },
                { num: '3', text: 'Your account will be activated instantly' },
              ].map((s) => (
                <div key={s.num} className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-2.5 border border-white/10">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
                    {s.num}
                  </div>
                  <span className="text-white/80 text-xs">{s.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10">
            <p className="text-white/90 text-sm font-medium leading-relaxed">
              "Email verification keeps your account secure from unauthorized access."
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="w-1/2 p-8 flex flex-col justify-center">
          {!verified ? (
            <>
              <div className="relative mb-5 w-fit">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                  <Mail className="w-7 h-7 text-[#047857]" />
                </div>
              </div>

              <h2 className="text-2xl font-semibold text-foreground mb-1">Check Your Email</h2>
              <p className="text-sm text-muted-foreground mb-1">We sent a verification link to</p>
              <p className="text-sm font-semibold text-foreground mb-6">{email}</p>

              <div className="bg-muted/40 rounded-xl p-4 mb-6 space-y-3">
                <p className="text-xs font-medium text-foreground mb-2">How to verify:</p>
                {[
                  'Open the email from Mizan Finance',
                  'Click the "Verify Email" button',
                  'You will be automatically logged into the app',
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-[#047857]/15 text-[#047857] flex items-center justify-center flex-shrink-0 text-[10px] font-semibold mt-0.5">
                      {i + 1}
                    </div>
                    <p className="text-xs text-muted-foreground">{step}</p>
                  </div>
                ))}
              </div>

              {resent && (
                <div className="flex items-center gap-2 text-xs text-[#047857] mb-3">
                  <CheckCircle className="w-4 h-4" />
                  Verification email resent successfully
                </div>
              )}

              <button
                onClick={handleResend}
                disabled={resent}
                className="flex items-center gap-2 text-sm text-[#047857] font-medium hover:underline disabled:opacity-50 mb-4"
              >
                <RefreshCw className={`w-4 h-4 ${resent ? 'animate-spin' : ''}`} />
                {resent ? 'Sending...' : 'Resend email'}
              </button>

              <div className="h-px bg-border mb-4"></div>

              <button
                onClick={() => setVerified(true)}
                className="w-full border border-border py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
              >
                I have verified
              </button>

              <p className="text-xs text-muted-foreground mt-4">
                Wrong email?{' '}
                <button onClick={() => navigate('/register')} className="text-[#047857] font-medium hover:underline">
                  Register again
                </button>
              </p>
            </>
          ) : (
            <div>
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-5">
                <CheckCircle className="w-7 h-7 text-[#047857]" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">Email Verified!</h2>
              <p className="text-sm text-muted-foreground mb-6">Your account is active. Welcome to Mizan Finance.</p>
              <button
                onClick={() => navigate('/app')}
                className="w-full bg-gradient-to-r from-[#065f46] to-[#047857] text-white py-3.5 rounded-xl font-medium hover:shadow-lg hover:shadow-emerald-900/30 transition-all"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
