import React, {useEffect, useRef} from 'react';
import {View, Text, Animated, StyleSheet, Easing} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Colors} from '../../theme/colors';
import type {AuthScreenProps} from '../../navigation/types';

export default function SplashScreen({navigation}: AuthScreenProps<'Splash'>) {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    const timer = setTimeout(() => navigation.replace('Role'), 2500);
    return () => clearTimeout(timer);
  }, [navigation, shimmerAnim]);

  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-60, 200],
  });

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.screen}>
        <Text style={styles.stars}>✦ ✦ ✦</Text>
        <Text style={styles.logo}>🔮</Text>
        <Text style={styles.title}>AstroApp</Text>
        <Text style={styles.sub}>POWERED BY THE STARS</Text>
        <View style={styles.barWrap}>
          <Animated.View
            style={[styles.barFill, {transform: [{translateX: shimmerTranslate}]}]}
          />
        </View>
        <Text style={styles.tap}>Loading...</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: Colors.bg},
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.bg,
  },
  stars: {
    fontSize: 13,
    letterSpacing: 10,
    color: Colors.gold,
    opacity: 0.55,
    marginBottom: 32,
  },
  logo: {fontSize: 90, marginBottom: 18},
  title: {
    fontSize: 44,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -1.5,
  },
  sub: {
    fontSize: 11,
    color: Colors.t2,
    marginTop: 10,
    marginBottom: 56,
    letterSpacing: 3.5,
  },
  barWrap: {
    width: 60,
    height: 3,
    backgroundColor: Colors.t4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  barFill: {
    width: 30,
    height: '100%',
    backgroundColor: Colors.gold2,
    borderRadius: 2,
  },
  tap: {marginTop: 44, fontSize: 12, color: Colors.t3},
});
