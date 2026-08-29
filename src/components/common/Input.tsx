import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import {Colors} from '../../theme/colors';

interface InputProps extends TextInputProps {
  label?: string;
  containerStyle?: ViewStyle;
}

export default function Input({label, containerStyle, ...rest}: InputProps) {
  const [focused, setFocused] = React.useState(false);
  return (
    <View style={[styles.group, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.inp, focused && styles.inpFocused]}
        placeholderTextColor={Colors.t3}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  group: {marginBottom: 16},
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.t2,
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  inp: {
    backgroundColor: Colors.card,
    borderWidth: 1.5,
    borderColor: Colors.border2,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: Colors.text,
  },
  inpFocused: {borderColor: Colors.gold},
});
