import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Colors} from '../../theme/colors';

interface AppHeaderProps {
  title?: string;
  onBack?: () => void;
  rightLabel?: string;
  onRightPress?: () => void;
}

export default function AppHeader({title, onBack, rightLabel, onRightPress}: AppHeaderProps) {
  return (
    <View style={styles.hdr}>
      {onBack ? (
        <TouchableOpacity style={styles.back} onPress={onBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.backPlaceholder} />
      )}
      {title ? <Text style={styles.title}>{title}</Text> : <View style={{flex: 1}} />}
      {rightLabel ? (
        <TouchableOpacity onPress={onRightPress}>
          <Text style={styles.action}>{rightLabel}</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.backPlaceholder} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  hdr: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    paddingTop: 10,
  },
  back: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border2,
    flexShrink: 0,
  },
  backIcon: {fontSize: 17, color: Colors.text},
  backPlaceholder: {width: 36},
  title: {flex: 1, fontSize: 18, fontWeight: '700', color: Colors.text},
  action: {fontSize: 13, color: Colors.gold, fontWeight: '600'},
});
