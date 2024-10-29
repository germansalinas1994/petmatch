// src/components/pet-details/PetProperty.tsx

import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import Colors from "@/constants/Colors";

type PetPropertyProps = {
  label: string;
  value: string;
  icon: any;
};

export default function PetProperty({ label, value, icon }: PetPropertyProps) {
  return (
    <View style={styles.propertyItem}>
      <Image source={icon} style={styles.propertyIcon} />
      <View>
        <Text style={styles.propertyLabel}>{label}</Text>
        <Text style={styles.propertyValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  propertyItem: {
    width: "48%", // Para que dos elementos se muestren por fila
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background.secondaryButton,
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  propertyIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  propertyLabel: {
    fontFamily: "outfit",
    fontSize: 16,
    color: Colors.text.primary,
  },
  propertyValue: {
    fontFamily: "outfit-Bold",
    fontSize: 18,
    color: Colors.text.secondary,
  },
});
