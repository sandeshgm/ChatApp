import React, { useState } from "react";
import { FaUserFriends, FaSearch } from "react-icons/fa";

export default function ChatPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Example user data (Replace with actual user data from API)
  const user = {
    name: "John Doe",
    profilePic: "", // Provide image URL if available, otherwise leave empty
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Navbar */}
      <div className="bg-white shadow-md p-4 flex justify-between items-center">
        <button className="p-2 bg-blue-500 text-white rounded-lg flex items-center">
          <FaSearch className="mr-2" /> Search
        </button>
        <button className="p-2 bg-green-500 text-white rounded-lg flex items-center">
          <FaUserFriends className="mr-2" /> Friends
        </button>

        {/* Profile Picture Button */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-10 h-10 rounded-full overflow-hidden border border-gray-300"
          >
            <img
              src={user.profilePic || "https://via.placeholder.com/40?text=👤"} // Default avatar
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-lg">
              <p className="px-4 py-2 font-semibold">{user.name}</p>
              <button className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                Profile
              </button>
              <button className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                Friends List
              </button>
              <button className="block w-full px-4 py-2 text-left hover:bg-red-100 text-red-500">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content (Friends List + Chat Window) */}
      <div className="flex flex-grow">
        {/* Friends List Sidebar */}
        <div className="w-1/4 bg-white shadow-md p-4">
          <h2 className="text-lg font-semibold mb-2">Chats</h2>
          <div className="space-y-2">
            {["Friend 1", "Friend 2", "Group 1", "Friend 3", "Group 2"].map(
              (name, index) => (
                <button
                  key={index}
                  className="block w-full p-3 bg-gray-200 rounded-lg text-left hover:bg-gray-300"
                >
                  {name}
                </button>
              )
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 bg-white shadow-md p-4 flex flex-col">
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Click on a friend or group to start chatting
          </div>
          <div className="p-3 bg-gray-200 rounded-lg mt-4">
            <input
              type="text"
              placeholder="Type a message..."
              className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
