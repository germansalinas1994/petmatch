import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Colors from "@/constants/Colors";

type PetAboutProps = {
  name: string;
  description: string;
  readMore: boolean;
  onToggleReadMore: () => void;
};

export default function PetAbout({ name, description, readMore, onToggleReadMore }: PetAboutProps) {
  return (
    <View style={styles.aboutContainer}>
      <Text style={styles.aboutTitle}>Acerca de {name}</Text>
      <Text numberOfLines={readMore ? 3 : undefined} style={styles.aboutDescription}>
        {description || "Cargando..."}
      </Text>
      {readMore && (
        <Pressable onPress={onToggleReadMore}>
          <Text style={styles.readMore}>Leer más</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  aboutContainer: { padding: 20 },
  aboutTitle: {
    fontFamily: "outfit-Bold",
    fontSize: 20,
    color: Colors.text.primary,
  },
  aboutDescription: {
    fontFamily: "outfit",
    fontSize: 16,
    color: Colors.text.secondary,
    paddingTop: 10,
  },
  readMore: {
    fontFamily: "outfit",
    fontSize: 14,
    color: Colors.text.disabled,
  },
});


