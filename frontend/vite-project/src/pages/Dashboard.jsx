import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, Send, Phone, Video, MoreVertical } from "lucide-react";
import { getAllUser, getMessages, sendMessage } from "../utils/functions";
import Sidebar from "../component/Sidebar";
import socket from "../utils/socket";

export function Dashboard() {
  const [messageInput, setMessageInput] = useState("");
  const [currentChat, setCurrentChat] = useState(
    localStorage.getItem("receiver") || ""
  );
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const messagesEndRef = useRef(null);

  // Scroll to the bottom whenever messages change or on first load....
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const fetchUsers = async () => {
    try {
      const usersList = await getAllUser();
      if (usersList) setUsers(usersList);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const fetchMessages = async () => {
    console.log({ currentChat }, localStorage.getItem("receiver"));
    try {
      const payload = {
        sender: user?._id,
        receiver: currentChat ? currentChat : localStorage.getItem("receiver"),
      };
      console.log({ payload });
      const messagesData = await getMessages(payload);
      console.log({ messagesData });
      if (messagesData) setMessages(messagesData);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !currentChat) return;

    const message = {
      sender: user._id,
      content: messageInput,
      receiver: currentChat,
    };

    try {
      const response = await sendMessage(message);
      if (response) {
        socket.emit("newMessage");
        setMessageInput("");
        fetchMessages();
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  useEffect(() => {
    fetchUsers();

    // Socket event listeners
    socket.on("updateUserStatus", () => {
      console.log("login event triggered");
      fetchUsers();
    });
    socket.on("messageReceived", () => {
      console.log("Message received event triggered");
      fetchMessages();
    });
  }, []);

  useEffect(() => {
    if (currentChat) {
      localStorage.setItem("receiver", currentChat);
      fetchMessages();
    }
  }, [currentChat]);

  const handleChatChange = (userId) => {
    setCurrentChat(userId);
    localStorage.setItem("receiver", userId);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        user={user}
        users={users}
        currentChat={currentChat}
        onChatChange={handleChatChange}
      />

      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-white">
          {currentChat ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">
                    {users
                      .find((u) => u._id === currentChat)
                      ?.username[0]?.toUpperCase() || "?"}
                  </span>
                </div>
                <div className="ml-4">
                  <h2 className="font-semibold text-gray-800">
                    {users.find((u) => u._id === currentChat)?.username ||
                      "Unknown"}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {users.find((u) => u._id === currentChat)?.status ||
                      "Offline"}
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
          ) : (
            <div className="text-center text-gray-500">
              Select a user to start chatting
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {messages.length > 0 ? (
            <>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message._id}
                    className={`flex ${
                      message.sender === user._id
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg px-4 py-2 ${
                        message.sender === user._id
                          ? "bg-blue-500 text-white"
                          : "bg-white text-gray-800 border border-gray-200"
                      }`}
                    >
                      <p>{message.content}</p>
                      <p className="text-xs mt-1 opacity-75">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div ref={messagesEndRef} />
            </>
          ) : (
            <div className="text-center text-gray-500">No messages yet</div>
          )}
        </div>

        {currentChat && (
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
        )}
      </div>
    </div>
  );
}
