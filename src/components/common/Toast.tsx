import React, {useEffect, useRef} from 'react';
import {Animated, Text, StyleSheet} from 'react-native';
import {Colors} from '../../theme/colors';

interface ToastProps {
  message: string;
  visible: boolean;
  onHide: () => void;
}

export default function Toast({message, visible, onHide}: ToastProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {toValue: 1, duration: 300, useNativeDriver: true}),
        Animated.timing(translateY, {toValue: 0, duration: 300, useNativeDriver: true}),
      ]).start();
      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, {toValue: 0, duration: 300, useNativeDriver: true}),
          Animated.timing(translateY, {toValue: 20, duration: 300, useNativeDriver: true}),
        ]).start(onHide);
      }, 2000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [visible, opacity, translateY, onHide]);

  if (!visible) {
    return null;
  }

  return (
    <Animated.View style={[styles.toast, {opacity, transform: [{translateY}]}]}>
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    backgroundColor: 'rgba(30,30,60,0.95)',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 20,
    zIndex: 9999,
  },
  text: {fontSize: 13, fontWeight: '600', color: Colors.text},
});
