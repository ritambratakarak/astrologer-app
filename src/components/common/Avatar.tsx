import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Colors} from '../../theme/colors';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  emoji?: string;
  size?: AvatarSize;
}

const sizeMap: Record<AvatarSize, {width: number; height: number; fontSize: number}> = {
  sm: {width: 40, height: 40, fontSize: 16},
  md: {width: 52, height: 52, fontSize: 20},
  lg: {width: 72, height: 72, fontSize: 28},
  xl: {width: 90, height: 90, fontSize: 36},
};

export default function Avatar({emoji = '👤', size = 'md'}: AvatarProps) {
  const dim = sizeMap[size];
  return (
    <View
      style={[
        styles.av,
        {width: dim.width, height: dim.height},
      ]}>
      <Text style={{fontSize: dim.fontSize}}>{emoji}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  av: {
    borderRadius: 100,
    backgroundColor: Colors.card2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
