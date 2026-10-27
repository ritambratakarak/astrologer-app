import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import ImagePicker, {type Image as PickedImage} from 'react-native-image-crop-picker';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Colors} from '../../theme/colors';
import AppHeader from '../../components/common/AppHeader';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import {customerService} from '../../services/customerService';
import {tokenManager} from '../../security/tokenManager';
import {useAuthStore} from '../../store/authStore';
import type {AuthScreenProps} from '../../navigation/types';

export default function ProfileSetupScreen({navigation}: AuthScreenProps<'ProfileSetup'>) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState<PickedImage | null>(null);
  const [loading, setLoading] = useState(false);
  const {setProfileComplete} = useAuthStore();

  async function chooseAvatar() {
    try {
      const image = await ImagePicker.openPicker({
        mediaType: 'photo',
        cropping: true,
        cropperCircleOverlay: true,
        width: 500,
        height: 500,
        compressImageQuality: 0.8,
      });
      setAvatar(image);
    } catch (error) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'E_PICKER_CANCELLED'
      ) {
        return;
      }
      Alert.alert('Image Selection Failed', 'Could not select the profile image. Please try again.');
    }
  }

  async function submit() {
    if (!name.trim()) {
      Alert.alert('Required', 'Please enter your full name.');
      return;
    }
    try {
      setLoading(true);
      const fullName = name.trim();
      await customerService.updateProfile({
        fullName,
        email: email.trim() || undefined,
      });
      tokenManager.saveUserName(fullName);
      setProfileComplete(true);
    } catch {
      Alert.alert('Error', 'Could not save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <AppHeader
        onBack={() => navigation.goBack()}
        title="Set up Profile"
        rightLabel="Skip"
        onRightPress={() => setProfileComplete(true)}
      />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.titleBlock}>
          <Text style={styles.title}>Almost there! 🎉</Text>
          <Text style={styles.subtitle}>Tell us about yourself. You can always update this later.</Text>
        </View>

        <TouchableOpacity
          style={styles.avPick}
          onPress={chooseAvatar}
          disabled={loading}
          accessibilityRole="button"
          accessibilityLabel="Choose a profile photo">
          {avatar ? (
            <Image source={{uri: avatar.path}} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avIcon}>📷</Text>
          )}
          <View style={styles.avBadge}>
            <Text style={{fontSize: 11}}>✏️</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.avatarHint}>Tap to choose a profile photo</Text>

        <Input
          label="FULL NAME"
          placeholder="Priya Sharma"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />
        <Input
          label="EMAIL (OPTIONAL)"
          placeholder="priya@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <View style={{height: 10}} />
        <Button label="Get Started →" onPress={submit} loading={loading} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: Colors.bg},
  content: {paddingHorizontal: 24, paddingBottom: 60},
  titleBlock: {paddingVertical: 16},
  title: {fontSize: 26, fontWeight: '800', color: Colors.text},
  subtitle: {fontSize: 13, color: Colors.t2, marginTop: 8, lineHeight: 20},
  avPick: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.card,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  avatarImage: {width: 84, height: 84, borderRadius: 42},
  avatarHint: {
    fontSize: 12,
    color: Colors.t2,
    textAlign: 'center',
    marginTop: -16,
    marginBottom: 24,
  },
  avIcon: {fontSize: 32},
  avBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: Colors.gold,
    borderRadius: 11,
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.bg,
  },
});
