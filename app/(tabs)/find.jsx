import { View, Text, Image, Pressable, Animated, Dimensions } from "react-native";
import React, { useRef } from "react";
import Colors from "../../constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native"; // Importar useNavigation
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function Find() {
  const { width, height } = Dimensions.get("window");
  const insets = useSafeAreaInsets();
  const navigation = useNavigation(); // Usar navigation para navegar a otra pantalla
  const slideAnim = useRef(new Animated.Value(100)).current; // Cambia el valor inicial

  const slideButton = (direction) => {
    // Mover el botón a la derecha o izquierda
    Animated.timing(slideAnim, {
      toValue: direction === "right" ? width * 0.3 : -width * 0.3, // Mover 30% a la derecha o izquierda
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.background.default,
        paddingTop: insets.top,
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

    {/* Fondo translúcido en la parte inferior */}
    <View
          style={{
            position: "absolute",
            bottom: 0,
            width: width,
            height: height * 0.15, // Cubre el 20% de la pantalla
            backgroundColor: "rgba(128, 128, 128, 0.3)", // Fondo translúcido
            justifyContent: "center", // Centrar verticalmente el contenido
            alignItems: "center", // Centrar horizontalmente el contenido
          }}
        >
          {/* Botón de texto */}
          <Pressable onPress={() => navigation.navigate("Descripcion")}
             style={{
              flexDirection: "column", // Ícono y texto en una fila
              alignItems: "center", // Centrar ícono y texto verticalmente
            }}>
            <MaterialCommunityIcons name="chevron-double-up" size={30} color="white" />
            <Text style={{ fontSize: 18, color: "white" }}>Descripción</Text>
          </Pressable>
      </View>
    </View>
  </View>
  );
}