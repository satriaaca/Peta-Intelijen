// Helper to generate crisp SVG strings and Leaflet divIcons for all 74 Subsector Symbols
// Based on Lampiran IV KEP-135/A/JA/05/2019

import L from 'leaflet';
import { OfficialSubsectorSymbol, findSubsectorSymbol, OFFICIAL_SECTOR_SYMBOLS } from './officialDinData';

export interface StrategicLandmarkPoint {
  id: string;
  name: string;
  kecamatan: string;
  lat: number;
  lng: number;
  symbolBadgeCode: string;
  category: string;
  keterangan: string;
  description: string;
  importance: 'SANGAT_STRATEGIS' | 'STRATEGIS' | 'RUTIN';
}

/**
 * High-precision SVG Path generators for all 74 Subsector Symbols
 */
export function getSymbolSvgPath(iconType?: string): string {
  switch (iconType) {
    // D.IN.2 Symbols
    case 'pancasila':
      return `<path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="12" cy="11" r="2.5" fill="currentColor"/><path d="M12 7v1.5M12 14.5V16M8 11H9.5M14.5 11H16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>`;
    case 'flag_indonesia':
      return `<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><line x1="4" y1="22" x2="4" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="4" y1="8" x2="20" y2="8" stroke="currentColor" stroke-width="1.5"/>`;
    case 'separatis':
      return `<polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" fill="none" stroke="currentColor" stroke-width="2"/><line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`;
    case 'governance':
      return `<line x1="3" y1="22" x2="21" y2="22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="6" y1="18" x2="6" y2="11" stroke="currentColor" stroke-width="2"/><line x1="10" y1="18" x2="10" y2="11" stroke="currentColor" stroke-width="2"/><line x1="14" y1="18" x2="14" y2="11" stroke="currentColor" stroke-width="2"/><line x1="18" y1="18" x2="18" y2="11" stroke="currentColor" stroke-width="2"/><polygon points="12 2 20 7 4 7" fill="none" stroke="currentColor" stroke-width="2"/>`;
    case 'ballot':
      return `<path d="M4 14l8 7 8-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M4 8l8 7 8-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M4 2l8 7 8-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`;
    case 'terrorism':
      return `<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>`;
    case 'territory':
      return `<polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" fill="none" stroke="currentColor" stroke-width="2"/><line x1="9" y1="3" x2="9" y2="18" stroke="currentColor" stroke-width="2"/><line x1="15" y1="6" x2="15" y2="21" stroke="currentColor" stroke-width="2"/>`;
    case 'cyber_crime':
      return `<polyline points="4 17 10 11 4 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="12" y1="19" x2="20" y2="19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`;
    case 'cekal':
      return `<circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" stroke="currentColor" stroke-width="2"/>`;
    case 'foreigner':
      return `<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="9" cy="7" r="4" fill="none" stroke="currentColor" stroke-width="2"/><polyline points="16 11 18 13 22 9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
    case 'adhyaksa_shield':
      return `<path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 8v8M8 12h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`;
    case 'justice_gavel':
      return `<path d="M14 13l5 5m-4-7l5-5a2.12 2.12 0 1 1 3 3l-5 5m-6 0l-5 5a2.12 2.12 0 1 1-3-3l5-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="2" y1="21" x2="8" y2="21" stroke="currentColor" stroke-width="2"/>`;

    // D.IN.3 Symbols
    case 'book_print':
      return `<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" fill="none" stroke="currentColor" stroke-width="2"/>`;
    case 'import_book':
      return `<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" fill="none" stroke="currentColor" stroke-width="2"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" fill="none" stroke="currentColor" stroke-width="2"/><polyline points="10 9 13 12 10 15" fill="none" stroke="currentColor" stroke-width="2"/>`;
    case 'library':
      return `<path d="M4 20h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" fill="none" stroke="currentColor" stroke-width="2"/><line x1="8" y1="4" x2="8" y2="20" stroke="currentColor" stroke-width="2"/><line x1="12" y1="4" x2="12" y2="20" stroke="currentColor" stroke-width="2"/><line x1="16" y1="4" x2="16" y2="20" stroke="currentColor" stroke-width="2"/>`;
    case 'broadcast':
      return `<circle cx="12" cy="12" r="2" fill="currentColor"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`;
    case 'religion_harmony':
      return `<circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" stroke-width="2"/><line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" stroke-width="2"/><line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" stroke-width="2"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" stroke-width="2"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" stroke-width="2"/><line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" stroke-width="2"/><line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" stroke-width="2"/>`;
    case 'mosque_temple':
      return `<path d="M3 21h18M5 21V10l7-5 7 5v11M10 21v-6a2 2 0 0 1 4 0v6" fill="none" stroke="currentColor" stroke-width="2"/>`;
    case 'culture_heritage':
      return `<circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="2"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" fill="none" stroke="currentColor" stroke-width="2"/>`;
    case 'village':
      return `<path d="M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14" fill="none" stroke="currentColor" stroke-width="2"/><path d="M2 20h20" stroke="currentColor" stroke-width="2"/><path d="M14 12v.01M10 12v.01M10 8v.01M14 8v.01M10 16v.01M14 16v.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`;
    case 'ngo_group':
      return `<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="9" cy="7" r="4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M23 21v-2a4 4 0 0 0-3-3.87" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16 3.13a4 4 0 0 1 0 7.75" fill="none" stroke="currentColor" stroke-width="2"/>`;
    case 'peace_hand':
      return `<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" fill="none" stroke="currentColor" stroke-width="2"/>`;
    case 'public_order':
      return `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="none" stroke="currentColor" stroke-width="2"/><polyline points="9 12 11 14 15 10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
    case 'law_abiding':
      return `<path d="M22 10v6M2 10l10-5 10 5-10 5z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M6 12v5c3 3 9 3 12 0v-5" fill="none" stroke="currentColor" stroke-width="2"/>`;

    // D.IN.4 Symbols
    case 'bank':
      return `<line x1="3" y1="21" x2="21" y2="21" stroke="currentColor" stroke-width="2"/><line x1="4" y1="10" x2="20" y2="10" stroke="currentColor" stroke-width="2"/><polygon points="12 3 2 10 22 10" fill="none" stroke="currentColor" stroke-width="2"/><line x1="6" y1="10" x2="6" y2="21" stroke="currentColor" stroke-width="2"/><line x1="10" y1="10" x2="10" y2="21" stroke="currentColor" stroke-width="2"/><line x1="14" y1="10" x2="14" y2="21" stroke="currentColor" stroke-width="2"/><line x1="18" y1="10" x2="18" y2="21" stroke="currentColor" stroke-width="2"/>`;
    case 'coins_vault':
      return `<circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="2"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18" fill="none" stroke="currentColor" stroke-width="2"/><path d="M7 6h2v4H7z" fill="currentColor"/>`;
    case 'chart_growth':
      return `<polyline points="23 6 13.5 15.5 8.5 10.5 1 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polyline points="17 6 23 6 23 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
    case 'asset_recovery':
      return `<circle cx="11" cy="11" r="8" fill="none" stroke="currentColor" stroke-width="2"/><line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" stroke-width="2"/><path d="M11 8v6M8 11h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`;
    case 'invest_plant':
      return `<path d="M12 20v-8M7 8a5 5 0 0 1 5-5 5 5 0 0 1 5 5v3a5 5 0 0 1-5 5 5 5 0 0 1-5-5z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 14c-3 0-5 2-5 6h10c0-4-2-6-5-6z" fill="none" stroke="currentColor" stroke-width="2"/>`;
    case 'tax_stamp':
      return `<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" fill="none" stroke="currentColor" stroke-width="2"/><line x1="8" y1="7" x2="16" y2="7" stroke="currentColor" stroke-width="2"/><line x1="8" y1="11" x2="16" y2="11" stroke="currentColor" stroke-width="2"/><line x1="8" y1="15" x2="12" y2="15" stroke="currentColor" stroke-width="2"/>`;
    case 'cargo_ship':
      return `<path d="M2 17l20 2-4 3H6L2 17z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M4 14h16v3H4z" fill="none" stroke="currentColor" stroke-width="2"/><rect x="6" y="8" width="4" height="6" stroke="currentColor" stroke-width="1.5"/><rect x="12" y="8" width="4" height="6" stroke="currentColor" stroke-width="1.5"/>`;
    case 'excise_stamp':
      return `<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="7" cy="17" r="2" stroke="currentColor" stroke-width="2"/><circle cx="17" cy="17" r="2" stroke="currentColor" stroke-width="2"/>`;
    case 'trade_scale':
      return `<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" fill="none" stroke="currentColor" stroke-width="2"/><line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" stroke-width="2"/><path d="M16 10a4 4 0 0 1-8 0" fill="none" stroke="currentColor" stroke-width="2"/>`;
    case 'factory_gear':
      return `<path d="M2 20h20M7 20V8l5 4V8l5 4V4h3v16" fill="none" stroke="currentColor" stroke-width="2"/>`;
    case 'workers':
      return `<path d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M4 15v-3a8 8 0 0 1 16 0v3" fill="none" stroke="currentColor" stroke-width="2"/>`;
    case 'plantation':
      return `<path d="M10 10v.2A3 3 0 0 1 8.9 16H5a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M7 16v6M17 14v8" stroke="currentColor" stroke-width="2"/><path d="M20 8v.2A3 3 0 0 1 18.9 14H15a3 3 0 0 1-1-5.8V8a3 3 0 0 1 6 0z" fill="none" stroke="currentColor" stroke-width="2"/>`;
    case 'forest':
      return `<polygon points="12 2 4 14 8 14 5 20 19 20 16 14 20 14 12 2" fill="none" stroke="currentColor" stroke-width="2"/><line x1="12" y1="20" x2="12" y2="23" stroke="currentColor" stroke-width="2"/>`;
    case 'eco_globe':
      return `<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" fill="none" stroke="currentColor" stroke-width="2"/>`;
    case 'fish':
      return `<path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.46-3.44 6-7 6s-7.56-2.54-8.5-6Z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M18 12h.01M2 16l4.5-4L2 8" fill="none" stroke="currentColor" stroke-width="2"/>`;
    case 'land_cert':
      return `<circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor"/>`;

    // D.IN.5 Symbols (PPS)
    case 'road_bridge':
      return `<path d="M4 19L8 5M16 5l4 14M12 5v14M8 12h8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`;
    case 'train_rail':
      return `<rect x="4" y="3" width="16" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M4 11h16M12 3v8M8 19l-3 3M16 19l3 3M9 15h.01M15 15h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`;
    case 'airport':
      return `<path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3.5c-.5-.5-2.5 0-4 1.5L13.5 8.5 5.3 6.7c-.9-.2-1.8.1-2.4.7l-.4.4 6 4.5-3.5 3.5-3-1-1 1 3 2.5 2.5 3 1-1-1-3 3.5-3.5 4.5 6 .4-.4c.6-.6.9-1.5.7-2.4l-1.8-8.2z" fill="none" stroke="currentColor" stroke-width="1.8"/>`;
    case 'telecom_tower':
      return `<path d="M4 22h16M12 2v20M8 8l8 8M16 8l-8 8M9 4h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`;
    case 'harbor_crane':
      return `<circle cx="12" cy="5" r="3" fill="none" stroke="currentColor" stroke-width="2"/><line x1="12" y1="22" x2="12" y2="8" stroke="currentColor" stroke-width="2"/><path d="M5 12H2a10 10 0 0 0 20 0h-3" fill="none" stroke="currentColor" stroke-width="2"/>`;
    case 'smelter':
      return `<path d="M12 2v8M4 10h16M6 10l2 11h8l2-11" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="16" r="2" fill="currentColor"/>`;
    case 'water_tap':
      return `<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill="none" stroke="currentColor" stroke-width="2"/>`;
    case 'levee':
      return `<path d="M2 12c3-3 6 3 10 0s7 3 10 0M2 17c3-3 6 3 10 0s7 3 10 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`;
    case 'dam':
      return `<path d="M4 4h16v4H4zM4 16h16v4H4zM4 8l4 8M20 8l-4 8M12 8v8" fill="none" stroke="currentColor" stroke-width="2"/>`;
    case 'agriculture':
      return `<path d="M2 22h20M12 2a4 4 0 0 0-4 4v16M12 2a4 4 0 0 1 4 4v16M8 10l-4-2M16 10l4-2M8 14l-4-2M16 14l4-2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`;
    case 'ocean_ship':
      return `<path d="M2 20a2.4 2.4 0 0 0 2 1 2.4 2.4 0 0 0 2-1 2.4 2.4 0 0 1 2-1 2.4 2.4 0 0 1 2 1 2.4 2.4 0 0 0 2 1 2.4 2.4 0 0 0 2-1 2.4 2.4 0 0 1 2-1 2.4 2.4 0 0 1 2 1 2.4 2.4 0 0 0 2 1 2.4 2.4 0 0 0 2-1" stroke="currentColor" stroke-width="2"/><path d="M19 17L5 17l-2-4h18l-2 4zM12 2l-7 11h7V2zM12 4l6 9h-6V4z" fill="none" stroke="currentColor" stroke-width="1.8"/>`;
    case 'electric_bolt':
      return `<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor"/>`;
    case 'renewable_energy':
      return `<path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2M9.6 4.6A2 2 0 1 1 11 8H2M12.6 19.4A2 2 0 1 0 14 16H2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`;
    case 'oil_rig':
      return `<path d="M3 22h12M4 9h10M4 4h10M4 4v18M14 4v18M14 9l7 4v9h-7" fill="none" stroke="currentColor" stroke-width="2"/>`;
    case 'science_lab':
      return `<rect x="4" y="4" width="16" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><rect x="9" y="9" width="6" height="6" stroke="currentColor" stroke-width="2"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" stroke="currentColor" stroke-width="2"/>`;
    case 'housing':
      return `<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="none" stroke="currentColor" stroke-width="2"/><polyline points="9 22 9 12 15 12 15 22" fill="none" stroke="currentColor" stroke-width="2"/>`;
    case 'tourism_temple':
      return `<path d="M13 8c0-2.76-2.46-5-5.5-5S2 5.24 2 8h2c1.66 0 3 1.34 3 3v9h4v-9c0-1.66 1.34-3 3-3h2z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M13 7.14A5.82 5.82 0 0 1 16.5 6c3.04 0 5.5 2.24 5.5 5h-2a3 3 0 0 0-3 3v6h-4" fill="none" stroke="currentColor" stroke-width="2"/>`;
    case 'industry_park':
      return `<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" fill="none" stroke="currentColor" stroke-width="2"/><polyline points="3.27 6.96 12 12.01 20.73 6.96" fill="none" stroke="currentColor" stroke-width="2"/><line x1="12" y1="22.08" x2="12" y2="12" stroke="currentColor" stroke-width="2"/>`;
    case 'border_gate':
      return `<path d="M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14M2 20h20M14 12v.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`;
    case 'strategic_misc':
      return `<polygon points="12 2 2 7 12 12 22 7 12 2" fill="none" stroke="currentColor" stroke-width="2"/><polyline points="2 17 12 22 22 17" fill="none" stroke="currentColor" stroke-width="2"/><polyline points="2 12 12 17 22 12" fill="none" stroke="currentColor" stroke-width="2"/>`;

    // D.IN.6 Symbols (TI & Prodintel)
    case 'report_prod':
      return `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="none" stroke="currentColor" stroke-width="2"/><polyline points="14 2 14 8 20 8" fill="none" stroke="currentColor" stroke-width="2"/><line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" stroke-width="2"/><line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" stroke-width="2"/>`;
    case 'cctv_eye':
      return `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="3" fill="currentColor"/>`;
    case 'signals':
      return `<line x1="12" y1="20" x2="12" y2="10" stroke="currentColor" stroke-width="2"/><path d="M18 6a9 9 0 0 0-12 0M21 3a13 13 0 0 0-18 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="10" r="2" fill="currentColor"/>`;
    case 'cyber_ops':
      return `<rect x="16" y="16" width="6" height="6" rx="1" fill="none" stroke="currentColor" stroke-width="2"/><rect x="2" y="16" width="6" height="6" rx="1" fill="none" stroke="currentColor" stroke-width="2"/><rect x="9" y="2" width="6" height="6" rx="1" fill="none" stroke="currentColor" stroke-width="2"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3M12 12V8" fill="none" stroke="currentColor" stroke-width="2"/>`;
    case 'clandestine':
      return `<path d="M2 11a10 10 0 0 1 20 0c0 4-4 7-10 7s-10-3-10-7z" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="8" cy="11" r="2" fill="currentColor"/><circle cx="16" cy="11" r="2" fill="currentColor"/>`;
    case 'digital_forensics':
      return `<path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 4M5 19.5C5.5 18 6 15 6 12c0-3.3 2.7-6 6-6 2.5 0 4.5 1.5 5.5 3.5M12 10a2 2 0 0 0-2 2c0 2.5 1 5 2 8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`;
    case 'crypto_key':
      return `<path d="M21 2l-2 2m-1.5 1.5L13 10m-2 2a4 4 0 1 0-5.66-5.66 4 4 0 0 0 5.66 5.66zM15 6l2 2m-3 1l2 2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`;
    case 'counter_spy':
      return `<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7c1.78 0 3.32-.4 4.67-1.12M1 1l22 22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`;
    case 'security_audit':
      return `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M9 12h6M9 16h4M9 8h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`;
    case 'signal_jamming':
      return `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="none" stroke="currentColor" stroke-width="2"/><line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="16" r="1" fill="currentColor"/>`;
    case 'sdm_training':
      return `<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="9" cy="7" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="19" cy="11" r="2" fill="none" stroke="currentColor" stroke-width="2"/>`;
    case 'intelligence_academy':
      return `<circle cx="12" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="2"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" fill="none" stroke="currentColor" stroke-width="2"/>`;
    case 'tech_gears':
      return `<path d="M12 3l1.91 5.89h6.19l-5.01 3.64 1.91 5.89-5-3.64-5.01 3.64 1.92-5.89-5.01-3.64h6.19L12 3z" fill="currentColor"/>`;
    case 'app_system':
      return `<rect x="5" y="2" width="14" height="20" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><line x1="12" y1="18" x2="12.01" y2="18" stroke="currentColor" stroke-width="2"/>`;

    default:
      return `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="none" stroke="currentColor" stroke-width="2"/>`;
  }
}

