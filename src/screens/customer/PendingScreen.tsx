import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Animated} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Colors} from '../../theme/colors';
import Chip from '../../components/common/Chip';
import Button from '../../components/common/Button';
import {consultationService} from '../../services/consultationService';
import type {CustomerScreenProps} from '../../navigation/types';

export default function PendingScreen({navigation, route}: CustomerScreenProps<'Pending'>) {
  const {consultationId, astrologerName, type, ratePerMinute} = route.params;
  const [elapsed, setElapsed] = useState(0);
  const pulseAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const iv = setInterval(() => setElapsed(s => s + 1), 1000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {toValue: 1, duration: 1000, useNativeDriver: true}),
        Animated.timing(pulseAnim, {toValue: 0, duration: 1000, useNativeDriver: true}),
      ]),
    ).start();
  }, [pulseAnim]);

  const boxShadowOpacity = pulseAnim.interpolate({inputRange: [0, 1], outputRange: [0.3, 0]});

  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  const clock = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  async function cancel() {
    await consultationService.cancel(consultationId);
    navigation.navigate('CustomerTabs', {screen: 'BrowseTab'} as never);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.screen}>
        <Animated.View style={[styles.ring, {shadowOpacity: boxShadowOpacity}]}>
          <Text style={{fontSize: 48}}>🧙</Text>
        </Animated.View>

        <Text style={styles.title}>Waiting for Astrologer</Text>
        <Text style={styles.subtitle}>
          Request sent to{'\n'}
          <Text style={styles.name}>{astrologerName}</Text>
          {'\n'}Waiting for acceptance...
        </Text>

        <Text style={styles.clock}>{clock}</Text>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoAv}><Text style={{fontSize: 16}}>🧙</Text></View>
            <View style={{flex: 1}}>
              <Text style={styles.infoName}>{astrologerName}</Text>
              <Text style={styles.infoDetail}>{type.charAt(0).toUpperCase() + type.slice(1)} · ₹{ratePerMinute}/min</Text>
            </View>
            <Chip label="Pending" variant="gold" />
          </View>
        </View>

        <View style={{width: '100%', gap: 12}}>
          <Button label="Cancel Request" variant="danger" onPress={cancel} />
          <Text style={styles.note}>Astrologer is notified instantly via app alert</Text>
          {/* Demo navigation */}
          <Button
            label="▶ Simulate Accept"
            variant="ghost"
            onPress={() =>
              navigation.navigate('Chat', {
                consultationId,
                astrologerName,
                type,
                ratePerMinute,
              })
            }
          />
          <Button
            label="▶ Simulate Reject"
            variant="ghost"
            onPress={() => navigation.navigate('Rejected', {astrologerName})}
          />
        </View>
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
    padding: 32,
    backgroundColor: Colors.bg,
  },
  ring: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(232,200,106,0.1)',
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: Colors.gold,
    shadowOffset: {width: 0, height: 0},
    shadowRadius: 20,
    elevation: 8,
  },
  title: {fontSize: 24, fontWeight: '800', color: Colors.text, marginBottom: 8},
  subtitle: {fontSize: 13, color: Colors.t2, lineHeight: 22, textAlign: 'center'},
  name: {fontWeight: '700', color: Colors.text},
  clock: {
    fontSize: 48,
    fontWeight: '800',
    color: Colors.gold,
    marginVertical: 20,
    fontVariant: ['tabular-nums'],
  },
  infoCard: {
    width: '100%',
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border2,
    borderRadius: 16,
    padding: 14,
    marginBottom: 24,
  },
  infoRow: {flexDirection: 'row', alignItems: 'center', gap: 12},
  infoAv: {width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.card2, alignItems: 'center', justifyContent: 'center'},
  infoName: {fontSize: 13, fontWeight: '700', color: Colors.text},
  infoDetail: {fontSize: 11, color: Colors.t2, marginTop: 2},
  note: {fontSize: 12, color: Colors.t2, textAlign: 'center'},
});
