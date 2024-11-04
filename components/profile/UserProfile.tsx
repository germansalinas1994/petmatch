// ProfileHeader.tsx
import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import Colors from "@/constants/Colors";

interface ProfileHeaderProps {
  name: string ;
  imageUri?: string | null ; // Permitir que imageUri sea null
  email: string;
}

export default function ProfileHeader({
  name,
  imageUri,
  email,
}: ProfileHeaderProps) {
  return (
    <View style={styles.profile}>
      <Image
        source={
          imageUri
            ? { uri: imageUri }
            : require("../../assets/images/default_user.jpg")
        }
        style={styles.profileImage}
      />
      <Text style={styles.userName}>{name}</Text>
      <Text style={styles.userEmail}>{email}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  profile: {
    display: "flex",
    alignItems: "center",
    marginVertical: 25,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 99,
  },
  userName: {
    fontFamily: "outfit-bold",
    fontSize: 20,
  },
  userEmail: {
    fontFamily: "outfit",
    fontSize: 16,
    color: Colors.text.secondary,
  },
});
