import React from 'react';
import { Modal, View, Text, Image, StyleSheet, Button } from 'react-native';

type UserModalProps = {
  visible: boolean;
  onClose: () => void;
  user: { nombre: string; imagen: string } | null;
};

export default function UserModal({ visible, onClose, user }: UserModalProps) {
  if (!user) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Image source={{ uri: user.imagen }} style={styles.userImage} />
          <Text style={styles.userName}>{user.nombre}</Text>
          <Button title="Cerrar" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  userImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
