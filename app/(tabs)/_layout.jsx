import { View, Text } from "react-native";
import React from "react";
import { Tabs } from 'expo-router'


export default function TabLayout() {
  return (
    <Tabs screenOptions={{headerShown:false}}>
      <Tabs.Screen name="home" options={{tabBarStyle: { display: 'none' }}} />
      <Tabs.Screen name="explore" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
