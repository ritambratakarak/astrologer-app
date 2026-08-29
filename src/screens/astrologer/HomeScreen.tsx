import React, {useState} from 'react';
import {View, Text, ScrollView, TouchableOpacity, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Colors} from '../../theme/colors';
import Toggle from '../../components/common/Toggle';
import Chip from '../../components/common/Chip';
import Button from '../../components/common/Button';
import type {AstrologerStackParamList} from '../../navigation/types';

type Nav = NativeStackNavigationProp<AstrologerStackParamList>;

const RECENT_SESSIONS = [
  {customer: 'Priya Sharma', detail: 'Chat · 12 mins · ₹240'},
  {customer: 'Rahul Mehta', detail: 'Call · 20 mins · ₹600'},
];

export default function AstrologerHomeScreen() {
  const navigation = useNavigation<Nav>();
  const [isOnline, setIsOnline] = useState(true);
  const [chatOn, setChatOn] = useState(true);
  const [callOn, setCallOn] = useState(false);
  const [videoOn, setVideoOn] = useState(false);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.hdr}>
          <View style={{flex: 1}}>
            <Text style={styles.greeting}>Good Morning, Ramesh 🔮</Text>
            <Text style={styles.greetingSub}>Ready to guide seekers today?</Text>
          </View>
          <TouchableOpacity
            style={styles.notifBtn}
            onPress={() => navigation.navigate('AstrologerNotifications')}>
            <Text style={{fontSize: 18}}>🔔</Text>
            <View style={styles.notifBadge} />
          </TouchableOpacity>
        </View>

        {/* Availability toggle */}
        <View style={styles.availRow}>
          <View style={{flex: 1}}>
            <Text style={styles.availLabel}>
              {isOnline ? 'Online — accepting requests' : 'Offline — not available'}
            </Text>
            <Text style={styles.availSub}>Toggle to go offline</Text>
          </View>
          <Toggle value={isOnline} onToggle={() => setIsOnline(v => !v)} />
        </View>

        {/* Stats */}
        <View style={styles.secHdr}><Text style={styles.secTitle}>Today's Overview</Text></View>
        <View style={styles.statGrid}>
          {[
            {label: "TODAY'S EARNINGS", val: '₹840', sub: '4 sessions', color: Colors.gold},
            {label: 'THIS MONTH', val: '₹12,400', sub: '58 sessions'},
            {label: 'RATING', val: '4.9 ⭐', sub: '124 reviews'},
            {label: 'WALLET BALANCE', val: '₹3,640', sub: 'Available', valSize: 20},
          ].map(s => (
            <View key={s.label} style={styles.statCard}>
              <Text style={styles.statLabel}>{s.label}</Text>
              <Text style={[styles.statVal, {fontSize: s.valSize ?? 26, color: s.color ?? Colors.text}]}>
                {s.val}
              </Text>
              <Text style={styles.statSub}>{s.sub}</Text>
            </View>
          ))}
        </View>

        {/* Availability types */}
        <View style={styles.secHdr}><Text style={styles.secTitle}>Availability</Text></View>
        <View style={styles.availCard}>
          {[
            {icon: '💬', type: 'Chat', rate: '₹20/min', val: chatOn, setter: setChatOn},
            {icon: '📞', type: 'Voice Call', rate: '₹30/min', val: callOn, setter: setCallOn},
            {icon: '📹', type: 'Video Call', rate: '₹40/min', val: videoOn, setter: setVideoOn},
          ].map((item, i) => (
            <View key={item.type} style={[styles.availItem, i < 2 && styles.availItemBorder]}>
              <View style={styles.availLeft}>
                <Text style={{fontSize: 18}}>{item.icon}</Text>
                <View>
                  <Text style={styles.availType}>{item.type}</Text>
                  <Text style={styles.availRate}>{item.rate}</Text>
                </View>
              </View>
              <Toggle value={item.val} onToggle={() => item.setter(v => !v)} />
            </View>
          ))}
        </View>

        {/* Recent sessions */}
        <View style={styles.secHdr}>
          <Text style={styles.secTitle}>Recent Sessions</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        {RECENT_SESSIONS.map((s, i) => (
          <View key={i} style={styles.recentItem}>
            <View style={styles.recentAv}><Text style={{fontSize: 16}}>👤</Text></View>
            <View style={{flex: 1}}>
              <Text style={styles.recentName}>{s.customer}</Text>
              <Text style={styles.recentDetail}>{s.detail}</Text>
            </View>
            <Chip label="Completed" variant="green" />
          </View>
        ))}

        {/* Simulate incoming */}
        <View style={{padding: 20}}>
          <Button
            label="🔔 Simulate Incoming Request"
            onPress={() =>
              navigation.navigate('Incoming', {
                consultationId: 'demo-1',
                customerName: 'Priya Sharma',
                customerSessions: 18,
                type: 'chat',
                ratePerMinute: 20,
                question: 'I want to know about my career prospects for the next 6 months.',
              })
            }
          />
        </View>

        <View style={{height: 90}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: Colors.bg},
  hdr: {flexDirection: 'row', alignItems: 'center', padding: 20, paddingBottom: 14, backgroundColor: 'rgba(30,18,96,0.6)'},
  greeting: {fontSize: 22, fontWeight: '800', color: Colors.text, letterSpacing: -0.3},
  greetingSub: {fontSize: 13, color: Colors.t2, marginTop: 3},
  notifBtn: {width: 40, height: 40, borderRadius: 14, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border2, alignItems: 'center', justifyContent: 'center', position: 'relative'},
  notifBadge: {position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.red, borderWidth: 1.5, borderColor: Colors.bg},
  availRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border2, borderRadius: 16, padding: 14, paddingHorizontal: 16, marginHorizontal: 20, marginTop: 16, marginBottom: 16},
  availLabel: {fontSize: 14, fontWeight: '700', color: Colors.text},
  availSub: {fontSize: 11, color: Colors.t2, marginTop: 2},
  secHdr: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 8},
  secTitle: {fontSize: 16, fontWeight: '700', color: Colors.text},
  seeAll: {fontSize: 12, color: Colors.gold, fontWeight: '600'},
  statGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingHorizontal: 20, marginBottom: 20},
  statCard: {width: '47%', backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border2, borderRadius: 14, padding: 14},
  statLabel: {fontSize: 10, color: Colors.t2, fontWeight: '600', letterSpacing: 0.3, textTransform: 'uppercase'},
  statVal: {fontWeight: '800', marginTop: 4},
  statSub: {fontSize: 11, color: Colors.t3, marginTop: 2},
  availCard: {backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border2, borderRadius: 16, marginHorizontal: 20, marginBottom: 20, overflow: 'hidden'},
  availItem: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16},
  availItemBorder: {borderBottomWidth: 1, borderBottomColor: Colors.border3},
  availLeft: {flexDirection: 'row', alignItems: 'center', gap: 8},
  availType: {fontSize: 13, fontWeight: '600', color: Colors.text},
  availRate: {fontSize: 10, color: Colors.t2},
  recentItem: {flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border2, borderRadius: 14, padding: 12, marginHorizontal: 20, marginBottom: 12},
  recentAv: {width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.card2, alignItems: 'center', justifyContent: 'center'},
  recentName: {fontSize: 13, fontWeight: '700', color: Colors.text},
  recentDetail: {fontSize: 11, color: Colors.t2, marginTop: 2},
});
