import { create } from "zustand";
import {
  clearIncidents,
  getIncidents,
  getSettings,
  setSettings,
} from "@/shared/storage";

function downloadJson(data, fileName) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

export const useExtensionStore = create((set, get) => ({
  incidents: [],
  settings: null,
  loading: true,
  saveMessage: "",

  loadAll: async () => {
    set({ loading: true });
    const [incidents, settings] = await Promise.all([
      getIncidents(),
      getSettings(),
    ]);
    set({ incidents, settings, loading: false });
  },

  refreshIncidents: async () => {
    const incidents = await getIncidents();
    set({ incidents });
  },

  updateSettings: async (patch) => {
    const next = await setSettings(patch);
    set({ settings: next, saveMessage: "Configuracion guardada" });
  },

  clearAllIncidents: async () => {
    await clearIncidents();
    set({ incidents: [] });
  },

  exportIncidents: async () => {
    downloadJson(get().incidents, `escudo-incidentes-${Date.now()}.json`);
  },

  setSaveMessage: (message) => set({ saveMessage: message }),
}));
