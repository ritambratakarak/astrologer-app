import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
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
import {astrologerService} from '../../services/astrologerService';
import type {
  AstrologerFilter,
  AstrologerListItem,
  AstrologerPagination,
} from '../../types/astrologer';

type Nav = NativeStackNavigationProp<CustomerStackParamList>;

const FILTERS = ['All', 'Online', 'Chat', 'Call', 'Vedic', 'Tarot', 'Numerology', 'Vastu'];
const PAGE_SIZE = 10;

function getFilter(search: string, activeFilter: string): AstrologerFilter {
  const filter: AstrologerFilter = {};
  const normalizedSearch = search.trim();
  if (normalizedSearch) {
    filter.search = normalizedSearch;
  }

  if (activeFilter === 'Online') {
    filter.online = true;
  } else if (activeFilter === 'Chat' || activeFilter === 'Call') {
    filter.availability = activeFilter === 'Chat' ? 'chat' : 'call';
  } else if (activeFilter !== 'All') {
    filter.specialization = activeFilter.toLowerCase();
  }
  return filter;
}

function getSpecializationLabel(specialization: string): string {
  return specialization
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function BrowseScreen() {
  const navigation = useNavigation<Nav>();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [astrologers, setAstrologers] = useState<AstrologerListItem[]>([]);
  const [pagination, setPagination] = useState<AstrologerPagination | null>(null);
  const [page, setPage] = useState(1);
  const [reloadVersion, setReloadVersion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;
    const timeout = setTimeout(() => {
      setLoading(true);
      setError(null);
      astrologerService
        .listAstrologers(getFilter(search, activeFilter), page, PAGE_SIZE)
        .then(response => {
          if (isActive) {
            setAstrologers(response.data.items);
            setPagination(response.data.pagination);
          }
        })
        .catch(loadError => {
          if (isActive) {
            setError(
              loadError instanceof Error
                ? loadError.message
                : 'Could not load astrologers. Please try again.',
            );
          }
        })
        .finally(() => {
          if (isActive) {
            setLoading(false);
          }
        });
    }, search ? 300 : 0);

    return () => {
      isActive = false;
      clearTimeout(timeout);
    };
  }, [activeFilter, page, reloadVersion, search]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setPage(1);
  };

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
          onChangeText={handleSearchChange}
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
            onPress={() => handleFilterChange(f)}>
            <Text style={[styles.fChipText, activeFilter === f && styles.fChipTextActive]}>
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.resultCount}>
        {pagination
          ? `${pagination.total} astrologers found`
          : 'Browse available astrologers'}
      </Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {astrologers.map(a => {
          const name =
            typeof a.userId?.fullName === 'string' && a.userId.fullName.trim()
              ? a.userId.fullName.trim()
              : 'Astrologer';
          const isOnline = a.userId?.isOnline ?? false;
          const specializations = a.specializations
            .map(getSpecializationLabel)
            .join(' · ');
          return (
            <TouchableOpacity
              key={a._id}
              style={styles.item}
              onPress={() =>
                navigation.navigate('AstrologerDetail', {astrologerId: a._id})
              }>
              <View style={styles.itemAv}>
                <Text style={styles.initial}>{name.charAt(0).toUpperCase()}</Text>
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{name}</Text>
                <Text style={styles.itemSpec}>{specializations}</Text>
                <View style={styles.itemMeta}>
                  <Text style={styles.stars}>★★★★★</Text>
                  <Text style={styles.ratingText}>
                    {a.rating.toFixed(1)} ({a.totalReviews}) · {a.experience} yrs
                  </Text>
                </View>
                <View style={styles.itemChips}>
                  <Chip label={`💬 ₹${a.chatRate}/m`} variant="green" small />
                  <Chip label={`📞 ₹${a.callRate}/m`} variant="blue" small />
                  {a.videoRate > 0 && (
                    <Chip label={`📹 ₹${a.videoRate}/m`} variant="purple" small />
                  )}
                </View>
              </View>
              <View style={styles.avail}>
                <View
                  style={[
                    styles.dot,
                    {backgroundColor: isOnline ? Colors.green : Colors.t2},
                  ]}
                />
                <Text
                  style={[
                    styles.availText,
                    {color: isOnline ? Colors.green : Colors.t2},
                  ]}>
                  {isOnline ? 'Online' : 'Offline'}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
        {loading && (
          <View style={styles.state}>
            <ActivityIndicator color={Colors.gold} />
            <Text style={styles.stateText}>Loading astrologers...</Text>
          </View>
        )}
        {!loading && error && (
          <View style={styles.state}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => setReloadVersion(version => version + 1)}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}
        {!loading && !error && astrologers.length === 0 && (
          <View style={styles.state}>
            <Text style={styles.stateText}>No astrologers found.</Text>
          </View>
        )}
        {pagination && pagination.totalPages > 0 && (
          <View style={styles.pagination}>
            <TouchableOpacity
              accessibilityRole="button"
              disabled={!pagination.hasPrevPage || loading}
              style={[
                styles.pageButton,
                (!pagination.hasPrevPage || loading) && styles.pageButtonDisabled,
              ]}
              onPress={() => setPage(currentPage => Math.max(1, currentPage - 1))}>
              <Text style={styles.pageButtonText}>Previous</Text>
            </TouchableOpacity>
            <Text style={styles.pageText}>
              Page {pagination.page} of {pagination.totalPages}
            </Text>
            <TouchableOpacity
              accessibilityRole="button"
              disabled={!pagination.hasNextPage || loading}
              style={[
                styles.pageButton,
                (!pagination.hasNextPage || loading) && styles.pageButtonDisabled,
              ]}
              onPress={() => setPage(currentPage => currentPage + 1)}>
              <Text style={styles.pageButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.scrollBottomSpace} />
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
  initial: {fontSize: 20, fontWeight: '700', color: Colors.gold},
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
  state: {alignItems: 'center', paddingHorizontal: 20, paddingVertical: 24, gap: 10},
  stateText: {fontSize: 12, color: Colors.t2},
  errorText: {fontSize: 12, color: Colors.red, textAlign: 'center'},
  retryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: Colors.goldDim,
  },
  retryText: {fontSize: 12, fontWeight: '600', color: Colors.gold},
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  pageButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border2,
  },
  pageButtonDisabled: {opacity: 0.4},
  pageButtonText: {fontSize: 11, fontWeight: '600', color: Colors.gold},
  pageText: {fontSize: 11, color: Colors.t2},
  scrollBottomSpace: {height: 90},
});
