import { View, Text, Image, Pressable, Dimensions } from "react-native";
import React from "react";
import Colors from "../../constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context"; // Importar useSafeAreaInsets

export default function find() {
  const { width, height } = Dimensions.get("window");
  const insets = useSafeAreaInsets(); // Obtener los insets de safe area
  return (
    // <View>
    //   <Text style={{ textAlign: "center", fontSize: 30, marginTop: 50 }}>
    //     Buscar
    //   </Text>
    // </View>
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.background.default,
        paddingTop: insets.top, // Usar insets para aplicar padding dinámico
        paddingBottom: insets.bottom,
      }}
    >
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Image
          source={require("../../assets/images/mascota1.jpeg")}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}
