import React, {useEffect, useState} from 'react';
import {View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Colors} from '../../theme/colors';
import AppHeader from '../../components/common/AppHeader';
import Button from '../../components/common/Button';
import type {CustomerStackParamList} from '../../navigation/types';
import {walletService} from '../../services/walletService';
import type {Transaction, WalletBalance} from '../../types/wallet';

type Nav = NativeStackNavigationProp<CustomerStackParamList>;

export default function CustomerWalletScreen() {
  const navigation = useNavigation<Nav>();
  const isFocused = useIsFocused();
  const [wallet, setWallet] = useState<WalletBalance | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryVersion, setRetryVersion] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [transactionsError, setTransactionsError] = useState<string | null>(null);
  const [transactionsRetryVersion, setTransactionsRetryVersion] = useState(0);

  useEffect(() => {
    if (!isFocused) {
      return;
    }

    let isActive = true;
    setError(null);
    walletService
      .getBalance()
      .then(balance => {
        if (isActive) {
          setWallet(balance);
        }
      })
      .catch(loadError => {
        if (isActive) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Could not load wallet balance.',
          );
        }
      });

    return () => {
      isActive = false;
    };
  }, [isFocused, retryVersion]);

  useEffect(() => {
    if (!isFocused) {
      return;
    }

    let isActive = true;
    setTransactionsLoading(true);
    setTransactionsError(null);
    walletService
      .getTransactions(1, 20)
      .then(response => {
        if (isActive) {
          setTransactions(response.data.items);
        }
      })
      .catch(loadError => {
        if (isActive) {
          setTransactionsError(
            loadError instanceof Error
              ? loadError.message
              : 'Could not load recent transactions.',
          );
        }
      })
      .finally(() => {
        if (isActive) {
          setTransactionsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [isFocused, transactionsRetryVersion]);

  return (
    <SafeAreaView style={styles.safe}>
      <AppHeader title="My Wallet" onBack={() => navigation.navigate('CustomerTabs')} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroLabel}>AVAILABLE BALANCE</Text>
          <Text style={styles.heroAmount}>
            {wallet ? (
              <>
                ₹<Text style={styles.heroNum}>{Math.trunc(wallet.balance)}</Text>
                <Text style={styles.heroDec}>
                  .{(wallet.balance % 1).toFixed(2).slice(2)}
                </Text>
              </>
            ) : (
              '₹—'
            )}
          </Text>
          {wallet && (
            <Text style={styles.heroStat}>
              Total Spent: ₹{wallet.totalSpent.toFixed(2)}
            </Text>
          )}
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity onPress={() => setRetryVersion(version => version + 1)}>
                <Text style={styles.retryText}>Retry</Text>
              </TouchableOpacity>
            </View>
          )}
          {!wallet && !error && (
            <ActivityIndicator color={Colors.gold} style={styles.loader} />
          )}
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

        {transactionsLoading ? (
          <ActivityIndicator color={Colors.gold} style={styles.loader} />
        ) : transactionsError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{transactionsError}</Text>
            <TouchableOpacity
              onPress={() =>
                setTransactionsRetryVersion(version => version + 1)
              }>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : transactions.length === 0 ? (
          <Text style={styles.emptyTransactions}>No transactions yet.</Text>
        ) : (
          transactions.slice(0, 5).map(tx => (
            <View key={tx._id} style={styles.txItem}>
              <View
                style={[
                  styles.txIcon,
                  tx.type === 'credit' ? styles.txCredit : styles.txDebit,
                ]}>
                <Text style={styles.txEmoji}>
                  {getTransactionIcon(tx.description, tx.reason)}
                </Text>
              </View>
              <View style={styles.txInfo}>
                <Text style={styles.txTitle}>
                  {tx.description || formatTransactionReason(tx.reason)}
                </Text>
                <Text style={styles.txDate}>
                  {formatTransactionDate(tx.createdAt)}
                </Text>
              </View>
              <Text
                style={[
                  styles.txAmount,
                  tx.type === 'credit'
                    ? styles.txAmountCredit
                    : styles.txAmountDebit,
                ]}>
                {tx.type === 'credit' ? '+' : '-'}₹
                {tx.amount.toLocaleString('en-IN')}
              </Text>
            </View>
          ))
        )}

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
  loader: {marginTop: 10},
  errorContainer: {alignItems: 'center', marginTop: 8},
  errorText: {fontSize: 11, color: Colors.red, textAlign: 'center'},
  retryText: {fontSize: 12, fontWeight: '700', color: Colors.gold, marginTop: 6},
  actions: {flexDirection: 'row', gap: 12, paddingHorizontal: 20, marginBottom: 20},
  actionBtn: {flex: 1, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border2, borderRadius: 14, padding: 14, alignItems: 'center'},
  actionIcon: {fontSize: 22, marginBottom: 5},
  actionLabel: {fontSize: 11, fontWeight: '600', color: Colors.t2},
  secHdr: {paddingHorizontal: 20, marginBottom: 12},
  secTitle: {fontSize: 16, fontWeight: '700', color: Colors.text},
  txItem: {flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: Colors.border3},
  txIcon: {width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center'},
  txEmoji: {fontSize: 16},
  txCredit: {backgroundColor: Colors.greenDim},
  txDebit: {backgroundColor: Colors.redDim},
  txInfo: {flex: 1},
  txTitle: {fontSize: 13, fontWeight: '600', color: Colors.text},
  txDate: {fontSize: 11, color: Colors.t3, marginTop: 2},
  txAmount: {fontSize: 15, fontWeight: '700'},
  txAmountCredit: {color: Colors.green},
  txAmountDebit: {color: Colors.red},
  emptyTransactions: {fontSize: 12, color: Colors.t3, textAlign: 'center', paddingVertical: 20},
});

function formatTransactionDate(createdAt: string): string {
  const date = new Date(createdAt);
  return Number.isNaN(date.getTime()) ? createdAt : date.toLocaleString();
}

function formatTransactionReason(reason: string): string {
  return reason.charAt(0).toUpperCase() + reason.slice(1);
}

function getTransactionIcon(description: string, reason: string): string {
  const value = `${description} ${reason}`.toLowerCase();
  if (value.includes('recharge')) {
    return '💰';
  }
  if (value.includes('chat')) {
    return '💬';
  }
  if (value.includes('video')) {
    return '📹';
  }
  if (value.includes('call')) {
    return '📞';
  }
  return '↔️';
}
