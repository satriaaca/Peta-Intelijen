import React from 'react';
import { motion } from 'motion/react';
import { 
  FileCheck2,
  Compass, 
  Radio, 
  Layers,
  Send,
  Satellite
} from 'lucide-react';

interface IntelligenceOfficerVectorProps {
  className?: string;
}

export default function IntelligenceOfficerVector({ 
  className = ''
}: IntelligenceOfficerVectorProps) {
  return (
    <div className={`relative flex flex-col items-center justify-center select-none w-full ${className}`}>
      
      {/* Background Soft Glow Aura */}
      <motion.div 
        animate={{
          scale: [0.95, 1.15, 0.95],
          opacity: [0.35, 0.65, 0.35]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -inset-8 bg-gradient-to-tr from-emerald-600/20 via-sky-600/20 to-amber-500/20 rounded-full blur-3xl pointer-events-none"
      />

      {/* Floating Animated Badges (SIPEDE / E-Disposisi Style) */}
      <motion.div 
        animate={{ y: [0, -8, 0], x: [0, 3, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-3 left-4 sm:left-8 z-30 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#091526]/95 border border-emerald-500/50 text-[11px] font-mono text-emerald-300 shadow-xl backdrop-blur-md"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span className="font-bold tracking-wider">E-DISPOSISI INTELIJEN</span>
      </motion.div>

      <motion.div 
        animate={{ y: [0, 8, 0], x: [0, -3, 0] }}
        transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-1/3 -right-2 sm:right-2 z-30 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#091526]/95 border border-amber-500/50 text-[11px] font-mono text-amber-300 shadow-xl backdrop-blur-md"
      >
        <FileCheck2 className="w-3.5 h-3.5 text-amber-400" />
        <span className="font-semibold">TERVERIFIKASI TTE</span>
      </motion.div>

      {/* Main SVG Animated Scene (Pure Digital Command Workstation & E-Disposisi Flow) */}
      <div className="relative z-10 w-full max-w-[420px] sm:max-w-[480px] aspect-[4/3.3]">
        <svg 
          viewBox="0 0 520 400" 
          className="w-full h-full drop-shadow-2xl overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="wallBack" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0B1526" />
              <stop offset="100%" stopColor="#070D18" />
            </linearGradient>

            <linearGradient id="deskGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="60%" stopColor="#0F172A" />
              <stop offset="100%" stopColor="#0B1324" />
            </linearGradient>

            <linearGradient id="deskEdge" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="50%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>

            <linearGradient id="mainMonitorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0284C7" />
              <stop offset="50%" stopColor="#0369A1" />
              <stop offset="100%" stopColor="#082F49" />
            </linearGradient>

            <linearGradient id="sideMonitorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#065F46" />
              <stop offset="50%" stopColor="#047857" />
              <stop offset="100%" stopColor="#064E3B" />
            </linearGradient>

            <linearGradient id="goldInsignia" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE68A" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>

            <linearGradient id="holoStream" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="rgba(56, 189, 248, 0.45)" />
              <stop offset="50%" stopColor="rgba(16, 185, 129, 0.25)" />
              <stop offset="100%" stopColor="rgba(245, 158, 11, 0)" />
            </linearGradient>

            <linearGradient id="serverGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0F172A" />
              <stop offset="50%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>

            <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Wall Window / Circular GIS Grid */}
          <g transform="translate(260, 150)" opacity="0.25">
            <circle cx="0" cy="0" r="140" fill="none" stroke="#1E293B" strokeWidth="2" />
            <circle cx="0" cy="0" r="110" fill="none" stroke="#334155" strokeWidth="1.5" strokeDasharray="6 6" />
            <circle cx="0" cy="0" r="60" fill="none" stroke="#059669" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="-150" y1="0" x2="150" y2="0" stroke="#334155" strokeWidth="1.5" />
            <line x1="0" y1="-150" x2="0" y2="150" stroke="#334155" strokeWidth="1.5" />
          </g>

          {/* Background Wall Clock with Animated Hands */}
          <g transform="translate(440, 75)">
            <circle cx="0" cy="0" r="28" fill="#0B1324" stroke="#1E293B" strokeWidth="2" />
            <circle cx="0" cy="0" r="24" fill="#0F172A" />
            <circle cx="0" cy="0" r="2" fill="#F59E0B" />
            {/* Clock hour markings */}
            <circle cx="0" cy="-20" r="1" fill="#94A3B8" />
            <circle cx="20" cy="0" r="1" fill="#94A3B8" />
            <circle cx="0" cy="20" r="1" fill="#94A3B8" />
            <circle cx="-20" cy="0" r="1" fill="#94A3B8" />
            {/* Clock Minute hand */}
            <motion.line 
              x1="0" y1="0" x2="0" y2="-16" 
              stroke="#38BDF8" 
              strokeWidth="2" 
              strokeLinecap="round"
              animate={{ rotate: 360 }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: "0px 0px" }}
            />
            {/* Clock Hour hand */}
            <line x1="0" y1="0" x2="10" y2="-2" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
          </g>

          {/* Background Rotating Gears / Transmission Mechanism */}
          <g transform="translate(80, 85)" opacity="0.45">
            <motion.g
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <circle cx="0" cy="0" r="22" fill="none" stroke="#059669" strokeWidth="4" strokeDasharray="8 4" />
              <circle cx="0" cy="0" r="12" fill="#0B1728" stroke="#10B981" strokeWidth="2" />
            </motion.g>
            <motion.g
              animate={{ rotate: -360 }}
              transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
              transform="translate(28, 24)"
            >
              <circle cx="0" cy="0" r="14" fill="none" stroke="#F59E0B" strokeWidth="3" strokeDasharray="6 3" />
              <circle cx="0" cy="0" r="7" fill="#0B1728" stroke="#F59E0B" strokeWidth="1.5" />
            </motion.g>
          </g>

          {/* Animated Flying Electronic Letters / Disposisi Envelopes */}
          {/* Flight Path Dotted Line */}
          <path 
            d="M 50 190 Q 150 90 260 160 T 450 110" 
            fill="none" 
            stroke="#10B981" 
            strokeWidth="1.5" 
            strokeDasharray="4 6" 
            opacity="0.35" 
          />

          {/* Flying Paper Plane / Surat Cepat */}
          <motion.g
            animate={{ 
              x: [0, 45, 0],
              y: [0, -20, 0],
              rotate: [0, 8, 0]
            }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
            transform="translate(70, 135)"
          >
            <polygon points="0,0 28,-10 8,16 6,5" fill="#38BDF8" />
            <polygon points="8,16 28,-10 16,8" fill="#0284C7" />
            <line x1="-12" y1="4" x2="-2" y2="2" stroke="#38BDF8" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
          </motion.g>

          {/* Floating Electronic Mail 1 (Green/Kejaksaan E-Disposisi) */}
          <motion.g
            animate={{ 
              y: [0, -12, 0],
              rotate: [-3, 3, -3]
            }}
            transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
            transform="translate(120, 95)"
          >
            <rect x="0" y="0" width="50" height="34" rx="6" fill="#064E3B" stroke="#10B981" strokeWidth="1.5" filter="url(#glowEffect)" />
            {/* Envelope Flap */}
            <polygon points="0,0 25,18 50,0" fill="#047857" stroke="#10B981" strokeWidth="1" />
            {/* Golden Kejaksaan Stamp */}
            <circle cx="25" cy="18" r="5" fill="#F59E0B" />
          </motion.g>

          {/* Floating Electronic Mail 2 (Amber/Disposisi Sektor) */}
          <motion.g
            animate={{ 
              y: [0, 10, 0],
              rotate: [3, -3, 3]
            }}
            transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
            transform="translate(355, 85)"
          >
            <rect x="0" y="0" width="46" height="30" rx="5" fill="#1E1B4B" stroke="#818CF8" strokeWidth="1.2" />
            <polygon points="0,0 23,15 46,0" fill="#312E81" stroke="#818CF8" strokeWidth="0.8" />
            <circle cx="23" cy="15" r="5" fill="#38BDF8" />
          </motion.g>

          {/* Office Plant with Swaying Leaves (Left Corner) */}
          <g transform="translate(50, 290)">
            {/* Pot */}
            <polygon points="10,40 35,40 40,0 5,0" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />
            <rect x="2" y="-4" width="41" height="6" rx="2" fill="#1E293B" />
            {/* Leaves with Gentle Sway */}
            <motion.path 
              d="M 22 -4 Q 5 -30 2 -60 Q 20 -40 22 -4" 
              fill="#059669" 
              animate={{ rotate: [-4, 4, -4] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{ transformOrigin: "22px -4px" }}
            />
            <motion.path 
              d="M 24 -4 Q 40 -25 46 -55 Q 30 -35 24 -4" 
              fill="#10B981" 
              animate={{ rotate: [3, -3, 3] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
              style={{ transformOrigin: "24px -4px" }}
            />
            <motion.path 
              d="M 23 -4 Q 25 -35 26 -70 Q 18 -45 23 -4" 
              fill="#34D399" 
              animate={{ rotate: [-2, 2, -2] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
              style={{ transformOrigin: "23px -4px" }}
            />
          </g>

          {/* Modern Command Desk Server & Workstation Displays (Center-Focused) */}
          
          {/* Desk Workstation Table Surface */}
          <g>
            {/* Table Surface */}
            <polygon points="60,315 460,315 490,390 30,390" fill="url(#deskGrad)" stroke="#1E293B" strokeWidth="2" />
            {/* Glowing Front Edge Line */}
            <line x1="30" y1="390" x2="490" y2="390" stroke="url(#deskEdge)" strokeWidth="3" />

            {/* Left Side Screen: Secondary Analytics & GIS Terminal */}
            <g transform="translate(110, 205)">
              <rect x="0" y="0" width="80" height="95" rx="5" fill="#0B1324" stroke="#334155" strokeWidth="1.5" />
              <rect x="4" y="4" width="72" height="87" rx="3" fill="url(#sideMonitorGrad)" />
              {/* GIS Map & Sector Badges */}
              <circle cx="40" cy="35" r="18" fill="#064E3B" stroke="#34D399" strokeWidth="0.8" strokeDasharray="3 3" />
              <circle cx="40" cy="35" r="4" fill="#F59E0B" />
              <circle cx="30" cy="42" r="2.5" fill="#38BDF8" />
              <circle cx="50" cy="30" r="2.5" fill="#EF4444" />
              {/* Telemetry rows */}
              <rect x="10" y="62" width="60" height="4" rx="1" fill="#A7F3D0" opacity="0.9" />
              <rect x="10" y="70" width="45" height="4" rx="1" fill="#6EE7B7" opacity="0.8" />
              <rect x="10" y="78" width="52" height="4" rx="1" fill="#34D399" opacity="0.7" />
              {/* Stand */}
              <rect x="35" y="95" width="10" height="15" fill="#1E293B" />
              <rect x="25" y="110" width="30" height="4" rx="1" fill="#334155" />
            </g>

            {/* Right Side Screen: Security & Server Telemetry Terminal */}
            <g transform="translate(330, 205)">
              <rect x="0" y="0" width="80" height="95" rx="5" fill="#0B1324" stroke="#334155" strokeWidth="1.5" />
              <rect x="4" y="4" width="72" height="87" rx="3" fill="#111827" />
              {/* Top Bar */}
              <rect x="8" y="8" width="64" height="6" rx="1" fill="#1F2937" />
              <circle cx="13" cy="11" r="1.5" fill="#10B981" />
              <circle cx="18" cy="11" r="1.5" fill="#F59E0B" />
              {/* Server rack status bars */}
              <rect x="10" y="20" width="60" height="12" rx="2" fill="#1F2937" stroke="#374151" strokeWidth="0.8" />
              <circle cx="18" cy="26" r="2" fill="#10B981" />
              <rect x="26" y="24" width="38" height="4" rx="1" fill="#60A5FA" />

              <rect x="10" y="36" width="60" height="12" rx="2" fill="#1F2937" stroke="#374151" strokeWidth="0.8" />
              <circle cx="18" cy="42" r="2" fill="#F59E0B" />
              <rect x="26" y="40" width="32" height="4" rx="1" fill="#FBBF24" />

              <rect x="10" y="52" width="60" height="12" rx="2" fill="#1F2937" stroke="#374151" strokeWidth="0.8" />
              <circle cx="18" cy="58" r="2" fill="#10B981" />
              <rect x="26" y="56" width="40" height="4" rx="1" fill="#34D399" />

              {/* Encryption lock */}
              <rect x="10" y="70" width="60" height="15" rx="2" fill="#1E1B4B" stroke="#6366F1" strokeWidth="0.8" />
              <rect x="30" y="74" width="20" height="7" rx="1" fill="#818CF8" />
              {/* Stand */}
              <rect x="35" y="95" width="10" height="15" fill="#1E293B" />
              <rect x="25" y="110" width="30" height="4" rx="1" fill="#334155" />
            </g>

            {/* Center Main Ultra-Wide Screen (Primary SIPEDE Command & Dispatch Portal) */}
            <g transform="translate(190, 175)">
              {/* Outer Monitor Frame */}
              <rect x="0" y="0" width="140" height="100" rx="8" fill="#0B1324" stroke="#334155" strokeWidth="2" />
              {/* Glowing Monitor Screen */}
              <rect x="5" y="5" width="130" height="90" rx="4" fill="url(#mainMonitorGrad)" />
              
              {/* Screen Top Header Bar */}
              <rect x="10" y="10" width="120" height="8" rx="2" fill="#075985" />
              <circle cx="16" cy="14" r="2" fill="#EF4444" />
              <circle cx="23" cy="14" r="2" fill="#F59E0B" />
              <circle cx="30" cy="14" r="2" fill="#10B981" />
              <rect x="42" y="12" width="50" height="4" rx="1" fill="#BAE6FD" opacity="0.8" />

              {/* Screen Main Radar & E-Disposisi Feed */}
              <rect x="10" y="24" width="46" height="34" rx="3" fill="#0369A1" stroke="#38BDF8" strokeWidth="1" />
              {/* Radar Grid on Monitor */}
              <circle cx="33" cy="41" r="12" fill="none" stroke="#7DD3FC" strokeWidth="0.8" strokeDasharray="3 3" />
              <circle cx="33" cy="41" r="4" fill="#F59E0B" />
              <line x1="21" y1="41" x2="45" y2="41" stroke="#7DD3FC" strokeWidth="0.6" />
              <line x1="33" y1="29" x2="33" y2="53" stroke="#7DD3FC" strokeWidth="0.6" />

              {/* Live Signal Pulse on Screen */}
              <motion.path 
                d="M 62 30 L 72 30 L 78 20 L 86 42 L 94 25 L 102 30 L 122 30" 
                fill="none" 
                stroke="#10B981" 
                strokeWidth="2"
                strokeLinecap="round"
                filter="url(#glowEffect)"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Incoming E-Disposisi Notification Bar on Screen */}
              <rect x="62" y="44" width="60" height="7" rx="2" fill="#FDE68A" />
              <rect x="62" y="55" width="50" height="5" rx="1.5" fill="#BAE6FD" opacity="0.9" />
              
              {/* Document Flow Status Blocks on Screen */}
              <rect x="10" y="64" width="36" height="24" rx="3" fill="#0284C7" stroke="#38BDF8" strokeWidth="0.6" />
              <rect x="52" y="64" width="36" height="24" rx="3" fill="#065F46" stroke="#10B981" strokeWidth="0.6" />
              <rect x="94" y="64" width="36" height="24" rx="3" fill="#831843" stroke="#F43F5E" strokeWidth="0.6" />

              {/* Monitor Stand Base */}
              <rect x="60" y="100" width="20" height="24" fill="#1E293B" stroke="#334155" strokeWidth="1" />
              <polygon points="40,124 100,124 105,130 35,130" fill="#0F172A" stroke="#334155" strokeWidth="1" />
            </g>

            {/* Holographic Projection Above Main Monitor */}
            <g transform="translate(260, 175)">
              <polygon points="-55,0 55,0 90,-105 -90,-105" fill="url(#holoStream)" pointerEvents="none" />
              
              {/* Floating Shield & Adhyaksa Scale Node */}
              <motion.g
                animate={{ 
                  y: [-75, -90, -75],
                  rotate: [0, 4, -4, 0]
                }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <circle cx="0" cy="0" r="28" fill="rgba(11, 23, 40, 0.92)" stroke="#F59E0B" strokeWidth="2" filter="url(#glowEffect)" />
                {/* Scales of Justice */}
                <polygon points="0,-14 3,-5 12,-5 6,1 8,9 0,4 -8,9 -6,1 -12,-5 -3,-5" fill="#F59E0B" />
                <line x1="-12" y1="2" x2="12" y2="2" stroke="#38BDF8" strokeWidth="1.5" />
                <line x1="0" y1="-8" x2="0" y2="12" stroke="#38BDF8" strokeWidth="1.5" />
                <circle cx="-10" cy="8" r="3.5" fill="none" stroke="#10B981" strokeWidth="1.2" />
                <circle cx="10" cy="8" r="3.5" fill="none" stroke="#10B981" strokeWidth="1.2" />

                {/* Orbiting Satellite Data Particle */}
                <motion.g
                  animate={{ rotate: 360 }}
                  transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
                >
                  <circle cx="42" cy="0" r="4" fill="#38BDF8" filter="url(#glowEffect)" />
                  <circle cx="-42" cy="0" r="4" fill="#10B981" filter="url(#glowEffect)" />
                </motion.g>
              </motion.g>

              {/* Upward Ascending Data Sparks */}
              <motion.circle 
                cx="-24" cy="0" r="2" fill="#38BDF8"
                animate={{ cy: [-5, -100], opacity: [0.9, 0], scale: [1, 2] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut", delay: 0.2 }}
              />
              <motion.circle 
                cx="26" cy="0" r="2" fill="#F59E0B"
                animate={{ cy: [-5, -95], opacity: [0.9, 0], scale: [1, 2.2] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut", delay: 0.9 }}
              />
            </g>

            {/* Desktop Accessories on Table */}
            
            {/* Center Keyboard & Glowing Trackpad / Disposisi Terminal Pad */}
            <g transform="translate(200, 325)">
              {/* Keyboard base */}
              <polygon points="0,0 120,0 130,22 -10,22" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />
              {/* Key rows with subtle backlighting */}
              <rect x="5" y="3" width="110" height="3" rx="1" fill="#1E293B" />
              <rect x="3" y="8" width="114" height="3" rx="1" fill="#1E293B" />
              <rect x="0" y="13" width="120" height="3" rx="1" fill="#1E293B" />
              {/* Spacebar glow */}
              <rect x="35" y="18" width="50" height="2.5" rx="1" fill="#38BDF8" opacity="0.8" />
            </g>

            {/* Wireless Mouse */}
            <g transform="translate(345, 335)">
              <ellipse cx="8" cy="10" rx="6" ry="9" fill="#0F172A" stroke="#334155" strokeWidth="1" />
              <line x1="8" y1="3" x2="8" y2="9" stroke="#38BDF8" strokeWidth="1" />
            </g>

            {/* Coffee Cup with Animated Rising Steam (Right Desk) */}
            <g transform="translate(390, 325)">
              {/* Cup */}
              <rect x="0" y="8" width="22" height="24" rx="4" fill="#0284C7" stroke="#38BDF8" strokeWidth="1" />
              <path d="M 22 12 C 28 12 28 22 22 22" fill="none" stroke="#38BDF8" strokeWidth="1.5" />
              {/* Kejaksaan small logo on mug */}
              <circle cx="11" cy="20" r="3" fill="#F59E0B" />
              {/* Rising Steam Animations */}
              <motion.path 
                d="M 6 4 Q 4 -4 8 -12" 
                fill="none" 
                stroke="#94A3B8" 
                strokeWidth="1.2" 
                strokeLinecap="round"
                animate={{ y: [0, -10], opacity: [0.8, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
              />
              <motion.path 
                d="M 14 4 Q 16 -4 12 -14" 
                fill="none" 
                stroke="#94A3B8" 
                strokeWidth="1.2" 
                strokeLinecap="round"
                animate={{ y: [0, -12], opacity: [0.9, 0] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut", delay: 0.8 }}
              />
            </g>

            {/* Official Document Tray / Berkas D.IN (Left Desk) */}
            <g transform="translate(100, 328)">
              <rect x="0" y="8" width="50" height="22" rx="3" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />
              {/* Stacked Letters / File Folders */}
              <rect x="4" y="3" width="42" height="6" rx="1" fill="#065F46" />
              <rect x="4" y="-3" width="42" height="6" rx="1" fill="#D97706" />
              <rect x="4" y="-9" width="42" height="6" rx="1" fill="#0284C7" />
              {/* Badge */}
              <rect x="12" y="14" width="26" height="4" rx="2" fill="#38BDF8" opacity="0.8" />
            </g>
          </g>
        </svg>
      </div>

      {/* Interactive Status Footer under Digital Command Center */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-2 text-center"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B1526]/90 border border-slate-700/80 text-slate-300 text-xs font-medium backdrop-blur-md shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white font-semibold tracking-wide">Pusat Komando & Disposisi Intelijen</span>
          <span className="text-slate-500 font-mono text-[10px]">| SIPEDE KEJARI TABANAN</span>
        </div>
      </motion.div>
    </div>
  );
}
