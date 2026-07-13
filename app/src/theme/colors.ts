export const colors = {
  bg: '#0a0b0d',
  card: '#15171b',
  cardBorder: 'rgba(255,255,255,0.06)',
  chip: 'rgba(255,255,255,0.04)',
  chipBorder: 'rgba(255,255,255,0.08)',
  divider: 'rgba(255,255,255,0.06)',
  track: 'rgba(255,255,255,0.06)',

  text: '#f5f6f7',
  textMuted85: 'rgba(245,246,247,0.85)',
  textMuted75: 'rgba(245,246,247,0.75)',
  textMuted60: 'rgba(245,246,247,0.6)',
  textMuted55: 'rgba(245,246,247,0.55)',
  textMuted50: 'rgba(245,246,247,0.5)',
  textMuted45: 'rgba(245,246,247,0.45)',
  textMuted40: 'rgba(245,246,247,0.4)',
  textMuted35: 'rgba(245,246,247,0.35)',
  textMuted30: 'rgba(245,246,247,0.3)',

  onAccent: '#06110d',

  accent: '#00e6a8',
  accentSoft: 'rgba(0,230,168,0.12)',
  accentSoft08: 'rgba(0,230,168,0.08)',
  accentDashed: 'rgba(0,230,168,0.35)',

  danger: '#ff6b45',

  swim: '#3d8bff',
  swimSoft: '#4dd0e1',
  bike: '#ffb020',
  run: '#00e6a8',

  tabBarBg: 'rgba(20,21,25,0.92)',
} as const;

export const accentOptions = ['#00e6a8', '#ff6b45', '#3d8bff', '#e8c34a'] as const;

export type AccentColor = (typeof accentOptions)[number];
