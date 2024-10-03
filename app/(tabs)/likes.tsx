// Likes.tsx
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Header from "../../components/Header";
import { db } from "../../config/FirebaseConfig";
import { collection, onSnapshot, DocumentData } from "firebase/firestore";
import { Image } from 'react-native-expo-image-cache';
import DataList from '../../components/DataList';
import SkeletonItem from '../../components/SkeletonItem';
import Colors from '../../constants/Colors';

type User = {
  id: string;
  nombre: string;
  imagen: string;
};

export default function Likes() {
  const fetchUsers = (): Promise<User[]> => {
    return new Promise((resolve) => {
      const usersCollection = collection(db, "users");
      const subscriber = onSnapshot(usersCollection, (snapshot) => {
        const usersList = snapshot.docs.map((doc) => {
          const data = doc.data() as DocumentData;
          return {
            id: doc.id,
            nombre: data.nombre ?? 'Unknown', // Default if 'nombre' is not available
            imagen: data.imagen ?? '', // Default if 'imagen' is not available
          } as User;
        });
        resolve(usersList);
      });
    });
  };

  const renderSkeleton = () => (
    <View style={styles.userCard}>
      <SkeletonItem width={50} height={50} borderRadius={25} style={styles.skeletonImage} />
      <SkeletonItem width={100} height={20} borderRadius={5} style={styles.skeletonText} />
    </View>
  );

  const renderUserItem = ({ item }: { item: User }) => (
    <View style={styles.userCard}>
      <Image uri={item.imagen} style={styles.profileImage} />
      <Text style={styles.userName}>{item.nombre}</Text>
    </View>
  );

  return (
    <View>
      <Header />
      <DataList<User>
        fetchData={fetchUsers}
        renderItem={renderUserItem}
        renderSkeleton={renderSkeleton}
        itemKeyExtractor={(item) => item.id}
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
  skeletonImage: {
    marginRight: 10,
  },
  skeletonText: {
    marginLeft: 10,
  },
});
