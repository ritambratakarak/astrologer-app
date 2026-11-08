import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Colors} from '../../theme/colors';
import AppHeader from '../../components/common/AppHeader';
import Chip from '../../components/common/Chip';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import type {CustomerScreenProps} from '../../navigation/types';
import type {ConsultationType} from '../../types/consultation';
import {astrologerService} from '../../services/astrologerService';
import type {AstrologerDetail} from '../../types/astrologer';
import {walletService} from '../../services/walletService';

const RATE_OPTIONS: {
  type: ConsultationType;
  icon: string;
  label: string;
  rateKey: 'chatRate' | 'callRate' | 'videoRate';
  availableKey:
    | 'isAvailableForChat'
    | 'isAvailableForCall'
    | 'isAvailableForVideo';
}[] = [
  {
    type: 'chat',
    icon: '💬',
    label: 'CHAT',
    rateKey: 'chatRate',
    availableKey: 'isAvailableForChat',
  },
  {
    type: 'call',
    icon: '📞',
    label: 'CALL',
    rateKey: 'callRate',
    availableKey: 'isAvailableForCall',
  },
  {
    type: 'video',
    icon: '📹',
    label: 'VIDEO',
    rateKey: 'videoRate',
    availableKey: 'isAvailableForVideo',
  },
];

