import { View, StyleSheet, FlatList, Text } from "react-native";
import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Colors from "../../constants/Colors";
import { db } from "../../config/FirebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";
import { Image } from 'react-native-expo-image-cache';
import { MotiView } from 'moti';

export default function Likes() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const usersCollection = collection(db, "users");
    const suscriber = onSnapshot(usersCollection, (snapshot) => {
      const usersList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
        
        // tambien puede hacerse asi
        // id: doc.id,
        // nombre: doc.data().nombre,
        // imagen: doc.data().imagen
      }));
      setUsers(usersList);
      setLoading(false);
    });

    return () => suscriber();
  }, []);

  const renderSkeleton = () => (
    <View style={styles.userCard}>
      <MotiView
        style={[styles.profileImage, styles.skeleton]}
        from={{ opacity: 0.3 }}
        animate={{ opacity: 1 }}
        transition={{
          type: 'timing',
          duration: 800,
          loop: true,
        }}
      />
      <MotiView
        style={[styles.userNameSkeleton, styles.skeleton]}
        from={{ opacity: 0.3 }}
        animate={{ opacity: 1 }}
        transition={{
          type: 'timing',
          duration: 800,
          loop: true,
        }}
      />
    </View>
  );

  const renderUserItem = ({ item }) => (
    <View style={styles.userCard}>
      <Image
        uri={item.imagen}
        style={styles.profileImage}
      />
      <Text style={styles.userName}>{item.nombre}</Text>
    </View>
  );

  return (
    <View>
      <Header />
      {loading ? (
        // Renderiza algunos skeletons mientras carga
        <FlatList
          data={Array(10).fill({})} // Puedes ajustar la cantidad de skeletons
          renderItem={renderSkeleton}
          keyExtractor={(_, index) => index.toString()}
        />
      ) : (
        <FlatList
          data={users}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.id}
          initialNumToRender={10}
        />
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
  skeleton: {
    backgroundColor: Colors.skeleton // Color gris para el efecto de carga
  },
  userNameSkeleton: {
    width: 100, // Ajusta el ancho del skeleton
    height: 20,
    borderRadius: 5,
    marginLeft: 10,
  },
});
