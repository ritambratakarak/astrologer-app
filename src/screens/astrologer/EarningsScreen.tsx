import React, {useState} from 'react';
import {View, Text, ScrollView, TouchableOpacity, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Colors} from '../../theme/colors';
import AppHeader from '../../components/common/AppHeader';
import {useNavigation} from '@react-navigation/native';

const PERIODS = ['Today', 'Week', 'Month', 'All Time'];

const BAR_DATA = [
  {day: 'Mon', pct: 60},
  {day: 'Tue', pct: 80},
  {day: 'Wed', pct: 45},
  {day: 'Thu', pct: 90},
  {day: 'Fri', pct: 70},
  {day: 'Sat', pct: 55},
  {day: 'Sun', pct: 100},
];

const RECENT_EARNINGS = [
  {icon: '💬', title: 'Chat — Priya Sharma', date: 'Today, 10:30 AM · 12 min', amount: '+₹240'},
  {icon: '📞', title: 'Call — Rahul Mehta', date: 'Today, 8:00 AM · 20 min', amount: '+₹600'},
  {icon: '💬', title: 'Chat — Anjali Gupta', date: 'Yesterday, 5:30 PM · 8 min', amount: '+₹160'},
  {icon: '📹', title: 'Video — Sunita Patel', date: 'Yesterday, 2:00 PM · 25 min', amount: '+₹1,000'},
  {icon: '📞', title: 'Call — Vikram Singh', date: 'Jul 27, 2026 · 30 min', amount: '+₹900'},
];

export default function EarningsScreen() {
  const navigation = useNavigation();
  const [period, setPeriod] = useState('Today');

  return (
    <SafeAreaView style={styles.safe}>
      <AppHeader title="My Earnings" onBack={() => (navigation as any).navigate('AstrologerTabs')} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroLabel}>TOTAL EARNED (ALL TIME)</Text>
          <Text style={styles.heroAmount}>₹52,400</Text>
          <Text style={styles.heroSub}>320 sessions · Avg ₹163/session</Text>
        </View>

        {/* Period tabs */}
        <View style={styles.periodTabs}>
          {PERIODS.map(p => (
            <TouchableOpacity
              key={p}
              style={[styles.periodTab, period === p && styles.periodTabActive]}
              onPress={() => setPeriod(p)}>
              <Text style={[styles.periodText, period === p && styles.periodTextActive]}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bar chart */}
        <View style={styles.chart}>
          {BAR_DATA.map(b => (
            <View key={b.day} style={styles.barWrap}>
              <View style={[styles.bar, {height: `${b.pct}%`}]} />
              <Text style={styles.barLabel}>{b.day}</Text>
            </View>
          ))}
        </View>

        {/* Stats grid */}
        <View style={styles.statGrid}>
          {[
            {label: 'TODAY', val: '₹840', sub: '4 sessions', color: Colors.gold},
            {label: 'THIS WEEK', val: '₹4,200', sub: '21 sessions'},
            {label: 'THIS MONTH', val: '₹12,400', sub: '58 sessions'},
            {label: 'WALLET BALANCE', val: '₹3,640', sub: 'Available', valSize: 20},
          ].map(s => (
            <View key={s.label} style={styles.statCard}>
              <Text style={styles.statLabel}>{s.label}</Text>
              <Text style={[styles.statVal, {fontSize: s.valSize ?? 22, color: s.color ?? Colors.text}]}>{s.val}</Text>
              <Text style={styles.statSub}>{s.sub}</Text>
            </View>
          ))}
        </View>

        {/* Recent earnings */}
        <View style={styles.secHdr}><Text style={styles.secTitle}>Recent Earnings</Text></View>
        {RECENT_EARNINGS.map((tx, i) => (
          <View key={i} style={styles.txItem}>
            <View style={styles.txIcon}><Text style={{fontSize: 16}}>{tx.icon}</Text></View>
            <View style={styles.txInfo}>
              <Text style={styles.txTitle}>{tx.title}</Text>
              <Text style={styles.txDate}>{tx.date}</Text>
            </View>
            <Text style={styles.txAmount}>{tx.amount}</Text>
          </View>
        ))}

        <View style={{height: 90}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: Colors.bg},
  hero: {margin: 20, marginBottom: 16, borderRadius: 22, backgroundColor: '#1a1260', padding: 24, borderWidth: 1, borderColor: 'rgba(96,165,250,0.2)', alignItems: 'center'},
  heroLabel: {fontSize: 11, color: 'rgba(255,255,255,0.45)', marginBottom: 4},
  heroAmount: {fontSize: 38, fontWeight: '800', color: Colors.text, letterSpacing: -1},
  heroSub: {fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4},
  periodTabs: {flexDirection: 'row', backgroundColor: Colors.card, borderRadius: 12, padding: 4, marginHorizontal: 20, marginBottom: 20},
  periodTab: {flex: 1, paddingVertical: 8, borderRadius: 9, alignItems: 'center'},
  periodTabActive: {backgroundColor: Colors.card2},
  periodText: {fontSize: 12, fontWeight: '600', color: Colors.t2},
  periodTextActive: {color: Colors.gold},
  chart: {marginHorizontal: 20, marginBottom: 20, height: 110, backgroundColor: Colors.card, borderRadius: 14, borderWidth: 1, borderColor: Colors.border2, flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 12, paddingBottom: 10, paddingTop: 16, gap: 6, overflow: 'hidden'},
  barWrap: {flex: 1, alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end'},
  bar: {width: '100%', backgroundColor: Colors.gold, borderRadius: 4, opacity: 0.8},
  barLabel: {fontSize: 8, color: Colors.t3, fontWeight: '600'},
  statGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingHorizontal: 20, marginBottom: 20},
  statCard: {width: '47%', backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border2, borderRadius: 14, padding: 14},
  statLabel: {fontSize: 10, color: Colors.t2, fontWeight: '600', textTransform: 'uppercase'},
  statVal: {fontWeight: '800', marginTop: 4},
  statSub: {fontSize: 11, color: Colors.t3, marginTop: 2},
  secHdr: {paddingHorizontal: 20, marginBottom: 8},
  secTitle: {fontSize: 16, fontWeight: '700', color: Colors.text},
  txItem: {flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: Colors.border3},
  txIcon: {width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.greenDim, alignItems: 'center', justifyContent: 'center'},
  txInfo: {flex: 1},
  txTitle: {fontSize: 13, fontWeight: '600', color: Colors.text},
  txDate: {fontSize: 11, color: Colors.t3, marginTop: 2},
  txAmount: {fontSize: 15, fontWeight: '700', color: Colors.green},
});
