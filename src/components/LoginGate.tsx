import { useState, useEffect } from 'react';
import { 
  Shield, 
  Lock, 
  AlertCircle, 
  Loader2, 
  FileText, 
  CheckCircle2, 
  Mail, 
  ShieldCheck, 
  HelpCircle,
  Copy,
  Check,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { AppUser } from '../types';
import { signInWithGoogleSSO, subscribeToAuthState } from '../services/firebase';

interface LoginGateProps {
  onLogin: (user: AppUser) => void;
}

export default function LoginGate({ onLogin }: LoginGateProps) {
  const [errorMsg, setErrorMsg] = useState('');
  const [unauthorizedDomain, setUnauthorizedDomain] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [copiedDomain, setCopiedDomain] = useState(false);

  // Current domain / hostname
  const currentHost = typeof window !== 'undefined' ? window.location.hostname : '';

  // Subscribe to Firebase Auth state for automatic session restore
  useEffect(() => {
    const unsubscribe = subscribeToAuthState((firebaseAppUser) => {
      if (firebaseAppUser) {
        onLogin(firebaseAppUser);
      }
    });
    return () => unsubscribe();
  }, [onLogin]);

  // Handle Google SSO Login
  const handleGoogleSSOLogin = async () => {
    try {
      setIsGoogleLoading(true);
      setErrorMsg('');
      setUnauthorizedDomain(null);
      const loggedInUser = await signInWithGoogleSSO();
      onLogin(loggedInUser);
    } catch (err: any) {
      console.error('Google SSO Error:', err);
      if (err.code === 'auth/unauthorized-domain') {
        setUnauthorizedDomain(currentHost);
        setErrorMsg(
          `Domain "${currentHost}" belum didaftarkan di Firebase Authentication (Authorized Domains).`
        );
      } else if (err.code === 'auth/popup-closed-by-user') {
        setErrorMsg('Jendela login Google ditutup sebelum proses selesai.');
      } else if (err.code === 'auth/popup-blocked') {
        setErrorMsg('Jendela pop-up login diblokir oleh peramban. Silakan izinkan pop-up untuk situs ini.');
      } else {
        setErrorMsg(err.message || 'Akses ditolak. Pastikan Anda menggunakan akun resmi yang terdaftar.');
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Handle copy hostname
  const handleCopyHost = () => {
    if (currentHost) {
      navigator.clipboard.writeText(currentHost);
      setCopiedDomain(true);
      setTimeout(() => setCopiedDomain(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col justify-between relative overflow-hidden selection:bg-amber-500 selection:text-slate-950">
      {/* Background Subtle Grid & Lighting Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner Bar */}
      <header className="relative z-10 border-b border-slate-800 bg-[#151F33]/90 backdrop-blur px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-bold text-lg shadow-sm">
            ⚖
          </div>
          <div>
            <div className="text-xs font-semibold tracking-wider text-amber-400 uppercase">
              Kejaksaan Republik Indonesia
            </div>
            <div className="text-sm font-bold text-white">
              Kejaksaan Negeri Tabanan — Seksi Intelijen
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Lock className="w-3 h-3" />
            RAHASIA / INTERNAL
          </span>
        </div>
      </header>

      {/* Center Auth Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-6">
        <div className="w-full max-w-md bg-[#1E293B] border border-slate-700/70 rounded-2xl shadow-2xl p-6 sm:p-8 relative">
          
          {/* Official Emblem Top Badge */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 mb-3 font-bold">
              <Shield className="w-9 h-9 text-slate-950" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Papan Peta Intelijen
            </h1>
            <p className="text-xs font-bold text-amber-400 mt-0.5 tracking-wide uppercase">
              Seksi Intelijen Kejaksaan Negeri Tabanan
            </p>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Sistem Informasi Pelaporan Data Intelijen Yustisial
            </p>
          </div>

          {/* Error Message & Authorized Domain Helper */}
          {unauthorizedDomain ? (
            <div className="mb-5 p-4 text-xs bg-amber-950/80 border border-amber-500/60 text-amber-100 rounded-xl shadow-lg animate-in fade-in duration-200 space-y-3">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
                <div className="flex-1">
                  <div className="font-bold text-amber-300 text-sm">
                    Email tidak terdaftar, harap gunakan email yang terdaftar!
                  </div>
                </div>
              </div>

              {/* Hostname to copy */}
            </div>
          ) : errorMsg ? (
            <div className="mb-5 p-3.5 text-xs bg-rose-950/90 border border-rose-800/90 text-rose-200 rounded-xl flex items-start gap-2.5 shadow-sm animate-in fade-in duration-200">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <div className="flex-1 leading-relaxed">{errorMsg}</div>
            </div>
          ) : null}

          {/* Primary SSO Google Login Button */}
          <div className="space-y-4">
            <button
              type="button"
              id="btn-google-sso-login"
              disabled={isGoogleLoading}
              onClick={handleGoogleSSOLogin}
              className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm transition-all flex items-center justify-center gap-3 shadow-xl shadow-black/40 border border-slate-300 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed group active:scale-[0.99]"
            >
              {isGoogleLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-slate-800" />
              ) : (
                /* Google G Logo SVG */
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>{isGoogleLoading ? 'Menghubungkan Akun...' : 'Masuk dengan Google (SSO)'}</span>
            </button>

            {/* Information Points */}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-700/80 flex items-center justify-between text-xs text-slate-400">
            <span className="text-amber-400/90 font-medium">Seksi Intelijen</span>
            <span className="flex items-center gap-1 text-slate-400 font-mono text-[11px]">
              <FileText className="w-3.5 h-3.5" />
              Kejari Tabanan v2.6
            </span>
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="relative z-10 py-3 border-t border-slate-800 text-center text-xs text-slate-400 bg-[#151F33]/80">
        Kejaksaan Negeri Tabanan — Jl. Sudirman No.5, Dajan Peken, Kec. Tabanan, Kabupaten Tabanan, Bali 82121 | Dokumen Yustisial Terbatas
      </footer>
    </div>
  );
}
