import { View, StyleSheet, FlatList, Text } from "react-native";
import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Colors from "../../constants/Colors";
import { db } from "../../config/FirebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";
import Loading from "../../components/Loading";
import { Image } from 'react-native-expo-image-cache';


export default function Likes() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); // Set loading to true on component mount



  useEffect(() => {
    
    // Usar onSnapshot para escuchar cambios en tiempo real en la colección "users"
    const usersCollection = collection(db, "users");
    const suscriber = onSnapshot(usersCollection, (snapshot) => {
      const usersList = snapshot.docs.map((doc) => ({
        id: doc.id,
        // los tres puntos son el spread operator, se usa para copiar las propiedades de un objeto a otro
        ...doc.data(),

        // tambien podria hacerse asi
        // id: doc.id,
        // nombre: doc.data().nombre,
        // imagen: doc.data().imagen

      }));
      setUsers(usersList);
      setLoading(false);

    });

    // Cleanup: Desuscribirse de los cambios cuando el componente se desmonte
    return () => suscriber();
  }, []);


  if (loading) {

    return <Loading />;
  }


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
      <FlatList
        data={users}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id}
        initialNumToRender={10}
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
});
