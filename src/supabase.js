import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://vzkvdmnruojjvbhiqrwg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6a3ZkbW5ydW9qanZiaGlxcndnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MjMwMDEsImV4cCI6MjA5MzQ5OTAwMX0.nUiDLJPYCFxWd4Op1AyhmcD_AGHN0ClLRdMBRlo0Ca4";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* ── Ward Assignment Map ── */
const WARD_MAP = {
  'golden nest': 'Ward 7',
  'bhayandar': 'Ward 3',
  'mira road': 'Ward 12',
  'navghar': 'Ward 8',
  'kashimira': 'Ward 15',
  'shanti nagar': 'Ward 9',
  'pleasant park': 'Ward 5',
  'maxus mall': 'Ward 6',
};

export function assignWard(location) {
  const loc = (location || '').toLowerCase();
  for (const [key, ward] of Object.entries(WARD_MAP)) {
    if (loc.includes(key)) return ward;
  }
  return 'Ward 1';
}

export function generateComplaintId() {
  return 'MB-' + Math.floor(1000 + Math.random() * 9000);
}

/* ── Map pin coordinates for real complaints ── */
const PIN_COORDS = {
  'golden nest': { x: 640, y: 210 },
  'bhayandar': { x: 710, y: 295 },
  'mira road': { x: 725, y: 635 },
  'navghar': { x: 690, y: 510 },
  'kashimira': { x: 800, y: 710 },
  'shanti nagar': { x: 745, y: 435 },
  'pleasant park': { x: 670, y: 385 },
  'maxus mall': { x: 790, y: 295 },
};

export function getPinCoords(location) {
  const loc = (location || '').toLowerCase();
  for (const [key, coords] of Object.entries(PIN_COORDS)) {
    if (loc.includes(key)) return coords;
  }
  return { x: 700, y: 400 };
}

/* ── Time-ago helper ── */
export function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDays = Math.floor(diffHr / 24);
  return `${diffDays}d ago`;
}

/* ── Format date for display ── */
export function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
    ', ' + date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}
