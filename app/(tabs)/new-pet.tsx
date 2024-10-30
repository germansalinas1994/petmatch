import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../../components/Header';
import { collection, onSnapshot, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';

type User = {
  id: string;
  nombre: string;
  imagen: string;
  pet_id?: string;
};

const PetScreen = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [petInfo, setPetInfo] = useState<any | null>(null);
  const [addPetModalVisible, setAddPetModalVisible] = useState(false);
  const [petFormData, setPetFormData] = useState({
    nombre: '',
    direccion: '',
    tipo: '',
    sexo: '',
    edad: '',
    peso: '',
    descripcion: '',
  });

  useEffect(() => {
    const usersCollection = collection(db, 'users');
    const unsubscribe = onSnapshot(usersCollection, (snapshot) => {
      const usersList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as User),
      }));
      setUsers(usersList);
    });

    return unsubscribe;
  }, []);

  const handleUserIconPress = () => {
    setModalVisible(true);
  };

  const handleUserSelect = async (user: User) => {
    setSelectedUser(user);
    setModalVisible(false);

    if (user.pet_id) {
      const petRef = doc(db, 'pets', user.pet_id);
      const petSnap = await getDoc(petRef);

      if (petSnap.exists()) {
        setPetInfo({ id: petSnap.id, ...petSnap.data() });
      } else {
        console.log('No se encontró la mascota');
        setPetInfo(null);
      }
    } else {
      setPetInfo(null);
    }
  };

  const handleAddPet = () => {
    setAddPetModalVisible(true);
  };

  const closeAddPetModal = () => {
    setAddPetModalVisible(false);
  };

  const handleSavePet = async () => {
    const { nombre, direccion, tipo, edad, peso } = petFormData;

    if (!nombre || !direccion || !tipo) {
      Alert.alert('Error', 'Por favor, complete todos los campos obligatorios.');
      return;
    }

    try {
      const petRef = doc(collection(db, 'pets'));
      await setDoc(petRef, {
        ...petFormData,
        userId: selectedUser?.id,
      });

      Alert.alert('Éxito', 'La mascota se ha guardado correctamente.');
      closeAddPetModal();
    } catch (error) {
      console.error('Error al guardar la mascota: ', error);
      Alert.alert('Error', 'Hubo un problema al guardar la mascota.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.screen}>
        <Header />
        <View style={styles.card}>
          <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity style={styles.userIconButton} onPress={handleUserIconPress}>
              {selectedUser && selectedUser.imagen ? (
                <Image source={{ uri: selectedUser.imagen }} style={styles.userIconImage} />
              ) : (
                <Ionicons name="person-circle" size={100} color="#333333"/>
              )}
              <Text style={styles.usernameText}>{selectedUser ? selectedUser.nombre : 'Usuario'}</Text>
            </TouchableOpacity>

            {selectedUser ? (
              petInfo ? (
                <View style={styles.petInfo}>
                  <Image source={{ uri: petInfo.foto }} style={styles.petImage} />
                  <Text style={styles.petName}>{petInfo.nombre}</Text>
                  <Text style={styles.petAddress}>{petInfo.direccion}</Text>
                </View>
              ) : (
                <View style={styles.addPetContainer}>
                  <Text style={styles.message}>¡Carga tu primera mascota!</Text>
                  <TouchableOpacity style={styles.addButton} onPress={handleAddPet}>
                    <Ionicons name="add-circle" size={50} color="#2196F3" />
                  </TouchableOpacity>
                </View>
              )
            ) : (
              <Text style={styles.message}>No hay mascota, por favor selecciona un usuario</Text>
            )}
          </ScrollView>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Selecciona un Usuario</Text>
              <FlatList
                data={users}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.userItem} onPress={() => handleUserSelect(item)}>
                    <Image source={{ uri: item.imagen }} style={styles.userItemImage} />
                    <Text style={styles.userItemName}>{item.nombre}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={addPetModalVisible}
          onRequestClose={closeAddPetModal}
        >
          <KeyboardAvoidingView
            style={styles.modalOverlay}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={[styles.modalContent, { maxHeight: '80%' }]}>
                <Text style={styles.modalTitle}>Agregar Mascota</Text>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                  {['nombre', 'direccion', 'tipo', 'sexo', 'edad', 'peso', 'descripcion'].map((field) => (
                    <View key={field}>
                      <Text style={styles.inputLabel}>{field.charAt(0).toUpperCase() + field.slice(1)}</Text>
                      <TextInput
                        style={styles.input}
                        value={petFormData[field]}
                        onChangeText={(text) => setPetFormData({ ...petFormData, [field]: text })}
                        placeholder={`Ingrese ${field}`}
                        placeholderTextColor="#888"
                        keyboardType={field === 'edad' || field === 'peso' ? 'numeric' : 'default'}
                      />
                    </View>
                  ))}
                </ScrollView>
                <View style={styles.modalButtonContainer}>
                  <TouchableOpacity style={styles.cancelButton} onPress={closeAddPetModal}>
                    <Text style={styles.buttonText}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.saveButton} onPress={handleSavePet}>
                    <Text style={styles.buttonText}>Guardar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  card: {
    position: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  container: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  userIconButton: { alignContent: 'center', alignItems: 'center' }, // Alinea el contenido en el centro
  userIconImage: { width: 100, height: 100, borderRadius: 50 },
  usernameText: { fontSize: 16, color: '#333', marginTop: 8 }, // Texto para el nombre del usuario
  message: { padding: 50, fontSize: 18, color: '#555', textAlign: 'center' },
  addPetContainer: { alignItems: 'center' },
  addButton: { marginTop: 10 },
  petInfo: { alignItems: 'center' },
  petImage: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  petName: { fontSize: 18, color: '#333' },
  petAddress: { fontSize: 16, color: '#666' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    alignItems: 'stretch', 
  },
  scrollContainer: { paddingVertical: 8 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  inputLabel: { fontSize: 16, color: '#333', marginVertical: 4 },
  input: {
    width: '100%',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    color: '#333',
  },
  modalButtonContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '100%' },
  cancelButton: {
    backgroundColor: '#ff4444',
    padding: 10,
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: { color: 'white', fontSize: 16 },
  userItem: { flexDirection: 'row', alignItems: 'center', padding: 10 },
  userItemImage: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  userItemName: { fontSize: 16, color: '#333' },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#f44336',
    borderRadius: 5, 
    alignItems: 'center' 
  },
  closeButtonText: { fontSize: 16, color: 'white' },
});

export default PetScreen;
