import { Ionicons } from "@expo/vector-icons";
import { MenuItem } from "@/types/index";


export const MenuItemRescatista: MenuItem[] = [
  {
    id: 1,
    name: "Configurar",
    icon: "settings" as keyof typeof Ionicons.glyphMap,
    path: "/change-profile",
  },
  {
    id: 2,
    name: "Mis mascotas",
    icon: "list" as keyof typeof Ionicons.glyphMap,
    path: "/(tabs)/rescatista/likes",
  },
  {
    id: 3,
    name: "Cerrar sesión",
    icon: "exit" as keyof typeof Ionicons.glyphMap,
    path: "logout",
  },
];

export const MenuItemAdoptante: MenuItem[] = [
  {
    id: 1,
    name: "Configurar",
    icon: "settings" as keyof typeof Ionicons.glyphMap,
    path: "/change-profile",
  },
  {
    id: 2,
    name: "Ver mascotas",
    icon: "list" as keyof typeof Ionicons.glyphMap,
    path: "/(tabs)/adoptante/find",
  },
  {
    id: 3,
    name: "Cerrar sesión",
    icon: "exit" as keyof typeof Ionicons.glyphMap,
    path: "logout",
  },
];
