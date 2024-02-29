import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { supabase } from "../src/utils/supabaseClient";
import useAuthStore from "../stores/authStore";
import "@/app/globals.css";

export default function Example() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const routeToSignUp = () => {
    router.push("/signup");
  };

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const user = session?.user || null;
        useAuthStore.getState().setAuth(user); // Update global state
        if (user) {
          router.replace("/");
        }
      }
    );
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setError(error.message);
    } else {
      console.log("Login successful");
      router.push("/"); // Redirect to home after successful login
    }

    setLoading(false);
  };
  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      setError(error.message);
    } else {
      // Optionally, handle any post-signup logic here
      console.log(
        "Signup successful, check your email for the verification link."
      );
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
            Sign in to your account
          </h2>
        </div>

        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-gray-50 px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <form className="space-y-6" action="#" onSubmit={handleLogin}>
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
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Sign in
                </button>
              </div>
              <p className="text-center text-sm leading-6 text-gray-500">
                Not a member?{" "}
                <span
                  onClick={routeToSignUp}
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Sign Up
                </span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
