import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {AuthStackParamList} from './types';

import SplashScreen from '../screens/auth/SplashScreen';
import RoleScreen from '../screens/auth/RoleScreen';
import PhoneScreen from '../screens/auth/PhoneScreen';
import OtpScreen from '../screens/auth/OtpScreen';
import ProfileSetupScreen from '../screens/auth/ProfileSetupScreen';
import AstrologerRegisterScreen from '../screens/auth/AstrologerRegisterScreen';
import SubmittedScreen from '../screens/auth/SubmittedScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Role" component={RoleScreen} />
      <Stack.Screen name="Phone" component={PhoneScreen} />
      <Stack.Screen name="Otp" component={OtpScreen} />
      <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
      <Stack.Screen name="AstrologerRegister" component={AstrologerRegisterScreen} />
      <Stack.Screen name="Submitted" component={SubmittedScreen} />
    </Stack.Navigator>
  );
}
