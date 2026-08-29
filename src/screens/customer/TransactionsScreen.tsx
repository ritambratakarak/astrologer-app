import React from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Colors} from '../../theme/colors';
import AppHeader from '../../components/common/AppHeader';
import type {CustomerScreenProps} from '../../navigation/types';

const TRANSACTIONS = [
  {id: '1', icon: '💰', category: 'credit', title: 'Wallet Recharge', date: 'Today, 9:15 AM · UPI', amount: '+₹500'},
  {id: '2', icon: '💬', category: 'debit', title: 'Chat — Pandit Ramesh', date: 'Today, 10:30 AM · 12 min', amount: '-₹240'},
  {id: '3', icon: '📞', category: 'debit', title: 'Call — Meera Joshi', date: 'Yesterday, 3:45 PM · 15 min', amount: '-₹375'},
  {id: '4', icon: '💰', category: 'credit', title: 'Wallet Recharge', date: 'Jul 26, 2026 · Card', amount: '+₹300'},
  {id: '5', icon: '📹', category: 'debit', title: 'Video — Acharya Suresh', date: 'Jul 25, 2026 · 20 min', amount: '-₹800'},
  {id: '6', icon: '📞', category: 'debit', title: 'Call — Divya Nair', date: 'Jul 24, 2026 · 10 min', amount: '-₹280'},
  {id: '7', icon: '💰', category: 'credit', title: 'Wallet Recharge', date: 'Jul 22, 2026 · UPI', amount: '+₹1,000'},
];

export default function TransactionsScreen({navigation}: CustomerScreenProps<'Transactions'>) {
  return (
    <SafeAreaView style={styles.safe}>
      <AppHeader title="Transaction History" onBack={() => navigation.goBack()} />
      <FlatList
        data={TRANSACTIONS}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.txItem}>
            <View style={[styles.txIcon, item.category === 'credit' ? styles.credit : styles.debit]}>
              <Text style={{fontSize: 16}}>{item.icon}</Text>
            </View>
            <View style={styles.txInfo}>
              <Text style={styles.txTitle}>{item.title}</Text>
              <Text style={styles.txDate}>{item.date}</Text>
            </View>
            <Text style={[styles.txAmount, item.category === 'credit' ? styles.creditText : styles.debitText]}>
              {item.amount}
            </Text>
          </View>
        )}
        ListFooterComponent={<View style={{height: 90}} />}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: Colors.bg},
  txItem: {flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: Colors.border3},
  txIcon: {width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center'},
  credit: {backgroundColor: Colors.greenDim},
  debit: {backgroundColor: Colors.redDim},
  txInfo: {flex: 1},
  txTitle: {fontSize: 13, fontWeight: '600', color: Colors.text},
  txDate: {fontSize: 11, color: Colors.t3, marginTop: 2},
  txAmount: {fontSize: 15, fontWeight: '700'},
  creditText: {color: Colors.green},
  debitText: {color: Colors.red},
});
