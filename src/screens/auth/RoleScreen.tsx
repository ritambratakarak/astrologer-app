import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Colors} from '../../theme/colors';
import Button from '../../components/common/Button';
import type {AuthScreenProps} from '../../navigation/types';
import type {UserRole} from '../../types/auth';

export default function RoleScreen({navigation}: AuthScreenProps<'Role'>) {
  const [role, setRole] = useState<UserRole>('customer');

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.screen} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Text style={styles.heroIcon}>✨</Text>
          <Text style={styles.heroTitle}>Welcome!</Text>
          <Text style={styles.heroSub}>
            Choose how you'd like to use AstroApp.{'\n'}This cannot be changed later.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.roleCard, role === 'customer' && styles.roleCardSel]}
          onPress={() => setRole('customer')}
          activeOpacity={0.8}>
          <Text style={styles.roleIcon}>⭐</Text>
          <Text style={styles.roleName}>I'm a Customer</Text>
          <Text style={styles.roleDesc}>
            Seek guidance from expert astrologers via chat, call, or video
          </Text>
          <View style={[styles.check, role === 'customer' && styles.checkSel]}>
            {role === 'customer' && <Text style={styles.checkMark}>✓</Text>}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.roleCard, role === 'astrologer' && styles.roleCardSel]}
          onPress={() => setRole('astrologer')}
          activeOpacity={0.8}>
          <Text style={styles.roleIcon}>🔮</Text>
          <Text style={styles.roleName}>I'm an Astrologer</Text>
          <Text style={styles.roleDesc}>
            Share your wisdom and connect with seekers. Earn per minute.
          </Text>
          <View style={[styles.check, role === 'astrologer' && styles.checkSel]}>
            {role === 'astrologer' && <Text style={styles.checkMark}>✓</Text>}
          </View>
        </TouchableOpacity>

        <View style={styles.cta}>
          <Button
            label="Continue →"
            onPress={() => navigation.navigate('Phone', {role})}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: Colors.bg},
  screen: {paddingHorizontal: 20, paddingBottom: 40},
  hero: {textAlign: 'center', paddingVertical: 32, alignItems: 'center'},
  heroIcon: {fontSize: 36, marginBottom: 12},
  heroTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -0.5,
  },
  heroSub: {
    fontSize: 13,
    color: Colors.t2,
    marginTop: 8,
    lineHeight: 20,
    textAlign: 'center',
  },
  roleCard: {
    backgroundColor: Colors.card,
    borderWidth: 2,
    borderColor: Colors.border2,
    borderRadius: 22,
    paddingVertical: 28,
    paddingHorizontal: 20,
    marginBottom: 14,
    alignItems: 'center',
  },
  roleCardSel: {borderColor: Colors.gold, backgroundColor: Colors.goldDim},
  roleIcon: {fontSize: 52, marginBottom: 14},
  roleName: {fontSize: 20, fontWeight: '700', color: Colors.text},
  roleDesc: {
    fontSize: 13,
    color: Colors.t2,
    marginTop: 5,
    lineHeight: 20,
    textAlign: 'center',
  },
  check: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border2,
    marginTop: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkSel: {backgroundColor: Colors.gold, borderColor: Colors.gold},
  checkMark: {fontSize: 12, color: '#1a0a00', fontWeight: '700'},
  cta: {paddingBottom: 24, paddingTop: 8},
});
