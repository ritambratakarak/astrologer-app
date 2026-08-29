import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Colors} from '../../theme/colors';
import Button from '../../components/common/Button';
import type {CustomerScreenProps} from '../../navigation/types';

export default function SessionEndedScreen({navigation, route}: CustomerScreenProps<'SessionEnded'>) {
  const {durationMinutes, amountCharged, astrologerName, balanceLeft, consultationId} = route.params;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.screen}>
        <View style={styles.endedIcon}><Text style={{fontSize: 42}}>✅</Text></View>
        <Text style={styles.title}>Session Complete!</Text>
        <Text style={styles.subtitle}>Your consultation has ended successfully.</Text>

        <View style={styles.summaryGrid}>
          <View style={styles.si}>
            <Text style={styles.siLabel}>DURATION</Text>
            <Text style={styles.siVal}>{durationMinutes} mins</Text>
          </View>
          <View style={styles.si}>
            <Text style={styles.siLabel}>AMOUNT PAID</Text>
            <Text style={[styles.siVal, {color: Colors.gold}]}>₹{amountCharged}</Text>
          </View>
          <View style={styles.si}>
            <Text style={styles.siLabel}>ASTROLOGER</Text>
            <Text style={[styles.siVal, {fontSize: 13}]}>{astrologerName}</Text>
          </View>
          <View style={styles.si}>
            <Text style={styles.siLabel}>BALANCE LEFT</Text>
            <Text style={[styles.siVal, {color: Colors.green}]}>₹{balanceLeft}</Text>
          </View>
        </View>

        <View style={{width: '100%', gap: 12}}>
          <Button
            label="Leave a Review ⭐"
            onPress={() => navigation.navigate('Review', {consultationId, astrologerName})}
          />
          <Button
            label="Back to Home"
            variant="outline"
            onPress={() => navigation.navigate('CustomerTabs')}
          />
          <Button
            label="Recharge Wallet"
            variant="ghost"
            onPress={() => navigation.navigate('CustomerTabs', {screen: 'WalletTab'} as never)}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: Colors.bg},
  screen: {flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28, backgroundColor: Colors.bg},
  endedIcon: {width: 100, height: 100, borderRadius: 50, backgroundColor: Colors.greenDim, borderWidth: 2, borderColor: 'rgba(52,211,153,0.3)', alignItems: 'center', justifyContent: 'center', marginBottom: 20},
  title: {fontSize: 24, fontWeight: '800', color: Colors.text},
  subtitle: {fontSize: 13, color: Colors.t2, marginVertical: 6, marginBottom: 24},
  summaryGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: 10, width: '100%', marginBottom: 24},
  si: {width: '47%', backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border2, borderRadius: 14, padding: 14},
  siLabel: {fontSize: 10, color: Colors.t2, marginBottom: 4},
  siVal: {fontSize: 18, fontWeight: '800', color: Colors.text},
});
