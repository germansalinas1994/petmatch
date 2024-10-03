import { View, Text, Image, Pressable, Dimensions } from "react-native";
import React, { useState } from "react";
import Colors from "../../constants/Colors";
import { Link } from "expo-router";
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // Importar useSafeAreaInsets

export default function Home() {
  const [isPressed, setIsPressed] = useState(false);
  const { width, height } = Dimensions.get("window");
  const insets = useSafeAreaInsets(); // Obtener los insets de safe area


  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.background.default,
        paddingTop: insets.top, // Usar insets para aplicar padding dinámico
        paddingBottom: insets.bottom,
      }}
    >
      <View style={{ flex: 1, alignItems: "center", justifyContent: "space-between" }}>
        <Image
          source={require("../../assets/images/home2.png")}
          style={{ width: width * 0.9, height: height * 0.5, marginTop: 35 }}
          resizeMode="contain"
        />
        <View style={{ alignItems: "center", marginBottom: height * 0.6 }}>
          <Text style={{ fontFamily: "outfit-Bold", fontSize: 30, textAlign: "center", color: Colors.text.primary, width: width * 0.8 }}>
            Listo para hacer un nuevo amigo?
          </Text>
          <Text style={{ fontFamily: "outfit", fontSize: 18, textAlign: "center", marginTop: 10, width: width * 0.8 }}>
            Sumate a adoptar una mascota, darle un hogar y hacerla feliz.
          </Text>
          <Link href="/(tabs)/find" asChild>
            <Pressable
              onPressIn={() => setIsPressed(true)}
              onPressOut={() => setIsPressed(false)}
              style={{
                padding: 14,
                marginTop: 30,
                backgroundColor: Colors.background.secondaryButton,
                width: width * 0.5,
                borderRadius: 20,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: isPressed ? 2 : 5 },
                shadowOpacity: isPressed ? 0.5 : 0.3,
                shadowRadius: isPressed ? 3 : 6,
                elevation: isPressed ? 2 : 5,
              }}
            >
              <Text style={{ fontFamily: "outfit-Medium", fontSize: 20, textAlign: "center" }}>Comenzar</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </View>
  );
}
