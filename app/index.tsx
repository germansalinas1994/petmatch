import React, { useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  Dimensions,
  StyleSheet,
  Image,
  SafeAreaView,
} from "react-native";
import Colors from "../constants/Colors";
import { useAuth0 } from "react-native-auth0";
import { useRouter } from "expo-router";
import LoadingIndicator from "@/components/Loading";
import useUserStore from "@/stores/userStore";
import { db } from "@/config/FirebaseConfig";
import {
  doc,
  collection,
  setDoc,
  where,
  getDocs,
  query,
} from "firebase/firestore";

const { width, height } = Dimensions.get("window");

export default function Home() {
  const { authorize, user, isLoading, getCredentials } = useAuth0();
  const {
    token,
    validToken,
    setToken,
    setImagen,
    setIsAuthenticated,
    setEmail,
    setIdUser,
  } = useUserStore();

  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (token && validToken()) {
          router.replace("/home");
        } else if (user) {
          await setGlobalUser();
          router.replace("/home");
        }
      } catch (error) {
        console.error("Error durante la autenticación:", error);
      }
    };

    if (!isLoading && (user || token)) {
      checkAuth();
    }
  }, [user, token, isLoading]);

  const setGlobalUser = async () => {
    try {
      const credentials = await getCredentials();
      if (credentials?.idToken) {
        setToken(credentials.idToken);
        const userPicture = user?.picture ?? "";
        setImagen(userPicture);
        setIsAuthenticated(true);
        setEmail(user?.email ?? "");
        console.log("User:", user);
        console.log(user?.email);

        // Verificar o crear usuario en Firestore
        await checkOrCreateUser(user?.email || "");
      }
    } catch (error) {
      console.log("Error al autorizar:", error);
    }
  };

  const checkOrCreateUser = async (email: string) => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("mail", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      const newUser = doc(usersRef);
      await setDoc(newUser, {
        mail: email,
        createdAt: new Date(),
      });
      setIdUser(newUser.id);
    } else {
      const userDoc = querySnapshot.docs[0];
      setIdUser(userDoc.id);
    }
  };

  const handleLogin = async () => {
    try {
      await authorize();
    } catch (error) {
      console.log("Login error:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require("@/assets/images/home2.png")}
          style={styles.image}
          resizeMode="contain"
        />
        <View style={styles.description}>
          <Text style={styles.title}>Listo para hacer un nuevo amigo?</Text>
          <Text style={styles.subtitle}>
            Sumate a adoptar una mascota, darle un hogar y hacerla feliz.
          </Text>

          {isLoading ? (
            <LoadingIndicator />
          ) : !user ? (
            <Pressable
              style={({ pressed }) => [
                styles.button,
                {
                  backgroundColor: pressed
                    ? Colors.background.secondaryButton
                    : Colors.background.primaryButton,
                  shadowOffset: { width: 0, height: pressed ? 2 : 5 },
                  shadowOpacity: pressed ? 0.5 : 0.3,
                  shadowRadius: pressed ? 3 : 6,
                  elevation: pressed ? 2 : 5,
                },
              ]}
              onPress={handleLogin}
            >
              <Text style={styles.buttonText}>Iniciar sesión</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.default,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },
  description: {
    alignItems: "center",
    marginBottom: height * 0.6,
  },
  image: {
    width: width * 0.9,
    height: height * 0.5,
    marginTop: 35,
  },
  title: {
    fontFamily: "outfit-Bold",
    fontSize: 30,
    textAlign: "center",
    color: Colors.text.primary,
    width: width * 0.8,
  },
  subtitle: {
    fontFamily: "outfit",
    fontSize: 18,
    textAlign: "center",
    marginTop: 10,
    width: width * 0.8,
  },
  button: {
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.15,
    marginTop: 30,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    fontFamily: "outfit-Medium",
    fontSize: 20,
    textAlign: "center",
    color: Colors.text.white,
  },
});
