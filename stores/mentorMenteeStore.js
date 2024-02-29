import create from "zustand";

const useMentorMenteeStore = create((set) => ({
  currentSelection: "Mentors", // Default selection
  setCurrentSelection: (selection) =>
    set(() => ({ currentSelection: selection })),
}));

export default useMentorMenteeStore;
