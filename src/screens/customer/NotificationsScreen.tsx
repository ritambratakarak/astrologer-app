import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Colors} from '../../theme/colors';
import AppHeader from '../../components/common/AppHeader';
import {notificationService} from '../../services/notificationService';
import type {
  AppNotification,
  NotificationsPagination,
} from '../../types/notification';

const PAGE_SIZE = 20;

function getNotificationStyle(type: string): {icon: string; iconBg: string} {
  switch (type) {
    case 'wallet':
      return {icon: '💰', iconBg: Colors.blueDim};
    case 'consultation':
      return {icon: '✅', iconBg: Colors.greenDim};
    case 'promotion':
      return {icon: '🎉', iconBg: Colors.purpleDim};
    case 'astrologer_status':
      return {icon: '🔮', iconBg: Colors.goldDim};
    case 'reminder':
      return {icon: '⏰', iconBg: Colors.goldDim};
    default:
      return {icon: '🔔', iconBg: Colors.card2};
  }
}

function formatCreatedAt(createdAt: string): string {
  const date = new Date(createdAt);
  return Number.isNaN(date.getTime()) ? createdAt : date.toLocaleString();
}

export default function NotificationsScreen({navigation}: {navigation: any}) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [pagination, setPagination] = useState<NotificationsPagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
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
      const response = await notificationService.getNotifications(page, PAGE_SIZE);
      if (!isMountedRef.current) {
        return;
      }
      setNotifications(current =>
        replace ? response.data.items : [...current, ...response.data.items],
      );
      setPagination(response.data.pagination);
      setError(null);
    } catch (loadError) {
      if (isMountedRef.current) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : 'Could not load notifications.',
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

  const markRead = async (notification: AppNotification) => {
    if (notification.isRead) {
      return;
    }
    setActionError(null);
    try {
      await notificationService.markRead(notification.userId);
      setNotifications(current =>
        current.map(item =>
          item._id === notification._id ? {...item, isRead: true} : item,
        ),
      );
    } catch (markError) {
      setActionError(
        markError instanceof Error
          ? markError.message
          : 'Could not mark notification as read.',
      );
    }
  };

  const markAll = async () => {
    setActionError(null);
    try {
      await notificationService.markAllRead();
      setNotifications(current =>
        current.map(notification => ({...notification, isRead: true})),
      );
    } catch (markError) {
      setActionError(
        markError instanceof Error
          ? markError.message
          : 'Could not mark notifications as read.',
      );
    }
  };

  const loadMore = () => {
    if (!loading && !loadingMore && pagination?.hasNextPage) {
      loadPage(pagination.page + 1, false);
    }
  };

  const unreadCount = notifications.filter(notification => !notification.isRead).length;

  return (
    <SafeAreaView style={styles.safe}>
      <AppHeader
        title="Notifications"
        onBack={() => navigation.goBack()}
        rightLabel={unreadCount ? 'Mark all read' : undefined}
        onRightPress={markAll}
      />
      {actionError && (
        <Text style={styles.actionError}>{actionError}</Text>
      )}
      <FlatList
        data={notifications}
        keyExtractor={item => item._id}
        renderItem={({item}) => (
          <TouchableOpacity
            style={[styles.item, !item.isRead && styles.itemUnread]}
            onPress={() => markRead(item)}>
            <View
              style={[
                styles.icon,
                {backgroundColor: getNotificationStyle(item.type).iconBg},
              ]}>
              <Text style={styles.iconText}>
                {getNotificationStyle(item.type).icon}
              </Text>
            </View>
            <View style={styles.content}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.body}>{item.body}</Text>
              <Text style={styles.time}>{formatCreatedAt(item.createdAt)}</Text>
            </View>
            {!item.isRead && <View style={styles.dot} />}
          </TouchableOpacity>
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
        ListHeaderComponent={
          error && notifications.length > 0 ? (
            <View style={styles.loadError}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity onPress={() => loadPage(1, true)}>
                <Text style={styles.retryText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator color={Colors.gold} style={styles.loading} />
          ) : error ? (
            <View style={styles.emptyState}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity onPress={() => loadPage(1, true)}>
                <Text style={styles.retryText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={styles.emptyText}>No notifications yet.</Text>
          )
        }
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator color={Colors.gold} style={styles.loadingMore} />
          ) : (
            <View style={styles.listBottomSpace} />
          )
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: Colors.bg},
  item: {flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 14, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: Colors.border3},
  itemUnread: {backgroundColor: Colors.goldDim2},
  icon: {width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexShrink: 0},
  iconText: {fontSize: 18},
  content: {flex: 1},
  title: {fontSize: 13, fontWeight: '700', color: Colors.text},
  body: {fontSize: 12, color: Colors.t2, marginTop: 2, lineHeight: 18},
  time: {fontSize: 10, color: Colors.t3, marginTop: 5},
  dot: {width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.gold, flexShrink: 0, marginTop: 4},
  loading: {marginTop: 40},
  loadingMore: {paddingVertical: 20},
  emptyState: {alignItems: 'center', padding: 24, gap: 12},
  emptyText: {textAlign: 'center', padding: 24, color: Colors.t2},
  loadError: {alignItems: 'center', padding: 16, gap: 8},
  errorText: {fontSize: 12, color: Colors.red, textAlign: 'center'},
  retryText: {fontSize: 12, fontWeight: '700', color: Colors.gold},
  actionError: {paddingHorizontal: 20, paddingBottom: 8, color: Colors.red, fontSize: 12},
  listBottomSpace: {height: 90},
});
