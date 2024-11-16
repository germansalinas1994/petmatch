// src/components/pet-details/PetInfo.tsx

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import Colors from "@/constants/Colors";
import PetProperty from "./PetProperty";
import { Pet } from "@/types";

type PetInfoProps = {
  petData: Pet;
};


export default function PetInfo({ petData }: PetInfoProps) {
  const properties = [
    { label: "Edad", value: `${petData.edad} Años`, icon: require("../../assets/images/calendar.png") },
    { label: "Tipo", value: petData.tipo, icon: require("../../assets/images/bone.png") },
    { label: "Peso", value: `${petData.peso} Kg`, icon: require("../../assets/images/weight.png") },
    { label: "Sexo", value: petData.sexo, icon: require("../../assets/images/sex.png") },
  ];

  return (
    <View>
      <View style={styles.petInfoContainer}>
        <View>
          <Text style={styles.petName}>{petData.nombre}</Text>
          <Text style={styles.petAddress}>{petData.direccion}</Text>
        </View>
        {/*<Entypo name="heart-outlined" size={30} color="black" />*/}
      </View>

      <View style={styles.petPropertiesContainer}>
        {properties.map((property, index) => (
          <PetProperty
            key={index}
            label={property.label}
            value={property.value}
            icon={property.icon}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  petInfoContainer: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  petName: {
    fontFamily: "outfit-Bold",
    fontSize: 27,
    color: Colors.text.primary,
  },
  petAddress: {
    fontFamily: "outfit",
    fontSize: 16,
    color: Colors.text.secondary,
    paddingTop: 5,
  },
  petPropertiesContainer: {
    paddingHorizontal: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});
