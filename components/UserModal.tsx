import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import SkeletonItem from "./SkeletonItem";
import { Image } from "react-native-expo-image-cache";
import { User } from "@/types/index";
import { FontAwesome } from "@expo/vector-icons";

type UserModalProps = {
  visible: boolean;
  onClose: () => void;
  user: User | null;
};

export default function UserModal({ visible, onClose, user }: UserModalProps) {
  const [imageLoading, setImageLoading] = useState(true);

  // Reset image loading state when user changes
  useEffect(() => {
    if (user) {
      setImageLoading(true);
    }
  }, [user]);

  if (!user) return null;

  // Función para manejar la apertura de WhatsApp
  const handleWhatsAppPress = () => {
    let phoneNumber = user.telefono;
    // Removemos caracteres no numéricos
    phoneNumber = phoneNumber.replace(/\D/g, "");
    const url = `https://wa.me/${phoneNumber}`;
    Linking.openURL(url).catch((err) =>
      console.error("Error al abrir WhatsApp", err)
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* Contenedor para la imagen y el skeleton */}
          <View style={styles.imageContainer}>
            {imageLoading && (
              <SkeletonItem width={100} height={100} borderRadius={50} />
            )}
            <Image
              uri={user.imagen || ""}
              style={styles.userImage}
              onLoad={() => setImageLoading(false)}
              transitionDuration={300} // Añadir una transición suave
            />
          </View>

          <Text style={styles.modalTitle}>Nombre</Text>
          <Text style={styles.modalText}>{user.nombre}</Text>

          <Text style={styles.modalTitle}>Teléfono</Text>
          <View style={styles.phoneContainer}>
            <Text style={styles.phoneText}>{user.telefono}</Text>
            <TouchableOpacity
              style={styles.whatsappButton}
              onPress={handleWhatsAppPress}
            >
              <FontAwesome name="whatsapp" size={24} color="#25D366" />
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.modalTitle}>Localidad</Text>
              <Text style={styles.modalText}>{user.localidad}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.modalTitle}>Edad</Text>
              <Text style={styles.modalText}>{user.edad} años</Text>
            </View>
          </View>

          <View style={styles.descriptionBox}>
            <Text style={styles.descriptionTitle}>Sobre mí</Text>
            <Text style={styles.modalText}>{user.descripcion}</Text>
          </View>

          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  imageContainer: {
    width: 100,
    height: 100,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  userImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    position: "absolute",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  modalText: {
    fontSize: 14,
    marginBottom: 10,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },
  column: {
    flex: 1,
    alignItems: "center",
  },
  descriptionBox: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    backgroundColor: "#f9f9f9",
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#f44336",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  phoneText: {
    fontSize: 14,
  },
  whatsappButton: {
    marginLeft: 10,
  },
});
