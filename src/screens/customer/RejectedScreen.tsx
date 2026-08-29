import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Colors} from '../../theme/colors';
import Button from '../../components/common/Button';
import type {CustomerScreenProps} from '../../navigation/types';

export default function RejectedScreen({navigation, route}: CustomerScreenProps<'Rejected'>) {
  const {astrologerName} = route.params;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.screen}>
        <View style={styles.icon}><Text style={{fontSize: 44}}>❌</Text></View>
        <Text style={styles.title}>Request Declined</Text>
        <Text style={styles.subtitle}>
          {astrologerName} is unavailable right now.{'\n'}Try another astrologer.
        </Text>

        <View style={{width: '100%', gap: 12, marginTop: 16}}>
          <Button
            label="Browse Astrologers"
            onPress={() => navigation.navigate('CustomerTabs', {screen: 'BrowseTab'} as never)}
          />
          <Button
            label="Back to Home"
            variant="ghost"
            onPress={() => navigation.navigate('CustomerTabs')}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: Colors.bg},
  screen: {flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32},
  icon: {width: 100, height: 100, borderRadius: 50, backgroundColor: Colors.redDim, borderWidth: 2, borderColor: 'rgba(248,113,113,0.3)', alignItems: 'center', justifyContent: 'center', marginBottom: 24},
  title: {fontSize: 24, fontWeight: '800', color: Colors.text, marginBottom: 8},
  subtitle: {fontSize: 13, color: Colors.t2, lineHeight: 22, textAlign: 'center'},
});
