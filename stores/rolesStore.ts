// stores/categoriesStore.ts
import { create } from 'zustand';

import { Rol } from "@/types";


// Definimos la interfaz para el store
interface RolesStore {
  roles: Rol[]; 
  setRoles: (roles: Rol[]) => void; 
}

// Creamos el store usando Zustand
const useRolesStore = create<RolesStore>((set) => ({
  roles: [], // Estado inicial de las categorías
  setRoles: (roles) => set({ roles }),
}));

export default useRolesStore;
