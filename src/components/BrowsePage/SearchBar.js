import React from "react";
import useStore from "../../../stores/store"; // Adjust the path as necessary
import { Dialog, Menu, Transition } from "@headlessui/react";
import useInitializeAuth from "../../hooks/authHook";
import useAuthStore from "../../../stores/authStore";
import useSearchStore from "../../../stores/searchStore";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";

export default function SearchBar() {
  const searchTerm = useSearchStore((state) => state.searchTerm);
  const setSearchTerm = useSearchStore((state) => state.setSearchTerm);

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };
  useInitializeAuth();

  const { isAuthenticated, setAuth } = useAuthStore((state) => ({
    isAuthenticated: state.isAuthenticated,
    setAuth: state.setAuth,
  }));
  const routeToLogin = () => {
    router.push("/login");
  };

  return (
    <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 ">
      <form className="relative flex flex-1">
        <label htmlFor="search-field" className="sr-only">
          Search
        </label>

        <MagnifyingGlassIcon
          className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
          aria-hidden="true"
        />
        <input
          id="search-field"
          className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 focus:outline-none sm:text-sm"
          placeholder="Search..."
          type="search"
          name="search"
          onChange={handleInputChange}
          style={{ outline: "none" }} // Add this line to apply inline styles
        />
      </form>

      <div className="flex items-center gap-x-4 lg:gap-x-6">
        {/* Separator */}
        <div
          className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
