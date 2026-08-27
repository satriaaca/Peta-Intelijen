import React from 'react';
import { 
  Shield, 
  Flag, 
  Users, 
  Landmark, 
  Vote, 
  AlertOctagon, 
  Map, 
  Terminal, 
  Ban, 
  UserCheck, 
  Scale, 
  Gavel,
  BookOpen,
  BookCopy,
  Library,
  Radio,
  Sun,
  Flame,
  Globe2,
  Building,
  HeartHandshake,
  ShieldCheck,
  GraduationCap,
  Building2,
  Coins,
  TrendingUp,
  Search,
  Sprout,
  Receipt,
  Ship,
  Scroll,
  ShoppingBag,
  Factory,
  HardHat,
  Trees,
  TreePine,
  Leaf,
  Fish,
  Compass,
  Milestone,
  Train,
  Plane,
  TowerControl,
  Anchor,
  FlameKindling,
  Droplets,
  Waves,
  Dam,
  Wheat,
  Sailboat,
  Zap,
  Wind,
  Fuel,
  Cpu,
  Home,
  Palmtree,
  Boxes,
  DoorClosed,
  Layers,
  FileSpreadsheet,
  Eye,
  RadioTower,
  Network,
  VenetianMask,
  Fingerprint,
  KeyRound,
  EyeOff,
  FileCheck2,
  ShieldAlert,
  UserCog,
  Award,
  Sparkles,
  Smartphone
} from 'lucide-react';
import { findSubsectorSymbol, OfficialSubsectorSymbol } from '../services/officialDinData';

