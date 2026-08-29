import React from 'react';
import {TouchableOpacity, View, StyleSheet, Animated} from 'react-native';
import {Colors} from '../../theme/colors';

interface ToggleProps {
  value: boolean;
  onToggle: () => void;
}

export default function Toggle({value, onToggle}: ToggleProps) {
  const translateX = React.useRef(new Animated.Value(value ? 24 : 0)).current;

  React.useEffect(() => {
    Animated.timing(translateX, {
      toValue: value ? 24 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [value, translateX]);

  return (
    <TouchableOpacity
      onPress={onToggle}
      activeOpacity={0.8}
      style={[styles.track, value && styles.trackOn]}>
      <Animated.View style={[styles.knob, {transform: [{translateX}]}]} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 52,
    height: 28,
    borderRadius: 20,
    backgroundColor: Colors.t4,
    padding: 3,
    borderWidth: 1,
    borderColor: Colors.border2,
  },
  trackOn: {backgroundColor: Colors.green},
  knob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
});
