import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
} from 'react-native';
import {Colors} from '../../theme/colors';

type ButtonVariant = 'gold' | 'outline' | 'ghost' | 'danger' | 'success';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  small?: boolean;
}

export default function Button({
  label,
  onPress,
  variant = 'gold',
  loading = false,
  disabled = false,
  style,
  small = false,
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.btn,
        styles[variant],
        small && styles.small,
        (disabled || loading) && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}>
      {loading ? (
        <ActivityIndicator
          color={variant === 'gold' ? '#1a0a00' : Colors.gold}
          size="small"
        />
      ) : (
        <Text style={[styles.label, styles[`${variant}Label`], small && styles.smallLabel]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gold: {
    backgroundColor: Colors.gold,
  },
  outline: {
    backgroundColor: Colors.transparent,
    borderWidth: 1.5,
    borderColor: Colors.gold,
  },
  ghost: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border2,
  },
  danger: {
    backgroundColor: Colors.redDim,
    borderWidth: 1.5,
    borderColor: Colors.red,
  },
  success: {
    backgroundColor: Colors.greenDim,
    borderWidth: 1.5,
    borderColor: Colors.green,
  },
  small: {
    width: 'auto',
    paddingVertical: 9,
    paddingHorizontal: 18,
    borderRadius: 12,
  },
  disabled: {opacity: 0.5},
  label: {fontSize: 16, fontWeight: '700', letterSpacing: -0.1},
  goldLabel: {color: '#1a0a00'},
  outlineLabel: {color: Colors.gold},
  ghostLabel: {color: Colors.t2},
  dangerLabel: {color: Colors.red},
  successLabel: {color: Colors.green},
  smallLabel: {fontSize: 13},
});
