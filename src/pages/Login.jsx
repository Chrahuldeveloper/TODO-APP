import React from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../Firebase";

export default function Login() {
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();

  const loginGoogle = async (e) => {
    e.preventDefault();
    await signInWithPopup(auth, provider);
    localStorage.setItem("logout", false);
    navigate("/home");
  };

  const login = async (e) => {
    e.preventDefault();
    localStorage.setItem("logout", false);
    navigate("/home");
  };

  return (
    <>
      <Navbar page={"login"} />
      <div className="flex flex-col justify-center max-w-md mx-auto mt-8 ">
        <div>
          <h1 className="text-xl font-semibold text-blue-500 md:text-2xl">
            Login
          </h1>
        </div>
        <form className="flex flex-col p-5 mt-5 space-y-4 border-2 border-blue-500 rounded-lg">
          <input
            type="text"
            className="border-[1px] border-gray-300 py-1.5 px-2 outline-none"
            placeholder="Name"
          />
          <input
            type="text"
            className="border-[1px] border-gray-300 py-1.5 px-2 outline-none"
            placeholder="email"
          />
          <button
            onClick={login}
            className="py-2 font-semibold text-center text-white bg-blue-500 rounded-md "
          >
            Login
          </button>
          <p className="font-semibold text-center ">
            Didn't have a account <span className="text-blue-500">Login</span>
          </p>
          <button
            onClick={loginGoogle}
            className="py-2 text-center text-white bg-blue-500 rounded-md "
          >
            Login with Google
          </button>
        </form>
      </div>
    </>
  );
}
