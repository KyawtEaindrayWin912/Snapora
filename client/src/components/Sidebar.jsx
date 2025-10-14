import React, { useState } from "react";
import {
  Home,
  Search,
  PlusSquare,
  User,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Home", icon: Home, link: "/home" },
    { name: "Search", icon: Search, link: "/search" },
    { name: "Create", icon: PlusSquare, link: "/create-post" },
    { name: "Profile", icon: User, link: "/profile" },
    { name: "Settings", icon: Settings, link: "/edit-profile" },
  ];

  return (
    <>
      <div className="lg:hidden flex justify-between items-center p-4 border-b border-gray-200 bg-white fixed top-0 left-0 w-full z-50">
        <h1 className="text-3xl font-extrabold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
          Snapora
        </h1>
        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <div
        className={`
          fixed lg:static left-0 bg-white border-r border-gray-200 flex flex-col justify-between z-40
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          w-64 sm:w-56
          top-[64px] lg:top-0 h-[calc(100%-64px)] lg:h-full
        `}
      >
        <div className="hidden lg:flex p-6 items-center justify-center">
          <h1 className="text-5xl font-extrabold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
            Snapora
          </h1>
        </div>

        <nav className="mt-6 flex-grow overflow-y-auto">
          <ul className="list-none p-0">
            {navItems.map((item) => (
              <li key={item.name} className="mb-3">
                <Link
                  to={item.link}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition-colors duration-200 text-gray-700"
                  onClick={() => setIsOpen(false)} 
                >
                  <item.icon size={24} className="text-gray-600" />
                  <span className="hidden sm:inline font-semibold text-lg">
                    {item.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
