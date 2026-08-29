import React from 'react';
import {View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Colors} from '../../theme/colors';
import Chip from '../../components/common/Chip';
import {useAuthStore} from '../../store/authStore';
import type {CustomerStackParamList} from '../../navigation/types';

type Nav = NativeStackNavigationProp<CustomerStackParamList>;

const MENU = [
  {icon: '💰', label: 'Wallet & Payments', sub: '₹250', screen: 'WalletTab'},
  {icon: '📋', label: 'Transaction History', screen: 'Transactions'},
  {icon: '🔔', label: 'Notifications', screen: 'Notifications'},
  {icon: '🔒', label: 'Privacy & Security', screen: null},
  {icon: '❓', label: 'Help & Support', screen: null},
  {icon: '⭐', label: 'Rate the App', screen: null},
];

export default function CustomerProfileScreen() {
  const navigation = useNavigation<Nav>();
  const {logout} = useAuthStore();

  function handleLogout() {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Log Out', style: 'destructive', onPress: () => logout()},
    ]);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Hero */}
        <View style={styles.hero}>
          <View style={styles.avWrap}>
            <View style={styles.av}><Text style={{fontSize: 36}}>👤</Text></View>
            <View style={styles.editBadge}><Text style={{fontSize: 12}}>✏️</Text></View>
          </View>
          <Text style={styles.name}>Priya Sharma</Text>
          <Text style={styles.phone}>+91 98765 43210</Text>
          <View style={styles.chips}>
            <Chip label="✅ Active" variant="green" />
            <Chip label="Customer" variant="gold" />
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statVal}>18</Text>
            <Text style={styles.statLabel}>Sessions</Text>
          </View>
          <View style={[styles.stat, styles.statBorder]}>
            <Text style={[styles.statVal, {color: Colors.gold}]}>₹250</Text>
            <Text style={styles.statLabel}>Balance</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statVal}>4.8</Text>
            <Text style={styles.statLabel}>Avg Rating</Text>
          </View>
        </View>

        {/* Menu */}
        {MENU.map(item => (
          <TouchableOpacity
            key={item.label}
            style={styles.menuItem}
            onPress={() => {
              if (item.screen === 'Transactions') {
                navigation.navigate('Transactions');
              } else if (item.screen === 'Notifications') {
                navigation.navigate('Notifications');
              }
            }}>
            <View style={styles.menuIcon}><Text style={{fontSize: 16}}>{item.icon}</Text></View>
            <Text style={styles.menuLabel}>{item.label}</Text>
            {item.sub && <Text style={styles.menuSub}>{item.sub}</Text>}
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <View style={[styles.menuIcon, {backgroundColor: Colors.redDim}]}>
            <Text style={{fontSize: 16}}>🚪</Text>
          </View>
          <Text style={[styles.menuLabel, {color: Colors.red}]}>Log Out</Text>
          <Text style={[styles.menuArrow, {color: Colors.red}]}>›</Text>
        </TouchableOpacity>

        <View style={{height: 90}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: Colors.bg},
  hero: {padding: 20, alignItems: 'center', backgroundColor: 'rgba(30,18,96,0.4)'},
  avWrap: {position: 'relative', marginBottom: 14},
  av: {width: 90, height: 90, borderRadius: 45, backgroundColor: Colors.card2, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.border},
  editBadge: {position: 'absolute', bottom: 0, right: 0, backgroundColor: Colors.gold, borderRadius: 13, width: 26, height: 26, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.bg},
  name: {fontSize: 22, fontWeight: '800', color: Colors.text},
  phone: {fontSize: 13, color: Colors.t2, marginTop: 4},
  chips: {flexDirection: 'row', gap: 8, marginTop: 8},
  statsRow: {flexDirection: 'row', padding: 14, marginHorizontal: 20, marginBottom: 12, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 16},
  stat: {flex: 1, alignItems: 'center'},
  statBorder: {borderLeftWidth: 1, borderRightWidth: 1, borderColor: Colors.border2},
  statVal: {fontSize: 20, fontWeight: '800', color: Colors.text},
  statLabel: {fontSize: 10, color: Colors.t2},
  menuItem: {flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: Colors.border3},
  menuIcon: {width: 36, height: 36, borderRadius: 12, backgroundColor: Colors.card, alignItems: 'center', justifyContent: 'center'},
  menuLabel: {flex: 1, fontSize: 14, fontWeight: '600', color: Colors.text},
  menuSub: {fontSize: 12, color: Colors.gold, fontWeight: '600', marginRight: 8},
  menuArrow: {fontSize: 14, color: Colors.t3},
});
