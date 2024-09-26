import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Button, Icon } from "react-native-elements";

const PantallaPrueba = () => {
  return (
    <View>
      <Image
        source={require("../../assets/images/mascota1.jpeg")} // Importa la imagen desde la carpeta assets

      />
      <View>
        <Button
          title="Sí"
          icon={<Icon name="check" size={20} color="white" />}
        />
        <Button
          icon={<Icon name="swap-horiz" size={30} color="black" />}
        />
        <Button
          title="No"
          icon={<Icon name="close" size={20} color="white" />}
        />
      </View>

    
    </View>
  );
};

export default PantallaPrueba;