/**
 * Creates an authentic Leaflet divIcon representing one of the 74 Official Subsector Symbols
 */
export function createOfficialSymbolIcon(
  symbolQuery: string,
  options: {
    classification?: 'RAHASIA' | 'TERBATAS' | 'BIASA';
    isStrategicLandmark?: boolean;
    customLabel?: string;
    isSelected?: boolean;
  } = {}
): L.DivIcon {
  const symbol = findSubsectorSymbol(symbolQuery);
  const themeColor = symbol?.themeColor || '#F59E0B';
  const iconType = symbol?.iconType || 'adhyaksa_shield';
  const subsectorNo = symbol?.no ?? (symbolQuery.includes('D.IN.') ? symbolQuery.replace('D.IN.', '') : '1');
  const sectionCode = symbol?.sectionCode || 'D.IN.2';
  const shortSection = sectionCode.replace('D.IN.', '');
  const isRahasia = options.classification === 'RAHASIA';
  const isTerbatas = options.classification === 'TERBATAS';
  const isLandmark = options.isStrategicLandmark;
  const isSelected = options.isSelected;

  const svgInner = getSymbolSvgPath(iconType);

  const markerHtml = `
    <div class="group relative" style="width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
      ${
        isSelected
          ? `<div style="position: absolute; inset: -4px; border-radius: 14px; background: ${themeColor}40; border: 2px dashed ${themeColor}; animation: spin 8s linear infinite;"></div>`
          : ''
      }
      
      <!-- Hexagon / Rounded Outer Frame -->
      <div style="
        position: relative;
        width: 38px;
        height: 38px;
        background: ${isLandmark ? '#02131F' : '#0B1526'};
        border: 2px solid ${themeColor};
        border-radius: ${isLandmark ? '12px' : '10px'};
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.7), 0 0 10px ${themeColor}30;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      ">
        <!-- Inner glow aura -->
        <div style="position: absolute; inset: 0; background: ${themeColor}; opacity: 0.12; border-radius: 8px;"></div>
        
        <!-- Symbol SVG Icon -->
        <svg viewBox="0 0 24 24" width="18" height="18" style="color: ${themeColor}; fill: none; z-index: 2;">
          ${svgInner}
        </svg>

        <!-- Subsector Number Badge (e.g. 5.17 or 2.05) -->
        <div style="
          position: absolute;
          bottom: -4px;
          right: -4px;
          background: #020617;
          border: 1px solid ${themeColor};
          color: #F8FAFC;
          font-family: monospace;
          font-size: 8px;
          font-weight: 900;
          padding: 0px 3px;
          border-radius: 4px;
          line-height: 1.1;
          box-shadow: 0 2px 4px rgba(0,0,0,0.6);
          z-index: 3;
        ">
          ${shortSection}.${subsectorNo}
        </div>

        <!-- Landmark Star / Classification Indicator -->
        ${
          isLandmark
            ? `<div style="position: absolute; top: -3px; left: -3px; background: #0284C7; border: 1px solid #38BDF8; width: 9px; height: 9px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 6px #38BDF8;"></div>`
            : isRahasia
            ? `<div style="position: absolute; top: -3px; right: -3px; background: #EF4444; border: 1.5px solid #0F172A; width: 10px; height: 10px; border-radius: 50%; box-shadow: 0 0 8px #EF4444;"></div>`
            : isTerbatas
            ? `<div style="position: absolute; top: -3px; right: -3px; background: #F59E0B; border: 1.5px solid #0F172A; width: 9px; height: 9px; border-radius: 50%;"></div>`
            : ''
        }
      </div>
    </div>
  `;

  return L.divIcon({
    className: 'official-74-symbol-marker',
    html: markerHtml,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -22],
  });
}

