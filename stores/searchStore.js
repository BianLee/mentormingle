import create from "zustand";

const useStore = create((set) => ({
  searchTerm: "",
  setSearchTerm: (term) => set(() => ({ searchTerm: term })),
}));

export default useStore;
