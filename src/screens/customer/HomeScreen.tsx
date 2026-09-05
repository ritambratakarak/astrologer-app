import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Colors} from '../../theme/colors';
import Chip from '../../components/common/Chip';
import type {CustomerStackParamList} from '../../navigation/types';

type Nav = NativeStackNavigationProp<CustomerStackParamList>;

const TOP_ASTROLOGERS = [
  {id: '1', name: 'Pandit Ramesh', spec: 'Vedic · Kundali', rate: '₹20/min chat', emoji: '🧙', online: true, stars: '★★★★★'},
  {id: '2', name: 'Meera Joshi', spec: 'Tarot · Numerology', rate: '₹15/min chat', emoji: '🌙', online: true, stars: '★★★★☆'},
  {id: '3', name: 'Acharya Suresh', spec: 'Vastu · Palmistry', rate: '₹25/min call', emoji: '⭐', online: false, stars: '★★★★★'},
  {id: '4', name: 'Divya Nair', spec: 'Lal Kitab · Prashna', rate: '₹18/min chat', emoji: '🌟', online: true, stars: '★★★★☆'},
];

const RECENT = [
  {astrologer: 'Pandit Ramesh', emoji: '🧙', detail: 'Chat · 24 mins · ₹480'},
  {astrologer: 'Meera Joshi', emoji: '🌙', detail: 'Call · 15 mins · ₹225'},
];

export default function CustomerHomeScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.homeHdr}>
          <View style={{flex: 1}}>
            <Text style={styles.greeting}>Good Morning, Priya ☀️</Text>
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
            <Text style={styles.wbAmount}>₹250<Text style={styles.wbDecimal}>.00</Text></Text>
            <Text style={styles.wbSub}>Tap to manage ›</Text>
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
          {TOP_ASTROLOGERS.map(a => (
            <TouchableOpacity
              key={a.id}
              style={styles.astroCard}
              onPress={() => navigation.navigate('AstrologerDetail', {astrologerId: a.id})}>
              <View style={styles.acAv}>
                <Text style={{fontSize: 32}}>{a.emoji}</Text>
              </View>
              <Text style={styles.acName}>{a.name}</Text>
              <Text style={styles.acSpec}>{a.spec}</Text>
              <View style={styles.acRow}>
                <Text style={styles.stars}>{a.stars}</Text>
                <View style={[styles.dot, {backgroundColor: a.online ? Colors.green : Colors.t2}]} />
              </View>
              <Text style={styles.acRate}>{a.rate}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Recent Consultations */}
        <View style={styles.sectionHdr}>
          <Text style={styles.secTitle}>Recent Consultations</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
            <Text style={styles.seeAll}>History</Text>
          </TouchableOpacity>
        </View>
        {RECENT.map((r, i) => (
          <TouchableOpacity
            key={i}
            style={styles.recentItem}
            onPress={() => navigation.navigate('SessionEnded', {
              durationMinutes: 24,
              amountCharged: 480,
              astrologerName: r.astrologer,
              balanceLeft: 10,
              consultationId: `demo-${i}`,
            })}>
            <View style={styles.recentAv}>
              <Text style={{fontSize: 16}}>{r.emoji}</Text>
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.recentName}>{r.astrologer}</Text>
              <Text style={styles.recentDetail}>{r.detail}</Text>
            </View>
            <Chip label="Completed" variant="green" />
          </TouchableOpacity>
        ))}

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
  rechargeBtn: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
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
});