/**
 * 74 Strategic Vital Objects & Key Landmarks across all 10 Tabanan Subdistricts
 * Mapped to the 74 Official Intelligence Symbols
 */
export const TABANAN_STRATEGIC_74_LANDMARKS: StrategicLandmarkPoint[] = [
  // ==================== KECAMATAN TABANAN ====================
  {
    id: 'OBV-TAB-01',
    name: 'Kejaksaan Negeri Tabanan',
    kecamatan: 'Tabanan',
    lat: -8.5398,
    lng: 115.1265,
    symbolBadgeCode: 'PAM_SDO',
    category: 'Pengamanan Internal',
    keterangan: 'Kantor Kejaksaan Negeri Tabanan (Pusat Komando Intelijen)',
    description: 'Instalasi komando, personil Adhyaksa, dan pengamanan dokumen yustisial D.IN.',
    importance: 'SANGAT_STRATEGIS'
  },
  {
    id: 'OBV-TAB-02',
    name: 'Kantor Bupati & DPRD Kabupaten Tabanan',
    kecamatan: 'Tabanan',
    lat: -8.5372,
    lng: 115.1235,
    symbolBadgeCode: 'PEMERINTAHAN',
    category: 'Politik',
    keterangan: 'Pusat Pemerintahan Kabupaten Tabanan',
    description: 'Stabilitas birokrasi pemerintahan daerah dan pengawasan netralitas aparatur sipil negara.',
    importance: 'SANGAT_STRATEGIS'
  },
  {
    id: 'OBV-TAB-03',
    name: 'Kantor KPUD & Bawaslu Tabanan',
    kecamatan: 'Tabanan',
    lat: -8.5415,
    lng: 115.1292,
    symbolBadgeCode: 'PEMILU',
    category: 'Politik',
    keterangan: 'Komisi Pemilihan Umum Daerah Kabupaten Tabanan',
    description: 'Pusat logistik pemilu, verifikasi partai politik, dan pengawasan tahapan pilkada serentak.',
    importance: 'SANGAT_STRATEGIS'
  },
  {
    id: 'OBV-TAB-04',
    name: 'Lapas Kelas IIB Tabanan',
    kecamatan: 'Tabanan',
    lat: -8.5388,
    lng: 115.1215,
    symbolBadgeCode: 'PAM_PERKARA',
    category: 'Pengamanan Yustisial',
    keterangan: 'Lembaga Pemasyarakatan Kelas IIB Tabanan',
    description: 'Pengamanan tahanan yustisial, titipan terdakwa perkara korupsi/pidum, dan eksekusi putusan.',
    importance: 'STRATEGIS'
  },
  {
    id: 'OBV-TAB-05',
    name: 'Bank BPD Bali Cabang Tabanan & Sentra LPD',
    kecamatan: 'Tabanan',
    lat: -8.5401,
    lng: 115.1245,
    symbolBadgeCode: 'LEMBAGA_KEU',
    category: 'Perbankan',
    keterangan: 'Pusat Transaksi Perbankan & Lembaga Keuangan Daerah',
    description: 'Pengawasan sirkulasi likuiditas keuangan daerah, APBD, dan pencegahan kredit macet.',
    importance: 'STRATEGIS'
  },
  {
    id: 'OBV-TAB-06',
    name: 'Sentra Cyber Command & Server Diskominfo',
    kecamatan: 'Tabanan',
    lat: -8.5365,
    lng: 115.1255,
    symbolBadgeCode: 'CYBINT',
    category: 'Siber',
    keterangan: 'Infrastruktur Server & Cyber Patrol Tabanan',
    description: 'Pengawasan lalu lintas siber daerah, pencegahan kebocoran data, dan monitoring ujaran kebencian.',
    importance: 'STRATEGIS'
  },

  // ==================== KECAMATAN KEDIRI ====================
  {
    id: 'OBV-KED-01',
    name: 'DTW Pantai Tanah Lot (Pura Luhur Tanah Lot)',
    kecamatan: 'Kediri',
    lat: -8.6212,
    lng: 115.0868,
    symbolBadgeCode: 'PPS_PARIWISATA',
    category: 'Pariwisata',
    keterangan: 'Destinasi Pariwisata Super Prioritas Nasional Tanah Lot',
    description: 'Pengamanan obvitnas pariwisata internasional, pendapatan PAD retribusi tiket, dan pencegahan pungli.',
    importance: 'SANGAT_STRATEGIS'
  },
  {
    id: 'OBV-KED-02',
    name: 'Kawasan Pesisir Pantai Nyitdah & Pantai Nyanyi',
    kecamatan: 'Kediri',
    lat: -8.6155,
    lng: 115.1120,
    symbolBadgeCode: 'AGRARIA_MAFIA',
    category: 'Agraria',
    keterangan: 'Zona Tata Ruang Sempadan Pantai & Kawasan Investasi',
    description: 'Pengawasan pemanfaatan sempadan pantai, perizinan resort/akomodasi, dan pencegahan mafia tanah.',
    importance: 'SANGAT_STRATEGIS'
  },
  {
    id: 'OBV-KED-03',
    name: 'RS PTN Universitas Udayana Nyitdah',
    kecamatan: 'Kediri',
    lat: -8.5725,
    lng: 115.1432,
    symbolBadgeCode: 'PPS_LAINNYA',
    category: 'Lainnya',
    keterangan: 'Fasilitas Layanan Kesehatan Strategis Nyitdah',
    description: 'Pengamanan proyek perluasan gedung rumah sakit dan pengadaan alat kesehatan strategis.',
    importance: 'STRATEGIS'
  },
  {
    id: 'OBV-KED-04',
    name: 'Jalur Arteri Logistik Nasional Denpasar-Gilimanuk (Kediri)',
    kecamatan: 'Kediri',
    lat: -8.5520,
    lng: 115.1585,
    symbolBadgeCode: 'PPS_JALAN',
    category: 'Transportasi',
    keterangan: 'Simpul Arteri Logistik Lintas Pulau Jawa-Bali',
    description: 'Pengawasan kelancaran arus logistik pasokan bahan pokok dan ketertiban jalur nasional.',
    importance: 'STRATEGIS'
  },

  // ==================== KECAMATAN BATURITI ====================
  {
    id: 'OBV-BAT-01',
    name: 'DTW Danau Beratan & Pura Ulun Danu Bedugul',
    kecamatan: 'Baturiti',
    lat: -8.2755,
    lng: 115.1652,
    symbolBadgeCode: 'PPS_PARIWISATA',
    category: 'Pariwisata',
    keterangan: 'Kawasan Wisata Ikonik Danau Beratan Bedugul',
    description: 'Pengamanan kawasan perairan danau, kelestarian ekosistem air baku, dan kunjungan wisatawan.',
    importance: 'SANGAT_STRATEGIS'
  },
  {
    id: 'OBV-BAT-02',
    name: 'Balai Konservasi Kebun Raya Eka Karya Bali',
    kecamatan: 'Baturiti',
    lat: -8.2815,
    lng: 115.1542,
    symbolBadgeCode: 'PPS_IPTEK',
    category: 'IPTEK',
    keterangan: 'Pusat Riset Botani & Konservasi Tumbuhan Nasional (BRIN)',
    description: 'Pengamanan laboratorium riset botani, plasma nutfah flora tropis pegunungan, dan aset negara.',
    importance: 'SANGAT_STRATEGIS'
  },
  {
    id: 'OBV-BAT-03',
    name: 'Intake SPAM Regional Danau Beratan (PDAM)',
    kecamatan: 'Baturiti',
    lat: -8.2685,
    lng: 115.1720,
    symbolBadgeCode: 'PPS_SPAM',
    category: 'Utilitas',
    keterangan: 'Instalasi Pengolahan Air Bersih Lintas Kabupaten',
    description: 'Pengamanan sumber daya air baku Danau Beratan untuk pasokan air minum Tabanan, Badung, dan Denpasar.',
    importance: 'SANGAT_STRATEGIS'
  },
  {
    id: 'OBV-BAT-04',
    name: 'Sentra Agrobisnis Sayur & Buah Candikuning',
    kecamatan: 'Baturiti',
    lat: -8.2865,
    lng: 115.1685,
    symbolBadgeCode: 'PERKEBUNAN',
    category: 'Agraris',
    keterangan: 'Sentra Distribusi Hortikultura Pegunungan',
    description: 'Stabilitas pasokan rantai pasok sayur-mayur dan stroberi penyangga ketahanan pangan Bali.',
    importance: 'STRATEGIS'
  },

  // ==================== KECAMATAN PENEBEL ====================
  {
    id: 'OBV-PEN-01',
    name: 'Kawasan Warisan Budaya Dunia Subak Jatiluwih (UNESCO)',
    kecamatan: 'Penebel',
    lat: -8.3688,
    lng: 115.1315,
    symbolBadgeCode: 'PPS_PERTANIAN',
    category: 'Pangan',
    keterangan: 'Lansekap Kultur Subak Jatiluwih Beras Merah',
    description: 'Pengamanan lumbung padi merah organik, pencegahan alih fungsi lahan sawah lestari (LP2B).',
    importance: 'SANGAT_STRATEGIS'
  },
  {
    id: 'OBV-PEN-02',
    name: 'Pembangkit Listrik Tenaga Mikrohidro (PLTMH) Jatiluwih',
    kecamatan: 'Penebel',
    lat: -8.3750,
    lng: 115.1245,
    symbolBadgeCode: 'PPS_EBT',
    category: 'Energi',
    keterangan: 'Pembangkit Listrik Energi Baru Terbarukan (EBT)',
    description: 'Pengamanan turbin pembangkit mikrohidro yang memanfaatkan aliran sungai irigasi subak.',
    importance: 'STRATEGIS'
  },
  {
    id: 'OBV-PEN-03',
    name: 'Pura Luhur Batukaru (Cagar Spiritual & Budaya)',
    kecamatan: 'Penebel',
    lat: -8.3412,
    lng: 115.0995,
    symbolBadgeCode: 'BUDAYA',
    category: 'Kebudayaan',
    keterangan: 'Kawasan Suci Pura Sad Kahyangan Batukaru',
    description: 'Pelestarian adat istiadat kearifan lokal, ketentraman ritual keagamaan, dan pembinaan PAKEM.',
    importance: 'STRATEGIS'
  },
  {
    id: 'OBV-PEN-04',
    name: 'Kawasan Hutan Lindung Lereng Gunung Batukaru',
    kecamatan: 'Penebel',
    lat: -8.3285,
    lng: 115.0880,
    symbolBadgeCode: 'KEHUTANAN',
    category: 'Sumber Daya Alam',
    keterangan: 'Zona Hutan Lindung & Resapan Air Tabanan',
    description: 'Pencegahan perambahan hutan lindung, pembalakan liar, dan perburuan satwa dilindungi.',
    importance: 'SANGAT_STRATEGIS'
  },

  // ==================== KECAMATAN MARGA ====================
  {
    id: 'OBV-MAR-01',
    name: 'Taman Pujaan Bangsa (TPB) Margarana',
    kecamatan: 'Marga',
    lat: -8.4552,
    lng: 115.1865,
    symbolBadgeCode: 'PERSATUAN',
    category: 'Ideologi',
    keterangan: 'Monumen Nasional Perjuangan Puputan Margarana',
    description: 'Pemeliharaan wawasan kebangsaan, nilai patriotisme pahlawan I Gusti Ngurah Rai, dan persatuan bangsa.',
    importance: 'SANGAT_STRATEGIS'
  },
  {
    id: 'OBV-MAR-02',
    name: 'Desa Adat Marga & Forum Kerukunan Umat (FKUB)',
    kecamatan: 'Marga',
    lat: -8.4615,
    lng: 115.1782,
    symbolBadgeCode: 'PAKEM',
    category: 'PAKEM',
    keterangan: 'Pusat Koordinasi Kerukunan Umat Beragama & Desa Adat',
    description: 'Pengawasan aliran kepercayaan menyimpang, harmonisasi antar umat, dan mitigasi gesekan sosial.',
    importance: 'STRATEGIS'
  },
  {
    id: 'OBV-MAR-03',
    name: 'Kawasan Pertanian Beras Organik & Subak Marga',
    kecamatan: 'Marga',
    lat: -8.4485,
    lng: 115.1695,
    symbolBadgeCode: 'DESA',
    category: 'Sosial',
    keterangan: 'Pemberdayaan Masyarakat Tani & Tata Kelola Dana Desa',
    description: 'Pendampingan hukum penyaluran dana desa dan program ketahanan pangan nabati desa.',
    importance: 'STRATEGIS'
  },

  // ==================== KECAMATAN PUPUAN ====================
  {
    id: 'OBV-PUP-01',
    name: 'Sentra Perkebunan Kopi Robusta Pupuan (Indikasi Geografis)',
    kecamatan: 'Pupuan',
    lat: -8.3540,
    lng: 115.0085,
    symbolBadgeCode: 'PERKEBUNAN',
    category: 'Agraris',
    keterangan: 'Kawasan Perkebunan Kopi Robusta Unggulan Nasional',
    description: 'Pengamanan komoditas ekspor kopi Robusta Pupuan bersertifikat Indikasi Geografis dan peremajaan tanaman.',
    importance: 'SANGAT_STRATEGIS'
  },
  {
    id: 'OBV-PUP-02',
    name: 'Kawasan Hutan Lindung & Hulu DAS Pupuan',
    kecamatan: 'Pupuan',
    lat: -8.3320,
    lng: 115.0210,
    symbolBadgeCode: 'KEHUTANAN',
    category: 'Sumber Daya Alam',
    keterangan: 'Kawasan Hutan Lindung Perbatasan Buleleng-Tabanan',
    description: 'Patroli deteksi dini illegal logging dan perambahan lahan perkebunan ke dalam hutan tutupan.',
    importance: 'STRATEGIS'
  },
  {
    id: 'OBV-PUP-03',
    name: 'Koperasi Tani & Bank BPD Unit Pupuan',
    kecamatan: 'Pupuan',
    lat: -8.3565,
    lng: 115.0062,
    symbolBadgeCode: 'LEMBAGA_KEU',
    category: 'Perbankan',
    keterangan: 'Lembaga Pembiayaan Kredit Usaha Rakyat (KUR) Tani',
    description: 'Pengawasan penyaluran subsidi pupuk dan pembiayaan permodalan petani perkebunan.',
    importance: 'STRATEGIS'
  },

  // ==================== KECAMATAN KERAMBITAN ====================
  {
    id: 'OBV-KER-01',
    name: 'Puri Agung Kerambitan (Cagar Budaya & Adat)',
    kecamatan: 'Kerambitan',
    lat: -8.5488,
    lng: 115.0865,
    symbolBadgeCode: 'BUDAYA',
    category: 'Kebudayaan',
    keterangan: 'Pusat Pelestarian Seni Tari & Tradisi Tektekan Kerambitan',
    description: 'Pengamanan warisan cagar budaya, tradisi tolak bala tektekan, dan keharmonisan sosial kemasyarakatan.',
    importance: 'STRATEGIS'
  },
  {
    id: 'OBV-KER-02',
    name: 'Pesisir Pantai Kelating & Muara Sungai Yeh Ho',
    kecamatan: 'Kerambitan',
    lat: -8.5910,
    lng: 115.0682,
    symbolBadgeCode: 'PERIKANAN',
    category: 'Maritim',
    keterangan: 'Pangkalan Nelayan Pesisir & Budidaya Perikanan Laut',
    description: 'Pengawasan bantuan kapal tangkap nelayan, perizinan tambak udang, dan zona sempadan pantai.',
    importance: 'STRATEGIS'
  },
  {
    id: 'OBV-KER-03',
    name: 'Instalasi Jaringan Irigasi Subak Kerambitan',
    kecamatan: 'Kerambitan',
    lat: -8.5620,
    lng: 115.0740,
    symbolBadgeCode: 'PPS_SPAM',
    category: 'Utilitas',
    keterangan: 'Revitalisasi Saluran Pembagi Air Irigasi Sawah',
    description: 'Pengamanan proyek pembangunan saluran irigasi tersier penunjang surplus panen padi.',
    importance: 'STRATEGIS'
  },

  // ==================== KECAMATAN SELEMADEG ====================
  {
    id: 'OBV-SLM-01',
    name: 'Pasar Bajera & Terminal Transit Selemadeg',
    kecamatan: 'Selemadeg',
    lat: -8.4985,
    lng: 115.0315,
    symbolBadgeCode: 'PERDAGANGAN',
    category: 'Perekonomian',
    keterangan: 'Pusat Perdagangan & Distribusi Logistik Jalur Utama',
    description: 'Pemantauan stabilitas harga kebutuhan pokok sembako dan kelancaran sirkulasi perdagangan pasar.',
    importance: 'STRATEGIS'
  },
  {
    id: 'OBV-SLM-02',
    name: 'Jembatan Strategis Tukad Balian (Jalur Nasional)',
    kecamatan: 'Selemadeg',
    lat: -8.5025,
    lng: 115.0245,
    symbolBadgeCode: 'PPS_JALAN',
    category: 'Transportasi',
    keterangan: 'Infrastruktur Jembatan Penghubung Antar Kota/Provinsi',
    description: 'Pengamanan struktur fisik jembatan vital pengangkut logistik berat nasional Jawa-Bali.',
    importance: 'SANGAT_STRATEGIS'
  },
  {
    id: 'OBV-SLM-03',
    name: 'Kawasan Wisata Pesisir Pantai Soka',
    kecamatan: 'Selemadeg',
    lat: -8.5140,
    lng: 115.0165,
    symbolBadgeCode: 'PPS_PARIWISATA',
    category: 'Pariwisata',
    keterangan: 'Rest Area Strategis & Destinasi Pantai Soka',
    description: 'Pengamanan persinggahan bus antarkota, ketertiban umum ruang publik, dan keamanan pesisir.',
    importance: 'STRATEGIS'
  },

  // ==================== KECAMATAN SELEMADEG BARAT ====================
  {
    id: 'OBV-SLB-01',
    name: 'Pos Pantau Perbatasan Selabih (Gerbang Barat Tabanan)',
    kecamatan: 'Selemadeg Barat',
    lat: -8.4680,
    lng: 114.9450,
    symbolBadgeCode: 'PPS_PLBN',
    category: 'Perbatasan',
    keterangan: 'Pos Penyekatan & Pemantauan Perbatasan Jembrana-Tabanan',
    description: 'Pemeriksaan arus mobilitas orang asing, pencegahan penyelundupan barang terlarang/rokok ilegal.',
    importance: 'SANGAT_STRATEGIS'
  },
  {
    id: 'OBV-SLB-02',
    name: 'Gardu Induk PLN & Transmisi Listrik Surabrata',
    kecamatan: 'Selemadeg Barat',
    lat: -8.4820,
    lng: 114.9810,
    symbolBadgeCode: 'PPS_LISTRIK',
    category: 'Energi',
    keterangan: 'Infrastruktur Transmisi Ketenagalistrikan Jawa-Bali',
    description: 'Pengamanan gardu transmisi SUTT/SUTET pemasok utama pasokan daya listrik ke Pulau Bali.',
    importance: 'SANGAT_STRATEGIS'
  },
  {
    id: 'OBV-SLB-03',
    name: 'Pelabuhan Pendaratan Ikan (PPI) Selabih/Surabrata',
    kecamatan: 'Selemadeg Barat',
    lat: -8.4915,
    lng: 114.9620,
    symbolBadgeCode: 'PPS_PELABUHAN',
    category: 'Maritim',
    keterangan: 'Fasilitas Pendaratan & Tambat Kapal Nelayan Barat',
    description: 'Pengamanan dermaga pendaratan ikan, solar bersubsidi nelayan, dan pengawasan kapal asing tak berizin.',
    importance: 'STRATEGIS'
  },

  // ==================== KECAMATAN SELEMADEG TIMUR ====================
  {
    id: 'OBV-SLT-01',
    name: 'Sentra Pengolahan Kakao & Agroindustri Megati',
    kecamatan: 'Selemadeg Timur',
    lat: -8.5285,
    lng: 115.0620,
    symbolBadgeCode: 'INDUSTRI',
    category: 'Perekonomian',
    keterangan: 'Kawasan Industri Pengolahan Hasil Bumi Kakao & Beras',
    description: 'Pengawasan standarisasi mutu industri hasil perkebunan dan kepatuhan perizinan amdal pabrik.',
    importance: 'STRATEGIS'
  },
  {
    id: 'OBV-SLT-02',
    name: 'Tanggul Penahan Ombak & Abrasi Pantai Yeh Gangga',
    kecamatan: 'Selemadeg Timur',
    lat: -8.5795,
    lng: 115.0820,
    symbolBadgeCode: 'PPS_TANGGUL',
    category: 'Sumber Daya Air',
    keterangan: 'Proyek Pengamanan Pantai & Penanggulangan Abrasi',
    description: 'Pengamanan proyek retaining wall seawall penahan gelombang pasang Samudra Hindia.',
    importance: 'SANGAT_STRATEGIS'
  },
  {
    id: 'OBV-SLT-03',
    name: 'Jembatan Penghubung Tukad Yeh Ho (Selemadeg Timur)',
    kecamatan: 'Selemadeg Timur',
    lat: -8.5350,
    lng: 115.0545,
    symbolBadgeCode: 'PPS_JALAN',
    category: 'Transportasi',
    keterangan: 'Infrastruktur Jembatan Beton Penghubung Kecamatan',
    description: 'Pengamanan konektivitas antar kecamatan sentra pangan dan jalur transportasi masyarakat.',
    importance: 'STRATEGIS'
  }
];

