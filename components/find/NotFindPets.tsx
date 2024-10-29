import { View, Text, StyleSheet, Dimensions } from 'react-native'
import React from 'react'
import Colors from '@/constants/Colors'

export default function NotFindPets() {
  return (
    <View style={styles.imageContainer}>
    <Text style={styles.noPetsText}>
      No se encontraron nuevas mascotas disponibles.
    </Text>
  </View>
  )
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
      marginVertical: 20,
    },
    noPetsText: {
      fontSize: 18,
      color: Colors.text.primary,
      textAlign: "center",
      paddingHorizontal: 20,
    },
  });
  