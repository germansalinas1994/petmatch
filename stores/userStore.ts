import { create } from 'zustand';
import { isTokenValid  } from '../utils/tokenUtils'; // Importa la función de validación desde utils

// Definimos el store para manejar el estado global del token
interface UserStore {
  idUser: string | null;
  token: string | null;
  name: string | null;
  email: string | null;
  imagen: string | null;
  isAuthenticated: boolean;
  setIdUser: (idUser: string) => void;
  setToken: (token: string) => void;
  setEmail: (email: string) => void;
  setImagen: (imagen: string) => void;
  setName: (name: string) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  clearUser: () => void;
  validToken: () => boolean; // Función para validar el token
}

const useUserStore = create<UserStore>((set, get) => ({
  idUser: null, //Estado inicial del idUser de firebase
  token: null, // Estado inicial del token
  email: null, // Estado inicial del email
  imagen: null, // Estado inicial de la imagen
  isAuthenticated: false, // Estado inicial de autenticación
  name: null, // Estado inicial del nombre

  setIdUser: (idUser: string) => set({ idUser }), // Función para actualizar el idUser
  // Función para actualizar el token
  setToken: (token: string) => set({ token }),

  // Función para actualizar el email
  setEmail: (email: string) => set({ email }),

  setImagen: (imagen: string) => set({ imagen }),

  setIsAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }), // Función para actualizar el estado de autenticación

  setName: (name: string) => set({ name }), // Función para actualizar el nombre

  // Función para limpiar el estado (logout)
  clearUser: () => set({ token: null, email: null, idUser: null, imagen: null, isAuthenticated: false, name: null }),

  // Función para validar el token globalmente
  validToken: () => {
    const token = get().token; // Acceder al token actual desde el estado
    return isTokenValid(token); // Usa la función de utils para validar el token
  },
}));

export default useUserStore;
