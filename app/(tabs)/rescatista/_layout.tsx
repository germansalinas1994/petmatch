import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import Colors from "@/constants/Colors";

export default function TabLayoutRescatista() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, 
        tabBarInactiveTintColor: Colors.text.disabled,
        tabBarActiveTintColor: Colors.secondary.dark,
      }}
    >
      <Tabs.Screen
        name="likes"
        options={{
          title: "Interesados",
          tabBarIcon: ({ color }) => (
            <Ionicons name="heart" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => (
            <Ionicons name="people-circle" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
