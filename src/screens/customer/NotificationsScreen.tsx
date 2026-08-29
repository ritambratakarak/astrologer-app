import React, {useState} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Colors} from '../../theme/colors';
import AppHeader from '../../components/common/AppHeader';

interface Notif {
  id: string;
  icon: string;
  iconBg: string;
  title: string;
  body: string;
  time: string;
  unread: boolean;
}

const INITIAL: Notif[] = [
  {id: '1', icon: '✅', iconBg: Colors.greenDim, title: 'Session Completed', body: 'Your 12-minute chat with Pandit Ramesh has ended. ₹240 deducted.', time: '5 minutes ago', unread: true},
  {id: '2', icon: '💰', iconBg: Colors.blueDim, title: 'Wallet Recharged', body: '₹500 added to your wallet via Razorpay UPI. Balance: ₹750.', time: '2 hours ago', unread: true},
  {id: '3', icon: '⭐', iconBg: Colors.goldDim, title: 'Review Reminder', body: 'How was your session with Meera Joshi? Leave a review!', time: 'Yesterday, 4:00 PM', unread: false},
  {id: '4', icon: '❌', iconBg: Colors.redDim, title: 'Request Declined', body: 'Acharya Suresh declined your consultation request.', time: 'Yesterday, 11:30 AM', unread: false},
  {id: '5', icon: '🎉', iconBg: Colors.purpleDim, title: 'Welcome to AstroApp!', body: 'Your account is set up. Get ₹50 bonus on your first recharge of ₹200+.', time: 'Jul 26, 2026', unread: false},
];

export default function NotificationsScreen({navigation}: {navigation: any}) {
  const [notifs, setNotifs] = useState<Notif[]>(INITIAL);

  function markRead(id: string) {
    setNotifs(prev => prev.map(n => n.id === id ? {...n, unread: false} : n));
  }

  function markAll() {
    setNotifs(prev => prev.map(n => ({...n, unread: false})));
  }

  return (
    <SafeAreaView style={styles.safe}>
      <AppHeader
        title="Notifications"
        onBack={() => navigation.goBack()}
        rightLabel="Mark all read"
        onRightPress={markAll}
      />
      <FlatList
        data={notifs}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TouchableOpacity
            style={[styles.item, item.unread && styles.itemUnread]}
            onPress={() => markRead(item.id)}>
            <View style={[styles.icon, {backgroundColor: item.iconBg}]}>
              <Text style={{fontSize: 18}}>{item.icon}</Text>
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.body}>{item.body}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
            {item.unread && <View style={styles.dot} />}
          </TouchableOpacity>
        )}
        ListFooterComponent={<View style={{height: 90}} />}
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
  title: {fontSize: 13, fontWeight: '700', color: Colors.text},
  body: {fontSize: 12, color: Colors.t2, marginTop: 2, lineHeight: 18},
  time: {fontSize: 10, color: Colors.t3, marginTop: 5},
  dot: {width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.gold, flexShrink: 0, marginTop: 4},
});
