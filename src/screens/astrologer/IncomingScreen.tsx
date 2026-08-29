import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Animated} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Colors} from '../../theme/colors';
import Chip from '../../components/common/Chip';
import Button from '../../components/common/Button';
import {consultationService} from '../../services/consultationService';
import type {AstrologerScreenProps} from '../../navigation/types';

const COUNTDOWN_SECS = 30;

export default function IncomingScreen({navigation, route}: AstrologerScreenProps<'Incoming'>) {
  const {consultationId, customerName, customerSessions, type, ratePerMinute, question} = route.params;
  const [countdown, setCountdown] = useState(COUNTDOWN_SECS);
  const ringAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(ringAnim, {toValue: 1, duration: 1000, useNativeDriver: true}),
        Animated.timing(ringAnim, {toValue: 0, duration: 1000, useNativeDriver: true}),
      ]),
    ).start();
  }, [ringAnim]);

  useEffect(() => {
    if (countdown <= 0) {
      navigation.navigate('AstrologerTabs');
      return;
    }
    const iv = setInterval(() => setCountdown(s => s - 1), 1000);
    return () => clearInterval(iv);
  }, [countdown, navigation]);

  async function accept() {
    await consultationService.accept(consultationId);
    navigation.navigate('AstrologerChat', {
      consultationId,
      customerName,
      type,
      ratePerMinute,
    });
  }

  async function decline() {
    await consultationService.decline(consultationId);
    navigation.navigate('AstrologerTabs');
  }

  const ringOpacity = ringAnim.interpolate({inputRange: [0, 1], outputRange: [0.4, 0]});

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.screen}>
        <Animated.View style={[styles.ring, {shadowOpacity: ringOpacity}]}>
          <Text style={{fontSize: 50}}>🔔</Text>
        </Animated.View>

        <Text style={styles.title}>Consultation Request!</Text>
        <Text style={styles.subtitle}>
          A customer wants to connect with you.{'\n'}Accept to start the session.
        </Text>

        <Text style={styles.countdown}>{countdown}</Text>

        <View style={styles.infoCard}>
          <View style={styles.customerRow}>
            <View style={styles.av}><Text style={{fontSize: 16}}>👤</Text></View>
            <View>
              <Text style={styles.customerName}>{customerName}</Text>
              <Text style={styles.customerSub}>Customer · {customerSessions} sessions</Text>
            </View>
          </View>
          <View style={styles.chips}>
            <Chip label={`${type === 'chat' ? '💬' : type === 'call' ? '📞' : '📹'} ${type.charAt(0).toUpperCase() + type.slice(1)}`} variant="green" />
            <Chip label={`₹${ratePerMinute}/min`} variant="gold" />
          </View>
          {question && (
            <View style={styles.questionBox}>
              <Text style={styles.questionText}>"{question}"</Text>
            </View>
          )}
        </View>

        <View style={styles.actions}>
          <Button label="✗ Decline" variant="danger" onPress={decline} style={{flex: 1}} />
          <Button label="✓ Accept" variant="success" onPress={accept} style={{flex: 1}} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: Colors.bg},
  screen: {flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28, backgroundColor: Colors.bg},
  ring: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: Colors.goldDim,
    borderWidth: 3,
    borderColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: Colors.gold,
    shadowOffset: {width: 0, height: 0},
    shadowRadius: 24,
    elevation: 8,
  },
  title: {fontSize: 22, fontWeight: '800', color: Colors.text, marginBottom: 6},
  subtitle: {fontSize: 13, color: Colors.t2, lineHeight: 20, textAlign: 'center', marginBottom: 20},
  countdown: {fontSize: 52, fontWeight: '800', color: Colors.gold, marginBottom: 20},
  infoCard: {width: '100%', backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border2, borderRadius: 16, padding: 14, paddingHorizontal: 16, marginBottom: 24},
  customerRow: {flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10},
  av: {width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.card2, alignItems: 'center', justifyContent: 'center'},
  customerName: {fontSize: 14, fontWeight: '700', color: Colors.text},
  customerSub: {fontSize: 11, color: Colors.t2},
  chips: {flexDirection: 'row', gap: 8, marginBottom: 10},
  questionBox: {backgroundColor: Colors.card2, padding: 10, borderRadius: 10},
  questionText: {fontSize: 12, color: Colors.t2, lineHeight: 18},
  actions: {flexDirection: 'row', gap: 12, width: '100%'},
});
