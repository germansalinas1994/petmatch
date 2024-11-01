import { View, Text, Dimensions } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import Colors from "../../constants/Colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function TabLayout() {
  const { width, height } = Dimensions.get("window");

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarInactiveTintColor: Colors.text.disabled,
        tabBarActiveTintColor: Colors.secondary.dark,
      }}
    >

      <Tabs.Screen
        name="find"
        options={{
          title: "Encontrar",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="pets" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="likes"
        options={{
          title: "Interesados",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" size={28} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-circle" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
