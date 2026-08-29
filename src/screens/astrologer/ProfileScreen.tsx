import React, {useState} from 'react';
import {View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet, Alert} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Colors} from '../../theme/colors';
import AppHeader from '../../components/common/AppHeader';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Chip from '../../components/common/Chip';
import Toast from '../../components/common/Toast';
import {astrologerService} from '../../services/astrologerService';
import {useAuthStore} from '../../store/authStore';
import {SPECIALIZATIONS} from '../../constants';
import {useNavigation} from '@react-navigation/native';

export default function AstrologerProfileScreen() {
  const navigation = useNavigation();
  const {logout} = useAuthStore();
  const [name, setName] = useState('Pandit Ramesh Kumar');
  const [bio, setBio] = useState('With 15+ years of deep Vedic astrology experience, I provide precise birth chart readings.');
  const [experience, setExperience] = useState('15');
  const [languages, setLanguages] = useState('Hindi, English, Sanskrit');
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>(['Vedic', 'Kundali', 'Lal Kitab', 'Muhurta']);
  const [chatRate, setChatRate] = useState('20');
  const [callRate, setCallRate] = useState('30');
  const [videoRate, setVideoRate] = useState('40');
  const [loading, setLoading] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  function toggleSpec(s: string) {
    setSelectedSpecs(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  }

  async function save() {
    try {
      setLoading(true);
      await astrologerService.updateSelfProfile({
        name,
        bio,
        experience: Number(experience),
        languages: languages.split(',').map(l => l.trim()),
        specializations: selectedSpecs,
        chatRate: Number(chatRate),
        callRate: Number(callRate),
        videoRate: Number(videoRate),
      });
      setToastVisible(true);
    } catch {
      Alert.alert('Error', 'Could not save profile. Please try again.');
    } finally {
      setLoading(false);
    }
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
            <Chip label="Approved ✓" variant="gold" />
            <Chip label="4.9 ⭐" />
          </View>
        </View>

        <Input label="FULL NAME" value={name} onChangeText={setName} />
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

      <Toast
        message="Profile updated successfully ✓"
        visible={toastVisible}
        onHide={() => setToastVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: Colors.bg},
  content: {paddingHorizontal: 20, paddingBottom: 40},
  avSection: {alignItems: 'center', marginBottom: 20},
  avPick: {width: 88, height: 88, borderRadius: 44, backgroundColor: Colors.card2, borderWidth: 2, borderStyle: 'dashed', borderColor: Colors.border, alignItems: 'center', justifyContent: 'center', marginBottom: 10, position: 'relative'},
  avBadge: {position: 'absolute', bottom: 2, right: 2, backgroundColor: Colors.gold, borderRadius: 11, width: 22, height: 22, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.bg},
  fieldLabel: {fontSize: 11, fontWeight: '600', color: Colors.t2, marginBottom: 8, letterSpacing: 0.3},
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
