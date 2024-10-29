import React from "react";
import {
  View,
  Image,
  FlatList,
  Pressable,
  StyleSheet,
  Dimensions,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Colors from "@/constants/Colors";
import { Pet } from "@/types";

type PetImagesProps = {
  images: string[];
  onBackPress: () => void;
  topInset: number;
};

const { width } = Dimensions.get("window"); // Obtener el ancho de la pantalla

export default function PetImages({
  images,
  onBackPress,
  topInset,
}: PetImagesProps) {
  return (
    <View style={styles.container}>
      <FlatList
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.image} />
        )}
      />
      <Pressable onPress={onBackPress} style={[styles.backButton, { top: topInset - 10 }]}>
        <AntDesign name="arrowleft" size={35} color={Colors.text.white} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: width, // Asegura que el contenedor ocupe todo el ancho de la pantalla
    height: 600,
  },
  image: {
    width: width, // Ocupa todo el ancho de la pantalla
    height: "100%", // Se ajusta a la altura del contenedor
    resizeMode: "cover",
  },
  backButton: {
    position: "absolute",
    left: 10,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
});
