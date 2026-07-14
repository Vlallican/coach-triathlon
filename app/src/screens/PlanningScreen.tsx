import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card } from '../components/Card';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { useRootNavigation } from '../navigation/hooks';
import { sessions, weekRangeLabel } from '../data/mockData';
import { getTodayDayIndex } from '../utils/date';
import { loadJSON, saveJSON } from '../storage/storage';
import { STORAGE_KEYS } from '../storage/keys';
import type { Session } from '../data/types';

export function PlanningScreen() {
  const insets = useSafeAreaInsets();
  const rootNav = useRootNavigation();
  const [selectedDay, setSelectedDay] = useState(getTodayDayIndex());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      const saved = await loadJSON<number>(STORAGE_KEYS.planningSelectedDay);
      if (saved != null) setSelectedDay(saved);
      setHydrated(true);
    })();
  }, []);

  useEffect(() => {
    if (hydrated) saveJSON(STORAGE_KEYS.planningSelectedDay, selectedDay);
  }, [selectedDay, hydrated]);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 100 }]}
    >
      <View>
        <Text style={styles.title}>Planning</Text>
        <Text style={styles.subtitle}>{weekRangeLabel}</Text>
      </View>

      <View style={styles.daysRow}>
        {sessions.map((s) => {
          const isSelected = s.dayIndex === selectedDay;
          return (
            <TouchableOpacity
              key={s.id}
              activeOpacity={0.8}
              onPress={() => setSelectedDay(s.dayIndex)}
              style={[
                styles.dayChip,
                {
                  backgroundColor: isSelected ? colors.accent : colors.card,
                  borderColor: isSelected ? colors.accent : colors.cardBorder,
                },
              ]}
            >
              <Text style={[styles.dayLabel, { color: isSelected ? 'rgba(6,17,13,0.6)' : colors.textMuted40 }]}>
                {s.dayLabel}
              </Text>
              <Text style={[styles.dayNum, { color: isSelected ? colors.onAccent : colors.text }]}>{s.dayNum}</Text>
              <View
                style={[
                  styles.dayDot,
                  {
                    backgroundColor: s.isRest ? 'transparent' : isSelected ? colors.onAccent : s.sportColor,
                  },
                ]}
              />
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.sessionsList}>
        {sessions.map((s) => (
          <SessionRow
            key={s.id}
            session={s}
            highlighted={s.dayIndex === selectedDay}
            onPress={() => {
              if (!s.isRest) rootNav.navigate('SessionDetail', { sessionId: s.id });
            }}
          />
        ))}
      </View>
    </ScrollView>
  );
}

function SessionRow({
  session,
  highlighted,
  onPress,
}: {
  session: Session;
  highlighted: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={session.isRest ? 1 : 0.8}
      onPress={onPress}
      style={[styles.sessionCard, { borderColor: highlighted ? colors.accent : colors.cardBorder }]}
    >
      <View style={styles.sessionDayCol}>
        <Text style={styles.sessionDayLabel}>{session.dayLabel}</Text>
        <Text style={styles.sessionDayNum}>{session.dayNum}</Text>
      </View>
      <View style={styles.sessionDivider} />
      {session.isRest ? (
        <Text style={styles.restText}>Repos</Text>
      ) : (
        <>
          <View style={[styles.sessionBadge, { backgroundColor: session.sportColor }]}>
            <Text style={styles.sessionBadgeText}>{session.sportInitial}</Text>
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={styles.sessionTitle} numberOfLines={1}>
              {session.title}
            </Text>
            <Text style={styles.sessionMeta}>
              {session.durationLabel} · {session.distanceLabel}
            </Text>
          </View>
        </>
      )}
    </TouchableOpacity>
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
  title: {
    fontFamily: fonts.headingBold,
    fontSize: 24,
    color: colors.text,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textMuted45,
    marginTop: 4,
  },
  daysRow: {
    flexDirection: 'row',
    gap: 7,
  },
  dayChip: {
    flex: 1,
    borderRadius: 13,
    paddingVertical: 9,
    alignItems: 'center',
    borderWidth: 1,
  },
  dayLabel: {
    fontFamily: fonts.body,
    fontSize: 10,
    letterSpacing: 0.4,
  },
  dayNum: {
    fontFamily: fonts.headingBold,
    fontSize: 14,
    marginTop: 3,
  },
  dayDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginTop: 5,
  },
  sessionsList: {
    gap: 10,
  },
  sessionCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sessionDayCol: {
    width: 40,
  },
  sessionDayLabel: {
    fontFamily: fonts.body,
    fontSize: 10,
    color: colors.textMuted40,
    letterSpacing: 0.4,
  },
  sessionDayNum: {
    fontFamily: fonts.headingBold,
    fontSize: 16,
    color: colors.text,
  },
  sessionDivider: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: colors.divider,
  },
  restText: {
    flex: 1,
    color: colors.textMuted35,
    fontFamily: fonts.body,
    fontSize: 13.5,
    fontStyle: 'italic',
  },
  sessionBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  sessionBadgeText: {
    fontFamily: fonts.headingBold,
    fontSize: 12,
    color: colors.onAccent,
  },
  sessionTitle: {
    fontFamily: fonts.headingMedium,
    fontWeight: '600',
    fontSize: 14,
    color: colors.text,
  },
  sessionMeta: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textMuted45,
    marginTop: 2,
  },
});
