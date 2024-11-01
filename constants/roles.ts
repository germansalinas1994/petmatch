// constants/roles.ts

export const RoleCodes = {
  Rescatista: "R",
  Adoptante: "A",
} as const;

export const RoleDisplay: Record<keyof typeof RoleCodes, string> = {
  Rescatista: "Rescatista",
  Adoptante: "Adoptante",
};
