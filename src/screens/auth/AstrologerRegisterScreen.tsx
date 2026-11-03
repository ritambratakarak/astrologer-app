import React, {useEffect, useState} from 'react';
import {
  Modal,
  Platform,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import DateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import {pick, types, isErrorWithCode, errorCodes} from '@react-native-documents/picker';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Colors} from '../../theme/colors';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import CountryPicker from '../../components/common/CountryPicker';
import {registrationService} from '../../services/registrationService';
import {SPECIALIZATIONS, LANGUAGES} from '../../constants';
import type {AuthScreenProps} from '../../navigation/types';
import type {
  AstrologerKycRegistrationData,
  RegistrationDocumentFile,
  RegistrationDocumentKind,
} from '../../types/registration';

type DocumentSlot = 'profilePhoto' | 'panCard' | 'aadhaarCard';

type RegistrationDocuments = {
  profilePhoto: RegistrationDocumentFile | null;
  panCard: RegistrationDocumentFile | null;
  aadhaarCard: RegistrationDocumentFile | null;
  certificates: RegistrationDocumentFile[];
};

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

function formatDate(date: Date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}/${date.getFullYear()}`;
}

function parseDate(value: string) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!match) {
    return null;
  }
  const [, day, month, year] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  if (
    date.getDate() !== Number(day) ||
    date.getMonth() !== Number(month) - 1 ||
    date.getFullYear() !== Number(year)
  ) {
    return null;
  }
  return date;
}

export default function AstrologerRegisterScreen({navigation}: AuthScreenProps<'AstrologerRegister'>) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState<RegistrationDocuments>({
    profilePhoto: null,
    panCard: null,
    aadhaarCard: null,
    certificates: [],
  });

  // Form state
  const [fullName, setFullName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [dob, setDob] = useState('');
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [pickerDate, setPickerDate] = useState(new Date());
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [country, setCountry] = useState('');

  const [experience, setExperience] = useState('');
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>([]);
  const [selectedLangs, setSelectedLangs] = useState<string[]>([]);
  const [bio, setBio] = useState('');

  const [chatRate, setChatRate] = useState('20');
  const [callRate, setCallRate] = useState('20');
  const [videoRate, setVideoRate] = useState('20');

  const [aadhaar, setAadhaar] = useState('');
  const [pan, setPan] = useState('');

  const [bankAccount, setBankAccount] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [bankName, setBankName] = useState('');

  const [agreementAccepted, setAgreementAccepted] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    console.log(
      `[AstrologerRegistration] Step ${step} of ${TOTAL_STEPS}: ${STEP_TITLES[step - 1]}`,
    );
  }, [step]);

  function isStepValid(currentStep: number) {
    switch (currentStep) {
      case 1:
        return Boolean(
          fullName.trim() &&
            displayName.trim() &&
            parseDate(dob) &&
            city.trim() &&
            state.trim() &&
            /^\d{6}$/.test(pincode) &&
            country.trim(),
        );
      case 2:
        return (
          experience.trim() !== '' &&
          Number.isFinite(Number(experience)) &&
          Number(experience) >= 0 &&
          selectedSpecs.length > 0 &&
          selectedLangs.length > 0 &&
          bio.trim() !== ''
        );
      case 3:
        return [chatRate, callRate, videoRate].every(
          rate => rate.trim() !== '' && Number.isFinite(Number(rate)) && Number(rate) >= 10,
        );
      case 4:
        return (
          aadhaar.length === 12 &&
          /^\d{12}$/.test(aadhaar) &&
          /^[A-Z]{5}\d{4}[A-Z]$/.test(pan.trim().toUpperCase())
        );
      case 5:
        return Boolean(
          accountHolder.trim() &&
            bankName.trim() &&
            bankAccount.trim() &&
            ifsc.trim(),
        );
      case 6:
        return Boolean(
          documents.profilePhoto &&
            documents.panCard &&
            documents.aadhaarCard &&
            documents.certificates.length > 0,
        );
      case 7:
        return agreementAccepted;
      case 8:
        return termsAccepted;
      default:
        return false;
    }
  }

  const canContinue = isStepValid(step);

  function toggleSpec(s: string) {
    setSelectedSpecs(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s],
    );
  }

  function openDatePicker() {
    const initialDate = parseDate(dob) ?? new Date();
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: initialDate,
        mode: 'date',
        display: 'default',
        maximumDate: new Date(),
        onChange: (event, selectedDate) => {
          if (event.type === 'set' && selectedDate) {
            setDob(formatDate(selectedDate));
          }
        },
      });
      return;
    }
    setPickerDate(initialDate);
    setDatePickerVisible(true);
  }

  function toggleLang(l: string) {
    setSelectedLangs(prev =>
      prev.includes(l) ? prev.filter(x => x !== l) : [...prev, l],
    );
  }

  async function chooseDocuments(target: DocumentSlot | 'certificates') {
    try {
      const selectedFiles = await pick({
        type: target === 'profilePhoto' ? [types.images] : [types.images, types.pdf],
        allowMultiSelection: target === 'certificates',
      });
      const files: RegistrationDocumentFile[] = selectedFiles.map((file, index) => ({
        uri: file.uri,
        name: file.name ?? `${target}-${Date.now()}-${index + 1}`,
        type: file.type ?? 'application/octet-stream',
      }));

      if (target === 'certificates') {
        setDocuments(current => ({
          ...current,
          certificates: [...current.certificates, ...files],
        }));
      } else {
        setDocuments(current => ({...current, [target]: files[0]}));
      }
    } catch (error) {
      if (isErrorWithCode(error) && error.code === errorCodes.OPERATION_CANCELED) {
        return;
      }
      Alert.alert('File Selection Failed', 'Could not select the document. Please try again.');
    }
  }

  function markDocumentUploaded(uri: string, uploadedUrl: string) {
    setDocuments(current => ({
      profilePhoto:
        current.profilePhoto?.uri === uri
          ? {...current.profilePhoto, uploadedUrl}
          : current.profilePhoto,
      panCard:
        current.panCard?.uri === uri
          ? {...current.panCard, uploadedUrl}
          : current.panCard,
      aadhaarCard:
        current.aadhaarCard?.uri === uri
          ? {...current.aadhaarCard, uploadedUrl}
          : current.aadhaarCard,
      certificates: current.certificates.map(file =>
        file.uri === uri ? {...file, uploadedUrl} : file,
      ),
    }));
  }

  async function uploadDocument(
    file: RegistrationDocumentFile,
    documentType: RegistrationDocumentKind,
  ) {
    if (file.uploadedUrl) {
      return file.uploadedUrl;
    }
    const uploadedUrl = await registrationService.uploadDocument(file, documentType);
    markDocumentUploaded(file.uri, uploadedUrl);
    return uploadedUrl;
  }

  async function handleNext() {
    console.log(`[AstrologerRegistration] Continuing from step ${step}`);

    if (step === 7 && !agreementAccepted) {
      Alert.alert('Required', 'Please accept the Astrologer Agreement to continue.');
      return;
    }

    if (step === 8 && !termsAccepted) {
      Alert.alert('Required', 'Please accept the Terms & Conditions to submit.');
      return;
    }

    if (step === 6) {
      const {profilePhoto, panCard, aadhaarCard, certificates} = documents;
      if (!profilePhoto || !panCard || !aadhaarCard || certificates.length === 0) {
        Alert.alert(
          'Required',
          'Please select a profile photo, PAN card, Aadhaar card, and at least one certificate.',
        );
        return;
      }

      try {
        setLoading(true);
        await Promise.all([
          uploadDocument(profilePhoto, 'profilePhoto'),
          uploadDocument(panCard, 'panCard'),
          uploadDocument(aadhaarCard, 'aadhaarCard'),
          ...certificates.map(certificate =>
            uploadDocument(certificate, 'certificate'),
          ),
        ]);
        console.log('[AstrologerRegistration] Documents uploaded for step 6');
        setStep(7);
      } catch {
        Alert.alert('Error', 'Could not upload documents. Please try again.');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (step < TOTAL_STEPS) {
      if (step === 1 && !/^\d{6}$/.test(pincode)) {
        Alert.alert('Invalid Pincode', 'Please enter a valid 6-digit pincode.');
        return;
      }
      if (step === 1 && !country) {
        Alert.alert('Required', 'Please select your country.');
        return;
      }
      setStep(s => s + 1);
      return;
    }
    const {profilePhoto, panCard, aadhaarCard} = documents;
    if (!profilePhoto?.uploadedUrl || !panCard?.uploadedUrl || !aadhaarCard?.uploadedUrl) {
      Alert.alert('Required', 'Please upload all required documents before submitting.');
      return;
    }

    try {
      setLoading(true);
      const payload: AstrologerKycRegistrationData = {
        fullName,
        displayName,
        dob,
        gender,
        experience: Number(experience),
        address: {city, state, pincode, country},
        specializations: selectedSpecs,
        languages: selectedLangs,
        bio,
        chatRate: Number(chatRate),
        voiceCallRate: Number(callRate),
        videoCallRate: Number(videoRate),
        panCard: {number: pan, photoUrl: panCard.uploadedUrl},
        aadharCard: {number: aadhaar, photoUrl: aadhaarCard.uploadedUrl},
        profilePhotoUrl: profilePhoto.uploadedUrl,
        certificateUrls: documents.certificates.map(certificate => {
          if (!certificate.uploadedUrl) {
            throw new Error('Certificate upload response did not include a URL.');
          }
          return certificate.uploadedUrl;
        }),
        bankDetails: {
          accountHolderName: accountHolder,
          accountNumber: bankAccount,
          bankName,
          ifscCode: ifsc,
        },
      };
      console.log('[AstrologerRegistration] Submitting KYC application from step 8');
      const response = await registrationService.submitKyc(payload);
      navigation.navigate('Submitted', {applicationId: response.applicationId});
    } catch {
      Alert.alert('Error', 'Could not submit the application. Please try again.');
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
          <TouchableOpacity onPress={() => setStep(s => s - 1)} disabled={loading}>
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
            <Text style={styles.fieldLabel}>DATE OF BIRTH</Text>
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={openDatePicker}
              accessibilityRole="button"
              accessibilityLabel={dob ? `Date of birth, ${dob}` : 'Select date of birth'}>
              <Text style={[styles.datePickerText, !dob && styles.datePickerPlaceholder]}>
                {dob || 'DD/MM/YYYY'}
              </Text>
            </TouchableOpacity>
            <Input label="CITY" placeholder="New Delhi" value={city} onChangeText={setCity} />
            <Input label="STATE" placeholder="Delhi" value={state} onChangeText={setState} />
            <Input
              label="PINCODE"
              placeholder="110001"
              value={pincode}
              onChangeText={value => setPincode(value.replace(/\D/g, '').slice(0, 6))}
              keyboardType="number-pad"
              maxLength={6}
            />
            <CountryPicker value={country} onSelect={setCountry} />
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
            <Input
              label="AADHAAR NUMBER"
              placeholder="XXXX XXXX XXXX"
              value={aadhaar}
              onChangeText={value =>
                setAadhaar(value.replace(/\D/g, '').slice(0, 12))
              }
              keyboardType="numeric"
              maxLength={12}
            />
            <Input
              label="PAN NUMBER"
              placeholder="ABCDE1234F"
              value={pan}
              onChangeText={value =>
                setPan(value.replace(/\s/g, '').toUpperCase().slice(0, 10))
              }
              autoCapitalize="characters"
              maxLength={10}
            />
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
            <Text style={styles.rateNote}>
              Select your documents now. They will be uploaded before you review the agreements.
            </Text>
            <TouchableOpacity
              style={styles.uploadBox}
              onPress={() => chooseDocuments('profilePhoto')}
              disabled={loading}>
              <Text style={styles.uploadIcon}>🤳</Text>
              <Text style={styles.uploadLabel}>Profile Photo</Text>
              <Text style={styles.uploadBtn}>
                {documents.profilePhoto?.uploadedUrl ? 'Uploaded ✓' : documents.profilePhoto ? 'Selected' : 'Choose ↑'}
              </Text>
            </TouchableOpacity>
            {documents.profilePhoto && (
              <Text style={styles.uploadFileName}>{documents.profilePhoto.name}</Text>
            )}

            {([
              {slot: 'panCard', label: 'PAN Card'},
              {slot: 'aadhaarCard', label: 'Aadhaar Card'},
            ] as const).map(({slot, label}) => {
              const file = documents[slot];
              return (
                <React.Fragment key={slot}>
                  <TouchableOpacity
                    style={styles.uploadBox}
                    onPress={() => chooseDocuments(slot)}
                    disabled={loading}>
                    <Text style={styles.uploadIcon}>🪪</Text>
                    <Text style={styles.uploadLabel}>{label}</Text>
                    <Text style={styles.uploadBtn}>
                      {file?.uploadedUrl ? 'Uploaded ✓' : file ? 'Selected' : 'Choose ↑'}
                    </Text>
                  </TouchableOpacity>
                  {file && <Text style={styles.uploadFileName}>{file.name}</Text>}
                </React.Fragment>
              );
            })}

            <TouchableOpacity
              style={styles.uploadBox}
              onPress={() => chooseDocuments('certificates')}
              disabled={loading}>
              <Text style={styles.uploadIcon}>📜</Text>
              <Text style={styles.uploadLabel}>Certificates / Degrees</Text>
              <Text style={styles.uploadBtn}>
                {documents.certificates.length > 0
                  ? `${documents.certificates.length} selected`
                  : 'Choose ↑'}
              </Text>
            </TouchableOpacity>
            {documents.certificates.map(file => (
              <View key={file.uri} style={styles.uploadFileRow}>
                <Text style={styles.uploadFileName}>
                  {file.name} · {file.uploadedUrl ? 'Uploaded' : 'Selected'}
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    setDocuments(current => ({
                      ...current,
                      certificates: current.certificates.filter(
                        item => item.uri !== file.uri,
                      ),
                    }))
                  }
                  disabled={loading}
                  accessibilityRole="button"
                  accessibilityLabel={`Remove ${file.name}`}>
                  <Text style={styles.removeFile}>Remove</Text>
                </TouchableOpacity>
              </View>
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
          disabled={!canContinue}
        />
        <View style={{height: 40}} />
      </ScrollView>
      {Platform.OS === 'ios' && (
        <Modal
          visible={datePickerVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setDatePickerVisible(false)}>
          <View style={styles.dateModalBackdrop}>
            <View style={styles.dateModal}>
              <View style={styles.dateModalHeader}>
                <TouchableOpacity
                  onPress={() => setDatePickerVisible(false)}
                  accessibilityRole="button">
                  <Text style={styles.dateModalAction}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.dateModalTitle}>Date of Birth</Text>
                <TouchableOpacity
                  onPress={() => {
                    setDob(formatDate(pickerDate));
                    setDatePickerVisible(false);
                  }}
                  accessibilityRole="button">
                  <Text style={styles.dateModalAction}>Done</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={pickerDate}
                mode="date"
                display="spinner"
                locale="en-GB"
                themeVariant="dark"
                accentColor={Colors.gold}
                maximumDate={new Date()}
                onValueChange={(_, selectedDate) => setPickerDate(selectedDate)}
              />
            </View>
          </View>
        </Modal>
      )}
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
  datePickerButton: {
    backgroundColor: Colors.card,
    borderWidth: 1.5,
    borderColor: Colors.border2,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  datePickerText: {fontSize: 16, color: Colors.text},
  datePickerPlaceholder: {color: Colors.t3},
  dateModalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.65)',
  },
  dateModal: {
    backgroundColor: Colors.bg2,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 24,
  },
  dateModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border3,
  },
  dateModalTitle: {fontSize: 16, fontWeight: '700', color: Colors.text},
  dateModalAction: {fontSize: 15, fontWeight: '600', color: Colors.gold},
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
  uploadFileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: -4,
    marginBottom: 10,
  },
  uploadFileName: {fontSize: 12, color: Colors.t2, marginTop: -4, marginBottom: 12},
  removeFile: {fontSize: 12, color: Colors.gold, fontWeight: '600', paddingLeft: 12},
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
