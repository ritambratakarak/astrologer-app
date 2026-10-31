import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import ImagePicker, {type Image as PickedImage} from 'react-native-image-crop-picker';
import {Colors} from '../../theme/colors';
import Chip from '../../components/common/Chip';
import {customerService} from '../../services/customerService';
import {useAuthStore} from '../../store/authStore';
import {tokenManager} from '../../security/tokenManager';
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
  const name = tokenManager.getUserName();
  const phone = tokenManager.getUserPhone();
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [photoUploading, setPhotoUploading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      customerService
        .getProfile()
        .then(profile => {
          if (isActive) {
            setAvatarUri(profile.avatar || null);
          }
        })
        .catch(() => {
          if (isActive) {
            Alert.alert('Profile Unavailable', 'Could not load your profile photo. Please try again.');
          }
        });

      return () => {
        isActive = false;
      };
    }, []),
  );

  async function changeProfilePhoto() {
    if (photoUploading) {
      return;
    }
    let image: PickedImage;
    try {
      image = await ImagePicker.openPicker({
        mediaType: 'photo',
        cropping: true,
        cropperCircleOverlay: true,
        width: 500,
        height: 500,
        compressImageQuality: 0.8,
      });
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
      return;
    }

    const previousAvatarUri = avatarUri;
    setAvatarUri(image.path);
    setPhotoUploading(true);
    let uploaded = false;
    try {
      await customerService.uploadProfilePhoto(image);
      uploaded = true;
      const profile = await customerService.getProfile();
      setAvatarUri(profile.avatar || image.path);
    } catch {
      Alert.alert(
        uploaded ? 'Photo Uploaded' : 'Upload Failed',
        uploaded
          ? 'Your photo was uploaded, but the latest profile image could not be loaded.'
          : 'Could not upload the profile photo. Please try again.',
      );
      if (!uploaded) {
        setAvatarUri(previousAvatarUri);
      }
    } finally {
      setPhotoUploading(false);
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
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Hero */}
        <View style={styles.hero}>
          <View style={styles.avWrap}>
            <TouchableOpacity
              style={styles.av}
              onPress={changeProfilePhoto}
              disabled={photoUploading}
              accessibilityRole="button"
              accessibilityLabel={photoUploading ? 'Uploading profile photo' : 'Change profile photo'}>
              {avatarUri ? (
                <Image source={{uri: avatarUri}} style={styles.avatarImage} />
              ) : (
                <Text style={{fontSize: 36}}>👤</Text>
              )}
            </TouchableOpacity>
            <View style={styles.editBadge}><Text style={{fontSize: 12}}>✏️</Text></View>
          </View>
          <Text style={styles.avatarHint}>
            {photoUploading ? 'Uploading photo...' : 'Tap your photo to change it'}
          </Text>
          <Text style={styles.name}>{name || 'Customer'}</Text>
          <Text style={styles.phone}>
            {phone ? (phone.startsWith('+') ? phone : `+91 ${phone}`) : ''}
          </Text>
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
  avatarImage: {width: 86, height: 86, borderRadius: 43},
  editBadge: {position: 'absolute', bottom: 0, right: 0, backgroundColor: Colors.gold, borderRadius: 13, width: 26, height: 26, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.bg},
  avatarHint: {fontSize: 11, color: Colors.t2, marginTop: -8, marginBottom: 8},
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
