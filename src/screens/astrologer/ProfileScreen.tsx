import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Colors} from '../../theme/colors';
import AppHeader from '../../components/common/AppHeader';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Chip from '../../components/common/Chip';
import Toast from 'react-native-root-toast';
import {astrologerService} from '../../services/astrologerService';
import {useAuthStore} from '../../store/authStore';
import {SPECIALIZATIONS} from '../../constants';
import {useNavigation} from '@react-navigation/native';
import type {AstrologerSelfProfile} from '../../types/astrologer';

export default function AstrologerProfileScreen() {
  const navigation = useNavigation();
  const {logout} = useAuthStore();
  const [profile, setProfile] = useState<AstrologerSelfProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState('');
  const [bio, setBio] = useState('');
  const [experience, setExperience] = useState('');
  const [languages, setLanguages] = useState('');
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>([]);
  const [chatRate, setChatRate] = useState('');
  const [callRate, setCallRate] = useState('');
  const [videoRate, setVideoRate] = useState('');
  const [loading, setLoading] = useState(false);

  const loadProfile = useCallback(async () => {
    try {
      setProfileLoading(true);
      setProfileError('');
      const data = await astrologerService.getSelfProfile();
      setProfile(data);
      setBio(data.bio ?? '');
      setExperience(String(data.experience ?? ''));
      setLanguages((data.languages ?? []).join(', '));
      setSelectedSpecs(data.specializations ?? []);
      setChatRate(String(data.chatRate ?? ''));
      setCallRate(String(data.callRate ?? ''));
      setVideoRate(String(data.videoRate ?? ''));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not load profile.';
      console.error('[AstrologerProfile] Failed to load profile', error);
      setProfileError(message);
    } finally {
      setProfileLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  function toggleSpec(s: string) {
    setSelectedSpecs(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  }

  async function save() {
    try {
      setLoading(true);
      await astrologerService.updateSelfProfile({
        bio,
        experience: Number(experience),
        languages: languages.split(',').map(language => language.trim()).filter(Boolean),
        specializations: selectedSpecs.map(specialization =>
          specialization.toLowerCase(),
        ),
        chatRate: Number(chatRate),
        callRate: Number(callRate),
        videoRate: Number(videoRate),
      });
      Toast.show('Profile updated successfully ✓');
    } catch {
      Alert.alert('Error', 'Could not save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (profileLoading) {
    return (
      <SafeAreaView style={[styles.safe, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.gold} />
        <Text style={styles.loadMessage}>Loading profile...</Text>
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView style={[styles.safe, styles.centered]}>
        <Text style={styles.loadMessage}>{profileError || 'Profile is unavailable.'}</Text>
        <Button label="Try Again" onPress={loadProfile} loading={profileLoading} />
      </SafeAreaView>
    );
  }

  function handleLogout() {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Log Out', style: 'destructive', onPress: () => logout()},
    ]);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <AppHeader
        title="Edit Profile"
        onBack={() => (navigation as any).navigate('AstrologerTabs')}
        rightLabel="Save"
        onRightPress={save}
      />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Avatar */}
        <View style={styles.avSection}>
          <TouchableOpacity style={styles.avPick}>
            <Text style={{fontSize: 32}}>🧙</Text>
            <View style={styles.avBadge}><Text style={{fontSize: 11}}>✏️</Text></View>
          </TouchableOpacity>
          <View style={{flexDirection: 'row', gap: 6}}>
            <Chip
              label={profile.status}
              variant={
                profile.status === 'success'
                  ? 'green'
                  : profile.status === 'rejected'
                    ? 'red'
                    : 'gold'
              }
            />
            <Chip label={`${profile.rating} ⭐`} />
          </View>
        </View>

        <View style={{marginBottom: 16}}>
          <Text style={styles.fieldLabel}>BIO</Text>
          <TextInput
            style={styles.textarea}
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            placeholderTextColor={Colors.t3}
          />
        </View>
        <Input label="YEARS OF EXPERIENCE" value={experience} onChangeText={setExperience} keyboardType="numeric" />
        <Input label="LANGUAGES SPOKEN" value={languages} onChangeText={setLanguages} />

        <Text style={styles.fieldLabel}>PERSONAL & REGISTRATION DETAILS</Text>
        <View style={styles.detailsCard}>
          {[
            {label: 'Display name', value: profile.displayName},
            {label: 'Degree', value: profile.degree},
            {label: 'Secondary contact', value: profile.secondaryContact},
            {label: 'Date of birth', value: profile.dob},
            {label: 'Gender', value: profile.gender},
            {
              label: 'Address',
              value: [
                profile.address?.city,
                profile.address?.state,
                profile.address?.pincode,
                profile.address?.country,
              ].filter(Boolean).join(', '),
            },
            {label: 'KYC status', value: profile.isKycSubmitted ? 'Submitted' : 'Not submitted'},
            {label: 'Reviews', value: String(profile.totalReviews)},
            {label: 'Consultations', value: String(profile.totalConsultations)},
            {label: 'Certificates', value: String(profile.certificates?.length ?? 0)},
            {label: 'Documents', value: String(profile.documents?.length ?? 0)},
            {label: 'PAN', value: profile.panCard?.number ? `••••••${profile.panCard.number.slice(-4)}` : '—'},
            {label: 'Aadhaar', value: profile.aadharCard?.number ? `••••••••${profile.aadharCard.number.slice(-4)}` : '—'},
            {label: 'Bank', value: profile.bankDetails?.bankName || '—'},
            {label: 'Account holder', value: profile.bankDetails?.accountHolderName || '—'},
            {label: 'Account number', value: profile.bankDetails?.accountNumber ? `••••${profile.bankDetails.accountNumber.slice(-4)}` : '—'},
            {label: 'IFSC', value: profile.bankDetails?.ifscCode || '—'},
          ].map(item => (
            <View key={item.label} style={styles.detailRow}>
              <Text style={styles.detailLabel}>{item.label}</Text>
              <Text style={styles.detailValue}>{item.value || '—'}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.fieldLabel}>SPECIALIZATIONS</Text>
        <View style={styles.specGrid}>
          {SPECIALIZATIONS.map(s => (
            <TouchableOpacity
              key={s}
              style={[styles.specChip, selectedSpecs.includes(s) && styles.specChipOn]}
              onPress={() => toggleSpec(s)}>
              <Text style={[styles.specText, selectedSpecs.includes(s) && styles.specTextOn]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.fieldLabel}>CONSULTATION RATES</Text>
        {[
          {icon: '💬', label: '₹/min Chat', val: chatRate, setter: setChatRate},
          {icon: '📞', label: '₹/min Call', val: callRate, setter: setCallRate},
          {icon: '📹', label: '₹/min Video', val: videoRate, setter: setVideoRate},
        ].map(r => (
          <View key={r.label} style={styles.rateRow}>
            <Text style={{fontSize: 18}}>{r.icon}</Text>
            <TextInput
              style={styles.rateInput}
              value={r.val}
              onChangeText={r.setter}
              keyboardType="numeric"
              placeholderTextColor={Colors.t3}
            />
            <Text style={styles.rateLabel}>{r.label}</Text>
          </View>
        ))}

        <Button label="Save Changes" onPress={save} loading={loading} style={{marginTop: 8}} />
        <View style={{height: 12}} />

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>🚪 Log Out</Text>
        </TouchableOpacity>

        <View style={{height: 40}} />
      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: Colors.bg},
  centered: {alignItems: 'center', justifyContent: 'center', padding: 24},
  loadMessage: {fontSize: 14, color: Colors.t2, marginVertical: 16, textAlign: 'center'},
  content: {paddingHorizontal: 20, paddingBottom: 40},
  avSection: {alignItems: 'center', marginBottom: 20},
  avPick: {width: 88, height: 88, borderRadius: 44, backgroundColor: Colors.card2, borderWidth: 2, borderStyle: 'dashed', borderColor: Colors.border, alignItems: 'center', justifyContent: 'center', marginBottom: 10, position: 'relative'},
  avBadge: {position: 'absolute', bottom: 2, right: 2, backgroundColor: Colors.gold, borderRadius: 11, width: 22, height: 22, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.bg},
  fieldLabel: {fontSize: 11, fontWeight: '600', color: Colors.t2, marginBottom: 8, letterSpacing: 0.3},
  detailsCard: {backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border2, borderRadius: 14, paddingHorizontal: 14, marginBottom: 18},
  detailRow: {flexDirection: 'row', justifyContent: 'space-between', gap: 16, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: Colors.border3},
  detailLabel: {fontSize: 12, color: Colors.t2, flex: 1},
  detailValue: {fontSize: 12, fontWeight: '600', color: Colors.text, flex: 1.4, textAlign: 'right'},
  textarea: {backgroundColor: Colors.card, borderWidth: 1.5, borderColor: Colors.border2, borderRadius: 10, padding: 14, fontSize: 16, color: Colors.text, minHeight: 80, marginBottom: 16},
  specGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16},
  specChip: {paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, backgroundColor: Colors.card, borderWidth: 1.5, borderColor: Colors.border2},
  specChipOn: {backgroundColor: Colors.goldDim, borderColor: Colors.gold},
  specText: {fontSize: 11, fontWeight: '600', color: Colors.t2},
  specTextOn: {color: Colors.gold},
  rateRow: {flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12},
  rateInput: {flex: 1, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border2, borderRadius: 10, padding: 10, paddingHorizontal: 12, fontSize: 15, color: Colors.text},
  rateLabel: {fontSize: 12, color: Colors.t2},
  logoutBtn: {backgroundColor: Colors.redDim, borderWidth: 1.5, borderColor: Colors.red, borderRadius: 16, paddingVertical: 15, alignItems: 'center'},
  logoutText: {fontSize: 15, fontWeight: '700', color: Colors.red},
});
