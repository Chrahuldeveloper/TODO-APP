import React from "react";
import { LuLoader2 } from "react-icons/lu";

export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center h-full bg-black bg-opacity-60 backdrop-blur-md">
      <LuLoader2 size={30} color="blue" className="animate-spin" />
    </div>
  );
}