function getSpecializationLabel(specialization: string): string {
  return specialization
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function AstrologerDetailScreen({navigation, route}: CustomerScreenProps<'AstrologerDetail'>) {
  const [selectedType, setSelectedType] = useState<ConsultationType>('chat');
  const [astrologer, setAstrologer] = useState<AstrologerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryVersion, setRetryVersion] = useState(0);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [walletRetryVersion, setWalletRetryVersion] = useState(0);

  useEffect(() => {
    let isActive = true;
    setLoading(true);
    setError(null);
    astrologerService
      .getAstrologer(route.params.astrologerUserId)
      .then(profile => {
        if (isActive) {
          setAstrologer(profile);
          const firstAvailable = RATE_OPTIONS.find(option => profile[option.availableKey]);
          if (firstAvailable) {
            setSelectedType(firstAvailable.type);
          }
        }
      })
      .catch(loadError => {
        if (isActive) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Could not load astrologer details.',
          );
        }
      })
      .finally(() => {
        if (isActive) {
          setLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [retryVersion, route.params.astrologerUserId]);

  useEffect(() => {
    let isActive = true;
    setWalletError(null);
    walletService
      .getBalance()
      .then(wallet => {
        if (isActive) {
          setWalletBalance(wallet.balance);
        }
      })
      .catch(loadError => {
        if (isActive) {
          setWalletError(
            loadError instanceof Error
              ? loadError.message
              : 'Could not load wallet balance.',
          );
        }
      });

    return () => {
      isActive = false;
    };
  }, [walletRetryVersion]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <AppHeader onBack={() => navigation.goBack()} />
        <View style={styles.state}>
          <ActivityIndicator color={Colors.gold} />
          <Text style={styles.stateText}>Loading astrologer details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !astrologer) {
    return (
      <SafeAreaView style={styles.safe}>
        <AppHeader onBack={() => navigation.goBack()} />
        <View style={styles.state}>
          <Text style={styles.errorText}>
            {error ?? 'Could not load astrologer details.'}
          </Text>
          <Button
            label="Retry"
            small
            onPress={() => setRetryVersion(version => version + 1)}
          />
        </View>
      </SafeAreaView>
    );
  }

  const name = astrologer.userId.fullName;
  const specializations = astrologer.specializations
    .map(getSpecializationLabel)
    .join(' · ');
  const ratePerMin = astrologer[selectedType === 'chat' ? 'chatRate' : selectedType === 'call' ? 'callRate' : 'videoRate'];
  const selectedAvailabilityKey = RATE_OPTIONS.find(
    option => option.type === selectedType,
  )?.availableKey;
  const selectedAvailable = selectedAvailabilityKey
    ? astrologer[selectedAvailabilityKey]
    : false;
  const minsAvailable =
    walletBalance === null ? 0 : Math.floor(walletBalance / ratePerMin);
  const hasEnoughBalance =
    walletBalance !== null && walletBalance >= ratePerMin;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <AppHeader onBack={() => navigation.goBack()} />

        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroAv}>
            <Text style={{fontSize: 36}}>{name.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={styles.heroName}>{name}</Text>
          <Text style={styles.heroSpec}>{specializations}</Text>
          <View style={styles.heroChips}>
            <Chip
              label={astrologer.userId.isOnline ? 'Online' : 'Offline'}
              variant={astrologer.userId.isOnline ? 'green' : 'blue'}
            />
            <Chip label={`⭐ ${astrologer.rating.toFixed(1)} Rating`} variant="gold" />
            <Chip label={`${astrologer.experience} yrs exp`} />
          </View>
          <View style={styles.stats}>
            {[
              {val: astrologer.totalReviews, label: 'Reviews'},
              {val: astrologer.totalConsultations, label: 'Sessions'},
            ].map(s => (
              <View key={s.label} style={styles.statItem}>
                <Text style={styles.statVal}>{s.val}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Rates */}
        <View style={styles.sectionHdr}><Text style={styles.secTitle}>Consultation Rates</Text></View>
        <View style={styles.rateGrid}>
          {RATE_OPTIONS.map(r => (
            <TouchableOpacity
              key={r.type}
              disabled={!astrologer[r.availableKey]}
              style={[
                styles.rateItem,
                selectedType === r.type && styles.rateItemSel,
                !astrologer[r.availableKey] && styles.rateItemDisabled,
              ]}
              onPress={() => setSelectedType(r.type)}>
              <Text style={styles.rateIcon}>{r.icon}</Text>
              <Text style={styles.rateType}>{r.label}</Text>
              <Text style={styles.rateVal}>₹{astrologer[r.rateKey]}/min</Text>
              <Text style={styles.rateAvailability}>
                {astrologer[r.availableKey] ? 'Available' : 'Unavailable'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Languages & Specializations */}
        <View style={{paddingHorizontal: 20, marginBottom: 20}}>
          <Card variant="gold">
            <Text style={styles.cardLabel}>LANGUAGES</Text>
            <View style={styles.chipRow}>
              {astrologer.languages.map(l => <Chip key={l} label={l} />)}
            </View>
            <View style={styles.divider} />
            <Text style={styles.cardLabel}>SPECIALIZATIONS</Text>
            <View style={styles.chipRow}>
              {astrologer.specializations.map(s => (
                <Chip key={s} label={getSpecializationLabel(s)} variant="gold" />
              ))}
            </View>
            <View style={styles.divider} />
            <Text style={styles.bioText}>{astrologer.bio}</Text>
          </Card>
        </View>

        <View style={styles.sectionHdr}>
          <Text style={styles.secTitle}>Reviews</Text>
          <Text style={styles.seeAll}>{astrologer.totalReviews} total</Text>
        </View>

        {/* Warning + CTA */}
        <View style={{paddingHorizontal: 20, paddingBottom: 30}}>
          <View style={styles.warningBox}>
            <Text>⚠️</Text>
            <Text style={styles.warningText}>
              {walletBalance === null
                ? walletError ?? 'Loading wallet balance...'
                : `Balance ₹${walletBalance.toFixed(2)} · ${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} ₹${ratePerMin}/m · ~${minsAvailable} mins available`}
            </Text>
          </View>
          {walletError && (
            <TouchableOpacity
              style={styles.walletRetry}
              onPress={() =>
                setWalletRetryVersion(version => version + 1)
              }>
              <Text style={styles.walletRetryText}>Retry wallet balance</Text>
            </TouchableOpacity>
          )}
          <Button
            label="Book Consultation →"
            disabled={!selectedAvailable || !hasEnoughBalance}
            onPress={() =>
              navigation.navigate('Book', {
                astrologerId: astrologer._id,
                astrologerName: name,
                chatRate: astrologer.chatRate,
                callRate: astrologer.callRate,
                videoRate: astrologer.videoRate,
                chatEnabled: astrologer.isAvailableForChat,
                callEnabled: astrologer.isAvailableForCall,
                videoEnabled: astrologer.isAvailableForVideo,
                isOnline: astrologer.userId.isOnline,
              })
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: Colors.bg},
  state: {flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12},
  stateText: {fontSize: 13, color: Colors.t2},
  errorText: {fontSize: 13, color: Colors.red, textAlign: 'center'},
  hero: {paddingHorizontal: 20, paddingBottom: 20, alignItems: 'center', backgroundColor: 'rgba(30,18,96,0.5)'},
  heroAv: {width: 90, height: 90, borderRadius: 45, backgroundColor: Colors.card2, alignItems: 'center', justifyContent: 'center', marginBottom: 12, borderWidth: 2, borderColor: Colors.border},
  heroName: {fontSize: 22, fontWeight: '800', color: Colors.text},
  heroSpec: {fontSize: 12, color: Colors.t2, marginTop: 4},
  heroChips: {flexDirection: 'row', gap: 8, marginTop: 8, flexWrap: 'wrap', justifyContent: 'center'},
  stats: {flexDirection: 'row', gap: 24, marginTop: 16},
  statItem: {alignItems: 'center'},
  statVal: {fontSize: 20, fontWeight: '700', color: Colors.text},
  statLabel: {fontSize: 10, color: Colors.t2, marginTop: 2},
  sectionHdr: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 12, marginTop: 8},
  secTitle: {fontSize: 16, fontWeight: '700', color: Colors.text},
  seeAll: {fontSize: 12, color: Colors.gold, fontWeight: '600'},
  rateGrid: {flexDirection: 'row', gap: 8, paddingHorizontal: 20, marginBottom: 16},
  rateItem: {flex: 1, backgroundColor: Colors.card, borderWidth: 1.5, borderColor: Colors.border2, borderRadius: 12, padding: 12, alignItems: 'center'},
  rateItemSel: {borderColor: Colors.gold, backgroundColor: Colors.goldDim},
  rateItemDisabled: {opacity: 0.45},
  rateIcon: {fontSize: 20, marginBottom: 4},
  rateType: {fontSize: 10, color: Colors.t2, fontWeight: '600'},
  rateVal: {fontSize: 13, fontWeight: '700', color: Colors.gold, marginTop: 3},
  rateAvailability: {fontSize: 9, color: Colors.t3, marginTop: 3},
  cardLabel: {fontSize: 11, fontWeight: '700', color: Colors.gold, marginBottom: 6},
  chipRow: {flexDirection: 'row', gap: 6, flexWrap: 'wrap'},
  divider: {height: 1, backgroundColor: Colors.border2, marginVertical: 14},
  bioText: {fontSize: 13, color: Colors.t2, lineHeight: 22},
  warningBox: {backgroundColor: Colors.redDim, borderWidth: 1, borderColor: 'rgba(248,113,113,0.2)', borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14},
  warningText: {fontSize: 12, color: Colors.red, flex: 1},
  walletRetry: {alignSelf: 'center', marginBottom: 12, padding: 4},
  walletRetryText: {fontSize: 12, fontWeight: '600', color: Colors.gold},
});