/**
 * Returns all active 74 symbols mapped in a specific subdistrict or entire Tabanan
 */
export function getSubsectorSymbolsInKecamatan(
  kecamatanName: string,
  entries: { kecamatan: string; sektor_symbol?: string; section?: string; keterangan?: string }[]
): { symbol: OfficialSubsectorSymbol; count: number }[] {
  const isAll = kecamatanName === 'Semua' || kecamatanName === 'ALL';
  const matchingLandmarks = isAll
    ? TABANAN_STRATEGIC_74_LANDMARKS
    : TABANAN_STRATEGIC_74_LANDMARKS.filter(
        (l) => l.kecamatan.toLowerCase() === kecamatanName.toLowerCase()
      );

  const matchingEntries = isAll
    ? entries
    : entries.filter((e) => e.kecamatan.toLowerCase().includes(kecamatanName.toLowerCase()));

  const symbolMap = new Map<string, { symbol: OfficialSubsectorSymbol; count: number }>();

  // Aggregate from entries
  matchingEntries.forEach((entry) => {
    const sym = findSubsectorSymbol(entry.sektor_symbol || entry.keterangan || entry.section || '');
    if (sym) {
      const existing = symbolMap.get(sym.badgeCode);
      if (existing) {
        existing.count += 1;
      } else {
        symbolMap.set(sym.badgeCode, { symbol: sym, count: 1 });
      }
    }
  });

  // Aggregate from strategic landmarks
  matchingLandmarks.forEach((lm) => {
    const sym = findSubsectorSymbol(lm.symbolBadgeCode);
    if (sym) {
      const existing = symbolMap.get(sym.badgeCode);
      if (existing) {
        existing.count += 1;
      } else {
        symbolMap.set(sym.badgeCode, { symbol: sym, count: 1 });
      }
    }
  });

  return Array.from(symbolMap.values()).sort((a, b) => b.count - a.count);
}
