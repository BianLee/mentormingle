import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/20/solid";
import { supabase } from "../../utils/supabaseClient";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import useSearchStore from "../../../stores/searchStore";
import useSelectedMajorStore from "../../../stores/selectedMajorStore";
import useSelectedYearStore from "../../../stores/selectedYearStore";
import useMentorMenteeStore from "../../../stores/mentorMenteeStore";
const people = [
  {
    name: "Bian Lee",
    title: "Paradigm Representative",
    curr_role: "Admin",
    email: "janecooper@example.com",
    telephone: "+1-202-555-0170",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
  },
  {
    name: "Jane Cooper",
    title: "Paradigm Representative",
    curr_role: "Admin",
    email: "janecooper@example.com",
    telephone: "+1-202-555-0170",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
  },
];

export default function ProfileCard() {
  const [people, setPeople] = useState([]);
  const [menteePeople, setMenteePeople] = useState([]);
  const router = useRouter();
  const searchTerm = useSearchStore((state) => state.searchTerm);
  const selectedMajor = useSelectedMajorStore((state) => state.selectedMajor);
  const selectedYear = useSelectedYearStore((state) => state.selectedYear);
  const currentSelection = useMentorMenteeStore(
    (state) => state.currentSelection
  );

  useEffect(() => {
    fetchMentors();
    fetchMentees();
  }, []);

  const fetchMentors = async () => {
    const { data, error } = await supabase.from("mentors").select("*");
    if (error) {
      console.error(`Error fetching ${table}:`, error);
      return;
    }
    setPeople(data);
  };
  const fetchMentees = async () => {
    const { data, error } = await supabase.from("mentees").select("*");
    if (error) {
      console.error(`Error fetching ${table}:`, error);
      return;
    }
    setMenteePeople(data);
  };

  const navigateToProfile = (item) => {
    // Programmatically navigate to the dynamic route
    router.push(`/people/${item.id}`);
  };

  const filteredPeople = people.filter(
    (person) =>
      (person.name.toLowerCase().includes(searchTerm) ||
        person.bio.toLowerCase().includes(searchTerm) ||
        person.curr_role.toLowerCase().includes(searchTerm) ||
        person.current_company.toLowerCase().includes(searchTerm)) &&
      (selectedMajor.name === "All Majors" ||
        person.major.toLowerCase() === selectedMajor.name.toLowerCase()) &&
      (selectedYear.name === "All Years" ||
        person.grad_year === selectedYear.name)
  );

  const filetredMenteePeople = menteePeople.filter(
    (person) =>
      (person.name.toLowerCase().includes(searchTerm) ||
        person.bio.toLowerCase().includes(searchTerm) ||
        person.curr_role.toLowerCase().includes(searchTerm) ||
        person.current_company.toLowerCase().includes(searchTerm)) &&
      (selectedMajor.name === "All Majors" ||
        person.major.toLowerCase() === selectedMajor.name.toLowerCase()) &&
      (selectedYear.name === "All Years" ||
        person.grad_year === selectedYear.name)
  );

  console.log(people);
  console.log(selectedMajor);
  return (
    <>
      <ul
        curr_role="list"
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 px-5"
      >
        {currentSelection == "Mentors" ? (
          <>
            {filteredPeople.map((person) => (
              <li
                key={person.id}
                onClick={() => navigateToProfile(person)}
                className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center  cursor-pointer border border-gray-300 hover:bg-gray-50 hover:border-gray-400"
              >
                <div className="flex flex-1 flex-col p-8">
                  <img
                    className="mx-auto h-24 w-24 flex-shrink-0 rounded-full"
                    src={person.pfp_url}
                    alt=""
                  />
                  <h3 className="mt-3 text-lg font-medium text-gray-900">
                    {person.name}
                  </h3>
                  <dl className="flex flex-grow flex-col justify-between">
                    <dd className="text-md text-gray-500">
                      {person.curr_role} @ {person.current_company}
                    </dd>
                    <p className="line-clamp text-left text-sm">{person.bio}</p>
                    <dd className="mt-3">
                      <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                        {person.major}
                      </span>
                      <span className="ml-1 inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                        {person.grad_year}
                      </span>
                    </dd>
                  </dl>
                </div>
              </li>
            ))}
          </>
        ) : (
          <>
            {filetredMenteePeople.map((person) => (
              <li
                key={person.id}
                onClick={() => navigateToProfile(person)}
                className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center  cursor-pointer border border-gray-300 hover:bg-gray-50 hover:border-gray-400"
              >
                <div className="flex flex-1 flex-col p-8">
                  <img
                    className="mx-auto h-24 w-24 flex-shrink-0 rounded-full"
                    src={person.pfp_url || "default.jpeg"} // Use default image if pfp_url is not available
                    alt=""
                  />
                  <h3 className="mt-3 text-lg font-medium text-gray-900">
                    {person.name}
                  </h3>
                  <dl className="flex flex-grow flex-col justify-between">
                    <dd className="text-md text-gray-500">
                      {person.curr_role} @ {person.current_company}
                    </dd>
                    <p className="line-clamp text-left text-sm">{person.bio}</p>
                    <dd className="mt-3">
                      <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                        {person.major}
                      </span>
                      <span className="ml-1 inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                        {person.grad_year}
                      </span>
                    </dd>
                  </dl>
                </div>
              </li>
            ))}
          </>
        )}
      </ul>
    </>
  );
}
