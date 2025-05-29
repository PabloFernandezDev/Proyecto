import { create } from 'zustand';

export const useNotificacionesStore = create((set) => ({
  notificaciones: [],
  recargar: false,

  setNotificaciones: (nuevas) => set({ notificaciones: nuevas }),

  dispararRecarga: () => set({ recargar: true }),

  consumirRecarga: () => set({ recargar: false }),
}));
