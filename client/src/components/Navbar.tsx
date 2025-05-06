'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

interface Notification {
  _id: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function Navbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [username, setUsername] = useState("User");

  // Retrieve the stored username when the component mounts.
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    console.log("Stored Username:", storedUsername);
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  // Function to fetch notifications.
  


  return (
    <nav className="bg-white shadow-md px-6 py-3 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Search Input */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search tasks..."
            className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Right Container */}
        <div className="flex items-center space-x-6 ml-4">
          {/* Notifications Button */}
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative focus:outline-none"
          >
            <FontAwesomeIcon
              icon={faBell}
              size="lg"
              className="text-gray-700"
            />
            {notificationsCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {notificationsCount}
              </span>
            )}
          </button>

          {/* Welcome Message (hidden on extra-small screens) */}
          <p className="text-gray-700 font-medium hidden sm:block">
            Welcome, {username}
          </p>
        </div>
      </div>

      
    </nav>
  );
}