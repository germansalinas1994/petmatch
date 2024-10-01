import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import Colors from "../constants/Colors"; // Ajusta la ruta según tu estructura de carpetas

const Loading = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background.default }}>
      <ActivityIndicator size="large" color={Colors.text.secondary} />
      <Text style={{ marginTop: 10, fontSize: 18, color: Colors.text.primary }}>Cargando...</Text>
    </View>
  );
};

export default Loading;
