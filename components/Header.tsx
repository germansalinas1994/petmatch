import React from "react";
import { View, TouchableOpacity, Image, StyleSheet, SafeAreaView, Dimensions, Platform, StatusBar } from "react-native";
import Colors from "@/constants/Colors";
import { Ionicons } from '@expo/vector-icons';

// Obtener dimensiones de la pantalla
const { width,height } = Dimensions.get('window');

export default function Header() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        {/* Menu Icon */}
        <TouchableOpacity style={styles.menuButton}>
          {/* <Ionicons name="menu" size={30} color={Colors.secondary.dark} /> */}
        </TouchableOpacity>
        
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
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 10, // Ajuste para Android
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  },
});