interface SectorSymbolBadgeProps {
  symbolCodeOrName?: string;
  badgeCode?: string;
  keterangan?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
  showCategory?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function SectorSymbolBadge({
  symbolCodeOrName,
  badgeCode,
  keterangan,
  size = 'md',
  showLabel = false,
  showCategory = false,
  className = '',
  onClick
}: SectorSymbolBadgeProps) {
  const query = symbolCodeOrName || badgeCode || keterangan || '';
  const symbol = findSubsectorSymbol(query);

  // Size specifications
  const sizeMap = {
    xs: { box: 'w-6 h-6', icon: 'w-3.5 h-3.5', text: 'text-[9px]', badge: 'text-[8px] px-1 py-0.2' },
    sm: { box: 'w-8 h-8', icon: 'w-4 h-4', text: 'text-[11px]', badge: 'text-[9px] px-1.5 py-0.5' },
    md: { box: 'w-10 h-10', icon: 'w-5 h-5', text: 'text-xs', badge: 'text-[10px] px-2 py-0.5' },
    lg: { box: 'w-12 h-12', icon: 'w-6 h-6', text: 'text-sm', badge: 'text-xs px-2.5 py-1' },
    xl: { box: 'w-16 h-16', icon: 'w-8 h-8', text: 'text-base', badge: 'text-xs px-3 py-1' },
  };

  const currentSize = sizeMap[size];

  // Render high-fidelity SVG icon based on iconType
  const renderIcon = (type?: string, themeColor: string = '#F59E0B') => {
    switch (type) {
      // D.IN.2 Symbols
      case 'pancasila':
        return (
          <div className="relative flex items-center justify-center">
            <Shield className={`${currentSize.icon} text-amber-400`} />
            <span className="absolute text-[8px] font-bold text-amber-950 font-serif">5</span>
          </div>
        );
      case 'flag_indonesia':
        return <Flag className={`${currentSize.icon} text-red-500`} />;
      case 'separatis':
        return <AlertOctagon className={`${currentSize.icon} text-red-600`} />;
      case 'governance':
        return <Landmark className={`${currentSize.icon} text-blue-400`} />;
      case 'ballot':
        return <Vote className={`${currentSize.icon} text-purple-400`} />;
      case 'terrorism':
        return <Flame className={`${currentSize.icon} text-red-600`} />;
      case 'territory':
        return <Map className={`${currentSize.icon} text-emerald-400`} />;
      case 'cyber_crime':
        return <Terminal className={`${currentSize.icon} text-cyan-400`} />;
      case 'cekal':
        return <Ban className={`${currentSize.icon} text-orange-500`} />;
      case 'foreigner':
        return <UserCheck className={`${currentSize.icon} text-teal-400`} />;
      case 'adhyaksa_shield':
        return <Scale className={`${currentSize.icon} text-emerald-400`} />;
      case 'justice_gavel':
        return <Gavel className={`${currentSize.icon} text-amber-400`} />;

      // D.IN.3 Symbols
      case 'book_print':
        return <BookOpen className={`${currentSize.icon} text-sky-400`} />;
      case 'import_book':
        return <BookCopy className={`${currentSize.icon} text-blue-500`} />;
      case 'library':
        return <Library className={`${currentSize.icon} text-indigo-400`} />;
      case 'broadcast':
        return <Radio className={`${currentSize.icon} text-purple-400`} />;
      case 'religion_harmony':
        return <Sun className={`${currentSize.icon} text-amber-400`} />;
      case 'mosque_temple':
        return <Building className={`${currentSize.icon} text-rose-500`} />;
      case 'culture_heritage':
        return <Globe2 className={`${currentSize.icon} text-rose-400`} />;
      case 'village':
        return <Building2 className={`${currentSize.icon} text-green-500`} />;
      case 'ngo_group':
        return <Users className={`${currentSize.icon} text-orange-400`} />;
      case 'peace_hand':
        return <HeartHandshake className={`${currentSize.icon} text-fuchsia-400`} />;
      case 'public_order':
        return <ShieldCheck className={`${currentSize.icon} text-emerald-500`} />;
      case 'law_abiding':
        return <GraduationCap className={`${currentSize.icon} text-teal-400`} />;

      // D.IN.4 Symbols
      case 'bank':
        return <Building2 className={`${currentSize.icon} text-blue-500`} />;
      case 'coins_vault':
        return <Coins className={`${currentSize.icon} text-emerald-400`} />;
      case 'chart_growth':
        return <TrendingUp className={`${currentSize.icon} text-teal-400`} />;
      case 'asset_recovery':
        return <Search className={`${currentSize.icon} text-amber-500`} />;
      case 'invest_plant':
        return <Sprout className={`${currentSize.icon} text-emerald-400`} />;
      case 'tax_stamp':
        return <Receipt className={`${currentSize.icon} text-red-400`} />;
      case 'cargo_ship':
        return <Ship className={`${currentSize.icon} text-sky-400`} />;
      case 'excise_stamp':
        return <Scroll className={`${currentSize.icon} text-purple-400`} />;
      case 'trade_scale':
        return <ShoppingBag className={`${currentSize.icon} text-orange-400`} />;
      case 'factory_gear':
        return <Factory className={`${currentSize.icon} text-slate-400`} />;
      case 'workers':
        return <HardHat className={`${currentSize.icon} text-blue-400`} />;
      case 'plantation':
        return <Trees className={`${currentSize.icon} text-green-500`} />;
      case 'forest':
        return <TreePine className={`${currentSize.icon} text-green-600`} />;
      case 'eco_globe':
        return <Leaf className={`${currentSize.icon} text-emerald-400`} />;
      case 'fish':
        return <Fish className={`${currentSize.icon} text-sky-400`} />;
      case 'land_cert':
        return <Compass className={`${currentSize.icon} text-amber-600`} />;

      // D.IN.5 Symbols (PPS)
      case 'road_bridge':
        return <Milestone className={`${currentSize.icon} text-slate-300`} />;
      case 'train_rail':
        return <Train className={`${currentSize.icon} text-blue-400`} />;
      case 'airport':
        return <Plane className={`${currentSize.icon} text-sky-400`} />;
      case 'telecom_tower':
        return <TowerControl className={`${currentSize.icon} text-purple-400`} />;
      case 'harbor_crane':
        return <Anchor className={`${currentSize.icon} text-teal-400`} />;
      case 'smelter':
        return <FlameKindling className={`${currentSize.icon} text-orange-500`} />;
      case 'water_tap':
        return <Droplets className={`${currentSize.icon} text-sky-400`} />;
      case 'levee':
        return <Waves className={`${currentSize.icon} text-cyan-500`} />;
      case 'dam':
        return <Dam className={`${currentSize.icon} text-blue-500`} />;
      case 'agriculture':
        return <Wheat className={`${currentSize.icon} text-green-500`} />;
      case 'ocean_ship':
        return <Sailboat className={`${currentSize.icon} text-cyan-400`} />;
      case 'electric_bolt':
        return <Zap className={`${currentSize.icon} text-yellow-400`} />;
      case 'renewable_energy':
        return <Wind className={`${currentSize.icon} text-emerald-400`} />;
      case 'oil_rig':
        return <Fuel className={`${currentSize.icon} text-orange-400`} />;
      case 'science_lab':
        return <Cpu className={`${currentSize.icon} text-indigo-400`} />;
      case 'housing':
        return <Home className={`${currentSize.icon} text-pink-400`} />;
      case 'tourism_temple':
        return <Palmtree className={`${currentSize.icon} text-amber-400`} />;
      case 'industry_park':
        return <Boxes className={`${currentSize.icon} text-purple-400`} />;
      case 'border_gate':
        return <DoorClosed className={`${currentSize.icon} text-emerald-400`} />;
      case 'strategic_misc':
        return <Layers className={`${currentSize.icon} text-slate-400`} />;

      // D.IN.6 Symbols (TI & Prodintel)
      case 'report_prod':
        return <FileSpreadsheet className={`${currentSize.icon} text-blue-400`} />;
      case 'cctv_eye':
        return <Eye className={`${currentSize.icon} text-sky-400`} />;
      case 'signals':
        return <RadioTower className={`${currentSize.icon} text-purple-400`} />;
      case 'cyber_ops':
        return <Network className={`${currentSize.icon} text-cyan-400`} />;
      case 'clandestine':
        return <VenetianMask className={`${currentSize.icon} text-slate-200`} />;
      case 'digital_forensics':
        return <Fingerprint className={`${currentSize.icon} text-pink-400`} />;
      case 'crypto_key':
        return <KeyRound className={`${currentSize.icon} text-emerald-400`} />;
      case 'counter_spy':
        return <EyeOff className={`${currentSize.icon} text-red-400`} />;
      case 'security_audit':
        return <FileCheck2 className={`${currentSize.icon} text-amber-400`} />;
      case 'signal_jamming':
        return <ShieldAlert className={`${currentSize.icon} text-blue-400`} />;
      case 'sdm_training':
        return <UserCog className={`${currentSize.icon} text-emerald-400`} />;
      case 'intelligence_academy':
        return <Award className={`${currentSize.icon} text-teal-400`} />;
      case 'tech_gears':
        return <Sparkles className={`${currentSize.icon} text-indigo-400`} />;
      case 'app_system':
        return <Smartphone className={`${currentSize.icon} text-purple-400`} />;

      default:
        return <Shield className={`${currentSize.icon} text-amber-400`} />;
    }
  };

  const displayName = symbol ? symbol.name : symbolCodeOrName;
  const themeColor = symbol?.themeColor || '#F59E0B';

  return (
    <div 
      onClick={onClick}
      className={`inline-flex items-center gap-2 ${onClick ? 'cursor-pointer hover:opacity-90' : ''} ${className}`}
      title={symbol ? `${symbol.sectionCode} No. ${symbol.no} - ${symbol.name}: ${symbol.description}` : symbolCodeOrName}
    >
      {/* Crisp vector emblem badge */}
      <div 
        className={`${currentSize.box} rounded-xl flex items-center justify-center shrink-0 border relative shadow-md transition-transform group`}
        style={{
          backgroundColor: '#0F172A',
          borderColor: `${themeColor}60`,
          boxShadow: `0 0 10px ${themeColor}15`
        }}
      >
        {/* Subtle accent glow */}
        <div 
          className="absolute inset-0 rounded-xl opacity-10 pointer-events-none"
          style={{ backgroundColor: themeColor }}
        />
        {renderIcon(symbol?.iconType, themeColor)}
        
        {/* Subsector number badge */}
        {symbol && (
          <span 
            className="absolute -bottom-1 -right-1 text-[8px] font-mono font-black px-1 rounded bg-slate-900 border text-slate-200"
            style={{ borderColor: `${themeColor}80` }}
          >
            {symbol.no}
          </span>
        )}
      </div>

      {/* Optional Text Labels */}
      {(showLabel || showCategory) && (
        <div className="flex flex-col text-left">
          {showCategory && symbol && (
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              {symbol.sectionCode} • {symbol.category}
            </span>
          )}
          {showLabel && (
            <span className={`font-semibold text-slate-100 ${currentSize.text} leading-tight truncate max-w-[200px]`}>
              {displayName}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
