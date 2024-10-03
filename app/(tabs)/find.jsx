import { View, Text, Image, Pressable, Animated, Dimensions, PanResponder } from "react-native";
import React, { useRef } from "react";
import Colors from "../../constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function Find() {
  const { width, height } = Dimensions.get("window");
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const slideAnim = useRef(new Animated.Value(0)).current; // Cambiar valor inicial a 0
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0); // Guarda el índice de la imagen actual
  const [selection, setSelection] = React.useState(null); // Guarda la selección

  // Array de imágenes
  const images = [
    require("../../assets/images/mascota1.jpeg"),
    require("../../assets/images/mascota2.jpeg"), // Asegúrate de tener más imágenes en la carpeta
    // Puedes añadir más imágenes aquí
  ];

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: slideAnim }], { useNativeDriver: false }),
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 50) {
          // Movimiento hacia la derecha
          Animated.spring(slideAnim, { toValue: width * 0.3, useNativeDriver: false, duration: 0 }).start(() => {
            changeImage(); // Cambia la imagen al deslizar
          });
        } else if (gestureState.dx < -50) {
          // Movimiento hacia la izquierda
          Animated.spring(slideAnim, { toValue: -width * 0.3, useNativeDriver: false, duration: 0 }).start(() => {
            changeImage(); // Cambia la imagen al deslizar
          });
        } else {
          // Vuelve al centro si no se mueve lo suficiente
          Animated.spring(slideAnim, { toValue: 0, useNativeDriver: false }).start();
        }
      },
    })
  ).current;

  const changeImage = () => {
    // Cambia a la siguiente imagen, si está en la última, vuelve a la primera
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    slideAnim.setValue(0); // Reinicia la animación al centro
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
          source={images[currentImageIndex]} // Mostrar la imagen actual
          style={{ width: width, height: height, position: 'absolute' }} // Establecer ancho y alto
          resizeMode="cover" // Ajusta la imagen para que cubra el área
        />
        {/* Componente deslizable */}
        <View style={{ position: 'absolute', bottom: height * 0.14, width: 300, height: 60, justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
          {/* Fondo blanco translúcido */}
          <View style={{ width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.7)', borderWidth: 1, borderColor: 'white', borderRadius: 25, justifyContent: 'center', alignItems: 'center' }}>
            <Animated.View
              {...panResponder.panHandlers}
              style={[
                { width: 50, height: 50, backgroundColor: 'black', borderRadius: 25, position: 'absolute' },
                { transform: [{ translateX: slideAnim }] }
              ]}
            />
            {/* Icono "Sí" */}
            <MaterialCommunityIcons name="chevron-double-left" size={30} color="black" style={{ position: 'absolute', left: 60 }} />
            <Text style={{ position: 'absolute', left: 10, fontSize: 18 }}>Si</Text>
            {/* Icono "No" */}
            <MaterialCommunityIcons name="chevron-double-right" size={30} color="black" style={{ position: 'absolute', right: 60 }} />
            <Text style={{ position: 'absolute', right: 10, fontSize: 18 }}>No</Text>
          </View>
        </View>

        {/* Fondo translúcido en la parte inferior */}
        <View
          style={{
            position: "absolute",
            bottom: 0,
            width: width,
            height: height * 0.13, // Cubre el 20% de la pantalla
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
            <MaterialCommunityIcons name="chevron-double-up" size={30} color="black" />
            <Text style={{ fontSize: 20, color: "black" }}>Descripción</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
