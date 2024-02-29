import { Fragment, useState, useEffect } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { supabase } from "../../utils/supabaseClient";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import useSelectedMajorStore from "../../../stores/selectedMajorStore";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function SchoolForm() {
  const { selectedMajor, setSelectedMajor } = useSelectedMajorStore();
  const [majors, setMajors] = useState([{ id: 0, name: "All Majors" }]); // Default value
  const [selected, setSelected] = useState(
    selectedMajor || { id: 0, name: "All Majors" }
  );

  useEffect(() => {
    const fetchMajors = async () => {
      let { data, error } = await supabase.from("mentors").select("major");

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
    };

    fetchMajors();
  }, []);

  useEffect(() => {
    setSelected(selectedMajor);
  }, [selectedMajor]);

  const handleChange = (newMajor) => {
    setSelected(newMajor);
    setSelectedMajor(newMajor); // Update the global state with the new selection
  };

  return (
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
                            selected ? "font-semibold" : "font-normal",
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
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
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
  );
}
