import React, { useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../Firebase";

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const provider = new GoogleAuthProvider();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const saveToDb = async (e) => {
    e.preventDefault();
    try {
      console.log(formData);
      const response = await axios.post(
        "http://localhost:9000/register",
        formData
      );
      console.log("Data saved successfully:", response.data);
      localStorage.setItem("jwt", response.data);
      localStorage.setItem("logout", "false");
      navigate("/home");
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const googleAuth = async (e) => {
    e.preventDefault();
    try {
      const res = await signInWithPopup(auth, provider);
      const response = await axios.post(
        "http://localhost:9000/google/register",
        {
          firstName: res.user.displayName,
          email: res.user.email,
        }
      );
      localStorage.setItem("jwt", response.data);
      localStorage.setItem("logout", "false");
      navigate("/home");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar page={"signup"} />
      <div className="flex flex-col justify-center max-w-md mx-auto mt-8">
        <div>
          <h1 className="text-xl font-semibold text-blue-500 md:text-2xl">
            Signup
          </h1>
        </div>
        <div className="flex flex-col p-5 mt-5 space-y-4 border-2 border-blue-500 rounded-lg">
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="border-[1px] border-gray-300 py-1.5 px-2 outline-none"
            placeholder="First Name"
          />
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="border-[1px] border-gray-300 py-1.5 px-2 outline-none"
            placeholder="Last Name"
          />
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="border-[1px] border-gray-300 py-1.5 px-2 outline-none"
            placeholder="Email"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="border-[1px] border-gray-300 py-1.5 px-2 outline-none"
            placeholder="Password"
          />
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="border-[1px] border-gray-300 py-1.5 px-2 outline-none"
            placeholder="Confirm Password"
          />
          <button
            onClick={saveToDb}
            className="py-2 font-semibold text-center text-white bg-blue-500 rounded-md"
          >
            Signup
          </button>
          <p className="font-semibold text-center">
            Already have an account?{" "}
            <span className="text-blue-500">Login</span>
          </p>
          <button
            onClick={googleAuth}
            className="py-2 text-center text-white bg-blue-500 rounded-md"
          >
            Sign up with Google
          </button>
        </div>
      </div>
    </>
  );
}
