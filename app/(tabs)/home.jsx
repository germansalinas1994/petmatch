import { View, Text } from 'react-native'
import React from 'react'

export default function home() {
  const prueba = process.env.EXPO_PUBLIC_VARIABLE;
  console.log(prueba);

  return (
    <View>
      <Text>Home</Text>
      <Text>{prueba}</Text>
    </View>
  )
}