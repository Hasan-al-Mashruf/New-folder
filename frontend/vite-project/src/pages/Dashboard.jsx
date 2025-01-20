import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MessageCircle,
  Send,
  Phone,
  Video,
  MoreVertical,
  Search,
  Settings,
  LogOut,
} from "lucide-react";
import { getAllUser } from "../utils/functions";
import Sidebar from "../component/Sidebar";
import socket from "../utils/socket";
export function Dashboard() {
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const [currentChat, setCurrentChat] = useState(1);
  const [messageInput, setMessageInput] = useState("");
  const [users, setUsers] = useState([]);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchUsers = async () => {
    try {
      const usersList = await getAllUser();
      if (usersList) {
        setUsers(usersList);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [loader]);

  const messages = [
    {
      id: 1,
      text: "Hey, how are you?",
      sender: "other",
      timestamp: "12:00 PM",
    },
    {
      id: 2,
      text: "I'm good, thanks! How about you?",
      sender: "me",
      timestamp: "12:02 PM",
    },
    {
      id: 3,
      text: "Great! Are we still meeting tomorrow?",
      sender: "other",
      timestamp: "12:05 PM",
    },
    {
      id: 4,
      text: "Yes, absolutely! Same time?",
      sender: "me",
      timestamp: "12:07 PM",
    },
    {
      id: 5,
      text: "Perfect, see you tomorrow!",
      sender: "other",
      timestamp: "12:08 PM",
    },
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    // Here you would typically send the message to your backend
    setMessageInput("");
  };

  useEffect(() => {
    socket.on("updateUserStatus", () => {
      fetchUsers();
    });
  }, [socket]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        user={user}
        users={users}
        currentChat={currentChat}
        setCurrentChat={setCurrentChat}
      />
      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-semibold">
                  {users
                    .find((u) => u._id === currentChat)
                    ?.username.charAt(0)
                    .toUpperCase() || "?"}
                </span>
              </div>
              <div className="ml-4">
                <h2 className="font-semibold text-gray-800">
                  {users.find((u) => u._id === currentChat)?.username ||
                    "Select a user"}
                </h2>
                <p className="text-sm text-gray-500">
                  {users.find((u) => u._id === currentChat)?.status || ""}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Phone size={20} className="text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Video size={20} className="text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <MoreVertical size={20} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "me" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 ${
                    message.sender === "me"
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-800 border border-gray-200"
                  }`}
                >
                  <p>{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === "me"
                        ? "text-blue-100"
                        : "text-gray-500"
                    }`}
                  >
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <form
          onSubmit={handleSendMessage}
          className="p-4 bg-white border-t border-gray-200"
        >
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Send size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
