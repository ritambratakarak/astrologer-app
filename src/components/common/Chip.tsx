import React from 'react';
import {View, Text, StyleSheet, ViewStyle} from 'react-native';
import {Colors} from '../../theme/colors';

type ChipVariant = 'default' | 'gold' | 'green' | 'red' | 'blue' | 'purple';

interface ChipProps {
  label: string;
  variant?: ChipVariant;
  style?: ViewStyle;
  small?: boolean;
}

export default function Chip({label, variant = 'default', style, small}: ChipProps) {
  return (
    <View style={[styles.chip, styles[variant], small && styles.small, style]}>
      <Text style={[styles.text, styles[`${variant}Text`], small && styles.smallText]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: Colors.card2,
    borderWidth: 1,
    borderColor: Colors.border2,
  },
  small: {paddingVertical: 2, paddingHorizontal: 8},
  default: {},
  gold: {backgroundColor: Colors.goldDim, borderColor: Colors.border},
  green: {backgroundColor: Colors.greenDim, borderColor: 'rgba(52,211,153,0.3)'},
  red: {backgroundColor: Colors.redDim, borderColor: 'rgba(248,113,113,0.3)'},
  blue: {backgroundColor: Colors.blueDim, borderColor: 'rgba(96,165,250,0.3)'},
  purple: {backgroundColor: Colors.purpleDim, borderColor: 'rgba(167,139,250,0.3)'},
  text: {fontSize: 10, fontWeight: '600', color: Colors.t2},
  defaultText: {},
  goldText: {color: Colors.gold},
  greenText: {color: Colors.green},
  redText: {color: Colors.red},
  blueText: {color: Colors.blue},
  purpleText: {color: Colors.purple},
  smallText: {fontSize: 9},
});
