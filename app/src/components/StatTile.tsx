import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from './Card';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

interface StatTileProps {
  label: string;
  value: string;
  suffix?: string;
  valueColor?: string;
}

export function StatTile({ label, value, suffix, valueColor = colors.text }: StatTileProps) {
  return (
    <Card style={styles.tile} radius={16} padding={14}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.valueRow}>
        <Text style={[styles.value, { color: valueColor }]}>{value}</Text>
        {suffix ? <Text style={styles.suffix}> {suffix}</Text> : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
  },
  label: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.textMuted40,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 4,
  },
  value: {
    fontFamily: fonts.headingBold,
    fontSize: 20,
  },
  suffix: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    color: colors.textMuted40,
  },
});
