import React from "react";
import {
  View,
  FlatList,
  Pressable,
  Image,
  StyleSheet,
  Text,
  Dimensions,
} from "react-native";
import { Link } from "expo-router";
import { Pet } from "@/types";
import Colors from "@/constants/Colors";

type PetListProps = {
  pets: Pet[];
  onLoad: () => void;
  handleSelectPet: (pet: Pet) => void; // Nueva prop
};

export default function PetList({ pets, onLoad, handleSelectPet }: PetListProps) {
  return (
    <FlatList
      data={pets}
      horizontal
      pagingEnabled
      scrollEnabled={true}
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => (
        <Link
          onPress={() => handleSelectPet(item)} // Llamada a handleSelectPet
          href={{
            pathname: "/pet-details/[petId]",
            params: { petId: item.pet_id },
          }}
          asChild
        >
          <Pressable style={styles.imageContainer}>
            <Image
              source={{ uri: item.images[0] }}
              style={styles.image}
              onLoad={onLoad}
            />
            <View style={styles.infoContainer}>
              <Text style={styles.infoText}>{item.nombre}, {item.edad} años</Text>
            </View>
          </Pressable>
        </Link>
      )}
      keyExtractor={(item) => item.pet_id}
    />
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.7,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.text.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
    marginVertical: 15,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  infoContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.3)", 
    paddingHorizontal: 50,
    paddingVertical: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  infoText: {
    color: Colors.text.white,
    fontSize: 22, // Tamaño de texto adecuado para ser legible
    fontWeight: "bold",
  },
});
