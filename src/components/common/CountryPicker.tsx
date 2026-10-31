import React, {useState} from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {ChevronDownIcon, XMarkIcon} from 'react-native-heroicons/outline';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import countries from '../../data/countries.json';
import {Colors} from '../../theme/colors';

interface CountryPickerProps {
  value: string;
  onSelect: (country: string) => void;
  label?: string;
}

export default function CountryPicker({
  value,
  onSelect,
  label = 'COUNTRY',
}: CountryPickerProps) {
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState('');
  const insets = useSafeAreaInsets();

  function closePicker() {
    setVisible(false);
    setSearch('');
  }

  const filteredCountries = countries.filter(name =>
    name.toLowerCase().includes(search.trim().toLowerCase()),
  );

  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.trigger}
        onPress={() => setVisible(true)}
        accessibilityRole="button"
        accessibilityLabel={value || 'Select country'}>
        <Text style={[styles.triggerText, !value && styles.placeholder]}>
          {value || 'Select country'}
        </Text>
        <ChevronDownIcon size={20} color={Colors.t2} />
      </TouchableOpacity>
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={closePicker}>
        <View style={styles.backdrop}>
          <View style={[styles.modal, {paddingBottom: Math.max(insets.bottom, 12)}]}>
            <View style={styles.header}>
              <Text style={styles.title}>Select Country</Text>
              <TouchableOpacity
                onPress={closePicker}
                accessibilityRole="button"
                accessibilityLabel="Close country selector">
                <XMarkIcon size={22} color={Colors.t2} />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.search}
              placeholder="Search countries"
              placeholderTextColor={Colors.t3}
              value={search}
              onChangeText={setSearch}
              autoCorrect={false}
              autoCapitalize="none"
            />
            <FlatList
              data={filteredCountries}
              keyExtractor={name => name}
              keyboardShouldPersistTaps="handled"
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => {
                    onSelect(item);
                    closePicker();
                  }}
                  accessibilityRole="button">
                  <Text style={styles.optionText}>{item}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.empty}>No countries match your search.</Text>
              }
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.t2,
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.card,
    borderWidth: 1.5,
    borderColor: Colors.border2,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  triggerText: {fontSize: 16, color: Colors.text},
  placeholder: {color: Colors.t3},
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.65)',
  },
  modal: {
    height: '80%',
    backgroundColor: Colors.bg2,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {fontSize: 18, fontWeight: '700', color: Colors.text},
  search: {
    backgroundColor: Colors.card,
    borderWidth: 1.5,
    borderColor: Colors.border2,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 12,
    fontSize: 15,
    color: Colors.text,
  },
  option: {paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.border3},
  optionText: {fontSize: 15, color: Colors.text},
  empty: {paddingVertical: 20, textAlign: 'center', color: Colors.t2},
});
