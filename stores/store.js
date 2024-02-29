import create from "zustand";
import { supabase } from "../src/utils/supabaseClient"; // Make sure the path to your Supabase client is correct

const useStore = create((set) => ({
  // Other states...
  schools: [],
  loading: false,
  error: null,
  setQuery: (query) => set(() => ({ query })),
  filteredPeople: () => {
    const state = useStore.getState();
    return state.query === ""
      ? state.schools
      : state.schools.filter((school) =>
          school.name.toLowerCase().includes(state.query.toLowerCase())
        );
  },
}));

export default useStore;
