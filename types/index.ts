// types/index.ts

import { Ionicons } from "@expo/vector-icons";

export interface User {
    user_id: string;
    nombre: string;
    mail: string;
    imagen?: string;
    localidad: string;
    descripcion: string;
    telefono: string;
    edad: number;
    rol_id: string;
    createdAt: Date;
  } 
  
  export interface Pet {
    pet_id: string;
    nombre: string;
    tipo: string;
    edad: number;
    sexo: string;
    peso: string;
    images: string[];
    user_id: string;
    direccion: string;
    telefono: string;
    descripcion: string;
  }
  
  export interface UserPetInteraction {
    user_id: string;
    pet_id: string;
    status: "like" | "dislike";
    createdAt: Date;
  }

  export interface Rol {
    rol_id: string;
    descripcion: string;
    codigo: string;
  }
  
  
  export interface MenuItem {
    id: number;
    name: string;
    icon: keyof typeof Ionicons.glyphMap; // Tipamos icon para que solo acepte íconos válidos
    path: string;
  }