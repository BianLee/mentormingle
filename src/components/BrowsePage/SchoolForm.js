import { Fragment, useState, useEffect } from "react";
import { Listbox, Transition } from "@headlessui/react";
import useMentorMenteeStore from "../../../stores/mentorMenteeStore";
import { supabase } from "../../utils/supabaseClient";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import useSelectedMajorStore from "../../../stores/selectedMajorStore";
import useSelectedYearStore from "../../../stores/selectedYearStore";
import { Allan } from "next/font/google";
import SearchBar from "./SearchBar";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function SchoolForm() {
  const { selectedMajor, setSelectedMajor } = useSelectedMajorStore();
  const { selectedYear, setSelectedYear } = useSelectedYearStore();

  const [majors, setMajors] = useState([{ id: 0, name: "All Majors" }]); // Default value
  const [years, setYears] = useState([{ id: 0, name: "All Years" }]); // Default value
  const [selected, setSelected] = useState(
    selectedMajor || { id: 0, name: "All Majors" }
  );
  const [selectedYearLocal, setSelectedYearLocal] = useState(
    selectedYear || { id: 0, name: "All Years" }
  );
  const currentSelection = useMentorMenteeStore(
    (state) => state.currentSelection
  );
  useEffect(() => {
    console.log(currentSelection);
    const fetchMajors = async () => {
      var value = "";
      if (currentSelection == "Mentees") {
        value = "mentees";
      } else {
        value = "mentors";
      }
      let { data, error } = await supabase.from(value).select("major");
      if (error) {
        console.error("Error fetching majors:", error);
        return;
      }
      // Use reduce to create a distinct list of majors
      const distinctMajors = data.reduce((acc, { major }) => {
        const exists = acc.some((item) => item.name === major);
        if (!exists) {
          acc.push({ id: acc.length + 1, name: major });
        }
        return acc;
      }, []);

      setMajors([{ id: 0, name: "All Majors" }, ...distinctMajors]);

      let { data: yearData, error: yearError } = await supabase
        .from(value)
        .select("grad_year");
      if (yearError) {
        console.error("Error fetching graduation years:", yearError);
        return;
      }
      // Adjust this to match your actual data structure
      const distinctYears = yearData.reduce((acc, { grad_year }) => {
        const exists = acc.some((item) => item.name === grad_year);
        if (!exists) {
          acc.push({ id: acc.length + 1, name: grad_year });
        }
        return acc;
      }, []);
      setYears([{ id: 0, name: "All Years" }, ...distinctYears]);
    };

    fetchMajors();
  }, [currentSelection]);

  useEffect(() => {
    setSelected(selectedMajor);
  }, [selectedMajor]);

  const handleChange = (newMajor) => {
    setSelected(newMajor);
    setSelectedMajor(newMajor); // Update the global state with the new selection
  };

  const handleChangeYear = (newYear) => {
    setSelectedYearLocal(newYear);
    setSelectedYear(newYear);
  };

  return (
    <>
      <Listbox value={selectedYear} onChange={handleChangeYear}>
        {({ open }) => (
          <>
            <div className="relative mr-2">
              <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2  sm:text-sm sm:leading-6">
                <span className="block truncate">{selectedYearLocal.name}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>

              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options
                  className="absolute z-10 mt-1 max-h-60 w-64 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                  style={{ maxHeight: "15rem", overflowY: "auto" }} // Explicit inline styles for scrolling
                >
                  {years.map((year, index) => (
                    <Listbox.Option
                      key={index}
                      className={({ active }) =>
                        classNames(
                          active ? "bg-indigo-600 text-white" : "text-gray-900",
                          "relative cursor-default select-none py-2 pl-3 pr-9"
                        )
                      }
                      value={year}
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={classNames(
                              selected ? "" : "font-normal",
                              "block truncate"
                            )}
                          >
                            {year.name}
                          </span>

                          {selected ? (
                            <span
                              className={classNames(
                                active ? "text-white" : "text-indigo-600",
                                "absolute inset-y-0 right-0 flex items-center pr-4"
                              )}
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </>
        )}
      </Listbox>{" "}
      <Listbox value={selected} onChange={handleChange}>
        {({ open }) => (
          <>
            <div className="relative mr-5">
              <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2  sm:text-sm sm:leading-6">
                <span className="block truncate">{selected.name}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>

              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options
                  className="absolute z-10 mt-1 max-h-60 w-64 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                  style={{ maxHeight: "15rem", overflowY: "auto" }} // Explicit inline styles for scrolling
                >
                  {majors.map((major, index) => (
                    <Listbox.Option
                      key={index}
                      className={({ active }) =>
                        classNames(
                          active ? "bg-indigo-600 text-white" : "text-gray-900",
                          "relative cursor-default select-none py-2 pl-3 pr-9"
                        )
                      }
                      value={major}
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={classNames(
                              selected ? "" : "font-normal",
                              "block truncate"
                            )}
                          >
                            {major.name}
                          </span>

                          {selected ? (
                            <span
                              className={classNames(
                                active ? "text-white" : "text-indigo-600",
                                "absolute inset-y-0 right-0 flex items-center pr-4"
                              )}
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </>
        )}
      </Listbox>
    </>
  );
}
