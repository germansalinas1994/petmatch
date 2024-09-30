import { Redirect } from "expo-router";
import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function HomeScreen() {
  //este directamente redirije a la pantalla de inicio definida en el archivo _layout.tsx
  return <Redirect href={'/home'} />;
  //Uso del Link
  // return (
  //   <View>
  //     <Link href="/home">Home</Link>
  //   </View>
  // );
}
