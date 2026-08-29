import React from 'react';
import {View, StyleSheet, ViewProps} from 'react-native';
import {Colors} from '../../theme/colors';

type CardVariant = 'default' | 'gold' | 'small';

interface CardProps extends ViewProps {
  variant?: CardVariant;
}

export default function Card({variant = 'default', style, children, ...rest}: CardProps) {
  return (
    <View
      style={[styles.card, styles[variant], style]}
      {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border2,
    padding: 16,
  },
  default: {},
  gold: {
    backgroundColor: Colors.card,
    borderColor: Colors.border,
  },
  small: {padding: 12},
});
