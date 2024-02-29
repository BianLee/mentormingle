import create from "zustand";

const useSelectedMajorStore = create((set) => ({
  selectedMajor: { id: 5, name: "All Majors" }, // Default value
  setSelectedMajor: (major) => set({ selectedMajor: major }),
}));

export default useSelectedMajorStore;
