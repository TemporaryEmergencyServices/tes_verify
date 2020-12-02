import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { ColorSchemeName } from 'react-native';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';

import NotFoundScreen from '../screens/NotFoundScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import { RootStackParamList } from '../types';
import BottomTabNavigator from './BottomTabNavigator';
import ManagerBottomTabNavigator from './ManagerBottomTabNavigator';
import SuperuserBottomTabNavigator from './SuperuserBottomTabNavigator';
import ApplyScreen from '../screens/ApplyScreen';
import ManagerApproveApplicationScreen from '../screens/ManagerApproveApplicationScreen';
import DisplayQRScreen from '../screens/DisplayQRScreen';
import LinkingConfiguration from './LinkingConfiguration';
import ReApplyScreen from '../screens/ReApplyScreen';
import ManagerRecordsScreen from '../screens/ManagerRecordsScreen';
import CreateClockRecordScreen from '../screens/CreateClockRecordScreen';
import ManualClockOutScreen from '../screens/ManualClockOutScreen';
import QueryClockScreen from '../screens/QueryClockScreen';
import DisplayQueryClockScreen from '../screens/DisplayQueryClockScreen';


// If you are not familiar with React Navigation, we recommend going through the
// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
//const Stack = createStackNavigator<RootStackParamList>();
const Stack = createStackNavigator();


function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Root" component={SignInScreen} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
      <Stack.Screen name="SignInScreen" component={SignInScreen} />
      <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
      <Stack.Screen name="BottomTabNavigator" component={BottomTabNavigator} />
      <Stack.Screen name="ManagerBottomTabNavigator" component={ManagerBottomTabNavigator} />
      <Stack.Screen name="SuperuserBottomTabNavigator" component={SuperuserBottomTabNavigator} />
      <Stack.Screen name="ApplyScreen" component={ApplyScreen} />
      <Stack.Screen name="ManagerApproveApplicationScreen" component={ManagerApproveApplicationScreen} />
      <Stack.Screen name="DisplayQRScreen" component={DisplayQRScreen} />
      <Stack.Screen name="ReApplyScreen" component={ReApplyScreen} />
      <Stack.Screen name="ManagerRecordsScreen" component={ManagerRecordsScreen} />
      <Stack.Screen name="CreateClockRecordScreen" component={CreateClockRecordScreen} /> 
      <Stack.Screen name="ManualClockOutScreen" component={ManualClockOutScreen} /> 
      <Stack.Screen name="QueryClockScreen" component={QueryClockScreen} /> 
      <Stack.Screen name="DisplayQueryClockScreen" component={DisplayQueryClockScreen} /> 

    </Stack.Navigator>
  );
}
