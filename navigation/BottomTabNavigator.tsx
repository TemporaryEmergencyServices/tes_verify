import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import ClockInScreen from '../screens/ClockInScreen';
import SettingsScreen from '../screens/SettingsScreen';
import RecordsScreen from '../screens/RecordsScreen';
import { BottomTabParamList, ClockInParamList, SettingsParamList, RecordsParamList} from '../types';

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="ClockIn"
      tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}>
      <BottomTab.Screen
        name="Profile"
        component={SettingsNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="ios-settings" color={color} />,
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
        options={{ headerTitle: 'Clock Time' }}
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
        options={{ headerTitle: 'Settings and Profile Info' }}
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
        options={{ headerTitle: 'Volunteer Records' }}
      />
    </RecordsStack.Navigator>
  );
}
