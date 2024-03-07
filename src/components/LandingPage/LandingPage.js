import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useAuthStore from "../../../stores/authStore";
import { supabase } from "../../../src/utils/supabaseClient";
import {} from "@heroicons/react/24/outline";

const navigation = [
  { name: "About", href: "/about" },
  { name: "Team", href: "#" },
  { name: "Contact", href: "#" },
];

export default function Example() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { isAuthenticated, setAuth } = useAuthStore((state) => ({
    isAuthenticated: state.isAuthenticated,
    setAuth: state.setAuth,
  }));

  const navigateToBrowse = () => {
    router.push(`/browse`);
  };

  const navigateToLogin = () => {
    router.push(`/login`);
  };

  const signOutUser = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setAuth(null);
    } else {
      console.error("Sign out error:", error.message);
    }
  };

  return (
    <div className="">
      {/* Header */}
      <header className="bg-gray-900">
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8"
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">MentorMingle</span>
              <p className="text-white">MentorMingle</p>
              {/* <img className="h-8 w-auto rounded-lg" src="/logo.jpg" alt="" /> */}
            </a>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
                color="white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm  leading-6 text-white"
              >
                {item.name}
              </a>
            ))}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            {!isAuthenticated && (
              <a
                onClick={navigateToLogin}
                className="text-sm  leading-6 text-white cursor-pointer"
              >
                Log In
              </a>
            )}
            {isAuthenticated && (
              <a
                onClick={signOutUser}
                className="text-sm leading-6 text-white cursor-pointer"
              >
                Log Out
              </a>
            )}
          </div>
        </nav>
        <dialog
          as="div"
          className="lg:hidden"
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
        >
          <div className="fixed inset-0 z-10" />
          <div className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">MentorMingle</span>
                <img
                  className="h-8 w-auto"
                  src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                  alt=""
                />
              </a>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="white"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                <div className="py-6">
                  {!isAuthenticated && (
                    <a
                      onClick={navigateToLogin}
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base leading-7 text-gray-900 hover:bg-gray-50 cursor-pointer"
                    >
                      Log In
                    </a>
                  )}
                  {isAuthenticated && (
                    <a
                      onClick={signOutUser}
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base leading-7 text-gray-900 hover:bg-gray-50 cursor-pointer"
                    >
                      Log Out
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </dialog>
      </header>

      <main className="isolate">
        <div className="relative">
          <div className="py-24 sm:py-32 bg-blue-900 bg-cover">
            <div className="mx-auto max-w-7xl px-6 lg:px-8 ">
              <div className="mx-auto max-w-2xl text-center">
                <h1 className="text-8xl tracking-tight text-white sm:text-8xl">
                  MentorMingle
                </h1>
                <p className="mt-6 text-lg leading-8 text-white">
                  Establishing Mentor-Mentee Relationships at UC Davis!
                </p>
                <div className="mt-7 flex items-center justify-center gap-x-2">
                  <a
                    onClick={() => navigateToBrowse()}
                    className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-md text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer"
                  >
                    Get paired with a mentor!{" "}
                    <span aria-hidden="true">&rarr;</span>
                  </a>
                </div>
              </div>{" "}
            </div>
          </div>
        </div>
      </main>

      {/*
      <LandingFooter />
       */}
    </div>
  );
}
