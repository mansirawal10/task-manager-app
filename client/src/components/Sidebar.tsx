'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faCheckCircle,
  faSpinner,
  faClock,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

const menuItems = [
  { name: "Dashboard", link: "/dashboard", icon: faTachometerAlt },
  { name: "Completed", link: "/completed", icon: faCheckCircle },
  { name: "In Progress", link: "/in-progress", icon: faSpinner },
  { name: "Not Started", link: "/not-started", icon: faClock },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleSidebar}
          className="text-gray-900 bg-white rounded-full p-2 shadow focus:outline-none"
        >
          <FontAwesomeIcon icon={isSidebarOpen ? faTimes : faBars} size="lg" />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          w-64 bg-white text-gray-900 min-h-screen p-6 shadow-lg fixed top-0 left-0 z-40
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:relative md:translate-x-0
        `}
      >
        <h2 className="text-2xl font-bold mb-8 tracking-wide">TaskMe</h2>
        <ul className="space-y-4">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.link}
                onClick={() => setIsSidebarOpen(false)} // Close sidebar on mobile when a link is clicked.
                className={`group flex items-center gap-3 px-4 py-3 rounded-md transition-colors duration-200 ${
                  pathname === item.link
                    ? "bg-blue-500 text-white"
                    : "text-gray-900 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                <FontAwesomeIcon
                  icon={item.icon}
                  size="lg"
                  className="transition-colors duration-200 group-hover:text-blue-600"
                />
                <span className="transition-colors duration-200 group-hover:text-blue-600">
                  {item.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      {/* Overlay shown on mobile when sidebar is open */}
      {isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
        ></div>
      )}
    </>
  );
}