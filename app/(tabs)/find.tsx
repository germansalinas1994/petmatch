import { View, Image, Dimensions, Pressable, Text } from "react-native";
import React from "react";
import Colors from "../../constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/FontAwesome";
import { Link } from "expo-router";

export default function Find() {
  const { width, height } = Dimensions.get("window");
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.background.paper,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Contenedor de la imagen */}
      <Link href="/pet-details" asChild>
        <Pressable
          style={{
            width: width * 1,
            height: height * 0.7,
            overflow: "hidden",
            alignItems: "center",
            justifyContent: "center",
            shadowColor: Colors.text.primary,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.8,
            shadowRadius: 5,
            elevation: 5,
          }}
        >
          <Image
            source={require("../../assets/images/mascota1.jpeg")}
            resizeMode="cover"
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        </Pressable>
      </Link>

      {/* Contenedor de botones */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: width * 0.6,
          marginTop: 20,
        }}
      >
        <Pressable
          style={{
            backgroundColor: Colors.error.main,
            width: 60,
            height: 60,
            borderRadius: 30,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name="times" size={30} color={Colors.text.white} />
        </Pressable>

        <Pressable
          style={{
            backgroundColor: Colors.success.main,
            width: 60,
            height: 60,
            borderRadius: 30,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name="check" size={30} color={Colors.text.white} />
        </Pressable>
      </View>
    </View>
  );
}
