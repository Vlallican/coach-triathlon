import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Card } from '../components/Card';
import { StatTile } from '../components/StatTile';
import { PulsingDot } from '../components/PulsingDot';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { useRootNavigation } from '../navigation/hooks';
import type { TabParamList } from '../navigation/types';
import {
  TODAY_SESSION_ID,
  daysToNextRace,
  load7DaysTSS,
  sessions,
  todayLabel,
  userFirstName,
  userInitials,
  weekVolumeData,
} from '../data/mockData';

function formatHours(hours: number) {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}h${m ? String(m).padStart(2, '0') : ''}`;
}

export function HomeScreen() {
  const insets = useSafeAreaInsets();
  const rootNav = useRootNavigation();
  const tabNav = useNavigation<BottomTabNavigationProp<TabParamList>>();

  const todaySession = sessions.find((s) => s.id === TODAY_SESSION_ID)!;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 100 }]}
    >
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.greeting}>Bonjour, {userFirstName}</Text>
          <Text style={styles.date}>{todayLabel}</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{userInitials}</Text>
        </View>
      </View>

      <Card style={styles.featuredCard} radius={20} padding={20}>
        <View style={styles.featuredHeader}>
          <View style={styles.sportBadge}>
            <Text style={styles.sportBadgeText}>{todaySession.sportInitial}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.featuredEyebrow}>
              Séance du jour · {todaySession.sportLabel}
            </Text>
            <Text style={styles.featuredTitle}>{todaySession.title}</Text>
          </View>
        </View>
        <View style={styles.metricsRow}>
          <MetricChip label="Durée" value={todaySession.durationLabel!} />
          <MetricChip label="Distance" value={todaySession.distanceLabel!} />
          <MetricChip label="Intensité" value={todaySession.intensityLabel!} />
        </View>
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.cta}
          onPress={() => rootNav.navigate('SessionDetail', { sessionId: todaySession.id })}
        >
          <Text style={styles.ctaText}>Démarrer la séance</Text>
        </TouchableOpacity>
      </Card>

      <Card style={styles.insightCard} radius={18} padding={16}>
        <View style={styles.insightDotWrap}>
          <PulsingDot color={colors.accent} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.insightEyebrow}>Coach IA</Text>
          <Text style={styles.insightText}>
            J&apos;ai réduit ton fractionné de vendredi : ton TSS a été plus élevé que prévu après la sortie
            longue. Ta charge reste dans la zone optimale pour l&apos;Ironman 70.3.
          </Text>
          <TouchableOpacity onPress={() => tabNav.navigate('Chat')}>
            <Text style={styles.insightLink}>Voir la conversation →</Text>
          </TouchableOpacity>
        </View>
      </Card>

      <View>
        <Text style={styles.sectionTitle}>Cette semaine</Text>
        <Card radius={18} padding={16} style={{ gap: 12 }}>
          {weekVolumeData.map((v) => {
            const pct = Math.min(100, Math.round((v.hours / v.target) * 100));
            return (
              <View key={v.sport} style={styles.volumeRow}>
                <Text style={styles.volumeLabel}>{v.label}</Text>
                <View style={styles.volumeTrack}>
                  <View style={[styles.volumeFill, { width: `${pct}%`, backgroundColor: v.color }]} />
                </View>
                <Text style={styles.volumeHours}>{formatHours(v.hours)}</Text>
              </View>
            );
          })}
        </Card>
      </View>

      <View style={styles.statsRow}>
        <StatTile label="Charge 7 jours" value={String(load7DaysTSS)} suffix="TSS" />
        <StatTile label="Prochaine course" value={`J-${daysToNextRace}`} />
      </View>
    </ScrollView>
  );
}

function MetricChip({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metricChip}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    paddingHorizontal: 20,
    gap: 18,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  greeting: {
    fontFamily: fonts.headingBold,
    fontSize: 26,
    color: colors.text,
  },
  date: {
    fontFamily: fonts.body,
    fontSize: 13.5,
    color: colors.textMuted45,
    marginTop: 4,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: fonts.headingBold,
    fontSize: 14,
    color: colors.onAccent,
  },
  featuredCard: {
    gap: 16,
  },
  featuredHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sportBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.swim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sportBadgeText: {
    fontFamily: fonts.headingBold,
    fontSize: 13,
    color: colors.onAccent,
  },
  featuredEyebrow: {
    fontFamily: fonts.body,
    fontSize: 11.5,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: colors.textMuted40,
  },
  featuredTitle: {
    fontFamily: fonts.headingMedium,
    fontWeight: '600',
    fontSize: 17,
    color: colors.text,
    marginTop: 2,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  metricChip: {
    flex: 1,
    backgroundColor: colors.chip,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  metricLabel: {
    fontFamily: fonts.body,
    fontSize: 10.5,
    color: colors.textMuted40,
  },
  metricValue: {
    fontFamily: fonts.headingMedium,
    fontWeight: '600',
    fontSize: 15,
    color: colors.text,
    marginTop: 2,
  },
  cta: {
    backgroundColor: colors.accent,
    alignItems: 'center',
    paddingVertical: 13,
    borderRadius: 14,
  },
  ctaText: {
    fontFamily: fonts.headingBold,
    fontSize: 15,
    color: colors.onAccent,
  },
  insightCard: {
    flexDirection: 'row',
    gap: 12,
  },
  insightDotWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  insightEyebrow: {
    fontFamily: fonts.body,
    fontSize: 11,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: colors.textMuted40,
    marginBottom: 4,
  },
  insightText: {
    fontFamily: fonts.body,
    fontSize: 13.5,
    lineHeight: 19,
    color: colors.textMuted85,
  },
  insightLink: {
    fontFamily: fonts.bodySemiBold,
    fontWeight: '600',
    fontSize: 12.5,
    color: colors.accent,
    marginTop: 8,
  },
  sectionTitle: {
    fontFamily: fonts.bodySemiBold,
    fontWeight: '600',
    fontSize: 14,
    color: colors.textMuted60,
    marginBottom: 10,
  },
  volumeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  volumeLabel: {
    width: 54,
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textMuted55,
  },
  volumeTrack: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.track,
    overflow: 'hidden',
  },
  volumeFill: {
    height: '100%',
    borderRadius: 4,
  },
  volumeHours: {
    width: 46,
    textAlign: 'right',
    fontFamily: fonts.headingMedium,
    fontWeight: '600',
    fontSize: 12.5,
    color: colors.text,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
});
