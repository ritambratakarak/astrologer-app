import React, {useState} from 'react';
import {View, Text, ScrollView, TouchableOpacity, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Colors} from '../../theme/colors';
import AppHeader from '../../components/common/AppHeader';
import Chip from '../../components/common/Chip';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import type {CustomerScreenProps} from '../../navigation/types';
import type {ConsultationType} from '../../types/consultation';

const DEMO = {
  name: 'Pandit Ramesh Kumar',
  spec: 'Vedic Astrology · Kundali · Lal Kitab',
  emoji: '🧙',
  rating: '4.9',
  reviews: 124,
  satisfaction: 98,
  sessions: 580,
  exp: 15,
  languages: ['Hindi', 'English', 'Sanskrit'],
  specializations: ['Vedic', 'Kundali', 'Lal Kitab', 'Muhurta'],
  bio: 'With 15+ years of deep Vedic astrology experience, Pandit Ramesh provides precise birth chart readings, kundali matching, and muhurta selection.',
  chatRate: 20,
  callRate: 30,
  videoRate: 40,
  chatEnabled: true,
  callEnabled: true,
  videoEnabled: true,
  isOnline: true,
};

const RATE_OPTIONS: {type: ConsultationType; icon: string; label: string; key: 'chatRate' | 'callRate' | 'videoRate'}[] = [
  {type: 'chat', icon: '💬', label: 'CHAT', key: 'chatRate'},
  {type: 'call', icon: '📞', label: 'CALL', key: 'callRate'},
  {type: 'video', icon: '📹', label: 'VIDEO', key: 'videoRate'},
];

const REVIEWS = [
  {name: 'Priya S.', stars: '★★★★★', comment: 'Excellent! Very accurate predictions about my career change.', ago: '3 days ago'},
  {name: 'Rahul M.', stars: '★★★★☆', comment: 'Very knowledgeable and patient. Explained everything clearly.', ago: '1 week ago'},
];

export default function AstrologerDetailScreen({navigation, route}: CustomerScreenProps<'AstrologerDetail'>) {
  const [selectedType, setSelectedType] = useState<ConsultationType>('chat');
  const walletBalance = 250;
  const ratePerMin = selectedType === 'chat' ? DEMO.chatRate : selectedType === 'call' ? DEMO.callRate : DEMO.videoRate;
  const minsAvailable = Math.floor(walletBalance / ratePerMin);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <AppHeader onBack={() => navigation.goBack()} />

        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroAv}><Text style={{fontSize: 36}}>{DEMO.emoji}</Text></View>
          <Text style={styles.heroName}>{DEMO.name}</Text>
          <Text style={styles.heroSpec}>{DEMO.spec}</Text>
          <View style={styles.heroChips}>
            <Chip label="💬 Online" variant="green" />
            <Chip label={`⭐ ${DEMO.rating} Rating`} variant="gold" />
            <Chip label={`${DEMO.exp} yrs exp`} />
          </View>
          <View style={styles.stats}>
            {[
              {val: DEMO.reviews, label: 'Reviews'},
              {val: `${DEMO.satisfaction}%`, label: 'Satisfied'},
              {val: `${DEMO.sessions}+`, label: 'Sessions'},
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
              style={[styles.rateItem, selectedType === r.type && styles.rateItemSel]}
              onPress={() => setSelectedType(r.type)}>
              <Text style={styles.rateIcon}>{r.icon}</Text>
              <Text style={styles.rateType}>{r.label}</Text>
              <Text style={styles.rateVal}>₹{DEMO[r.key]}/min</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Languages & Specializations */}
        <View style={{paddingHorizontal: 20, marginBottom: 20}}>
          <Card variant="gold">
            <Text style={styles.cardLabel}>LANGUAGES</Text>
            <View style={styles.chipRow}>
              {DEMO.languages.map(l => <Chip key={l} label={l} />)}
            </View>
            <View style={styles.divider} />
            <Text style={styles.cardLabel}>SPECIALIZATIONS</Text>
            <View style={styles.chipRow}>
              {DEMO.specializations.map(s => <Chip key={s} label={s} variant="gold" />)}
            </View>
            <View style={styles.divider} />
            <Text style={styles.bioText}>{DEMO.bio}</Text>
          </Card>
        </View>

        {/* Reviews */}
        <View style={styles.sectionHdr}>
          <Text style={styles.secTitle}>Recent Reviews</Text>
          <Text style={styles.seeAll}>All {DEMO.reviews}</Text>
        </View>
        <View style={{paddingHorizontal: 20, marginBottom: 16}}>
          {REVIEWS.map((r, i) => (
            <View key={i} style={[styles.reviewItem, i > 0 && {marginTop: 8}]}>
              <View style={styles.reviewAv}><Text style={{fontSize: 14}}>{r.name[0]}</Text></View>
              <View style={{flex: 1}}>
                <Text style={styles.reviewName}>{r.name}</Text>
                <Text style={styles.reviewStars}>{r.stars}</Text>
                <Text style={styles.reviewComment}>{r.comment}</Text>
                <Text style={styles.reviewAgo}>{r.ago}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Warning + CTA */}
        <View style={{paddingHorizontal: 20, paddingBottom: 30}}>
          <View style={styles.warningBox}>
            <Text>⚠️</Text>
            <Text style={styles.warningText}>
              Balance ₹{walletBalance} · {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} ₹{ratePerMin}/m · ~{minsAvailable} mins available
            </Text>
          </View>
          <Button
            label="Book Consultation →"
            onPress={() =>
              navigation.navigate('Book', {
                astrologerId: route.params.astrologerId,
                astrologerName: DEMO.name,
                chatRate: DEMO.chatRate,
                callRate: DEMO.callRate,
                videoRate: DEMO.videoRate,
                chatEnabled: DEMO.chatEnabled,
                callEnabled: DEMO.callEnabled,
                videoEnabled: DEMO.videoEnabled,
                isOnline: DEMO.isOnline,
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
  rateIcon: {fontSize: 20, marginBottom: 4},
  rateType: {fontSize: 10, color: Colors.t2, fontWeight: '600'},
  rateVal: {fontSize: 13, fontWeight: '700', color: Colors.gold, marginTop: 3},
  cardLabel: {fontSize: 11, fontWeight: '700', color: Colors.gold, marginBottom: 6},
  chipRow: {flexDirection: 'row', gap: 6, flexWrap: 'wrap'},
  divider: {height: 1, backgroundColor: Colors.border2, marginVertical: 14},
  bioText: {fontSize: 13, color: Colors.t2, lineHeight: 22},
  reviewItem: {flexDirection: 'row', gap: 10, padding: 12, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border2, borderRadius: 12},
  reviewAv: {width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.card2, alignItems: 'center', justifyContent: 'center'},
  reviewName: {fontSize: 12, fontWeight: '700', color: Colors.text},
  reviewStars: {color: Colors.gold, fontSize: 11},
  reviewComment: {fontSize: 12, color: Colors.t2, marginTop: 4, lineHeight: 18},
  reviewAgo: {fontSize: 10, color: Colors.t3, marginTop: 4},
  warningBox: {backgroundColor: Colors.redDim, borderWidth: 1, borderColor: 'rgba(248,113,113,0.2)', borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14},
  warningText: {fontSize: 12, color: Colors.red, flex: 1},
});
