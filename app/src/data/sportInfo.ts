import { colors } from '../theme/colors';
import type { Sport } from './types';

export interface SportInfo {
  label: string;
  initial: string;
  color: string;
}

/** Libellé/initiale/couleur par sport — non stockés en base, dérivés côté client. */
export const SPORT_INFO: Partial<Record<Sport, SportInfo>> = {
  swim: { label: 'Natation', initial: 'N', color: colors.swim },
  bike: { label: 'Vélo', initial: 'V', color: colors.bike },
  run: { label: 'Course', initial: 'C', color: colors.run },
};
