import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Text, View, StyleSheet} from 'react-native';
import {Colors} from '../theme/colors';
import type {CustomerStackParamList, CustomerTabParamList} from './types';

import CustomerHomeScreen from '../screens/customer/HomeScreen';
import BrowseScreen from '../screens/customer/BrowseScreen';
import CustomerWalletScreen from '../screens/customer/WalletScreen';
import CustomerProfileScreen from '../screens/customer/ProfileScreen';
import AstrologerDetailScreen from '../screens/customer/AstrologerDetailScreen';
import BookScreen from '../screens/customer/BookScreen';
import PendingScreen from '../screens/customer/PendingScreen';
import ChatScreen from '../screens/customer/ChatScreen';
import SessionEndedScreen from '../screens/customer/SessionEndedScreen';
import ReviewScreen from '../screens/customer/ReviewScreen';
import RejectedScreen from '../screens/customer/RejectedScreen';
import TransactionsScreen from '../screens/customer/TransactionsScreen';
import NotificationsScreen from '../screens/customer/NotificationsScreen';

const Tab = createBottomTabNavigator<CustomerTabParamList>();
const Stack = createNativeStackNavigator<CustomerStackParamList>();

function TabIcon({emoji, label, focused}: {emoji: string; label: string; focused: boolean}) {
  return (
    <View style={styles.tabItem}>
      <Text style={styles.tabEmoji}>{emoji}</Text>
      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{label}</Text>
      {focused && <View style={styles.tabBar} />}
    </View>
  );
}

function CustomerTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabNav,
        tabBarShowLabel: false,
      }}>
      <Tab.Screen
        name="HomeTab"
        component={CustomerHomeScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <TabIcon emoji="🏠" label="Home" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="BrowseTab"
        component={BrowseScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <TabIcon emoji="🔍" label="Browse" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="ConsultTab"
        component={BrowseScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <TabIcon emoji="💬" label="Consult" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="WalletTab"
        component={CustomerWalletScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <TabIcon emoji="💰" label="Wallet" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={CustomerProfileScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <TabIcon emoji="👤" label="Me" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function CustomerNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="CustomerTabs" component={CustomerTabs} />
      <Stack.Screen name="AstrologerDetail" component={AstrologerDetailScreen} />
      <Stack.Screen name="Book" component={BookScreen} />
      <Stack.Screen name="Pending" component={PendingScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="SessionEnded" component={SessionEndedScreen} />
      <Stack.Screen name="Review" component={ReviewScreen} />
      <Stack.Screen name="Rejected" component={RejectedScreen} />
      <Stack.Screen name="Transactions" component={TransactionsScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  tabNav: {
    backgroundColor: Colors.bg2,
    borderTopColor: Colors.border2,
    borderTopWidth: 1,
    height: 64,
    paddingBottom: 0,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingTop: 8,
  },
  tabEmoji: {fontSize: 20},
  tabLabel: {fontSize: 9, fontWeight: '600', color: Colors.t3, letterSpacing: 0.3},
  tabLabelActive: {color: Colors.gold},
  tabBar: {width: 22, height: 3, borderRadius: 2, backgroundColor: Colors.gold, marginTop: 2},
});
