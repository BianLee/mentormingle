import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { supabase } from "../src/utils/supabaseClient";
import "@/app/globals.css";
const mentorOrMentee = [
  { id: "Mentor", title: "Mentor" },
  { id: "Mentee", title: "Mentee" },
];

export default function Example() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleStatus, setRoleStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const routeToLogin = () => {
    router.push("/login");
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { user, error: signUpError } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      console.log("what's wrong");
      setError(error.message);
      console.log(error.message);
    } else {
      // Optionally, handle any post-signup logic here
      console.log(
        "Signup successful, check your email for the verification link."
      );

      // Insert a row into the appropriate table with the user ID
      // Assuming you have a column in your table to store the user ID, adjust 'user_id' as necessary
      const { data, error: insertError } = await supabase
        .from("profiles")
        .insert([{ email: email }])
        .single();

      if (insertError) {
        console.error(
          "Error inserting user into role table",
          insertError.message
        );
        // Optionally handle this error, such as showing a message to the user
      } else {
        console.log("User role assigned successfully.");
        // Optionally, perform any additional logic after successfully assigning the role
      }
    }
    setLoading(false);
  };

  return (
    <>
      <div
        className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-900"
        style={{ backgroundImage: "url('/cta1.webp')" }}
      >
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-white">
            Sign up for an account
          </h2>
        </div>

        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-gray-50 px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <form className="space-y-6" action="#" onSubmit={handleSignUp}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="text-base font-semibold text-gray-900"></label>
                <p className="text-sm text-gray-500">
                  What best describes your role?
                </p>
                <fieldset className="mt-4">
                  <legend className="sr-only">Role</legend>
                  <div className="space-y-4">
                    {mentorOrMentee.map((status) => (
                      <div key={status.id} className="flex items-center">
                        <input
                          id={status.id}
                          name="role"
                          type="radio"
                          value={status.id}
                          checked={roleStatus === status.id}
                          onChange={(e) => setRoleStatus(e.target.value)}
                          className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label
                          htmlFor={status.id}
                          className="ml-3 block text-sm font-medium leading-6 text-gray-900"
                        >
                          {status.title}
                        </label>
                      </div>
                    ))}
                  </div>
                </fieldset>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Sign Up
                </button>
              </div>
              <p className="text-center text-sm leading-6 text-gray-500">
                Already have an account?{" "}
                <span
                  onClick={routeToLogin}
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Sign In
                </span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
