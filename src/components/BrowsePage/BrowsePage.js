import ProfileCard from "./ProfileCard";
import NavBar from "../NavBar";
import SecondFilterBar from "./SecondFilterBar";

export default function BrowsePage() {
  return (
    <div className="min-h-full bg-gray-50">
      <NavBar />
      <SecondFilterBar />
      <div className="py-5">
        <main>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <ProfileCard />
          </div>
        </main>
      </div>
    </div>
  );
}
