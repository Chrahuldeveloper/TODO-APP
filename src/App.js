import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Register, Login, Home } from "./pages/index";

export default function App() {
  const jwt = localStorage.getItem("jwt");
  const logout = localStorage.getItem("logout");

  const navigate = useNavigate();

  useEffect(() => {
    if (jwt && logout === "false") {
      navigate("/home");
    } else if (!jwt || logout === "true") {
      navigate("/login");
    } else {
      navigate("/");
    }
  }, [jwt, logout]);

  return (
    <Routes>
      {jwt && logout === "false" ? (
        <Route path="/home" element={<Home />} />
      ) : (
        <>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </>
      )}
    </Routes>
  );
}
