// src/store/usePetStore.ts
import { create } from 'zustand';
import { Pet } from "@/types";

interface PetStore {
  selectedPet: Pet | null;
  setSelectedPet: (pet: Pet) => void;
}

export const usePetStore = create<PetStore>((set) => ({
  selectedPet: null,
  setSelectedPet: (pet: Pet) => set({ selectedPet: pet }),
}));
