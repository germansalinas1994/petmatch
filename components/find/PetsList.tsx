import React from "react";
import {
  View,
  FlatList,
  Pressable,
  Image,
  StyleSheet,
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

export default function PetList({ pets, onLoad,handleSelectPet }: PetListProps) {
  return (
    <FlatList
      data={pets}
      horizontal
      pagingEnabled
      scrollEnabled={false}
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
});
