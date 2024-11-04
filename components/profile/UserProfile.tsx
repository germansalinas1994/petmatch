import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import SkeletonItem from "@/components/SkeletonItem";
import Colors from "@/constants/Colors";

interface ProfileHeaderProps {
  name: string;
  imageUri?: string | null;
  email: string;
  onPressImage: () => void;
  isLoading: boolean;
}

export default function ProfileHeader({
  name,
  imageUri,
  email,
  onPressImage,
  isLoading,
}: ProfileHeaderProps) {
  return (
    <View style={styles.profile}>
      <TouchableOpacity onPress={onPressImage}>
        {isLoading ? (
          <SkeletonItem width={80} height={80} borderRadius={40} />
        ) : (
          <Image
            source={
              imageUri
                ? { uri: imageUri }
                : require("../../assets/images/default_user.jpg")
            }
            style={styles.profileImage}
          />
        )}
      </TouchableOpacity>
      <Text style={styles.userName}>{name}</Text>
      <Text style={styles.userEmail}>{email}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  profile: {
    alignItems: "center",
    marginVertical: 25,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
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
