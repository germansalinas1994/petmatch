import { View, Pressable, StyleSheet, Dimensions } from "react-native";
import React from "react";
import Colors from "../../constants/Colors";
import Icon from "react-native-vector-icons/FontAwesome";

interface ButtonsProps {
  onLike: () => void;
}

export default function Buttons({ onLike }: ButtonsProps) {
  return (
    <View style={styles.container}>
      <Pressable style={styles.likeButton} onPress={onLike}>
        <Icon name="heart" size={40} color={Colors.text.white} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Dimensions.get("window").height * 0.025,
    justifyContent: "center",
    alignItems: "center",
  },
  likeButton: {
    backgroundColor: Colors.success.light, // Puedes usar un color suave en lugar de `Colors.success.main`
    width: 70,
    height: 70,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.text.primary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5, // Para sombra en Android
  },
});

