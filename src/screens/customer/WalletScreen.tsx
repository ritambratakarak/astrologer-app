import React from 'react';
import {View, Text, ScrollView, TouchableOpacity, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Colors} from '../../theme/colors';
import AppHeader from '../../components/common/AppHeader';
import Button from '../../components/common/Button';
import type {CustomerStackParamList} from '../../navigation/types';

type Nav = NativeStackNavigationProp<CustomerStackParamList>;

const TRANSACTIONS = [
  {icon: '💰', category: 'credit', title: 'Wallet Recharge', date: 'Today, 9:15 AM · UPI', amount: '+₹500'},
  {icon: '💬', category: 'debit', title: 'Chat with Pandit Ramesh', date: 'Today, 10:30 AM · 12 mins', amount: '-₹240'},
  {icon: '📞', category: 'debit', title: 'Call with Meera Joshi', date: 'Yesterday, 3:45 PM · 15 mins', amount: '-₹375'},
  {icon: '💰', category: 'credit', title: 'Wallet Recharge', date: 'Jul 26, 2026 · Card', amount: '+₹300'},
  {icon: '📹', category: 'debit', title: 'Video with Acharya Suresh', date: 'Jul 25, 2026 · 20 mins', amount: '-₹800'},
];

export default function CustomerWalletScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <SafeAreaView style={styles.safe}>
      <AppHeader title="My Wallet" onBack={() => navigation.navigate('CustomerTabs')} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroLabel}>AVAILABLE BALANCE</Text>
          <Text style={styles.heroAmount}>
            ₹<Text style={styles.heroNum}>250</Text>
            <Text style={styles.heroDec}>.00</Text>
          </Text>
          <Text style={styles.heroStat}>Total Spent: ₹2,450 · 18 sessions</Text>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          {[
            {icon: '➕', label: 'Add Money', onPress: () => navigation.navigate('CustomerTabs', {screen: 'WalletTab'} as never)},
            {icon: '📋', label: 'History', onPress: () => navigation.navigate('Transactions')},
            {icon: '❓', label: 'Help', onPress: () => {}},
          ].map(a => (
            <TouchableOpacity key={a.label} style={styles.actionBtn} onPress={a.onPress}>
              <Text style={styles.actionIcon}>{a.icon}</Text>
              <Text style={styles.actionLabel}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.secHdr}><Text style={styles.secTitle}>Recent Transactions</Text></View>

        {TRANSACTIONS.map((tx, i) => (
          <View key={i} style={styles.txItem}>
            <View style={[styles.txIcon, tx.category === 'credit' ? styles.txCredit : styles.txDebit]}>
              <Text style={{fontSize: 16}}>{tx.icon}</Text>
            </View>
            <View style={styles.txInfo}>
              <Text style={styles.txTitle}>{tx.title}</Text>
              <Text style={styles.txDate}>{tx.date}</Text>
            </View>
            <Text style={[styles.txAmount, tx.category === 'credit' ? styles.txAmountCredit : styles.txAmountDebit]}>
              {tx.amount}
            </Text>
          </View>
        ))}

        <View style={{padding: 16}}>
          <Button label="View All Transactions" variant="outline" onPress={() => navigation.navigate('Transactions')} />
        </View>
        <View style={{height: 90}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: Colors.bg},
  hero: {margin: 20, marginBottom: 16, borderRadius: 22, backgroundColor: '#1a1260', padding: 24, borderWidth: 1, borderColor: 'rgba(96,165,250,0.2)', alignItems: 'center'},
  heroLabel: {fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 6},
  heroAmount: {fontSize: 42, fontWeight: '800', color: Colors.text, letterSpacing: -1},
  heroNum: {fontSize: 42, fontWeight: '800'},
  heroDec: {fontSize: 24, color: 'rgba(255,255,255,0.5)'},
  heroStat: {fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 6},
  actions: {flexDirection: 'row', gap: 12, paddingHorizontal: 20, marginBottom: 20},
  actionBtn: {flex: 1, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border2, borderRadius: 14, padding: 14, alignItems: 'center'},
  actionIcon: {fontSize: 22, marginBottom: 5},
  actionLabel: {fontSize: 11, fontWeight: '600', color: Colors.t2},
  secHdr: {paddingHorizontal: 20, marginBottom: 12},
  secTitle: {fontSize: 16, fontWeight: '700', color: Colors.text},
  txItem: {flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: Colors.border3},
  txIcon: {width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center'},
  txCredit: {backgroundColor: Colors.greenDim},
  txDebit: {backgroundColor: Colors.redDim},
  txInfo: {flex: 1},
  txTitle: {fontSize: 13, fontWeight: '600', color: Colors.text},
  txDate: {fontSize: 11, color: Colors.t3, marginTop: 2},
  txAmount: {fontSize: 15, fontWeight: '700'},
  txAmountCredit: {color: Colors.green},
  txAmountDebit: {color: Colors.red},
});
