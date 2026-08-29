import React, {useState} from 'react';
import {View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet, Alert} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Colors} from '../../theme/colors';
import AppHeader from '../../components/common/AppHeader';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Toast from '../../components/common/Toast';
import {reviewService} from '../../services/reviewService';
import type {CustomerScreenProps} from '../../navigation/types';

const LABELS = ['', 'Poor', 'Fair', 'Good', 'Excellent!', 'Amazing! ✨'];

export default function ReviewScreen({navigation, route}: CustomerScreenProps<'Review'>) {
  const {consultationId, astrologerName} = route.params;
  const [rating, setRating] = useState(4);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  async function submit() {
    try {
      setLoading(true);
      await reviewService.submitReview({consultationId, rating, comment: comment.trim() || undefined});
      setToastVisible(true);
      setTimeout(() => navigation.navigate('CustomerTabs'), 2500);
    } catch {
      Alert.alert('Error', 'Could not submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <AppHeader title="Leave a Review" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.topSection}>
          <View style={styles.av}><Text style={{fontSize: 24}}>🧙</Text></View>
          <Text style={styles.title}>How was your session?</Text>
          <Text style={styles.subtitle}>with {astrologerName}</Text>
        </View>

        <View style={styles.starRow}>
          {[1, 2, 3, 4, 5].map(n => (
            <TouchableOpacity key={n} onPress={() => setRating(n)}>
              <Text style={styles.star}>{n <= rating ? '⭐' : '☆'}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.ratingLabel}>{LABELS[rating]}</Text>

        <View style={{marginBottom: 20}}>
          <Text style={styles.fieldLabel}>YOUR REVIEW (OPTIONAL)</Text>
          <TextInput
            style={styles.textarea}
            placeholder="Share your experience..."
            placeholderTextColor={Colors.t3}
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <Card variant="small" style={{marginBottom: 20}}>
          <Text style={styles.infoText}>ℹ️ Each consultation can only be reviewed once. Your review helps other seekers.</Text>
        </Card>

        <Button label="Submit Review" onPress={submit} loading={loading} />
        <View style={{height: 12}} />
        <Button label="Skip" variant="ghost" onPress={() => navigation.navigate('CustomerTabs')} />
        <View style={{height: 40}} />
      </ScrollView>

      <Toast
        message="Review submitted! Thank you ✨"
        visible={toastVisible}
        onHide={() => setToastVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: Colors.bg},
  content: {paddingHorizontal: 20, paddingBottom: 40},
  topSection: {alignItems: 'center', paddingTop: 16, paddingBottom: 8},
  av: {width: 52, height: 52, borderRadius: 26, backgroundColor: Colors.card2, alignItems: 'center', justifyContent: 'center', marginBottom: 10},
  title: {fontSize: 22, fontWeight: '800', color: Colors.text},
  subtitle: {fontSize: 13, color: Colors.t2, marginTop: 5},
  starRow: {flexDirection: 'row', justifyContent: 'center', gap: 8, marginVertical: 20},
  star: {fontSize: 36},
  ratingLabel: {textAlign: 'center', fontSize: 15, fontWeight: '700', color: Colors.gold, marginBottom: 16},
  fieldLabel: {fontSize: 11, fontWeight: '600', color: Colors.t2, marginBottom: 6, letterSpacing: 0.3},
  textarea: {backgroundColor: Colors.card, borderWidth: 1.5, borderColor: Colors.border2, borderRadius: 10, padding: 14, fontSize: 14, color: Colors.text, minHeight: 100},
  infoText: {fontSize: 11, color: Colors.t2, lineHeight: 18},
});
