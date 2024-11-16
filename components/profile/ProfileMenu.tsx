
import React from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Colors from "@/constants/Colors";

interface MenuItem {
  id: number;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  path: string;
}

interface ProfileMenuProps {
  menuItems: MenuItem[];
  onPressMenu: (item: MenuItem) => void;
}

export default function ProfileMenu({ menuItems, onPressMenu }: ProfileMenuProps) {
  return (
    <FlatList
      data={menuItems}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => onPressMenu(item)}>
          <View style={styles.list}>
            <Ionicons
              name={item.icon}
              size={45}
              color={Colors.text.primary}
              style={styles.menuIcons}
            />
            <Text style={styles.textItem}>{item.name}</Text>
          </View>
        </TouchableOpacity>
      )}
      keyExtractor={(item) => item.id.toString()}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background.paper,
    gap: 10,
    borderRadius: 10,
    backgroundColor: Colors.background.clearGray,
    marginVertical: 15,
  },
  menuIcons: {
    padding: 10,
    borderRadius: 99,
  },
  textItem: {
    fontFamily: "outfit",
    fontSize: 20,
    marginLeft: 15,
  },
});
