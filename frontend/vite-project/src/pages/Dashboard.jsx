import React, { useState } from "react";
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

export function Dashboard() {
  const navigate = useNavigate();
  const [currentChat, setCurrentChat] = useState(1);
  const [messageInput, setMessageInput] = useState("");
  const user = localStorage.getItem("user");

  const contacts = [
    {
      id: 1,
      name: "Sarah Wilson",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      lastMessage: "See you tomorrow!",
      time: "12:30 PM",
      unread: 2,
    },
    {
      id: 2,
      name: "James Rodriguez",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
      lastMessage: "How's the project going?",
      time: "11:45 AM",
    },
    {
      id: 3,
      name: "Emma Thompson",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
      lastMessage: "Thanks for your help!",
      time: "Yesterday",
    },
  ];

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

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    // Here you would typically send the message to your backend
    setMessageInput("");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-800">Messages</h1>
              <span className="ml-2 text-sm text-gray-600">({user})</span>
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
              placeholder="Search messages"
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-140px)]">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => setCurrentChat(contact.id)}
              className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 ${
                currentChat === contact.id ? "bg-blue-50" : ""
              }`}
            >
              <img
                src={contact.avatar}
                alt={contact.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="ml-4 flex-1">
                <div className="flex justify-between items-center">
                  <h2 className="font-semibold text-gray-800">
                    {contact.name}
                  </h2>
                  <span className="text-sm text-gray-500">{contact.time}</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600 truncate">
                    {contact.lastMessage}
                  </p>
                  {contact.unread && (
                    <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                      {contact.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img
                src={contacts[0].avatar}
                alt={contacts[0].name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="ml-4">
                <h2 className="font-semibold text-gray-800">
                  {contacts[0].name}
                </h2>
                <p className="text-sm text-gray-500">Online</p>
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
