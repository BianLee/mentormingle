import React, { useState, useEffect } from "react";
import { supabase } from "../src/utils/supabaseClient";
import "../src/app/globals.css";
import { useRouter } from "next/router";
import useAuthStore from "../stores/authStore";
import useInitializeAuth from "../src/hooks/authHook";
import useMentorMenteeStore from "../stores/mentorMenteeStore";

export default function Profile() {
  useInitializeAuth();
  const [profile, setProfile] = useState({
    name: "",
    grad_year: 2026,
    description: "",
    major: "",
    pfp_url: "",
    current_company: "",
    curr_role: "",
    bio: "",
  });
  const user = useAuthStore((state) => state.user);
  const [isUploading, setIsUploading] = useState(false);
  const [userRoleStatus, setUserRoleStatus] = useState("");
  const [statusLocal, setStatusLocal] = useState("");

  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();
    let table;
    if (statusLocal == "Mentor") {
      table = "mentors";
    } else {
      table = "mentees";
    }
    const { error: updateError } = await supabase.from(table).upsert(
      {
        email: user.email,
        name: profile.name,
        grad_year: profile.grad_year,
        pfp_url: profile.pfp_url,
        current_company: profile.current_company,
        major: profile.major,
        curr_role: profile.curr_role,
        bio: profile.bio,
      },
      {
        onConflict: "email",
      }
    );

    router.push("/browse");
  };

  const handleChange = (e) => {
    console.log(e.target.name);
    console.log(e.target.value);
    const { name, value } = e.target;
    setProfile((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = async (e) => {
    setIsUploading(true); // Indicate the upload process has started

    const file = e.target.files[0];
    if (!file) return;

    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    var { data, error } = await supabase.storage
      .from("pfp")
      .upload(filePath, file);

    setIsUploading(false); // Upload finished

    if (error) {
      alert("Error uploading file: ", error.message);
      return;
    }

    // Get public URL for the uploaded file
    data = supabase.storage.from("pfp").getPublicUrl(filePath);

    console.log(data.data.publicUrl);
    // Update profile state with the new profile picture URL
    setProfile((prevState) => ({
      ...prevState,
      pfp_url: data.data.publicUrl,
    }));
  };

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        const { data: one } = await supabase
          .from("usersviewtwo")
          .select("*")
          .filter("raw_user_meta_data", "cs", `{"email": "${user.email}"}`) // Adjust based on your actual metadata structure
          .single();

        if (!one) {
          console.error("No user found in usersviewtwo");
          return; // Exit the function if no user is found
        }

        console.log(one.raw_user_meta_data.roleStatus);
        setStatusLocal(one.raw_user_meta_data.roleStatus);

        // Corrected the assignment operator here
        let tableVal =
          one.raw_user_meta_data.roleStatus == "Mentor" ? "mentors" : "mentees";

        const { data, error } = await supabase
          .from(tableVal)
          .select("*")
          .eq("email", user.email)
          .single();

        if (error) {
          console.error("Error fetching user data", error);
        } else if (data) {
          console.log(
            "User found with matching email in raw_user_meta_data",
            data
          );
          setProfile({
            email: data.email,
            name: data.name,
            grad_year: data.grad_year,
            pfp_url: data.pfp_url,
            major: data.major,
            current_company: data.current_company,
            curr_role: data.curr_role,
            bio: data.bio,
          });
        } else {
          console.log(
            "User not found or no matching email in raw_user_meta_data"
          );
        }
      };

      fetchUserData();
    } else {
      console.log("user not found");
    }
  }, [user]);

  return (
    <form onSubmit={handleSubmit}>
      <div className="mx-auto sm:w-11/12 md:w-3/4 lg:w-6/12 w-11/12 mt-10">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base leading-7 text-gray-900">Profile</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Update your profile information.
          </p>

          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label
                htmlFor="about"
                className="block text-sm font-medium leading-6 text-gray-900 mt-8"
              >
                Account Email
              </label>
              <p>{profile.email}</p>
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Name
              </label>
              <div className="mt-2">
                <div className="flex  bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-0  sm:text-sm sm:leading-6"
                    placeholder="Bian Lee"
                  />
                </div>
              </div>
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Major
              </label>
              <div className="mt-2">
                <div className="flex  bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    name="major"
                    value={profile.major}
                    onChange={handleChange}
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-0  sm:text-sm sm:leading-6"
                    placeholder="2026"
                  />
                </div>
              </div>
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Grad Year
              </label>
              <div className="mt-2">
                <div className="flex  bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    name="grad_year"
                    value={profile.grad_year}
                    onChange={handleChange}
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-0  sm:text-sm sm:leading-6"
                    placeholder="2026"
                  />
                </div>
              </div>
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Current Company
              </label>
              <div className="mt-2">
                <div className="flex  bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    name="current_company"
                    value={profile.current_company}
                    onChange={handleChange}
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-0  sm:text-sm sm:leading-6"
                    placeholder="Jane Street"
                  />
                </div>
              </div>
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Role
              </label>
              <div className="mt-2">
                <div className="flex bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    name="curr_role"
                    value={profile.curr_role}
                    onChange={handleChange}
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-0  sm:text-sm sm:leading-6"
                    placeholder="Software Engineer Intern"
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
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                  rows={3}
                  className="block w-full rounded-md border-2 py-1.5 pl-3 pr-3 text-gray-900 placeholder:text-gray-400  h-36  sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="profile_picture"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Profile Picture
              </label>
              <input
                type="file"
                name="profile_picture"
                onChange={handleFileChange}
                className="mt-1 block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-center justify-end gap-x-6">
        <button type="button" className="text-sm  leading-6 text-gray-900">
          Cancel
        </button>
        <button
          type="submit"
          disabled={isUploading}
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Save
        </button>
      </div>
    </form>
  );
}
