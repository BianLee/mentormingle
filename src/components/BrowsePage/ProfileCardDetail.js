import { PaperClipIcon } from "@heroicons/react/20/solid";
import React, { useState, useEffect } from "react";
import useMentorMenteeStore from "../../../stores/mentorMenteeStore";
import { supabase } from "../../utils/supabaseClient";
import useAuthStore from "../../../stores/authStore";
import useInitializeAuth from "../../../src/hooks/authHook";

const ProfileCardDetail = ({ id }) => {
  useInitializeAuth();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState([]);
  const [messages, setMessages] = useState([]);

  const currentSelection = useMentorMenteeStore(
    (state) => state.currentSelection
  );
  const { isAuthenticated, setAuth } = useAuthStore((state) => ({
    isAuthenticated: state.isAuthenticated,
    setAuth: state.setAuth,
  }));
  const user = useAuthStore((state) => state.user);

  const handleInserts = (payload) => {
    console.log("New message received!", payload);
    setMessages((prevMessages) => [...prevMessages, payload.new]);
  };

  // Setup real-time subscription inside a useEffect to avoid multiple subscriptions
  useEffect(() => {
    const subscription = supabase
      .channel("realtime:public:messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        handleInserts
      )
      .subscribe();
  }, []);

  console.log(isAuthenticated);
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return; // Prevent sending an empty message

    const senderId = user.id;
    const recipientId = id; // Assuming 'id' is the mentor's ID

    console.log("senderId: " + senderId);
    console.log("recipientId: " + recipientId);

    try {
      const { data, error } = await supabase.from("messages").insert([
        {
          sender_id: senderId,
          recipient_id: recipientId,
          message_text: message,
        },
      ]);

      if (error) throw error;

      // Optionally reset the message input and show a success message
      setMessage("");
      // alert("Message sent successfully!");
    } catch (error) {
      console.error("Error sending message:", error.message);
    }
  };

  async function fetchMessages() {
    if (!user || !id) return; // Ensure user and id are available

    try {
      // Update the query to fetch messages where the current user is either the sender or recipient, and the profile ID matches the other party
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        // Filter for messages between the current user and the profile ID
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .or(`sender_id.eq.${id},recipient_id.eq.${id}`);

      if (error) throw error;
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error.message);
    }
  }

  useEffect(() => {
    fetchMessages();
  }, [user, id]); // Fetch messages when the user or profile ID changes

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

  const isOwnProfile = user?.id === id;

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
      {!isOwnProfile && user && user.id && (
        <>
          <div className="mt-4">Chatroom with {detail.name}</div>
          <div className="mt-4 px-4 py-3 sm:px-6 border-2 rounded-lg">
            {/* <h2 className="text-lg mb-4">Messages</h2> */}
            <div className="max-h-full overflow-y-auto">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg  mb-2 ${
                    message.sender_id === user.id
                      ? "bg-blue-100 ml-auto"
                      : "bg-gray-100 mr-auto"
                  }`}
                  style={{
                    maxWidth: "60%",
                    marginLeft: message.sender_id === user.id ? "auto" : "0",
                    marginRight: message.sender_id === user.id ? "0" : "auto",
                    textAlign: message.sender_id === user.id ? "right" : "left",
                  }}
                >
                  <p className="text-gray-800">{message.message_text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="px-4 py-6 sm:px-6">
            <form onSubmit={sendMessage} className="flex flex-col gap-4">
              <textarea
                className="p-3 w-full h-24 border border-gray-300 rounded-md focus:outline-none"
                placeholder="Write a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  // Check for the Enter key without the Shift key
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault(); // Prevent the default behavior (new line)
                    sendMessage(e); // Submit the form
                  }
                }}
              ></textarea>
              <button
                type="submit"
                className="self-end px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md shadow"
              >
                Send Message
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileCardDetail;
