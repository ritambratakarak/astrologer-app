import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Colors} from '../../theme/colors';
import Chip from '../../components/common/Chip';
import type {CustomerStackParamList} from '../../navigation/types';

type Nav = NativeStackNavigationProp<CustomerStackParamList>;

const FILTERS = ['All', 'Online', 'Chat', 'Call', 'Vedic', 'Tarot', 'Numerology', 'Vastu'];

const ASTROLOGERS = [
  {id: '1', name: 'Pandit Ramesh Kumar', spec: 'Vedic · Kundali · Lal Kitab', emoji: '🧙', rating: '4.9', reviews: 124, exp: 15, chatRate: 20, callRate: 30, videoRate: 40, online: true},
  {id: '2', name: 'Meera Joshi', spec: 'Tarot · Numerology · Face Reading', emoji: '🌙', rating: '4.7', reviews: 89, exp: 8, chatRate: 15, callRate: 25, videoRate: 0, online: true},
  {id: '3', name: 'Acharya Suresh Verma', spec: 'Vastu · Palmistry · Muhurta', emoji: '⭐', rating: '4.8', reviews: 210, exp: 22, chatRate: 25, callRate: 35, videoRate: 0, online: false},
  {id: '4', name: 'Divya Nair', spec: 'Lal Kitab · Prashna · Kundali', emoji: '🌟', rating: '4.6', reviews: 67, exp: 10, chatRate: 18, callRate: 28, videoRate: 38, online: true},
  {id: '5', name: 'Rajesh Sharma', spec: 'Numerology · Vastu · Vedic', emoji: '🔮', rating: '4.9', reviews: 312, exp: 18, chatRate: 22, callRate: 32, videoRate: 0, online: true},
];

export default function BrowseScreen() {
  const navigation = useNavigation<Nav>();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = ASTROLOGERS.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.spec.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.hdr}>
        <Text style={styles.title}>Browse Astrologers</Text>
      </View>

      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInp}
          placeholder="Search by name, specialty..."
          placeholderTextColor={Colors.t3}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.fChip, activeFilter === f && styles.fChipActive]}
            onPress={() => setActiveFilter(f)}>
            <Text style={[styles.fChipText, activeFilter === f && styles.fChipTextActive]}>
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.resultCount}>{filtered.length} astrologers found</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {filtered.map(a => (
          <TouchableOpacity
            key={a.id}
            style={styles.item}
            onPress={() => navigation.navigate('AstrologerDetail', {astrologerId: a.id})}>
            <View style={styles.itemAv}>
              <Text style={{fontSize: 20}}>{a.emoji}</Text>
            </View>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{a.name}</Text>
              <Text style={styles.itemSpec}>{a.spec}</Text>
              <View style={styles.itemMeta}>
                <Text style={styles.stars}>★★★★★</Text>
                <Text style={styles.ratingText}>{a.rating} ({a.reviews}) · {a.exp} yrs</Text>
              </View>
              <View style={styles.itemChips}>
                <Chip label={`💬 ₹${a.chatRate}/m`} variant="green" small />
                <Chip label={`📞 ₹${a.callRate}/m`} variant="blue" small />
                {a.videoRate > 0 && <Chip label={`📹 ₹${a.videoRate}/m`} variant="purple" small />}
              </View>
            </View>
            <View style={styles.avail}>
              <View style={[styles.dot, {backgroundColor: a.online ? Colors.green : Colors.t2}]} />
              <Text style={[styles.availText, {color: a.online ? Colors.green : Colors.t2}]}>
                {a.online ? 'Online' : 'Offline'}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
        <View style={{height: 90}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: Colors.bg},
  hdr: {paddingHorizontal: 20, paddingVertical: 14, paddingTop: 10},
  title: {fontSize: 18, fontWeight: '700', color: Colors.text},
  searchBar: {
    margin: 12,
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.card,
    borderWidth: 1.5,
    borderColor: Colors.border2,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {fontSize: 16, color: Colors.t3},
  searchInp: {flex: 1, fontSize: 14, color: Colors.text, padding: 0},
  filterRow: {paddingHorizontal: 20, gap: 8, marginBottom: 14},
  fChip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border2,
    minHeight: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fChipActive: {backgroundColor: Colors.goldDim, borderColor: Colors.border},
  fChipText: {fontSize: 11, fontWeight: '600', color: Colors.t2},
  fChipTextActive: {color: Colors.gold},
  resultCount: {paddingHorizontal: 20, fontSize: 11, color: Colors.t2, marginBottom: 6},
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border3,
  },
  itemAv: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.card2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemInfo: {flex: 1},
  itemName: {fontSize: 15, fontWeight: '700', color: Colors.text},
  itemSpec: {fontSize: 11, color: Colors.t2, marginTop: 2},
  itemMeta: {flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6},
  stars: {color: Colors.gold, fontSize: 12},
  ratingText: {fontSize: 11, color: Colors.t2},
  itemChips: {flexDirection: 'row', gap: 4, marginTop: 6, flexWrap: 'wrap'},
  avail: {alignItems: 'flex-end', gap: 4},
  dot: {width: 8, height: 8, borderRadius: 4},
  availText: {fontSize: 9},
});
