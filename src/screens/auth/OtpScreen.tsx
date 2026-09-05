import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Colors} from '../../theme/colors';
import AppHeader from '../../components/common/AppHeader';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import {authService} from '../../services/authService';
import {useAuthStore} from '../../store/authStore';
import type {AuthScreenProps} from '../../navigation/types';

const OTP_LENGTH = 6;

export default function OtpScreen({navigation, route}: AuthScreenProps<'Otp'>) {
  const {phone, role} = route.params;
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const {setAuth} = useAuthStore();

  useEffect(() => {
    if (timer <= 0) {
      return;
    }
    const iv = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(iv);
  }, [timer]);

  function handleChange(value: string, index: number) {
    if (!/^\d?$/.test(value)) {
      return;
    }
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyPress(
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ) {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  // async function verify() {
  //   const code = otp.join('');
  //   if (code.length < OTP_LENGTH) {
  //     Alert.alert('Incomplete', 'Please enter all 6 digits.');
  //     return;
  //   }
  //   try {
  //     setLoading(true);
  //     const res = await authService.verifyOtp({phone, otp: code, role});
  //     setAuth(res.tokens, res.user.role, res.user.id, res.user.isProfileComplete);
  //     if (role === 'astrologer') {
  //       navigation.navigate('AstrologerRegister');
  //     } else {
  //       navigation.navigate('ProfileSetup');
  //     }
  //   } catch {
  //     Alert.alert('Invalid OTP', 'The OTP entered is incorrect or expired.');
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  async function verify() {
  const code = otp.join('');

  if (code.length < OTP_LENGTH) {
    Alert.alert('Incomplete', 'Please enter all 6 digits.');
    return;
  }

  if (code !== '123456') {
    Alert.alert('Invalid OTP', 'Use OTP 123456 for testing.');
    return;
  }

  try {
    setLoading(true);

    setAuth(
      {
        accessToken: 'static-access-token',
        refreshToken: 'static-refresh-token',
      },
      role,
      `static-${phone}`,
      false,
    );

    if (role === 'astrologer') {
      navigation.navigate('AstrologerRegister');
    } else {
      navigation.navigate('ProfileSetup');
    }
  } finally {
    setLoading(false);
  }
}

  async function resend() {
    try {
      await authService.sendOtp({phone, countryCode: '+91', role});
      setTimer(60);
      setOtp(Array(OTP_LENGTH).fill(''));
    } catch {
      Alert.alert('Error', 'Could not resend OTP.');
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <AppHeader onBack={() => navigation.goBack()} />
      <View style={styles.content}>
        <Text style={styles.title}>Verify your number ✉️</Text>
        <Text style={styles.subtitle}>
          Enter the 6-digit OTP sent to{'\n'}
          <Text style={styles.phone}>+91 {phone}</Text>
        </Text>

        <View style={styles.otpRow}>
          {otp.map((digit, i) => (
            <TextInput
              key={i}
              ref={el => {
                inputRefs.current[i] = el;
              }}
              style={[
                styles.box,
                digit ? styles.boxFill : undefined,
                i === otp.findIndex(d => !d) ? styles.boxCur : undefined,
              ]}
              maxLength={1}
              keyboardType="number-pad"
              value={digit}
              onChangeText={v => handleChange(v, i)}
              onKeyPress={e => handleKeyPress(e, i)}
              selectTextOnFocus
            />
          ))}
        </View>

        {timer > 0 ? (
          <Text style={styles.timerText}>
            Resend OTP in{' '}
            <Text style={styles.timerNum}>
              00:{String(timer).padStart(2, '0')}
            </Text>
          </Text>
        ) : (
          <TouchableOpacity onPress={resend}>
            <Text style={styles.resend}>Resend OTP</Text>
          </TouchableOpacity>
        )}

        <Button label="Verify & Continue →" onPress={verify} loading={loading} style={styles.cta} />

        <Card variant="small" style={styles.hintCard}>
          <Text style={styles.hintIcon}>💡</Text>
          <View style={{flex: 1}}>
            <Text style={styles.hintTitle}>Didn't receive it?</Text>
            <Text style={styles.hintBody}>
              Check your SMS inbox. OTP expires in 5 minutes. Make sure your phone has signal.
            </Text>
          </View>
        </Card>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: Colors.bg},
  content: {paddingHorizontal: 24, paddingTop: 8, paddingBottom: 40},
  title: {fontSize: 26, fontWeight: '800', color: Colors.text},
  subtitle: {fontSize: 13, color: Colors.t2, marginTop: 8, lineHeight: 20},
  phone: {fontWeight: '700', color: Colors.text},
  otpRow: {flexDirection: 'row', justifyContent: 'center', gap: 10, marginVertical: 28},
  box: {
    width: 46,
    height: 58,
    backgroundColor: Colors.card,
    borderWidth: 2,
    borderColor: Colors.border2,
    borderRadius: 14,
    fontSize: 26,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
  },
  boxFill: {borderColor: Colors.gold, backgroundColor: Colors.goldDim},
  boxCur: {
    borderColor: Colors.gold,
    shadowColor: Colors.gold,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  timerText: {textAlign: 'center', fontSize: 13, color: Colors.t2, marginBottom: 6},
  timerNum: {color: Colors.gold, fontWeight: '700'},
  resend: {
    textAlign: 'center',
    fontSize: 13,
    color: Colors.gold,
    fontWeight: '600',
    marginBottom: 24,
  },
  cta: {marginTop: 24, marginBottom: 16},
  hintCard: {flexDirection: 'row', gap: 10, alignItems: 'flex-start'},
  hintIcon: {fontSize: 16},
  hintTitle: {fontSize: 12, fontWeight: '700', color: Colors.text, marginBottom: 3},
  hintBody: {fontSize: 11, color: Colors.t2, lineHeight: 17},
});
