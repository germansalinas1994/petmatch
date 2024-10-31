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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth0 } from "react-native-auth0";
import { useRouter } from "expo-router";
import LoadingIndicator from "@/components/Loading";
import useUserStore from "@/stores/userStore";

const { width, height } = Dimensions.get("window");

export default function Home() {

  const { authorize, user, isLoading, getCredentials } = useAuth0();
  const {
    token,
    validToken,
    setToken,
    setImagen,
    setIsAuthenticated,
    setName,
  } = useUserStore();

  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      if (token && validToken()) {
        router.replace("/(tabs)/home");
      } else if (user) {
        await setGlobalUser();
        router.replace("/(tabs)/home");
      }
    };
    if (router) {
      checkAuth();
    }
  }, [user, token]);

  const setGlobalUser = async () => {
    try {
      const credentials = await getCredentials();
      if (credentials?.idToken) {
        setToken(credentials.idToken);
        const userPicture = user?.picture ?? "";
        setImagen(userPicture);
        setIsAuthenticated(true);
        setName(user?.name ?? "");
      }
    } catch (error) {
      console.log("Error al autorizar:", error);
    }
  };

  const handleLogin = async () => {
    try {
      console.log("Login pressed");
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
        <View style={{ alignItems: "center", marginBottom: height * 0.6 }}>
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
                    ? Colors.background.secondaryButton // Color al presionar
                    : Colors.background.primaryButton, // Color normal
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
