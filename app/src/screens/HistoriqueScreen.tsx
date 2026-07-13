import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card } from '../components/Card';
import { StatTile } from '../components/StatTile';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import {
  chargeWeeksData,
  historyWeeksData,
  weekSessionsCompletedLabel,
  weekVolumeTotalLabel,
  weekVsLastLabel,
} from '../data/mockData';

const RANGES = [
  { key: 'semaine', label: 'Semaine' },
  { key: 'mois', label: 'Mois' },
  { key: 'annee', label: 'Année' },
] as const;

const CHART_HEIGHT = 150;
const LOAD_CHART_HEIGHT = 130;
const BAND_BOTTOM = 49.5;
const BAND_HEIGHT = 22;

export function HistoriqueScreen() {
  const insets = useSafeAreaInsets();
  const [range, setRange] = useState<(typeof RANGES)[number]['key']>('semaine');

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 100 }]}
    >
      <Text style={styles.title}>Historique</Text>

      <View style={styles.rangeTabs}>
        {RANGES.map((r) => {
          const active = range === r.key;
          return (
            <TouchableOpacity
              key={r.key}
              activeOpacity={0.8}
              onPress={() => setRange(r.key)}
              style={[styles.rangeTab, { backgroundColor: active ? colors.accent : 'transparent' }]}
            >
              <Text style={[styles.rangeTabText, { color: active ? colors.onAccent : colors.textMuted50 }]}>
                {r.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Volume par sport</Text>
          <View style={styles.legend}>
            <LegendItem color={colors.swim} label="Nat." />
            <LegendItem color={colors.bike} label="Vélo" />
            <LegendItem color={colors.run} label="Course" />
          </View>
        </View>
        <Card radius={18} padding={0} style={styles.volumeChartCard}>
          {historyWeeksData.map((w) => (
            <View key={w.label} style={styles.volumeBarCol}>
              <View style={styles.volumeStack}>
                <View style={[styles.stackSegment, { height: w.swimPx, backgroundColor: colors.swim }]} />
                <View style={[styles.stackSegment, { height: w.bikePx, backgroundColor: colors.bike }]} />
                <View style={[styles.stackSegment, { height: w.runPx, backgroundColor: colors.run }]} />
              </View>
              <Text style={styles.weekLabel}>{w.label}</Text>
            </View>
          ))}
        </Card>
      </View>

      <View>
        <Text style={styles.sectionTitle}>Charge d&apos;entraînement</Text>
        <Card radius={18} padding={0} style={styles.loadChartCard}>
          <View
            style={[
              styles.targetBand,
              { bottom: BAND_BOTTOM, height: BAND_HEIGHT },
            ]}
          />
          <View style={styles.loadBarsRow}>
            {chargeWeeksData.map((c) => (
              <View key={c.label} style={styles.loadBarCol}>
                <View style={[styles.loadBar, { height: c.px, backgroundColor: c.color }]} />
                <Text style={styles.weekLabel}>{c.label}</Text>
              </View>
            ))}
          </View>
        </Card>
      </View>

      <View style={styles.statsRow}>
        <StatTile label="Volume semaine" value={weekVolumeTotalLabel} />
        <StatTile label="Séances" value={weekSessionsCompletedLabel} />
        <StatTile label="Vs sem. dernière" value={weekVsLastLabel} valueColor={colors.danger} />
      </View>
    </ScrollView>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendLabel}>{label}</Text>
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
    gap: 20,
  },
  title: {
    fontFamily: fonts.headingBold,
    fontSize: 24,
    color: colors.text,
  },
  rangeTabs: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  rangeTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 9,
  },
  rangeTabText: {
    fontFamily: fonts.bodySemiBold,
    fontWeight: '600',
    fontSize: 12.5,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    fontFamily: fonts.bodySemiBold,
    fontWeight: '600',
    fontSize: 14,
    color: colors.textMuted60,
  },
  legend: {
    flexDirection: 'row',
    gap: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 7,
    height: 7,
    borderRadius: 2,
    marginRight: 4,
  },
  legendLabel: {
    fontFamily: fonts.body,
    fontSize: 10.5,
    color: colors.textMuted45,
  },
  volumeChartCard: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    height: CHART_HEIGHT,
    paddingTop: 16,
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
  volumeBarCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
    gap: 6,
  },
  volumeStack: {
    flexDirection: 'column-reverse',
    width: 12,
    borderRadius: 3,
    overflow: 'hidden',
  },
  stackSegment: {
    width: 12,
  },
  weekLabel: {
    fontFamily: fonts.body,
    fontSize: 9.5,
    color: colors.textMuted35,
  },
  loadChartCard: {
    height: LOAD_CHART_HEIGHT,
    paddingTop: 16,
    paddingHorizontal: 12,
    paddingBottom: 10,
    position: 'relative',
  },
  targetBand: {
    position: 'absolute',
    left: 12,
    right: 12,
    backgroundColor: colors.accentSoft08,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: colors.accentDashed,
    borderBottomColor: colors.accentDashed,
    borderStyle: 'dashed',
  },
  loadBarsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    height: '100%',
  },
  loadBarCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
    gap: 6,
  },
  loadBar: {
    width: 12,
    borderRadius: 3,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
});
