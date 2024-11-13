import React from "react";
import { View, TouchableOpacity, Image, StyleSheet, SafeAreaView, Dimensions, Platform, StatusBar, Text } from "react-native";
import Colors from "@/constants/Colors";
import { Ionicons } from '@expo/vector-icons';
import userStore from "@/stores/userStore";

// Obtener dimensiones de la pantalla
const { width,height } = Dimensions.get('window');

interface HeaderProps {
  title ?: string; // Prop para el título opcional
}

export default function Header({ title }: HeaderProps) {
  const { nombre } = userStore();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        {/* Menu Icon */}
        <TouchableOpacity style={styles.menuButton}>
        </TouchableOpacity>
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
        
        {/* Logo */}
        <Image
          source={require('@/assets/images/logo.jpg')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.background.default,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, // Ajuste para Android
    height: 120, // Altura fija para el header
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 15, // For Android shadow
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    maxHeight: "90%",// Altura fija para el header
    backgroundColor: Colors.background.default,
    paddingHorizontal: width * 0.03,
    height: height * 0.067, // Altura fija para el header
  },
  menuButton: {
    padding: 1,
  },
  logo: {
    width: width * 0.14,
    height: width * 0.5,
    marginLeft: "auto",
  },
  titleContainer: {

  },
  title: {
    fontSize: 25,
    fontFamily: "outfit-medium",
    fontWeight: "bold",
    color: Colors.text.primary,
    
  },
  primaryText: {
    fontFamily: "outfit",
    fontSize: 18,
    color: Colors.text.primary,
    marginTop: 15,
  },
  secondaryText: {
    fontFamily: "outfit-medium",
    fontSize: 23,
    color: Colors.text.primary,
  },
});