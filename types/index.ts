// types/index.ts

export interface User {
    user_id: string;
    name: string;
    email: string;
    photoURL?: string;
    createdAt: Date;
  }
  
  export interface Pet {
    pet_id: string;
    name: string;
    species: string;
    age: number;
    gender: string;
    images: string[];
    description: string;
    createdAt: Date;
  }
  
  export interface UserPetInteraction {
    user_id: string;
    pet_id: string;
    status: "like" | "dislike";
    createdAt: Date;
  }
  
  