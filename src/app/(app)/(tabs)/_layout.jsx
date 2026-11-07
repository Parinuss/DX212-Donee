import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const TABS = [
  ['index', 'Home', 'home-outline'],
  ['tasks', 'Tasks', 'reader-outline'],
  ['groups', 'Groups', 'people-outline'],
  ['calendar', 'Calendar', 'calendar-outline'],
  ['me', 'Me', 'person-outline'],
];

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#8754EA',
      tabBarInactiveTintColor: '#97AECD',
      tabBarLabelPosition: 'below-icon',
      tabBarStyle: {
        backgroundColor: '#FFFFFF',
        borderTopColor: '#F1EDF8',
        width: '100%',
        maxWidth: 440,
        alignSelf: 'center',
        height: 76,
        paddingTop: 8,
        paddingBottom: 10,
      },
      tabBarLabelStyle: { fontWeight: '600', fontSize: 11, marginTop: 3 },
      tabBarItemStyle: { paddingHorizontal: 0 },
    }}>
      {TABS.map(([name, title, icon]) => (
        <Tabs.Screen key={name} name={name} options={{
          title,
          tabBarIcon: ({ color }) => <Ionicons name={icon} size={25} color={color} />,
        }} />
      ))}
    </Tabs>
  );
}
