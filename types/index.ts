// types/index.ts

export interface User {
    user_id: string;
    nombre: string;
    email: string;
    imagen?: string;
    localidad: string;
    descripcion: string;
    edad: number
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
    descripcion: string;
  }
  
  export interface UserPetInteraction {
    user_id: string;
    pet_id: string;
    status: "like" | "dislike";
    createdAt: Date;
  }
  
  