import React from "react";
import { BiTask } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

export default function Navbar({ page }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.setItem("logout", "true");
    navigate("/login");
  };

  return (
    <nav className="px-5 py-3 text-white bg-blue-500">
      <div
        className={`flex justify-between items-center ${
          page === "home" ? "px-20" : ""
        }`}
      >
        <div>
          <BiTask color="white" size={28} />
        </div>
        <div className="hidden space-x-5 md:block">
          {page === "login" && (
            <button className="py-2 font-semibold text-blue-500 bg-white rounded-lg px-7">
              Login
            </button>
          )}
          {page === "signup" && (
            <button className="py-2 font-semibold text-blue-500 bg-white rounded-lg px-7">
              Signup
            </button>
          )}
        </div>
        {page === "home" && (
          <div>
            <button
              onClick={handleLogout}
              className="py-2 font-semibold text-white bg-red-500 rounded-lg px-7"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
