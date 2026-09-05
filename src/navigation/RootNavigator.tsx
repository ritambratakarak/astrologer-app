import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import {Colors} from '../theme/colors';
import {useAuthStore} from '../store/authStore';
import AuthNavigator from './AuthNavigator';
import CustomerNavigator from './CustomerNavigator';
import AstrologerNavigator from './AstrologerNavigator';

type RootParamList = {
  Auth: undefined;
  Customer: undefined;
  Astrologer: undefined;
};

const Stack = createNativeStackNavigator<RootParamList>();

export default function RootNavigator() {
  const {isAuthenticated, isProfileComplete, role, isLoading, initFromStorage} = useAuthStore();

  useEffect(() => {
    initFromStorage();
  }, [initFromStorage]);

  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={Colors.gold} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {!isAuthenticated || !isProfileComplete ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : role === 'astrologer' ? (
          <Stack.Screen name="Astrologer" component={AstrologerNavigator} />
        ) : (
          <Stack.Screen name="Customer" component={CustomerNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
