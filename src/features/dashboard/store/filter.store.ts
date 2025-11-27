import { create } from "zustand";

type DashboardFilterStore = {
  search: string;
  setSearch: (value: string) => void;
};

export const useDashboardFilterStore = create<DashboardFilterStore>((set) => ({
  search: "",
  setSearch: (value) =>
    set({
      search: value,
    }),
}));
