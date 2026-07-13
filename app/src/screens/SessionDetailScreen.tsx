import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card } from '../components/Card';
import { CloseIcon } from '../components/TabIcons';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { sessions } from '../data/mockData';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'SessionDetail'>;

export function SessionDetailScreen({ route, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const session = sessions.find((s) => s.id === route.params.sessionId);

  if (!session) return null;

  const stats: { label: string; value: string }[] = [
    { label: 'Distance', value: session.distanceLabel! },
    { label: 'Durée', value: session.durationLabel! },
    { label: 'Allure', value: session.paceLabel! },
    { label: 'FC moy / max', value: session.hrLabel! },
    ...(session.hasPower ? [{ label: 'Puissance', value: session.powerLabel! }] : []),
    { label: 'TSS', value: String(session.tss) },
    { label: 'RPE ressenti', value: session.rpeLabel! },
  ];

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 32 }]}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={[styles.sportBadge, { backgroundColor: session.sportColor }]}>
              <Text style={styles.sportBadgeText}>{session.sportInitial}</Text>
            </View>
            <View>
              <Text style={styles.headerEyebrow}>
                {session.dayFull} · {session.sportLabel}
              </Text>
              <Text style={styles.headerTitle}>{session.title}</Text>
            </View>
          </View>
          <TouchableOpacity activeOpacity={0.8} style={styles.closeButton} onPress={() => navigation.goBack()}>
            <CloseIcon />
          </TouchableOpacity>
        </View>

        <View style={styles.statsGrid}>
          {stats.map((s) => (
            <Card key={s.label} radius={14} padding={12} style={styles.statCell}>
              <Text style={styles.statLabel}>{s.label}</Text>
              <Text style={styles.statValue}>{s.value}</Text>
            </Card>
          ))}
        </View>

        <View>
          <Text style={styles.sectionTitle}>Zones cardiaques</Text>
          <View style={styles.zonesBar}>
            {session.zones?.map((z, i) => (
              <View key={i} style={{ width: `${z.widthPct}%`, height: '100%', backgroundColor: z.color }} />
            ))}
          </View>
          <View style={styles.zonesLabels}>
            {['Z1', 'Z2', 'Z3', 'Z4', 'Z5'].map((z) => (
              <Text key={z} style={styles.zoneLabel}>
                {z}
              </Text>
            ))}
          </View>
        </View>

        <View>
          <Text style={styles.sectionTitle}>Structure de la séance</Text>
          <View style={styles.intervalsList}>
            {session.intervals?.map((itv, i) => (
              <View key={i} style={styles.intervalRow}>
                <Text style={styles.intervalLabel}>{itv.label}</Text>
                <Text style={styles.intervalDetail}>{itv.detail}</Text>
              </View>
            ))}
          </View>
        </View>

        <Card style={styles.feedbackCard} radius={16} padding={14}>
          <View style={styles.feedbackDotWrap}>
            <View style={styles.feedbackDot} />
          </View>
          <Text style={styles.feedbackText}>{session.feedback}</Text>
        </Card>
      </ScrollView>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sportBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sportBadgeText: {
    fontFamily: fonts.headingBold,
    fontSize: 13,
    color: colors.onAccent,
  },
  headerEyebrow: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.textMuted40,
  },
  headerTitle: {
    fontFamily: fonts.headingBold,
    fontSize: 17,
    color: colors.text,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statCell: {
    width: '31.5%',
  },
  statLabel: {
    fontFamily: fonts.body,
    fontSize: 10.5,
    color: colors.textMuted40,
  },
  statValue: {
    fontFamily: fonts.headingBold,
    fontSize: 16,
    color: colors.text,
    marginTop: 3,
  },
  sectionTitle: {
    fontFamily: fonts.bodySemiBold,
    fontWeight: '600',
    fontSize: 14,
    color: colors.textMuted60,
    marginBottom: 10,
  },
  zonesBar: {
    flexDirection: 'row',
    height: 14,
    borderRadius: 7,
    overflow: 'hidden',
  },
  zonesLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  zoneLabel: {
    fontFamily: fonts.body,
    fontSize: 9.5,
    color: colors.textMuted35,
  },
  intervalsList: {
    borderRadius: 14,
    overflow: 'hidden',
    gap: 1,
  },
  intervalRow: {
    backgroundColor: colors.card,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  intervalLabel: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textMuted85,
  },
  intervalDetail: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textMuted40,
  },
  feedbackCard: {
    flexDirection: 'row',
    gap: 10,
  },
  feedbackDotWrap: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  feedbackDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.accent,
  },
  feedbackText: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 19,
    color: colors.textMuted75,
  },
});
