import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Colors} from '../../theme/colors';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import {registrationService} from '../../services/registrationService';
import {SPECIALIZATIONS, LANGUAGES} from '../../constants';
import type {AuthScreenProps} from '../../navigation/types';
import type {AstrologerRegistrationData} from '../../types/registration';

const TOTAL_STEPS = 8;

const STEP_TITLES = [
  'Personal Info',
  'Expertise',
  'Consultation Rates',
  'KYC Documents',
  'Bank Details',
  'Upload Documents',
  'Agreement',
  'Terms & Conditions',
];

export default function AstrologerRegisterScreen({navigation}: AuthScreenProps<'AstrologerRegister'>) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form state
  const [fullName, setFullName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [dob, setDob] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  const [experience, setExperience] = useState('');
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>([]);
  const [selectedLangs, setSelectedLangs] = useState<string[]>([]);
  const [bio, setBio] = useState('');

  const [chatRate, setChatRate] = useState('20');
  const [callRate, setCallRate] = useState('30');
  const [videoRate, setVideoRate] = useState('40');

  const [aadhaar, setAadhaar] = useState('');
  const [pan, setPan] = useState('');

  const [bankAccount, setBankAccount] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [bankName, setBankName] = useState('');

  const [agreementAccepted, setAgreementAccepted] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  function toggleSpec(s: string) {
    setSelectedSpecs(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s],
    );
  }

  function toggleLang(l: string) {
    setSelectedLangs(prev =>
      prev.includes(l) ? prev.filter(x => x !== l) : [...prev, l],
    );
  }

  async function handleNext() {
    if (step < TOTAL_STEPS) {
      setStep(s => s + 1);
      return;
    }
    if (!agreementAccepted || !termsAccepted) {
      Alert.alert('Required', 'Please accept the Agreement and Terms before submitting.');
      return;
    }
    try {
      setLoading(true);
      const payload: AstrologerRegistrationData = {
        fullName,
        displayName,
        gender,
        dateOfBirth: dob,
        city,
        state,
        experience: Number(experience),
        specializations: selectedSpecs,
        languages: selectedLangs,
        bio,
        chatRate: Number(chatRate),
        callRate: Number(callRate),
        videoRate: Number(videoRate),
        aadhaarNumber: aadhaar,
        panNumber: pan,
        bankAccountNumber: bankAccount,
        ifscCode: ifsc,
        accountHolderName: accountHolder,
        bankName,
        certificates: [],
        profilePhoto: '',
        agreementAccepted,
        termsAccepted,
      };
      //const res = await registrationService.submit(payload);
      navigation.navigate('Submitted', {applicationId: '12345'});
    } catch {
      Alert.alert('Error', 'Could not submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const progress = step / TOTAL_STEPS;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Progress header */}
      <View style={styles.progressHdr}>
        {step > 1 && (
          <TouchableOpacity onPress={() => setStep(s => s - 1)}>
            <Text style={styles.backBtn}>←</Text>
          </TouchableOpacity>
        )}
        <View style={{flex: 1}}>
          <Text style={styles.stepLabel}>
            Step {step} of {TOTAL_STEPS} — {STEP_TITLES[step - 1]}
          </Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, {width: `${progress * 100}%`}]} />
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {step === 1 && (
          <>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <Input label="FULL NAME" placeholder="Pandit Ramesh Kumar" value={fullName} onChangeText={setFullName} />
            <Input label="DISPLAY NAME" placeholder="Pandit Ramesh" value={displayName} onChangeText={setDisplayName} />
            <Text style={styles.fieldLabel}>GENDER</Text>
            <View style={styles.chipRow}>
              {(['male', 'female', 'other'] as const).map(g => (
                <TouchableOpacity
                  key={g}
                  style={[styles.selChip, gender === g && styles.selChipActive]}
                  onPress={() => setGender(g)}>
                  <Text style={[styles.selChipText, gender === g && styles.selChipTextActive]}>
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Input label="DATE OF BIRTH" placeholder="DD/MM/YYYY" value={dob} onChangeText={setDob} keyboardType="numeric" />
            <Input label="CITY" placeholder="New Delhi" value={city} onChangeText={setCity} />
            <Input label="STATE" placeholder="Delhi" value={state} onChangeText={setState} />
          </>
        )}

        {step === 2 && (
          <>
            <Text style={styles.sectionTitle}>Your Expertise</Text>
            <Input label="YEARS OF EXPERIENCE" placeholder="15" value={experience} onChangeText={setExperience} keyboardType="numeric" />
            <Text style={styles.fieldLabel}>SPECIALIZATIONS</Text>
            <View style={styles.chipRow}>
              {SPECIALIZATIONS.map(s => (
                <TouchableOpacity
                  key={s}
                  style={[styles.selChip, selectedSpecs.includes(s) && styles.selChipActive]}
                  onPress={() => toggleSpec(s)}>
                  <Text style={[styles.selChipText, selectedSpecs.includes(s) && styles.selChipTextActive]}>
                    {s}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.fieldLabel}>LANGUAGES SPOKEN</Text>
            <View style={styles.chipRow}>
              {LANGUAGES.map(l => (
                <TouchableOpacity
                  key={l}
                  style={[styles.selChip, selectedLangs.includes(l) && styles.selChipActive]}
                  onPress={() => toggleLang(l)}>
                  <Text style={[styles.selChipText, selectedLangs.includes(l) && styles.selChipTextActive]}>
                    {l}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Input label="BIO" placeholder="Tell seekers about your expertise..." value={bio} onChangeText={setBio} multiline numberOfLines={4} />
          </>
        )}

        {step === 3 && (
          <>
            <Text style={styles.sectionTitle}>Consultation Rates</Text>
            <Text style={styles.rateNote}>Set your per-minute rates for each consultation type.</Text>
            {[
              {icon: '💬', type: 'Chat', val: chatRate, setter: setChatRate},
              {icon: '📞', type: 'Voice Call', val: callRate, setter: setCallRate},
              {icon: '📹', type: 'Video Call', val: videoRate, setter: setVideoRate},
            ].map(r => (
              <View key={r.type} style={styles.rateRow}>
                <Text style={styles.rateIcon}>{r.icon}</Text>
                <Input
                  label={`${r.type.toUpperCase()} RATE`}
                  placeholder="20"
                  value={r.val}
                  onChangeText={r.setter}
                  keyboardType="numeric"
                  containerStyle={{flex: 1, marginBottom: 0}}
                />
                <Text style={styles.perMin}>₹/min</Text>
              </View>
            ))}
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                💡 Minimum rate is ₹10/min. You can update these anytime from your profile.
              </Text>
            </View>
          </>
        )}

        {step === 4 && (
          <>
            <Text style={styles.sectionTitle}>KYC Documents</Text>
            <Text style={styles.rateNote}>Required for identity verification. Keep originals handy.</Text>
            <Input label="AADHAAR NUMBER" placeholder="XXXX XXXX XXXX" value={aadhaar} onChangeText={setAadhaar} keyboardType="numeric" maxLength={12} />
            <Input label="PAN NUMBER" placeholder="ABCDE1234F" value={pan} onChangeText={setPan} autoCapitalize="characters" maxLength={10} />
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                🔒 Your documents are encrypted and stored securely. Only used for KYC verification.
              </Text>
            </View>
          </>
        )}

        {step === 5 && (
          <>
            <Text style={styles.sectionTitle}>Bank Account Details</Text>
            <Text style={styles.rateNote}>Earnings will be transferred to this account.</Text>
            <Input label="ACCOUNT HOLDER NAME" placeholder="Ramesh Kumar" value={accountHolder} onChangeText={setAccountHolder} />
            <Input label="BANK NAME" placeholder="State Bank of India" value={bankName} onChangeText={setBankName} />
            <Input label="ACCOUNT NUMBER" placeholder="XXXXXXXXXXXX" value={bankAccount} onChangeText={setBankAccount} keyboardType="numeric" />
            <Input label="IFSC CODE" placeholder="SBIN0001234" value={ifsc} onChangeText={setIfsc} autoCapitalize="characters" />
          </>
        )}

        {step === 6 && (
          <>
            <Text style={styles.sectionTitle}>Upload Documents</Text>
            <Text style={styles.rateNote}>Upload your certificates and profile photo.</Text>
            {[
              {label: 'Profile Photo', icon: '🤳'},
              {label: 'Certificates / Degrees', icon: '📜'},
              {label: 'Aadhaar Card (front + back)', icon: '🪪'},
            ].map(doc => (
              <TouchableOpacity key={doc.label} style={styles.uploadBox}>
                <Text style={styles.uploadIcon}>{doc.icon}</Text>
                <Text style={styles.uploadLabel}>{doc.label}</Text>
                <Text style={styles.uploadBtn}>Upload ↑</Text>
              </TouchableOpacity>
            ))}
          </>
        )}

        {step === 7 && (
          <>
            <Text style={styles.sectionTitle}>Astrologer Agreement</Text>
            <View style={styles.legalBox}>
              <Text style={styles.legalText}>
                By joining AstroApp as an astrologer, you agree to:{'\n\n'}
                1. Provide honest and ethical consultations{'\n'}
                2. Maintain respectful communication{'\n'}
                3. Not share customer personal data{'\n'}
                4. Maintain at least 85% acceptance rate{'\n'}
                5. Complete KYC within 7 days of approval{'\n\n'}
                AstroApp reserves the right to suspend accounts that violate these terms.
              </Text>
            </View>
            <TouchableOpacity
              style={styles.checkRow}
              onPress={() => setAgreementAccepted(v => !v)}>
              <View style={[styles.checkbox, agreementAccepted && styles.checkboxOn]}>
                {agreementAccepted && <Text style={styles.checkTick}>✓</Text>}
              </View>
              <Text style={styles.checkLabel}>I have read and agree to the Astrologer Agreement</Text>
            </TouchableOpacity>
          </>
        )}

        {step === 8 && (
          <>
            <Text style={styles.sectionTitle}>Terms & Conditions</Text>
            <View style={styles.legalBox}>
              <Text style={styles.legalText}>
                By using AstroApp you agree to our Terms of Service:{'\n\n'}
                • Consultations are for entertainment and guidance purposes{'\n'}
                • AstroApp charges a 20% platform fee on earnings{'\n'}
                • Withdrawals are processed within 3–5 business days{'\n'}
                • Refunds are subject to our refund policy{'\n'}
                • Disputes must be reported within 24 hours{'\n\n'}
                Full Terms available at astroapp.in/terms
              </Text>
            </View>
            <TouchableOpacity
              style={styles.checkRow}
              onPress={() => setTermsAccepted(v => !v)}>
              <View style={[styles.checkbox, termsAccepted && styles.checkboxOn]}>
                {termsAccepted && <Text style={styles.checkTick}>✓</Text>}
              </View>
              <Text style={styles.checkLabel}>I accept the Terms & Conditions</Text>
            </TouchableOpacity>
          </>
        )}

        <View style={{height: 20}} />
        <Button
          label={step === TOTAL_STEPS ? 'Submit Application →' : 'Continue →'}
          onPress={handleNext}
          loading={loading}
        />
        <View style={{height: 40}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: Colors.bg},
  progressHdr: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  backBtn: {fontSize: 22, color: Colors.text, paddingRight: 4},
  stepLabel: {fontSize: 12, color: Colors.t2, marginBottom: 6},
  progressBar: {
    height: 4,
    backgroundColor: Colors.card2,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {height: '100%', backgroundColor: Colors.gold, borderRadius: 2},
  content: {paddingHorizontal: 20, paddingBottom: 40},
  sectionTitle: {fontSize: 20, fontWeight: '800', color: Colors.text, marginBottom: 6, marginTop: 4},
  fieldLabel: {fontSize: 11, fontWeight: '600', color: Colors.t2, marginBottom: 8, letterSpacing: 0.3},
  chipRow: {flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16},
  selChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: Colors.card,
    borderWidth: 1.5,
    borderColor: Colors.border2,
  },
  selChipActive: {backgroundColor: Colors.goldDim, borderColor: Colors.gold},
  selChipText: {fontSize: 12, fontWeight: '600', color: Colors.t2},
  selChipTextActive: {color: Colors.gold},
  rateNote: {fontSize: 13, color: Colors.t2, marginBottom: 20, lineHeight: 20},
  rateRow: {flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14},
  rateIcon: {fontSize: 22},
  perMin: {fontSize: 12, color: Colors.t2, alignSelf: 'center'},
  infoBox: {
    backgroundColor: Colors.goldDim2,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    padding: 14,
    marginTop: 8,
  },
  infoText: {fontSize: 12, color: Colors.t2, lineHeight: 18},
  uploadBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: Colors.card,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: Colors.border2,
    borderRadius: 14,
    marginBottom: 12,
  },
  uploadIcon: {fontSize: 24},
  uploadLabel: {flex: 1, fontSize: 13, fontWeight: '600', color: Colors.text},
  uploadBtn: {fontSize: 12, color: Colors.gold, fontWeight: '600'},
  legalBox: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border2,
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    maxHeight: 340,
  },
  legalText: {fontSize: 13, color: Colors.t2, lineHeight: 22},
  checkRow: {flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 16},
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.border2,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  checkboxOn: {backgroundColor: Colors.gold, borderColor: Colors.gold},
  checkTick: {fontSize: 12, color: '#1a0a00', fontWeight: '700'},
  checkLabel: {flex: 1, fontSize: 13, color: Colors.t2, lineHeight: 20},
});
