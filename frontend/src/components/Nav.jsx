import React, { useContext, useState } from "react";
import { IoMdLogIn } from "react-icons/io";
import { FiMenu, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
import userContext from "../context/userContext";

function Nav() {
  const [menuOpen, setMenuOpen] = useState(false); // For mobile menu
  const [profileOpen, setProfileOpen] = useState(false); // For profile dropdown
  const { user, logout } = useContext(userContext); // Assume `logout` is a function in the context

  return (
    <header className="w-full bg-pale font-poppins fixed top-0 z-10 shadow-md">
      <div className="flex justify-between items-center px-6 py-3">
        {/* Logo Section */}
        <div className="flex items-center">
          <img
            src="assist/LogoBlack.svg"
            alt="RiddleX Logo"
            className="w-12 h-12"
          />
          <h1 className="text-2xl font-bold ml-2 text-gray-800">RiddleX</h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {!user ? (
            <button className="flex items-center space-x-2 px-4 py-2 bg-light hover:bg-primary hover:text-white rounded-full shadow transition-all duration-300">
              <IoMdLogIn className="text-2xl" />
              <Link to="/login" className="font-medium">
                Login / Sign Up
              </Link>
            </button>
          ) : (
            <div className="relative">
              <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                <img
                  src={user.dpUrl}
                  alt="Profile"
                  className="h-10 w-10 rounded-full object-cover"
                />
                <p className="font-medium text-gray-800">{user.name}</p>
              </div>
              {profileOpen && (
                <div className="absolute right-0 mt-2 bg-white border rounded-md shadow-lg">
                  <button
                    onClick={logout}
                    className="block px-4 py-2 w-full text-left text-red-500 hover:bg-gray-100"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-3xl text-gray-800"
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <nav className="md:hidden bg-white w-full shadow-md">
          <ul className="flex flex-col items-center space-y-4 py-4">
            {!user ? (
              <li>
                <button className="flex items-center space-x-2 px-4 py-2 bg-light hover:bg-primary text-primary hover:text-white rounded-full shadow transition-all duration-300">
                  <IoMdLogIn className="text-2xl" />
                  <Link to="/login" className="font-medium">
                    Login / Sign Up
                  </Link>
                </button>
              </li>
            ) : (
              <>
                <li>
                  <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => setProfileOpen(!profileOpen)}
                  >
                    <img
                      src={user.dpUrl}
                      alt="Profile"
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <p className="font-medium text-gray-800">{user.name}</p>
                  </div>
                  {profileOpen && (
                    <div className="bg-white border rounded-md shadow-md mt-2">
                      <button
                        onClick={logout}
                        className="block px-4 py-2 w-full text-left text-red-500 hover:bg-gray-100"
                      >
                        Log Out
                      </button>
                    </div>
                  )}
                </li>
              </>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}

export default Nav;
