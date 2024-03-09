import create from "zustand";

const useSelectedYearStore = create((set) => ({
  selectedYear: { id: 5, name: "All Years" }, // Default value
  setSelectedYear: (year) => set({ selectedYear: year }),
  selectedYearForMentee: { id: 5, name: "All Years" }, // Default value
  setSelectedYearForMentee: (year) => set({ setSelectedYearForMentee: year }),
}));

export default useSelectedYearStore;
