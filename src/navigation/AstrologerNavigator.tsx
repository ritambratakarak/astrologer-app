import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Text, View, StyleSheet} from 'react-native';
import {Colors} from '../theme/colors';
import type {AstrologerStackParamList, AstrologerTabParamList} from './types';

import AstrologerHomeScreen from '../screens/astrologer/HomeScreen';
import IncomingScreen from '../screens/astrologer/IncomingScreen';
import AstrologerChatScreen from '../screens/astrologer/ChatScreen';
import EarningsScreen from '../screens/astrologer/EarningsScreen';
import AstrologerProfileScreen from '../screens/astrologer/ProfileScreen';
import AstrologerNotificationsScreen from '../screens/customer/NotificationsScreen';

const Tab = createBottomTabNavigator<AstrologerTabParamList>();
const Stack = createNativeStackNavigator<AstrologerStackParamList>();

function TabIcon({emoji, label, focused}: {emoji: string; label: string; focused: boolean}) {
  return (
    <View style={styles.tabItem}>
      <Text style={styles.tabEmoji}>{emoji}</Text>
      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{label}</Text>
      {focused && <View style={styles.tabBar} />}
    </View>
  );
}

function AstrologerTabs() {
  return (
    <Tab.Navigator
      screenOptions={{headerShown: false, tabBarStyle: styles.tabNav, tabBarShowLabel: false}}>
      <Tab.Screen
        name="DashboardTab"
        component={AstrologerHomeScreen}
        options={{tabBarIcon: ({focused}) => <TabIcon emoji="🏠" label="Dashboard" focused={focused} />}}
      />
      <Tab.Screen
        name="RequestsTab"
        component={AstrologerHomeScreen}
        options={{tabBarIcon: ({focused}) => <TabIcon emoji="📋" label="Requests" focused={focused} />}}
      />
      <Tab.Screen
        name="SessionsTab"
        component={AstrologerHomeScreen}
        options={{tabBarIcon: ({focused}) => <TabIcon emoji="💬" label="Sessions" focused={focused} />}}
      />
      <Tab.Screen
        name="EarningsTab"
        component={EarningsScreen}
        options={{tabBarIcon: ({focused}) => <TabIcon emoji="💰" label="Earnings" focused={focused} />}}
      />
      <Tab.Screen
        name="ProfileTab"
        component={AstrologerProfileScreen}
        options={{tabBarIcon: ({focused}) => <TabIcon emoji="👤" label="Profile" focused={focused} />}}
      />
    </Tab.Navigator>
  );
}

export default function AstrologerNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="AstrologerTabs" component={AstrologerTabs} />
      <Stack.Screen name="Incoming" component={IncomingScreen} />
      <Stack.Screen name="AstrologerChat" component={AstrologerChatScreen} />
      <Stack.Screen name="AstrologerNotifications" component={AstrologerNotificationsScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  tabNav: {
    backgroundColor: Colors.bg2,
    borderTopColor: Colors.border2,
    borderTopWidth: 1,
    height: 64,
  },
  tabItem: {alignItems: 'center', justifyContent: 'center', gap: 3, paddingTop: 8},
  tabEmoji: {fontSize: 20},
  tabLabel: {fontSize: 9, fontWeight: '600', color: Colors.t3, letterSpacing: 0.3},
  tabLabelActive: {color: Colors.gold},
  tabBar: {width: 22, height: 3, borderRadius: 2, backgroundColor: Colors.gold, marginTop: 2},
});
