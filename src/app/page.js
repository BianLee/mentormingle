"use client";
import LandingPage from "@/components/LandingPage/LandingPage";
import useInitializeAuth from "../hooks/authHook";

export default function Home() {
  useInitializeAuth();
  return (
    <>
      <LandingPage />
    </>
  );
}
