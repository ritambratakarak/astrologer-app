import React, {useCallback, useRef, useState} from 'react';
import {
  ActivityIndicator,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Colors} from '../../theme/colors';
import Chip from '../../components/common/Chip';
import {tokenManager} from '../../security/tokenManager';
import type {CustomerStackParamList} from '../../navigation/types';
import {walletService} from '../../services/walletService';
import {astrologerService} from '../../services/astrologerService';
import {consultationService} from '../../services/consultationService';
import type {AstrologerListItem} from '../../types/astrologer';
import type {ConsultationListItem} from '../../types/consultation';

type Nav = NativeStackNavigationProp<CustomerStackParamList>;

export default function CustomerHomeScreen() {
  const navigation = useNavigation<Nav>();
  const name = tokenManager.getUserName() ?? '';
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [astrologers, setAstrologers] = useState<AstrologerListItem[]>([]);
  const [astrologersLoading, setAstrologersLoading] = useState(true);
  const [astrologersError, setAstrologersError] = useState<string | null>(null);
  const [consultations, setConsultations] = useState<ConsultationListItem[]>([]);
  const [consultationsLoading, setConsultationsLoading] = useState(true);
  const [consultationsError, setConsultationsError] = useState<string | null>(null);
  const consultationsFocusedRef = useRef(false);

  const loadConsultations = useCallback(async () => {
    if (!consultationsFocusedRef.current) {
      return;
    }

    setConsultationsLoading(true);
    setConsultationsError(null);
    try {
      const response = await consultationService.getConsultations(1, 10);
      if (consultationsFocusedRef.current) {
        setConsultations(response.data.items);
      }
    } catch (loadError) {
      if (consultationsFocusedRef.current) {
        setConsultationsError(
          loadError instanceof Error
            ? loadError.message
            : 'Could not load recent consultations.',
        );
      }
    } finally {
      if (consultationsFocusedRef.current) {
        setConsultationsLoading(false);
      }
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      setWalletError(null);
      walletService
        .getBalance()
        .then(wallet => {
          if (isActive) {
            setWalletBalance(wallet.balance);
          }
        })
        .catch(loadError => {
          if (isActive) {
            setWalletError(
              loadError instanceof Error
                ? loadError.message
                : 'Could not load wallet balance.',
            );
          }
        });

      return () => {
        isActive = false;
      };
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      consultationsFocusedRef.current = true;
      loadConsultations();

      return () => {
        consultationsFocusedRef.current = false;
      };
    }, [loadConsultations]),
  );

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      setAstrologersLoading(true);
      setAstrologersError(null);
      astrologerService
        .listAstrologers({}, 1, 4)
        .then(response => {
          if (isActive) {
            setAstrologers(response.data.items);
          }
        })
        .catch(loadError => {
          if (isActive) {
            setAstrologersError(
              loadError instanceof Error
                ? loadError.message
                : 'Could not load astrologers.',
            );
          }
        })
        .finally(() => {
          if (isActive) {
            setAstrologersLoading(false);
          }
        });

      return () => {
        isActive = false;
      };
    }, []),
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.homeHdr}>
          <View style={{flex: 1}}>
            <Text style={styles.greeting}>
              Good Morning{name ? `, ${name}` : ''} ☀️
            </Text>
            <Text style={styles.greetingSub}>What do the stars say today?</Text>
          </View>
          <TouchableOpacity
            style={styles.notifBtn}
            onPress={() => navigation.navigate('Notifications')}>
            <Text style={{fontSize: 18}}>🔔</Text>
            <View style={styles.notifBadge} />
          </TouchableOpacity>
        </View>

        {/* Wallet banner */}
        <TouchableOpacity
          style={styles.walletBanner}
          onPress={() => navigation.navigate('CustomerTabs', {screen: 'WalletTab'} as never)}>
          <View>
            <Text style={styles.wbLabel}>WALLET BALANCE</Text>
            <Text style={styles.wbAmount}>
              {walletBalance === null ? 'Loading...' : `₹${walletBalance.toFixed(2)}`}
            </Text>
            <Text style={[styles.wbSub, walletError && styles.wbError]}>
              {walletError ?? 'Tap to manage ›'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.rechargeBtn}
            onPress={() => navigation.navigate('CustomerTabs', {screen: 'WalletTab'} as never)}>
            <Text style={styles.rechargeBtnText}>+ Recharge</Text>
          </TouchableOpacity>
        </TouchableOpacity>

        {/* Today's insight */}
        <View style={styles.insight}>
          <Text style={styles.insightLabel}>TODAY'S INSIGHT ✨</Text>
          <Text style={styles.insightText}>
            "The Moon in Scorpio amplifies your intuition today. Trust your gut in important decisions."
          </Text>
          <Text style={styles.insightDate}>Aries — July 28, 2026</Text>
        </View>

        {/* Top Astrologers */}
        <View style={styles.sectionHdr}>
          <Text style={styles.secTitle}>Top Astrologers</Text>
          <TouchableOpacity onPress={() => navigation.navigate('CustomerTabs', {screen: 'BrowseTab'} as never)}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hscroll}>
          {astrologers.map(a => {
            const astrologerName = a.user?.fullName || 'Astrologer';
            const specialization = a.specializations
              .map(value =>
                value
                  .split('_')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' '),
              )
              .slice(0, 2)
              .join(' · ');
            const rate = a.isAvailableForChat
              ? `₹${a.chatRate}/min chat`
              : a.isAvailableForCall
                ? `₹${a.callRate}/min call`
                : a.isAvailableForVideo
                  ? `₹${a.videoRate}/min video`
                  : 'Currently unavailable';

            return (
              <TouchableOpacity
                key={a._id}
                style={styles.astroCard}
                onPress={() =>
                  navigation.navigate('AstrologerDetail', {astrologerUserId: a.userId})
                }>
                <View style={styles.acAv}>
                  <Image
                    source={{uri: a.profilePhoto || 'default_image_url'}}
                    style={styles.avatarImage}
                  />
                </View>
                <Text style={styles.acName}>{astrologerName}</Text>
                <Text style={styles.acSpec}>{specialization}</Text>
                <View style={styles.acRow}>
                  <Text style={styles.stars}>★ {a.rating.toFixed(1)}</Text>
                  <View
                    style={[
                      styles.dot,
                      {backgroundColor: a.user?.isOnline ? Colors.green : Colors.t2},
                    ]}
                  />
                </View>
                <Text style={styles.acRate}>{rate}</Text>
              </TouchableOpacity>
            );
          })}
          {astrologersLoading && (
            <ActivityIndicator color={Colors.gold} style={styles.astroLoading} />
          )}
          {!astrologersLoading && astrologersError && (
            <Text style={styles.astroError}>{astrologersError}</Text>
          )}
          {!astrologersLoading && !astrologersError && astrologers.length === 0 && (
            <Text style={styles.astroError}>No astrologers available.</Text>
          )}
        </ScrollView>

        {/* Recent Consultations */}
        <View style={styles.sectionHdr}>
          <Text style={styles.secTitle}>Recent Consultations</Text>
        </View>
        {consultationsLoading ? (
          <ActivityIndicator color={Colors.gold} style={styles.consultationsLoading} />
        ) : consultationsError ? (
          <View style={styles.consultationsEmpty}>
            <Text style={styles.consultationsError}>{consultationsError}</Text>
            <TouchableOpacity
              onPress={loadConsultations}>
              <Text style={styles.consultationsRetry}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : consultations.length === 0 ? (
          <Text style={styles.consultationsEmpty}>No consultations yet.</Text>
        ) : (
          consultations.slice(0, 5).map(consultation => (
            <View key={consultation._id} style={styles.recentItem}>
              <View style={styles.recentAv}>
                <Text style={styles.recentEmoji}>
                  {getConsultationIcon(consultation.type)}
                </Text>
              </View>
              <View style={styles.recentInfo}>
                <Text style={styles.recentName}>
                  {consultation.astrologerId.fullName}
                </Text>
                <Text style={styles.recentDetail}>
                  {formatConsultationDetail(consultation)}
                </Text>
              </View>
              <Chip
                label={formatStatus(consultation.status)}
                variant={getStatusVariant(consultation.status)}
                small
              />
            </View>
          ))
        )}

        <View style={{height: 100}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: Colors.bg},
  homeHdr: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 14,
    backgroundColor: 'rgba(30,18,96,0.6)',
  },
  greeting: {fontSize: 22, fontWeight: '800', color: Colors.text, letterSpacing: -0.3},
  greetingSub: {fontSize: 13, color: Colors.t2, marginTop: 3},
  notifBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notifBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.red,
    borderWidth: 1.5,
    borderColor: Colors.bg,
  },
  walletBanner: {
    margin: 20,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 16,
    backgroundColor: '#1a1260',
    borderWidth: 1,
    borderColor: 'rgba(96,165,250,0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  wbLabel: {fontSize: 11, color: 'rgba(255,255,255,0.55)', marginBottom: 4},
  wbAmount: {fontSize: 24, fontWeight: '800', color: Colors.text},
  wbDecimal: {fontSize: 16},
  wbSub: {fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 3},
  wbError: {color: Colors.red},
  rechargeBtn: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  avatarImage:{
    height: 80,
    width: 140,
    resizeMode: 'contain',
  },
  rechargeBtnText: {fontSize: 12, fontWeight: '700', color: Colors.text},
  insight: {
    margin: 20,
    marginTop: 0,
    marginBottom: 20,
    borderRadius: 16,
    padding: 18,
    backgroundColor: 'rgba(232,200,106,0.1)',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  insightLabel: {fontSize: 11, color: Colors.gold, fontWeight: '700', letterSpacing: 0.5, marginBottom: 6},
  insightText: {fontSize: 14, color: Colors.text, lineHeight: 22},
  insightDate: {fontSize: 11, color: Colors.t2, marginTop: 8},
  sectionHdr: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  secTitle: {fontSize: 16, fontWeight: '700', color: Colors.text},
  seeAll: {fontSize: 12, color: Colors.gold, fontWeight: '600'},
  hscroll: {paddingHorizontal: 20, gap: 12, paddingBottom: 4, marginBottom: 20},
  astroCard: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border2,
    borderRadius: 18,
    padding: 14,
    width: 170,
  },
  acAv: {
    width: '100%',
    height: 80,
    backgroundColor: Colors.card2,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  acName: {fontSize: 13, fontWeight: '700', color: Colors.text},
  acSpec: {fontSize: 10, color: Colors.t2, marginTop: 2},
  acRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6},
  stars: {color: Colors.gold, fontSize: 12},
  dot: {width: 8, height: 8, borderRadius: 4},
  acRate: {fontSize: 11, color: Colors.gold, marginTop: 4, fontWeight: '600'},
  astroLoading: {padding: 24},
  astroError: {paddingHorizontal: 20, fontSize: 12, color: Colors.t2},
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border2,
    borderRadius: 14,
    padding: 12,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  recentAv: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.card2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentName: {fontSize: 13, fontWeight: '700', color: Colors.text},
  recentDetail: {fontSize: 11, color: Colors.t2, marginTop: 2},
  recentInfo: {flex: 1},
  recentEmoji: {fontSize: 16},
  consultationsLoading: {paddingVertical: 24},
  consultationsEmpty: {paddingHorizontal: 20, paddingVertical: 16, fontSize: 12, color: Colors.t2, textAlign: 'center'},
  consultationsError: {fontSize: 12, color: Colors.red, textAlign: 'center'},
  consultationsRetry: {fontSize: 12, fontWeight: '700', color: Colors.gold, marginTop: 8},
});

function getConsultationIcon(type: ConsultationListItem['type']): string {
  switch (type) {
    case 'chat':
      return '💬';
    case 'call':
      return '📞';
    case 'video':
      return '📹';
  }
}

function formatConsultationDetail(consultation: ConsultationListItem): string {
  const details = [formatConsultationType(consultation.type)];
  if (consultation.durationMinutes > 0) {
    details.push(`${consultation.durationMinutes} mins`);
  }
  if (consultation.totalAmount > 0) {
    details.push(`₹${consultation.totalAmount.toLocaleString('en-IN')}`);
  }
  return details.join(' · ');
}

function formatConsultationType(type: ConsultationListItem['type']): string {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

function formatStatus(status: ConsultationListItem['status']): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function getStatusVariant(
  status: ConsultationListItem['status'],
): 'green' | 'red' | 'blue' | 'gold' {
  switch (status) {
    case 'completed':
      return 'green';
    case 'rejected':
    case 'declined':
    case 'cancelled':
      return 'red';
    case 'active':
    case 'accepted':
      return 'blue';
    default:
      return 'gold';
  }
}
