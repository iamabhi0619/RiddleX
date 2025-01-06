import React, { useContext, useState } from "react";
import { IoMdLogIn } from "react-icons/io";
import { FiMenu, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
import userContext from "../context/userContext";

function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useContext(userContext);

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
              <Link to={"/login"} className="font-medium">
                Login / Sign Up
              </Link>
            </button>
          ) : (
            <div className="flex items-center gap-3 text-xl">
              <img src={user.dpUrl} alt="" className="h-10"/> <p>{user.name}</p>
              
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
            <li>
              <button className="flex items-center space-x-2 px-4 py-2 bg-light hover:bg-primary text-primary hover:text-white rounded-full shadow transition-all duration-300">
                <IoMdLogIn className="text-2xl" />
                <span className="font-medium">Login / Sign Up</span>
              </button>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}

export default Nav;
