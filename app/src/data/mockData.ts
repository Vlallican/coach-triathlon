import { colors } from '../theme/colors';
import { buildCurrentWeekDays, daysBetween, formatFullDateLabel } from '../utils/date';
import type {
  ChargeWeekEntry,
  ChatMessage,
  HistoryWeekEntry,
  Session,
  WeekVolumeEntry,
} from './types';

type SessionTemplate = Omit<Session, 'dayLabel' | 'dayFull' | 'dayNum'>;

const weekDays = buildCurrentWeekDays();

const sessionTemplates: SessionTemplate[] = [
  { id: 's0', dayIndex: 0, sport: 'rest', isRest: true },
  {
    id: 's1',
    dayIndex: 1,
    sport: 'swim',
    isRest: false,
    sportLabel: 'Natation',
    sportInitial: 'N',
    sportColor: colors.swim,
    title: 'Technique & éducatifs',
    durationLabel: '50 min',
    distanceLabel: '2400 m',
    paceLabel: '2:05/100m',
    intensityLabel: 'Zone 1-2',
    hrLabel: '128 / 145 bpm',
    hasPower: false,
    tss: 48,
    rpeLabel: '4 / 10',
    zones: [
      { widthPct: 35, color: colors.swim },
      { widthPct: 40, color: colors.swimSoft },
      { widthPct: 15, color: colors.run },
      { widthPct: 7, color: colors.bike },
      { widthPct: 3, color: colors.danger },
    ],
    intervals: [
      { label: 'Échauffement', detail: '10 min · Z1' },
      { label: 'Éducatifs 8×50m', detail: '20 min · Z2' },
      { label: 'Retour au calme', detail: '10 min · Z1' },
    ],
    feedback: "Bonne séance technique. Ta fréquence de nage progresse — on garde ce volume la semaine prochaine.",
  },
  {
    id: 's2',
    dayIndex: 2,
    sport: 'swim',
    isRest: false,
    sportLabel: 'Natation',
    sportInitial: 'N',
    sportColor: colors.swim,
    title: 'Seuil 3000 m',
    durationLabel: '55 min',
    distanceLabel: '3000 m',
    paceLabel: '1:38/100m',
    intensityLabel: 'Zone 3-4',
    hrLabel: '152 / 168 bpm',
    hasPower: false,
    tss: 62,
    rpeLabel: '7 / 10',
    zones: [
      { widthPct: 10, color: colors.swim },
      { widthPct: 20, color: colors.swimSoft },
      { widthPct: 35, color: colors.run },
      { widthPct: 25, color: colors.bike },
      { widthPct: 10, color: colors.danger },
    ],
    intervals: [
      { label: 'Échauffement', detail: '600 m' },
      { label: '8×200m Seuil', detail: '1600 m · R30s' },
      { label: 'Retour au calme', detail: '400 m' },
    ],
    feedback: "Séance clé de la semaine. Ton allure au seuil s'améliore — on pourra viser 1:35/100m d'ici 3 semaines.",
  },
  {
    id: 's3',
    dayIndex: 3,
    sport: 'bike',
    isRest: false,
    sportLabel: 'Vélo',
    sportInitial: 'V',
    sportColor: colors.bike,
    title: 'Sweetspot 3×12min',
    durationLabel: '1h45',
    distanceLabel: '45 km',
    paceLabel: '26 km/h moy.',
    intensityLabel: 'Zone 3',
    hrLabel: '138 / 155 bpm',
    hasPower: true,
    powerLabel: '215 W moy.',
    tss: 78,
    rpeLabel: '6 / 10',
    zones: [
      { widthPct: 15, color: colors.swim },
      { widthPct: 25, color: colors.swimSoft },
      { widthPct: 40, color: colors.run },
      { widthPct: 15, color: colors.bike },
      { widthPct: 5, color: colors.danger },
    ],
    intervals: [
      { label: 'Échauffement', detail: '15 min' },
      { label: '3×12min Sweetspot', detail: '36 min · Z3' },
      { label: 'Récup. entre séries', detail: '3×5 min' },
      { label: 'Retour au calme', detail: '15 min' },
    ],
    feedback: 'Puissance stable sur les 3 blocs, bon signe de forme. RAS pour la suite du plan.',
  },
  {
    id: 's4',
    dayIndex: 4,
    sport: 'run',
    isRest: false,
    sportLabel: 'Course',
    sportInitial: 'C',
    sportColor: colors.run,
    title: 'Fractionné 10×400m',
    durationLabel: '45 min',
    distanceLabel: '8 km',
    paceLabel: '4:12/km moy.',
    intensityLabel: 'Zone 4',
    hrLabel: '158 / 178 bpm',
    hasPower: false,
    tss: 58,
    rpeLabel: '7 / 10',
    zones: [
      { widthPct: 10, color: colors.swim },
      { widthPct: 15, color: colors.swimSoft },
      { widthPct: 25, color: colors.run },
      { widthPct: 35, color: colors.bike },
      { widthPct: 15, color: colors.danger },
    ],
    intervals: [
      { label: 'Échauffement', detail: '15 min' },
      { label: '10×400m', detail: '24 min · R90s' },
      { label: 'Retour au calme', detail: '6 min' },
    ],
    feedback: 'Séance ajustée : volume réduit de 20% suite à ta charge élevée de la semaine. On priorise la récupération.',
  },
  {
    id: 's5',
    dayIndex: 5,
    sport: 'bike',
    isRest: false,
    sportLabel: 'Vélo',
    sportInitial: 'V',
    sportColor: colors.bike,
    title: 'Sortie longue endurance',
    durationLabel: '3h15',
    distanceLabel: '110 km',
    paceLabel: '33.8 km/h moy.',
    intensityLabel: 'Zone 2',
    hrLabel: '132 / 148 bpm',
    hasPower: true,
    powerLabel: '178 W moy.',
    tss: 145,
    rpeLabel: '6 / 10',
    zones: [
      { widthPct: 20, color: colors.swim },
      { widthPct: 45, color: colors.swimSoft },
      { widthPct: 25, color: colors.run },
      { widthPct: 8, color: colors.bike },
      { widthPct: 2, color: colors.danger },
    ],
    intervals: [
      { label: 'Partie 1', detail: '90 min · Z2' },
      { label: 'Partie 2', detail: '90 min · Z2-Z3' },
      { label: 'Fin', detail: '15 min · Z1' },
    ],
    feedback: 'Séance la plus longue du bloc. Bonne gestion de l’allure, pense à bien recharger en glucides ce soir.',
  },
  {
    id: 's6',
    dayIndex: 6,
    sport: 'run',
    isRest: false,
    sportLabel: 'Course',
    sportInitial: 'C',
    sportColor: colors.run,
    title: 'Endurance fondamentale',
    durationLabel: '1h10',
    distanceLabel: '12 km',
    paceLabel: '5:35/km moy.',
    intensityLabel: 'Zone 2',
    hrLabel: '138 / 150 bpm',
    hasPower: false,
    tss: 62,
    rpeLabel: '4 / 10',
    zones: [
      { widthPct: 20, color: colors.swim },
      { widthPct: 50, color: colors.swimSoft },
      { widthPct: 22, color: colors.run },
      { widthPct: 6, color: colors.bike },
      { widthPct: 2, color: colors.danger },
    ],
    intervals: [{ label: 'Footing continu', detail: '70 min · Z2' }],
    feedback: 'Clôture idéale de la semaine. On enchaîne sur une semaine allégée pour bien récupérer.',
  },
];

