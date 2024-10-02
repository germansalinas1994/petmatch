import { View, StyleSheet, FlatList, Text, Image } from "react-native";
import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Colors from "../../constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../../config/FirebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";

export default function Likes() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Usar onSnapshot para escuchar cambios en tiempo real en la colección "users"
    const usersCollection = collection(db, "users");
    const unsubscribe = onSnapshot(usersCollection, (snapshot) => {
      const usersList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersList);
    });

    // Cleanup: Desuscribirse de los cambios cuando el componente se desmonte
    return () => unsubscribe();
  }, []);

  const renderUserItem = ({ item }) => (
    <View style={styles.userCard}>
      <Image source={{ uri: item.imagen }} style={styles.profileImage} />
      <Text style={styles.userName}>{item.nombre}</Text>
    </View>
  );

  return (
    <View>
      <Header />
      <FlatList
        data={users}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  userCard: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
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
});
