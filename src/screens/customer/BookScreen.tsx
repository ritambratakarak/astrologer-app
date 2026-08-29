import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Colors} from '../../theme/colors';
import AppHeader from '../../components/common/AppHeader';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import {consultationService} from '../../services/consultationService';
import type {CustomerScreenProps} from '../../navigation/types';
import type {ConsultationType} from '../../types/consultation';

const TYPE_OPTIONS: {type: ConsultationType; icon: string; label: string}[] = [
  {type: 'chat', icon: '💬', label: 'CHAT'},
  {type: 'call', icon: '📞', label: 'CALL'},
  {type: 'video', icon: '📹', label: 'VIDEO'},
];

export default function BookScreen({navigation, route}: CustomerScreenProps<'Book'>) {
  const {astrologerId, astrologerName, chatRate, callRate, videoRate, isOnline} = route.params;
  const [selectedType, setSelectedType] = useState<ConsultationType>('chat');
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const walletBalance = 250;

  const ratePerMin = selectedType === 'chat' ? chatRate : selectedType === 'call' ? callRate : videoRate;
  const minsAvailable = Math.floor(walletBalance / ratePerMin);
  const sufficient = walletBalance >= ratePerMin * 1;

  async function sendRequest() {
    try {
      setLoading(true);
      const consultation = await consultationService.book({
        astrologerId,
        type: selectedType,
        question: question.trim() || undefined,
      });
      navigation.navigate('Pending', {
        consultationId: consultation.id,
        astrologerName,
        type: selectedType,
        ratePerMinute: ratePerMin,
      });
    } catch {
      Alert.alert('Error', 'Could not send request. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <AppHeader title="Book Consultation" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

        {/* Astrologer mini card */}
        <View style={styles.astroCard}>
          <View style={styles.astroAv}><Text style={{fontSize: 24}}>🧙</Text></View>
          <View>
            <Text style={styles.astroName}>{astrologerName}</Text>
            <Text style={styles.astroSpec}>Vedic · Kundali · Lal Kitab</Text>
            <View style={styles.availRow}>
              <View style={[styles.dot, {backgroundColor: isOnline ? Colors.green : Colors.t2}]} />
              <Text style={[styles.availText, {color: isOnline ? Colors.green : Colors.t2}]}>
                {isOnline ? 'Available now' : 'Offline'}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.typeLabel}>Select Type</Text>
        <View style={styles.typeRow}>
          {TYPE_OPTIONS.map(t => (
            <TouchableOpacity
              key={t.type}
              style={[styles.typeCard, selectedType === t.type && styles.typeCardSel]}
              onPress={() => setSelectedType(t.type)}>
              <Text style={styles.typeIcon}>{t.icon}</Text>
              <Text style={[styles.typeText, selectedType === t.type && styles.typeTextSel]}>{t.label}</Text>
              <Text style={styles.typeRate}>₹{t.type === 'chat' ? chatRate : t.type === 'call' ? callRate : videoRate}/min</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{marginBottom: 16}}>
          <Text style={styles.fieldLabel}>YOUR QUESTION (OPTIONAL)</Text>
          <TextInput
            style={styles.textarea}
            placeholder="e.g. I want to know about my career prospects..."
            placeholderTextColor={Colors.t3}
            value={question}
            onChangeText={setQuestion}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        <View style={[styles.balanceBox, sufficient ? styles.balanceOk : styles.balanceWarn]}>
          <Text style={{fontSize: 18}}>{sufficient ? '✅' : '⚠️'}</Text>
          <View>
            <Text style={[styles.balanceTitle, {color: sufficient ? Colors.green : Colors.red}]}>
              {sufficient ? 'Balance sufficient' : 'Low balance'}
            </Text>
            <Text style={[styles.balanceSub, {color: sufficient ? 'rgba(52,211,153,0.8)' : Colors.red}]}>
              ₹{walletBalance} balance · {selectedType} ₹{ratePerMin}/min · ~{minsAvailable} mins
            </Text>
          </View>
        </View>

        <Card variant="small" style={styles.billingCard}>
          <Text style={styles.billingTitle}>HOW BILLING WORKS</Text>
          <Text style={styles.billingText}>
            • Duration rounded up to the nearest minute{'\n'}
            • Wallet debited at session end{'\n'}
            • Session starts once astrologer accepts{'\n'}
            • Either party can end the session anytime
          </Text>
        </Card>

        <Button label="Send Request →" onPress={sendRequest} loading={loading} />
        <View style={{height: 12}} />
        <Button label="Cancel" variant="ghost" onPress={() => navigation.goBack()} />
        <View style={{height: 40}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: Colors.bg},
  content: {paddingHorizontal: 20, paddingBottom: 40},
  astroCard: {flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.card, borderRadius: 14, padding: 12, marginBottom: 20, borderWidth: 1, borderColor: Colors.border2},
  astroAv: {width: 52, height: 52, borderRadius: 26, backgroundColor: Colors.card2, alignItems: 'center', justifyContent: 'center'},
  astroName: {fontSize: 15, fontWeight: '700', color: Colors.text},
  astroSpec: {fontSize: 11, color: Colors.t2, marginTop: 2},
  availRow: {flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4},
  dot: {width: 6, height: 6, borderRadius: 3},
  availText: {fontSize: 11},
  typeLabel: {fontSize: 13, fontWeight: '700', color: Colors.text, marginBottom: 12},
  typeRow: {flexDirection: 'row', gap: 10, marginBottom: 20},
  typeCard: {flex: 1, backgroundColor: Colors.card, borderWidth: 1.5, borderColor: Colors.border2, borderRadius: 14, padding: 14, alignItems: 'center'},
  typeCardSel: {borderColor: Colors.gold, backgroundColor: Colors.goldDim},
  typeIcon: {fontSize: 22, marginBottom: 6},
  typeText: {fontSize: 11, fontWeight: '700', color: Colors.t2},
  typeTextSel: {color: Colors.gold},
  typeRate: {fontSize: 12, color: Colors.gold, marginTop: 3, fontWeight: '600'},
  fieldLabel: {fontSize: 11, fontWeight: '600', color: Colors.t2, marginBottom: 6, letterSpacing: 0.3},
  textarea: {backgroundColor: Colors.card, borderWidth: 1.5, borderColor: Colors.border2, borderRadius: 10, padding: 14, fontSize: 14, color: Colors.text, minHeight: 80},
  balanceBox: {borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 16},
  balanceOk: {backgroundColor: Colors.greenDim, borderWidth: 1, borderColor: 'rgba(52,211,153,0.25)'},
  balanceWarn: {backgroundColor: Colors.redDim, borderWidth: 1, borderColor: 'rgba(248,113,113,0.25)'},
  balanceTitle: {fontWeight: '700', fontSize: 13},
  balanceSub: {fontSize: 11, marginTop: 2},
  billingCard: {marginBottom: 20},
  billingTitle: {fontSize: 11, fontWeight: '700', color: Colors.t2, marginBottom: 8},
  billingText: {fontSize: 12, color: Colors.t2, lineHeight: 22},
});
