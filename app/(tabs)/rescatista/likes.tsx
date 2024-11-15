import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { db } from "@/config/FirebaseConfig";
import {
  collection,
  onSnapshot,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import SkeletonItem from "@/components/SkeletonItem";
import Colors from "@/constants/Colors";
import UserModal from "@/components/UserModal";
import { User } from "@/types/index";
import useUserStore from "@/stores/userStore";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { RoleCodes } from "@/constants/roles";



export default function Likes() {
  useProtectedRoute(RoleCodes.Rescatista);
  
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [noPetsFound, setNoPetsFound] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [petId, setPetId] = useState<string | null>(null);
  const { idUser } = useUserStore();
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    if (!idUser) {
      setPetId(null);
      setUsers([]);
      setLoading(false);
      return;
    }

    const getPetId = async () => {
      try {
        const petsCollection = collection(db, "pets");
        const petsQuery = query(petsCollection, where("user_id", "==", idUser));
        const petsSnapshot = await getDocs(petsQuery);

        if (!petsSnapshot.empty) {
          const petDoc = petsSnapshot.docs[0];
          setPetId(petDoc.id);
        } else {
          setNoPetsFound(true);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error al obtener el petId:", error);
        setLoading(false);
      }
    };

    getPetId();
  }, [idUser]);

  useEffect(() => {
    if (!petId) return;

    const likesCollection = collection(db, "user_pets_likes_dislikes");
    const likesQuery = query(
      likesCollection,
      where("pet_id", "==", petId),
      where("status", "==", "like")
    );

    const unsubscribeLikes = onSnapshot(likesQuery, (likesSnapshot) => {
      const likedUserIds = likesSnapshot.docs.map((doc) => doc.data().user_id);

      if (likedUserIds.length > 0) {
        const usersCollection = collection(db, "users");
        const userQuery = query(
          usersCollection,
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

        return () => unsubscribeUsers();
      } else {
        setUsers([]);
        setLoading(false);
      }
    });

    return () => unsubscribeLikes();
  }, [petId]);

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
        <Image
          source={
            item.imagen
              ? { uri: item.imagen }
              : require('@/assets/images/default_user.jpg')
          }
          style={styles.profileImage}
          onLoad={() => setIsImageLoaded(true)}
        />
      </TouchableOpacity>
      <Text style={styles.userName}>{item.nombre}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <FlatList
          data={Array(10).fill({})}
          renderItem={renderSkeleton}
          keyExtractor={(_, index) => index.toString()}
        />
      ) : noPetsFound ? (
        <View style={styles.centeredMessage}>
          <Text style={styles.messageText}>No tienes mascotas cargadas.</Text>
        </View>
      ) : users.length === 0 ? (
        <View style={styles.centeredMessage}>
  <Text style={styles.messageText}>Tu mascota aún no tiene likes.</Text>
  </View>
      ) : (
        <FlatList
          data={users}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.user_id}
        />
      )}
      <UserModal
        visible={modalVisible}
        onClose={closeModal}
        user={selectedUser || null}
      />
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Asegura que el contenedor ocupe toda la pantalla
  },
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
  centeredMessage: {
    flex: 1, 
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  messageText: {
    fontSize: 20, 
    textAlign: "center",
    color: Colors.text.primary, 
  },
  
});
