import React, { useState, useEffect } from "react";
import { supabase } from "../src/utils/supabaseClient";
import "../src/app/globals.css";
import useAuthStore from "../stores/authStore";
import useInitializeAuth from "../src/hooks/authHook";

export default function Profile() {
  useInitializeAuth();
  const [club, setClub] = useState({ name: "", description: "", pfp_url: "" });
  const user = useAuthStore((state) => state.user);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e) => {};

  const handleChange = (e) => {};

  const handleFileChange = async (e) => {};

  return (
    <form onSubmit={handleSubmit}>
      <div className="mx-auto sm:w-11/12 md:w-3/4 lg:w-6/12 w-11/12 mt-10">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Profile
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Update your profile information.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Full Name
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    name="name"
                    value={club.name}
                    onChange={handleChange}
                    id="username"
                    autoComplete="username"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-0  sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="about"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Profile Description
              </label>
              <div className="mt-2">
                <textarea
                  name="description"
                  value={club.description}
                  onChange={handleChange}
                  rows={3}
                  className="block w-full rounded-md border-2 py-1.5 pl-3 pr-3 text-gray-900 placeholder:text-gray-400  h-36  sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-center justify-end gap-x-6">
        <button
          type="button"
          className="text-sm font-semibold leading-6 text-gray-900"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isUploading}
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Save
        </button>
      </div>
    </form>
  );
}
