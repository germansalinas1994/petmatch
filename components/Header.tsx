import React from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  Platform,
  StatusBar,
  Image,
  TouchableOpacity,
} from "react-native";
import { Divider } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons"; // Icono de flecha para volver
import Colors from "@/constants/Colors";
import useUserStore from "@/stores/userStore";
import { useRouter } from "expo-router"; // Para manejar la navegación

interface HeaderProps {
  showBackButton?: boolean; // Prop para mostrar o no el botón de volver
  title?: string; // Prop para el título opcional
}

export default function Header({ showBackButton = false, title }: HeaderProps) {
  const { imagen, nombre } = useUserStore(); // Obtenemos la imagen del usuario de Zustand
  const router = useRouter(); // Para manejar la navegación

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {showBackButton && (
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons
              name="arrow-back"
              size={28}
              color={Colors.text.primary}
              style={styles.backIcon}
            />
          </TouchableOpacity>
        )}

        <View style={title ? styles.titleContainer : null}>
          {title ? (
            <Text style={styles.title}>{title}</Text>
          ) : (
            <>
              <Text style={styles.primaryText}>Bienvenido</Text>
              <Text style={styles.secondaryText}>{nombre}</Text>
            </>
          )}
        </View>

        {/* Mostrar la imagen solo si no hay un título */}
        {!title && (
          <Image
            source={
              imagen
                ? { uri: imagen }
                : require("../assets/images/default_user.jpg")
            }
            style={styles.profileImage}
          />
        )}
      </View>
      <Divider />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.background.clearGray,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 10, // Ajuste para Android
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 5,
  },
  backIcon: {
  },
  titleContainer: {
    flex: 1, // Permite que el contenedor del título ocupe el espacio restante
    alignItems: "center", // Asegura que el texto esté centrado
  },
  title: {
    fontSize: 25,
    fontFamily: "outfit-medium",
    fontWeight: "bold",
    color: Colors.text.primary,
    textAlign: "center", // Centramos el texto dentro del contenedor
  },
  primaryText: {
    fontFamily: "outfit",
    fontSize: 18,
    color: Colors.text.primary,
  },
  secondaryText: {
    fontFamily: "outfit-medium",
    fontSize: 23,
    color: Colors.text.primary,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginTop: 10,
  },
});