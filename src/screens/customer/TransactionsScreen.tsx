import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Colors} from '../../theme/colors';
import AppHeader from '../../components/common/AppHeader';
import type {CustomerScreenProps} from '../../navigation/types';
import {walletService} from '../../services/walletService';
import type {Transaction, TransactionsPagination} from '../../types/wallet';

const PAGE_SIZE = 20;

export default function TransactionsScreen({
  navigation,
}: CustomerScreenProps<'Transactions'>) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState<TransactionsPagination | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadingMoreRef = useRef(false);
  const isMountedRef = useRef(true);

  const loadPage = useCallback(async (page: number, replace: boolean) => {
    if (page > 1 && loadingMoreRef.current) {
      return;
    }
    if (page > 1) {
      loadingMoreRef.current = true;
      setLoadingMore(true);
    } else if (replace) {
      setLoading(true);
      setError(null);
    }

    try {
      const response = await walletService.getTransactions(page, PAGE_SIZE);
      if (!isMountedRef.current) {
        return;
      }
      setTransactions(current =>
        replace ? response.data.items : [...current, ...response.data.items],
      );
      setPagination(response.data.pagination);
      setError(null);
    } catch (loadError) {
      if (isMountedRef.current) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : 'Could not load wallet transactions.',
        );
      }
    } finally {
      loadingMoreRef.current = false;
      if (isMountedRef.current) {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    loadPage(1, true);
    return () => {
      isMountedRef.current = false;
    };
  }, [loadPage]);

  const loadMore = () => {
    if (!loading && !loadingMore && pagination?.hasNextPage) {
      loadPage(pagination.page + 1, false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <AppHeader title="Transaction History" onBack={() => navigation.goBack()} />
      <FlatList
        data={transactions}
        keyExtractor={item => item._id}
        renderItem={({item}) => (
          <View style={styles.txItem}>
            <View
              style={[
                styles.txIcon,
                item.type === 'credit' ? styles.credit : styles.debit,
              ]}>
              <Text style={styles.txEmoji}>
                {getTransactionIcon(item.description, item.reason)}
              </Text>
            </View>
            <View style={styles.txInfo}>
              <Text style={styles.txTitle}>
                {item.description || formatTransactionReason(item.reason)}
              </Text>
              <Text style={styles.txDate}>
                {formatTransactionDate(item.createdAt)}
              </Text>
            </View>
            <Text
              style={[
                styles.txAmount,
                item.type === 'credit' ? styles.creditText : styles.debitText,
              ]}>
              {item.type === 'credit' ? '+' : '-'}₹
              {item.amount.toLocaleString('en-IN')}
            </Text>
          </View>
        )}
        onEndReached={loadMore}
        onEndReachedThreshold={0.4}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            tintColor={Colors.gold}
            onRefresh={() => {
              setRefreshing(true);
              loadPage(1, true);
            }}
          />
        }
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator color={Colors.gold} style={styles.loader} />
          ) : error ? (
            <View style={styles.emptyState}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity onPress={() => loadPage(1, true)}>
                <Text style={styles.retryText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={styles.emptyText}>No transactions yet.</Text>
          )
        }
        ListHeaderComponent={
          error && transactions.length > 0 ? (
            <View style={styles.loadError}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity onPress={() => loadPage(1, true)}>
                <Text style={styles.retryText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
        ListFooterComponent={
          <View style={styles.footer}>
            {loadingMore && <ActivityIndicator color={Colors.gold} />}
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: Colors.bg},
  txItem: {flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: Colors.border3},
  txIcon: {width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center'},
  txEmoji: {fontSize: 16},
  credit: {backgroundColor: Colors.greenDim},
  debit: {backgroundColor: Colors.redDim},
  txInfo: {flex: 1},
  txTitle: {fontSize: 13, fontWeight: '600', color: Colors.text},
  txDate: {fontSize: 11, color: Colors.t3, marginTop: 2},
  txAmount: {fontSize: 15, fontWeight: '700'},
  creditText: {color: Colors.green},
  debitText: {color: Colors.red},
  loader: {marginTop: 32},
  emptyState: {alignItems: 'center', padding: 24},
  errorText: {fontSize: 12, color: Colors.red, textAlign: 'center'},
  retryText: {fontSize: 12, fontWeight: '700', color: Colors.gold, marginTop: 8},
  emptyText: {fontSize: 13, color: Colors.t3, textAlign: 'center', padding: 24},
  loadError: {alignItems: 'center', padding: 16},
  footer: {height: 90, justifyContent: 'flex-start', paddingTop: 12},
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
