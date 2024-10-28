import {
  View,
  Image,
  Dimensions,
  Pressable,
  Text,
  StyleSheet,
  SafeAreaView
} from "react-native";
import React from "react";
import Colors from "../../constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Link } from "expo-router";
import Buttons from "@/components/find/Buttons";

export default function Find() {
  const { width, height } = Dimensions.get("window");
  const insets = useSafeAreaInsets();

  const handleLike = () => {
    console.log("Liked!");
    alert("Liked!");
    // lógica para manejar el like
  };

  const handleDislike = () => {
    console.log("Disliked!");
    alert("Disliked!");
    // lógica para manejar el dislike
  };

  return (
    <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top }]}>
      <View style={styles.container}>
        <Link href="/pet-details" asChild>
          <Pressable style={styles.imageContainer}>
            <Image
              source={require("../../assets/images/mascota1.jpeg")}
              resizeMode="cover"
              style={styles.image}
            />
          </Pressable>
        </Link>
        <Buttons onLike={handleLike} onDislike={handleDislike} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background.paper,
  },
  container: {
    alignItems: "center",
  },
  imageContainer: {
    width: "100%",
    height: Dimensions.get("window").height * 0.7,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.text.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
    marginVertical: 20,
  },
  image: {
    width: "100%",
    height: "100%",
  }
});
