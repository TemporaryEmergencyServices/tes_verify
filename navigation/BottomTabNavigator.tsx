import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import ManagerApproveScreen from '../screens/ManagerApproveScreen'
import ManagerApproveApplicationScreen from '../screens/ManagerApproveApplicationScreen'
import ClockInScreen from '../screens/ClockInScreen';
import SettingsScreen from '../screens/SettingsScreen';
import RecordsScreen from '../screens/RecordsScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import { BottomTabParamList, ClockInParamList, SettingsParamList, RecordsParamList, ManagerApproveParamList, ManagerApproveApplicationParamList, SignInParamList, SignUpParamList} from '../types';

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Profile"
      tabBarOptions={{ activeTintColor: "#1C5A7D"}}>
      <BottomTab.Screen
        name="Profile"
        component={SettingsNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="ios-settings" color={color}  />,
        }}
      />
      <BottomTab.Screen
        name="ClockIn"
        component={ClockInNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="ios-clock" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Records"
        component={RecordsNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="ios-paper" color={color} />,
        }}
      />
      {/* MANAGER SCREENS
          TODO: modify to conditional rendering based on redux roles
      */}
      <BottomTab.Screen
        name="Approve CI/O"
        component={ManagerApproveNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="ios-paper" color={color} />,
        }}
      />
      <BottomTab.Screen
       name="Approve App"
       component={ManagerApproveApplicationNavigator}
       options={{
         tabBarIcon: ({ color }) => <TabBarIcon name="ios-paper" color={color} />,
        }}
      />
       {/* Ben added SignIn and SignUp here for easy testing of sign in and sign up. TODO: remove them */}


      {/* Marie commented these out since SignUp and SignIn ~should~ be working sort of now. But they could still be useful.

      <BottomTab.Screen
        name="SignIn"
        component={SignInNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="ios-settings" color={color} />,
        }}
      />

      <BottomTab.Screen
        name="SignUp"
        component={SignUpNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="ios-settings" color={color} />,
        }}
      />
      */}
     
      

    </BottomTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: { name: string; color: string }) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const ClockInStack = createStackNavigator<ClockInParamList>();

function ClockInNavigator() {
  return (
    <ClockInStack.Navigator>
      <ClockInStack.Screen
        name="ClockInScreen"
        component={ClockInScreen}
        options={{ headerShown: false }}
        
      />
    </ClockInStack.Navigator>
  );
}

const SettingsStack = createStackNavigator<SettingsParamList>();

function SettingsNavigator() {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{ headerShown: false }}
      />
    </SettingsStack.Navigator>
  );
}

const RecordsStack = createStackNavigator<RecordsParamList>();

function RecordsNavigator() {
  return (
    <RecordsStack.Navigator>
      <RecordsStack.Screen
        name="RecordsScreen"
        component={RecordsScreen}
        options={{ headerShown: false }}
      />
    </RecordsStack.Navigator>
  );
}

const ManagerApproveStack = createStackNavigator<ManagerApproveParamList>()

function ManagerApproveNavigator() {
  return (
    <ManagerApproveStack.Navigator>
      <ManagerApproveStack.Screen
        name="ManagerApproveScreen"
        component={ManagerApproveScreen}
        options={{ headerShown: false }}
      />
    </ManagerApproveStack.Navigator>
  )
}

const ManagerApproveApplicationStack = createStackNavigator<ManagerApproveApplicationParamList>()


function ManagerApproveApplicationNavigator() {
  return (
    <ManagerApproveApplicationStack.Navigator>
      <ManagerApproveApplicationStack.Screen
        name="ManagerApproveApplicationScreen"
        component={ManagerApproveApplicationScreen}
        options={{ headerShown: false }}
      />
    </ManagerApproveApplicationStack.Navigator>
  )
}

{/* Ben added SignInNavigator and SignUpNavigator here for easy testing of sign in and sign up. TODO: remove them */}
const SignInStack = createStackNavigator<SignInParamList>();

function SignInNavigator() {
  return (
    <SignInStack.Navigator>
      <SignInStack.Screen
        name="SignInScreen"
        component={SignInScreen}
        options={{ headerTitle: 'Sign In' }}
      />
    </SignInStack.Navigator>
  );
}

const SignUpStack = createStackNavigator<SignUpParamList>();

function SignUpNavigator() {
  return (
    <SignUpStack.Navigator>
      <SignUpStack.Screen
        name="SignUpScreen"
        component={SignUpScreen}
        options={{ headerTitle: 'Sign Up' }}
      />
    </SignUpStack.Navigator>
  );
}
