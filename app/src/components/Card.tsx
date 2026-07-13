import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { colors } from '../theme/colors';

interface CardProps extends ViewProps {
  radius?: number;
  padding?: number;
  bordered?: boolean;
}

export function Card({ style, radius = 20, padding = 20, bordered = true, ...rest }: CardProps) {
  return (
    <View
      style={[
        styles.base,
        {
          borderRadius: radius,
          padding,
          borderWidth: bordered ? 1 : 0,
        },
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.card,
    borderColor: colors.cardBorder,
  },
});
