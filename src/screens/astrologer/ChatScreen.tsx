import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Colors} from '../../theme/colors';
import {consultationService} from '../../services/consultationService';
import type {AstrologerScreenProps} from '../../navigation/types';

interface Message {
  id: string;
  text: string;
  isOut: boolean;
  time: string;
}

const INITIAL_MESSAGES: Message[] = [
  {id: 'sys', text: 'Session started', isOut: false, time: ''},
  {id: '1', text: 'Namaste Pandiji! DOB: 15 March 1990, Time: 6:30 AM, Mumbai. I want career guidance.', isOut: false, time: '10:31 AM'},
];

export default function AstrologerChatScreen({navigation, route}: AstrologerScreenProps<'AstrologerChat'>) {
  const {consultationId, customerName, ratePerMinute} = route.params;
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [elapsed, setElapsed] = useState(0);
  const flatRef = useRef<FlatList>(null);

  useEffect(() => {
    const iv = setInterval(() => setElapsed(s => s + 1), 1000);
    return () => clearInterval(iv);
  }, []);

  const timerStr = `${String(Math.floor(elapsed / 60)).padStart(2, '0')}:${String(elapsed % 60).padStart(2, '0')}`;

  function sendMsg() {
    if (!input.trim()) {
      return;
    }
    const h = new Date().getHours();
    const m = String(new Date().getMinutes()).padStart(2, '0');
    const msg: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      isOut: true,
      time: `${h}:${m} ${h < 12 ? 'AM' : 'PM'} ✓✓`,
    };
    setMessages(prev => [...prev, msg]);
    setInput('');
    consultationService.sendMessage(consultationId, msg.text).catch(() => null);
    setTimeout(() => flatRef.current?.scrollToEnd({animated: true}), 100);
  }

  async function endSession() {
    await consultationService.end(consultationId).catch(() => null);
    navigation.navigate('AstrologerTabs');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.chatHdr}>
          <TouchableOpacity style={styles.backBtn}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <View style={styles.hdrAv}><Text style={{fontSize: 16}}>👤</Text></View>
          <View style={styles.hdrInfo}>
            <Text style={styles.hdrName}>{customerName}</Text>
            <Text style={styles.hdrStatus}>● Active session</Text>
          </View>
          <View style={styles.timerBadge}><Text style={styles.timerText}>{timerStr}</Text></View>
        </View>

        <FlatList
          ref={flatRef}
          data={messages}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.msgList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatRef.current?.scrollToEnd({animated: false})}
          renderItem={({item}) => {
            if (item.id === 'sys') {
              return <Text style={styles.sysMsg}>Session started — ₹{ratePerMinute}/min</Text>;
            }
            return (
              <View style={[styles.msg, item.isOut ? styles.msgOut : styles.msgIn]}>
                <Text style={styles.msgText}>{item.text}</Text>
                {item.time && (
                  <Text style={[styles.msgTime, item.isOut && styles.msgTimeRight]}>{item.time}</Text>
                )}
              </View>
            );
          }}
        />

        <View style={styles.actionRow}>
          <TouchableOpacity style={[styles.actionBtn, styles.actionDanger]} onPress={endSession}>
            <Text style={{fontSize: 12, fontWeight: '600', color: Colors.red}}>End Session</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Text style={styles.actionText}>📎 Attach</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputBar}>
          <TextInput
            style={styles.textInput}
            placeholder="Type a message..."
            placeholderTextColor={Colors.t3}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={sendMsg}
            returnKeyType="send"
            multiline
          />
          <TouchableOpacity style={styles.sendBtn} onPress={sendMsg}>
            <Text style={{fontSize: 16, color: '#1a0a00'}}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: Colors.bg},
  chatHdr: {flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, paddingHorizontal: 16, backgroundColor: Colors.card3, borderBottomWidth: 1, borderBottomColor: Colors.border2},
  backBtn: {width: 32, height: 32, borderRadius: 10, backgroundColor: Colors.card, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border2},
  backIcon: {fontSize: 14, color: Colors.text},
  hdrAv: {width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.card2, alignItems: 'center', justifyContent: 'center'},
  hdrInfo: {flex: 1},
  hdrName: {fontSize: 15, fontWeight: '700', color: Colors.text},
  hdrStatus: {fontSize: 11, color: Colors.green},
  timerBadge: {backgroundColor: 'rgba(248,113,113,0.15)', borderWidth: 1, borderColor: 'rgba(248,113,113,0.3)', borderRadius: 20, paddingVertical: 4, paddingHorizontal: 10},
  timerText: {fontSize: 12, fontWeight: '700', color: Colors.red},
  msgList: {padding: 14, gap: 8},
  sysMsg: {textAlign: 'center', fontSize: 11, color: Colors.t3, paddingVertical: 8},
  msg: {maxWidth: '75%', padding: 10, paddingHorizontal: 13, borderRadius: 16},
  msgOut: {backgroundColor: '#3b2f6b', borderWidth: 1, borderColor: 'rgba(167,139,250,0.2)', borderBottomRightRadius: 4, alignSelf: 'flex-end'},
  msgIn: {backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border2, borderBottomLeftRadius: 4, alignSelf: 'flex-start'},
  msgText: {fontSize: 14, color: Colors.text, lineHeight: 21},
  msgTime: {fontSize: 10, color: Colors.t2, marginTop: 4},
  msgTimeRight: {textAlign: 'right'},
  actionRow: {flexDirection: 'row', gap: 8, padding: 8, paddingHorizontal: 12},
  actionBtn: {paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border2},
  actionDanger: {backgroundColor: Colors.redDim, borderColor: 'rgba(248,113,113,0.4)'},
  actionText: {fontSize: 11, fontWeight: '600', color: Colors.t2},
  inputBar: {flexDirection: 'row', alignItems: 'flex-end', gap: 8, padding: 10, paddingHorizontal: 12, backgroundColor: Colors.card3, borderTopWidth: 1, borderTopColor: Colors.border2},
  textInput: {flex: 1, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border2, borderRadius: 22, paddingVertical: 10, paddingHorizontal: 16, fontSize: 14, color: Colors.text, maxHeight: 100},
  sendBtn: {width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.gold, alignItems: 'center', justifyContent: 'center'},
});
