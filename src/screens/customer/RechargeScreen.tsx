import React, {useState} from 'react';
import {View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet, Alert} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Colors} from '../../theme/colors';
import AppHeader from '../../components/common/AppHeader';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import {walletService} from '../../services/walletService';
import {RECHARGE_AMOUNTS} from '../../constants';
import type {CustomerScreenProps} from '../../navigation/types';

const PAY_METHODS = [
  {id: 'upi', icon: '📱', label: 'UPI', sub: 'Instant'},
  {id: 'card', icon: '💳', label: 'Card', sub: 'Debit/Credit'},
  {id: 'netbanking', icon: '🏦', label: 'Net Banking', sub: 'All banks'},
] as const;

export default function RechargeScreen({navigation}: CustomerScreenProps<'CustomerTabs'> & {navigation: any}) {
  const [selectedAmt, setSelectedAmt] = useState(500);
  const [customAmt, setCustomAmt] = useState('500');
  const [payMethod, setPayMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [loading, setLoading] = useState(false);

  function selectPreset(amt: number) {
    setSelectedAmt(amt);
    setCustomAmt(String(amt));
  }

  async function pay() {
    const amount = Number(customAmt);
    if (!amount || amount < 10) {
      Alert.alert('Invalid Amount', 'Minimum recharge is ₹10.');
      return;
    }
    try {
      setLoading(true);
      await walletService.initiateRecharge({amount, paymentMethod: payMethod});
      Alert.alert('Success', `₹${amount} added to your wallet!`);
      navigation.goBack();
    } catch {
      Alert.alert('Payment Failed', 'Could not process payment. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <AppHeader title="Add Money" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

        <View style={styles.balanceCard}>
          <Text style={styles.balLabel}>CURRENT BALANCE</Text>
          <Text style={styles.balAmount}>₹250</Text>
        </View>

        <Text style={styles.sectionLabel}>Select Amount</Text>
        <View style={styles.amtGrid}>
          {RECHARGE_AMOUNTS.map(amt => (
            <TouchableOpacity
              key={amt}
              style={[styles.amtChip, selectedAmt === amt && styles.amtChipSel]}
              onPress={() => selectPreset(amt)}>
              <Text style={[styles.amtText, selectedAmt === amt && styles.amtTextSel]}>
                ₹{amt.toLocaleString('en-IN')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionLabel}>Custom Amount</Text>
        <View style={styles.customRow}>
          <Text style={styles.rupee}>₹</Text>
          <TextInput
            style={styles.customInput}
            placeholder="Min ₹10"
            placeholderTextColor={Colors.t3}
            keyboardType="numeric"
            value={customAmt}
            onChangeText={v => {setCustomAmt(v); setSelectedAmt(Number(v));}}
          />
        </View>

        <Text style={styles.sectionLabel}>Payment Method</Text>
        <View style={styles.payRow}>
          {PAY_METHODS.map(p => (
            <TouchableOpacity
              key={p.id}
              style={[styles.payCard, payMethod === p.id && styles.payCardActive]}
              onPress={() => setPayMethod(p.id)}>
              <Text style={styles.payIcon}>{p.icon}</Text>
              <Text style={styles.payLabel}>{p.label}</Text>
              <Text style={styles.paySub}>{p.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Card variant="small" style={styles.secCard}>
          <View style={{flexDirection: 'row', gap: 8, alignItems: 'center'}}>
            <Text style={{fontSize: 16}}>🔒</Text>
            <Text style={styles.secText}>
              Powered by <Text style={{color: Colors.text, fontWeight: '700'}}>Razorpay</Text>.
              256-bit encryption. PCI-DSS compliant.
            </Text>
          </View>
        </Card>

        <Button
          label={`Pay ₹${Number(customAmt).toLocaleString('en-IN')} via Razorpay →`}
          onPress={pay}
          loading={loading}
        />
        <View style={{height: 40}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: Colors.bg},
  content: {paddingHorizontal: 20, paddingBottom: 40},
  balanceCard: {backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border2, borderRadius: 16, padding: 16, marginBottom: 20, alignItems: 'center'},
  balLabel: {fontSize: 11, color: Colors.t2, marginBottom: 4},
  balAmount: {fontSize: 28, fontWeight: '800', color: Colors.text},
  sectionLabel: {fontSize: 13, fontWeight: '700', color: Colors.text, marginBottom: 12},
  amtGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20},
  amtChip: {width: '30%', backgroundColor: Colors.card, borderWidth: 1.5, borderColor: Colors.border2, borderRadius: 12, paddingVertical: 14, alignItems: 'center'},
  amtChipSel: {backgroundColor: Colors.goldDim, borderColor: Colors.gold},
  amtText: {fontSize: 15, fontWeight: '700', color: Colors.t2},
  amtTextSel: {color: Colors.gold},
  customRow: {flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20},
  rupee: {fontSize: 20, fontWeight: '700', color: Colors.t2},
  customInput: {flex: 1, backgroundColor: Colors.card, borderWidth: 1.5, borderColor: Colors.border2, borderRadius: 10, paddingVertical: 14, paddingHorizontal: 16, fontSize: 16, color: Colors.text},
  payRow: {flexDirection: 'row', gap: 8, marginBottom: 20},
  payCard: {flex: 1, borderRadius: 10, padding: 10, alignItems: 'center', borderWidth: 1, borderColor: Colors.border2, backgroundColor: Colors.card},
  payCardActive: {borderColor: Colors.gold, backgroundColor: Colors.goldDim},
  payIcon: {fontSize: 18, marginBottom: 4},
  payLabel: {fontSize: 11, fontWeight: '600', color: Colors.text},
  paySub: {fontSize: 10, color: Colors.t2},
  secCard: {marginBottom: 20},
  secText: {flex: 1, fontSize: 12, color: Colors.t2, lineHeight: 18},
});
