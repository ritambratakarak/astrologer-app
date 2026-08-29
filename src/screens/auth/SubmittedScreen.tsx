import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Clipboard,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Colors} from '../../theme/colors';
import Button from '../../components/common/Button';
import Toast from '../../components/common/Toast';
import {useAuthStore} from '../../store/authStore';
import type {AuthScreenProps} from '../../navigation/types';

const TIMELINE = [
  {label: 'Application Submitted', sub: 'All documents received · Just now', status: 'done'},
  {label: 'Document Verification', sub: 'Aadhaar, PAN & bank account being verified', status: 'active'},
  {label: 'Profile Review', sub: 'Qualifications and certificates reviewed', status: 'pending'},
  {label: 'Go Live!', sub: 'Account approved — start accepting consultations', status: 'pending'},
];

export default function SubmittedScreen({route}: AuthScreenProps<'Submitted'>) {
  const {applicationId} = route.params;
  const [toastMsg, setToastMsg] = React.useState('');
  const [toastVisible, setToastVisible] = React.useState(false);
  const {setProfileComplete} = useAuthStore();

  function copyId() {
    Clipboard.setString(applicationId);
    setToastMsg('Application ID copied ✓');
    setToastVisible(true);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.checkRing}>
          <Text style={{fontSize: 44}}>✅</Text>
        </View>

        <Text style={styles.title}>Application Submitted!</Text>
        <Text style={styles.subtitle}>
          Your KYC and profile documents have been received. Our team will review them shortly.
        </Text>

        <View style={styles.idCard}>
          <Text style={styles.idLabel}>Application ID</Text>
          <Text style={styles.idValue}>{applicationId}</Text>
          <View style={styles.idRow}>
            <Text style={styles.idHint}>Save this for reference · </Text>
            <TouchableOpacity onPress={copyId}>
              <Text style={styles.idCopy}>Copy</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.infoGrid}>
          {[
            {icon: '⏱️', val: '24–48 hrs', lbl: 'Review time'},
            {icon: '📧', val: 'Email + SMS', lbl: 'Notification via'},
            {icon: '🔍', val: '3 Steps', lbl: 'Verification process'},
            {icon: '📱', val: 'In-App Alert', lbl: 'Approval notice'},
          ].map(item => (
            <View key={item.lbl} style={styles.infoTile}>
              <Text style={styles.infoIcon}>{item.icon}</Text>
              <Text style={styles.infoVal}>{item.val}</Text>
              <Text style={styles.infoLbl}>{item.lbl}</Text>
            </View>
          ))}
        </View>

        <View style={styles.timeline}>
          {TIMELINE.map((item, i) => (
            <View key={item.label} style={styles.tlItem}>
              <View style={styles.tlLineWrap}>
                <View
                  style={[
                    styles.tlDot,
                    item.status === 'done' && styles.tlDotDone,
                    item.status === 'active' && styles.tlDotActive,
                    item.status === 'pending' && styles.tlDotPending,
                  ]}>
                  <Text style={styles.tlDotText}>
                    {item.status === 'done' ? '✓' : item.status === 'active' ? '⋯' : String(i + 1)}
                  </Text>
                </View>
                {i < TIMELINE.length - 1 && (
                  <View style={[styles.tlConnector, item.status === 'done' && styles.tlConnectorDone]} />
                )}
              </View>
              <View style={styles.tlBody}>
                <Text style={styles.tlTitle}>{item.label}</Text>
                <Text style={styles.tlSub}>{item.sub}</Text>
              </View>
            </View>
          ))}
        </View>

        <Button
          label="Go to Dashboard →"
          onPress={() => setProfileComplete(true)}
          style={{marginTop: 8}}
        />
        <Text style={styles.footer}>
          Dashboard will show{' '}
          <Text style={{color: Colors.text, fontWeight: '700'}}>Pending Approval</Text> status
          until review is complete
        </Text>
        <View style={{height: 28}} />
      </ScrollView>

      <Toast
        message={toastMsg}
        visible={toastVisible}
        onHide={() => setToastVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: Colors.bg},
  content: {alignItems: 'center', padding: 28},
  checkRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(74,222,128,0.15)',
    borderWidth: 2,
    borderColor: 'rgba(74,222,128,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {fontSize: 26, fontWeight: '800', color: Colors.text, textAlign: 'center'},
  subtitle: {
    fontSize: 13,
    color: Colors.t2,
    marginTop: 10,
    lineHeight: 22,
    textAlign: 'center',
    maxWidth: 280,
  },
  idCard: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border2,
    borderRadius: 14,
    padding: 12,
    paddingHorizontal: 18,
    marginVertical: 18,
    width: '100%',
    alignItems: 'center',
  },
  idLabel: {fontSize: 10, color: Colors.t3, fontWeight: '600', letterSpacing: 0.5, marginBottom: 4},
  idValue: {fontSize: 17, fontWeight: '800', color: Colors.gold, letterSpacing: 1.5},
  idRow: {flexDirection: 'row', marginTop: 3},
  idHint: {fontSize: 10, color: Colors.t3},
  idCopy: {fontSize: 10, color: Colors.gold},
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    width: '100%',
    marginBottom: 20,
  },
  infoTile: {
    width: '47%',
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border2,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
  },
  infoIcon: {fontSize: 22, marginBottom: 6},
  infoVal: {fontSize: 13, fontWeight: '700', color: Colors.text},
  infoLbl: {fontSize: 10, color: Colors.t2, marginTop: 3},
  timeline: {width: '100%', marginBottom: 24},
  tlItem: {flexDirection: 'row', gap: 14, marginBottom: 0},
  tlLineWrap: {flexDirection: 'column', alignItems: 'center', flexShrink: 0},
  tlDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tlDotDone: {backgroundColor: Colors.green},
  tlDotActive: {
    backgroundColor: Colors.goldDim,
    borderWidth: 2,
    borderColor: Colors.gold,
  },
  tlDotPending: {
    backgroundColor: Colors.card2,
    borderWidth: 2,
    borderColor: Colors.border2,
  },
  tlDotText: {fontSize: 12, color: '#fff', fontWeight: '700'},
  tlConnector: {width: 2, flex: 1, minHeight: 18, backgroundColor: Colors.border2, marginVertical: 3},
  tlConnectorDone: {backgroundColor: Colors.green},
  tlBody: {paddingBottom: 20, flex: 1},
  tlTitle: {fontSize: 13, fontWeight: '700', color: Colors.text},
  tlSub: {fontSize: 11, color: Colors.t2, marginTop: 3, lineHeight: 17},
  footer: {fontSize: 11, color: Colors.t3, textAlign: 'center', marginTop: 10},
});
