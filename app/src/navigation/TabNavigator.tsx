import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/HomeScreen';
import { PlanningScreen } from '../screens/PlanningScreen';
import { HistoriqueScreen } from '../screens/HistoriqueScreen';
import { ChatScreen } from '../screens/ChatScreen';
import { ChatIcon, HistoriqueIcon, HomeIcon, PlanningIcon } from '../components/TabIcons';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import type { TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();

export function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted35,
        tabBarStyle: {
          backgroundColor: colors.tabBarBg,
          borderTopWidth: 1,
          borderTopColor: colors.divider,
          height: 70,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontFamily: fonts.body,
          fontSize: 10,
        },
        tabBarShowLabel: true,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Accueil',
          tabBarIcon: ({ color }) => <HomeIcon color={color} />,
        }}
      />
      <Tab.Screen
        name="Planning"
        component={PlanningScreen}
        options={{
          tabBarLabel: 'Planning',
          tabBarIcon: ({ color }) => <PlanningIcon color={color} />,
        }}
      />
      <Tab.Screen
        name="Historique"
        component={HistoriqueScreen}
        options={{
          tabBarLabel: 'Historique',
          tabBarIcon: ({ color }) => <HistoriqueIcon color={color} />,
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          tabBarLabel: 'Coach',
          tabBarIcon: ({ color }) => <ChatIcon color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}