export const sessions: Session[] = sessionTemplates.map((t) => {
  const wd = weekDays[t.dayIndex];
  return { ...t, dayLabel: wd.dayLabel, dayFull: wd.dayFull, dayNum: wd.dayNum };
});

export const weekVolumeData: WeekVolumeEntry[] = [
  { sport: 'swim', label: 'Natation', color: colors.swim, hours: 1.75, target: 3 },
  { sport: 'bike', label: 'Vélo', color: colors.bike, hours: 5.0, target: 6 },
  { sport: 'run', label: 'Course', color: colors.run, hours: 1.92, target: 3 },
];

export const historyWeeksData: HistoryWeekEntry[] = [
  { label: 'S1', swimPx: 13, bikePx: 43, runPx: 16 },
  { label: 'S2', swimPx: 16, bikePx: 49, runPx: 19 },
  { label: 'S3', swimPx: 19, bikePx: 54, runPx: 22 },
  { label: 'S4', swimPx: 22, bikePx: 59, runPx: 24 },
  { label: 'S5', swimPx: 11, bikePx: 32, runPx: 13 },
  { label: 'S6', swimPx: 24, bikePx: 65, runPx: 27 },
  { label: 'S7', swimPx: 27, bikePx: 70, runPx: 30 },
  { label: 'S8', swimPx: 19, bikePx: 54, runPx: 21 },
];

export const chargeWeeksData: ChargeWeekEntry[] = [
  { label: 'S1', value: 45, px: 50, color: 'rgba(255,255,255,0.25)' },
  { label: 'S2', value: 52, px: 57, color: 'rgba(255,255,255,0.25)' },
  { label: 'S3', value: 60, px: 66, color: colors.accent },
  { label: 'S4', value: 68, px: 75, color: colors.accent },
  { label: 'S5', value: 50, px: 55, color: 'rgba(255,255,255,0.25)' },
  { label: 'S6', value: 72, px: 79, color: colors.accent },
  { label: 'S7', value: 80, px: 88, color: colors.danger },
  { label: 'S8', value: 74, px: 81, color: colors.accent },
];

export const initialChatMessages: ChatMessage[] = [
  { id: 'm1', from: 'ai', text: "Bonjour Léa. J'ai ajusté ta semaine après ta sortie vélo d'hier — ton TSS était plus élevé que prévu." },
  { id: 'm2', from: 'user', text: 'D’accord, qu’est-ce qui a changé ?' },
  { id: 'm3', from: 'ai', text: "J'ai réduit le fractionné de vendredi et ajouté 10 minutes d'endurance fondamentale à la place. Ta charge reste dans la zone optimale pour l'Ironman 70.3." },
  { id: 'm4', from: 'user', text: 'Parfait, merci !' },
];

export const quickReplies: string[] = ['Pourquoi ce changement ?', 'Adapte ma semaine', 'Comment récupérer ?'];

export const aiReplies: string[] = [
  "Bonne question. Je regarde tes dernières séances et j'ajuste si besoin.",
  'Ta charge est stable — on peut maintenir le plan actuel.',
  'Je te conseille 8h de sommeil et une bonne hydratation avant la prochaine séance clé.',
];

export const todayLabel = formatFullDateLabel();

// Date cible de la prochaine course (Ironman 70.3) — le compte à rebours se recalcule chaque jour.
const NEXT_RACE_DATE = new Date(2026, 7, 30);
export const daysToNextRace = daysBetween(new Date(), NEXT_RACE_DATE);

export const weekVolumeTotalLabel = '8h40';
export const weekSessionsCompletedLabel = '6 / 7';
export const weekVsLastLabel = '−26%';
