import { LogOut, Search, Settings } from "lucide-react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../utils/functions";
import { io } from "socket.io-client";
import socket from "../utils/socket";

const Sidebar = ({ user, users, currentChat, onChatChange }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (user?.username) {
      const isLogOutUser = await logoutUser({ username: user?.username });
      if (isLogOutUser) {
        socket.emit("userStatusSync");
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-800">Messages</h1>
            <span className="ml-2 text-sm text-gray-600">
              ({user.username})
            </span>
          </div>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Settings size={20} className="text-gray-600" />
            </button>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <LogOut size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search users"
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="overflow-y-auto h-[calc(100vh-140px)]">
        {users.map((contact) => (
          <div
            key={contact._id}
            onClick={() => onChatChange(contact._id)}
            className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 ${
              currentChat === contact._id ? "bg-blue-50" : ""
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-lg">
                {contact.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="ml-4 flex-1">
              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-gray-800">
                  {contact.username}
                </h2>
                <span className="text-sm text-gray-500">
                  {contact.status === "online" ? "Online" : "Offline"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
