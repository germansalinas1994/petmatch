import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import Colors from "@/constants/Colors";
import Icon from "@expo/vector-icons/FontAwesome";

type UserInfoProps = {
  userName: string;
  userImage?: string;
};

export default function UserInfo({ userName, userImage }: UserInfoProps) {
  return (
    <View style={styles.ownerContainer}>
      <View style={styles.ownerInfo}>
        <Image
          source={
            userImage
              ? { uri: userImage }
              : require("../../assets/images/adaptive-icon.png")
          }
          style={styles.ownerImage}
        />
        <View>
          <Text style={styles.ownerName}>{userName || "Cargando..."}</Text>
          <Text style={styles.ownerLabel}>Dueño</Text>
        </View>
      </View>
      <Icon name="send" size={24} color={Colors.background.dark} />
    </View>
  );
}

const styles = StyleSheet.create({
  ownerContainer: {
    marginHorizontal: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 15,
    padding: 10,
    borderColor: Colors.background.primaryButton,
    backgroundColor: Colors.background.paper,
    justifyContent: "space-between",
  },
  ownerInfo: { flexDirection: "row", alignItems: "center" },
  ownerImage: {
    width: 50,
    height: 50,
    borderRadius: 99,
    marginRight: 10,
  },
  ownerName: {
    fontFamily: "outfit-Bold",
    fontSize: 17,
    color: Colors.text.primary,
  },
  ownerLabel: {
    fontFamily: "outfit",
    fontSize: 14,
    color: Colors.text.secondary,
  },
});
