import { PaperClipIcon } from "@heroicons/react/20/solid";
import React, { useState, useEffect } from "react";
import useMentorMenteeStore from "../../../stores/mentorMenteeStore";
import { supabase } from "../../utils/supabaseClient";
const ProfileCardDetail = ({ id }) => {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentSelection = useMentorMenteeStore(
    (state) => state.currentSelection
  );
  useEffect(() => {
    console.log(currentSelection);
    var value = "";
    if (currentSelection == "Mentees") {
      value = "mentees";
    } else if (currentSelection == "Mentors") {
      value = "mentors";
    }
    const fetchData = async () => {
      if (!id) return; // If no ID is provided, don't attempt to fetch data
      try {
        setLoading(true);
        const { data: mentorData, error: mentorError } = await supabase
          .from(value) // Assuming 'mentors' is the correct table name
          .select("*")
          .eq("id", id)
          .single(); // Assuming 'id' is a unique identifier
        if (mentorError) {
          throw mentorError;
        }
        setDetail(mentorData);
      } catch (error) {
        console.error("Error fetching data:", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading)
    return (
      <>
        {" "}
        <div className="flex justify-center items-center mt-10">
          <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </>
    );
  return (
    <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
      <div className="overflow-hidden bg-white sm:rounded-lg mt-5">
        <div className="px-4 py-6 sm:px-6">
          <h3 className="text-base  leading-7 text-gray-900">
            {detail && <h1 className="text-lg">{detail.name}</h1>}
          </h3>
          {/*
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
            Personal details and application.
          </p>
           */}
        </div>
        <div className="border-t border-gray-100">
          <dl className="">
            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-900">Full name</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {detail && <div>{detail.name}</div>}
              </dd>
            </div>
            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-900">
                Current Company
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {detail && <div>{detail.current_company}</div>}
              </dd>
            </div>
            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-900">
                College Major
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {detail && <div>{detail.major}</div>}
              </dd>
            </div>
            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-900">
                Current Title
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {detail && <div>{detail.curr_role}</div>}
              </dd>
            </div>
            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-900">About</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {detail && <div>{detail.bio}</div>}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default ProfileCardDetail;
