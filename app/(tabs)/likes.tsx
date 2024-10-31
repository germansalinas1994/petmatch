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
import {
  collection,
  onSnapshot,
  DocumentData,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { Image } from "react-native-expo-image-cache";
import SkeletonItem from "../../components/SkeletonItem";
import Colors from "../../constants/Colors";
import UserModal from "../../components/UserModal";
import { User } from "@/types/index";

export default function Likes() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const hardcodedPetId = "2Gedud8sPt2EakcO19Cf";

  useEffect(() => {
    // Suscripción en tiempo real a `user_pets_likes_dislikes`
    const likesCollection = collection(db, "user_pets_likes_dislikes");
    const likesQuery = query(
      likesCollection,
      where("pet_id", "==", hardcodedPetId),
      where("status", "==", "like")
    );

    const unsubscribeLikes = onSnapshot(likesQuery, (likesSnapshot) => {
      //tiene el id de los usuarios que dieron like
      const likedUserIds = likesSnapshot.docs.map((doc) => doc.data().user_id);

      if (likedUserIds.length > 0) {
        // Segunda suscripción en tiempo real a la colección `users`
        const usersCollection = collection(db, "users");
        const userQuery = query(
          usersCollection,
          //con el __name__ se puede hacer una query con un array de ids
          where("__name__", "in", likedUserIds)
        );

        const unsubscribeUsers = onSnapshot(userQuery, (userSnapshot) => {
          const usersList = userSnapshot.docs.map((doc) => ({
            user_id: doc.id,
            ...doc.data(),
          })) as User[];

          setUsers(usersList);
          setLoading(false);
        });

        // Limpiar suscripción de `users` al desmontar
        return () => unsubscribeUsers();
      } else {
        setUsers([]); // Si no hay likes, vacía la lista
        setLoading(false);
      }
    });

    // Limpiar suscripción de `likes` al desmontar
    return () => unsubscribeLikes();
  }, [hardcodedPetId]);

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
    setSelectedUser(user);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedUser(null);
  };

  const renderUserItem = ({ item }: { item: User }) => (
    <View style={styles.userCard}>
      <TouchableOpacity onPress={() => openModal(item)}>
        <Image uri={item.imagen || ""} style={styles.profileImage} />
      </TouchableOpacity>

      <Text style={styles.userName}>{item.nombre}</Text>
    </View>
  );

  return (
    <View>
      <Header title="Interesados" />
      {loading ? (
        <FlatList
          data={Array(10).fill({})} 
          renderItem={renderSkeleton}
          keyExtractor={(_, index) => index.toString()}
        />
      ) : (
        <>
          <FlatList
            data={users}
            renderItem={renderUserItem}
            keyExtractor={(item) => item.user_id}
          />
          <UserModal
            visible={modalVisible}
            onClose={closeModal}
            user={selectedUser || null}
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
