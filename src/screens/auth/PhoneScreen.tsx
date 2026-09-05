import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Colors} from '../../theme/colors';
import AppHeader from '../../components/common/AppHeader';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import {authService} from '../../services/authService';
import type {AuthScreenProps} from '../../navigation/types';

export default function PhoneScreen({navigation, route}: AuthScreenProps<'Phone'>) {
  const {role} = route.params;
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  async function sendOtp() {
    const cleaned = phone.replace(/\s/g, '');
    if (cleaned.length !== 10) {
      Alert.alert('Invalid Number', 'Please enter a valid 10-digit mobile number.');
      return;
    }
    try {
      setLoading(true);
      // await authService.sendOtp({phone: cleaned, countryCode: '+91', role});
      navigation.navigate('Otp', {phone: cleaned, role});
    } catch {
      Alert.alert('Error', 'Could not send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <AppHeader onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.titleBlock}>
          <Text style={styles.title}>Enter your number 📱</Text>
          <Text style={styles.subtitle}>
            We'll send a one-time password to verify your identity.
          </Text>
        </View>

        <View style={styles.phoneRow}>
          <TouchableOpacity style={styles.cc}>
            <Text style={styles.ccText}>🇮🇳 +91 ▾</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.phoneInp}
            placeholder="98765 43210"
            placeholderTextColor={Colors.t3}
            keyboardType="phone-pad"
            maxLength={10}
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        <Button label="Send OTP" onPress={sendOtp} loading={loading} />

        <Text style={styles.note}>
          By continuing you agree to our Terms & Privacy Policy.{'\n'}Standard SMS rates may
          apply.
        </Text>

        <Card style={styles.secBox}>
          <Text style={styles.secIcon}>🔒</Text>
          <View style={{flex: 1}}>
            <Text style={styles.secTitle}>Secure & Private</Text>
            <Text style={styles.secDesc}>
              Your number is encrypted and never shared with third parties.
            </Text>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: Colors.bg},
  content: {paddingHorizontal: 24, paddingBottom: 40},
  titleBlock: {paddingVertical: 28},
  title: {fontSize: 28, fontWeight: '800', color: Colors.text, letterSpacing: -0.5},
  subtitle: {fontSize: 13, color: Colors.t2, marginTop: 8, lineHeight: 20},
  phoneRow: {flexDirection: 'row', gap: 10, marginBottom: 20},
  cc: {
    backgroundColor: Colors.card,
    borderWidth: 1.5,
    borderColor: Colors.border2,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  ccText: {fontSize: 16, color: Colors.text, fontWeight: '600'},
  phoneInp: {
    flex: 1,
    backgroundColor: Colors.card,
    borderWidth: 1.5,
    borderColor: Colors.border2,
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
  },
  note: {
    fontSize: 11.5,
    color: Colors.t3,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 20,
    lineHeight: 18,
  },
  secBox: {flexDirection: 'row', gap: 10, alignItems: 'flex-start'},
  secIcon: {fontSize: 18},
  secTitle: {fontSize: 12, fontWeight: '700', color: Colors.text, marginBottom: 3},
  secDesc: {fontSize: 11, color: Colors.t2, lineHeight: 17},
});
