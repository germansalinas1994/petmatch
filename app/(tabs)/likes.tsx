// Likes.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Header from "../../components/Header";
import { db } from "../../config/FirebaseConfig";
import { collection, onSnapshot, DocumentData } from "firebase/firestore";
import { Image } from "react-native-expo-image-cache";
import SkeletonItem from "../../components/SkeletonItem";
import Colors from "../../constants/Colors";
import UserModal from "../../components/UserModal";

type User = {
  id: string;
  nombre: string;
  imagen: string;
  localidad: string;
  edad: number;
  descripcion: string;
};

export default function Likes() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    // Usar onSnapshot para escuchar cambios en tiempo real en la colección "users"
    const usersCollection = collection(db, "users");
    const subscriber = onSnapshot(usersCollection, (snapshot) => {
      const usersList = snapshot.docs.map((doc) => {
        const data = doc.data() as DocumentData;
        return {
          id: doc.id,
          ...doc.data(),
          // tambien se puede hacer asi
          // id: doc.id,
          // nombre: data.nombre,
          // imagen: data.imagen
        } as User;
      });
      setUsers(usersList);
      setLoading(false);
    });

    // Cleanup: Desuscribirse de los cambios cuando el componente se desmonte
    return () => subscriber();
  }, []);

  const renderSkeleton = () => (
    <View style={styles.userCard}>
      <SkeletonItem
        width={50}
        height={50}
        borderRadius={25}
        style={styles.skeletonImage}
      />
      <SkeletonItem
        width={100}
        height={20}
        borderRadius={5}
        style={styles.skeletonText}
      />
    </View>
  );

  const openModal = (user: User) => {
    setSelectedUser(user); // Pasar directamente el objeto user
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedUser(null);
  };

  const renderUserItem = ({ item }: { item: User }) => (
    <View style={styles.userCard}>
      <TouchableOpacity onPress={() => openModal(item)}>
        <Image uri={item.imagen} style={styles.profileImage} />
      </TouchableOpacity>

      <Text style={styles.userName}>{item.nombre}</Text>
    </View>
  );

  return (
    <View>
      <Header />
      {loading ? (
        // Renderizar una lista de skeletons mientras los datos se cargan
        <FlatList
          data={Array(10).fill({})} // Crear un array de longitud 10 para los skeletons
          renderItem={renderSkeleton}
          keyExtractor={(_, index) => index.toString()}
        />
      ) : (
        // Renderizar la lista de usuarios una vez que los datos se hayan cargado
        <>
          <FlatList
            data={users}
            renderItem={renderUserItem}
            keyExtractor={(item) => item.id}
          />
          <UserModal
            visible={modalVisible}
            onClose={closeModal}
            user={selectedUser}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  userCard: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  skeletonImage: {
    marginRight: 10,
  },
  skeletonText: {
    marginLeft: 10,
  },
});

// // Likes.tsx
// import React from 'react';
// import { View, StyleSheet, Text } from 'react-native';
// import Header from "../../components/Header";
// import { db } from "../../config/FirebaseConfig";
// import { collection, onSnapshot, DocumentData } from "firebase/firestore";
// import { Image } from 'react-native-expo-image-cache';
// import DataList from '../../components/DataList';
// import SkeletonItem from '../../components/SkeletonItem';
// import Colors from '../../constants/Colors';

// type User = {
//   id: string;
//   nombre: string;
//   imagen: string;
// };

// export default function Likes() {
//   const fetchUsers = (): Promise<User[]> => {
//     return new Promise((resolve) => {
//       const usersCollection = collection(db, "users");
//       const subscriber = onSnapshot(usersCollection, (snapshot) => {
//         const usersList = snapshot.docs.map((doc) => {
//           const data = doc.data() as DocumentData;
//           return {
//             id: doc.id,
//             nombre: data.nombre ?? 'Unknown', // Default if 'nombre' is not available
//             imagen: data.imagen ?? '', // Default if 'imagen' is not available
//           } as User;
//         });
//         resolve(usersList);
//       });
//     });
//   };

//   const renderSkeleton = () => (
//     <View style={styles.userCard}>
//       <SkeletonItem width={50} height={50} borderRadius={25} style={styles.skeletonImage} />
//       <SkeletonItem width={100} height={20} borderRadius={5} style={styles.skeletonText} />
//     </View>
//   );

//   const renderUserItem = ({ item }: { item: User }) => (
//     <View style={styles.userCard}>
//       <Image uri={item.imagen} style={styles.profileImage} />
//       <Text style={styles.userName}>{item.nombre}</Text>
//     </View>
//   );

//   return (
//     <View>
//       <Header />
//       <DataList<User>
//         fetchData={fetchUsers}
//         renderItem={renderUserItem}
//         renderSkeleton={renderSkeleton}
//         itemKeyExtractor={(item) => item.id}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   userCard: {
//     flexDirection: "row",
//     padding: 10,
//     alignItems: "center",
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.divider,
//   },
//   profileImage: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     marginRight: 10,
//   },
//   userName: {
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   skeletonImage: {
//     marginRight: 10,
//   },
//   skeletonText: {
//     marginLeft: 10,
//   },
// });
