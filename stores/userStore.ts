import { create } from 'zustand';
import { isTokenValid } from '../utils/tokenUtils'; // Importa la función de validación desde utils

// Definimos el store para manejar el estado global del token
interface UserStore {
  idUser: string | null;
  token: string | null;
  nombre: string | null;
  mail: string | null;
  descripcion: string | null;
  imagen: string | null;
  rol: string | null;
  isAuthenticated: boolean;
  setIdUser: (idUser: string) => void;
  setToken: (token: string) => void;
  setEmail: (email: string) => void;
  setDescripcion: (descripcion: string) => void;
  setImagen: (imagen: string) => void;
  setName: (name: string) => void;
  setRol: (rol: string) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  clearUser: () => void;
  validToken: () => boolean; // Función para validar el token
}

const useUserStore = create<UserStore>((set, get) => ({
  idUser: null,
  token: null,
  mail: null,
  imagen: null,
  descripcion: null,
  isAuthenticated: false,
  nombre: null,
  rol: null,

  setIdUser: (idUser: string) => set({ idUser }),

  // Función para actualizar el token y ajustar `isAuthenticated`
  setToken: (token: string) => {
    set({ token, isAuthenticated: !!token && isTokenValid(token) });
  },

  setEmail: (mail: string) => set({ mail }),

  setImagen: (imagen: string) => set({ imagen }),

  setRol: (rol: string) => set({ rol }),

  setIsAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),

  setDescripcion: (descripcion: string) => set({ descripcion }),

  setName: (nombre: string) => set({ nombre }),

  // Función para limpiar el estado (logout)
  clearUser: () => set({
    token: null,
    mail: null,
    idUser: null,
    imagen: null,
    isAuthenticated: false,
    nombre: null,
    rol: null,
    descripcion: null,
  }),

  // Función para validar el token globalmente
  validToken: () => {
    const token = get().token;
    return isTokenValid(token); // Usa la función de utils para validar el token
  },
}));

export default useUserStore;
