import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Lock, 
  AlertCircle, 
  Loader2, 
  FileCheck2,
  CheckCircle2, 
  ShieldCheck, 
  HelpCircle,
  Copy,
  Check,
  ShieldAlert,
  Compass, 
  Satellite,
  Fingerprint,
  Info,
  X,
  Sparkles,
  ExternalLink,
  Sun,
  Moon
} from 'lucide-react';
import { AppUser } from '../types';
import { signInWithGoogleSSO, subscribeToAuthState } from '../services/firebase';
import { useTheme } from '../context/ThemeContext';
import IntelligenceOfficerVector from './IntelligenceOfficerVector';

interface LoginGateProps {
  onLogin: (user: AppUser) => void;
}

export default function LoginGate({ onLogin }: LoginGateProps) {
  const { theme, toggleTheme } = useTheme();
  const [errorMsg, setErrorMsg] = useState('');

  const [unauthorizedDomain, setUnauthorizedDomain] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
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
    <div className="min-h-screen bg-[#070D18] text-slate-100 flex flex-col justify-between relative overflow-x-hidden selection:bg-amber-500 selection:text-slate-950">
      
      {/* Background Animated Surveillance & Radar Grid Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none" />
      
      {/* Ambient Kejaksaan Emerald & Gold Glowing Orbs */}
      <motion.div 
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.15, 0.28, 0.15],
          x: [0, 35, 0],
          y: [0, -25, 0]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -top-32 -left-32 w-[34rem] h-[34rem] bg-emerald-600/20 rounded-full blur-[110px] pointer-events-none" 
      />

      <motion.div 
        animate={{
          scale: [1.1, 0.9, 1.1],
          opacity: [0.12, 0.24, 0.12],
          x: [0, -35, 0],
          y: [0, 30, 0]
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -bottom-36 -right-36 w-[36rem] h-[36rem] bg-amber-500/18 rounded-full blur-[120px] pointer-events-none" 
      />

      {/* Top Navbar Header (SIPEDE Kejaksaan Dark Header) */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-20 border-b border-slate-800/90 bg-[#081220]/90 backdrop-blur-md px-5 sm:px-10 py-3.5 flex items-center justify-between shadow-xl"
      >
        <div className="flex items-center gap-3.5">
          <motion.div 
            whileHover={{ rotate: 12, scale: 1.05 }}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-amber-500/20"
          >
            ⚖
          </motion.div>
          <div>
            <div className="text-[11px] sm:text-xs font-extrabold tracking-wider text-amber-400 uppercase flex items-center gap-2">
              <span>Kejaksaan Republik Indonesia</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <div className="text-xs sm:text-sm font-bold text-white tracking-tight">
              Kejaksaan Negeri Tabanan — Seksi Intelijen
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Switcher Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border transition-colors cursor-pointer ${
              theme === 'light'
                ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                : 'bg-slate-800/80 text-amber-400 border-slate-700 hover:bg-slate-700'
            }`}
            title={theme === 'light' ? 'Beralih ke Mode Gelap' : 'Beralih ke Mode Terang'}
          >
            {theme === 'light' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-600" />
                <span>Terang</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-amber-400" />
                <span>Gelap</span>
              </>
            )}
          </button>

          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>SIPEDE & SI-INTEL V2.6</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/30 font-mono">
            <Lock className="w-3 h-3 text-rose-400" />
            <span>TERBATAS / RAHASIA</span>
          </span>
        </div>
      </motion.header>

      {/* Center Main Stage (Split Layout with SIPEDE Animation on Left and Single Sign-On on Right) */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column (6 Cols) - SIPEDE Animated Scene Showcase */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left space-y-5"
          >
            {/* Vector Character & Office Animation */}
            <div className="w-full flex justify-center lg:justify-start">
              <IntelligenceOfficerVector />
            </div>

            {/* Title & Description */}
            <div className="space-y-2.5 max-w-lg">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold font-mono tracking-wider">
                <Satellite className="w-3.5 h-3.5 text-amber-400" />
                <span>SISTEM PERSURATAN & DISPOSISI ELEKTRONIK</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                Papan Peta & Disposisi Intelijen Terpadu
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Portal digital resmi Kejaksaan Negeri Tabanan untuk integrasi persuratan D.IN, alur e-disposisi cepat, pemetaan intelijen spasial 5W+1H, pemantauan orang asing (POA), dan bank data kartu TIK yustisial.
              </p>
            </div>

            {/* Quick Feature Badges */}
            <div className="grid grid-cols-3 gap-2.5 w-full max-w-lg pt-1">
              <div className="p-3 rounded-2xl bg-[#0B1526]/80 border border-slate-800 text-left">
                <FileCheck2 className="w-4 h-4 text-emerald-400 mb-1.5" />
                <div className="text-xs font-bold text-white">E-Disposisi</div>
                <div className="text-[10px] text-slate-400">Sektor D.IN Cepat</div>
              </div>
              <div className="p-3 rounded-2xl bg-[#0B1526]/80 border border-slate-800 text-left">
                <Compass className="w-4 h-4 text-sky-400 mb-1.5" />
                <div className="text-xs font-bold text-white">Peta 5W+1H</div>
                <div className="text-[10px] text-slate-400">10 Kecamatan</div>
              </div>
              <div className="p-3 rounded-2xl bg-[#0B1526]/80 border border-slate-800 text-left">
                <Fingerprint className="w-4 h-4 text-amber-400 mb-1.5" />
                <div className="text-xs font-bold text-white">Bank Data TIK</div>
                <div className="text-[10px] text-slate-400">KEP-135/2019</div>
              </div>
            </div>
          </motion.div>

          {/* Right Column (6 Cols) - Pure SSO Single Sign-On Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              type: "spring",
              damping: 26,
              stiffness: 320,
              duration: 0.6,
              delay: 0.15
            }}
            className="lg:col-span-6 w-full max-w-md mx-auto bg-[#0E182A]/95 border border-slate-700/80 rounded-3xl shadow-2xl p-6 sm:p-8 relative backdrop-blur-xl overflow-hidden"
          >
            {/* Top Glowing Gradient Accent Bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-amber-400 to-sky-500" />
            
            {/* Form Header */}
            <div className="text-center mb-6">
              <div className="relative inline-flex items-center justify-center mb-3">
                {/* Radiating beacon rings */}
                <motion.div 
                  animate={{
                    scale: [1, 1.4, 1.8],
                    opacity: [0.6, 0.2, 0],
                  }}
                  transition={{
                    duration: 2.8,
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                  className="absolute inset-0 rounded-2xl bg-amber-500/30 pointer-events-none"
                />
                
                <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 p-[2px] shadow-xl shadow-amber-500/20">
                  <div className="w-full h-full rounded-2xl bg-[#091322] flex items-center justify-center">
                    <Shield className="w-8 h-8 text-amber-400 drop-shadow-md" />
                  </div>
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold tracking-widest uppercase mb-2 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                MASUK KE SISTEM (SIPEDE / SI-INTEL)
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Single Sign-On (SSO)
              </h1>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                Silakan autentikasi menggunakan akun resmi Google Workspace Kejaksaan RI
              </p>
            </div>

            {/* Error Message & Authorized Domain Helper */}
            <AnimatePresence mode="wait">
              {unauthorizedDomain ? (
                <motion.div 
                  key="unauth"
                  initial={{ opacity: 0, height: 0, scale: 0.95 }}
                  animate={{ opacity: 1, height: 'auto', scale: 1 }}
                  exit={{ opacity: 0, height: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="mb-5 p-4 text-xs bg-amber-950/80 border border-amber-500/60 text-amber-100 rounded-2xl shadow-lg space-y-3"
                >
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-bold text-amber-300 text-sm">
                        Domain Belum Diotorisasi
                      </div>
                      <p className="text-[11px] text-amber-200/90 mt-1">
                        Domain <code className="bg-black/40 px-1.5 py-0.5 rounded font-mono text-amber-300">{unauthorizedDomain}</code> belum didaftarkan di Firebase Console.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleCopyHost}
                    className="w-full py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    {copiedDomain ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedDomain ? 'Tersalin ke Clipboard!' : 'Salin Domain Host'}</span>
                  </button>
                </motion.div>
              ) : errorMsg ? (
                <motion.div 
                  key="err"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ 
                    opacity: 1, 
                    x: [0, -6, 6, -4, 4, 0] 
                  }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                  className="mb-5 p-3.5 text-xs bg-rose-950/90 border border-rose-800/90 text-rose-200 rounded-2xl flex items-start gap-2.5 shadow-md"
                >
                  <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                  <div className="flex-1 leading-relaxed">{errorMsg}</div>
                </motion.div>
              ) : null}
            </AnimatePresence>

            {/* Official Google SSO Login Action */}
            <div className="space-y-4">
              <motion.button
                type="button"
                id="btn-google-sso-login"
                disabled={isGoogleLoading}
                onClick={handleGoogleSSOLogin}
                whileHover={{ scale: 1.02, boxShadow: "0 10px 30px -5px rgba(245, 158, 11, 0.3)" }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 px-5 rounded-2xl bg-white hover:bg-slate-50 text-slate-900 font-bold text-sm transition-all flex items-center justify-center gap-3 shadow-xl shadow-black/50 border border-slate-200 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/15 to-transparent -translate-x-full group-hover:translate-x-full duration-1000 transition-transform" />

                {isGoogleLoading ? (
                  <div className="flex items-center gap-2.5">
                    <Loader2 className="w-5 h-5 animate-spin text-amber-600" />
                    <span>Menghubungkan Autentikasi SSO...</span>
                  </div>
                ) : (
                  <>
                    <svg className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
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
                    <span className="tracking-tight font-bold">Masuk dengan Akun Google SSO</span>
                  </>
                )}
              </motion.button>

              {/* Informational Guidance Box */}
              <div className="p-4 rounded-2xl bg-[#091322] border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>Single Sign-On Terintegrasi</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Gunakan email resmi institusi Kejaksaan RI atau akun yang telah diberi wewenang akses oleh Seksi Intelijen Kejari Tabanan.
                </p>
              </div>
            </div>

            {/* Footer Inside Auth Box */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>SSL 256-Bit Terproteksi</span>
              </span>
              <button
                type="button"
                onClick={() => setShowHelpModal(true)}
                className="text-slate-400 hover:text-amber-400 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Panduan Akses</span>
              </button>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Bottom Footer Info */}
      <footer className="relative z-10 py-3.5 border-t border-slate-800/90 text-center text-[11px] text-slate-400 bg-[#081220]/90 backdrop-blur-md px-4 flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto w-full gap-2">
        <div>
          Hak Cipta © 2026 <strong className="text-slate-300">Kejaksaan Republik Indonesia</strong> — Kejaksaan Negeri Tabanan.
        </div>
        <div className="flex items-center gap-4 text-slate-500 font-mono text-[10px]">
          <span>SATYA ADHI WICAKSANA</span>
          <span>•</span>
          <span>KEP-135/A/JA/05/2019</span>
        </div>
      </footer>

      {/* Help & SSO Instructions Modal */}
      <AnimatePresence>
        {showHelpModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-[#0F172A] border border-slate-700 rounded-3xl shadow-2xl p-6 relative overflow-hidden"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold text-white text-base">Panduan Akses SSO</h3>
                </div>
                <button
                  onClick={() => setShowHelpModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-4 space-y-3.5 text-xs text-slate-300 leading-relaxed">
                <p>
                  Sesuai dengan protokol keamanan sistem <strong>SIPEDE & SI-INTEL Kejaksaan RI</strong>:
                </p>
                <div className="p-3.5 rounded-xl bg-[#091222] border border-slate-800 space-y-2">
                  <div className="font-semibold text-amber-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Metode Tunggal: Google SSO</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Masuk secara langsung dengan akun email Google Workspace resmi Kejaksaan RI. Sesi Anda akan tersimpan otomatis secara aman.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#091222] border border-slate-800 space-y-1.5">
                  <div className="font-semibold text-sky-300">
                    Bantuan Akun & Hak Akses?
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Silakan hubungi <strong>Kasi / Kasubsi Intelijen Kejaksaan Negeri Tabanan</strong> atau Administrator Sistem untuk pendaftaran akun dan pembagian peran (Role Intelijen).
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => setShowHelpModal(false)}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                >
                  Mengerti
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
