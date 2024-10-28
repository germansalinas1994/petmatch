import { View, Pressable, StyleSheet, Dimensions, Button } from "react-native";
import React from "react";
import Colors from "../../constants/Colors";
import Icon from "react-native-vector-icons/FontAwesome";

interface ButtonsProps {
  onLike: () => void;
  onDislike: () => void;
}

export default function Buttons({ onLike, onDislike }: ButtonsProps) {
  return (
    <View style={styles.buttonsContainer}>
      <Pressable style={styles.errorButton} onPress={onDislike}>
        <Icon name="times" size={30} color={Colors.text.white} />
      </Pressable>

      <Pressable style={styles.successButton} onPress={onLike}>
        <Icon name="heart" size={30} color={Colors.text.white} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: Dimensions.get("window").width * 0.6,
  },
  errorButton: {
    backgroundColor: Colors.error.main,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.text.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  successButton: {
    backgroundColor: Colors.success.main,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.text.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
